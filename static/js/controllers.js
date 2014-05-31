/**
 *  Controllers.js - Contain All The Application Controllers
 */


/**
 * Global Params
 * @param parseManager - Instance of ParseManager Class which take care all the Parse API actions ,
 *                       and User Details. (Google Plus Profile , ParseUser Profile)
 */

var parseManager = new ParseManager();
var alertManager = new AlertManager();


/**
 * Main Controller - This Controller is connected to the Main View Application and contain the $rootScope Params and Functions .
 * $scope Vars : @param $scope.users - contain all "Users" object from parse .
 *               @param $scope.userOrder - init the starting order . (default = username)
 */

var mainController = angular.module('mainController', ['ngAnimate']);

mainController.controller('MainController', ['$location' , '$rootScope' , '$scope', '$http', '$routeParams' , function ($location, $rootScope, $scope, $http, $routeParams) {


    //*// ---------------------------------    Log In Section    --------------------------------------------------\\*\\

    /**
     *  Call Back Function - Defined in the "google_handle.js" file , called when there is Response from Google Sign In .
     *  Case Success - Check for user privileges and continue the flow ( Parse Login )
     *  Case Fail - Ask for Google Sign In
     */
    $scope.fuadCallback = function (authResult) {
        if (authResult['status']['signed_in']) {

            // Update the app to reflect a signed in user
            // Hide the sign-in button now that the user is authorized, for example:
            //onsole.log('result',authResult);
            gapi.client.load('plus', 'v1', function () {
                var request = gapi.client.plus.people.get({'userId': 'me'});
                request.execute(loadProfileCallback);
                function loadProfileCallback(result) {
                    parseManager.setGoogleProfileCurrentUser(result);
                    // TODO PARSE LOGIN HERE !!

                };
            });
        } else {
            // Update the app to reflect a signed out user
            // Possible error values:
            //   "user_signed_out" - User is signed-out
            //   "access_denied" - User denied access to your app
            //   "immediate_failed" - Could not automatically log in the user
            console.log('Sign-in state: ' + authResult['error']);
        }

    };

    // Connect The Google Sign In Callback function to the $scope window
    window.fuadCallback = $scope.fuadCallback;


    //*// ---------------------------------    * END * Log In Section  ---------------------------------------------\\*\\


    //*// ---------------------------------    $rootScope Global Vars   ----- -------------------------------------\\*\\


    $rootScope.users = []; // Array of all organization users.
    $rootScope.lessons = []; // Array of all organization lessons.
    $rootScope.content = []; // Array of all organization content.
    $rootScope.games = []; // Array of all organization games.
    $rootScope.myGroups = []; // Array of all user's groups
    $rootScope.selectedItems = []; // Array to store selected items from multiple actions.
    $rootScope.disableDeleteButtonDisplay = true;
    $rootScope.errorPage = false;
    $rootScope.mainPage = false;

    //*// ---------------------------------    *END*  $rootScope Global Vars    -----------------------------------\\*\\


    //*// ---------------------------------    $rootScope Helpers Functions    -------------------------------------\\*\\

    /**
     *  Google Plus User's Search Function
     *  @params :
     *  @string query - requested string for google search
     */

    $rootScope.googleSearch = function (query) {

        // replace actions buttons icons
        $rootScope.doneAdding = false;


        // Call the Google Search People API from the "google_handler.js" file with the requested query and response Call Back
        googlePlusSearch(googlePlusSearchCallback, query);

        /**
         *  Google Plus User's Search Call Back Function
         *  @params :
         *  @GooglePlusProfile results - Array of matching query Google Plus Profiles
         */
        function googlePlusSearchCallback(results) {
            // Update The $rootScope Model with the query's results
            $rootScope.queryResults = results.items;
            $rootScope.$apply();

        };
    };


    /**
     *  Function initVars - init  $rootScope Global vars .
     *  Init @params :
     *   @ParseObjects Array selectedItems - Contain all the selected Parse Object from the Partial's CheckBox's
     *   @Bollean disableDeleteButtonDisplay - boolean var to select the view & the functionality of the multiple Delete
     */

    $rootScope.initVars = function () {
        $rootScope.selectedItems = [];
        $rootScope.disableDeleteButtonDisplay = true;
    };


    /**
     *  Function isActive - Main Nav Bar Selected Item Helper  .
     *   @params :
     *   @String viewLocation - Current Partial Url Path .
     *   return @String active - return empty string if match not found or 'active' in case of a match .
     */

    $rootScope.isActive = function (viewLocation) {
        var active = ($location.path().indexOf(viewLocation) > -1);
        return active;
    };


    /**
     *  Function toggleCheck - handle the selected items from view's Check Box's .
     *   @params :
     *   @ParseObject item - Current Clicked or Un clicked Parse Object Item .
     */

    $rootScope.toggleCheck = function (item) {

        // Case item was selected
        if ($rootScope.selectedItems.indexOf(item) === -1) {
            $rootScope.selectedItems.push(item);
            $rootScope.disableDeleteButtonDisplay = false;
            // Case item was unselected
        } else {
            $rootScope.selectedItems.splice($rootScope.selectedItems.indexOf(item), 1);
            if ($rootScope.selectedItems.length == 0) {
                $rootScope.disableDeleteButtonDisplay = true;
            }
        }
    };


    //*// ---------------------------------    *END* $rootScope Helpers Functions    ------------------------------\\*\\

    //*// ---------------------------------    $rootScope Data Init   -------------------------------------------------\\*\\

    $rootScope.verifyUser = function (userName, userGooglePlusId) {

        parseManager.adminLogIn(signInCallback, userName, userGooglePlusId);

        function signInCallback(result) {
            $rootScope.currentUser = result;
            $rootScope.$apply();
            InitData();
            alertManager.succesAlert("Login Sucess" , 'User ' + result.attributes.username + ' Has Logged In Success');
        };


        function verifyUserCallback(result) {

            if (result.length == 0) {
                $rootScope.errorPage = true;
            } else {
                // Parse Login
                parseManager.adminLogIn(signInCallback, result[0].attributes.username, result[0].attributes.googleHangoutId);

                // Enable View of the main page
                $rootScope.mainPage = true;

                currentUserInstance = new ParseManager.CurrentUser(result[0]);

                parseManager.setCurrentUser(result[0]);
                // parseManager.getLessonContent(null);
                $rootScope.currentUser = result[0];

                $rootScope.$apply();
            }
        };
    };

    function InitData (){

        console.log("INIT");
        // Create Loader
        var numberOfActions = 5;
        var progressLoader = new AlertManager.Loader();


        // Get All Organization's Users
        // TODO add organization id to query ( Replace function with getParseObjectById)
        parseManager.getParseObject(getAllUsers, "_User", null);

        // Getting all games from Parse.
        parseManager.getParseObjectById(getAllGames, "Games", null, null, 'createdBy');

        // Getting all content from Parse.
        parseManager.getParseObject(getAllContentCallback, "Content", null);

        // Getting all organization's lessons
        parseManager.getParseObject(getAllLessonsCallback, "Lesson", null);

        // Getting current user's groups
        parseManager.getParseObject( getMyGroups , "UserGroups" , "ownerId" , Parse.User.current() );





        /* $rootScope Init Data Parse Call Back Functions Section */

        function getAllUsers(users) {
            // TODO - HANDLE ERRORS
            $rootScope.users = users;
            $rootScope.userOrder = 'attributes.username';
            progressLoader.setLoaderProgress(100/numberOfActions);
            $rootScope.$apply();

        }


        function getAllGames(games) {
            console.log(games);
            $rootScope.games = games;
            //$scope.gamesOrder = "gameName"
            progressLoader.setLoaderProgress(100/numberOfActions);
            $rootScope.$apply();
        }

        function getAllContentCallback(content) {
            $rootScope.content = content;
            //$scope.contentOrder = 'attributes.title';
            progressLoader.setLoaderProgress(100/numberOfActions);
            $scope.$apply();


        };

        function getAllLessonsCallback(lessons) {
            var queryCounter = 0;
            lessons.forEach(function (lesson) {
                queryCounter++;
                parseManager.getLessonContent(getLessonContentCallback, lesson.id);

                function getLessonContentCallback(result) {
                    lesson["contents"] = result;
                    if (queryCounter == lessons.length) {
                        $rootScope.lessons = lessons;
                        progressLoader.setLoaderProgress(100/numberOfActions);
                        //$rootScope.lessonsOrder = 'attributes.name';
                        $rootScope.$apply();
                    }
                };
            });
        };

        function getMyGroups(myGroups){
            console.log("GETTING GROUPS" , myGroups);
            $rootScope.myGroups = myGroups;
            //$scope.groupsOrder = "attributes.groupName";
            progressLoader.setLoaderProgress(100/numberOfActions);
            $rootScope.$apply();
        };

        /* *END* Parse Call Back Sections */

    }


//*// ---------------------------------   *END* $rootScope Data Init   ---------------------------------------------\\*\\



}]);




