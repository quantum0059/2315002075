declare const process: { env?: Record<string, string | undefined> } | undefined;

const allowedStacks = ['backend', 'frontend'] as const;
const backendPackages = [
  'cache',
  'controller',
  'cron_job',
  'db',
  'domain',
  'handler',
  'repository',
  'route',
  'service'
] as const;
const frontendPackages = [
  'api',
  'component',
  'hook',
  'page',
  'state',
  'style'
] as const;
const sharedPackages = ['auth', 'config', 'middleware', 'utils'] as const;

export type Stack = (typeof allowedStacks)[number];
export type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type BackendPackageName = (typeof backendPackages)[number];
export type FrontendPackageName = (typeof frontendPackages)[number];
export type SharedPackageName = (typeof sharedPackages)[number];

export type StackPackageNameMap = {
  backend: BackendPackageName | SharedPackageName;
  frontend: FrontendPackageName | SharedPackageName;
};

export type StackPackageName = StackPackageNameMap[keyof StackPackageNameMap];

export interface LoggingConfig {
  apiUrl?: string;
  authToken?: string;
  refreshToken?: string;
  refreshUrl?: string;
  timeoutMs?: number;
  maxRetries?: number;
}

interface LogPayload {
  timestamp: string;
  stack: Stack;
  level: Level;
  packageName: StackPackageName;
  message: string;
  runtimeContext: {
    environment: string;
    platform: string;
  };
}

interface RefreshResponse {
  accessToken?: string | null;
  refreshToken?: string | null;
}

interface HttpRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: string;
  timeoutMs: number;
}

const defaultConfig: Required<LoggingConfig> = {
  apiUrl: '',
  authToken: '',
  refreshToken: '',
  refreshUrl: '',
  timeoutMs: 5000,
  maxRetries: 2
};

const state = {
  config: { ...defaultConfig },
  refreshPromise: null as Promise<string | undefined> | null
};

function getEnvironmentValue(name: string): string | undefined {
  if (typeof process !== 'undefined' && typeof process.env !== 'undefined') {
    return process.env[name];
  }

  return undefined;
}

async function performFetch(
  url: string,
  options: HttpRequestOptions
): Promise<{ status: number; data: unknown; headers: Record<string, string> }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs);

  try {
    const response = await fetch(url, {
      method: options.method,
      headers: options.headers,
      body: options.body,
      signal: controller.signal
    });

    let data: unknown = null;
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      data = await response.json().catch(() => null);
    } else if (response.body) {
      data = await response.text().catch(() => null);
    }

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value: string, key: string) => {
      responseHeaders[key] = value;
    });

    return {
      status: response.status,
      data,
      headers: responseHeaders
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

function applyConfig(overrides: Partial<LoggingConfig>): void {
  state.config = {
    ...state.config,
    ...overrides
  };
}

function initializeFromEnvironment(): void {
  applyConfig({
    apiUrl: getEnvironmentValue('LOGGING_MIDDLEWARE_API_URL') ?? state.config.apiUrl,
    authToken: getEnvironmentValue('LOGGING_MIDDLEWARE_AUTH_TOKEN') ?? state.config.authToken,
    refreshToken: getEnvironmentValue('LOGGING_MIDDLEWARE_REFRESH_TOKEN') ?? state.config.refreshToken,
    refreshUrl: getEnvironmentValue('LOGGING_MIDDLEWARE_REFRESH_URL') ?? state.config.refreshUrl
  });
}

function isValidStack(value: unknown): value is Stack {
  return typeof value === 'string' && allowedStacks.includes(value as Stack);
}

function isValidLevel(value: unknown): value is Level {
  return (
    typeof value === 'string' &&
    ['debug', 'info', 'warn', 'error', 'fatal'].includes(value)
  );
}

function isValidPackageName(stack: Stack, value: unknown): value is StackPackageName {
  if (typeof value !== 'string') {
    return false;
  }

  if (sharedPackages.includes(value as SharedPackageName)) {
    return true;
  }

  if (stack === 'backend') {
    return backendPackages.includes(value as BackendPackageName);
  }

  if (stack === 'frontend') {
    return frontendPackages.includes(value as FrontendPackageName);
  }

  return false;
}

function getRuntimeContext(): LogPayload['runtimeContext'] {
  const environment =
    getEnvironmentValue('NODE_ENV') ||
    (typeof process !== 'undefined' && process.env?.NODE_ENV) ||
    'production';

  const platform =
    typeof globalThis !== 'undefined' && 'window' in globalThis ? 'browser' : 'node';

  return {
    environment,
    platform
  };
}

function isAuthError(status: number): boolean {
  return status === 401 || status === 403;
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || (status >= 500 && status < 600);
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof TypeError) {
    const message = error.message.toLowerCase();
    return message.includes('network') || message.includes('fetch');
  }
  return false;
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function safeConsoleLog(level: Level, message: string, error?: unknown): void {
  if (typeof console === 'undefined') {
    return;
  }

  const payload = { message, error: error instanceof Error ? error.message : error };

  switch (level) {
    case 'debug':
      console.debug?.('[LoggingMiddleware]', payload);
      break;
    case 'info':
      console.info?.('[LoggingMiddleware]', payload);
      break;
    case 'warn':
      console.warn?.('[LoggingMiddleware]', payload);
      break;
    default:
      console.error?.('[LoggingMiddleware]', payload);
  }
}

async function refreshAuthToken(): Promise<string | undefined> {
  if (state.refreshPromise) {
    return state.refreshPromise;
  }

  const refreshUrl = state.config.refreshUrl;
  const refreshToken = state.config.refreshToken;

  if (!refreshUrl || !refreshToken) {
    return undefined;
  }

  state.refreshPromise = (async () => {
    try {
      const payload = JSON.stringify({ refreshToken });

      const result = await performFetch(refreshUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        timeoutMs: state.config.timeoutMs
      });

      if (result.status >= 200 && result.status < 300) {
        const data = result.data as RefreshResponse;
        const accessToken = data?.accessToken;
        const nextRefreshToken = data?.refreshToken;

        if (typeof accessToken === 'string' && accessToken.trim()) {
          setAuthTokens(accessToken, nextRefreshToken ?? refreshToken);
          return accessToken;
        }
      }
    } catch (error) {
      safeConsoleLog('warn', 'Token refresh failed', error);
    }

    return undefined;
  })();

  try {
    return await state.refreshPromise;
  } finally {
    state.refreshPromise = null;
  }
}

