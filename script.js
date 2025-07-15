// Game state
let randomNumber = Math.floor(Math.random() * 10) + 1; // Updated for new range
let money = 25; // Starting money to help new players
let incomePerSecond = 0;
let correctGuesses = 0;
let totalGuesses = 0;
let currentStreak = 0;
let bestStreak = 0;
let prestigePoints = 0;
let lastSaveTime = Date.now(); // For offline progress calculation
let totalMoneyEarned = 0; // Track lifetime earnings for achievements

// Achievement tracking
let achievementCounters = {
    powerUpsUsed: 0,
    miniGamesPlayed: 0,
    goldenNumbersHit: 0,
    luckyDrawWins: 0,
    slotJackpots: 0,
    wheelSpins: 0,
    rapidFireBest: 0
};

// New fun features
let powerUps = {
    doubleOrNothing: { active: false, cooldown: 0 },
    timeFreeze: { active: false, duration: 0 },
    luckyDraw: { active: false, cooldown: 0 },
    magneticNumbers: { active: false, duration: 0 }
};

let specialEvents = {
    goldenNumber: { active: false, number: null, multiplier: 5 },
    numberRush: { active: false, timeLeft: 0, bonusMultiplier: 2 },
    mysteryBox: { available: false, reward: 0 }
};

let miniGames = {
    spinTheWheel: { available: true, cost: 25 }, // Reduced from 50 to 25
    slotMachine: { available: true, cost: 50 }, // Reduced from 100 to 50
    numberBingo: { active: false, card: [] }
};

// New sound and visual effects tracking
let comboMultiplier = 1;
let lastGuessTime = Date.now();
let rapidFireBonus = 0;

// Enhanced fun facts with categories
let funFactCategories = {
    tech: [
        "🚀 JavaScript was created in just 10 days!",
        "💻 The first computer was called ENIAC!",
        "🔢 Binary code uses only 0s and 1s!",
        "🌐 The internet started as ARPANET in 1969!"
    ],
    space: [
        "🌟 There are more stars than grains of sand!",
        "🪐 Saturn's moon Titan has lakes of methane!",
        "🌙 The moon is moving away from Earth!",
        "☄️ Asteroids can contain precious metals!"
    ],
    nature: [
        "🐙 Octopuses have three hearts!",
        "🦋 Butterflies taste with their feet!",
        "🐧 Penguins can jump 6 feet high!",
        "🦒 Giraffes only sleep 2 hours a day!"
    ],
    math: [
        "∞ Infinity plus one still equals infinity!",
        "🎯 Pi has been calculated to 62.8 trillion digits!",
        "🔢 Zero was invented in India around 628 AD!",
        "📐 A circle has infinite sides!"
    ]
};

// Flatten all facts for random selection
let funFacts = Object.values(funFactCategories).flat();

// Enhanced floating money animation with more visual flair
function createFloatingMoney(amount, x, y) {
    const floatingMoney = document.createElement('div');
    floatingMoney.className = 'floating-money-particle';
    
    // Add special effects for larger amounts
    if (amount >= 100) {
        floatingMoney.textContent = `💰+$${amount}`;
        floatingMoney.style.fontSize = '1.5em';
        floatingMoney.style.color = '#ffd700';
    } else if (amount >= 50) {
        floatingMoney.textContent = `💸+$${amount}`;
        floatingMoney.style.color = '#90EE90';
    } else {
        floatingMoney.textContent = `+$${amount}`;
    }
    
    floatingMoney.style.left = x + 'px';
    floatingMoney.style.top = y + 'px';
    
    document.getElementById('floating-money').appendChild(floatingMoney);
    
    setTimeout(() => {
        floatingMoney.remove();
    }, 2000);
}

// Power-up visual effect
function createPowerUpEffect(type, x, y) {
    const powerUpEffect = document.createElement('div');
    powerUpEffect.className = 'power-up-effect';
    
    const effects = {
        doubleOrNothing: '🎲💥',
        timeFreeze: '⏰❄️',
        luckyDraw: '🍀✨',
        magneticNumbers: '🧲⚡'
    };
    
    powerUpEffect.textContent = effects[type] || '✨';
    powerUpEffect.style.left = x + 'px';
    powerUpEffect.style.top = y + 'px';
    
    document.getElementById('floating-money').appendChild(powerUpEffect);
    
    setTimeout(() => {
        powerUpEffect.remove();
    }, 3000);
}

// Combo multiplier effect
function createComboEffect(combo, x, y) {
    if (combo <= 1) return;
    
    const comboEffect = document.createElement('div');
    comboEffect.className = 'combo-effect';
    comboEffect.textContent = `${combo}x COMBO! 🔥`;
    comboEffect.style.left = x + 'px';
    comboEffect.style.top = y + 'px';
    comboEffect.style.fontSize = Math.min(2 + combo * 0.2, 3) + 'em';
    
    document.getElementById('floating-money').appendChild(comboEffect);
    
    setTimeout(() => {
        comboEffect.remove();
    }, 2500);
}

// Screen shake effect for big wins
function screenShake() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.style.animation = 'shake 0.5s ease-in-out';
    
    setTimeout(() => {
        gameContainer.style.animation = '';
    }, 500);
}

