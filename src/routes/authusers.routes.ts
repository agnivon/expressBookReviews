import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { SECRET } from "../config/environment.config";
import { bookReviews } from "../db/schema";
import db from "../db/client";
import { and, eq } from "drizzle-orm";

const authUsersRouter = express.Router();

authUsersRouter.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err?: Error, user?: Express.User) => {
    try {
      if (err || !user) {
        console.error(err);
        return res.status(401).send(err);
      }

      req.login(user, { session: true }, async (err) => {
        console.error(err);
        if (err) return res.status(401).send(err);

        const body = { _id: user.id, username: user.username };
        const token = jwt.sign({ user: body }, SECRET);
        req.session.token = token;
        return res.json({ token });
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  })(req, res, next);
});

authUsersRouter.put(
  "/auth/review/:isbn",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { content } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.sendStatus(401);
        return;
      }
      if (typeof content !== "string") res.sendStatus(400);

      await db
        .insert(bookReviews)
        .values({ userId, content, bookId: parseInt(req.params.isbn) })
        .onConflictDoUpdate({
          target: [bookReviews.userId, bookReviews.bookId],
          set: { content },
        });

      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
);

authUsersRouter.delete(
  "/auth/review/:isbn",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.sendStatus(401);
        return;
      }

      await db
        .delete(bookReviews)
        .where(
          and(
            eq(bookReviews.userId, userId),
            eq(bookReviews.bookId, parseInt(req.params.isbn))
          )
        );

      res.sendStatus(204);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
);

authUsersRouter;

export default authUsersRouter;
