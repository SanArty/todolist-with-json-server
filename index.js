//console.log("hello world")

/* 
  client side
    template: static template
    logic(js): MVC(model, view, controller): used to server side technology, single page application
        model: prepare/manage data,
        view: manage view(DOM),
        controller: business logic, event bindind/handling

  server side
    json-server
    CRUD: create(post), read(get), update(put, patch), delete(delete)


*/

//read
/* fetch("http://localhost:3000/todos")
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
    }); */

const APIs = (() => {
    const createTodo = (newTodo) => {
        return fetch("http://localhost:3000/todos", {
            method: "POST",
            body: JSON.stringify(newTodo),
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
    };

    const deleteTodo = (id) => {
        return fetch("http://localhost:3000/todos/" + id, {
            method: "DELETE",
        }).then((res) => res.json());
    };

    const editTodo = (id, newData) => {
        return fetch("http://localhost:3000/todos/" + id, {
            method: "PUT",
            body: JSON.stringify(newData),
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
    };

    const getTodos = () => {
        return fetch("http://localhost:3000/todos").then((res) => res.json());
    };

    /* ------------------- Completed ---------------------*/

    const createCompleted = (newCompleted) => {
        return fetch("http://localhost:3000/todos", {
            method: "POST",
            body: JSON.stringify(newCompleted),
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
    };

    const deleteCompleted = (id) => {
        return fetch("http://localhost:3000/todos/" + id, {
            method: "DELETE",
        }).then((res) => res.json());
    };

    const editCompleted = (id, newCompleted) => {
        return fetch("http://localhost:3000/todos/" + id, {
            method: "PUT",
            body: JSON.stringify(newData),
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
    };

    const getCompleted = () => {
        return fetch("http://localhost:3000/todos").then((res) => res.json());
    };


    return { createTodo, deleteTodo, getTodos, editTodo, createCompleted, deleteCompleted, getCompleted, editCompleted};
})();

//IIFE
//todos
/* 
    hashMap: faster to search
    array: easier to iterate, has order


*/
const Model = (() => {
    class State {
        #todos; //private field
        #onChange; //function, will be called when setter function todos is called

        constructor() {
            this.#todos = [];
        }
        get todos() {
            return this.#todos;
        }
        set todos(newTodos) {
            // reassign value
            console.log("setter function");
            this.#todos = newTodos;
            this.#onChange?.(); // rendering
        }

        subscribe(callback) {
            //subscribe to the change of the state todos
            this.#onChange = callback;
        }
    }

    class State2 {

        #completed;
        #onChange2;
        // -------------------- Completed -----------------
        constructor() {
            this.#completed = [];
        }
        get completed() {
            return this.#completed;
        }
        set completed(newCompleted) {
            // reassign value
            console.log("setter function");
            this.#completed = newCompleted;
            this.#onChange2?.(); // rendering
        }

        subscribe(callback) {
            //subscribe to the change of the state todos
            this.#onChange2 = callback;
        }

    }
    const { getTodos, createTodo, deleteTodo, editTodo, getCompleted, deleteCompleted, editCompleted, createCompleted } = APIs;
    return {
        State,
        getTodos,
        createTodo,
        deleteTodo,
        editTodo,
        State2,
        getCompleted,
        deleteCompleted,
        editCompleted,
        createCompleted
    };
})();
/* 
    todos = [
        {
            id:1,
            content:"eat lunch"
        },
        {
            id:2,
            content:"eat breakfast"
        }
    ]

*/
const View = (() => {
    const todolistEl = document.querySelector(".todo-list");
    const completedlistEl = document.querySelector(".completed-list");
    const submitBtnEl = document.querySelector(".submit-btn");
    const inputEl = document.querySelector(".input");
    const inputEdit = document.querySelector(".editText");

    const renderTodos = (todos) => {
        let todosTemplate = "";
        todos.forEach((todo) => {
            const liTemplate = `<li><span>${todo.content}</span>
            <input class = editText /><button class="edit-btn" id="${todo.id}">edit</button>
            <button class="delete-btn" id="${todo.id}">delete</button> 
            <button class="move-btn" id="${todo.id}">move</button>
            </li>`;
            todosTemplate += liTemplate;
        });
        if (todos.length === 0) {
            todosTemplate = "<h4>No tasks to display!</h4>";
        }
        todolistEl.innerHTML = todosTemplate;
        /*completedlistEl.innerHTML = todosTemplate;*/
    };


    const renderCompleted = (completed) => {
        let completedTemplate = "";
        completed.forEach((complete) => {
            const liTemplate = `<li><span>${complete.content}</span>
            <button class="edit-btn" id="${complete.id}">edit</button>
            <button class="delete-btn" id="${complete.id}">delete</button> 
            <button class="move-btn" id="${complete.id}">move</button>
            </li>`;
            completedTemplate += liTemplate;
        });
        if (completed.length === 0) {
            completedTemplate = "<h4>No tasks have been completed!</h4>";
        }
        completedlistEl.innerHTML = completedTemplate;
    };

    const clearInput = () => {
        inputEl.value = "";
    };

    return { renderTodos,submitBtnEl, inputEl, clearInput, todolistEl, inputEdit, renderCompleted, completedlistEl};
})();

const Controller = ((view, model) => {
    const state = new model.State();
    const init = () => {
        model.getTodos().then((todos) => {
            todos.reverse();
            state.todos = todos;
        });
    };

    const init2 = () => {
        model.getCompleted().then((completed) => {
            completed.reverse();
            state.completed = completed;
        });
    };

    const handleSubmit = () => {
        view.submitBtnEl.addEventListener("click", (event) => {
            /* 
                1. read the value from input
                2. post request
                3. update view
            */
            const inputValue = view.inputEl.value;
            model.createTodo({ content: inputValue }).then((data) => {
                state.todos = [data, ...state.todos];
                view.clearInput();
            });
        });
    };

    const handleDelete = () => {
        //event bubbling
        /* 
            1. get id
            2. make delete request
            3. update view, remove
        */
        view.todolistEl.addEventListener("click", (event) => {
            if (event.target.className === "delete-btn") {
                const id = event.target.id;
                console.log("id", typeof id);
                model.deleteTodo(+id).then((data) => {
                    state.todos = state.todos.filter((todo) => todo.id !== +id);
                });
            }
        });
    };

    const handleEdit = () => {
        //event bubbling
        /* 
            1. get id
            2. make put request
            3. update view, remove
        */
        view.todolistEl.addEventListener("click", (event) => {
            if (event.target.className === "edit-btn") {
                const id = event.target.id;
                console.log("id", typeof id);

                var element = document.getElementsByClassName('editText');
                console.log(element);

                model.editTodo(+id, {content: 'changed'}).then((data) => {
                    state.todos = state.todos.filter((todo) => todo.id !== +id);
                    state.todos = [data, ...state.todos];
                });
            }
        });
    };

    const handleMove = () => {
        view.todolistEl.addEventListener("click", (event) => {
            if (event.target.className === "move-btn") {
                const id = event.target.id;
                console.log(this.textContent);
                model.createCompleted(id.textContent).then((data) => {
                    state.completed = [data, ...state.completed];
                });
                model.deleteTodo(+id).then((data) => {
                    state.todos = state.todos.filter((todo) => todo.id !== +id);
                })
            }
        });
    };



    const bootstrap = () => {
        init();
        init2();
        handleSubmit();
        handleDelete();
        handleEdit();
        handleMove();

        state.subscribe(() => {
            view.renderTodos(state.todos);
            view.renderCompleted(state.completed);
        });
    };
    return {
        bootstrap,
    };
})(View, Model); //ViewModel

Controller.bootstrap();
