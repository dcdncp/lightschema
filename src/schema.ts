import type { Result } from "./result";

export type Validator<T extends unknown> = (value: T) => Result<T, string[]>;
export type Transformer<T extends unknown, U extends unknown> = (
  value: T
) => Result<U, string[]>;

export type Fold<T extends unknown> = {} & {
  [P in keyof T]: T[P];
};

export type LiteralSchema<Literal extends unknown> = {
  readonly type: "literal";
  readonly literal: Literal;
  readonly infer: Literal;
  readonly message?: string;
};
export type NoneSchema = {
  readonly type: "none";
  readonly infer: null | undefined;
  readonly message?: string;
};
export type IntSchema = {
  readonly type: "int";
  readonly infer: number;
  readonly message?: string;
};
export type FloatSchema = {
  readonly type: "float";
  readonly infer: number;
  readonly message?: string;
};
export type StringSchema = {
  readonly type: "string";
  readonly infer: string;
  readonly message?: string;
};
export type BooleanSchema = {
  readonly type: "boolean";
  readonly infer: boolean;
  readonly message?: string;
};
export type ArraySchema<Item extends Schema> = {
  readonly type: "array";
  readonly item: Item;
  readonly infer: Item["infer"][];
  readonly message?: string;
};
export type UnionSchema<Items extends ReadonlyArray<Schema>> = {
  readonly type: "union";
  readonly items: Items;
  readonly infer: Items[number]["infer"];
  readonly message?: string;
};
export type TupleSchema<Items extends ReadonlyArray<Schema>> = {
  readonly type: "tuple";
  readonly items: Items;
  readonly infer: {
    [Index in keyof Items]: Items[Index]["infer"];
  };
  readonly message?: string;
};
export type ObjectSchema<Props extends Record<string, Schema>> = {
  readonly type: "object";
  readonly props: Props;
  readonly infer: Fold<
    {
      -readonly [Key in keyof Props as Props[Key] extends NullableSchema<any>
        ? never
        : Key]: Props[Key]["infer"];
    } & {
      -readonly [Key in keyof Props as Props[Key] extends NullableSchema<any>
        ? Key
        : never]?: Props[Key]["infer"];
    }
  >;
  readonly message?: string;
};
export type NullableSchema<Item extends Schema> = {
  readonly type: "nullable";
  readonly item: Item;
  readonly infer: Item["infer"] | null | undefined;
  readonly message?: string;
};
export type ValidationSchema<Item extends Schema> = {
  readonly type: "validation";
  readonly item: Item;
  readonly validator: Validator<Item>;
  readonly infer: Item["infer"];
};
export type TransformSchema<From extends Schema, To extends Schema> = {
  readonly type: "transform";
  readonly from: From;
  readonly to: To;
  readonly transformer: Transformer<From["infer"], To["infer"]>;
  readonly infer: To["infer"];
};

export type Schema =
  | LiteralSchema<any>
  | NoneSchema
  | IntSchema
  | FloatSchema
  | StringSchema
  | BooleanSchema
  | ArraySchema<any>
  | UnionSchema<any[]>
  | TupleSchema<any[]>
  | ObjectSchema<any>
  | NullableSchema<any>
  | ValidationSchema<any>
  | TransformSchema<any, any>;
