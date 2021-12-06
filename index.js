// Express - require modules and packages
const express = require("express");
const app = express();
const fs = require("fs");
const port = 3000;
const axios = require('axios');

const NoteRouter = require("./router/NoteRouter");
const NoteService = require("./noteservice");
const noteService = new NoteService("./note.json", fs)

// Express - middleware set up
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));

// Express-handlebars
const { engine } = require("express-handlebars")
app.engine('handlebars', engine({defaultLayout: "main"}));
app.set('view engine', 'handlebars');
app.set("views", "./views");

// Basic Auth
const basicAuth = require("express-basic-auth");
app.use(basicAuth({
    authorizer: myAuthorizer,
    challenge: true,
}));

function myAuthorizer(username, password) {
    const users = fs.readFileSync('./user.json', 'utf-8', async (error, data) => {
        if (error) {
            throw new error ("myAuthorizer")
        }
        return data
    })

    let parsed = JSON.parse(users);

    return parsed.some( (user) => user.username === username && user.password === password)
}



app.get("/", (request, response) => {
    noteService.list(request.auth.user).then((data) => {
        return response.render("index", {
            user: request.auth.user,
            notes: data
        })
    })
});

app.use("/api/notes", new NoteRouter(noteService).router())

app.listen(port, () => {
    console.log(`Application listening to: http://localhost:${port}`)
})

module.exports = app;