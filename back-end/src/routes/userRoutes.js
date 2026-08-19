import express from "express";
import {
  getUsers,
  createUser,
  editUser,
  deleteUser,
} from "../controllers/usersController.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.put("/:name", editUser);
router.delete("/:name", deleteUser);

export default router;
