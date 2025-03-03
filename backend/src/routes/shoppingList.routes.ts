import express from "express";
import {
  createShoppingList,
  getAllShoppingLists,
  getShoppingListById,
  deleteShoppingList,
} from "../controllers/shoppingList.controller";

const router = express.Router();

router.post("/", createShoppingList);
router.get("/", getAllShoppingLists);
router.get("/:id", getShoppingListById);
router.delete("/:id", deleteShoppingList);

export default router;
