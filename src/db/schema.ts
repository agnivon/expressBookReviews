import { relations } from "drizzle-orm";
import { int, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  username: text().notNull(),
  password: text().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(bookReviews),
}));

export const books = sqliteTable("books", {
  id: int().primaryKey({ autoIncrement: true }),
  author: text().notNull(),
  title: text().notNull(),
});

export const booksRelations = relations(books, ({ many }) => ({
  reviews: many(bookReviews),
}));

export const bookReviews = sqliteTable(
  "book_reviews",
  {
    bookId: int()
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    userId: int()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text().notNull(),
  },
  (table) => [primaryKey({ columns: [table.bookId, table.userId] })]
);

export const bookReviewsRelations = relations(bookReviews, ({ one }) => ({
  author: one(books, {
    fields: [bookReviews.bookId],
    references: [books.id],
  }),
  user: one(users, {
    fields: [bookReviews.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type Book = typeof books.$inferSelect;
