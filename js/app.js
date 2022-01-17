/* 참고 사이트
   : https://medium.com/@nitinpatel_20236/challenge-of-building-a-calendar-with-pure-javascript-a86f1303267d */


const todoArea = document.querySelector(".todo-area");
const preMonthBtn = document.querySelector("#previous");
const nextMonthBtn = document.querySelector("#next");

const today = new Date();
let thisDate = today.getDate();
let thisMonth = today.getMonth();
let thisMonthStr = String(thisMonth + 1).padStart(2, "0");
let thisYear = today.getFullYear();

const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
let onDateKey;

let toDos = [];
const toDoForm = document.querySelector("#todo-form");
const toDoInput = toDoForm.querySelector("input");
const toDoList = document.querySelector("#todo-list");
const checkboxArr = document.querySelectorAll("input[type='checkbox']");

let deviceSize = window.matchMedia("screen and (max-width: 1023px)");

const TODOS_KEY = "toDos";
const HIDDEN_STYLE = "hidden";


//////month select
const monthAndYear = document.querySelector("#monthAndYear");
showCalendar(thisMonth, thisYear);

const selectMonth = document.querySelector(".seletMonth");
selectMonth.addEventListener("change", function(e) {
    const value = e.target.value;
    const yearMonArr = value.split("-");
    const selectedYear = Number(yearMonArr[0]);
    const selectedMonth = Number(yearMonArr[1]-1);
    thisMonth = selectedMonth;
    thisYear = selectedYear;
    showCalendar(selectedMonth, selectedYear);
})
   
   
//////calendar
function next() {
    thisYear = (thisMonth === 11) ? thisYear + 1 : thisYear;
    thisMonth = (thisMonth + 1) % 12;
    thisStrMonth = String(thisMonth +1).padStart(2, "0");
    console.log(thisStrMonth);
    selectMonth.value = `${thisYear}-${thisStrMonth}`;
    showCalendar(thisMonth, thisYear);
};

function previous() {
    thisYear = (thisMonth === 0) ? thisYear - 1 : thisYear;
    thisMonth = (thisMonth === 0) ? 11 : thisMonth - 1;
    thisStrMonth = String(thisMonth +1).padStart(2, "0");
    selectMonth.value = `${thisYear}-${thisStrMonth}`;
    showCalendar(thisMonth, thisYear);
};

function showCalendar(month, year) {
    let firstDay = (new Date(year, month)).getDay();
    
    const tBody = document.querySelector(".cal-body");
    tBody.innerHTML = "";

    monthAndYear.innerHTML = "";
    const spanYear = document.createElement("span");
    const spanMonth = document.createElement("span");

    spanYear.innerHTML = year;
    spanMonth.innerHTML = String(month + 1).padStart(2, "0");
    monthAndYear.appendChild(spanYear);
    monthAndYear.appendChild(spanMonth);

    let date = 1;
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");

        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                const cell = document.createElement("td");
                const cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);

            } else if (date > daysInMonth(month, year)) {
                break;

            } else {
                const cell = document.createElement("td");
                const cellText = document.createTextNode(date);
                cell.addEventListener("click", clickDate);

                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add("today-bg");
                };

                let dateKey = `${year}년 ${spanMonth.innerHTML}월 ${date}일`;
                let storageValue = localStorage.getItem(dateKey);
                if (storageValue && storageValue !== "[]") {
                    cell.classList.add("haveTodo");
                } else {
                    cell.classList.remove("haveTodo");
                }

                cell.appendChild(cellText);
                row.appendChild(cell);
                date++;
            };

            if(row.children[0]) {
                row.children[0].classList.add("sun-red");
            };
    
            if(row.children[6]) {
                row.children[6].classList.add("sat-blue");
            };
        };
        tBody.appendChild(row);
        
        
    }
}

function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}


function clickDate(e) {
    const cell = e.target;
    const date = e.target.innerText;
    const month = monthAndYear.children[1].innerText;
    const year = monthAndYear.children[0].innerText;

    const clickedCell = document.querySelector(".clicked-bg");
    const dateSpan = todoArea.querySelector("h2");

    if (clickedCell) {
        dateSpan.innerHTML = `${year}년 ${month}월 ${date}일`;

        cell.classList.toggle("clicked-bg");
        clickedCell.classList.remove("clicked-bg");

        if (cell === clickedCell) {
            dateSpan.innerHTML = `${thisYear}년 ${thisMonthStr}월 ${thisDate}일`;   
        };
    } else {
        dateSpan.innerHTML = `${year}년 ${month}월 ${date}일`;
        cell.classList.toggle("clicked-bg");
    };

    onDateKey = dateSpan.innerHTML;

    if (onDateKey) {
        clickDateShowToDo();
    };
};

