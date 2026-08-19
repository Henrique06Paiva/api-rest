import express from "express";
import cors from "cors";
import userRoutes from "./src/routes/userRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/products", productRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
