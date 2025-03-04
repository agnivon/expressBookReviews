import { and, eq } from "drizzle-orm";
import { Express, Router } from "express";
import passport from "passport";
import {
  Strategy as JwtStrategy,
  StrategyOptionsWithoutRequest,
} from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { SECRET } from "../config/environment.config";
import db from "../db/client";
import { users } from "../db/schema";

const cookieExtractor = function (req: Express.Request) {
  return req.session.token || null;
};

const opts: StrategyOptionsWithoutRequest = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: SECRET,
};

export function passportMiddleware(app: Express | Router) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    "signup",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      async (username, password, done) => {
        try {
          if (!username || !password) {
            return done("Username or password not provided");
          }

          const user = await db
            .select()
            .from(users)
            .where(eq(users.username, username));

          if (user.length) {
            return done("Username already exists");
          }

          const newUser = await db
            .insert(users)
            .values({ username, password })
            .returning({ id: users.id, username: users.username });

          return done(null, newUser[0], {
            message: "User created successfully",
          });
        } catch (e) {
          console.error(e);
          done(e);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      async (username, password, done) => {
        try {
          const user = await db
            .select()
            .from(users)
            .where(
              and(eq(users.username, username), eq(users.password, password))
            )
            .limit(1);

          if (!user.length) {
            return done("Invalid credentials", false, {
              message: "User not found",
            });
          }

          return done(null, user[0], { message: "Logged in Successfully" });
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    new JwtStrategy(opts, async (token, done) => {
      try {
        const user = await db
          .select()
          .from(users)
          .where(eq(users.id, token.user._id))
          .limit(1);
        if (user) {
          return done(null, user[0]);
        } else {
          return done(null, false);
        }
      } catch (err) {
        console.error(err);
        return done(err, false);
      }
    })
  );

  passport.serializeUser((user, done) => {
    console.log(user);
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, parseInt(id)))
        .limit(1);
      done(null, user[0]);
    } catch (err) {
      done(err);
    }
  });
}
