import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "./models/User.js";
import { Category } from "./models/Category.js";
import { SubCategory } from "./models/SubCategory.js";
import { Item } from "./models/Item.js";
import { connectDB, seedAdminUser } from "./db.js";

dotenv.config();

const app = express();
const PORT = 8081;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

app.use(cors());
app.use(express.json());

connectDB()
  .then(seedAdminUser)
  .catch((err) => console.error("Database initialization error:", err));

// Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- Routes ---

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      const token = jwt.sign({ username: user.username, isAdmin: user.isAdmin }, JWT_SECRET);
      res.json({ token });
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Public Menu API
app.get("/menu", async (req, res) => {
  try {
    const categories = await Category.find();
    
    const menu = await Promise.all(categories.map(async (cat) => {
      const subCategories = await SubCategory.find({ categoryId: cat._id });
      
      // Get items for subcategories
      const subsWithItems = await Promise.all(subCategories.map(async (sub) => {
        const subItems = await Item.find({ subCategoryId: sub._id });
        return {
          ...sub.toObject(),
          items: subItems,
          itemCount: subItems.length
        };
      }));

      // Get items directly under category (no subcategory)
      const directItems = await Item.find({ categoryId: cat._id, subCategoryId: null });
      
      // Total items count
      const totalItems = directItems.length + subsWithItems.reduce((acc, sub) => acc + sub.itemCount, 0);

      return {
        ...cat.toObject(),
        subCategories: subsWithItems,
        items: directItems,
        itemCount: totalItems
      };
    }));

    res.json(menu);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Get Single Category (Public)
app.get("/categories/:id", async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).send("Category not found");

    const subCategories = await SubCategory.find({ categoryId: cat._id });
      
    const subsWithItems = await Promise.all(subCategories.map(async (sub) => {
      const subItems = await Item.find({ subCategoryId: sub._id });
      return {
        ...sub.toObject(),
        items: subItems,
        itemCount: subItems.length
      };
    }));

    const directItems = await Item.find({ categoryId: cat._id, subCategoryId: null });
    const totalItems = directItems.length + subsWithItems.reduce((acc, sub) => acc + sub.itemCount, 0);

    res.json({
      ...cat.toObject(),
      subCategories: subsWithItems,
      items: directItems,
      itemCount: totalItems
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Admin APIs

// Categories
app.get("/admin/categories", authenticateToken, async (req, res) => {
  try {
    const categories = await Category.find();
    const result = await Promise.all(categories.map(async (cat) => {
      const count = await Item.countDocuments({ categoryId: cat._id });
      return { ...cat.toObject(), itemCount: count };
    }));
    res.json(result);
  } catch (e) { res.status(500).send(e.message); }
});

app.post("/admin/categories", authenticateToken, async (req, res) => {
  try {
    const cat = new Category(req.body);
    await cat.save();
    res.json(cat);
  } catch (e) { res.status(500).send(e.message); }
});

app.put("/admin/categories/:id", authenticateToken, async (req, res) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(cat);
  } catch (e) { res.status(500).send(e.message); }
});

app.delete("/admin/categories/:id", authenticateToken, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    await SubCategory.deleteMany({ categoryId: req.params.id });
    await Item.deleteMany({ categoryId: req.params.id });
    res.json({ success: true });
  } catch (e) { res.status(500).send(e.message); }
});

// SubCategories
app.get("/admin/subcategories", authenticateToken, async (req, res) => {
  try {
    const subs = await SubCategory.find().populate('categoryId', 'name');
    res.json(subs);
  } catch (e) { res.status(500).send(e.message); }
});

app.get("/admin/subcategories/by-category/:categoryId", authenticateToken, async (req, res) => {
  try {
    const subs = await SubCategory.find({ categoryId: req.params.categoryId });
    res.json(subs);
  } catch (e) { res.status(500).send(e.message); }
});

app.post("/admin/subcategories", authenticateToken, async (req, res) => {
  try {
    const sub = new SubCategory(req.body);
    await sub.save();
    res.json(sub);
  } catch (e) { res.status(500).send(e.message); }
});

app.delete("/admin/subcategories/:id", authenticateToken, async (req, res) => {
  try {
    await SubCategory.findByIdAndDelete(req.params.id);
    await Item.deleteMany({ subCategoryId: req.params.id });
    res.json({ success: true });
  } catch (e) { res.status(500).send(e.message); }
});

// Items
app.get("/admin/items", authenticateToken, async (req, res) => {
  try {
    const items = await Item.find().populate('categoryId', 'name').populate('subCategoryId', 'name');
    res.json(items);
  } catch (e) { res.status(500).send(e.message); }
});

app.post("/admin/items", authenticateToken, async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.json(item);
  } catch (e) { res.status(500).send(e.message); }
});

app.put("/admin/items/:id", authenticateToken, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (e) { res.status(500).send(e.message); }
});

app.delete("/admin/items/:id", authenticateToken, async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).send(e.message); }
});


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
