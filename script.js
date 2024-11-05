const todoList = document.getElementById("todo-list");
const addTodoButton = document.getElementById("add-todo");
const titleInput = document.getElementById("todo-title");
const detailsInput = document.getElementById("todo-details");
const dueDateInput = document.getElementById("todo-due-date");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const clockElement = document.getElementById("clock");
const appTitleInput = document.getElementById("app-title");

let todos = [];

// 로컬 스토리지에서 할 일 목록 불러오기
function loadTodos() {
  todos = JSON.parse(localStorage.getItem("todos")) || [];
  renderTodos();
}

// 앱 타이틀 로컬 스토리지에서 불러오기
function loadAppTitle() {
  const title = localStorage.getItem("appTitle") || "Todo App";
  appTitleInput.value = title;
}

// 앱 타이틀 저장
function saveAppTitle() {
  localStorage.setItem("appTitle", appTitleInput.value);
}

// 시계 업데이트
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// 할 일 추가
function addTodo() {
  const title = titleInput.value;
  const details = detailsInput.value;
  const dueDate = dueDateInput.value;

  if (title) {
    const todo = {
      title,
      details,
      dueDate,
      status: "incomplete",
      createdAt: new Date(),
    };

    todos.push(todo);
    saveTodosToLocalStorage();
    renderTodos();
    clearInputs();
  } else {
    alert("제목을 입력하세요.");
  }
}

// 할 일 목록 렌더링
function renderTodos() {
  todoList.innerHTML = "";
  const filteredTodos = filterTodos();
  filteredTodos.forEach((todo, index) => {
    const todoItem = document.createElement("div");
    todoItem.className = `todo-item ${
      todo.status === "completed" ? "completed" : ""
    }`;
    todoItem.innerHTML = `
            <div class="todo-content">
                <strong>${todo.title}</strong>
                <p>${todo.details}</p>
                <p class="due-date">
                    <span class="material-icons">event</span>
                    ${todo.dueDate}
                </p>
            </div>
            <div class="todo-actions">
                <button onclick="toggleComplete(${index})" class="btn btn-complete">
                    <span class="material-icons">${
                      todo.status === "completed"
                        ? "check_circle"
                        : "radio_button_unchecked"
                    }</span>
                    ${todo.status === "completed" ? "완료됨" : "완료하기"}
                </button>
                <button onclick="enableEdit(${index})" class="btn btn-edit">
                    <span class="material-icons">edit</span>
                    수정
                </button>
                <button onclick="deleteTodo(${index})" class="btn btn-delete">
                    <span class="material-icons">delete</span>
                    삭제
                </button>
            </div>
            <div class="edit-fields" style="display: none;">
                <input type="text" value="${
                  todo.title
                }" class="input-field" placeholder="할 일 제목" />
                <textarea class="input-field" placeholder="세부 내용">${
                  todo.details
                }</textarea>
                <input type="date" value="${
                  todo.dueDate
                }" class="input-field" />
                <button onclick="saveEdit(${index})" class="btn btn-primary">저장</button>
                <button onclick="cancelEdit(this)" class="btn btn-secondary">취소</button>
            </div>
        `;
    todoList.appendChild(todoItem);
  });
}

// 필터링
function filterTodos() {
  const searchTerm = searchInput.value.toLowerCase();
  const filterValue = filterSelect.value;
  return todos.filter((todo) => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm);
    const matchesFilter =
      filterValue === "all" ||
      (filterValue === "completed" && todo.status === "completed") ||
      (filterValue === "incomplete" && todo.status === "incomplete");
    return matchesSearch && matchesFilter;
  });
}

// 할 일 저장
function saveTodosToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// 완료 상태 토글
function toggleComplete(index) {
  todos[index].status =
    todos[index].status === "completed" ? "incomplete" : "completed";
  saveTodosToLocalStorage();
  renderTodos();
}

// 수정 활성화
function enableEdit(index) {
  const todoItem = todoList.children[index];
  const editFields = todoItem.querySelector(".edit-fields");
  editFields.style.display = "block";
}

// 수정 저장
function saveEdit(index) {
  const todoItem = todoList.children[index];
  const title = todoItem.querySelector(".edit-fields input[type='text']").value;
  const details = todoItem.querySelector(".edit-fields textarea").value;
  const dueDate = todoItem.querySelector(
    ".edit-fields input[type='date']"
  ).value;

  if (title) {
    todos[index] = {
      title,
      details,
      dueDate,
      status: todos[index].status,
      createdAt: todos[index].createdAt,
    };
    saveTodosToLocalStorage();
    renderTodos();
  } else {
    alert("제목을 입력하세요.");
  }
}

// 수정 취소
function cancelEdit(button) {
  const todoItem = button.closest(".todo-item");
  const editFields = todoItem.querySelector(".edit-fields");
  editFields.style.display = "none";
}

// 할 일 삭제
function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodosToLocalStorage();
  renderTodos();
}

// 입력 필드 초기화
function clearInputs() {
  titleInput.value = "";
  detailsInput.value = "";
  dueDateInput.value = "";
}

// 이벤트 리스너
addTodoButton.addEventListener("click", addTodo);
searchInput.addEventListener("input", renderTodos);
filterSelect.addEventListener("change", renderTodos);
appTitleInput.addEventListener("input", saveAppTitle); // 타이틀 변경 시 저장
window.onload = () => {
  loadTodos();
  loadAppTitle(); // 앱 타이틀 로드
  setInterval(updateClock, 1000);
};
