const words = "apple banana orange tree flower water river mountain stone sky cloud sun moon stars ocean sand beach wind fire grass bird fish cat dog lion tiger elephant monkey giraffe kangaroo zebra snake frog shark whale dolphin octopus crab lobster jellyfish butterfly dragonfly beetle ant bee spider ladybug snail worm leaf branch root bark seed fruit vegetable grain wheat corn rice potato tomato carrot onion garlic pepper chili mushroom broccoli spinach lettuce cabbage cauliflower cucumber pumpkin melon berry cherry grape strawberry raspberry blueberry blackberry pineapple mango papaya kiwi peach plum pear fig apricot almond walnut peanut pistachio cashew coconut olive avocado date honey milk cheese butter bread egg flour sugar salt pepper vinegar oil sauce juice tea coffee wine beer chocolate candy cake cookie pie ice cream yogurt jelly syrup oatmeal cereal pasta pizza sandwich burger salad soup stew barbecue grill roast fry bake steam boil simmer chop slice mix stir shake blend whip beat pour spread sprinkle dip scoop roll knead mash smash squeeze peel grate toast marinate season garnish serve dish plate bowl cup spoon fork knife napkin tray table chair bench stool couch bed sofa blanket pillow sheet carpet rug curtain window door floor wall ceiling roof brick stone wood metal plastic glass paper cloth fabric silk cotton wool leather rubber glue paint ink pencil pen brush marker crayon chalk eraser sharpener ruler tape glue scissors needle thread button zipper snap hook clip pin brooch bracelet necklace ring earring watch belt hat cap glove scarf jacket coat shirt blouse sweater dress pants jeans shorts skirt tights socks shoes boots sandals slippers sneakers bag backpack suitcase luggage wallet purse key phone laptop tablet computer screen mouse keyboard cable plug socket switch fan light bulb lamp heater stove oven microwave refrigerator freezer dishwasher sink faucet toilet shower bathtub towel soap shampoo conditioner toothpaste toothbrush comb brush mirror clock alarm calendar map book magazine newspaper novel comic poem story essay article letter note report speech presentation lecture lesson exam test quiz homework project assignment task game puzzle toy ball doll car bike train plane ship boat rocket satellite star planet galaxy universe space sun moon earth mars jupiter saturn uranus neptune pluto asteroid comet meteor volcano earthquake".split(" ")
console.log(words);

function addClass(el,name){
    el.className += ' '+name;
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
    </div>`
}

function newGame() {
    document.getElementById('words').innerHTML = "";
    for (let i = 0; i < 200; i++) {
        document.getElementById("words").innerHTML += formatWord(randomWord());
    }

    addClass(document.querySelector(".word"),'current')
    addClass(document.querySelector(".letter"),'current')
}

document.getElementById('game').addEventListener('keyup', e => {;

    const key = e.key;
    const currentWord = document.querySelector(".word.current")
    const currentLetter = document.querySelector('.letter.current');
    const expected = currentLetter ? currentLetter.innerHTML : '';
    const isLetter = key.length === 1 && key !== " ";
    const isSpace = key === " "
    const isTab = key === "Tab"; // Check if the Tab key is pressed
    const isEnter = key === "Enter";

    if (isTab && isEnter) {
        location.reload(); // Refresh the page
        return; // Exit the event handler to prevent further processing
    }

    if (isLetter) {
        if (currentLetter) {
            addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
            removeClass(currentLetter, 'current');
            addClass(currentLetter.nextSibling,'current')
        }
    }
    console.log({ key, expected });

    if (isSpace) {
        if(expected !== " "){
            const letterToInvalidate =  [...currentWord.querySelectorAll('.letter:not(.correct)')]
            letterToInvalidate.forEach(letter => {
                addClass(letter, 'incorrect');
            })
        }
        // Move to the next word
        removeClass(currentWord, 'current'); // Remove current class from the current word
        const nextWord = currentWord.nextElementSibling; // Get the next word
        if (nextWord) {
            addClass(nextWord, "current"); // Add current class to the next word
            // Set the first letter of the next word as current
            const firstLetterOfNextWord = nextWord.querySelector('.letter'); 
            if (firstLetterOfNextWord) {
                removeClass(firstLetterOfNextWord, 'current'); // Ensure to remove any existing 'current' class
                addClass(firstLetterOfNextWord, 'current'); // Add current class to the first letter of the next word
            }
        }
    }
});




newGame();