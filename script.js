// Game state
let randomNumber = Math.floor(Math.random() * 20) + 1;
let money = 0;
let incomePerSecond = 0;
let correctGuesses = 0;
let totalGuesses = 0;
let currentStreak = 0;
let bestStreak = 0;
let prestigePoints = 0;

// Fun elements
let funFacts = [
    "🎲 The first computer was called ENIAC!",
    "🚀 JavaScript was created in just 10 days!",
    "💡 The '@' symbol is called an 'at sign'!",
    "🎯 Random numbers aren't truly random!",
    "🎮 The first video game was Pong!",
    "💰 Bitcoin uses massive computing power!",
    "🔥 Your brain has 86 billion neurons!",
    "⚡ Light travels at 299,792,458 m/s!",
    "🌟 There are more stars than grains of sand!",
    "🎪 A group of flamingos is called a 'flamboyance'!"
];

// Floating money animation
function createFloatingMoney(amount, x, y) {
    const floatingMoney = document.createElement('div');
    floatingMoney.className = 'floating-money-particle';
    floatingMoney.textContent = `+$${amount}`;
    floatingMoney.style.left = x + 'px';
    floatingMoney.style.top = y + 'px';
    
    document.getElementById('floating-money').appendChild(floatingMoney);
    
    setTimeout(() => {
        floatingMoney.remove();
    }, 2000);
}

// Confetti celebration
function createConfetti() {
    const celebrationContainer = document.getElementById('celebration-container');
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        celebrationContainer.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Fun fact rotation
function updateFunFact() {
    const funFactDisplay = document.getElementById('fun-fact-display');
    const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
    funFactDisplay.textContent = randomFact;
}

// Upgrade levels and costs
let upgrades = {
    biggerPayout: { level: 1, cost: 10, baseCost: 10 },
    luckyBonus: { level: 0, cost: 25, baseCost: 25 },
    rangeReducer: { level: 0, cost: 50, baseCost: 50 },
    hintPower: { level: 0, cost: 75, baseCost: 75 },
    biggerRange: { level: 0, cost: 150, baseCost: 150 },
    streakMultiplier: { level: 0, cost: 100, baseCost: 100 },
    autoGuesser: { level: 0, cost: 500, baseCost: 500 }
};

// Miner levels and costs
let miners = {
    bronze: { owned: 0, cost: 20, baseCost: 20, income: 1 },
    silver: { owned: 0, cost: 1000, baseCost: 1000, income: 10 },
    gold: { owned: 0, cost: 10000, baseCost: 10000, income: 100 }
};

// Game settings
let gameSettings = {
    minNumber: 1,
    maxNumber: 20,
    basePayout: 3,
    prestigeRequirement: 1000000
};

// DOM elements
const guessInput = document.getElementById('guessInput');
const guessButton = document.getElementById('guessButton');
const message = document.getElementById('message');
const hint = document.getElementById('hint');
const moneyDisplay = document.getElementById('money');
const incomePerSecondDisplay = document.getElementById('income-per-second');
const prestigePointsDisplay = document.getElementById('prestige-points');
const correctGuessesDisplay = document.getElementById('correct-guesses');
const totalGuessesDisplay = document.getElementById('total-guesses');
const accuracyDisplay = document.getElementById('accuracy');
const rangeDisplay = document.getElementById('range-display');
const numberWheel = document.getElementById('number-wheel');

// Achievements system
let achievements = [
    { id: 'first_guess', name: '🎯 First Success', description: 'Make your first correct guess', unlocked: false },
    { id: 'number_novice', name: '🔢 Number Novice', description: 'Get 10 correct guesses', unlocked: false },
    { id: 'guessing_guru', name: '🔮 Guessing Guru', description: 'Get 100 correct guesses', unlocked: false },
    { id: 'big_spender', name: '💸 Big Spender', description: 'Spend $1,000 on upgrades', unlocked: false },
    { id: 'high_roller', name: '🎩 High Roller', description: 'Spend $10,000 on upgrades', unlocked: false },
    { id: 'streak_master', name: '🔥 Streak Master', description: 'Get 5 correct guesses in a row', unlocked: false },
    { id: 'on_fire', name: '🌋 On Fire!', description: 'Get a streak of 10', unlocked: false },
    { id: 'millionaire', name: '💰 Millionaire', description: 'Earn $10,000', unlocked: false },
    { id: 'tycoon', name: '🎩 Tycoon', description: 'Earn $1,000,000', unlocked: false },
    { id: 'accuracy_king', name: '👑 Accuracy King', description: 'Achieve 80% accuracy with 20+ guesses', unlocked: false },
    { id: 'upgrade_collector', name: '🚀 Upgrade Collector', description: 'Get any upgrade to level 10', unlocked: false },
    { id: 'miner_mogul', name: '⛏️ Miner Mogul', description: 'Own a total of 50 miners', unlocked: false },
    { id: 'gold_rush', name: '🌟 Gold Rush', description: 'Own 10 Gold Miners', unlocked: false },
    { id: 'range_master', name: '📈 Range Master', description: 'Play with a number range of 100 or more', unlocked: false }
];

// Auto-guesser variables
let autoGuesserActive = false;
let autoGuesserInterval;

// Initialize game
function initGame() {
    updateDisplay();
    updateUpgradeButtons();
    updateMinerButtons();
    renderAchievements();
    updateFunFact();

    // Add event listener for the guess button
    guessButton.addEventListener('click', makeGuess);
    // Allow Enter key to submit guess
    guessInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            makeGuess();
        }
    });

    // Update fun fact every 10 seconds
    setInterval(updateFunFact, 10000);
    // Passive income interval
    setInterval(applyPassiveIncome, 1000);
    // Golden Number interval
    setInterval(spawnGoldenNumber, 30000);
    // Load save data if exists
    loadGame();
    // Add click handler for number wheel
    numberWheel.addEventListener('click', () => {
        numberWheel.style.animation = 'spin 0.5s ease-out';
        setTimeout(() => {
            numberWheel.style.animation = 'spin 4s linear infinite';
        }, 500);
        updateFunFact();
    });
}

