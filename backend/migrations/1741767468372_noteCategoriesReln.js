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
  pgm.createTable("note_categories", {
    note_id: {
      type: "integer",
      notNull: true,
      references: "notes(id)",
      onDelete: "CASCADE",
    },
    category_id: {
      type: "integer",
      notNull: true,
      references: "categories(id)",
      onDelete: "CASCADE",
    },
  });
  pgm.createConstraint("note_categories", "note_categories_pkey", {
    primaryKey: ["note_id", "category_id"],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("note_categories");
  pgm.dropConstraint("note_categories", "note_categories_pkey");
};
