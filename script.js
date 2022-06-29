var uid = new ShortUniqueId();
// variables 
let colors = ["pink", "blue", "green", "black"];
let defaultColor = "black";
let cFilter = "";
let locked = false;
let deleteMode = false;
let addMode = false;
// let isLocked = false;
// elements 
let input = document.querySelector(".task_input");
let mainContainer = document.querySelector(".main-container");
let colorContainer = document.querySelector(".color-group_container");
let lockContainer = document.querySelector(".lock-container");
let unlockContainer = document.querySelector(".unlock-container");
let plusContainer = document.querySelector(".plus-container");
let deleteContainer = document.querySelector(".multiply-container");
let colorSelector = document.querySelector(".sright");
let Adder =  document.querySelector(".mainBox");

window.addEventListener("click",function(e) {

    if(mainContainer == e.target){ 
     Adder.style.display= "none";
    }

})

// event Listeners
input.addEventListener("keydown", function (e) {
    if (e.code == "Enter" && input.value) {
        console.log("task Value", input.value);
        let id = uid();
        Adder.style.display = "none";
        plusContainer.classList.remove("active");
        createTask(id, input.value, true ,  defaultColor);
        input.value = "";
        let defaultClass = document.querySelector(".dt");
        let selectorContainer = document.querySelector(".selected");
        selectorContainer.classList.remove("selected");
        defaultClass.classList.add("selected");
    }
})
// filtering 
colorContainer.addEventListener("click", function (e) {
    let element = e.target;
    console.log("e.target", element);
    if (element != colorContainer) {
        let filteredCardColor = element.classList[1];
        filterCards(filteredCardColor);
    }
})
lockContainer.addEventListener("click", function (e) {
    let numberOFElements = document.querySelectorAll(".task_main-container>div")
    for (let i = 0; i < numberOFElements.length; i++) {
        numberOFElements[i].contentEditable = false;
    }
    // ui match
    lockContainer.classList.add("active");
    unlockContainer.classList.remove("active");
})
unlockContainer.addEventListener("click", function (e) {
    let numberOFElements = document.querySelectorAll(".task_main-container>div")
    for (let i = 0; i < numberOFElements.length; i++) {
        numberOFElements[i].contentEditable = true;
    }
    lockContainer.classList.remove("active");
    unlockContainer.classList.add("active");
})
plusContainer.addEventListener("click", function (){
   let modal =  document.querySelector(".mainBox");
   addMode =! addMode;
   if(addMode){
   modal.style.display = "flex"; 
   plusContainer.classList.add("active");
   }
   else{
    modal.style.display = "none"; 
    plusContainer.classList.remove("active");
   }

})
deleteContainer.addEventListener("click", function (e) {
    deleteMode = !deleteMode;
    if (deleteMode) {
        deleteContainer.classList.add("active")
    } else {
        deleteContainer.classList.remove("active")
       

    }
})
// bhai plzz chal jaaa 👏👏 (Rajat)
colorSelector.addEventListener("click", function (e) {
    let selectedColor = document.querySelector(".selected");
    if(e.target.classList[0]== "smallboxes"){
        selectedColor.classList.remove("selected");
        e.target.classList.add("selected");
        defaultColor = e.target.classList[1];
    }
})
// helpers
function createTask(id, task, flag , defaultColor) {
    console.log("create task ran", id);
    // add to local storage
    let taskContainer = document.createElement("div");
    taskContainer.setAttribute("class", "task_container");
    mainContainer.appendChild(taskContainer);
    taskContainer.innerHTML = `<div class="task_header 
    ${defaultColor}"></div>
            <div class="task_main-container">
                <h3 class="task_id">#${id}</h3>
                <div class="text" contentEditable="true">${task}</div>
            </div>
    `;
    // addEventListener for color changes
    let taskHeader = taskContainer.querySelector(".task_header");
    let inputTask = taskContainer.querySelector(".task_main-container>div")
 
    
    // color
    let nextColor;
    // ****************color change********************
    taskHeader.addEventListener("click", function () {
     
        let cColor = taskHeader.classList[1];

        
        let idx = colors.indexOf(cColor);
        let nextIdx = (idx + 1) % 4;
        nextColor = colors[nextIdx];
        taskHeader.classList.remove(cColor);
        taskHeader.classList.add(nextColor);
       
        let idWalaElem = taskHeader.parentNode.children[1].children[0];
        let id = idWalaElem.textContent;
        id = id.split("#")[1];
       
        let tasksString = localStorage.getItem("tasks");
        let tasksArr = JSON.parse(tasksString)
       
        for (let i = 0; i < tasksArr.length; i++) {
            if (tasksArr[i].id == id) {
                tasksArr[i].color = nextColor;
                break;
            }
        }
        localStorage.setItem("tasks", JSON.stringify(tasksArr));
       
        

    })
    // *************************delete********************** 
    taskContainer.addEventListener("click", function (e) {
        if (deleteMode == true) {
            // delete ->ui , storage
            // local storage -> remove;
            taskContainer.remove();
            let tasksString = localStorage.getItem("tasks");
            let tasksArr = JSON.parse(tasksString)
       
        for (let i = 0; i < tasksArr.length; i++) {
            if (tasksArr[i].id == id) {
                tasksArr.splice(i, 1);
                break;
            }
        }
        localStorage.setItem("tasks", JSON.stringify(tasksArr));

        }
    })
    inputTask.addEventListener("blur", function(){
        let content = inputTask.textContent;
        let tasksString = localStorage.getItem("tasks");
        let tasksArr = JSON.parse(tasksString)
    
        for (let i = 0; i < tasksArr.length; i++) {
            if (tasksArr[i].id == id) {
                tasksArr[i].task = content;
                break;
            }
        }
        localStorage.setItem("tasks", JSON.stringify(tasksArr));
     })
    // local storage add 
    if (flag == true) {
        // old task
        let tasksString = localStorage.getItem("tasks");
        let tasksArr = JSON.parse(tasksString) || [];
        let taskObject = {
            id: id,
            task: task,
            color: defaultColor
        }
        // 1 new task
        tasksArr.push(taskObject);
        // set 
        localStorage.setItem("tasks", JSON.stringify(tasksArr));
    }
    
    
}


function filterCards(filterColor) {
    let allTaskCards =
        document.querySelectorAll(".task_container");
    if (cFilter != filterColor) {
        for (let i = 0; i < allTaskCards.length; i++) {
            // header color -> 
            let taskHeader = allTaskCards[i]
                .querySelector(".task_header");
            let taskColor = taskHeader.classList[1];
            if (taskColor == filterColor) {
                // show 
                allTaskCards[i].style.display = "block"
            } else {
                // hide 
                allTaskCards[i].style.display = "none"
            }
        }
        cFilter = filterColor;
    } else {
        cFilter = "";
        for (let i = 0; i < allTaskCards.length; i++) {
            allTaskCards[i].style.display = "block"
        }
    }
}
 

 

(function () {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    for (let i = 0; i < tasks.length; i++) {
        let { id, task, color } = tasks[i];
        createTask(id, task, false , color);
    }
})();

   
