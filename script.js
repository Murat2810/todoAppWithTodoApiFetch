const input = document.querySelector("#input");
const btn = document.querySelector("#btn");
const deleteBtn = document.querySelector("#deleteBtn");
const ul = document.querySelector("#list");

//
let todosLocal = [];

// holt Daten vom Server
function loadTodos() {
  fetch("http://localhost:4730/todos")
    .then((res) => res.json())
    .then((todosFromApi) => {
      //Datensatz vom Server ins lokale Datensatz kopieren
      todosLocal = todosFromApi;

      //Datensatz im Browser anzeigen
      renderTodos();
    });
}

//ausgelagerte von cb.addEventListener("change", cbChangeHandler)
const cbChangeHandler = function (e) {
  const todoId = e.target.id;
  const todo = todosLocal.find(function (item) {
    return item.id.toString() === todoId.toString();
  });
  if (todo) {
    todo.done = e.target.checked;
    fetch(`http://localhost:4730/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        ...todo,
      }),
    })
      .then((res) => res.json())
      .then((newTodoApi) => {
        loadTodos();
      });
  }
};

// Checkbox hinzugefügt, addEventlister Handlerfuction ausgelagert
function renderTodos() {
  ul.innerHTML = "";
  todosLocal.forEach((todo) => {
    const item = document.createElement("li");
    const description = document.createTextNode(todo.description);
    item.appendChild(description);
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = todo.done;
    cb.id = todo.id;
    cb.addEventListener("change", cbChangeHandler);
    item.appendChild(cb);
    ul.appendChild(item);
  });
}

loadTodos();

// Todo Zeile (inkl. Text) in Liste einfügen
btn.addEventListener("click", () => {
  const newTodoText = input.value;
  const newTodo = {
    description: newTodoText,
    done: false,
  };

  fetch("http://localhost:4730/todos", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(newTodo),
  })
    .then((res) => res.json())
    .then((newTodoApi) => {
      loadTodos();
    });
});

// delete Button ClickHandler
deleteBtn.addEventListener("click", () => {
  const itemsDone = todosLocal.filter(function (item) {
    return item.done === true;
  });

  // Array.isArray(itemsDone) prüfe ob Array = Array!
  if (Array.isArray(itemsDone) && itemsDone.length > 0) {
    itemsDone.forEach(function (item) {
      fetch(`http://localhost:4730/todos/${item.id}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((newTodoApi) => {});
    });
    loadTodos();
  }
});
