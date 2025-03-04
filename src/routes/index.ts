import { Express } from "express";
import authUsersRouter from "./authusers.routes";
import generalRouter from "./general.routes";

export default function routes(app: Express) {
  app.use("/customer", authUsersRouter);
  app.use("/", generalRouter);
}