function updateDisplay() {
    moneyDisplay.textContent = Math.floor(money);
    incomePerSecondDisplay.textContent = incomePerSecond;
    prestigePointsDisplay.textContent = prestigePoints;
    correctGuessesDisplay.textContent = correctGuesses;
    totalGuessesDisplay.textContent = totalGuesses;
    accuracyDisplay.textContent = totalGuesses > 0 ? Math.round((correctGuesses / totalGuesses) * 100) + '%' : '0%';
    rangeDisplay.textContent = `${gameSettings.minNumber} and ${gameSettings.maxNumber}`;
}

function calculatePayout() {
    let payout = gameSettings.basePayout + upgrades.biggerPayout.level - 1;
    
    // Lucky bonus
    if (upgrades.luckyBonus.level > 0 && Math.random() < 0.1 * upgrades.luckyBonus.level) {
        payout *= 2;
        showHint('🍀 Lucky bonus activated! Double money!');
    }
    
    // Streak multiplier
    if (upgrades.streakMultiplier.level > 0 && currentStreak > 1) {
        payout += Math.floor(currentStreak * upgrades.streakMultiplier.level * 0.5);
    }
    
    // Prestige bonus
    payout *= (1 + prestigePoints * 0.1);

    return payout;
}

function makeGuess() {
    const userGuess = parseInt(guessInput.value);
    if (isNaN(userGuess) || userGuess < gameSettings.minNumber || userGuess > gameSettings.maxNumber) {
        message.textContent = `Please enter a number between ${gameSettings.minNumber} and ${gameSettings.maxNumber}!`;
        message.style.color = '#ff6b6b';
        return;
    }
    totalGuesses++;
    if (userGuess === randomNumber) {
        correctGuesses++;
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
        const payout = calculatePayout();
        money += payout;
        // Create floating money effect
        const rect = guessButton.getBoundingClientRect();
        createFloatingMoney(payout, rect.left + rect.width / 2, rect.top);
        message.textContent = `🎉 Correct! You earned $${payout}!`;
        message.style.color = '#4CAF50';
        message.style.background = 'rgba(76, 175, 80, 0.2)';
        message.style.borderRadius = '10px';
        message.style.padding = '10px';
        if (currentStreak > 1) {
            showHint(`🔥 Streak: ${currentStreak}! Keep it going for bonus money!`);
        } else {
            showHint(`💡 Tip: Get streaks for bonus money!`);
        }
        // Generate new number
        randomNumber = Math.floor(Math.random() * (gameSettings.maxNumber - gameSettings.minNumber + 1)) + gameSettings.minNumber;
    } else {
        currentStreak = 0;
        let highLowMsg = userGuess > randomNumber ? 'Too high!' : 'Too low!';
        message.textContent = `❌ Wrong! ${highLowMsg}`;
        message.style.color = '#ff6b6b';
        message.style.background = 'rgba(255, 107, 107, 0.2)';
        message.style.borderRadius = '10px';
        message.style.padding = '10px';
        // Hint system
        if (upgrades.hintPower.level > 0) {
            let hintMessage = '🤔 Hint: ';
            const difference = Math.abs(randomNumber - userGuess);
            if (difference <= 2) {
                hintMessage += 'Very close!';
            } else if (difference <= 5) {
                hintMessage += 'Close!';
            } else {
                hintMessage += 'Far away!';
            }
            showHint(hintMessage);
        }
        // Do NOT reveal the number, just let the user keep guessing
    }
    updateDisplay();
    checkAchievements();
    // Clear input for next guess
    guessInput.value = '';
    guessInput.focus();
}

