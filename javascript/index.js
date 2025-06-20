const toggleBtn = document.getElementById("toggle-form-btn");
const formSection = document.getElementById("add-form-container");

toggleBtn.addEventListener("click", () => {
formSection.classList.toggle("hidden");
formSection.classList.toggle("show");
});

