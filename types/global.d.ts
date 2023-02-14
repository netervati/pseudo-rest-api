declare global {
  interface APIError extends Error {
    statusCode: number;
    statusMessage: string;
  }
}

export {};
