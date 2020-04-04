# safedb
Typescript high level class to typesafe your database query, requiring knex as middle-layer query-builder.
Type-check your column name, column type, column attributes.
Distinguish different db operations input:
- `select`, `update`, `delete` (where db generated columns like `id`, `created_at` exist)
- `insert` (where `id` is not there yet)

## Typescript
This package is written in Typescipt and utilize Typescript to type-check table/model and column/property. Although it's compiled into Javascript but there's no use in using pure Javascript, since its core purpose is to type-safe database queries.



## Getting Started

### Installation

```bash
npm i safedb --save
```
or
```bash
yarn add safedb
```

### Basic Usage
Your database declaration file. Here you will use the `classFactory` to inject db instance into `Base` class.
Then export it to be used later with your models.

```typescript
import * as Knex from 'knex';
import { classFactory } from './baseClassFactory';

// example config
const db = Knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: {
    min: 0,
    max: 1,
  },
  asyncStackTraces: true, // this line will safe you a whole lot of time
});

const Base = classFactory(db);
export Base;
```



Model declaration. This might look verbose and cumbersome, but you'll end up declare a model sooner or later, under the form of `type`, `interface`, or `class` if you're using Typescipt.
Just `extends` your Model from `Base` class. It will ensure you to put in your `tableName`.
![image](https://user-images.githubusercontent.com/3973377/78455953-42d64a00-76cb-11ea-8af4-e016fcfdab91.png)

```typescript
import { Base } from './db';

class User extends Base {
  tableName: 'users';

  public name: string;
  public address: string;
  public age: number;
}
```



Just instantiate a model instance when you need to use it:

```typescript
const user = new User();

user.find({})
```



### Knex query-builder
There will be circumstances where you need a query-builder, just call `queryBuilder()` method.

### Transaction



Available methods:
`find`
`findOne`
`findByIds`
`findAll`
`insert`
`update`
`delete`