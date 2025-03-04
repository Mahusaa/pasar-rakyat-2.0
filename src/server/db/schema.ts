// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  serial,
  pgTableCreator,
  text,
  timestamp,
  varchar,
  numeric,
  integer,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `pasar-rakyat_${name}`);

export const users = createTable(
  'users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 20 }).notNull().default('member'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
}
);


export const logs = createTable(
  "logs", {
  id: serial("id").primaryKey(),
  counterId: varchar("counter_id").notNull(),
  food: varchar("food").notNull(),
  cashier: varchar("cashier", { length: 20 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  quantity: integer("quantity").notNull(),
  amount: integer("amount").notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  time: timestamp("time").defaultNow().notNull(),
})


export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Order = typeof logs.$inferSelect;
