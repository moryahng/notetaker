exports.up = function(knex) {
    return knex.schema.createTable('notes', (table)=>{
        table.increments();
        table.integer('user_id').unsigned();
        table.foreign('user_id').references('members.id');
        table.string('content');
        table.timestamps(false, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('notes');
  };