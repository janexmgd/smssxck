declare module 'smssxck' {
    class smssxck {
      constructor(apiKey: string, service: string);
  
      getBalance(): Promise<{ ACCESS_BALANCE: number }>;
  
      getNumber(
        service: string,
        country: string,
        operator?: string,
        maxPrice?: string
      ): Promise<{ ORDER_ID: string; PHONE_NUMBER: string }>;
  
      getCode(orderid: string): Promise<{ CODE?: string }>;
  
      changeStatus(orderid: string, status: string): Promise<{ STATUS: string }>;
    }
  
    export default smssxck;
  }
  