// Enhanced confetti celebration with different types
function createConfetti(type = 'normal') {
    const celebrationContainer = document.getElementById('celebration-container');
    const confettiCount = type === 'mega' ? 100 : 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        if (type === 'golden') {
            confetti.style.backgroundColor = '#ffd700';
            confetti.textContent = '⭐';
        } else if (type === 'mega') {
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 90%, 70%)`;
            confetti.textContent = ['💰', '💎', '🎆', '✨'][Math.floor(Math.random() * 4)];
        } else {
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
        }
        
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        celebrationContainer.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 6000);
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
    biggerPayout: { level: 1, cost: 5, baseCost: 5 }, // Reduced from 10 to 5
    luckyBonus: { level: 0, cost: 15, baseCost: 15 }, // Reduced from 25 to 15
    rangeReducer: { level: 0, cost: 30, baseCost: 30 }, // Reduced from 50 to 30
    hintPower: { level: 0, cost: 40, baseCost: 40 }, // Reduced from 75 to 40
    biggerRange: { level: 0, cost: 80, baseCost: 80 }, // Reduced from 150 to 80
    streakMultiplier: { level: 0, cost: 50, baseCost: 50 }, // Reduced from 100 to 50
    autoGuesser: { level: 0, cost: 250, baseCost: 250 } // Reduced from 500 to 250
};

// Miner levels and costs
let miners = {
    bronze: { owned: 0, cost: 10, baseCost: 10, income: 2 }, // Reduced cost and increased income
    silver: { owned: 0, cost: 500, baseCost: 500, income: 20 }, // Reduced cost and increased income
    gold: { owned: 0, cost: 5000, baseCost: 5000, income: 200 } // Reduced cost and increased income
};

// Game settings
let gameSettings = {
    minNumber: 1,
    maxNumber: 10, // Reduced from 20 to 10 for easier guessing
    basePayout: 5, // Increased from 3 to 5 for higher rewards
    prestigeRequirement: 500000 // Reduced from 1M to 500K
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
const totalMoneyDisplay = document.getElementById('total-money-display');

// Achievements system
let achievements = [
    { id: 'first_guess', name: '🎯 First Success', description: 'Make your first correct guess', unlocked: false },
    { id: 'number_novice', name: '🔢 Number Novice', description: 'Get 5 correct guesses', unlocked: false },
    { id: 'guessing_guru', name: '🔮 Guessing Guru', description: 'Get 50 correct guesses', unlocked: false },
    { id: 'big_spender', name: '💸 Big Spender', description: 'Spend $500 on upgrades', unlocked: false },
    { id: 'high_roller', name: '🎩 High Roller', description: 'Spend $5,000 on upgrades', unlocked: false },
    { id: 'streak_master', name: '🔥 Streak Master', description: 'Get 3 correct guesses in a row', unlocked: false },
    { id: 'on_fire', name: '🌋 On Fire!', description: 'Get a streak of 7', unlocked: false },
    { id: 'millionaire', name: '💰 Millionaire', description: 'Earn $5,000', unlocked: false },
    { id: 'tycoon', name: '🎩 Tycoon', description: 'Earn $500,000', unlocked: false },
    { id: 'accuracy_king', name: '👑 Accuracy King', description: 'Achieve 70% accuracy with 15+ guesses', unlocked: false },
    { id: 'upgrade_collector', name: '🚀 Upgrade Collector', description: 'Get any upgrade to level 5', unlocked: false },
    { id: 'miner_mogul', name: '⛏️ Miner Mogul', description: 'Own a total of 25 miners', unlocked: false },
    { id: 'gold_rush', name: '🌟 Gold Rush', description: 'Own 5 Gold Miners', unlocked: false },
    { id: 'range_master', name: '📈 Range Master', description: 'Play with a number range of 50 or more', unlocked: false },
    // New achievements for fun features
    { id: 'golden_hunter', name: '✨ Golden Hunter', description: 'Hit a Golden Number', unlocked: false },
    { id: 'power_user', name: '⚡ Power User', description: 'Use 5 power-ups', unlocked: false },
    { id: 'gambler', name: '🎰 Gambler', description: 'Play 10 mini-games', unlocked: false },
    { id: 'speed_demon', name: '🏃 Speed Demon', description: 'Make 5 guesses in under 15 seconds', unlocked: false },
    { id: 'combo_master', name: '🔥 Combo Master', description: 'Achieve a 10x combo streak', unlocked: false },
    { id: 'lucky_charm', name: '🍀 Lucky Charm', description: 'Win 3 Lucky Draws', unlocked: false },
    { id: 'slot_king', name: '👑 Slot King', description: 'Hit 2 jackpots in slot machine', unlocked: false },
    { id: 'wheel_spinner', name: '🎡 Wheel Spinner', description: 'Spin the wheel 25 times', unlocked: false },
    { id: 'rapid_fire_master', name: '⚡ Rapid Fire Master', description: 'Score 10+ in rapid fire mode', unlocked: false }
];

// Auto-guesser variables
let autoGuesserActive = false;
let autoGuesserInterval;

// Initialize game
function initGame() {
    updateDisplay();
    renderAchievements();
    updateFunFact();
    updateCooldownDisplays();

    // Add event listener for the guess button
    guessButton.addEventListener('click', makeGuess);
    // Allow Enter key to submit guess
    guessInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            makeGuess();
        }
    });

    // Wire up upgrade buttons
    document.getElementById('bigger-payout').addEventListener('click', upgradeBiggerPayout);
    document.getElementById('lucky-bonus').addEventListener('click', upgradeLuckyBonus);
    document.getElementById('range-reducer').addEventListener('click', upgradeRangeReducer);
    document.getElementById('hint-power').addEventListener('click', upgradeHintPower);
    document.getElementById('bigger-range').addEventListener('click', upgradeBiggerRange);
    document.getElementById('streak-multiplier').addEventListener('click', upgradeStreakMultiplier);
    document.getElementById('auto-guesser').addEventListener('click', upgradeAutoGuesser);
    document.getElementById('prestige').addEventListener('click', applyPrestige);

    // Wire up miner buttons
    document.getElementById('bronze-miner').addEventListener('click', buyBronzeMiner);
    document.getElementById('silver-miner').addEventListener('click', buySilverMiner);
    document.getElementById('gold-miner').addEventListener('click', buyGoldMiner);

    // Update fun fact every 10 seconds
    setInterval(updateFunFact, 10000);
    // Passive income interval
    setInterval(applyPassiveIncome, 1000);
    // Cooldown management
    setInterval(updateCooldowns, 1000);
    // Auto-save every 30 seconds
    setInterval(saveGame, 30000);
    // Golden Number interval
    setInterval(spawnGoldenNumber, 30000);
    // Number Rush chance
    setInterval(() => {
        if (Math.random() < 0.05) activateNumberRush(); // 5% chance every 30 seconds
    }, 30000);
    
    // Load save data if exists
    loadGame();
    
    // Add click handler for number wheel
    numberWheel.addEventListener('click', () => {
        if (numberWheel.classList.contains('spinning')) return;

        numberWheel.classList.add('spinning');
        numberWheel.style.animation = 'spin 1s ease-out';
        
        let spinCount = 0;
        const spinInterval = setInterval(() => {
            numberWheel.textContent = Math.floor(Math.random() * (gameSettings.maxNumber - gameSettings.minNumber + 1)) + gameSettings.minNumber;
            spinCount++;
            if (spinCount > 20) { // Spin for a bit
                clearInterval(spinInterval);
                randomNumber = Math.floor(Math.random() * (gameSettings.maxNumber - gameSettings.minNumber + 1)) + gameSettings.minNumber;
                numberWheel.textContent = '🎰';
                showHint(`A new number has been chosen! Good luck!`);
                numberWheel.style.animation = '';
                numberWheel.classList.remove('spinning');
            }
        }, 50);
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
    if (totalMoneyDisplay) {
        totalMoneyDisplay.textContent = Math.floor(totalMoneyEarned);
    }
    updateUpgradeButtons();
    updateMinerButtons();
}

function updateUpgradeButtons() {

    const bpBtn = document.getElementById('bigger-payout');
    bpBtn.querySelector('.cost').textContent = upgrades.biggerPayout.cost;
    bpBtn.querySelector('.level').textContent = upgrades.biggerPayout.level;
    bpBtn.disabled = money < upgrades.biggerPayout.cost;
    const lbBtn = document.getElementById('lucky-bonus');
    lbBtn.querySelector('.cost').textContent = upgrades.luckyBonus.cost;
    lbBtn.querySelector('.level').textContent = upgrades.luckyBonus.level;
    lbBtn.disabled = money < upgrades.luckyBonus.cost;

    const rrBtn = document.getElementById('range-reducer');
    rrBtn.querySelector('.cost').textContent = upgrades.rangeReducer.cost;
    rrBtn.querySelector('.level').textContent = upgrades.rangeReducer.level;
    rrBtn.disabled = money < upgrades.rangeReducer.cost;

    const hpBtn = document.getElementById('hint-power');
    hpBtn.querySelector('.cost').textContent = upgrades.hintPower.cost;
    hpBtn.querySelector('.level').textContent = upgrades.hintPower.level;
    hpBtn.disabled = money < upgrades.hintPower.cost;

    const brBtn = document.getElementById('bigger-range');
    brBtn.querySelector('.cost').textContent = upgrades.biggerRange.cost;
    brBtn.querySelector('.level').textContent = upgrades.biggerRange.level;
    brBtn.disabled = money < upgrades.biggerRange.cost;

    // Streak multiplier and auto-guesser
    const smBtn = document.getElementById('streak-multiplier');
    smBtn.querySelector('.cost').textContent = upgrades.streakMultiplier.cost;
    smBtn.querySelector('.level').textContent = upgrades.streakMultiplier.level;
    smBtn.disabled = money < upgrades.streakMultiplier.cost;

    const agBtn = document.getElementById('auto-guesser');
    agBtn.querySelector('.cost').textContent = upgrades.autoGuesser.cost;
    agBtn.querySelector('.level').textContent = upgrades.autoGuesser.level;
    agBtn.disabled = money < upgrades.autoGuesser.cost;
    
    // prestige
    document.getElementById('prestige').disabled = money < gameSettings.prestigeRequirement;
}

function updateMinerButtons() {
    // bronze-miner
    const bmBtn = document.getElementById('bronze-miner');
    bmBtn.querySelector('.cost').textContent = miners.bronze.cost;
    bmBtn.querySelector('.owned').textContent = miners.bronze.owned;
    bmBtn.disabled = money < miners.bronze.cost;

    // silver-miner
    const smBtn = document.getElementById('silver-miner');
    smBtn.querySelector('.cost').textContent = miners.silver.cost;
    smBtn.querySelector('.owned').textContent = miners.silver.owned;
    smBtn.disabled = money < miners.silver.cost;

    // gold-miner
    const gmBtn = document.getElementById('gold-miner');
    gmBtn.querySelector('.cost').textContent = miners.gold.cost;
    gmBtn.querySelector('.owned').textContent = miners.gold.owned;
    gmBtn.disabled = money < miners.gold.cost;
}

function renderAchievements() {
    const achievementsList = document.getElementById('achievements-list');
    achievementsList.innerHTML = '';
    achievements.forEach(ach => {
        const achDiv = document.createElement('div');
        achDiv.className = 'achievement';
        achDiv.setAttribute('data-id', ach.id);
        if (ach.unlocked) {
            achDiv.classList.add('unlocked');
        }
        achDiv.innerHTML = `<strong>${ach.name}</strong><br><small>${ach.description}</small>`;
        achievementsList.appendChild(achDiv);
    });
}

function calculatePayout() {
    let payout = gameSettings.basePayout + upgrades.biggerPayout.level - 1;
    
    // Lucky bonus - increased chance and better multiplier
    if (upgrades.luckyBonus.level > 0 && Math.random() < 0.15 * upgrades.luckyBonus.level) { // Increased from 0.1 to 0.15
        payout *= 3; // Increased from 2x to 3x
        showHint('🍀 Lucky bonus activated! Triple money!');
    }
    
    // Streak multiplier - more generous
    if (upgrades.streakMultiplier.level > 0 && currentStreak > 1) {
        payout += Math.floor(currentStreak * upgrades.streakMultiplier.level * 0.8); // Increased from 0.5 to 0.8
    }
    
    // Prestige bonus - increased multiplier
    payout *= (1 + prestigePoints * 0.15); // Increased from 0.1 to 0.15

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
    const currentTime = Date.now();
    const timeDiff = currentTime - lastGuessTime;
    lastGuessTime = currentTime;
    
    // Rapid fire bonus (if guessing within 4 seconds)
    if (timeDiff < 4000) {
        rapidFireBonus = Math.min(rapidFireBonus + 0.1, 2.0); // Max 2x bonus
    } else {
        rapidFireBonus = Math.max(rapidFireBonus - 0.05, 0);
    }
    
    if (userGuess === randomNumber) {
        correctGuesses++;
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
        
        let payout = calculatePayout();
        
        // Add a small chance for a "Critical Hit"
        if (Math.random() < 0.05) { // 5% chance
            payout *= 10; // 10x multiplier!
            showHint("💥 CRITICAL HIT! 10x MONEY!");
            const rect = guessButton.getBoundingClientRect();
            const critEffect = document.createElement('div');
            critEffect.className = 'floating-money-particle critical-strike';
            critEffect.textContent = `💥 x10! +$${payout}`;
            critEffect.style.left = (rect.left + rect.width / 2) + 'px';
            critEffect.style.top = (rect.top - 30) + 'px';
            critEffect.style.fontSize = '2em';
            document.getElementById('floating-money').appendChild(critEffect);
            setTimeout(() => critEffect.remove(), 3000);
            screenShake();
        }

        // Apply rapid fire bonus
        if (rapidFireBonus > 0) {
            payout = Math.floor(payout * (1 + rapidFireBonus));
        }
        
        // Golden number bonus
        if (specialEvents.goldenNumber.active && userGuess === specialEvents.goldenNumber.number) {
            payout *= specialEvents.goldenNumber.multiplier;
            specialEvents.goldenNumber.active = false;
            achievementCounters.goldenNumbersHit++; // Track for achievements
            showHint(`✨ GOLDEN NUMBER HIT! ${specialEvents.goldenNumber.multiplier}x BONUS!`);
            createConfetti('golden');
            screenShake();
        }
        
        // Number rush bonus
        if (specialEvents.numberRush.active) {
            payout *= specialEvents.numberRush.bonusMultiplier;
        }
        
        // Double or Nothing power-up
        if (powerUps.doubleOrNothing.active) {
            powerUps.doubleOrNothing.active = false;
            if (Math.random() < 0.5) {
                payout *= 2;
                showHint("🎲 Double or Nothing: DOUBLED!");
                createConfetti('mega');
            } else {
                money = Math.floor(money / 2);
                showHint("🎲 Double or Nothing: Lost half your money!");
            }
        }
                
        money += payout;
        totalMoneyEarned += payout; // Track for achievements
        
        // Create floating money effect
        const rect = guessButton.getBoundingClientRect();
        createFloatingMoney(payout, rect.left + rect.width / 2, rect.top);
        
        // Combo effect for streaks
        if (currentStreak > 2) {
            createComboEffect(currentStreak, rect.left + rect.width / 2, rect.top - 50);
        }
        
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
        
        // Chance to trigger special events
        if (Math.random() < 0.1) activateNumberRush();
        if (Math.random() < 0.08) spawnMysteryBox(); // 8% chance for a mystery box

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
        
        // Enhanced hint system - now provides hints even at level 0
        if (upgrades.hintPower.level >= 0) { // Changed from > 0 to >= 0 so everyone gets basic hints
            let hintMessage = '🤔 Hint: ';
            const difference = Math.abs(randomNumber - userGuess);
            const percentDiff = difference / (gameSettings.maxNumber - gameSettings.minNumber);
            
            if (percentDiff < 0.05) { // Made more generous
                hintMessage += 'Extremely close! 🎯';
            } else if (percentDiff < 0.15) { // Made more generous
                hintMessage += 'Very close! 🔥';
            } else if (percentDiff < 0.3) { // Made more generous
                hintMessage += 'Close! 👀';
            } else if (percentDiff < 0.5) { // Made more generous
                hintMessage += 'Getting warmer! 🌡️';
            } else {
                hintMessage += 'Far away! 🧊';
            }
            
            // Give exact distance hint for everyone
            hintMessage += ` | Off by ${difference}`;
            
            // Advanced hints at lower levels
            if (upgrades.hintPower.level >= 1) { // Reduced from 3 to 1
                const isEven = randomNumber % 2 === 0;
                hintMessage += ` | Number is ${isEven ? 'even' : 'odd'}`;
            }
            
            if (upgrades.hintPower.level >= 2) { // Reduced from 5 to 2
                if (randomNumber <= (gameSettings.minNumber + gameSettings.maxNumber) / 2) {
                    hintMessage += ` | Lower half of range`;
                } else {
                    hintMessage += ` | Upper half of range`;
                }
            }
            
            showHint(hintMessage);
        }
    }
    
    updateDisplay();
    checkAchievements();
    
    // Clear input for next guess
    guessInput.value = '';
    guessInput.focus();
}

// Tab switching functionality
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Cooldown management system
function updateCooldowns() {
    // Update power-up cooldowns
    for (let powerUp in powerUps) {
        if (powerUps[powerUp].cooldown > 0) {
            powerUps[powerUp].cooldown--;
        }
    }
    
    // Update UI displays
    updateCooldownDisplays();
}

function updateCooldownDisplays() {
    const cooldownElements = {
        'don-cooldown': powerUps.doubleOrNothing.cooldown,
        'ld-cooldown': powerUps.luckyDraw.cooldown,
        'tf-cooldown': powerUps.timeFreeze.cooldown,
        'nm-cooldown': powerUps.magneticNumbers.cooldown
    };
    
    for (let elementId in cooldownElements) {
        const element = document.getElementById(elementId);
        if (element) {
            const cooldown = cooldownElements[elementId];
            if (cooldown > 0) {
                element.textContent = `Cooldown: ${cooldown}s`;
                element.className = 'cooldown-timer';
            } else {
                element.textContent = 'Ready!';
                element.className = '';
            }
        }
    }
}

// Additional mini-games
function spinTheWheel() {
    if (money < miniGames.spinTheWheel.cost) {
        showHint(`Need $${miniGames.spinTheWheel.cost} to spin the wheel!`);
        return;
    }
    money -= miniGames.spinTheWheel.cost;
    achievementCounters.miniGamesPlayed++;
    achievementCounters.wheelSpins++;

    // Create modal
    let modal = document.createElement('div');
    modal.id = 'wheel-modal';
    modal.style.position = 'fixed';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.5)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '2000';


    // Wheel visual (centered flex column)
    let wheelContainer = document.createElement('div');
    wheelContainer.style.background = '#fff';
    wheelContainer.style.borderRadius = '16px';
    wheelContainer.style.padding = '32px';
    wheelContainer.style.boxShadow = '0 4px 24px rgba(0,0,0,0.15)';
    wheelContainer.style.textAlign = 'center';
    wheelContainer.style.display = 'flex';
    wheelContainer.style.flexDirection = 'column';
    wheelContainer.style.alignItems = 'center';

    // Arrow (above wheel, centered)
    let arrow = document.createElement('div');
    arrow.style.width = '0';
    arrow.style.height = '0';
    arrow.style.borderLeft = '22px solid transparent';
    arrow.style.borderRight = '22px solid transparent';
    arrow.style.borderBottom = '38px solid #4299e1';
    arrow.style.margin = '0 auto -10px auto';
    arrow.style.position = 'relative';
    arrow.style.zIndex = '2';
    wheelContainer.appendChild(arrow);

    let wheel = document.createElement('div');
    wheel.id = 'wheel-visual';
    wheel.style.width = '240px';
    wheel.style.height = '240px';
    wheel.style.borderRadius = '50%';
    wheel.style.border = '10px solid #4299e1';
    wheel.style.margin = '0 auto 24px auto';
    wheel.style.position = 'relative';
    wheel.style.overflow = 'hidden';
    wheel.style.boxShadow = '0 2px 12px rgba(66,153,225,0.15)';
    // Remove flex centering so SVG fills the div

    // Wheel segments
    const prizes = [
        { value: 0, text: 'Nothing', color: '#e2e8f0' },
        { value: 10, text: '$10', color: '#90cdf4' },
        { value: 50, text: '$50', color: '#f6e05e' },
        { value: 100, text: '$100', color: '#68d391' },
        { value: 250, text: '$250', color: '#fbb6ce' },
        { value: 500, text: '$500', color: '#f56565' },
        { value: 1500, text: 'JACKPOT! $1500', color: '#ffd700' }
    ];
    let wheelSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    wheelSVG.setAttribute('width', '100%');
    wheelSVG.setAttribute('height', '100%');
    wheelSVG.setAttribute('viewBox', '0 0 240 240');
    let numSegments = prizes.length;
    let angle = 360 / numSegments;
    for (let i = 0; i < numSegments; i++) {
        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let startAngle = angle * i;
        let endAngle = angle * (i + 1);
        let largeArc = endAngle - startAngle > 180 ? 1 : 0;
        let x1 = 120 + 100 * Math.cos(Math.PI * startAngle / 180);
        let y1 = 120 + 100 * Math.sin(Math.PI * startAngle / 180);
        let x2 = 120 + 100 * Math.cos(Math.PI * endAngle / 180);
        let y2 = 120 + 100 * Math.sin(Math.PI * endAngle / 180);
        let d = `M120,120 L${x1},${y1} A100,100 0 ${largeArc},1 ${x2},${y2} Z`;
        path.setAttribute('d', d);
        path.setAttribute('fill', prizes[i].color);
        wheelSVG.appendChild(path);
        // Add text label
        let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        let labelAngle = startAngle + angle / 2;
        let tx = 120 + 70 * Math.cos(Math.PI * labelAngle / 180);
        let ty = 120 + 70 * Math.sin(Math.PI * labelAngle / 180);
        text.setAttribute('x', tx);
        text.setAttribute('y', ty);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('font-size', '1rem');
        text.setAttribute('fill', '#2d3748');
        text.textContent = prizes[i].text;
        wheelSVG.appendChild(text);
    }
    wheel.appendChild(wheelSVG);
    wheelContainer.appendChild(wheel);

    let resultText = document.createElement('div');
    resultText.style.fontSize = '1.25rem';
    resultText.style.margin = '24px 0 0 0';
    resultText.textContent = 'Spinning...';
    wheelContainer.appendChild(resultText);

    modal.appendChild(wheelContainer);
    document.body.appendChild(modal);

    // Animate wheel spin
    let spinIndex = Math.floor(Math.random() * prizes.length);
    let spins = 5; // Number of full spins
    let totalAngle = 360 * spins + (360 - spinIndex * angle - angle / 2);
    wheelSVG.style.transition = 'transform 2.2s cubic-bezier(.17,.67,.83,.67)';
    wheelSVG.style.transformOrigin = '50% 50%';
    setTimeout(() => {
        wheelSVG.style.transform = `rotate(${totalAngle}deg)`;
    }, 100);

    setTimeout(() => {
        let prize = prizes[spinIndex];
        resultText.textContent = `The wheel landed on: ${prize.text}!`;
        if (prize.value > 0) {
            money += prize.value;
            totalMoneyEarned += prize.value;
            createFloatingMoney(prize.value, window.innerWidth / 2, window.innerHeight / 2);
            if (prize.value >= 1500) {
                createConfetti('mega');
                screenShake();
            }
        }
        updateDisplay();
        // Close modal after 2s
        setTimeout(() => {
            modal.remove();
        }, 2000);
    }, 2300);
}

function playSlotMachine() {
    if (money < miniGames.slotMachine.cost) {
        showHint(`Need $${miniGames.slotMachine.cost} to play the slots!`);
        return;
    }
    money -= miniGames.slotMachine.cost;
    achievementCounters.miniGamesPlayed++;

    // Create modal
    let modal = document.createElement('div');
    modal.id = 'slot-modal';
    modal.style.position = 'fixed';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.5)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '2000';

    let slotContainer = document.createElement('div');
    slotContainer.style.background = '#fff';
    slotContainer.style.borderRadius = '16px';
    slotContainer.style.padding = '32px';
    slotContainer.style.boxShadow = '0 4px 24px rgba(0,0,0,0.15)';
    slotContainer.style.textAlign = 'center';

    let slotTitle = document.createElement('div');
    slotTitle.textContent = 'Slot Machine';
    slotTitle.style.fontSize = '1.5rem';
    slotTitle.style.marginBottom = '16px';
    slotTitle.style.fontWeight = '700';
    slotContainer.appendChild(slotTitle);

    let reels = ['🍒', '🍋', '🍊', '🍉', '⭐', '💰'];
    let reelDivs = [];
    let reelsContainer = document.createElement('div');
    reelsContainer.style.display = 'flex';
    reelsContainer.style.justifyContent = 'center';
    reelsContainer.style.gap = '24px';
    reelsContainer.style.margin = '24px 0';
    for (let i = 0; i < 3; i++) {
        let reel = document.createElement('div');
        reel.style.width = '64px';
        reel.style.height = '64px';
        reel.style.background = '#f7fafc';
        reel.style.border = '2px solid #e2e8f0';
        reel.style.borderRadius = '12px';
        reel.style.fontSize = '2.5rem';
        reel.style.display = 'flex';
        reel.style.alignItems = 'center';
        reel.style.justifyContent = 'center';
        reel.textContent = '❓';
        reelsContainer.appendChild(reel);
        reelDivs.push(reel);
    }
    slotContainer.appendChild(reelsContainer);

    let resultText = document.createElement('div');
    resultText.style.fontSize = '1.25rem';
    resultText.style.margin = '24px 0 0 0';
    resultText.textContent = 'Spinning...';
    slotContainer.appendChild(resultText);

    modal.appendChild(slotContainer);
    document.body.appendChild(modal);

    // Animate reels
    let finalReels = [];
    for (let i = 0; i < 3; i++) {
        finalReels[i] = reels[Math.floor(Math.random() * reels.length)];
    }
    let spinTimes = [900, 1200, 1500];
    for (let i = 0; i < 3; i++) {
        let spins = 0;
        let spinInterval = setInterval(() => {
            reelDivs[i].textContent = reels[Math.floor(Math.random() * reels.length)];
            spins++;
        }, 60);
        setTimeout(() => {
            clearInterval(spinInterval);
            reelDivs[i].textContent = finalReels[i];
        }, spinTimes[i]);
    }

    setTimeout(() => {
        let reel1 = finalReels[0];
        let reel2 = finalReels[1];
        let reel3 = finalReels[2];
        let winnings = 0;
        if (reel1 === reel2 && reel2 === reel3) {
            if (reel1 === '💰') {
                winnings = 10000;
                resultText.textContent = '💰💰💰 JACKPOT! YOU WON $10,000!';
                createConfetti('mega');
                screenShake();
                achievementCounters.slotJackpots++;
            } else {
                winnings = 1000;
                resultText.textContent = `🎉 Winner! You won $1000!`;
            }
        } else if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
            winnings = 100;
            resultText.textContent = `👍 Nice! You won $100!`;
        } else {
            resultText.textContent = '😢 Better luck next time!';
        }
        if (winnings > 0) {
            money += winnings;
            totalMoneyEarned += winnings;
            createFloatingMoney(winnings, window.innerWidth / 2, window.innerHeight / 2);
        }
        updateDisplay();
        // Close modal after 2s
        setTimeout(() => {
            modal.remove();
        }, 2000);
    }, 1700);
}

function startNumberBingo() {
    if (money < 100) { // Reduced from 200 to 100
        showHint("Need $100 to play Number Bingo!");
        return;
    }
    
    money -= 100;
    const bingoCard = [];
    const usedNumbers = new Set();
    
    // Generate 5x5 bingo card
    for (let i = 0; i < 25; i++) {
        let num;
        do {
            num = Math.floor(Math.random() * 75) + 1;
        } while (usedNumbers.has(num));
        
        usedNumbers.add(num);
        bingoCard.push(num);
    }
    
    // More generous rewards
    const rewards = [200, 500, 800, 1200, 2000];
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    
    money += reward;
    totalMoneyEarned += reward; // Track for achievements
    showHint(`🎯 Bingo! You won $${reward}!`);
    createFloatingMoney(reward, window.innerWidth / 2, window.innerHeight / 3);
    updateDisplay();
}

function startRapidFire() {
    if (money < 75) { // Reduced from 150 to 75
        showHint("Need $75 to start Rapid Fire mode!");
        return;
    }
    
    money -= 75;
    let rapidFireTime = 30;
    let rapidFireScore = 0;
    
    showHint("⚡ RAPID FIRE MODE! 30 seconds of speed guessing!");
    
    const originalContainer = document.getElementById('game-container');
    originalContainer.classList.add('rapid-fire-mode');
    
    const rapidFireTimer = setInterval(() => {
        rapidFireTime--;
        
        if (rapidFireTime <= 0) {
            clearInterval(rapidFireTimer);
            originalContainer.classList.remove('rapid-fire-mode');
            
            const bonus = rapidFireScore * 100; // Increased from 50 to 100 per correct guess
            money += bonus;
            totalMoneyEarned += bonus; // Track for achievements
            achievementCounters.rapidFireBest = Math.max(achievementCounters.rapidFireBest, rapidFireScore);
            showHint(`⚡ Rapid Fire ended! Bonus: $${bonus} (${rapidFireScore} correct guesses)`);
            updateDisplay();
        }
    }, 1000);
    
    // Store original guess function and replace temporarily
    const originalMakeGuess = window.makeGuess;
    window.makeGuess = function() {
        const result = originalMakeGuess.call(this);
        if (message.textContent.includes('Correct!')) {
            rapidFireScore++;
        }
        return result;
    };
    
    // Restore original function after rapid fire
    setTimeout(() => {
        window.makeGuess = originalMakeGuess;
    }, 30000);
}

// Advanced power-ups
function activateDoubleOrNothing() {
    if (powerUps.doubleOrNothing.cooldown > 0) {
        showHint(`🎲 Double or Nothing on cooldown: ${powerUps.doubleOrNothing.cooldown}s`);
        return;
    }
    powerUps.doubleOrNothing.active = true;
    powerUps.doubleOrNothing.cooldown = 60; // 1 minute cooldown
    showHint("🎲 Double or Nothing activated! Your next guess is all or nothing!");
    createPowerUpEffect('doubleOrNothing', window.innerWidth / 2, 200);
    achievementCounters.powerUpsUsed++;
}

function activateLuckyDraw() {
    if (powerUps.luckyDraw.cooldown > 0) {
        showHint(`🍀 Lucky Draw on cooldown: ${powerUps.luckyDraw.cooldown}s`);
        return;
    }
    powerUps.luckyDraw.cooldown = 90; // 1.5 minute cooldown
    showHint("🍀 Lucky Draw! Let's see what you get...");
    createPowerUpEffect('luckyDraw', window.innerWidth / 2, 200);
    
    const prizes = [
        { type: 'money', value: Math.floor(money * 0.25), text: `You won $${Math.floor(money * 0.25)}!` },
        { type: 'money', value: 1000, text: 'You won $1000!' },
        { type: 'prestige', value: 1, text: 'You won 1 Prestige Point! ⭐' },
        { type: 'event', event: 'goldenNumber', text: 'A Golden Number has appeared!' },
        { type: 'event', event: 'numberRush', text: 'Number Rush activated!' },
        { type: 'dud', text: 'Nothing this time. Better luck next time!' }
    ];
    
    const prize = prizes[Math.floor(Math.random() * prizes.length)];
    
    setTimeout(() => {
        showHint(`🍀 ${prize.text}`);
        if (prize.type === 'money') {
            money += prize.value;
            totalMoneyEarned += prize.value; // Track for achievements
            createFloatingMoney(prize.value, window.innerWidth / 2, window.innerHeight / 2);
        } else if (prize.type === 'prestige') {
            prestigePoints += prize.value;
        } else if (prize.type === 'event') {
            if (prize.event === 'goldenNumber') spawnGoldenNumber(true);
            if (prize.event === 'numberRush') activateNumberRush();
        }
        updateDisplay();
    }, 1500);
    achievementCounters.powerUpsUsed++;
    if (prize.type !== 'dud') {
        achievementCounters.luckyDrawWins++;
    }
}

function activateTimeFreeze() {
    if (powerUps.timeFreeze.cooldown > 0) {
        showHint(`⏰ Time Freeze on cooldown: ${powerUps.timeFreeze.cooldown}s`);
        return;
    }
    
    powerUps.timeFreeze.active = true;
    powerUps.timeFreeze.duration = 30;
    powerUps.timeFreeze.cooldown = 120; // 2 minute cooldown
    
    showHint("⏰ Time Freeze activated! All timers paused for 30 seconds!");
    createPowerUpEffect('timeFreeze', window.innerWidth / 2, 200);
    
    // Pause all intervals for 30 seconds (simplified implementation)
    setTimeout(() => {
        powerUps.timeFreeze.active = false;
        showHint("⏰ Time Freeze ended!");
    }, 30000);
}

function activateNumberMagnet() {
    if (powerUps.magneticNumbers.cooldown > 0) {
        showHint(`🧲 Number Magnet on cooldown: ${powerUps.magneticNumbers.cooldown}s`);
        return;
    }
    
    powerUps.magneticNumbers.active = true;
    powerUps.magneticNumbers.duration = 60;
    powerUps.magneticNumbers.cooldown = 180; // 3 minute cooldown
    
    // Give strong hints for next 5 guesses
    let magnetUses = 5;
    const originalMakeGuess = window.makeGuess;
    
    showHint("🧲 Number Magnet activated! You'll be attracted to the correct number!");
    createPowerUpEffect('magneticNumbers', window.innerWidth / 2, 200);
    
    // Enhanced hint system while magnet is active
    window.makeGuess = function() {
        if (magnetUses > 0 && powerUps.magneticNumbers.active) {
            const userGuess = parseInt(guessInput.value);
            if (userGuess !== randomNumber) {
                const direction = userGuess < randomNumber ? "higher" : "lower";
                const difference = Math.abs(randomNumber - userGuess);
                
                if (difference <= 3) {
                    showHint(`🧲 VERY HOT! Try ${direction} by just a little!`);
                } else if (difference <= 7) {
                    showHint(`🧲 Getting warmer! Go ${direction}!`);
                } else {
                    showHint(`🧲 Cold! Try going much ${direction}!`);
                }
                
                magnetUses--;
                if (magnetUses <= 0) {
                    powerUps.magneticNumbers.active = false;
                    window.makeGuess = originalMakeGuess;
                    showHint("🧲 Number Magnet exhausted!");
                }
            } else {
                // Correct guess, disable magnet
                powerUps.magneticNumbers.active = false;
                window.makeGuess = originalMakeGuess;
            }
        }
        
        return originalMakeGuess.call(this);
    };
    
    // Auto-disable after duration
    setTimeout(() => {
        if (powerUps.magneticNumbers.active) {
            powerUps.magneticNumbers.active = false;
            window.makeGuess = originalMakeGuess;
            showHint("🧲 Number Magnet timed out!");
        }
    }, 60000);
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

// Passive income with tracking
function applyPassiveIncome() {
    let totalIncome = 0;
    
    // Calculate income from miners
    for (let tier in miners) {
        const miner = miners[tier];
        totalIncome += miner.owned * miner.income;
    }
    
    // Calculate income from upgrades
    totalIncome += upgrades.autoGuesser.level * 5;
    
    if (totalIncome > 0) {
        money += totalIncome;
        totalMoneyEarned += totalIncome; // Track for achievements
        incomePerSecond = totalIncome; // Update the display value
    }
    
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

// Enhanced Save and Load System with Offline Progress
function saveGame() {
    const gameData = {
        money,
        incomePerSecond,
        correctGuesses,
        totalGuesses,
        currentStreak,
        bestStreak,
        prestigePoints,
        totalMoneyEarned,
        upgrades,
        miners,
        achievements,
        achievementCounters,
        gameSettings,
        lastSaveTime: Date.now()
    };
    
    localStorage.setItem('numberGuessingGame', JSON.stringify(gameData));
    console.log('Game saved successfully!');
}

// Manual save with feedback
function manualSave() {
    saveGame();
    showHint('💾 Game saved successfully!');
    createFloatingMoney(0, window.innerWidth / 2, window.innerHeight / 2);
}

// Manual load with feedback
function manualLoad() {
    const confirmLoad = confirm('⚠️ Loading will overwrite your current progress. Are you sure?');
    if (confirmLoad) {
        loadGame();
        updateDisplay();
        renderAchievements();
        showHint('📂 Game loaded successfully!');
    }
}

// Reset game with confirmation
function resetGame() {
    const confirmReset = confirm('⚠️ This will permanently delete ALL your progress! Are you absolutely sure?');
    if (confirmReset) {
        const doubleConfirm = confirm('🚨 FINAL WARNING: This cannot be undone! Reset everything?');
        if (doubleConfirm) {
            localStorage.removeItem('numberGuessingGame');
            location.reload(); // Reload the page to start fresh
        }
    }
}

// Export save data as text
function exportSave() {
    const gameData = localStorage.getItem('numberGuessingGame');
    if (gameData) {
        const blob = new Blob([gameData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `GuessTheNumberTycoon_Save_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showHint('💾 Save file exported successfully!');
    } else {
        showHint('❌ No save data to export!');
    }
}

