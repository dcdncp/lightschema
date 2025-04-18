# LightSchema

LightSchema is a lightweight schema validation library for TypeScript. It provides a simple and efficient way to validate data structures.

## Features

- Lightweight: Minimal footprint with no external dependencies.
- Type-safe: Leverages TypeScript's type system for compile-time validation.
- Flexible: Supports custom validation functions and error messages.
- Extensible: Easily extendable to accommodate new validation rules.

## Warning

This library is my educational project. It is not intended for production use. Use at your own risk.

## Installation

You can install LightSchema using npm or bun:

```bash
npm install lightscheme
```

or

```bash
bun add lightscheme
```

## Usage

LightSchema provides a simple API for defining and validating data structures. Here's a quick example:

```typescript
import { type, transform, validate, parse } from "lightscheme";

const User = type.Object({
  id: type.Int(),
  name: validate.Min(type.String(), 5),
  email: type.String(),
  age: transform.ToInt(type.String()),
  isActive: type.Boolean(),
  friends: type.Array(type.Object({ id: type.Int(), name: type.String() })),
  role: type.Union([type.Literal("admin"), type.Literal("user")]),
});

type User = typeof User.infer;

const userString = `{
  "id": 1,
  "name": "John Doe",
  "email": "test@some.com",
  "age": "123",
  "isActive": true,
  "friends": [
    { "id": 2, "name": "Jane Doe" },
    { "id": 3, "name": "Jack Doe" }
  ],
  "role": "admin"
}`;
const result = parse(User, JSON.parse(userString));

if ("success" in result) {
  console.log("Parsed user:", result.success);
} else {
  console.log("Failed to parse user:", result.failure);
}

export { type, transform, validate, parse };
```

Also easy to extend:

```typescript
import type { Scheme } from "lightscheme/scheme";
import { validate } from "lightscheme";

export function Min<const Item extends Scheme>(
  item: Item,
  min: number,
  message?: string
) {
  return validate.Validator(item, (value) => {
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
```
