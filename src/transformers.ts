import type { Schema, Transformer, TransformSchema } from "./schema";
import * as type from "./types";

export function Transformer<const From extends Schema, const To extends Schema>(
  from: From,
  to: To,
  transformer: Transformer<From["infer"], To["infer"]>
) {
  return {
    type: "transform",
    from,
    to,
    transformer,
  } as TransformSchema<From, To>;
}

export function ToString<const From extends Schema>(
  from: From,
  message?: string
) {
  return Transformer(from, type.String(), (value) => {
    if (value === null || value === undefined) {
      return { success: "" };
    }
    return { success: value.toString() };
  });
}

export function ToInt<const From extends Schema>(from: From, message?: string) {
  return Transformer(from, type.Int(), (value) => {
    if (value === null || value === undefined) {
      return { failure: [message ?? `Expected integer`] };
    }
    if (typeof value === "number") {
      return { success: Math.floor(value) };
    } else if (typeof value === "string") {
      const parsed = parseInt(value, 10);
      if (isNaN(parsed)) {
        return { failure: [message ?? `Expected integer`] };
      }
      return { success: parsed };
    }
    return { failure: [message ?? `Expected integer`] };
  });
}