/**
 * Users Controllers - Handles the Manage Users Part.
 * $scope Vars : @param $scope.users - contain all "Users" object from parse .
 *               @param $scope.userOrder - init the starting order . (default = username)
 */


var userController = angular.module('userController', ['ngAnimate']);


userController.controller('UsersController', ['$location' , '$rootScope' , '$scope', '$http', '$routeParams' , function ($location, $rootScope, $scope, $http, $routeParams) {

    /**
     *  Function addNewUser - Enter New User To Organization  (Parse SignUp) .
     *   @params :
     *   @GooglePlusProfile queryItem - Google Plus JSON with requested user details  .
     *   return @String active - return empty string if match not found or 'active' in case of a match .
     */

    $scope.addNewUser = function (queryItem) {


        // Create the New User Object
        var newUser = [];
        newUser["googleHangoutId"] = queryItem.id;
        newUser["username"] = queryItem.displayName;
        newUser["password"] = queryItem.id;
        newUser["privileges"] = 1;
        newUser["badges"] = [];
        newUser["favoriteFood"] = [];
        newUser["imageUrl"] = queryItem.image.url;
        newUser["googlePlusUrl"] = queryItem.url;


        // Create the new Parse User in cloud .
        parseManager.createNewUserParseAccount(addNewUserCallback, newUser);

        /**
         *  Function addNewUser - Enter New User To Organization  (Parse SignUp) .
         *   @params :
         *   @ParseUser result - Signed in Parse User ( if success )  .
         *   @ParseException error - JSON with details of the error case SignUp fail .
         */

        function addNewUserCallback(result, error) {
            // Case of Fail
            if (error) {
                var faildAlert = new Alert('danger', 'faild to add new user');
                faildAlert.start();
                // Case of Success
            } else {
                // Change actions button's icons view to Success .
                $rootScope.doneAdding = true;
                // Init the query Array
                $rootScope.queryResults = [];

                // Push the new added user to be the only one in the list .
                $rootScope.queryResults.push(queryItem);

                // Push The new Parse User to the $scope list.
                $rootScope.users.push(result);
                $rootScope.$apply();


                var successAlert = new Alert('success', 'Add New User Success');
                successAlert.start();
            }
        }
    };


    $scope.sort = function (type) {
        $scope.userOrder = 'attributes.' + type;
    };


    // flag that user as a "dirty" which will indicates it was changed..
    $scope.updateUser = function (user) {


    };

    $scope.deleteUser = function (user) {
        // TODO
    };
}]);


