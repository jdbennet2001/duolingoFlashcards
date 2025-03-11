$(document).ready(function() {
    $.getJSON('flashcards.json', function(data) {
        const wordMap = data.flashcards;
        const words = Object.keys(wordMap);
        let currentWord = '';

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
            currentWord = words[Math.floor(Math.random() * words.length)];
            const choices = getRandomChoices(currentWord);
            
            let htmlContent = `<div class='flashcard'>
                <h2>${currentWord}</h2>
                <ul class='choices'>`;
            
            choices.forEach(choice => {
                htmlContent += `<li class='choice'>${choice}</li>`;
            });
            
            htmlContent += `</ul></div>`;
            $('body').html(htmlContent);
        }
        
        $(document).on('click', '.choice', function() {
            const selectedChoice = $(this).text();
            if (selectedChoice === wordMap[currentWord]) {
                $(this).css('background', 'green');
                setTimeout(generateFlashcard, 1000);
            } else {
                $('.choices').html(`<li class='correct-answer'>${wordMap[currentWord]}</li>`);
            }
        });
        
        $(document).on('click', '.correct-answer', function() {
            generateFlashcard();
        });
        
        generateFlashcard();
    }).fail(function() {
        console.error("Failed to load flashcards.json");
    });
});
