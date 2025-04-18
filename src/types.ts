import type {
  Schema,
  ArraySchema,
  BooleanSchema,
  FloatSchema,
  IntSchema,
  NullableSchema,
  ObjectSchema,
  StringSchema,
  TupleSchema,
  UnionSchema,
  LiteralSchema,
  NoneSchema,
} from "./schema";

export function Literal<T extends string | number | boolean>(
  literal: T,
  message?: string
) {
  return {
    type: "literal",
    literal,
    message,
  } as LiteralSchema<T>;
}

export function None() {
  return {
    type: "none",
  } as NoneSchema;
}

export function Int(message?: string) {
  return {
    type: "int",
    message,
  } as IntSchema;
}

export function Float(message?: string) {
  return {
    type: "float",
    message,
  } as FloatSchema;
}

export function String(message?: string) {
  return {
    type: "string",
    message,
  } as StringSchema;
}

export function Boolean(message?: string) {
  return {
    type: "boolean",
    message,
  } as BooleanSchema;
}

export function Array<const Item extends Schema>(item: Item, message?: string) {
  return {
    type: "array",
    item,
    message,
  } as ArraySchema<Item>;
}

export function Union<const Items extends ReadonlyArray<Schema>>(
  items: Items,
  message?: string
) {
  return {
    type: "union",
    items,
    message,
  } as UnionSchema<Items>;
}

export function Tuple<const Items extends ReadonlyArray<Schema>>(
  items: Items,
  message?: string
) {
  return {
    type: "tuple",
    items,
    message,
  } as TupleSchema<Items>;
}

export function Object<Props extends Record<string, Schema>>(
  props: Props,
  message?: string
) {
  return {
    type: "object",
    props,
    message,
  } as ObjectSchema<Props>;
}

export function Nullable<S extends Schema>(item: S, message?: string) {
  return {
    type: "nullable",
    item,
    message,
  } as NullableSchema<S>;
}
