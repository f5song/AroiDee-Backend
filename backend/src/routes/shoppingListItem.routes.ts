import express from "express";
import {
  addShoppingListItem,
  getShoppingListItems,
  updateShoppingListItem,
  deleteShoppingListItem,
} from "../controllers/shoppingListItem.controller";

const router = express.Router();

router.post("/", addShoppingListItem);
router.get("/:list_id", getShoppingListItems);
router.put("/:id", updateShoppingListItem);
router.delete("/:id", deleteShoppingListItem);

export default router;