async function sendLogPayload(payload: LogPayload): Promise<void> {
  const apiUrl = state.config.apiUrl;
  if (!apiUrl) {
    safeConsoleLog('warn', 'No logging endpoint configured. Falling back to console.', payload);
    return;
  }

  let attempt = 0;
  let lastError: unknown;

  while (attempt <= state.config.maxRetries) {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const accessToken = state.config.authToken;

      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const result = await performFetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        timeoutMs: state.config.timeoutMs
      });

      if (result.status >= 200 && result.status < 300) {
        return;
      }

      if (isAuthError(result.status)) {
        const refreshedToken = await refreshAuthToken();
        if (refreshedToken && attempt < state.config.maxRetries) {
          attempt += 1;
          await delay(200 * 2 ** (attempt - 1));
          continue;
        }
      }

      if (!isRetryableStatus(result.status) || attempt === state.config.maxRetries) {
        safeConsoleLog('warn', 'Log delivery failed after retries.', { status: result.status });
        return;
      }

      await delay(200 * 2 ** attempt);
      attempt += 1;
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error) || attempt === state.config.maxRetries) {
        safeConsoleLog('warn', 'Log delivery failed after retries.', error);
        return;
      }

      await delay(200 * 2 ** attempt);
      attempt += 1;
    }
  }

  safeConsoleLog('warn', 'Log delivery exhausted all retries.', lastError);
}

export function configureLogging(config: Partial<LoggingConfig>): void {
  applyConfig(config);
}

export function setAuthTokens(authToken: string, refreshToken: string): void {
  applyConfig({ authToken, refreshToken });
}

initializeFromEnvironment();

export async function Log<S extends Stack>(
  stack: S,
  level: Level,
  packageName: StackPackageNameMap[S],
  message: string
): Promise<void> {
  try {
    if (!isValidStack(stack)) {
      safeConsoleLog('warn', 'Invalid stack value. Expected backend or frontend. Log skipped.', stack);
      return;
    }

    if (!isValidLevel(level)) {
      safeConsoleLog('warn', 'Invalid log level. Expected debug, info, warn, error, or fatal. Log skipped.', level);
      return;
    }

    if (!isValidPackageName(stack, packageName)) {
      safeConsoleLog('warn', 'Invalid package name for stack. Log skipped.', packageName);
      return;
    }

    const payload: LogPayload = {
      timestamp: new Date().toISOString(),
      stack,
      level,
      packageName,
      message: typeof message === 'string' ? message : JSON.stringify(message),
      runtimeContext: getRuntimeContext()
    };

    await sendLogPayload(payload);
  } catch (error) {
    safeConsoleLog('error', 'Unexpected error while logging. Application flow preserved.', error);
  }
}
