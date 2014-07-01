var myApp = angular.module('myApp', [
    'ngRoute',
    'mainController',
    'userController',
    'contentController',
    'lessonsController',
    'groupController',
    'favoritesController',
    'systemAdminController',
    'myApp.controllers',
    'badgesController'

]);

myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/Users_Manage', {
            templateUrl: 'partials/table_users.html',
            controller: 'UsersController'
        }).
        when('/Games_Manage/Create_Game', {
            templateUrl: 'partials/create_games.html',
            controller: 'GamesCtrl'
        }).
        when('/Games_Manage/All_Games', {
            templateUrl: 'partials/all_games.html',
            controller: 'AllGamesTableCtrl'
        }).
        when('/Games_Manage/My_Games', {
            templateUrl: 'partials/my_games.html'

        }).
        when('/Games_Manage/Games_Creation', {
            templateUrl: 'partials/games_creation.html',
            controller: 'GamesCtrl'
        }).
        when('/Games_Manage/Trivia_Table', {
            templateUrl: 'partials/table_trivia.html',
            controller: 'GamesTableCtrl'
        }).
        when('/Games_Manage/Edit_My_Game/:gameId', {
            templateUrl: 'partials/edit_my_game.html',
            controller: 'MyGamesTableCtrl'
        }).
        when('/Games_Manage/Tour_Table', {
            templateUrl: 'partials/tour_table.html',
            controller: 'TourTableCtrl'
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
        when('/System_Admin/Organizations', {
            templateUrl: 'partials/system_admin.html',
            controller: 'SystemAdminController'
        }).
        when('/System_Admin/Manage_Favorites', {
            templateUrl: 'partials/table_favorites.html',
            controller: 'FavoritesListController'
        }).
        when('/System_Admin/Manage_Badges', {
            templateUrl: 'partials/table_badges.html',
            controller: 'BadgesController'
        }).
        otherwise({
            redirectTo: '/Users_Manage'
        });

}]);
