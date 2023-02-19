declare global {
  interface APIError extends Error {
    statusCode: number;
    statusMessage: string;
  }

  type Result<T, E> = Ok<T, E> | Err<T, E>;
  type ValidationResult = Result<void, APIError>;

  type APIBody<T> = {
    attributes: T;
  };

  type APIBodyArray<T> = {
    data: APIBody<T>[];
  }
}

export {};
