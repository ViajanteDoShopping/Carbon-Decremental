// --- ESTADO DO JOGO (VARIÁVEIS) ---
let moneyScore = 44;
let researchScore =  33;
let reductionRate = 0.001; // Taxa de redução exponencial

// --- ELEMENTOS DO DOM ---
const carbonBar = document.getElementById("carbon_bar");
const moneyBar = document.getElementById("money_bar");
const researchBar = document.getElementById("research_bar");
const toggleBtn = document.getElementById('toggle_btn');
const skillTree = document.getElementById('skill_tree');

// --- FUNÇÕES DE INTERFACE ---



// Lógica de abrir/fechar a Skill Tree
toggleBtn.addEventListener('click', () => {
    skillTree.classList.toggle('open');
    toggleBtn.textContent = skillTree.classList.contains('open') ? '>' : '<';
});



// --------------------------

//VARIÁVEIS
const CARBON_0 = 870; //carbono inicial
const CARBON_MIN = 580; //carbono mínimo (aqui você ganha)
const CARBON_MAX = 2500; //carbono máximo (aqui você perde)
const CARBON_RATIO = 5.9; //taxa de carbono (incremento / decremento)

let carbonScore = CARBON_0;
let carbonPercent = 0;

//GAME LOOP

const intervalId = setInterval(gameLoop, 1000 / 30);//inicia o loop a 30fps

function gameLoop() {
    carbonScore *= CARBON_RATIO / 100;
    carbonScore = carbonScore.toFixed(2);
    carbonPercent = carbonScore / (CARBON_MAX - CARBON_MIN) * 100;
    carbonPercent = carbonScore.toFixed(2);
    updateBarDisplay(carbonBar, carbonScore, carbonPercent, "GtC");
}
    
function updateBarDisplay(bar, score, percentage, unity) {
    bar.style.width = percentage + "%";
    bar.textContent = score + unity;
}