// Prestige system
function applyPrestige() {
    if (money < gameSettings.prestigeRequirement) {
        message.textContent = `You need $${gameSettings.prestigeRequirement} to prestige!`;
        message.style.color = '#ff6b6b';
        return;
    }
    
    // Convert excess money to prestige points
    const excessMoney = money - gameSettings.prestigeRequirement;
    const newPrestigePoints = Math.floor(excessMoney / 100000) + 1;
    prestigePoints += newPrestigePoints;
    
    // Reset game state
    money = 0;
    incomePerSecond = 0;
    correctGuesses = 0;
    totalGuesses = 0;
    currentStreak = 0;
    
    // Save prestige state
    saveGame();
    
    message.textContent = `Prestige successful! You gained ${newPrestigePoints} prestige points!`;
    message.style.color = '#4CAF50';
    message.style.background = 'rgba(76, 175, 80, 0.2)';
    message.style.borderRadius = '10px';
    message.style.padding = '10px';
    
    // Update displays
    updateDisplay();
    updateUpgradeButtons();
    updateMinerButtons();
    renderAchievements();
}

// Passive income
function applyPassiveIncome() {
    let totalIncome = 0;
    
    // Calculate income from miners
    for (let tier in miners) {
        const miner = miners[tier];
        totalIncome += miner.owned * miner.income;
    }
    
    // Calculate income from upgrades
    totalIncome += upgrades.autoGuesser.level * 5;
    
    money += totalIncome;
    updateDisplay();
}

// Prestige upgrades
function unlockPrestigeUpgrades() {
    // Example: Unlock an upgrade that increases base payout
    if (prestigePoints >= 10 && !upgrades.biggerPayout.unlocked) {
        upgrades.biggerPayout.unlocked = true;
        upgrades.biggerPayout.level = 1;
        upgrades.biggerPayout.cost = 50;
        
        message.textContent = 'New upgrade unlocked: Bigger Payout!';
        message.style.color = '#4CAF50';
        message.style.background = 'rgba(76, 175, 80, 0.2)';
        message.style.borderRadius = '10px';
        message.style.padding = '10px';
    }
    
    // Example: Unlock an upgrade that increases income per second
    if (prestigePoints >= 20 && !upgrades.autoGuesser.unlocked) {
        upgrades.autoGuesser.unlocked = true;
        upgrades.autoGuesser.level = 1;
        upgrades.autoGuesser.cost = 100;
        
        message.textContent = 'New upgrade unlocked: Auto Guesser!';
        message.style.color = '#4CAF50';
        message.style.background = 'rgba(76, 175, 80, 0.2)';
        message.style.borderRadius = '10px';
        message.style.padding = '10px';
    }
}

// Save and load game
function saveGame() {
    const gameData = {
        money,
        incomePerSecond,
        correctGuesses,
        totalGuesses,
        currentStreak,
        bestStreak,
        prestigePoints,
        upgrades,
        miners
    };
    
    localStorage.setItem('numberGuessingGame', JSON.stringify(gameData));
}

function loadGame() {
    const savedData = localStorage.getItem('numberGuessingGame');
    
    if (savedData) {
        const gameData = JSON.parse(savedData);
        
        money = gameData.money;
        incomePerSecond = gameData.incomePerSecond;
        correctGuesses = gameData.correctGuesses;
        totalGuesses = gameData.totalGuesses;
        currentStreak = gameData.currentStreak;
        bestStreak = gameData.bestStreak;
        prestigePoints = gameData.prestigePoints;
        upgrades = gameData.upgrades;
        miners = gameData.miners;
    }
}

