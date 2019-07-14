var app = angular.module('app', []);
  app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
      $interpolateProvider.endSymbol('}]}');
    });

      app.controller('ExampleController', ['$scope', function($scope) {
  /*   var request = $http.get('/data');
    request.then(function(response){
      var content = response.data;
      content.replace(/#/g,"");
    }); */
      }]);
