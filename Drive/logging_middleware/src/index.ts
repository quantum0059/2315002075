import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

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
  accessToken?: string;
  refreshToken?: string;
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
  refreshPromise: null as Promise<string | undefined> | null,
  axiosClient: buildAxiosClient({ ...defaultConfig })
};

function getEnvironmentValue(name: string): string | undefined {
  if (typeof process !== 'undefined' && typeof process.env !== 'undefined') {
    return process.env[name];
  }

  return undefined;
}

function buildAxiosClient(config: Required<LoggingConfig>): AxiosInstance {
  const client = axios.create({
    timeout: config.timeoutMs,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  client.interceptors.request.use(
    async (request) => {
      const previousHeaders = request.headers as Record<string, unknown> | undefined;
      const accessToken = state.config.authToken;

      if (accessToken) {
        request.headers = {
          ...(previousHeaders ?? {}),
          Authorization: `Bearer ${accessToken}`
        } as AxiosRequestHeaders;
      }

      return request;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (shouldRefreshToken(error)) {
        const refreshedToken = await refreshAuthToken();
        if (refreshedToken && error.config) {
          error.config.headers = {
            ...error.config.headers,
            Authorization: `Bearer ${refreshedToken}`
          };
          return client.request(error.config);
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
}

function applyConfig(overrides: Partial<LoggingConfig>): void {
  state.config = {
    ...state.config,
    ...overrides
  };
  state.axiosClient = buildAxiosClient(state.config);
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

function shouldRefreshToken(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const status = error.response?.status;
  return status === 401 || status === 403;
}

function isRetryableError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  if (!error.response) {
    return true;
  }

  const status = error.response.status;
  return status === 429 || (status >= 500 && status < 600);
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
      const response = await axios.post<RefreshResponse>(
        refreshUrl,
        { refreshToken },
        { timeout: state.config.timeoutMs, headers: { 'Content-Type': 'application/json' } }
      );

      const accessToken = response.data?.accessToken;
      const nextRefreshToken = response.data?.refreshToken;

      if (typeof accessToken === 'string' && accessToken.trim()) {
        setAuthTokens(accessToken, nextRefreshToken ?? refreshToken);
        return accessToken;
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

  while (attempt <= state.config.maxRetries) {
    try {
      await state.axiosClient.post(apiUrl, payload);
      return;
    } catch (error) {
      if (!isRetryableError(error) || attempt === state.config.maxRetries) {
        safeConsoleLog('warn', 'Log delivery failed after retries.', error);
        return;
      }

      await delay(200 * 2 ** attempt);
      attempt += 1;
    }
  }
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
