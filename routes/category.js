import { Router } from "express";

import {
  validateBodySchema,
  validateParamsSchema,
} from "../middlewares/validations.js";
import { CheckAuth, isAdmin } from "../middlewares/auth.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../handlers/categories.js";
import { idParamsSchema } from "../validation/utils.js";
import { categorySchema } from "../validation/categories.js";

const categoriesRouter = Router();

categoriesRouter
  .route("/")
  .get(getCategories)
  .post(CheckAuth, isAdmin, validateBodySchema(categorySchema), createCategory);

categoriesRouter
  .route("/:id")
  .all(CheckAuth, validateParamsSchema(idParamsSchema))
  .get(getCategoryById)
  .put(validateBodySchema(categorySchema.partial()), updateCategory)
  .delete(deleteCategory);

export default categoriesRouter;
