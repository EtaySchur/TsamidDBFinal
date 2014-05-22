var myApp = angular.module('myApp', [
  'ngRoute',
  'userController',
  'gamesController',
  'contentController',
  'lessonsController',
  'groupController',
  'mainController'
]);

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/Users_Manage', {
    templateUrl: 'partials/table_users.html',
    controller: 'UsersController'
  }).
  when('/Games_Manage', {
    templateUrl: 'partials/table_games.html',
    controller: 'GamesController'
  }).
  when('/Games_Manage/Games' , {
    templateUrl: 'partials/games.html',
    controller: 'GamesCtrl'
  }).
  when('/Games_Manage/Games/Trivia/:gameId' , {
    templateUrl: 'partials/table_trivia.html',
    controller: 'TriviaController'
  }).
  when('/Content_Manage', {
    templateUrl: 'partials/table_content.html',
    controller: 'ContentListController'
  }).
  when('/Groups_Manage' , {
      templateUrl: 'partials/groups_table.html',
      controller: 'GroupController'
  }).
  when('/Groups_Manage/:groupId' , {
      templateUrl: 'partials/group_details.html',
      controller: 'GroupDetailsController'
  }).
  when('/Lessons_Manage' , {
       templateUrl: 'partials/table_lessons.html',
       controller: 'LessonsListController'
   }).
  otherwise({
    redirectTo: '/Users_Manage'
  });

}]);