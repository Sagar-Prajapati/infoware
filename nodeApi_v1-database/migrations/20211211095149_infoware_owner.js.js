exports.up = knex =>
  knex.schema
    .createTable('owner_accounts', table => {
      table.increments();
      table.string('name');
      table.string('email').unique();
      table.string('phone');
      table.string('role');
      table.string('password');
      table.timestamp('createdAt', { useTz: true }).defaultTo(knex.fn.now());
    })
    .createTable('owner_tokens', table => {
      table.increments();
      table.integer('ownerId');
      table.string('token');
      table.timestamp('createdAt', { useTz: true }).defaultTo(knex.fn.now());
      table.foreign('ownerId').references('owner_accounts.id');
    });

exports.down = knex =>
  knex.schema.dropTable('owner_tokens').dropTable('owner_accounts');
