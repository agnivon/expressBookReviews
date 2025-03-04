import express from "express";
import { PORT } from "./config/environment.config";
import middleware from "./middleware";
import routes from "./routes";

const app = express();

middleware(app);
routes(app);

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Server is running on PORT: ${PORT}`);
  }
});
