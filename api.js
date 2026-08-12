import express from "express";
import cors from "cors";
import admin from "firebase-admin";

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

const routes = {
  "/": (req, res) => {
    res.send("Welcome to the API!");
  },
  "/users": (req, res) => {
    res.json([
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Doe" },
    ]);
  },
  "/products": (req, res) => {
    res.json([
      { id: 1, name: "Product A" },
      { id: 2, name: "Product B" },
    ]);
  },
};

Object.keys(routes).forEach((route) => {
  app.get(route, routes[route]);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
