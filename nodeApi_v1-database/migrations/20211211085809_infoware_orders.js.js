exports.up = knex =>
  knex.schema.createTable('orders', table => {
    table.increments();
    table.string('orderId').unique();
    table.integer('productId');
    table.integer('customerId');
    table.integer('addressId');
    table.integer('quantity');
    table.decimal('discountApplied', 20, 2);
    table.decimal('totalAmount', 20, 2);
    table.timestamp('createdAt', { useTz: true }).defaultTo(knex.fn.now());
  });

exports.down = knex => knex.schema.dropTable('orders');
