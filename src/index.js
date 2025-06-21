document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements 
  const toggleBtn = document.getElementById("toggle-form-btn");
  const formContainer = document.getElementById("add-post-form-container");
  const addPostForm = document.getElementById("add-post-form");
  const display = document.getElementById("dish-display");
  const categoryList = document.getElementById("category-list");

  // State Variables 
  let allDishes = []; // Holds all dishes fetched or added
  const categorySet = new Set(); // Keeps track of unique categories

  // TOGGLE FORM VISIBILITY 
  toggleBtn.addEventListener("click", () => {
    const isHidden = formContainer.style.display === "none";
    formContainer.style.display = isHidden ? "block" : "none";

    toggleBtn.innerHTML = isHidden
      ? '<img src="./images/hidden.png" alt="eye closed icon"> Hide Form'
      : '<img src="./images/plus.png" alt="plus icon"> Add New Dish';

       if (isHidden) {
       setTimeout(() => {
       const yOffset = -100; // adjust based on your sticky header height
      const y = formContainer.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
     }, 100);
  }
  });

  // FORM SUBMISSION HANDLER 
  addPostForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Gather form input
    const formData = new FormData(addPostForm);
    const newDish = {
      category: formData.get("category"),
      name: formData.get("name"),
      origin: formData.get("origin"),
      imageUrl: formData.get("imageUrl"),
      description: formData.get("description"),
      spiceLevel: parseInt(formData.get("spiceLevel")),
    };

    // POST new dish to server
    fetch("http://localhost:3000/dishes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDish),
    })
      .then((res) => {
        if (!res.ok) throw new Error("POST failed");
        return res.json();
      })
      .then((data) => {
        alert("Dish added successfully!");
        addPostForm.reset();
        formContainer.style.display = "none";
        toggleBtn.innerHTML =
          '<img src="./images/plus.png" alt="plus icon"> Add New Dish';

        allDishes.push(data);
        addDishToSidebarCategory(data.category);
        renderDishList(allDishes); // Re-render all with new dish
      })
      .catch((err) => {
        console.error("Error adding dish:", err);
        alert("Error adding dish. Check console or server.");
      });
  });

  // ADD CATEGORY TO SIDEBAR (IF NEW) 
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

  // RENDER ALL DISHES GROUPED BY CATEGORY 
  function renderDishList(dishes) {
    display.innerHTML = "";
    const categoryMap = {};

    // Group dishes by category
    dishes.forEach((dish) => {
      if (!categoryMap[dish.category]) {
        categoryMap[dish.category] = [];
      }
      categoryMap[dish.category].push(dish);
    });

    // For each category, render its section
    Object.keys(categoryMap).forEach((category) => {
      const section = document.createElement("div");
      section.classList.add("category-section");

      const heading = document.createElement("h2");
      heading.textContent = category;
      section.appendChild(heading);

      const grid = document.createElement("div");
      grid.classList.add("dish-grid");

      // Render each dish card inside the grid
      [...categoryMap[category]].reverse().forEach((dish) => {
        const card = document.createElement("div");
        card.classList.add("dish-card");

        // Determine spice image(s)
      let spiceImage = "";
      if (dish.spiceLevel === 0) {
       spiceImage = `<img src="./images/candy.png" alt="Sweet" class="spice-icon" />`;
      } else {
      spiceImage = `<img src="./images/chilli.png" alt="pepper" class="spice-icon" />`.repeat(dish.spiceLevel);
   }


        // Image on top, then text info below
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


   // ✅ DELETE HANDLER inside DOMContentLoaded
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const dishId = e.target.dataset.id;

      if (confirm("Are you sure you want to delete this dish?")) {
        fetch(`http://localhost:3000/dishes/${dishId}`, {
          method: "DELETE",
        })
          .then((res) => {
            if (res.status === 200 || res.status === 204) {
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
  });

  // FILTER DISHES BY A SPECIFIC CATEGORY 
  function filterDishesByCategory(category) {
    const filtered = allDishes.filter((dish) => dish.category === category);
    renderDishList(filtered);
  }

  // INITIAL DISH FETCH FROM JSON SERVER 
  fetch("http://localhost:3000/dishes")
    .then((res) => res.json())
    .then((data) => {
      allDishes = data;
      renderDishList(allDishes);

      // Add existing categories to sidebar
      allDishes.forEach((dish) => {
        addDishToSidebarCategory(dish.category);
      });

      // Add "All" button to show everything
      const allBtn = document.createElement("li");
      allBtn.textContent = "All";
      allBtn.classList.add("category-item");
      allBtn.addEventListener("click", () => renderDishList(allDishes));
      categoryList.prepend(allBtn);
    });
});


