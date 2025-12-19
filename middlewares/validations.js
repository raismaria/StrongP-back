import { prettifyError } from "zod/v4";
export function validateBodySchema(schema) {
  return async function (req, res, next) {
    const parsed = schema.safeParse(req.body);
    if (parsed.success) {
      next();
    } else {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        error: prettifyError(parsed.error),
      });
    }
  };
}

export function validateQuerySchema(schema) {
  return async function (req, res, next) {
    const parsed = schema.safeParse(req.query);
    if (parsed.success) {
      req.parsedQuery = parsed.data;
      next();
    } else {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        error: prettifyError(parsed.error),
      });
    }
  };
}
export function validateParamsSchema(schema) {
  return async function (req, res, next) {
    const parsed = schema.safeParse(req.params);
    if (parsed.success) {
      next();
    } else {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        error: prettifyError(parsed.error),
      });
    }
  };
}
