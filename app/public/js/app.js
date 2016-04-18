(function () {
    'use strict';
})();
(function () {
    'use strict';
    angular.module('HindiQuiz', [])
        .controller('AppController', AppController);
    AppController.$inject = ['AppService', '$window'];
    function AppController(AppService, $window) {
        var ac = this;
        ac.score = 0;
        ac.activeQuestion = -1;
        ac.activeQuestionAnswered = 0;
        ac.percentage = 0;
        ac.rankedQuestions = [];
        AppService.getQuestions().then(function (quizData) {
            ac.questions = quizData;
            ac.totalQuestions = ac.questions.length;
            angular.forEach(ac.questions, function (item) {
                angular.forEach(item.answers, function (answer) {
                    answer.rank = 0.5 - $window.Math.random();
                });
            });
        });
        ac.toSpeak = function (fileName) {
            var audio = new Audio('media/devanagari/' + fileName);
            audio.play();
        };
        ac.selectAnswer = function (qIndex, aIndex, aId) {
            var questionState = ac.questions[qIndex].questionState;
            if (questionState !== 'answered') {
                ac.questions[qIndex].selectedAnswer = aId;
                console.log('', aId);
                var correctAnswer = ac.questions[qIndex].correct;
                ac.questions[qIndex].correctAnswer = correctAnswer;
                if (aId === correctAnswer) {
                    var audio = new Audio('media/success.wav');
                    audio.play();
                    setTimeout(function () {
                        ac.toSpeak(ac.questions[qIndex].answers[aIndex].audio);
                    }, 700);
                    ac.questions[qIndex].correctness = 'correct';
                    ac.score += 1;
                }
                else {
                    var audio = new Audio('media/error.wav');
                    audio.play();
                    ac.questions[qIndex].correctness = 'incorrect';
                }
                ac.questions[qIndex].questionState = 'answered';
            }
            ac.percentage = ((ac.score / ac.totalQuestions) * 100).toFixed(1);
        };
        ac.isSelected = function (qIndex, aId) {
            return ac.questions[qIndex].selectedAnswer === aId;
        };
        ac.isCorrect = function (qIndex, aId) {
            return ac.questions[qIndex].correctAnswer === aId;
        };
        ac.selectContinue = function () {
            return ac.activeQuestion++;
        };
        ac.goAgain = function () {
            ac.score = 0;
            ac.activeQuestion = -1;
            ac.activeQuestionAnswered = 0;
            ac.percentage = 0;
            AppService.getQuestions().then(function (quizData) {
                ac.questions = quizData;
                ac.totalQuestions = ac.questions.length;
            });
        };
    }
})();
(function () {
    "use strict";
    angular.module('HindiQuiz')
        .service('AppService', AppService);
    AppService.$inject = ['$http'];
    function AppService($http) {
        var as = this;
        as.getQuestions = function () {
            return $http.get('data/quiz.json').then(function (quizData) {
                return quizData.data;
            });
        };
    }
})();
