$(document).ready(function() {
    $.getJSON('flashcards.json', function(data) {
        const wordMap = data.flashcards;
        const words = Object.keys(wordMap);
        
        function getRandomChoices(correctWord) {
            let choices = [wordMap[correctWord]];
            let shuffledWords = _.shuffle(words);
            
            for (let word of shuffledWords) {
                if (choices.length >= 5) break;
                if (word !== correctWord) {
                    choices.push(wordMap[word]);
                }
            }
            return _.shuffle(choices);
        }
        
        function generateFlashcard() {
            const randomWord = words[Math.floor(Math.random() * words.length)];
            const choices = getRandomChoices(randomWord);
            
            let htmlContent = `<div class='flashcard'>
                <h2>${randomWord}</h2>
                <ul class='choices'>`;
            
            choices.forEach(choice => {
                htmlContent += `<li class='choice'>${choice}</li>`;
            });
            
            htmlContent += `</ul></div>`;
            $('body').html(htmlContent);
        }
        
        generateFlashcard();
    }).fail(function() {
        console.error("Failed to load flashcards.json");
    });
});
