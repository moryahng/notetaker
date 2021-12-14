const AuthChallenger = function () {
    return async function (username, password, callback) {
        const knexConfig = require("./knexfile").development;
        const knex = require("knex")(knexConfig)
      try {
        let query = await knex
          .select("username")
          .from("members")
          .where("username", username)
          .where("password", password);
        if (query.length === 1) {
          return callback(null, true);
        } else {
          return callback(null, false);
        }
      } catch (error) {
        console.log(error);
      }
    };
  };
  module.exports = AuthChallenger;