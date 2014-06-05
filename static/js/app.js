var myApp = angular.module('myApp', [
    'ngRoute',
    'mainController',
    'userController',
    'gamesController',
    'contentController',
    'lessonsController',
    'groupController',
    'favoritesController',
    'systemAdminController',
    'badgesController'

]);

myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/Users_Manage', {
            templateUrl: 'partials/table_users.html',
            controller: 'UsersController'
        }).
        when('/Games_Manage', {
            templateUrl: 'partials/table_games.html',
            controller: 'GamesController'
        }).
        when('/Games_Manage/Games', {
            templateUrl: 'partials/games.html',
            controller: 'GamesCtrl'
        }).
        when('/Games_Manage/Games/Trivia/:gameId', {
            templateUrl: 'partials/table_trivia.html',
            controller: 'TriviaController'
        }).
        when('/Content_Manage', {
            templateUrl: 'partials/table_content.html',
            controller: 'ContentListController'
        }).
        when('/Groups_Manage', {
            templateUrl: 'partials/groups_table.html',
            controller: 'GroupController'
        }).
        when('/Groups_Manage/:groupId', {
            templateUrl: 'partials/group_details.html',
            controller: 'GroupDetailsController'
        }).
        when('/Lessons_Manage', {
            templateUrl: 'partials/table_lessons.html',
            controller: 'LessonsListController'
        }).
        when('/System_Admin', {
            templateUrl: 'partials/system_admin.html',
            controller: 'SystemAdminController'
        }).
        when('/Manage_Favorites', {
            templateUrl: 'partials/table_favorites.html',
            controller: 'FavoritesListController'
        }).
        when('/Manage_Badges', {
            templateUrl: 'partials/table_badges.html',
            controller: 'BadgesController'
        }).
        otherwise({
            redirectTo: '/Users_Manage'
        });

}]);