// Import save data from file
function importSave() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const saveData = e.target.result;
                    JSON.parse(saveData); // Validate JSON
                    localStorage.setItem('numberGuessingGame', saveData);
                    loadGame();
                    updateDisplay();
                    renderAchievements();
                    showHint('📂 Save file imported successfully!');
                } catch (error) {
                    showHint('❌ Invalid save file!');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function loadGame() {
    const savedData = localStorage.getItem('numberGuessingGame');
    
    if (savedData) {
        try {
            const gameData = JSON.parse(savedData);
            
            // Load basic game state
            money = gameData.money || 25;
            incomePerSecond = gameData.incomePerSecond || 0;
            correctGuesses = gameData.correctGuesses || 0;
            totalGuesses = gameData.totalGuesses || 0;
            currentStreak = gameData.currentStreak || 0;
            bestStreak = gameData.bestStreak || 0;
            prestigePoints = gameData.prestigePoints || 0;
            totalMoneyEarned = gameData.totalMoneyEarned || 0;
            
            // Load upgrades and miners
            if (gameData.upgrades) {
                upgrades = { ...upgrades, ...gameData.upgrades };
            }
            if (gameData.miners) {
                miners = { ...miners, ...gameData.miners };
            }
            
            // Load achievements
            if (gameData.achievements) {
                // Merge saved achievements with current achievement list
                gameData.achievements.forEach(savedAch => {
                    const currentAch = achievements.find(a => a.id === savedAch.id);
                    if (currentAch) {
                        currentAch.unlocked = savedAch.unlocked;
                    }
                });
            }
            
            // Load achievement counters
            if (gameData.achievementCounters) {
                achievementCounters = { ...achievementCounters, ...gameData.achievementCounters };
            }
            
            // Load game settings
            if (gameData.gameSettings) {
                gameSettings = { ...gameSettings, ...gameData.gameSettings };
            }
            
            // Calculate offline earnings
            const offlineTime = Date.now() - (gameData.lastSaveTime || Date.now());
            if (offlineTime > 5000 && incomePerSecond > 0) { // Only if offline for more than 5 seconds
                const offlineHours = Math.min(offlineTime / (1000 * 60 * 60), 24); // Cap at 24 hours
                const offlineEarnings = Math.floor(incomePerSecond * offlineHours * 3600);
                
                if (offlineEarnings > 0) {
                    money += offlineEarnings;
                    totalMoneyEarned += offlineEarnings;
                    
                    // Show offline earnings popup
                    setTimeout(() => {
                        showHint(`💤 Welcome back! You earned $${offlineEarnings} while away (${Math.floor(offlineHours)}h ${Math.floor((offlineHours % 1) * 60)}m)`);
                        createFloatingMoney(offlineEarnings, window.innerWidth / 2, window.innerHeight / 3);
                    }, 1000);
                }
            }
            
            lastSaveTime = Date.now();
            console.log('Game loaded successfully!');
            
        } catch (error) {
            console.error('Error loading save data:', error);
            showHint('⚠️ Save data corrupted, starting fresh!');
        }
    } else {
        console.log('No save data found, starting new game!');
        lastSaveTime = Date.now();
    }
}

// Achievements
function checkAchievements() {
    // Example: Check for the 'first_guess' achievement
    if (correctGuesses === 1 && !achievements.find(a => a.id === 'first_guess').unlocked) {
        unlockAchievement('first_guess');
    }
    
    // Check for other achievements with easier requirements
    if (correctGuesses === 5 && !achievements.find(a => a.id === 'number_novice').unlocked) { // Reduced from 10 to 5
        unlockAchievement('number_novice');
    }
    
    if (correctGuesses === 50 && !achievements.find(a => a.id === 'guessing_guru').unlocked) { // Reduced from 100 to 50
        unlockAchievement('guessing_guru');
    }
    
    if (totalMoneyEarned >= 500 && !achievements.find(a => a.id === 'big_spender').unlocked) { // Track total earned
        unlockAchievement('big_spender');
    }
    
    if (totalMoneyEarned >= 5000 && !achievements.find(a => a.id === 'high_roller').unlocked) { // Track total earned
        unlockAchievement('high_roller');
    }
    
    if (bestStreak >= 3 && !achievements.find(a => a.id === 'streak_master').unlocked) { // Reduced from 5 to 3
        unlockAchievement('streak_master');
    }
    
    if (bestStreak >= 7 && !achievements.find(a => a.id === 'on_fire').unlocked) { // Reduced from 10 to 7
        unlockAchievement('on_fire');
    }
    
    if (totalMoneyEarned >= 5000 && !achievements.find(a => a.id === 'millionaire').unlocked) { // Track total earned
        unlockAchievement('millionaire');
    }
    
    if (totalMoneyEarned >= 500000 && !achievements.find(a => a.id === 'tycoon').unlocked) { // Track total earned
        unlockAchievement('tycoon');
    }
    
    // Check for new fun feature achievements
    if (achievementCounters.goldenNumbersHit >= 1 && !achievements.find(a => a.id === 'golden_hunter').unlocked) {
        unlockAchievement('golden_hunter');
    }
    
    if (achievementCounters.powerUpsUsed >= 5 && !achievements.find(a => a.id === 'power_user').unlocked) {
        unlockAchievement('power_user');
    }
    
    if (achievementCounters.miniGamesPlayed >= 10 && !achievements.find(a => a.id === 'gambler').unlocked) {
        unlockAchievement('gambler');
    }
    
    if (currentStreak >= 10 && !achievements.find(a => a.id === 'combo_master').unlocked) {
        unlockAchievement('combo_master');
    }
    
    if (achievementCounters.luckyDrawWins >= 3 && !achievements.find(a => a.id === 'lucky_charm').unlocked) {
        unlockAchievement('lucky_charm');
    }
    
    if (achievementCounters.slotJackpots >= 2 && !achievements.find(a => a.id === 'slot_king').unlocked) {
        unlockAchievement('slot_king');
    }
    
    if (achievementCounters.wheelSpins >= 25 && !achievements.find(a => a.id === 'wheel_spinner').unlocked) {
        unlockAchievement('wheel_spinner');
    }
    
    if (achievementCounters.rapidFireBest >= 10 && !achievements.find(a => a.id === 'rapid_fire_master').unlocked) {
        unlockAchievement('rapid_fire_master');
    }
    
    if (totalGuesses >= 15 && (correctGuesses / totalGuesses) >= 0.7 && !achievements.find(a => a.id === 'accuracy_king').unlocked) { // Reduced requirements
        unlockAchievement('accuracy_king');
    }
    
    if (upgrades.biggerPayout.level >= 5 && !achievements.find(a => a.id === 'upgrade_collector').unlocked) { // Reduced from 10 to 5
        unlockAchievement('upgrade_collector');
    }
    
    if (miners.bronze.owned + miners.silver.owned + miners.gold.owned >= 25 && !achievements.find(a => a.id === 'miner_mogul').unlocked) { // Reduced from 50 to 25
        unlockAchievement('miner_mogul');
    }
    
    if (miners.gold.owned >= 5 && !achievements.find(a => a.id === 'gold_rush').unlocked) { // Reduced from 10 to 5
        unlockAchievement('gold_rush');
    }
    
    if (gameSettings.maxNumber - gameSettings.minNumber >= 50 && !achievements.find(a => a.id === 'range_master').unlocked) { // Reduced from 100 to 50
        unlockAchievement('range_master');
    }
}

function unlockAchievement(id) {
    const achievement = achievements.find(a => a.id === id);
    if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        showHint(`🎉 Achievement unlocked: ${achievement.name}!`);
        
        // Update achievements display and add glow effect
        const achDiv = achievementsList.querySelector(`[data-id='${id}']`);
        if (achDiv) {
            achDiv.classList.add('unlocked', 'new-unlock');
            // Remove the glow after the animation ends
            setTimeout(() => {
                achDiv.classList.remove('new-unlock');
            }, 2000);
        }
    }
}

