import express from "express";
import {
  getProducts,
  createProduct,
  editProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.put("/:name", editProduct);
router.delete("/:name", deleteProduct);

export default router;
