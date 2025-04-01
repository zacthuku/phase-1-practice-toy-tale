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
document.addEventListener("DOMContentLoaded", () => {
  // Fetch and display all toys
  const toyCollection = document.getElementById("toy-collection");
  const toyUrl = "http://localhost:3000/toys";

  fetch(toyUrl)
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => addToyToDOM(toy));
    });

  function addToyToDOM(toy) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;
    toyCollection.appendChild(card);

    // Event listener for liking a toy
    card.querySelector(".like-btn").addEventListener("click", () => {
      updateLikes(toy);
    });
  }

  function updateLikes(toy) {
    const newLikes = toy.likes + 1;
    fetch(`${toyUrl}/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ likes: newLikes })
    })
      .then(response => response.json())
      .then(updatedToy => {
        document.getElementById(updatedToy.id).previousElementSibling.textContent = `${updatedToy.likes} Likes`;
      });
  }

  // Add new toy
  const toyForm = document.querySelector(".add-toy-form");
  toyForm.addEventListener("submit", event => {
    event.preventDefault();
    const newToy = {
      name: event.target.name.value,
      image: event.target.image.value,
      likes: 0
    };
    
    fetch(toyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then(response => response.json())
      .then(addedToy => {
        addToyToDOM(addedToy);
        toyForm.reset();
      });
  });
});