// Special Events
function spawnGoldenNumber(force = false) {
    if (specialEvents.goldenNumber.active && !force) return;
    
    specialEvents.goldenNumber.active = true;
    specialEvents.goldenNumber.number = Math.floor(Math.random() * (gameSettings.maxNumber - gameSettings.minNumber + 1)) + gameSettings.minNumber;
    
    const gameArea = document.getElementById('game-area');
    gameArea.classList.add('golden-number-indicator');
    showHint(`✨ A Golden Number has appeared! Guess ${specialEvents.goldenNumber.number} for a 5x bonus!`);
    
    setTimeout(() => {
        if (specialEvents.goldenNumber.active) {
            specialEvents.goldenNumber.active = false;
            gameArea.classList.remove('golden-number-indicator');
        }
    }, 15000); // Lasts for 15 seconds
}

function activateNumberRush() {
    if (specialEvents.numberRush.active) return;

    specialEvents.numberRush.active = true;
    specialEvents.numberRush.timeLeft = 20; // 20 seconds
    
    const gameArea = document.getElementById('game-area');
    gameArea.classList.add('number-rush-indicator');
    showHint(`🔥 NUMBER RUSH! All payouts are doubled for 20 seconds!`);

    const rushInterval = setInterval(() => {
        specialEvents.numberRush.timeLeft--;
        if (specialEvents.numberRush.timeLeft <= 0) {
            clearInterval(rushInterval);
            specialEvents.numberRush.active = false;
            gameArea.classList.remove('number-rush-indicator');
            showHint('Number Rush has ended.');
        }
    }, 1000);
}

