class NoteService {
    constructor (knex){
        this.knex = knex;
    }

    async add(user, note){
        let query = await this.knex
        .select("id")
        .from("members")
        .where("members.username", user);
        console.log(query);
        //found user
        if (query.length === 1) {
            await this.knex
              .insert({
                content: note,
                user_id: query[0].id,
              })
              .into("notes");
          } else {
            throw new Error(`Cannot add a note to a user that doesn't exist!`);
          }
        }

    async list(user) {
        if (typeof user !== "undefined") {
            let query = this.knex
            .select("notes.id", "notes.content")
            .from("notes")
            .innerJoin("members", "notes.user_id", "members.id")
            .where("members.username", user)
            .orderBy("notes.id", "asc");
        
            return query
            .then((rows) => {
                console.log(rows, "pp");
                return rows.map((row) => ({
                  id: row.id,
                  content: row.content,
                }));
              });
            }
          }
    async update (id, note, user) {
        let query = this.knex
        .select("id")
        .from("member")
        .where("members.username", user);

        return query
        .then((rows) => {
            if (rows.length === 1) {
                return this.knex("notes")
                .where("id", id)
                .update({
                    content: note
                })
            }
        })
    }
    remove(id, user) {
        let query = this.knex
          .select("id")
          .from("members")
          .where("members.username", user);
    
        return query.then((rows) => {
          if (rows.length === 1) {
            return this.knex("notes").where("id", id).del();
          }
        });
      }


}


module.exports = NoteService;