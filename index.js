// Express - require modules and packages
const express = require("express");
const app = express();
const fs = require("fs");
const port = 3000;
const axios = require('axios');

const NoteRouter = require("./router/NoteRouter");
const NoteService = require("./noteservice");


// Express - middleware set up
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));

// Express-handlebars
const { engine } = require("express-handlebars")
app.engine('handlebars', engine({defaultLayout: "main"}));
app.set('view engine', 'handlebars');
app.set("views", "./views");

// connect to databse via knex
const knexConfig = require("./knexfile").development;
const knex = require("knex")(knexConfig);

const noteService = new NoteService(knex);

// Basic Auth
const basicAuth = require("express-basic-auth");
const AuthChallenger = require("./AuthChallenger");
app.use(basicAuth({
    authorizeAsync: true,
    authorizer: AuthChallenger(knex),
    challenge: true,
}));


app.get("/", (request, response) => {
    noteService.list(request.auth.user).then((data) => {
        console.log(data, 'index')
        return response.render("index", {
            user: request.auth.user,
            notes: data,
        })
    })
});



app.use("/api/notes", new NoteRouter(noteService).router())

app.listen(port, () => {
    console.log(`Application listening to: http://localhost:${port}`)
})

module.exports = app;