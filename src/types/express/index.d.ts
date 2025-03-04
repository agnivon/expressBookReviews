import { User as IUser } from "../../db/schema";

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface User extends Omit<IUser, "password"> {}
  }
}

declare module "express-session" {
  interface SessionData {
    token?: string;
  }
}
