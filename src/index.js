document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-form-btn");
  const formContainer = document.getElementById("add-post-form-container");
  const addPostForm = document.getElementById("add-post-form");
  const display = document.getElementById("dish-display");
  const categoryList = document.getElementById("category-list");
  const formTitle = document.getElementById("form-title");
  const submitBtn = document.getElementById("submit-btn");
  const cancelEditBtn = document.getElementById("cancel-edit-btn");

  let allDishes = [];
  const categorySet = new Set();
  let isEditing = false;
  let editingDishId = null;

  toggleBtn.addEventListener("click", () => {
    const isHidden = formContainer.style.display === "none";
    formContainer.style.display = isHidden ? "block" : "none";

    toggleBtn.innerHTML = isHidden
      ? '<img src="./images/hidden.png" alt="eye closed icon"> Hide Form'
      : '<img src="./images/plus.png" alt="plus icon"> Add New Dish';

    if (!isEditing) {
      formTitle.textContent = "Add a New StreetDish";
      submitBtn.textContent = "Add The StreetDish";
      cancelEditBtn.style.display = "none";
    }

    if (isHidden) {
      setTimeout(() => {
        const yOffset = -100;
        const y = formContainer.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }, 100);
    }
  });

  cancelEditBtn.addEventListener("click", () => {
    isEditing = false;
    editingDishId = null;
    addPostForm.reset();
    formTitle.textContent = "Add a New StreetDish";
    submitBtn.textContent = "Add The StreetDish";
    cancelEditBtn.style.display = "none";
    formContainer.style.display = "none";
    toggleBtn.innerHTML = '<img src="./images/plus.png" alt="plus icon"> Add New Dish';
  });

  addPostForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(addPostForm);
    const newDish = {
      category: formData.get("category"),
      name: formData.get("name"),
      origin: formData.get("origin"),
      imageUrl: formData.get("imageUrl"),
      description: formData.get("description"),
      spiceLevel: parseInt(formData.get("spiceLevel")),
    };

    const url = isEditing
      ? `http://localhost:3000/dishes/${editingDishId}`
      : "http://localhost:3000/dishes";
    const method = isEditing ? "PATCH" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDish),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`${method} failed`);
        return res.json();
      })
      .then((data) => {
        if (isEditing) {
          const index = allDishes.findIndex((dish) => dish.id == editingDishId);
          allDishes[index] = data;
          alert("Dish updated successfully!");
        } else {
          allDishes.push(data);
          alert("Dish added successfully!");
          addDishToSidebarCategory(data.category);
        }

        renderDishList(allDishes);
        addPostForm.reset();
        isEditing = false;
        editingDishId = null;
        formContainer.style.display = "none";
        toggleBtn.innerHTML = '<img src="./images/plus.png" alt="plus icon"> Add New Dish';
        formTitle.textContent = "Add a New StreetDish";
        submitBtn.textContent = "Add The StreetDish";
        cancelEditBtn.style.display = "none";
      })
      .catch((err) => {
        console.error(`${method} error:`, err);
        alert(`Failed to ${isEditing ? "update" : "add"} dish. Check console.`);
      });
  });

  function addDishToSidebarCategory(category) {
    if (!categorySet.has(category)) {
      const li = document.createElement("li");
      li.textContent = category;
      li.classList.add("category-item");
      li.addEventListener("click", () => filterDishesByCategory(category));
      categoryList.appendChild(li);
      categorySet.add(category);
    }
  }

  function renderDishList(dishes) {
    display.innerHTML = "";
    const categoryMap = {};

    dishes.forEach((dish) => {
      if (!categoryMap[dish.category]) {
        categoryMap[dish.category] = [];
      }
      categoryMap[dish.category].push(dish);
    });

    Object.keys(categoryMap).forEach((category) => {
      const section = document.createElement("div");
      section.classList.add("category-section");

      const heading = document.createElement("h2");
      heading.textContent = category;
      section.appendChild(heading);

      const grid = document.createElement("div");
      grid.classList.add("dish-grid");

      [...categoryMap[category]].reverse().forEach((dish) => {
        const card = document.createElement("div");
        card.classList.add("dish-card");

        const spiceImage = dish.spiceLevel === 0
          ? `<img src="./images/candy.png" alt="Sweet" class="spice-icon" />`
          : `<img src="./images/chilli.png" alt="pepper" class="spice-icon" />`.repeat(dish.spiceLevel);

        card.innerHTML = `
          <img src="${dish.imageUrl}" alt="${dish.name}" class="dish-img"/>
          <div class="dish-info">
            <h3>${dish.name}</h3>
            <p><strong>Origin:</strong> ${dish.origin}</p>
            <p><strong>Flavor Intensity :</strong> ${spiceImage}</p>
            <p>${dish.description}</p>
            <div class="card-buttons">
              <button class="edit-btn" data-id="${dish.id}">Edit</button>
              <button class="delete-btn" data-id="${dish.id}">Delete</button>
            </div>
          </div>
        `;
        grid.appendChild(card);
      });

      section.appendChild(grid);
      display.appendChild(section);
    });
  }

  document.addEventListener("click", (e) => {
    // DELETE
    if (e.target.classList.contains("delete-btn")) {
      const dishId = e.target.dataset.id;

      if (confirm("Are you sure you want to delete this dish?")) {
        fetch(`http://localhost:3000/dishes/${dishId}`, {
          method: "DELETE",
        })
          .then((res) => {
            if (res.ok) {
              allDishes = allDishes.filter((dish) => dish.id != dishId);
              renderDishList(allDishes);
              alert("Dish deleted successfully!");
            } else {
              throw new Error(`Unexpected response: ${res.status}`);
            }
          })
          .catch((err) => {
            console.error("Delete error:", err);
            alert("Failed to delete dish. Please try again.");
          });
      }
    }

    // EDIT
    if (e.target.classList.contains("edit-btn")) {
      const dishId = e.target.dataset.id;
      const dishToEdit = allDishes.find((dish) => dish.id == dishId);

      if (dishToEdit) {
        addPostForm.category.value = dishToEdit.category;
        addPostForm.name.value = dishToEdit.name;
        addPostForm.origin.value = dishToEdit.origin;
        addPostForm.imageUrl.value = dishToEdit.imageUrl;
        addPostForm.description.value = dishToEdit.description;
        addPostForm.spiceLevel.value = dishToEdit.spiceLevel;

        isEditing = true;
        editingDishId = dishId;

        formContainer.style.display = "block";
        formTitle.textContent = "Update Dish";
        submitBtn.textContent = "Update StreetDish";
        cancelEditBtn.style.display = "inline-block";
        toggleBtn.innerHTML = '<img src="./images/hidden.png" alt="eye closed icon"> Hide Form';

        setTimeout(() => {
          const yOffset = -100;
          const y = formContainer.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }, 100);
      }
    }
  });

  function filterDishesByCategory(category) {
    const filtered = allDishes.filter((dish) => dish.category === category);
    renderDishList(filtered);
  }

  fetch("http://localhost:3000/dishes")
    .then((res) => res.json())
    .then((data) => {
      allDishes = data;
      renderDishList(allDishes);

      allDishes.forEach((dish) => addDishToSidebarCategory(dish.category));

      const allBtn = document.createElement("li");
      allBtn.textContent = "All";
      allBtn.classList.add("category-item");
      allBtn.addEventListener("click", () => renderDishList(allDishes));
      categoryList.prepend(allBtn);
    });

});


