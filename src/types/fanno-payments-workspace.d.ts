
declare module 'fanno-payments-workspace' {
  export class Configuration {
    constructor(options?: { basePath?: string; [key: string]: any });
  }

  export class DefaultApi {
    constructor(configuration?: Configuration);
    createCheckoutSession(params: {
      amount: number;
      currency: string;
    }): Promise<{ sessionId: string }>;
  }
}
