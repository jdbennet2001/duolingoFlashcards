/*
 Simple priority queue, ensuring that missed keys are given priority
 */
 class PriorityQueue {

    words = {}

    constructor(words) {

        _.forEach(words, (word) => {
            this.words[word] = 1;
        })
        
    }

    miss(key){
        this.words[key] = this.words[key] + 1
    }

    hit(key){
        this.words[key] = Math.max(this.words[key]-0.33, 1)
    }

    next(){

        let answer = null;

        // Find (weighted) answer
        let sum = 0;
        _.forEach( this.words, (val, key) => {
            sum += val
        })

        var random = Math.random() * sum;

        _.forEach( this.words, (val, key) => {
            random = random - val;
            if (random <= 0 && answer === null)
                return answer = key
        })

        return answer;

  
    }

}

let queue = null;


$(document).ready(function () {
    $.getJSON('flashcards.json', function (data) {
        const wordMap = data.flashcards;
        const words = Object.keys(wordMap);
        queue = new PriorityQueue(words);

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
            currentWord = queue.next()
            const choices = getRandomChoices(currentWord);

            let htmlContent = `<div class='flashcard'>
                <h2>${currentWord}</h2>
                <ul class='choices'>`;

            choices.forEach(choice => {
                htmlContent += `<li class='choice' data-word='${choice}'>${choice}</li>`;
            });

            htmlContent += `</ul></div>`;
            $('body').html(htmlContent);
        }

        function speakText(text) {
            this.utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'id-ID';  // Set language to Indonesian
            speechSynthesis.speak(utterance);
            this.utterance.onend = () => {
                console.log(text)
            }
        }

        $(document).on('click', '.choice', function () {
            const selectedChoice = $(this).text();
            
            if (selectedChoice === wordMap[currentWord]) {
                queue.hit(currentWord)
                $(this).css('background', 'green');
                speakText(selectedChoice); // Speak the selected word
                setTimeout(generateFlashcard, 1500);
            } else {
                queue.miss(currentWord);
                $('.choices').html(`<li class='correct-answer'>${wordMap[currentWord]}</li>`);
                speakText(wordMap[currentWord]); // Speak the correct answer when revealed
            }
        });

        $(document).on('click', '.correct-answer', function () {
            generateFlashcard();
        });

        generateFlashcard();
    }).fail(function () {
        console.error("Failed to load flashcards.json");
    });
});
