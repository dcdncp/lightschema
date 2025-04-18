import type { Schema, ValidationSchema, Validator } from "./schema";

export function Validator<const Item extends Schema>(
  item: Item,
  validator: Validator<Item["infer"]>
) {
  return {
    type: "validation",
    item,
    validator,
  } as ValidationSchema<Item>;
}

export function Min<const Item extends Schema>(
  item: Item,
  min: number,
  message?: string
) {
  return Validator(item, (value) => {
    if (typeof value === "number" && value < min) {
      return {
        failure: [message ?? `Number must be greater than or equal to ${min}`],
      };
    } else if (typeof value === "string" && value.length < min) {
      return {
        failure: [message ?? `String must be at least ${min} characters long`],
      };
    } else if (Array.isArray(value) && value.length < min) {
      return {
        failure: [message ?? `Array must have at least ${min} elements`],
      };
    }
    return { success: value };
  });
}

export function Max<const Item extends Schema>(
  item: Item,
  max: number,
  message?: string
) {
  return Validator(item, (value) => {
    if (typeof value === "number" && value > max) {
      return {
        failure: [message ?? `Number must be less than or equal to ${max}`],
      };
    } else if (typeof value === "string" && value.length > max) {
      return {
        failure: [message ?? `String must be at most ${max} characters long`],
      };
    } else if (Array.isArray(value) && value.length > max) {
      return {
        failure: [message ?? `Array must have at most ${max} elements`],
      };
    }
    return { success: value };
  });
}
