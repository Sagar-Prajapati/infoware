exports.up = knex =>
  knex.schema
    .createTable('customers', table => {
      table.increments();
      table.string('name');
      table.string('email').unique();
      table.string('phone');
      table.string('password');
      table.timestamp('createdAt', { useTz: true }).defaultTo(knex.fn.now());
    })
    .createTable('addresses', table => {
      table.increments();
      table.integer('customerId');
      table.string('streetAddress');
      table.string('locality');
      table.string('postalCode');
      table.string('city');
      table.string('state');
      table.string('country');
      table.timestamp('createdAt', { useTz: true }).defaultTo(knex.fn.now());
      table.foreign('customerId').references('customers.id');
    })
    .createTable('customer_tokens', table => {
      table.increments();
      table.integer('customerId');
      table.string('token');
      table.timestamp('createdAt', { useTz: true }).defaultTo(knex.fn.now());
      table.foreign('customerId').references('customers.id');
    });

exports.down = knex =>
  knex.schema
    .dropTable('customer_tokens')
    .dropTable('addresses')
    .dropTable('customers');
