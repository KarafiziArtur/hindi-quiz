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

    AppService.getQuestions().then(function(quizData) {
      ac.questions = quizData;
      ac.totalQuestions = ac.questions.length;
    });

    ac.selectAnswer = function(qIndex, aIndex) {
      let questionState = ac.questions[qIndex].questionState;

      if(questionState !== 'answered') {
        ac.questions[qIndex].selectedAnswer = aIndex;
        let correctAnswer = ac.questions[qIndex].correct;

        ac.questions[qIndex].correctAnswer = correctAnswer;


        if(aIndex === correctAnswer) {
          ac.questions[qIndex].correctness = 'correct';
          ac.score += 1;
        } else {
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