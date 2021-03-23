const toyGetRequest = 'http://localhost:3000/toys'
const toyCollection = document.querySelector('#toy-collection')
const form = document.querySelector('.add-toy-form')

// The hash (#) specifies to select elements by their IDs
// The dot (.) specifies to select elements by their classname

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
  fetch(toyGetRequest)
  .then(response => response.json())
  .then(toysObject => {
    toysObject.forEach((toy) => {
      renderToy(toy)
      }
    )}
  )}

function renderToy(toy) {
  const div = document.createElement('div')
  div.dataset.id = toy.id
  div.classList.add('card')
  div.innerHTML = `
    <h2>${toy.name}</h2>
    <img src=${toy.image} class="toy-avatar" />
    <p> ${toy.likes} Likes </p>
    <button class="like-btn">Like <3</button>`
  toyCollection.append(div)
  }

getToy()

form.addEventListener('submit', (event) => {
  event.preventDefault() // stops from refreshing
  const name = event.target.name.value
  const image = event.target.image.value
  fetch(toyGetRequest, {
    method: 'POST',
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
    body: JSON.stringify({
        name,
        image,
        "likes": 0
    })
  })
    .then(response => response.json())
    .then(newToy => {
      renderToy(newToy)
      event.target.reset()
    
  })
})

toyCollection.addEventListener('click', (event) => {
  if (event.target.matches('button.like-btn')) {
    const div = event.target.closest('div')
    const pLikes = event.target.previousElementSibling
    const newLikes = parseInt(pLikes.textContent) + 1
    fetch(`${toyGetRequest}/${div.dataset.id}`, {
      method: 'PATCH',
      headers: {
        "content-type": "application/json",
        accept: "application/json"
      },
      body: JSON.stringify({
        likes: newLikes
      })
    })
    .then(response => response.json())
    .then(data => pLikes.textContent = `${data.likes} Likes`)}
})


