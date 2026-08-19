import db from "../config/firebase.js";

export const getProducts = async (req, res) => {
  try {
    const snapshot = await db.collection("products").get();
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || !price) {
      return res
        .status(400)
        .json({ error: "Product name and price are required" });
    }
    if (typeof name !== "string" || typeof price !== "number") {
      return res.status(400).json({
        error: "Product name must be a string and price must be a number",
      });
    }
    if (name.trim() === "") {
      return res.status(400).json({ error: "Product name cannot be empty" });
    }
    if (price <= 0) {
      return res
        .status(400)
        .json({ error: "Product price must be a positive number" });
    }
    const productRef = await db.collection("products").add({
      name,
      price,
    });
    res.status(201).json({ id: productRef.id, name, price });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const editProduct = async (req, res) => {
  const { name } = req.params;
  const { name: newName, price } = req.body;
  if (!price) {
    return res.status(400).json({ error: "Product price are required" });
  }
  if (typeof price !== "number") {
    return res.status(400).json({
      error: "Product price must be a number",
    });
  }
  if (newName !== undefined && newName.trim() === "") {
    return res.status(400).json({ error: "Product name cannot be empty" });
  }
  if (price <= 0) {
    return res.status(400).json({ error: "Price must be a positive number" });
  }
  try {
    const snapshot = await db
      .collection("products")
      .where("name", "==", name)
      .get();
    if (snapshot.empty) {
      return res.status(404).json({ error: "Product not found" });
    }
    const updateData = { price };
    if (newName !== undefined) {
      updateData.name = newName;
    }
    const batch = db.batch();
    snapshot.forEach((doc) => {
      batch.update(doc.ref, updateData);
    });
    await batch.commit();
    res.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { name } = req.params;
    const snapshot = await db
      .collection("products")
      .where("name", "==", name)
      .get();
    if (snapshot.empty) {
      return res.status(404).json({ error: "Product not found" });
    }
    const batch = db.batch();
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
