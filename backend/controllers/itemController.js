import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const DATA_FILE = path.resolve("data/items.json");
const UPLOAD_DIR = path.resolve("uploads");

async function readItems() {
  return JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
}
async function saveItems(items) {
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2));
}

export const createItem = async (req, res) => {
  try {
    const { title, description, category, location, type, contact } = req.body;
    if (![title, description, category, location, contact].every(v => typeof v === "string" && v.trim()) ||
        !["Lost", "Found"].includes(type)) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    let image = "";
    if (req.file) {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      const ext = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" }[req.file.mimetype];
      const filename = randomUUID() + ext;
      await fs.writeFile(path.join(UPLOAD_DIR, filename), req.file.buffer);
      image = filename;
    }

    const items = await readItems();
    const newItem = {
      id: randomUUID(), title: title.trim(), description: description.trim(),
      category: category.trim(), location: location.trim(), type,
      contact: contact.trim(), image, status: "Active",
      createdAt: new Date().toISOString()
    };
    items.push(newItem);
    await saveItems(items);
    res.status(201).json({ message: "Item reported successfully", item: newItem });
  } 
  catch (error) {
    res.status(500).json({ message: "Unable to create item" });
  }
};

export const getItems = async (req, res) => {
  try {
    let items = (await readItems()).filter(item => item.status === "Active");
    const { search, category, location, type } = req.query;
    if (search) {
      const term = search.toLowerCase();
      items = items.filter(i => i.title.toLowerCase().includes(term) ||
        i.description.toLowerCase().includes(term));
    }
    if (category) items = items.filter(i => i.category.toLowerCase() === category.toLowerCase());
    if (location) items = items.filter(i => i.location.toLowerCase().includes(location.toLowerCase()));
    if (type) items = items.filter(i => i.type.toLowerCase() === type.toLowerCase());
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(items);
  } 
  catch {
    res.status(500).json({ message: "Unable to retrieve items" });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = (await readItems()).find(i => i.id === req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } 
  catch {
    res.status(500).json({ message: "Unable to retrieve item" });
  }
};

export const claimItem = async (req, res) => {
  try {
    const items = await readItems();
    const index = items.findIndex(i => i.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: "Item not found" });
    if (items[index].status === "Claimed") {
      return res.status(409).json({ message: "Item is already claimed" });
    }
    items[index].status = "Claimed";
    items[index].claimedAt = new Date().toISOString();
    await saveItems(items);
    res.json({ message: "Item claimed and archived successfully" });
  } 
  catch {
    res.status(500).json({ message: "Unable to claim item" });
  }
};
