type Factory<T> = () => T;

type Registration<T> = {
  factory: Factory<T>;
  singleton: boolean;
  instance?: T;
};

export class Container {
  private readonly registrations = new Map<string, Registration<unknown>>();

  register<T>(key: string, factory: Factory<T>, singleton = true): void {
    this.registrations.set(key, { factory, singleton });
  }

  resolve<T>(key: string): T {
    const registration = this.registrations.get(key);

    if (!registration) {
      throw new Error(`Dependency not registered: ${key}`);
    }

    if (registration.singleton) {
      if (!registration.instance) {
        registration.instance = registration.factory();
      }
      return registration.instance as T;
    }

    return registration.factory() as T;
  }
}

export const container = new Container();