if (today) {
    const dateSpan = todoArea.querySelector("h2");
    dateSpan.innerHTML = `${thisYear}년 ${thisMonthStr}월 ${thisDate}일`;
    onDateKey = dateSpan.innerHTML;

    const savedToDos = localStorage.getItem(onDateKey);
    if (savedToDos !== null) {
        let parsedToDos = JSON.parse(savedToDos);
        toDos = parsedToDos; 
        parsedToDos.forEach(paintToDo); 
    };
};

preMonthBtn.addEventListener("click", previous);
nextMonthBtn.addEventListener("click", next);


//////////////////////////////////////////////////////////////////
/* to do list */


function saveToDos() {
    localStorage.setItem(onDateKey, JSON.stringify(toDos));
    haveTotoCell(onDateKey)
};

function deleteToDo(e) {
    const thisLi = e.target.parentElement;
    thisLi.remove();
    toDos = toDos.filter((todo) => todo.id !== parseInt(thisLi.id)); 
    saveToDos(); 
};

function checkedI(e) {
    let thisCheckedId = parseInt(e.target.id);
    let index = toDos.findIndex(i => i.checkedId === thisCheckedId);
    let obj = toDos[index];
    const trueValue = true;
    const falseValue = false;
    if (obj.checked) {
        obj.checked = falseValue
    } else {
        obj.checked = trueValue;
    }
    saveToDos();
};

function paintToDo(newTodo) { 
    const li = document.createElement("li");
    li.id = newTodo.id; 

    const span = document.createElement("span");
    span.innerText = newTodo.text; 

    const btn = document.createElement("button");
    btn.innerText = "×";
    btn.addEventListener("click", deleteToDo);

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    const checkId = newTodo.checkedId;
    checkBox.id = checkId;
    const thisCheck = newTodo.checked;
    checkBox.checked = thisCheck;
    checkBox.addEventListener("click", checkedI);
    
    const label = document.createElement("label");
    label.htmlFor = checkId;

    const span2 = document.createElement("span");
    span2.className = "checkBox";

    const editBtn = document.createElement("span");
    editBtn.className = "editBtn";
    editBtn.addEventListener("click", paintChangeInput);

    li.appendChild(checkBox);
    li.appendChild(label);
    label.appendChild(span2);
    label.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(btn); 
    toDoList.appendChild(li); 
};

function handleToDoSubmit(e) {
    e.preventDefault();
    const newTodo = toDoInput.value; 
    toDoInput.value = ""; 
    let newToDoObj = {
        text: newTodo,
        id: Date.now(),
        checkedId: Math.floor(Date.now()/2),
        checked: false,
    }
    toDos.push(newToDoObj);
    paintToDo(newToDoObj); 
    saveToDos();
};

function haveTotoCell(e) {
    const cell = document.querySelectorAll("td");
    const regex = /[^0-9]/g;
    const keyCode = String(e.replace(regex, ""));
    const keyCodeOfDate = keyCode.slice(-2);
    
    for(let i = 0; i <= cell.length; i++) {
        if(cell[i].innerText === keyCodeOfDate) {
            cell[i].classList.add("haveTodo");
            break;
        };
    };
    
};

toDoForm.addEventListener("submit", handleToDoSubmit);

function clickDateShowToDo() {
    toDoList.innerHTML = "";
    toDos = [];

    const savedToDos = localStorage.getItem(onDateKey);

    if (savedToDos !== null) {
        const parsedToDos = JSON.parse(savedToDos);
        toDos = parsedToDos; 
        parsedToDos.forEach(paintToDo); 
    };
}

//////////////////////////////////////////////
/* delete all btn */
const deleteAllBtn = document.querySelector("#delete-all");

function deleteAll() {
    toDoList.innerHTML = "";
    toDos = [];
    localStorage.removeItem(onDateKey);
}

deleteAllBtn.addEventListener("click", deleteAll);

////////////////////////////////////////////////
/* edit event */
let changedObj;

function clickEditBtn(e) {
    e.preventDefault();
    
    const inputValue = e.target.form[0].value;
    const span = e.path[2].children[1];
    console.log(inputValue);

    
    span.innerText = String(inputValue);
    span.classList.remove(HIDDEN_STYLE);
    console.dir(span); 
    
    e.target.parentElement.remove();
    saveToDos();
};

function changeSubmit(e) {
    e.preventDefault();

    const inputValue = e.target.lastChild.value;
    const span = e.path[1].children[1].lastChild;

    changedObj.text = inputValue;
    span.innerText = String(inputValue);

    e.target.remove();
    saveToDos();
}


