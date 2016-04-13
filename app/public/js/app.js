(function () {
    'use strict';
})();
(function () {
    'use strict';
    angular.module('HindiQuiz', ['ui.router', 'ngAnimate'])
        .controller('AppController', AppController);
    AppController.$inject = [];
    function AppController() {
        var ac = this;
    }
})();
(function () {
    "use strict";
    angular.module('HindiQuiz')
        .service('AppService', AppService);
    AppService.$inject = [];
    function AppService() {
        var as = this;
    }
})();
