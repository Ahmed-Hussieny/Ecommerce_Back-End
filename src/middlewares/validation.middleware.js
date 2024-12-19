const keys = ["body", "params", "query", "headers"];

export const validationMiddleware = (schema) => {
  return (req, res, next) => {
    try {
      let validationErrors = [];
      for (const key of keys) {
        const validationResult = schema[key]?.validate(req[key], {
          abortEarly: false,
        });
        if (validationResult?.error) {
          validationErrors.push(...validationResult.error.details);
        }
      }
      
      if (validationErrors.length) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: validationErrors.map((error) => error.message),
        });
      }
      next();
    } catch (error) {
      next({
        message: error.message,
        cause: 500,
      });
    }
  };
};