/**
 * Games Controllers - Handles the Game Zone Part.
 * $scope Vars : @param $scope.games - contain all "Games" object from parse .
 *               @param $scope.gamesOrder - init the starting order . (default = gameName)
 */

var gamesController = angular.module('gamesController', []);

gamesController.controller('GamesController', ['$rootScope' , '$scope', '$http', '$routeParams' , function ($rootScope, $scope, $http, $routeParams) {



    $scope.sort = function (type) {
        $scope.gamesOrder = type;
    };

    $scope.deleteSelectedItems = function () {

        function deleteObjectCallback(result) {
            var successAlert = new Alert('success', 'delete connected item successfully');
            successAlert.start();
        };


        // Delete Connected Items Callback
        function getGame2LessonCallback(result) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    parseManager.deleteObject(deleteObjectCallback, result[i]);
                }
            }
        };

        // Delete Function's callback , if success - delete all connected items ..
        function multipleDeleteCallback(result) {

            var successAlert = new Alert('success', 'delete items successfully');
            successAlert.start();

            for (var i = 0; i < $rootScope.selectedItems.length; i++) {
                // After delete in Parse success - Removing elements from $scope
                var index = $rootScope.games.indexOf($rootScope.selectedItems[i]);
                $rootScope.games.splice(index, 1);

                // Delete Items from connected tables
                parseManager.getParseObject(getGame2LessonCallback, "Games2Lesson", "game", $rootScope.selectedItems[i]);

            }
            $rootScope.$apply();
            $rootScope.selectedItems = [];
        };

        // If there is selected items , delete them ..
        if ($rootScope.selectedItems.length > 0) {
            console.log('Delete ' + $rootScope.selectedItems.length + ' Items');
            parseManager.deleteMultipleItems(multipleDeleteCallback, $rootScope.selectedItems);
        }

    };

    /******
     onClick Event - delete game function .
     ******/
    $scope.deleteGame = function (game) {
        /*********
         ParseManager callback function - after delete success from Parse
         object will be removed from $scope.
         *********/


        function deleteQuestionCallback(result) {
            if (result) {
                var successAlert = new Alert('success', 'delete games question succesfully');
                successAlert.start();
            }
        };


        function getGameQuestionsCallback(result, error) {
            console.log("Get item callback ", result);
            if (result) {
                result.forEach(function (item) {
                    parseManager.deleteObject(deleteQuestionCallback, item);
                })
            } else {
                console.log('error');
            }

        };


        function deleteResult(result) {
            if (result) {

                parseManager.getParseObjectById(getGameQuestionsCallback, "TriviaQuestions", "gameId", game.id);

                var index = $rootScope.games.indexOf(game);
                $rootScope.games.splice(index, 1);
                $rootScope.$apply();
                var successAlert = new Alert('success', 'delete game "' + game.attributes.gameName + '" succesfully');
                successAlert.start();
            } else {
                console.log('error');
            }

        };

        parseManager.deleteObject(deleteResult, game);
    };

    /******
     onClick Event - save game function .
     ******/
    $scope.saveGame = function (game) {
        parseManager.saveObject(saveGameCallback , "Games" , gameDetails);

        function saveGameCallback (result , error){
            if(result){
                if(!game.id){
                    $rootScope.games.push(result);
                    $rootScope.$apply();
                }
            }else{
                // TODO ERROR ALERT
            }
        };
    };


}]);


