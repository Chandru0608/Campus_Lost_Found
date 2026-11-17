import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import itemRoutes from "./routes/itemRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = 5000;

await fs.mkdir(path.resolve("data"), { recursive: true });
await fs.mkdir(path.resolve("uploads"), { recursive: true });
const dataFile = path.resolve("data/items.json");
const usersFile = path.resolve("data/users.json");
try { await fs.access(dataFile); }
catch { await fs.writeFile(dataFile, "[]"); }
try { await fs.access(usersFile); }
catch { await fs.writeFile(usersFile, "[]"); }

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.get("/", (req, res) => res.send("Campus Lost & Found API is running"));

app.use((err, req, res, next) => {
  const status = err.message?.includes("File too large") || err.message?.startsWith("Only JPG") ? 400 : 500;
  res.status(status).json({ message: err.message || "Internal server error" });
});

app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
