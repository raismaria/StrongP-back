import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../handlers/products.js";
import { CheckAuth, isAdmin } from "../middlewares/auth.js";

const productRouter = Router();

productRouter
  .route("/")
  .get(getProducts)
  .post(CheckAuth, isAdmin, createProduct);
productRouter
  .route("/:id")
  .get(getProductById)
  .put(CheckAuth, isAdmin, updateProduct)
  .delete(CheckAuth, isAdmin, deleteProduct);

export default productRouter;
