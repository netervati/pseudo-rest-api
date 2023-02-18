declare global {
  interface APIError extends Error {
    statusCode: number;
    statusMessage: string;
  }

  type Result<T, E> = Ok<T, E> | Err<T, E>;
  type ValidationResult = Result<void, APIError>;
}

export {};
