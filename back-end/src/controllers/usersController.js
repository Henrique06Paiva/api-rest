import db from "../config/firebase.js";

export const getUsers = async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getUser = getUsers;

export const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    const newUser = { name, email };
    const docRef = await db.collection("users").add(newUser);
    res.status(201).json({ id: docRef.id, ...newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const editUser = async (req, res) => {
  const { name } = req.params;
  const { newName } = req.body;
  const { email } = req.body;
  try {
    const snapshot = await db
      .collection("users")
      .where("name", "==", name)
      .get();
    if (snapshot.empty) {
      return res.status(404).json({ error: "Name not found" });
    }
    const batch = db.batch();
    snapshot.forEach((doc) => {
      batch.update(doc.ref, { name: newName, email });
    });
    await batch.commit();
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating User:", error);
    res.status(500).json({ error: "Failed to update User" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { name } = req.params;
    const snapshot = await db
      .collection("users")
      .where("name", "==", name)
      .get();
    if (snapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }
    const batch = db.batch();
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
