const getToyRequest = 'http://localhost:3000/toys'
const toyCollection = document.querySelector("#toy-collection")
const form = document.querySelector(".add-toy-form")


let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

function getToy() {
  fetch(getToyRequest)
  .then(response => response.json())
  .then(toysObject => {
    toysObject.forEach(toysObject => renderToys(toysObject))
  })
}

function renderToys(toy) {
  const div = document.createElement('div') // With the response data, make a <div class="card"> for each toy and add it to the toy-collection div.
  div.dataset.id = toy.id
  let {name, image, likes} = toy
  div.innerHTML = `
  <h2>${name}</h2>
  <img src=${image} class="toy-avatar" />
  <p>${likes} Likes </p>
  <button class="like-btn">Like <3</button>`
  toyCollection.append(div)
}

getToy ()

form.addEventListener('submit', (event) => {
  event.preventDefault()
  const name = event.target.name.value
  const image = event.target.image.value

  fetch(getToyRequest, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    
    body: JSON.stringify({
      name,
      image,
      likes: 0
    })
  })
  .then(response => response.json)
  .then(newToy => {
    renderToys(newToy)
    event.target.reset()
  })
})

toyCollection.addEventListener('click', (event) => {
  if (event.target.matches("button.like-btn")) {
    const div = event.target.closest('div')
    const pLikes = event.target.previousElementSibling
    const newLikes = parseInt(pLikes.textContent) + 1
    fetch(`${getToyRequest}/${div.dataset.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        accept: "application/json"
      },
      body: JSON.stringify({
        likes: newLikes
      })
    })
    .then(response => response.json())
    .then(data => pLikes.textContent = `${data.likes} Likes`)
  }
})




