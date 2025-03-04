import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const PORT = parseInt(process.env.PORT as string);
export const SECRET = process.env.SECRET as string;
export const DB_FILE_NAME = process.env.DB_FILE_NAME as string;
