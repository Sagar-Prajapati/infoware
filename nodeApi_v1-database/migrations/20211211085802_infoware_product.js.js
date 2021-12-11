exports.up = knex =>
  knex.schema
    .createTable('product_categories', table => {
      table.increments();
      table.string('category');
      table.string('description');
    })
    .createTable('products', table => {
      table.increments();
      table.string('name');
      table.string('sku');
      table.integer('categoryId');
      table.string('description');
      table.string('currency');
      table.decimal('unitPrice', 20, 2);
      table.timestamp('createdAt', { useTz: true }).defaultTo(knex.fn.now());
      table.foreign('categoryId').references('product_categories.id');
    });

exports.down = knex =>
  knex.schema.dropTable('products').dropTable('product_categories');
