import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const USERS_FILE = path.resolve("data/users.json");
const secret = () => process.env.JWT_SECRET || "development_only_change_this_secret";
const readUsers = async () => JSON.parse(await fs.readFile(USERS_FILE, "utf8"));
const makeToken = user => jwt.sign({ id: user.id, name: user.name, email: user.email }, secret(), { expiresIn: "7d" });

export async function register(req, res) {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!name || !email || password.length < 6) 
      return res.status(400).json({ message: "Enter your name, a valid email and a password with at least 6 characters" });
    const users = await readUsers();
    if (users.some(user => user.email === email)) 
      return res.status(409).json({ message: "An account with this email already exists" });
    const user = { id: randomUUID(), name, email, passwordHash: await bcrypt.hash(password, 12), createdAt: new Date().toISOString() };
    users.push(user);
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    res.status(201).json({ token: makeToken(user), user: { id: user.id, name: user.name, email: user.email } });
  } 
  catch { 
    res.status(500).json({ message: "Unable to create account" }); 
  }
}

export async function login(req, res) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const user = (await readUsers()).find(item => item.email === email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) 
      return res.status(401).json({ message: "Invalid email or password" });
    res.json({ token: makeToken(user), user: { id: user.id, name: user.name, email: user.email } });
  } 
  catch { res.status(500).json({ message: "Unable to log in" }); 
}
}

export function me(req, res) {
  res.json({ user: { id: req.user.id, name: req.user.name, email: req.user.email } });
}
