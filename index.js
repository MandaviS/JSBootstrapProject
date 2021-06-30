const taskContainer= document.querySelector(".task__container");       

let globalStore = [];

const newCard= ({id,imageUrl,taskTitle,taskDescription,taskType}) => 
`<div class="col-md-6 col-lg-4" id=${id}>
<div class="card">
  <div class="card-header d-flex justify-content-end gap-2">
    <button type="button" id=${id} class="btn btn-outline-success rounded-pill" onclick="editCard.apply(this,arguments)">
    <i class="fas fa-pencil-alt" id=${id} onclick="editCard.apply(this,arguments)" ></i></button>
    <button type="button" id=${id} class="btn btn-outline-danger rounded-pill" onclick="deleteCard.apply(this,arguments)">
    <i class="fas fa-trash" id=${id} onclick="deleteCard.apply(this,arguments)" ></i></button>
  </div>
  <img src=${imageUrl} class="card-img-top" alt="image">
  <div class="card-body">
    <h5 class="card-title">${taskTitle}</h5>
    <p class="card-text">${taskDescription}</p>
    <span class="badge bg-primary">${taskType}</span>
  </div>
  <div class="card-footer text-muted">
    <button type="button" id=${id} class="btn btn-outline-primary float-end rounded-pill">Open Task</button>
  </div>
</div>
</div>`

const loadinitialTaskCards = () => {
  const getInitialData = localStorage.getItem("TaskY");    //accessing local storage
  if(!getInitialData)  return;                             //if getInitialData is null function won't execute
  const {cards} = JSON.parse(getInitialData);              //convert string again to object
  cards.map((cardObject) => {
   const createNewCard = newCard(cardObject);
    taskContainer.insertAdjacentHTML("beforeend",createNewCard);
    globalStore.push(cardObject);
  });
};

updateLocalStorage = () => {
  localStorage.setItem("TaskY",JSON.stringify({ cards: globalStore}));
};

const saveChanges= () => {
    const taskData = {
        id: `${Date.now()}`,  //will return unique number to identify id
        imageUrl: document.getElementById("imageurl").value,
        taskTitle: document.getElementById("tasktitle").value,
        taskType: document.getElementById("tasktype").value,
        taskDescription: document.getElementById("taskdescription").value,
    };
   
    const createNewCard = newCard(taskData);

    taskContainer.insertAdjacentHTML("beforeend",createNewCard);
    globalStore.push(taskData);

    updateLocalStorage();

};    

const deleteCard= (event) => {
  event= window.event;
  const targetID = event.target.id;
  const tagname = event.target.tagName;
  globalStore = globalStore.filter((cardObject) => 
    cardObject.id !== targetID
  );
  
  
  updateLocalStorage();

  if (tagname === "BUTTON") {
    
    return taskContainer.removeChild(
      event.target.parentNode.parentNode.parentNode 
    );
  }

  
  return taskContainer.removeChild(
    event.target.parentNode.parentNode.parentNode.parentNode 
  );
};

const editCard = (event) => {
  event = window.event;
  const targetID = event.target.id;
  const tagname = event.target.tagName;

  let parentElement;

  if (tagname === "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
  } 
  else {
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  let taskTitle = parentElement.childNodes[5].childNodes[1];
  let taskDescription = parentElement.childNodes[5].childNodes[3];
  let taskType = parentElement.childNodes[5].childNodes[5];
  let submitButton = parentElement.childNodes[7].childNodes[1];

  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");
  submitButton.setAttribute("onclick","saveEditchanges.apply(this, arguments)");
  submitButton.innerHTML = "Save Changes";
};

const saveEditchanges = (event) => {
  event = window.event;
  const targetID = event.target.id;
  console.log(targetID);
  const tagname = event.target.tagName;

  let parentElement;

  if (tagname === "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
  } else {
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  let taskTitle = parentElement.childNodes[5].childNodes[1];
  let taskDescription = parentElement.childNodes[5].childNodes[3];
  let taskType = parentElement.childNodes[5].childNodes[5];
  let submitButton = parentElement.childNodes[7].childNodes[1];

  const updatedData = {
    taskTitle: taskTitle.innerHTML,
    taskType: taskType.innerHTML,
    taskDescription: taskDescription.innerHTML,
  };

  globalStore = globalStore.map((task) => {
    if (task.id === targetID) {
      return {
        id: task.id,
        imageUrl: task.imageUrl,
        taskTitle: updatedData.taskTitle,
        taskType: updatedData.taskType,
        taskDescription: updatedData.taskDescription,
      };
    }
    return task;     //To get all existing data in global store as well otherwise it would be ignored
  });

  updateLocalStorage();

  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");
  submitButton.removeAttribute("onclick");
  submitButton.innerHTML = "Open Task";
};



  