(() => {

  "use strict";

  angular.module('HindiQuiz')
      .service('AppService', AppService);

  AppService.$inject = ['$http'];

  function AppService($http) {
    var as = this;

    as.getQuestions = function() {
      return $http.get('data/quiz.json').then(function(quizData) {
        return quizData.data;
      });
    }

  }

})();