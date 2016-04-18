(() => {

  'use strict';

  angular.module('HindiQuiz', [])
      .controller('AppController', AppController);
  
  AppController.$inject = ['AppService'];

  function AppController(AppService) {
    let ac = this;

    ac.score = 0;
    ac.activeQuestion = -1;
    ac.activeQuestionAnswered = 0;
    ac.percentage = 0;
    ac.rankedQuestions = [];

    AppService.getQuestions().then(function(quizData) {
      ac.questions = quizData;
      ac.totalQuestions = ac.questions.length;
    });

    ac.toSpeak = function (fileName) {
      var audio = new Audio('media/devanagari/' + fileName);
      audio.play();
    };

    ac.selectAnswer = function(qIndex, aIndex) {
      let questionState = ac.questions[qIndex].questionState;

      if(questionState !== 'answered') {
        ac.questions[qIndex].selectedAnswer = aIndex;
        let correctAnswer = ac.questions[qIndex].correct;

        ac.questions[qIndex].correctAnswer = correctAnswer;

        if(aIndex === correctAnswer) {
          
          var audio = new Audio('media/success.wav');
          audio.play();
          setTimeout(function() {
            ac.toSpeak(ac.questions[qIndex].answers[aIndex].audio);
          }, 700);

          ac.questions[qIndex].correctness = 'correct';
          ac.score += 1;

        } else {

          var audio = new Audio('media/error.wav');
          audio.play();
          ac.questions[qIndex].correctness = 'incorrect';

        }

        ac.questions[qIndex].questionState = 'answered';
      }

      ac.percentage = ((ac.score / ac.totalQuestions) * 100).toFixed(1);

    };

    ac.isSelected = function(qIndex, aIndex) {
      return ac.questions[qIndex].selectedAnswer === aIndex;
    };
    
    ac.isCorrect = function(qIndex, aIndex) {
      return ac.questions[qIndex].correctAnswer === aIndex;
    };

    ac.selectContinue = function() {
      return ac.activeQuestion++;
    };

    ac.goAgain = function() {
      ac.score = 0;
      ac.activeQuestion = -1;
      ac.activeQuestionAnswered = 0;
      ac.percentage = 0;
      AppService.getQuestions().then(function(quizData) {
        ac.questions = quizData;
        ac.totalQuestions = ac.questions.length;
      });
    };

  }

})();