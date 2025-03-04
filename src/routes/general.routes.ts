import express from "express";
import db from "../db/client";
import { bookReviews, books, users } from "../db/schema";
import { eq } from "drizzle-orm";
import passport from "passport";

const generalRouter = express.Router();

generalRouter.get("/", async (req, res) => {
  const data = await db.select().from(books);
  res.json(data).status(200);
});

generalRouter.get("/isbn/:isbn", async (req, res) => {
  const data = await db
    .select()
    .from(books)
    .where(eq(books.id, parseInt(req.params.isbn)))
    .limit(1);
  if (data.length) {
    res.json(data[0]).status(200);
  } else {
    res.sendStatus(404);
  }
});

generalRouter.get("/author/:author", async (req, res) => {
  try {
    const data = await db
      .select()
      .from(books)
      .where(eq(books.author, req.params.author));
    res.json(data).status(200);
  } catch (e) {
    res.sendStatus(500);
  }
});

generalRouter.get("/title/:title", async (req, res) => {
  const data = await db
    .select()
    .from(books)
    .where(eq(books.title, req.params.title));
  res.json(data).status(200);
});

generalRouter.get("/review/:isbn", async (req, res) => {
  const data = await db
    .select()
    .from(bookReviews)
    .where(eq(bookReviews.bookId, parseInt(req.params.isbn)));
  res.json(data).status(200);
});

generalRouter.post(
  "/register",
  passport.authenticate("signup", { session: false }),
  async (req, res) => {
    res
      .json({
        message: "Signup successful",
        user: req.user,
      })
      .status(201);
  }
);

export default generalRouter;
