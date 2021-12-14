var notesTemplate = Handlebars.compile(
    `
          {{#each notes}}
              <div class="note">
                  <span class="input"><textarea data-id="{{ this.id }}">{{ this.content }}</textarea></span>
                  <button class="removebtn" data-id="{{ this.id }}"><i class="fas fa-trash-alt"></i></button>
              </div>
          {{/each}}
      `
  );

const reload = (notes) => {
    console.log("reload")
    $("#notes").html(notesTemplate({ notes: notes }));
}

$("#noteInput").submit((event) => {
    event.preventDefault();
    console.log("Submitted");
    var noteContent = $("textarea").val();
    console.log(noteContent);
    axios.post("/api/notes/", {
        note: noteContent
    })
    .then ((response) => {
        reload (response.data)
    })
})

$("#notes").on("blur", "textarea", (event) => {
    console.log($(event.currentTarget).data())
    axios.put("/api/notes/" + $(event.currentTarget).data("id"), {
        note: $(event.currentTarget).val()
    })
    .then((response) => {
        reload(response.data)
    })
    .catch(() => {
        console.log("error")
    })
})

$("#notes").on("click", ".removebtn", (event) => {
    console.log("delete button click")
    axios.delete("/api/notes/" + $(event.currentTarget).data("id"))
    .then((response) => {
        reload(response.data)
    })
    .catch(() => {
        console.log("error")
    })
})