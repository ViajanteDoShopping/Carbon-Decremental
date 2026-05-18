// --- ESTADO DO JOGO (VARIÁVEIS) ---
let researchScore =  0;
let reductionRate = 0.001; // Taxa de redução exponencial

// --- ELEMENTOS DO DOM ---
const carbonBar = document.getElementById("carbon_bar");
const carbonRateDisplay = document.getElementById("carbon_rate_display");
const moneyRateDisplay = document.getElementById("money_rate_display");
const moneyBar = document.getElementById("money_bar");
const researchBar = document.getElementById("research_bar");
const toggleBtn = document.getElementById('toggle_btn');
const skillTree = document.getElementById('skill_tree');
const upgradesContainer = document.getElementById('upgrades_container');

// ---VARIÁVEIS---
const CARBON_0 = 870; //carbono inicial
const CARBON_MIN = 580; //carbono mínimo (aqui você ganha)
const CARBON_MAX = 2500; //carbono máximo (aqui você perde)

const MONEY_0 = 10; //dinheiro inicial
const MONEY_MIN = 0; //dinheiro mínimo
const MONEY_MAX = 1000; //dinheiro máximo

let carbonRatio = 0.6; //taxa de carbono (incremento / decremento)
let carbonScore = CARBON_0;
let carbonPercent = 0;

let moneyRatio = 0;
let moneyScore = MONEY_0;
let moneyPercent = 0;

const upgrades = {
    11: {
        id: 11,
        title: "Subsídio Ecológico",
        description: "Gera +1.00M $/s",
        cost: 10,
        bought: false,
        repeatable: false,
        effect() {
            moneyRatio += 1.00;
        }
    },
    
    12: {
        id: 12,
        title: "Investimento Científico",
        description: "+1 RP",
        cost: 15,
        count: 0,
        repeatable: true,
        effect() {
            researchScore += 1;
            this.count++;
        }
    },

    13: {
        id: 13,
        title: "Capital de Giro",
        description: "Dinheiro = +Dinheiro",
        cost: 50, // Custa 50M
        bought: false,
        repeatable: false,
        effect() {
            // Deixamos o efeito padrão vazio porque o bônus é calculado dinamicamente via getBonus()
        },
        // Função customizada para calcular o bônus baseado no dinheiro atual
        getBonus() {
            if (!this.bought) return 1; // Se não comprou, não dá bônus (multiplica por 1)
            
            // Fórmula: logaritmo do dinheiro para o bônus não crescer infinitamente rápido
            // Se tiver 100M, dá cerca de 2x de bônus. Se tiver 1000M, dá 3x.
            return Math.max(1, Math.log10(moneyScore)); 
        }
    }
};

setUpgrades();

//GAME LOOP
const intervalId = setInterval(gameLoop, 1000 / 30);

function gameLoop() {
    carbonScore *= (1 + (carbonRatio / 3000));
    
    let totalEscala = CARBON_MAX - CARBON_MIN;
    let progress = carbonScore - CARBON_MIN;
    carbonPercent = (progress / totalEscala) * 100;
    if(carbonPercent < 0) carbonPercent = 0;
    if(carbonPercent > 100) carbonPercent = 100;

    let moneyScale = MONEY_MAX - MONEY_MIN;
    let moneyProgress = moneyScore - MONEY_MIN;
    moneyPercent = (moneyProgress / moneyScale) * 100;
    if(moneyPercent < 0) moneyPercent = 0;
    if(moneyPercent > 100) moneyPercent = 100;

    // --- ALTERAÇÃO DE LOGICA DO DINHEIRO PASSIVO ---
    // Calculamos a taxa real aplicando o multiplicador do upgrade 13 dinamicamente
    let currentMoneyMultiplier = upgrades[13].getBonus();
    let moneyRateWithBonus = moneyRatio * currentMoneyMultiplier;

    if (moneyRateWithBonus > 0) {
        // Aplica o ganho real com o bônus por frame
        moneyScore += (moneyRateWithBonus / 30);
    }

    // --- ATUALIZAÇÕES DO DOM ---
    if (carbonBar) {
        updateBarDisplay(carbonBar, carbonScore, carbonPercent, " GtC");
    }
    if (carbonRateDisplay) {
        carbonRateDisplay.textContent = "+" + carbonRatio.toFixed(2) + " GtC/s";
    }
    if (moneyBar) {
        updateBarDisplay(moneyBar, moneyScore, moneyPercent, "M $"); 
    }
    
    // --- ALTERAÇÃO INDICADOR DE TEXTO ---
    if (moneyRateDisplay) {
        // Se o upgrade foi comprado (bônus maior que 1), mostra o multiplicador ao lado para indicar o efeito
        if (upgrades[13].bought) {
            moneyRateDisplay.textContent = "+" + moneyRateWithBonus.toFixed(2) + "M $/s (" + currentMoneyMultiplier.toFixed(2) + "x)";
        } else {
            moneyRateDisplay.textContent = "+" + moneyRateWithBonus.toFixed(2) + "M $/s";
        }
    }
    
    if (researchBar) {
        updateBarDisplay(researchBar, researchScore, 100, " Pts"); 
    }

    updateUpgradesVisual();
}
    
function updateBarDisplay(bar, score, percentage, unity) {
    bar.style.width = percentage.toFixed(2) + "%";
    bar.textContent = score.toFixed(2) + unity;
}

function setUpgrades() {
    if (!upgradesContainer) return;
    upgradesContainer.innerHTML = "";

    for (let id in upgrades) {
        let upg = upgrades[id];

        let btn = document.createElement("button");
        btn.id = "upg_" + upg.id;
        btn.className = "upgrade-btn";
        
        btn.innerHTML = `
            <strong>${upg.title}</strong>
            <span>${upg.description}</span>
            <span class="cost-tag">Custo: ${upg.cost} M $</span>
        `;

        btn.addEventListener("click", () => buyUpgrade(upg.id));
        upgradesContainer.appendChild(btn);
    }
}

function buyUpgrade(id) {
    let upg = upgrades[id];
    
    if (upg.repeatable && moneyScore >= upg.cost) {
        moneyScore -= upg.cost;
        upg.effect();
        
        let countSpan = document.getElementById("count_" + upg.id);
        if (countSpan) countSpan.textContent = "Comprado: " + upg.count;
        
    } else if (!upg.repeatable && !upg.bought && moneyScore >= upg.cost) {
        moneyScore -= upg.cost;
        upg.bought = true;
        upg.effect();
    }
}

function updateUpgradesVisual() {
    for (let id in upgrades) {
        let upg = upgrades[id];
        let btn = document.getElementById("upg_" + upg.id);
        
        if (btn) {
            if (upg.bought) {
                btn.className = "upgrade-btn bought";
            } else if (moneyScore >= upg.cost) {
                btn.className = "upgrade-btn can-afford";
            } else {
                btn.className = "upgrade-btn";
            }
        }
    }
}