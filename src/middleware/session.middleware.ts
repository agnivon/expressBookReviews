import { Express } from "express";
import session from "express-session";
import fileStore from "session-file-store";
import { SECRET } from "../config/environment.config";

const FileStore = fileStore(session);

const fileStoreOptions = {};

export function sessionMiddleware(app: Express) {
  app.use(
    session({
      secret: SECRET,
      resave: true,
      saveUninitialized: true,
      store: new FileStore(fileStoreOptions),
    })
  );
}