gamesController.controller('GamesCtrl', ['$location' , '$rootScope' , '$scope', function ($location, $rootScope, $scope) {

    $scope.gamesThumbs = [
        {
            title: "טריוויה",
            img: "trivia.jpg",
            path: "Trivia"
        },
        {
            title: "משחק היכרות",
            img: "metting-game.jpg",
            path: "Meeting_Game"
        }
    ];

    $scope.addNewGame = function (newGameModal, gameType) {
        // gameType using now the Path param.. check it out Avi
        newGameModal["type"] = gameType;
        newGameModal["createdBy"] = Parse.User.current();


        function saveNewGameCallback(result) {
            // TODO Check for error
            $rootScope.games.push(result);
            console.log($rootScope.games.indexOf(result));
            console.log('TsamidDBFinal/index.php#/Games_Manage/Games/' + gameType + '/' + $rootScope.games.indexOf(result));
            $location.path('Games_Manage/Games/' + gameType + '/' + $scope.games.indexOf(result));
            $scope.$apply();
        };


        parseManager.saveObject(saveNewGameCallback, "Games", newGameModal);
    };


}]);


//this is avi controller
gamesController.controller('TriviaController', ['$location' , '$rootScope' , '$scope', '$routeParams' , function ($location, $rootScope, $scope, $routeParams) {
    $scope.whichItem = Number($routeParams.gameId);
    $scope.question;
    $scope.correctAnswer = -1;
    $scope.answers = [
        {
            label: "תשובה 1",
            indecator: "1"
        },
        {
            label: "תשובה 2",
            indecator: "2"
        },
        {
            label: "תשובה 3",
            index: '3'
        },
        {
            label: "תשובה 4",
            index: '4'

        }
    ];
    $scope.correct1 = false;
    $scope.correct2 = false;
    $scope.correct3 = false;
    $scope.correct4 = false;
    $scope.isCorrectAnswer = function (num) {

        switch (num) {
            case 1 :
                $scope.correct1 = true;
                break;
            case 2 :
                $scope.correct2 = true;
                break;
            case 3 :
                $scope.correct3 = true;
                break;
            case 4 :
                $scope.correct4 = true;
                break;
        }

        console.log($scope.correct);

    };


    $scope.sort = function (type) {
        $scope.questionOrder = 'attributes.' + type;
    };

    $scope.deleteQuestion = function (item) {
        console.log(item);

        function deleteQuestionCallback(questionItemResult) {
            // TODO - SCHECK FOR ERROR
            var index = $scope.questionList.indexOf(questionItemResult);
            $scope.questionList.splice(index, 1);
            $scope.$apply();
            var successAlert = new Alert('success', 'delete question success');
            successAlert.start();

        };

        parseManager.deleteObject(deleteQuestionCallback, item);
    };

    $scope.setCorrectAnswer = function (index) {
        $scope.correctAnswer = index + 1;
    };

    $scope.save = function () {


        var newQuestionModel = [];
        newQuestionModel["question"] = $scope.question;
        newQuestionModel["gameId"] = $rootScope.games[$scope.whichItem].id;
        newQuestionModel["correctAnswer"] = $scope.correctAnswer;

        for (var i = 1; i <= $scope.answers.length; i++) {
            newQuestionModel["answer" + i] = $scope.answers[i - 1].text;
        }


        function saveNewQuestionCallback(result) {

            $scope.questionList.push(result);
            $scope.$apply();
            var successAlert = new Alert('success', 'New Question Has Been Saved');
            successAlert.start();
        };

        parseManager.saveObject(saveNewQuestionCallback, "TriviaQuestions", newQuestionModel);

    };

    function getTriviaQuestionCallback(result) {
        // TODO check for errors
        $scope.questionList = result;
        $scope.questionOrder = "attributes.question"
        $scope.$apply();

    };

    parseManager.getParseObjectById(getTriviaQuestionCallback, "TriviaQuestions", "gameId", $rootScope.games[$scope.whichItem].id);

    function aviCallback(result) {
        console.log(result);
    }

    parseManager.getGame4Avi(aviCallback, null);

}]);


