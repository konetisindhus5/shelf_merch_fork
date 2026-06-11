import { ApiError } from '../utils/errors.js';

/**
 * Zod request validation (§13 ALWAYS #1). Pass any of { body, query, params }.
 * Parsed (and coerced/stripped) values replace the originals.
 */
export function validate({ body, query, params } = {}) {
  return (req, _res, next) => {
    const issues = [];
    for (const [key, schema] of Object.entries({ body, query, params })) {
      if (!schema) continue;
      const result = schema.safeParse(req[key]);
      if (result.success) {
        if (key === 'query') {
          // Express 5 exposes req.query via a getter — replace its values in place.
          Object.keys(req.query).forEach((k) => delete req.query[k]);
          Object.assign(req.query, result.data);
        } else {
          req[key] = result.data;
        }
      } else {
        issues.push(
          ...result.error.issues.map((i) => ({
            in: key,
            path: i.path.join('.'),
            message: i.message,
          })),
        );
      }
    }
    if (issues.length) {
      return next(new ApiError(400, 'Validation failed', 'VALIDATION_ERROR', issues));
    }
    next();
  };
}