function spawnMysteryBox() {
    if (document.getElementById('mystery-box')) return; // Only one at a time

    const box = document.createElement('div');
    box.id = 'mystery-box';
    box.textContent = '🎁';
    box.style.position = 'fixed';
    box.style.left = `${10 + Math.random() * 80}%`;
    box.style.top = `${20 + Math.random() * 60}%`;
    box.style.fontSize = '3rem';
    box.style.cursor = 'pointer';
    box.style.transition = 'transform 0.2s ease';
    box.addEventListener('mouseover', () => box.style.transform = 'scale(1.2)');
    box.addEventListener('mouseout', () => box.style.transform = 'scale(1)');

    box.addEventListener('click', () => {
        const prizes = [
            { type: 'money', value: Math.floor(money * 0.5), text: `You found $${Math.floor(money * 0.5)}!` },
            { type: 'money', value: 5000, text: 'You found $5000!' },
            { type: 'prestige', value: 1, text: 'You found 1 Prestige Point! ⭐' },
            { type: 'upgrade', text: 'You got a free random upgrade level!' }
        ];
        const prize = prizes[Math.floor(Math.random() * prizes.length)];

        showHint(`🎁 Mystery Box: ${prize.text}`);
        if (prize.type === 'money') {
            money += prize.value;
            totalMoneyEarned += prize.value; // Track for achievements
            createFloatingMoney(prize.value, parseFloat(box.style.left), parseFloat(box.style.top));
        } else if (prize.type === 'prestige') {
            prestigePoints += prize.value;
        } else if (prize.type === 'upgrade') {
            const allUpgrades = Object.keys(upgrades);
            const randomUpgradeKey = allUpgrades[Math.floor(Math.random() * allUpgrades.length)];
            upgrades[randomUpgradeKey].level++;
        }
        updateDisplay();
        box.remove();
    }, { once: true });

    document.body.appendChild(box);

    setTimeout(() => {
        box.remove(); // Disappears if not clicked
    }, 8000);
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
    
    // Reduce number range but prevent it from becoming too small
    if (gameSettings.maxNumber - gameSettings.minNumber > 3) { // Keep minimum range of 3
        gameSettings.minNumber += 1; // Reduced from 5 to 1 for gentler reduction
        gameSettings.maxNumber -= 1;
    }
    
    updateDisplay();
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
    
    // Increase number range more gently
    gameSettings.minNumber = Math.max(1, gameSettings.minNumber - 2); // Don't go below 1
    gameSettings.maxNumber += 3; // Increased expansion for more reward
    
    updateDisplay();
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
    upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(2, upgrade.level - 1)); // Steeper cost curve for auto-guesser
    
    if (!autoGuesserActive) {
        autoGuesserActive = true;
        autoGuesserInterval = setInterval(autoGuess, 5000); // Guess every 5 seconds
    } else {
        // Improve it: make it faster
        clearInterval(autoGuesserInterval);
        const newInterval = Math.max(5000 - (upgrade.level * 500), 1000); // Max speed of 1 guess/sec
        autoGuesserInterval = setInterval(autoGuess, newInterval);
    }

    updateDisplay();
}

function autoGuess() {
    if (!autoGuesserActive) return;
    // A simple random guess strategy for the auto-guesser
    const guess = Math.floor(Math.random() * (gameSettings.maxNumber - gameSettings.minNumber + 1)) + gameSettings.minNumber;
    guessInput.value = guess;
    makeGuess();
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
    incomePerSecond += miner.income;
    miner.cost = Math.floor(miner.baseCost * Math.pow(1.15, miner.owned));
    updateDisplay();
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
    incomePerSecond += miner.income;
    miner.cost = Math.floor(miner.baseCost * Math.pow(1.2, miner.owned));
    updateDisplay();
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
    incomePerSecond += miner.income;
    miner.cost = Math.floor(miner.baseCost * Math.pow(1.25, miner.owned));
    updateDisplay();
}

// Call initGame when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initGame);