// Achievements
function checkAchievements() {
    // Example: Check for the 'first_guess' achievement
    if (correctGuesses === 1 && !achievements.find(a => a.id === 'first_guess').unlocked) {
        unlockAchievement('first_guess');
    }
    
    // Check for other achievements
    if (correctGuesses === 10 && !achievements.find(a => a.id === 'number_novice').unlocked) {
        unlockAchievement('number_novice');
    }
    
    if (correctGuesses === 100 && !achievements.find(a => a.id === 'guessing_guru').unlocked) {
        unlockAchievement('guessing_guru');
    }
    
    if (money >= 1000 && !achievements.find(a => a.id === 'big_spender').unlocked) {
        unlockAchievement('big_spender');
    }
    
    if (money >= 10000 && !achievements.find(a => a.id === 'high_roller').unlocked) {
        unlockAchievement('high_roller');
    }
    
    if (bestStreak >= 5 && !achievements.find(a => a.id === 'streak_master').unlocked) {
        unlockAchievement('streak_master');
    }
    
    if (bestStreak >= 10 && !achievements.find(a => a.id === 'on_fire').unlocked) {
        unlockAchievement('on_fire');
    }
    
    if (money >= 10000 && !achievements.find(a => a.id === 'millionaire').unlocked) {
        unlockAchievement('millionaire');
    }
    
    if (money >= 1000000 && !achievements.find(a => a.id === 'tycoon').unlocked) {
        unlockAchievement('tycoon');
    }
    
    if (totalGuesses >= 20 && (correctGuesses / totalGuesses) >= 0.8 && !achievements.find(a => a.id === 'accuracy_king').unlocked) {
        unlockAchievement('accuracy_king');
    }
    
    if (upgrades.biggerPayout.level >= 10 && !achievements.find(a => a.id === 'upgrade_collector').unlocked) {
        unlockAchievement('upgrade_collector');
    }
    
    if (miners.bronze.owned + miners.silver.owned + miners.gold.owned >= 50 && !achievements.find(a => a.id === 'miner_mogul').unlocked) {
        unlockAchievement('miner_mogul');
    }
    
    if (miners.gold.owned >= 10 && !achievements.find(a => a.id === 'gold_rush').unlocked) {
        unlockAchievement('gold_rush');
    }
    
    if (gameSettings.maxNumber - gameSettings.minNumber >= 100 && !achievements.find(a => a.id === 'range_master').unlocked) {
        unlockAchievement('range_master');
    }
}

function unlockAchievement(id) {
    const achievement = achievements.find(a => a.id === id);
    if (achievement) {
        achievement.unlocked = true;
        showHint(`🎉 Achievement unlocked: ${achievement.name}! ${achievement.description}`);
        
        // Update achievements display
        renderAchievements();
    }
}

// Show hint messages
function showHint(message) {
    hint.textContent = message;
    hint.style.opacity = 1;
    
    setTimeout(() => {
        hint.style.opacity = 0;
    }, 3000);
}

// Upgrade functions
function upgradeBiggerPayout() {
    const upgrade = upgrades.biggerPayout;
    
    if (money < upgrade.cost) {
        message.textContent = `Not enough money! (${upgrade.cost})`;
        message.style.color = '#ff6b6b';
        return;
    }
    
    money -= upgrade.cost;
    upgrade.level++;
    upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.level - 1));
    
    updateDisplay();
    updateUpgradeButtons();
}

function upgradeLuckyBonus() {
    const upgrade = upgrades.luckyBonus;
    
    if (money < upgrade.cost) {
        message.textContent = `Not enough money! (${upgrade.cost})`;
        message.style.color = '#ff6b6b';
        return;
    }
    
    money -= upgrade.cost;
    upgrade.level++;
    upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.level - 1));
    
    updateDisplay();
    updateUpgradeButtons();
}

function upgradeRangeReducer() {
    const upgrade = upgrades.rangeReducer;
    
    if (money < upgrade.cost) {
        message.textContent = `Not enough money! (${upgrade.cost})`;
        message.style.color = '#ff6b6b';
        return;
    }
    
    money -= upgrade.cost;
    upgrade.level++;
    upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.level - 1));
    
    // Reduce number range
    gameSettings.minNumber += 5;
    gameSettings.maxNumber -= 5;
    
    updateDisplay();
    updateUpgradeButtons();
}

