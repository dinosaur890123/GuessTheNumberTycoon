// Game state
let randomNumber = Math.floor(Math.random() * 10) + 1; // Updated for new range
let money = 25; // Starting money to help new players
let incomePerSecond = 0;
let correctGuesses = 0;
let totalGuesses = 0;
let currentStreak = 0;
let bestStreak = 0;
let prestigePoints = 0;

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
    updateUpgradeButtons();
    updateMinerButtons();
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

    // Update fun fact every 10 seconds
    setInterval(updateFunFact, 10000);
    // Passive income interval
    setInterval(applyPassiveIncome, 1000);
    // Cooldown management
    setInterval(updateCooldowns, 1000);
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
    
    // Rapid fire bonus (if guessing within 3 seconds)
    if (timeDiff < 3000) {
        rapidFireBonus = Math.min(rapidFireBonus + 0.1, 2.0); // Max 2x bonus
    } else {
        rapidFireBonus = Math.max(rapidFireBonus - 0.05, 0);
    }
    
    if (userGuess === randomNumber) {
        correctGuesses++;
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
        
        let payout = calculatePayout();
        
        // Apply rapid fire bonus
        if (rapidFireBonus > 0) {
            payout = Math.floor(payout * (1 + rapidFireBonus));
        }
        
        // Golden number bonus
        if (specialEvents.goldenNumber.active && userGuess === specialEvents.goldenNumber.number) {
            payout *= specialEvents.goldenNumber.multiplier;
            specialEvents.goldenNumber.active = false;
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
    tablinks = document.getElementsByClassName("tab-link");
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
    
    // Check for other achievements with easier requirements
    if (correctGuesses === 5 && !achievements.find(a => a.id === 'number_novice').unlocked) { // Reduced from 10 to 5
        unlockAchievement('number_novice');
    }
    
    if (correctGuesses === 50 && !achievements.find(a => a.id === 'guessing_guru').unlocked) { // Reduced from 100 to 50
        unlockAchievement('guessing_guru');
    }
    
    if (money >= 500 && !achievements.find(a => a.id === 'big_spender').unlocked) { // Reduced from 1000 to 500
        unlockAchievement('big_spender');
    }
    
    if (money >= 5000 && !achievements.find(a => a.id === 'high_roller').unlocked) { // Reduced from 10000 to 5000
        unlockAchievement('high_roller');
    }
    
    if (bestStreak >= 3 && !achievements.find(a => a.id === 'streak_master').unlocked) { // Reduced from 5 to 3
        unlockAchievement('streak_master');
    }
    
    if (bestStreak >= 7 && !achievements.find(a => a.id === 'on_fire').unlocked) { // Reduced from 10 to 7
        unlockAchievement('on_fire');
    }
    
    if (money >= 5000 && !achievements.find(a => a.id === 'millionaire').unlocked) { // Reduced from 10000 to 5000
        unlockAchievement('millionaire');
    }
    
    if (money >= 500000 && !achievements.find(a => a.id === 'tycoon').unlocked) { // Reduced from 1000000 to 500000
        unlockAchievement('tycoon');
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
    
    // Reduce number range but prevent it from becoming too small
    if (gameSettings.maxNumber - gameSettings.minNumber > 3) { // Keep minimum range of 3
        gameSettings.minNumber += 1; // Reduced from 5 to 1 for gentler reduction
        gameSettings.maxNumber -= 1;
    }
    
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
    
    // Increase number range more gently
    gameSettings.minNumber = Math.max(1, gameSettings.minNumber - 2); // Don't go below 1
    gameSettings.maxNumber += 3; // Increased expansion for more reward
    
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

// Mini-game: Spin the Wheel
function spinTheWheel() {
    if (money < miniGames.spinTheWheel.cost) {
        showHint(`Need $${miniGames.spinTheWheel.cost} to spin the wheel!`);
        return;
    }
    
    money -= miniGames.spinTheWheel.cost;
    const prizes = [0, 50, 100, 200, 400, 800, 1500]; // Increased all prizes
    const weights = [15, 25, 25, 15, 10, 7, 3]; // Reduced chance of getting nothing
    
    const randomNum = Math.random() * 100;
    let cumulative = 0;
    let prize = 0;
    
    for (let i = 0; i < weights.length; i++) {
        cumulative += weights[i];
        if (randomNum <= cumulative) {
            prize = prizes[i];
            break;
        }
    }
    
    if (prize === 0) {
        showHint("🎰 Better luck next time! You got nothing.");
    } else {
        money += prize;
        showHint(`🎰 Wheel spun! You won $${prize}!`);
        createFloatingMoney(prize, window.innerWidth / 2, window.innerHeight / 2);
    }
    
    updateDisplay();
}

// Mini-game: Slot Machine
function playSlotMachine() {
    if (money < miniGames.slotMachine.cost) {
        showHint(`Need $${miniGames.slotMachine.cost} to play slots!`);
        return;
    }
    
    money -= miniGames.slotMachine.cost;
    const symbols = ['🍒', '🍋', '🍊', '🔔', '⭐', '💎'];
    const reels = [];
    
    for (let i = 0; i < 3; i++) {
        reels.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }
    
    let winAmount = 0;
    
    // Check for wins
    if (reels[0] === reels[1] && reels[1] === reels[2]) {
        // Three of a kind - increased multipliers
        const multipliers = { '🍒': 8, '🍋': 12, '🍊': 15, '🔔': 20, '⭐': 35, '💎': 75 };
        winAmount = miniGames.slotMachine.cost * multipliers[reels[0]];
        showHint(`🎰 JACKPOT! ${reels.join(' ')} - You won $${winAmount}!`);
        createConfetti('golden');
    } else if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) {
        // Two of a kind - increased multiplier
        winAmount = miniGames.slotMachine.cost * 3; // Increased from 2x to 3x
        showHint(`🎰 Two match! ${reels.join(' ')} - You won $${winAmount}!`);
    } else {
        showHint(`🎰 ${reels.join(' ')} - No match this time!`);
    }
    
    money += winAmount;
    updateDisplay();
}

// Special Event: Golden Number
function spawnGoldenNumber() {
    if (Math.random() < 0.5) { // Increased from 30% to 50% chance
        specialEvents.goldenNumber.active = true;
        specialEvents.goldenNumber.number = Math.floor(Math.random() * (gameSettings.maxNumber - gameSettings.minNumber + 1)) + gameSettings.minNumber;
        
        showHint(`✨ GOLDEN NUMBER APPEARED! If you guess ${specialEvents.goldenNumber.number}, you'll get 5x money!`);
        
        // Auto-disable after 45 seconds (increased from 30)
        setTimeout(() => {
            if (specialEvents.goldenNumber.active) {
                specialEvents.goldenNumber.active = false;
                showHint("⏰ Golden number expired!");
            }
        }, 45000);
    }
}

// Special Event: Number Rush Mode
function activateNumberRush() {
    if (Math.random() < 0.4) { // Increased from 20% to 40% chance
        specialEvents.numberRush.active = true;
        specialEvents.numberRush.timeLeft = 45; // Increased from 30 to 45 seconds
        
        showHint("🚀 NUMBER RUSH! Double money for 45 seconds!");
        
        const rushTimer = setInterval(() => {
            specialEvents.numberRush.timeLeft--;
            
            if (specialEvents.numberRush.timeLeft <= 0) {
                specialEvents.numberRush.active = false;
                showHint("⏰ Number Rush ended!");
                clearInterval(rushTimer);
            }
        }, 1000);
    }
}

// Power-up: Double or Nothing
function activateDoubleOrNothing() {
    if (powerUps.doubleOrNothing.cooldown > 0) {
        showHint(`🎲 Double or Nothing on cooldown: ${powerUps.doubleOrNothing.cooldown}s`);
        return;
    }
    
    powerUps.doubleOrNothing.active = true;
    powerUps.doubleOrNothing.cooldown = 30; // Reduced from 60 to 30 second cooldown
    
    showHint("🎲 Double or Nothing activated! Next correct guess: 2x money or lose half!");
    createPowerUpEffect('doubleOrNothing', window.innerWidth / 2, 200);
}

// Power-up: Lucky Draw
function activateLuckyDraw() {
    if (powerUps.luckyDraw.cooldown > 0) {
        showHint(`🍀 Lucky Draw on cooldown: ${powerUps.luckyDraw.cooldown}s`);
        return;
    }
    
    const prizes = [
        { name: "Money Boost", amount: 1000, emoji: "💰" }, // Increased from 500
        { name: "Streak Shield", effect: "protectStreak", emoji: "🛡️" },
        { name: "Range Hint", effect: "rangeHint", emoji: "🎯" },
        { name: "Double Income", effect: "doubleIncome", emoji: "⚡" },
        { name: "Instant Win", effect: "instantWin", emoji: "🏆" },
        { name: "Big Money Boost", amount: 2000, emoji: "💎" } // Added new bigger prize
    ];
    
    const prize = prizes[Math.floor(Math.random() * prizes.length)];
    
    if (prize.amount) {
        money += prize.amount;
        showHint(`🍀 Lucky Draw: ${prize.emoji} ${prize.name} - $${prize.amount}!`);
    } else {
        applySpecialEffect(prize.effect);
        showHint(`🍀 Lucky Draw: ${prize.emoji} ${prize.name}!`);
    }
    
    powerUps.luckyDraw.cooldown = 45; // Reduced from 90 to 45 second cooldown
    updateDisplay();
}

// Apply special effects from lucky draw
function applySpecialEffect(effect) {
    switch(effect) {
        case 'protectStreak':
            // Next wrong guess won't reset streak
            showHint("🛡️ Your next wrong guess won't break your streak!");
            break;
        case 'rangeHint':
            const hint = randomNumber <= (gameSettings.minNumber + gameSettings.maxNumber) / 2 ? 
                         "lower half" : "upper half";
            showHint(`🎯 Range Hint: The number is in the ${hint} of the range!`);
            break;
        case 'doubleIncome':
            // Double passive income for 2 minutes
            showHint("⚡ Double passive income for 2 minutes!");
            break;
        case 'instantWin':
            showHint(`🏆 Instant Win! The number was ${randomNumber}!`);
            // Trigger a correct guess
            money += calculatePayout() * 2; // Double reward for instant win
            correctGuesses++;
            currentStreak++;
            randomNumber = Math.floor(Math.random() * (gameSettings.maxNumber - gameSettings.minNumber + 1)) + gameSettings.minNumber;
            break;
    }
}

// Start the game
initGame();
