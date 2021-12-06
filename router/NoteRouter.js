const express = require("express")

class NoteRouter {

    constructor(noteService){
        this.noteService = noteService;
    }

    router(){
        const router = express.Router();

        router.get("/", this.getNote.bind(this));
        router.post("/", this.postNote.bind(this));
        router.put("/:id", this.updateNote.bind(this));
        router.delete("/:id", this.deleteNote.bind(this));

        return router;

    }

    getNote(request, response){
        return this.noteService
        .list(request.auth.user)
        .then((notes) => {
            response.json(notes);
        })
        .catch("error")
    }

    postNote(request, response){
        return this.noteService
        .add(request.auth.user, request.body.note)
        .then(() => {
            this.noteService
            .list(request.auth.user)
            .then((notes) => {
                response.json(notes);
            })
        })
        .catch("error")
    }

    updateNote(request, response){
        return this.noteService
        .update(request.params.id, request.body.note, request.auth.user)
        .then(() => this.noteService.list(request.auth.user))
        .then((notes) => response.json(notes))
        .catch("error")
    }

    deleteNote(request, response){
        return this.noteService
        .remove(request.params.id, request.auth.user)
        .then(() => this.noteService.list(request.auth.user))
        .then((notes) => response.json(notes))
        .catch("error")
    }
}

module.exports = NoteRouter;