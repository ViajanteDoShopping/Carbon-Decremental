let carbonScore = 100;
let moneyScore = 44;
let researchScore = 33;

const carbonBar = document.getElementById("carbon_bar");
const moneyBar = document.getElementById("money_bar");
const researchBar = document.getElementById("research_bar");

function updateBar(score, bar, limit) {
  if (score > limit) score = limit;
  bar.style.width = score + "%";
  bar.textContent = score + "%";
}

updateBar(carbonScore, carbonBar, 100);
updateBar(moneyScore, moneyBar, 100);
updateBar(researchScore, researchBar, 100);

const toggleBtn = document.getElementById('toggle_btn');
const skillTree = document.getElementById('skill_tree');

toggleBtn.addEventListener('click', () => {
  skillTree.classList.toggle('open');

  if (skillTree.classList.contains('open')) {
    toggleBtn.textContent = '>';
  } else {
    toggleBtn.textContent = '<';
  }
});