function upgradeHintPower() {
    const upgrade = upgrades.hintPower;
    
    if (money < upgrade.cost) {
        message.textContent = `Not enough money! (${upgrade.cost})`;
        message.style.color = '#ff6b6b';
        return;
    }
    
    money -= upgrade.cost;
    upgrade.level++;
    upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.level - 1));
    
    updateDisplay();
    updateUpgradeButtons();
}

function upgradeBiggerRange() {
    const upgrade = upgrades.biggerRange;
    
    if (money < upgrade.cost) {
        message.textContent = `Not enough money! (${upgrade.cost})`;
        message.style.color = '#ff6b6b';
        return;
    }
    
    money -= upgrade.cost;
    upgrade.level++;
    upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.level - 1));
    
    // Increase number range
    gameSettings.minNumber -= 5;
    gameSettings.maxNumber += 5;
    
    updateDisplay();
    updateUpgradeButtons();
}

function upgradeStreakMultiplier() {
    const upgrade = upgrades.streakMultiplier;
    
    if (money < upgrade.cost) {
        message.textContent = `Not enough money! (${upgrade.cost})`;
        message.style.color = '#ff6b6b';
        return;
    }
    
    money -= upgrade.cost;
    upgrade.level++;
    upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.level - 1));
    
    updateDisplay();
    updateUpgradeButtons();
}

function upgradeAutoGuesser() {
    const upgrade = upgrades.autoGuesser;
    
    if (money < upgrade.cost) {
        message.textContent = `Not enough money! (${upgrade.cost})`;
        message.style.color = '#ff6b6b';
        return;
    }
    
    money -= upgrade.cost;
    upgrade.level++;
    upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.level - 1));
    
    updateDisplay();
    updateUpgradeButtons();
}

// Miner functions
function buyBronzeMiner() {
    const miner = miners.bronze;
    
    if (money < miner.cost) {
        message.textContent = `Not enough money! (${miner.cost})`;
        message.style.color = '#ff6b6b';
        return;
    }
    
    money -= miner.cost;
    miner.owned++;
    miner.cost = Math.floor(miner.baseCost * Math.pow(1.5, miner.owned - 1));
    
    updateDisplay();
    updateMinerButtons();
}

function buySilverMiner() {
    const miner = miners.silver;
    
    if (money < miner.cost) {
        message.textContent = `Not enough money! (${miner.cost})`;
        message.style.color = '#ff6b6b';
        return;
    }
    
    money -= miner.cost;
    miner.owned++;
    miner.cost = Math.floor(miner.baseCost * Math.pow(1.5, miner.owned - 1));
    
    updateDisplay();
    updateMinerButtons();
}

function buyGoldMiner() {
    const miner = miners.gold;
    
    if (money < miner.cost) {
        message.textContent = `Not enough money! (${miner.cost})`;
        message.style.color = '#ff6b6b';
        return;
    }
    
    money -= miner.cost;
    miner.owned++;
    miner.cost = Math.floor(miner.baseCost * Math.pow(1.5, miner.owned - 1));
    
    updateDisplay();
    updateMinerButtons();
}

// Update upgrade buttons
function updateUpgradeButtons() {
    for (let key in upgrades) {
        const upgrade = upgrades[key];
        const button = document.getElementById(`${key}Button`);
        
        if (button) {
            button.textContent = `Upgrade ${key.replace(/([A-Z])/g, ' $1')}: Level ${upgrade.level} (Cost: $${upgrade.cost})`;
            button.disabled = money < upgrade.cost;
        }
    }
}

// Update miner buttons
function updateMinerButtons() {
    for (let key in miners) {
        const miner = miners[key];
        const button = document.getElementById(`${key}Button`);
        
        if (button) {
            button.textContent = `Buy ${key.charAt(0).toUpperCase() + key.slice(1)} Miner: ${miner.owned} owned (Cost: $${miner.cost})`;
            button.disabled = money < miner.cost;
        }
    }
}

// Render achievements
function renderAchievements() {
    const achievementsContainer = document.getElementById('achievements-container');
    achievementsContainer.innerHTML = '';
    
    achievements.forEach(achievement => {
        const achievementElement = document.createElement('div');
        achievementElement.className = 'achievement';
        achievementElement.textContent = achievement.name;
        
        if (achievement.unlocked) {
            achievementElement.classList.add('unlocked');
        }
        
        achievementsContainer.appendChild(achievementElement);
    });
}

// Start the game
initGame();
