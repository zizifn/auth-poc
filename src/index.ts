import "dotenv/config";
import express, { Request, Response } from "express";
import * as schema from "./db/schema";
import { db } from "./db/client";
import path from "path";
import { fileURLToPath } from "url";
import { createSession, generateSessionToken } from "./session";
console.log(import.meta);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  console.log("xxx");
  const users = await db.select().from(schema.userTable);
  console.log(users);
  res.json(users);
});

app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log(req.query, username, password);
  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }
  if (username === "1") {
    const token = generateSessionToken();
    const session = createSession(token, username);
    console.log(session);
    res.json({ message: "Login endpoint", session });
    return;
  }
  res.json({ message: "Login endpoint", username, password });

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
