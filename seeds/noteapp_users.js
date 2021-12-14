exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('members').insert([
        {username: 'moryah', password: 'password'},
        {username: 'pris', password: 'password'},
        {username: 'sam', password: 'password'},
      ])
    .then(function () {
      return knex('notes').insert([
        {user_id: 1, content: 'Hello World!'},
      ]);
      });
    })
};
