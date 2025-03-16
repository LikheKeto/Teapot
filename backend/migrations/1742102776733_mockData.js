/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = async (pgm) => {
  const { faker } = require("@faker-js/faker");

  // Insert a mock user and retrieve ID
  const userRes = await pgm.db.query(`
    INSERT INTO users (username, email, password) 
    VALUES ('mockuser', 'mockuser@example.com', '$2b$10$6yMCANWEncnIQBc8UxlplOmCbshR8mn.AZ.XmgLVIsiyVwrm1vRFi')
    RETURNING id;
  `);
  const userId = userRes.rows[0].id;

  // Insert 10 mock categories
  const categoryRes = await pgm.db.query(
    `INSERT INTO categories (name, user_id) VALUES 
    ('Work', $1),
    ('Personal', $1),
    ('Ideas', $1),
    ('Health', $1),
    ('Finance', $1),
    ('Travel', $1),
    ('Learning', $1),
    ('Projects', $1),
    ('Hobbies', $1),
    ('Miscellaneous', $1)
    RETURNING id;`,
    [userId]
  );

  // Retrieve inserted category IDs
  const categoryIds = categoryRes.rows.map((row) => row.id);

  // Insert 100 mock notes with random created_at and updated_at
  let noteInsertValues = [];
  for (let i = 1; i <= 100; i++) {
    const createdAt = faker.date.past(1);
    const updatedAt = faker.date.between({ from: createdAt, to: new Date() });
    const title = faker.lorem.sentence();
    const content = faker.lorem.paragraphs(3);
    noteInsertValues.push(
      `('${title}', '${content}', ${userId}, '${createdAt.toISOString()}', '${updatedAt.toISOString()}')`
    );
  }
  const noteRes = await pgm.db.query(
    `INSERT INTO notes (title, content, user_id, created_at, updated_at) 
    VALUES ${noteInsertValues.join(", ")} RETURNING id;`
  );

  // Retrieve inserted note IDs
  const noteIds = noteRes.rows.map((row) => row.id);

  // Assign random categories to notes (each note gets 1-3 categories)
  for (const noteId of noteIds) {
    let assignedCategories = new Set();
    let numCategories = Math.floor(Math.random() * 3) + 1; // Each note gets 1-3 categories
    while (assignedCategories.size < numCategories) {
      let randomCategoryId =
        categoryIds[Math.floor(Math.random() * categoryIds.length)];
      assignedCategories.add(randomCategoryId);
    }
    for (const categoryId of assignedCategories) {
      await pgm.db.query(
        `INSERT INTO note_categories (note_id, category_id) VALUES ($1, $2)`,
        [noteId, categoryId]
      );
    }
  }
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = async (pgm) => {
  // Delete mock data in reverse order
  await pgm.db.query(
    "DELETE FROM note_categories WHERE category_id IN (SELECT id FROM categories WHERE user_id = (SELECT id FROM users WHERE username = 'mockuser'))"
  );
  await pgm.db.query(
    "DELETE FROM notes WHERE user_id = (SELECT id FROM users WHERE username = 'mockuser')"
  );
  await pgm.db.query(
    "DELETE FROM categories WHERE user_id = (SELECT id FROM users WHERE username = 'mockuser')"
  );
  await pgm.db.query("DELETE FROM users WHERE username = 'mockuser'");
};
