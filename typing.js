const words = "apple banana orange tree flower water river mountain stone sky cloud sun moon stars ocean sand beach wind fire grass bird fish cat dog lion tiger elephant monkey giraffe kangaroo zebra snake frog shark whale dolphin octopus crab lobster jellyfish butterfly dragonfly beetle ant bee spider ladybug snail worm leaf branch root bark seed fruit vegetable grain wheat corn rice potato tomato carrot onion garlic pepper chili mushroom broccoli spinach lettuce cabbage cauliflower cucumber pumpkin melon berry cherry grape strawberry raspberry blueberry blackberry pineapple mango papaya kiwi peach plum pear fig apricot almond walnut peanut pistachio cashew coconut olive avocado date honey milk cheese butter bread egg flour sugar salt pepper vinegar oil sauce juice tea coffee wine beer chocolate candy cake cookie pie ice cream yogurt jelly syrup oatmeal cereal pasta pizza sandwich burger salad soup stew barbecue grill roast fry bake steam boil simmer chop slice mix stir shake blend whip beat pour spread sprinkle dip scoop roll knead mash smash squeeze peel grate toast marinate season garnish serve dish plate bowl cup spoon fork knife napkin tray table chair bench stool couch bed sofa blanket pillow sheet carpet rug curtain window door floor wall ceiling roof brick stone wood metal plastic glass paper cloth fabric silk cotton wool leather rubber glue paint ink pencil pen brush marker crayon chalk eraser sharpener ruler tape glue scissors needle thread button zipper snap hook clip pin brooch bracelet necklace ring earring watch belt hat cap glove scarf jacket coat shirt blouse sweater dress pants jeans shorts skirt tights socks shoes boots sandals slippers sneakers bag backpack suitcase luggage wallet purse key phone laptop tablet computer screen mouse keyboard cable plug socket switch fan light bulb lamp heater stove oven microwave refrigerator freezer dishwasher sink faucet toilet shower bathtub towel soap shampoo conditioner toothpaste toothbrush comb brush mirror clock alarm calendar map book magazine newspaper novel comic poem story essay article letter note report speech presentation lecture lesson exam test quiz homework project assignment task game puzzle toy ball doll car bike train plane ship boat rocket satellite star planet galaxy universe space sun moon earth mars jupiter saturn uranus neptune pluto asteroid comet meteor volcano earthquake".split(" ");

let timer;
let timeLeft = 30; // Countdown time
let correctWords = 0; // Track correct words
let typingStarted = false; // Flag to check if typing has started

function addClass(el, name) {
    el.className += ' ' + name;
}

function removeClass(el, name) {
    el.className = el.className.replace(` ${name}`, ''); // Ensures correct removal
}

function randomWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

function formatWord(word) {
    return `<div class="word">
    <span class='letter'>${word.split("").join("</span><span class='letter'>")}</span>
    </div>`;
}

function newGame() {
    document.getElementById('words').innerHTML = "";
    correctWords = 0; // Reset correct words
    for (let i = 0; i < 200; i++) {
        document.getElementById("words").innerHTML += formatWord(randomWord());
    }

    addClass(document.querySelector(".word"), 'current');
    addClass(document.querySelector(".letter"), 'current');

    // Reset timer
    resetTimer();
    typingStarted = false; // Reset typing started flag
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 30; // Reset to 30 seconds
    document.getElementById('info').textContent = timeLeft; // Display the timer
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('info').textContent = timeLeft; // Update timer display

        if (timeLeft <= 0) {
            clearInterval(timer);
            alert(`Time's up! Your WPM is ${(correctWords / 30 * 60).toFixed(2)}`); // Calculate WPM
        }
    }, 1000);
}

