const fs = require ("fs");

class NoteService {
    constructor (file){
        this.file = file;
        this.initPromise = null;
        this.init();
    }

    init() {
        if (this.initPromise === null) {
            this.initPromise = new Promise((resolve, reject) => {
                this.read()
                .then(() => {
                    resolve ()
                })
                .catch(() => {
                    this.notes = {};
                    this.write()
                    .then (resolve)
                    .catch (reject)
                })
            })
        }
        return this.initPromise;
    }


    write() {
        return new Promise((resolve, reject) => {
            fs, fs.writeFile(this.file, JSON.stringify(this.notes), "utf8", (error) => {
                if (error) {
                    reject (error)
                } else {
                    resolve (this.notes);
                }
            })
        })
    }

    read() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.file, "utf8", (error, data) => {
                if (error) {
                    reject (error)
                }
                try {
                    this.notes = JSON.parse(data)
                } catch (error) {
                    return reject (error)
                }
                return resolve (this.notes);
            })
        })
    }

    list(user) {
       if (typeof user !== "undefined") {
           return this.init() 
           .then(() => {
               return this.read();
           })
           .then (() => {
               if (typeof this.notes[user] === "undefined") {
                   return [];
               } else {
                   return this.notes[user]
               }
           })
       } else {
           return this.init()
           .then(() => {
               return this.read();
           })
       }
    }

    add(user, note){
        return this.init()
        .then(() => {
            if (typeof this.notes[user] === "undefined"){
                this.notes[user] = [];
            }
            this.notes[user].push(note);
            return this.write();
        })
    }

    update(index, note, user){
        return this.init().then(() =>{
            this.notes[user][index] = note;
            return this.write()
        })
    }

    remove(index, user){
        return this.init().then(() => {
            return this.read().then(() =>{
                this.notes[user].splice(index, 1);
                return this.write()
            })
        })
    }
}


module.exports = NoteService;