let score = 100;
const maxScore = 100;
const carbonBar = document.getElementById("carbon_bar");

function updateCarbonBar() {
  if (score > 100) score = 100;
  carbonBar.style.width = score + "%";
  carbonBar.textContent = score + "%";
}

updateCarbonBar();