document.getElementById('game').addEventListener('keyup', e => {
    const key = e.key;
    const currentWord = document.querySelector(".word.current");
    const currentLetter = document.querySelector('.letter.current');
    const expected = currentLetter ? currentLetter.innerHTML : '';
    const isLetter = key.length === 1 && key !== " ";
    const isSpace = key === " ";
    const isBackspace = key === "Backspace";
    const isFirstLetter = currentLetter === currentWord.firstChild;

    // Start typing timer on first keystroke
    if (!typingStarted && (isLetter || isSpace)) {
        typingStarted = true; // Set flag to true
        resetTimer(); // Reset timer to 30 seconds
        startTimer(); // Start the timer
    }

    if (isLetter) {
        if (currentLetter) {
            addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
            if (key === expected) correctWords++; // Increment correct words
            removeClass(currentLetter, 'current');

            if (currentLetter.nextSibling) {
                // Move to the next letter
                addClass(currentLetter.nextSibling, 'current');
            } else {
                // If no next letter, the word is completed, don't do anything here yet
                console.log('Word complete, waiting for space...');
            }
        } else {
            const incorrectLetter = document.createElement('span');
            incorrectLetter.className = 'letter incorrect extra';
            incorrectLetter.innerHTML = key;
            currentWord.appendChild(incorrectLetter);
        }
    }

    if (isSpace) {
        if (expected !== " ") {
            const letterToInvalidate = [...currentWord.querySelectorAll('.letter:not(.correct)')];
            letterToInvalidate.forEach(letter => {
                addClass(letter, 'incorrect');
            });
        }

        // Remove current class from current word
        removeClass(currentWord, "current");

        // Move to the next word
        const nextWord = currentWord.nextElementSibling;
        if (nextWord) {
            addClass(nextWord, "current"); // Mark next word as current

            // Make sure the first letter of the next word is marked as current
            const firstLetterOfNextWord = nextWord.querySelector('.letter');
            if (firstLetterOfNextWord) {
                // Remove 'current' class from any other letter
                if (currentLetter) {
                    removeClass(currentLetter, 'current');
                }
                addClass(firstLetterOfNextWord, 'current'); // Set the first letter of the next word as current
            }
        }
    }

    // Move Cursor
    const nextLetter = document.querySelector('.letter.current');
    const nextWord = document.querySelector('.word.current');
    const cursor = document.getElementById('cursor');

    // Check if there's a current letter
    if (nextLetter) {
        const letterRect = nextLetter.getBoundingClientRect();
        cursor.style.top = window.scrollY + letterRect.top + 6 + "px";  // Adjusted top offset for better alignment
        cursor.style.left = window.scrollX + letterRect.left + "px";    // Left position remains unchanged
    } else if (nextWord) { // If no current letter, position at the end of the word
        const wordRect = nextWord.getBoundingClientRect();
        cursor.style.top = window.scrollY + wordRect.top + 6 + "px";    // Adjusted top offset for better alignment
        cursor.style.left = window.scrollX + wordRect.right + "px";     // Add scroll offset, move to end of word
    }

    if (isBackspace) {
        const currentWord = document.querySelector('.word.current');
        const currentLetter = document.querySelector('.letter.current');
    
        // Check if we are at the first letter of the current word
        const isFirstLetter = currentLetter === currentWord.firstChild;
    
        if (isFirstLetter) {
            // We are at the first letter of the current word, so move to the last letter of the previous word
            const previousWord = currentWord.previousElementSibling; // Get the previous word
    
            if (previousWord) {
                // Remove "current" class from the current word
                removeClass(currentWord, "current");
                addClass(previousWord, "current"); // Set the previous word as "current"
    
                // Move to the last letter of the previous word
                const lastLetterOfPreviousWord = previousWord.lastElementChild; // Get the last letter of the previous word
                if (lastLetterOfPreviousWord) {
                    // Remove 'current' class from any current letter
                    if (currentLetter) {
                        removeClass(currentLetter, 'current');
                    }
                    // Set the last letter of the previous word as the current letter
                    addClass(lastLetterOfPreviousWord, 'current');
    
                    // Adjust cursor position to the last letter of the previous word
                    const letterRect = lastLetterOfPreviousWord.getBoundingClientRect();
                    cursor.style.top = window.scrollY + letterRect.top + 6 + "px";  // Adjusted top offset for better alignment
                    cursor.style.left = window.scrollX + letterRect.left + "px";    // Left position remains unchanged
                }
            }
        } else {
            // We are within the current word (not at the first letter)
            const previousLetter = currentLetter.previousSibling;
    
            if (previousLetter) {
                removeClass(currentLetter, 'current'); // Remove "current" class from the current letter
                addClass(previousLetter, 'current'); // Set the previous letter as "current"
    
                // Adjust cursor position
                const letterRect = previousLetter.getBoundingClientRect();
                cursor.style.top = window.scrollY + letterRect.top + 6 + "px";  // Adjusted top offset for better alignment
                cursor.style.left = window.scrollX + letterRect.left + "px";    // Left position remains unchanged
            }
        }
    }
});

const newGameButton = document.getElementById("start")
newGameButton.addEventListener('click',newGame)
newGame();
