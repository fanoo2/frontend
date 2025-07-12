
declare module 'fanno-payments-workspace' {
  export interface ConfigurationOptions {
    basePath?: string;
    [key: string]: any;
  }

  export class Configuration {
    constructor(options?: ConfigurationOptions);
  }

  export interface CreateCheckoutSessionParams {
    amount: number;
    currency: string;
  }

  export interface CreateCheckoutSessionResponse {
    sessionId: string;
  }

  export class DefaultApi {
    constructor(configuration?: Configuration);
    createCheckoutSession(params: CreateCheckoutSessionParams): Promise<CreateCheckoutSessionResponse>;
  }

  // Add namespace export for compatibility
  export = PaymentsWorkspace;
  export as namespace PaymentsWorkspace;
}
