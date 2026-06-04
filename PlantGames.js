let coins = Number(localStorage.getItem("coins")) || 0;

let unlocked = JSON.parse(localStorage.getItem("unlocked")) || {
    flower: true,
    cactus: false,
    sunflower: false
};

let currentPlant = "flower";
let water = 100;
let stage = 0;       
let isWithering = false; 
let timer;

const plants = {
    flower: {
        growth: [
            "images/images.flower_grow1.png", 
            "images/images.flower_grow2.png", 
            "images/images.flower_grow3.png", 
            "images/images.flower_grow4.png"  
        ],
        wither: "images/flower_dead.png" 
    },
    cactus: {
        growth: [
            "images/images.cactus_grow1.png", 
            "images/images.cactus_grow2.png", 
            "images/images.cactus_grow3.png"  
        ],
        wither: "images/cactus_dead.png" 
    },
    sunflower: {
        growth: [
            "images/images.sun_grow1.png",    
            "images/images.sun_grow2.png",    
            "images/images.sun_grow3.png",    
            "images/images.sun_grow4.png"     
        ],
        wither: "images/sun_dead.png" 
    }
};

updateCoins();

function save() {
    localStorage.setItem("coins", coins);
    localStorage.setItem("unlocked", JSON.stringify(unlocked));
}

function updateCoins() {
    document.getElementById("coinsGame").textContent = coins;
}

function hideAll() {
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("select").classList.add("hidden");
    document.getElementById("shop").classList.add("hidden");
    document.getElementById("game").classList.add("hidden");
    document.getElementById("gameOverScreen").classList.add("hidden");
    document.getElementById("sideMenu").classList.add("hidden"); 
}

function backMenu() {
    hideAll();
    document.getElementById("menu").classList.remove("hidden");
    clearInterval(timer);
}

function openSelect() {
    hideAll();
    document.getElementById("select").classList.remove("hidden");
}

function openShop() {
    document.getElementById("sideMenu").classList.add("hidden");
    document.getElementById("game").classList.add("hidden");
    document.getElementById("shop").classList.remove("hidden");
}

function closeShop() {
    document.getElementById("shop").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
}

function buyPlant(name, price) {
    if (unlocked[name]) {
        alert("Already purchased!");
        return;
    }
    if (coins >= price) {
        coins -= price;
        unlocked[name] = true;
        save();
        updateCoins();
        alert("Purchased successfully!");
        closeShop();
    } else {
        alert("Not enough coins!");
    }
}

function choosePlant(name) {
    if (!unlocked[name]) {
        alert("Locked! Buy it in the shop first.");
        return;
    }
    currentPlant = name;
    startGame();
}

function startGame() {
    hideAll();
    document.getElementById("game").classList.remove("hidden");

    water = 100;
    stage = 0;
    isWithering = false;

    document.getElementById("plant").src = plants[currentPlant].growth[0];
    document.getElementById("status").textContent = "Healthy";
    updateWater();

    clearInterval(timer); 
    timer = setInterval(loop, 1000);
}

function toggleSideMenu() {
    const sideMenu = document.getElementById("sideMenu");
    sideMenu.classList.toggle("hidden");
}

function loop() {
    water -= 5;
    if (water < 0) water = 0;
    updateWater();

    if (water <= 30 && water > 0) {
        isWithering = true;
        document.getElementById("status").textContent = "Needs Water!";
        document.getElementById("plant").src = plants[currentPlant].wither; 
    } 
    
    if (water == 0) {
        clearInterval(timer);
        document.getElementById("status").textContent = "The plant died...";
        document.getElementById("plant").src = plants[currentPlant].wither; 
        document.getElementById("gameOverScreen").classList.remove("hidden"); 
    }
}

function waterPlant() {
    if (water <= 0) return; 

    const canImg = document.getElementById("can");
    canImg.classList.add("pour");
    setTimeout(() => { canImg.classList.remove("pour"); }, 500);

    const container = document.getElementById("dropsContainer");
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const drop = document.createElement("img"); 
            drop.src = "images/images.drop.png";              
            drop.classList.add("water-drop");
            drop.style.left = Math.random() * 100 + "%";
            drop.style.animationDelay = Math.random() * 0.2 + "s";
            
            container.appendChild(drop);
            setTimeout(() => { drop.remove(); }, 850); 
        }, i * 40);
    }

    water += 25;
    if (water > 100) water = 100;
    updateWater();

    const maxStages = plants[currentPlant].growth.length;

    if (isWithering && water > 30) {
        isWithering = false;
        document.getElementById("status").textContent = "Recovered!";
        document.getElementById("plant").src = plants[currentPlant].growth[stage];
        return; 
    }

    if (!isWithering && stage < maxStages - 1) {
        stage++;
        document.getElementById("plant").src = plants[currentPlant].growth[stage];
    }

    if (!isWithering && stage == maxStages - 1) {
        coins++;
        save();
        updateCoins();

        document.getElementById("status").textContent = "+1 Coin!";

        setTimeout(() => {
            if (document.getElementById("game").classList.contains("hidden")) return;
            stage = 0;
            water = 100;
            isWithering = false;
            document.getElementById("plant").src = plants[currentPlant].growth[0];
            document.getElementById("status").textContent = "New Sprout";
            updateWater();
        }, 1000);
    }
}

function updateWater() {
    document.getElementById("waterLevel").style.width = water + "%";
}

function restartGame() {
    document.getElementById("gameOverScreen").classList.add("hidden");
    startGame(); 
}

function backMenuFromGameOver() {
    document.getElementById("gameOverScreen").classList.add("hidden");
    backMenu();
}
