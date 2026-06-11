const FIND_OPS = [
  'find',
  'findOne',
  'findOneAndUpdate',
  'findOneAndReplace',
  'updateOne',
  'updateMany',
  'countDocuments',
];

/**
 * §3.7 Soft Deletes — adds `deletedAt`, excludes soft-deleted docs from all
 * default reads. Opt in to deleted docs with `.setOptions({ includeDeleted: true })`.
 */
export function softDeletePlugin(schema) {
  schema.add({ deletedAt: { type: Date, default: null } });

  const excludeDeleted = function (next) {
    if (this.getOptions().includeDeleted) return next();
    if (this.getFilter().deletedAt === undefined) {
      this.where({ deletedAt: null });
    }
    next();
  };

  for (const op of FIND_OPS) schema.pre(op, excludeDeleted);

  schema.methods.softDelete = function () {
    this.deletedAt = new Date();
    return this.save();
  };
}