/**
 * Groups Controllers - Handles the User's Groups.
 * $scope Vars : @param $rootScope.myGroup - contain all user's group .
 *               @param $scope.gamesOrder - init the starting order . (default = gameName)
 */


var groupController = angular.module('groupController', []);

groupController.controller('GroupController', ['$rootScope' , '$scope', '$http', '$routeParams' , function ($rootScope, $scope, $http, $routeParams) {

    console.log("root scpoping ")
    console.log($rootScope.myGroups);

    $scope.deleteGroup  = function (group){
        function deleteGroupCallback(result){
            var index = $rootScope.myGroups.indexOf(group);
            $rootScope.myGroups.splice( index , 1);
            $rootScope.$apply();
            var successAlert = new Alert('success' ,'delete group "'+group.attributes.groupName+'" succesfully');
            successAlert.start();
        };

        parseManager.deleteObject( deleteGroupCallback , group );

    };

    $scope.saveGroup = function(group) {


        function saveGroupCallback(result) {
            // TODO CHECK FOR ERROR
            $rootScope.myGroups.push(result);
            delete $scope.newGroup;
            $rootScope.$apply();
        };

        group["ownerId"] = Parse.User.current();

        parseManager.saveObject( saveGroupCallback , "UserGroups" , group);
    };

    $scope.deleteSelectedItems = function(){


        if($rootScope.selectedItems.length > 0 ){
            parseManager.deleteMultipleItems( multipleDeleteCallback , $rootScope.selectedItems);
        }

        function deleteUserFromTablesCallback (result){
            var successAlert = new Alert('success' ,'delete connected item successfully');
            successAlert.start();
        }


        function removeFromUsers2GroupCallback (result){
            console.log('delete users from group');
            console.log(result);
            if(result.length > 0 ){
                for ( var i = 0 ; i < result.length ; i++){
                    parseManager.deleteObject(deleteUserFromTablesCallback , result[i]);
                }
            }
        };


        function multipleDeleteCallback(result){

            var successAlert = new Alert('success' ,'delete items successfully');
            successAlert.start();
            for ( var i = 0 ; i < $rootScope.selectedItems.length ; i++){
                var index = $scope.myGroups.indexOf($rootScope.selectedItems[i]);

                parseManager.getParseObjectById(removeFromUsers2GroupCallback , "Users2Groups" , "groupId" , $rootScope.selectedItems[i].id);

                $rootScope.myGroups.splice( index , 1);
            }
            $rootScope.$apply();
            $rootScope.selectedItems = [];
        };





    };

    $scope.sendMailsToGroup = function(group) {
        alert("hello");
    };


}]);

