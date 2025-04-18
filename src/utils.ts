import { isFailure, isSuccess, type Result } from "./result";
import type { Schema } from "./schema";

type ParseError<Value extends unknown = unknown> = Value extends Record<
  string,
  unknown
>
  ? {
      [K in keyof Value]: ParseError<Value[K]>;
    }
  : string[];

export function parse<
  const S extends Schema,
  Infer extends unknown = S["infer"]
>(schema: S, value: unknown): Result<Infer, ParseError<Infer>> {
  if (schema.type === "literal") {
    if (value !== schema.literal) {
      return {
        failure: [
          schema.message ?? `Expected ${schema.literal}`,
        ] as ParseError<Infer>,
      };
    }
    return { success: schema.literal } as Result<Infer, ParseError<Infer>>;
  } else if (schema.type === "none") {
    if (value !== null && value !== undefined) {
      return {
        failure: [
          schema.message ?? `Expected null or undefined`,
        ] as ParseError<Infer>,
      };
    }
  } else if (schema.type === "int") {
    if (typeof value !== "number" || !Number.isInteger(value)) {
      return {
        failure: [schema.message ?? `Expected integer`] as ParseError<Infer>,
      };
    }
    return { success: value } as Result<Infer, ParseError<Infer>>;
  } else if (schema.type === "float") {
    if (typeof value !== "number") {
      return {
        failure: [schema.message ?? `Expected float`] as ParseError<Infer>,
      };
    }
    return { success: value } as Result<Infer, ParseError<Infer>>;
  } else if (schema.type === "string") {
    if (typeof value !== "string") {
      return {
        failure: [schema.message ?? `Expected string`] as ParseError<Infer>,
      };
    }
    return { success: value } as Result<Infer, ParseError<Infer>>;
  } else if (schema.type === "boolean") {
    if (typeof value !== "boolean") {
      return {
        failure: [schema.message ?? `Expected boolean`] as ParseError<Infer>,
      };
    }
    return { success: value } as Result<Infer, ParseError<Infer>>;
  } else if (schema.type === "array") {
    if (!Array.isArray(value)) {
      return {
        failure: [schema.message ?? `Expected array`] as ParseError<Infer>,
      };
    }
    const results = value.map((item) => parse(schema.item, item));
    const failures = results.filter(isFailure);
    if (failures.length > 0) {
      return {
        failure: failures
          .map((result) => result.failure)
          .flat() as ParseError<Infer>,
      };
    }
    return {
      success: results.filter(isSuccess).map((result) => result.success),
    } as Result<Infer, ParseError<Infer>>;
  } else if (schema.type === "tuple") {
    if (!Array.isArray(value)) {
      return {
        failure: [schema.message ?? `Expected tuple`] as ParseError<Infer>,
      };
    }
    if (value.length !== schema.items.length) {
      return {
        failure: [
          schema.message ?? `Expected tuple of length ${schema.items.length}`,
        ] as ParseError<Infer>,
      };
    }
    const results = value.map((item, index) =>
      parse(schema.items[index], item)
    );
    const failures = results.filter(isFailure);
    if (failures.length > 0) {
      return {
        failure: failures
          .map((result) => result.failure)
          .flat() as ParseError<Infer>,
      };
    }
    return {
      success: results
        .filter((result) => "success" in result)
        .map((result) => result.success),
    } as Result<Infer, ParseError<Infer>>;
  } else if (schema.type === "union") {
    const results = schema.items.map((item) => parse(item, value));
    const failures = results.filter(isFailure);
    if (failures.length === schema.items.length) {
      return {
        failure: failures
          .map((result) => result.failure)
          .flat() as ParseError<Infer>,
      };
    }
    const successes = results.filter(isSuccess);
    if (successes.length > 0) {
      return {
        success: successes[0].success,
      } as Result<Infer, ParseError<Infer>>;
    }
    return {
      failure: [
        schema.message ??
          `Expected one of ${schema.items.map((item) => item.type)}`,
      ] as ParseError<Infer>,
    };
  } else if (schema.type === "object") {
    if (typeof value !== "object" || value === null || value === undefined) {
      return {
        failure: [schema.message ?? `Expected object`] as ParseError<Infer>,
      };
    }
    const results = Object.entries(schema.props).map(
      ([key, item]) =>
        [key, parse(item as Schema, (value as any)[key])] as const
    );
    const failureValues = {} as ParseError<Infer>;
    const successValues = {} as Infer;
    for (const [key, result] of results) {
      if (isFailure(result)) {
        (failureValues as any)[key] = result.failure;
      } else {
        (successValues as any)[key] = result.success;
      }
    }
    if (Object.keys(failureValues).length > 0) {
      return {
        failure: failureValues as ParseError<Infer>,
      } as Result<Infer, ParseError<Infer>>;
    }
    return { success: successValues } as Result<Infer, ParseError<Infer>>;
  } else if (schema.type === "validation") {
    const result = parse(schema.item, value);
    if (isFailure(result)) {
      return result as Result<Infer, ParseError<Infer>>;
    }
    const validationResult = schema.validator(result.success);
    if (isFailure(validationResult)) {
      return {
        failure: validationResult.failure as ParseError<Infer>,
      };
    }
    return { success: validationResult.success } as Result<
      Infer,
      ParseError<Infer>
    >;
  } else if (schema.type === "nullable") {
    if (value === null || value === undefined) {
      return { success: null } as Result<Infer, ParseError<Infer>>;
    }
    const result = parse(schema.item, value);
    if (isFailure(result)) {
      return result as Result<Infer, ParseError<Infer>>;
    }
    return { success: result.success } as Result<Infer, ParseError<Infer>>;
  } else if (schema.type === "transform") {
    const result = parse(schema.from, value);
    if (isFailure(result)) {
      return result as Result<Infer, ParseError<Infer>>;
    }
    const transformedResult = schema.transformer(result.success);
    if (isFailure(transformedResult)) {
      return {
        failure: transformedResult.failure as ParseError<Infer>,
      };
    }
    return { success: transformedResult.success } as Result<
      Infer,
      ParseError<Infer>
    >;
  }
  throw new Error(`Unsupported scheme type: ${schema.type}`);
}
