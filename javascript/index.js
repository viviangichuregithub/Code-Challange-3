// 1. Fetch all dishes from db.json
fetch('http://localhost:3000/dishes')
  .then(res => res.json())
  .then(data => {
    // 2. Extract unique categories from dishes
    // 3. Populate sidebar with category titles
    // 4. Add event listeners to each category
    // 5. When clicked, display all dishes in that category on the right
  });

// 6. Add new dish using a form (POST request)
form.addEventListener("submit", (e) => {
  e.preventDefault();
  // POST new dish to db.json
});