/**
 * Group Details Controller - Handles the Selected Group Edit Screen.
 * $scope Vars : @param $scope.users - contain all "Users" object from parse .
 *               @param $scope.userOrder - init the starting order . (default = username)
 */


groupController.controller('GroupDetailsController', ['$rootScope' ,'$scope', '$http', '$routeParams' , function ($rootScope , $scope, $http, $routeParams) {

    //*// ---------------------------------    $scope  Vars    ----------------------------------------------------\\*\\

    // @int whichItem - index of the selected group (get it from URL)
    $scope.whichItem = Number($routeParams.groupId);


    //*// ---------------------------------    *END*  $scope  Vars    ---------------------------------------------\\*\\

    //*// ---------------------------------    $scope  Init      --------------------------------------------------\\*\\
    parseManager.getParseObject(getMyGroupsCallback, "UserGroups", "ownerId", Parse.User.current());
    parseManager.getParseObject(getAllUsersCallback, "_User", null);



    /**
     *  $scope Call Back Functions
     */

    function getMyGroupsCallback(myGroups) {

        console.log('THIS IS MY GROUPS ' , myGroups);
        $scope.myGroups = myGroups;
        $scope.currentGroup = $scope.myGroups[$scope.whichItem];
        $scope.$apply();
        parseManager.getParseObjectById(getGroupUsersCallback, "Users2Groups", "groupId", $scope.currentGroup.id, "user");
    };

    function getAllUsersCallback(allUsers) {
        $scope.unSelectedUsers = allUsers;
        $scope.allUsersOrder = "attributes.userName";
        $scope.$apply();
    };

    function getGroupUsersCallback(groupUsers) {
        $scope.selectedUsers = [];

        for (var index = 0; index < groupUsers.length; ++index) {
            $scope.selectedUsers.push(groupUsers[index].attributes.user);
        }

        $scope.selectedUsers.forEach(function (selectedItem) {
            $scope.unSelectedUsers.forEach(function (unselectedItem) {
                if (selectedItem.id == unselectedItem.id) {
                    var index = $scope.unSelectedUsers.indexOf(unselectedItem);
                    $scope.unSelectedUsers.splice(index, 1);
                }

            });


        });
        $scope.userOrder = "attributes.username";
        $scope.$apply();
    };



    //*// ---------------------------------    * END * $scope Init     --------------------------------------------\\*\\

    //*// ---------------------------------    $scope  On Click Events --------------------------------------------\\*\\



    $scope.addToSelected = function (item) {
        var index = $scope.unSelectedUsers.indexOf(item);
        $scope.unSelectedUsers.splice(index, 1);
        $scope.selectedUsers.push(item);
        //$scope.$apply();

    };

    $scope.addToUnselected = function (item) {
        var index = $scope.selectedUsers.indexOf(item);
        $scope.selectedUsers.splice(index, 1);
        $scope.unSelectedUsers.push(item);
        //$scope.$apply();
    };




    //*// ---------------------------------   * END * $scope  On Click Events --------------------------------------\\*\\




}]);


/**
 * Content Controllers - Handles Media Items ( Presentations , Documents , Videos etc.. ).
 * $scope Vars : @param $scope.users - contain all "Users" object from parse .
 *               @param $scope.userOrder - init the starting order . (default = username)
 */

var contentController = angular.module('contentController', []);

