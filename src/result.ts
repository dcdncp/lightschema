export type Success<Value extends unknown> = {
  success: Value;
};

export type Failure<Error extends unknown> = {
  failure: Error;
};

export type Result<Value extends unknown, Error extends unknown> =
  | Success<Value>
  | Failure<Error>;

export function isSuccess<Value extends unknown, Error extends unknown>(
  result: Result<Value, Error>
): result is Success<Value> {
  return "success" in result;
}

export function isFailure<Value extends unknown, Error extends unknown>(
  result: Result<Value, Error>
): result is Failure<Error> {
  return "failure" in result;
}

export function expectSuccess<Value extends unknown, Error extends unknown>(
  result: Result<Value, Error>,
  message?: string
): Value {
  if (isFailure(result)) {
    throw new Error(message ?? "Expected success, but got failure.");
  }
  return result.success;
}

export function expectFailure<Value extends unknown, Error extends unknown>(
  result: Result<Value, Error>,
  message?: string
): Error {
  if (isSuccess(result)) {
    throw new Error(message ?? "Expected failure, but got success.");
  }
  return result.failure;
}

export function successOr<Value extends unknown, Error extends unknown>(
  result: Result<Value, Error>,
  defaultValue: Value
): Value {
  return isSuccess(result) ? result.success : defaultValue;
}

export function failureOr<Value extends unknown, Error extends unknown>(
  result: Result<Value, Error>,
  defaultError: Error
): Error {
  return isFailure(result) ? result.failure : defaultError;
}
