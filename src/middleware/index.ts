import express, { Express } from "express";
import path from "path";
import { sessionMiddleware } from "./session.middleware";
import { passportMiddleware } from "./passport.middleware";

export default function middleware(app: Express) {
  app.use(express.static(path.join(__dirname, "public")));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  sessionMiddleware(app);
  passportMiddleware(app);
}