contentController.controller('ContentListController', ['$rootScope' , '$scope', '$http', '$routeParams' , function ($rootScope, $scope, $http, $routeParams) {

    $scope.isSelected = function (item, type) {
        if (item.attributes.type == type) {
            return 'select';
        } else {
            return "";
        }
    };

    $scope.sort = function (type) {
        $scope.contentOrder = 'attributes.' + type;
    };


    $scope.saveContent = function (item) {

        function saveContentCallback(result) {
            if (!item.id) {
                $rootScope.content.push(result);
                delete $scope.newContentModel;
                $rootScope.$apply();
            }

        };

        parseManager.saveObject(saveContentCallback, "Content", item);

    };

    $scope.deleteContent = function (item) {

        parseManager.deleteObject("deleteContentCallback", item, "Content");
    };


    $scope.deleteSelectedItems = function () {


        if ($rootScope.selectedItems.length > 0) {
            parseManager.deleteMultipleItems(multipleDeleteCallback, $rootScope.selectedItems);
        }

        function deleteContentFromTablesCallback(result) {
            var successAlert = new Alert('success', 'delete connected item successfully');
            successAlert.start();
        }


        function getContent2LessonCallback(result) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    parseManager.deleteObject(deleteContentFromTablesCallback, result[i]);
                }
            }
        };


        function multipleDeleteCallback(result) {

            var successAlert = new Alert('success', 'delete items successfully');
            successAlert.start();
            for (var i = 0; i < $rootScope.selectedItems.length; i++) {
                var index = $rootScope.content.indexOf($rootScope.selectedItems[i]);

                parseManager.getParseObject(getContent2LessonCallback, "Content2Lesson", "content", $rootScope.selectedItems[i]);

                $rootScope.content.splice(index, 1);
            }
            $rootScope.$apply();
            $rootScope.selectedItems = [];
        };


    };


}]);



/**
 * Lessons Controllers - Handles the Lessons Part.
 * $scope Vars : @param $scope.users - contain all "Users" object from parse .
 *               @param $scope.userOrder - init the starting order . (default = username)
 */

var lessonsController = angular.module('lessonsController', []);

lessonsController.controller('LessonsListController', ['$scope', '$http', '$routeParams' , function ($scope, $http, $routeParams) {






}]);


/**
 * System Admin Controllers - Handles The Organizations Management , Visible Only To Super Users .
 * $scope Vars : @param $scope.users - contain all "Users" object from parse .
 *               @param $scope.userOrder - init the starting order . (default = username)
 */


var systemAdminController = angular.module('systemAdminController', []);

systemAdminController.controller('SystemAdminController', ['$rootScope' , '$scope', '$http', '$routeParams' , function ($rootScope, $scope, $http, $routeParams) {
    $scope.organizations = [];

    function getAllOrganizationsCallback(organizations) {
        console.log(organizations);
        var counter = 0;
        organizations.forEach(function (organization) {
            parseManager.getParseObjectById(getOrgnizationUsersCallback, "_User", "organizationId", organization.id);

            function getOrgnizationUsersCallback(result) {
                counter++;
                organization["users"] = [];
                organization["users"] = result;

                if (counter == organizations.length) {
                    $scope.organizations = organizations;
                    $scope.organizationsOrder = 'attributes.name';
                    console.log("this is", $scope.organizations);
                    $scope.$apply();
                }
            };
        });

    };


    parseManager.getParseObject(getAllOrganizationsCallback, "Organizations", null);

    $scope.saveOrganization = function (item) {

        function saveOrganizationCallback(result) {
            if (!item.id) {
                $scope.organizations.push(result);
                delete $scope.newOrganization;
                $scope.$apply();
            }

        };

        parseManager.saveObject(saveOrganizationCallback, "Organizations", item);

    };

    $scope.deleteOrganization = function (organization) {

        function deleteOrganizationCallback(result, error) {
            if (result) {
                var index = $scope.organizations.indexOf(organization);
                $scope.organizations.splice(index, 1);
                $scope.$apply();
                var successAlert = new Alert('success', 'delete organization item successfully');
                successAlert.start();
            }
        };

        parseManager.deleteObject(deleteOrganizationCallback, organization, "Organizations");
    }


    $scope.deleteSelectedItems = function () {

        if ($rootScope.selectedItems.length > 0) {
            console.log('Delete ' + $rootScope.selectedItems.length + ' Items');
            parseManager.deleteMultipleItems(multipleDeleteCallback, $rootScope.selectedItems);
        }

        function multipleDeleteCallback(result) {

            var successAlert = new Alert('success', 'delete items successfully');
            successAlert.start();

            for (var i = 0; i < $rootScope.selectedItems.length; i++) {
                // After delete in Parse success - Removing elements from $scope
                var index = $scope.organizations.indexOf($rootScope.selectedItems[i]);
                $scope.organizations.splice(index, 1);
            }
            $rootScope.$apply();
            $rootScope.selectedItems = [];
        };
    }

}]);
