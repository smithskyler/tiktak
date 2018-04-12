
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('games', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.integer('host_id').unsigned().references('id').inTable('users');
      table.integer('guest_id').unsigned().references('id').inTable('users');
      table.integer('turn').unsigned().references('id').inTable('users');
      table.string('state');
      table.integer('winner').unsigned().references('id').inTable('users');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('games'),
  ]);
};