function paintChangeInput(c) {
    const thisLi = c.target.offsetParent;
    const thisSpan = thisLi.children[1].lastChild;
    const form = document.createElement("form");
    const input = document.createElement("input");

    form.id = 'changeList';
    form.addEventListener("submit", changeSubmit);

    input.type = "text";
    input.value = String(thisSpan.innerText);
    input.autofocus = 'true';
    input.className = "change-input";

    const thisId = parseInt(thisLi.id);
    const index = toDos.findIndex(i => i.id === thisId);
    changedObj = toDos[index];

    form.appendChild(input);
    thisLi.appendChild(form);
};


function promptFunc(span) {
    const spanText = String(span.target.innerText);
    const newText = window.prompt("Edit To Do List", spanText);

    const thisId = parseInt(span.target.offsetParent.id);
    const index = toDos.findIndex(i => i.id === thisId);

    if (newText === null) {
        span.target.innerText = spanText;
    } else {
        span.target.innerText = newText;
        changedObj = toDos[index];
        changedObj.text = newText;
    }
    
    span.target.classList.remove(HIDDEN_STYLE);
    saveToDos();
}


//옆으로 밀기 이벤트 - touch
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;

let moveType = -1;
let hSlope = ((window.innerHeight / 2) / window.innerWidth).toFixed(2) * 0.3;


function getMoveType(x, y) {
    moveType = -1;
    let nDis = x + y;
    if(nDis < 30) {return moveType};

    let slope = Math.abs(parseFloat((y / x).toFixed(2), 10)); 
    console.log("slope", slope);
    console.log("hslope", hSlope);
    if(slope > hSlope) {
        moveType = 1;
    } else {
        moveType = 0;
    }

    return moveType;
}

function touchStart(e) {
    startX = e.changedTouches[0].pageX;
    startY = e.changedTouches[0].pageY;
};

function touchEnd (e) {
    endX = e.changedTouches[0].pageX;
    endY = e.changedTouches[0].pageY;
    touchMove(e);
};

function touchMove(e) {
    let moveX = startX - endX;
    let moveY = startY - endY;
    moveType = getMoveType(moveX, moveY);
    console.log(moveType);

    const target = e.target.tagName;
    if (target == 'SPAN' && moveType === 0) {
        console.log("a",moveType);
        e.target.classList.add(HIDDEN_STYLE);
        promptFunc(e);
    };
};
   
toDoList.addEventListener("touchstart", touchStart, false);
toDoList.addEventListener("touchend", touchEnd, false);


//////custom popup page
const mainTitle = document.querySelector(".header--text-area h1");
const popupPage = document.querySelector(".custom-popup-page")
const editTitleForm = document.querySelector("#editTitleForm");
const editTitleInput = document.querySelector("#editTitle");
const colorBox = document.querySelectorAll(".colorBox");

const MAIN_COLOR = "--main-color";
const SUB_COLOR = "--sub-color";
const TITLE = "title";

const savedTitle = localStorage.getItem(TITLE);

function handleTitleClick(e) {
    e.preventDefault();
    const value = e.target.firstElementChild.value;
    localStorage.setItem(TITLE, value);
    mainTitle.innerText = value;
};

let savedMainColor = localStorage.getItem(MAIN_COLOR);
let savedSubColor = localStorage.getItem(SUB_COLOR);


function handlePopupClick() {
    popupPage.classList.toggle(HIDDEN_STYLE);
    editTitleInput.value = savedTitle;
};

function handleColorClick() {
    const mainColor = this.children[0].style.backgroundColor;
    const subColor = this.children[1].style.backgroundColor;

    document.documentElement.style.setProperty(MAIN_COLOR, mainColor);
    document.documentElement.style.setProperty(SUB_COLOR, subColor);
    
    localStorage.setItem(MAIN_COLOR, mainColor);
    localStorage.setItem(SUB_COLOR, subColor);

    popupPage.classList.toggle(HIDDEN_STYLE);
};

if(localStorage.getItem(TITLE)) {
    mainTitle.innerText = localStorage.getItem(TITLE);
};

if(!savedMainColor) {
    localStorage.setItem(MAIN_COLOR, "#654ea3");
    localStorage.setItem(SUB_COLOR, "#eaafc8");    
}else {
    document.documentElement.style.setProperty(MAIN_COLOR, savedMainColor);
    document.documentElement.style.setProperty(SUB_COLOR, savedSubColor);
}

mainTitle.addEventListener("click", handlePopupClick);
colorBox.forEach(target => {
    target.addEventListener("click", handleColorClick, {
        captue: true
    });
});
editTitleForm.addEventListener("submit", handleTitleClick);
//////