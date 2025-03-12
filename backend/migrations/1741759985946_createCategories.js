/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("categories", {
    id: { type: "serial", primaryKey: true },
    name: { type: "varchar(50)", notNull: true },
    user_id: {
      type: "integer",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint(
    "categories",
    "unique_user_category",
    "UNIQUE (user_id, name)"
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("categories");
  pgm.dropConstraint("categories", "unique_user_category");
};
