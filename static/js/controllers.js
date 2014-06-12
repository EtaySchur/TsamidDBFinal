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

                    parseManager.adminLogIn(signInCallback , result.displayName , result.id);

                    function signInCallback(parseUser) {
                        $rootScope.currentUser = parseUser;
                        $rootScope.$apply();
                        InitData();
                        alertManager.succesAlert("Login Sucess", 'User ' + result.attributes.username + ' Has Logged In Success');
                    };

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


    $rootScope.newOrganizationId;

    // Global Data Arrays \\
    $rootScope.users = []; // Array of all organization users.
    $rootScope.lessons = []; // Array of all organization lessons.
    $rootScope.content = []; // Array of all organization content.
    $rootScope.games = []; // Array of all organization games.
    $rootScope.myGroups = []; // Array of all user's groups
    $rootScope.badges = [];


    $rootScope.selectedItems = []; // Array to store selected items from multiple actions.

    // Global View Params
    $rootScope.disableDeleteButtonDisplay = true;
    $rootScope.errorPage = false;
    $rootScope.mainPage = false;
    $rootScope.showAdminTabs = false;
    $rootScope.mainApplicationView = false;
    $rootScope.googleSignInButton = false;

    $rootScope.showActions = []; // Array of booleans to display or not item's actions (By Parse ACL)


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

    /**
     *  Function isSelected - handle the selected items from view's Select Dropdowns .
     *   @params :
     *   @ParseObject item - Current Selected or Un Selected Parse Object Item .
     *   @String type - current selected type .
     */

    $rootScope.isSelected = function (item, type) {
        if (item.attributes.type == type) {
            return 'select';
        } else {
            return "";
        }
    };

    /**
     *  Function sort - Sorts The view's items order .
     *   @params :
     *   @ParseObject type - Current Selected or Un Selected Parse Object Item .
     */

    $rootScope.sort = function (type){
        console.log(type);
        if( type == "createdAt"){
            $rootScope.itemsOrder = type;
        }else{
            $rootScope.itemsOrder =  'attributes.' + type;
        }

    }




    //*// ---------------------------------    *END* $rootScope Helpers Functions    ------------------------------\\*\\

    //*// ---------------------------------    $rootScope Data Init   -------------------------------------------------\\*\\

    $rootScope.verifyUser = function ( userName, userGooglePlusId) {

        parseManager.adminLogIn(signInCallback, userName, userGooglePlusId);

        function signInCallback(result) {
            $rootScope.currentUser = result;
            $rootScope.$apply();
            InitData();
            alertManager.succesAlert("Login Sucess", 'User ' + result.attributes.username + ' Has Logged In Success');
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


    function InitData() {


        // Create Loader
        var numberOfActions = 5;
        var progressLoader = new AlertManager.Loader();

        managePrivileges(Parse.User.current());

        // Get All Organization's Users
        // TODO add organization id to query ( Replace function with getParseObjectById)
        parseManager.getParseObject(getAllUsers, "_User", null);

        // Getting all games from Parse.
        parseManager.getParseObjectById(getAllGamesCallback, "Games", null);

        // Getting all content from Parse.
        parseManager.getParseObjectById(getAllContentCallback, "Content", null);

        // Getting all organization's lessons
        parseManager.getParseObject(getAllLessonsCallback, "Lesson", null);

        // Getting current user's groups
        parseManager.getParseObject(getMyGroups, "UserGroups", "ownerId", Parse.User.current());





        /* $rootScope Init Data Parse Call Back Functions Section */

        function getAllUsers(users) {
            // TODO - HANDLE ERRORS
            $rootScope.users = users;
            $rootScope.userOrder = 'attributes.username';
            progressLoader.setLoaderProgress(100 / numberOfActions);
            $rootScope.$apply();

        }


        function getAllGamesCallback(games) {
            console.log(games);
            $rootScope.games = games;
            //$scope.gamesOrder = "gameName"

            progressLoader.setLoaderProgress(100 / numberOfActions);
            $rootScope.$apply();
        }

        function getAllContentCallback(content) {
            $rootScope.content = content;
            //$scope.contentOrder = 'attributes.title';
            progressLoader.setLoaderProgress(100 / numberOfActions);

            $scope.$apply();


        };

        function getAllLessonsCallback(lessons) {
            var queryCounter = 0;
            lessons.forEach(function (lesson) {
                queryCounter++;
                parseManager.getParseLessonContent(getLessonContentCallback, lesson);

                function getLessonContentCallback(result) {
                    console.log("print 1 result: ", result);
                    lesson["contents"] = result;
                    if (queryCounter == lessons.length) {
                        $rootScope.lessons = lessons;
                        progressLoader.setLoaderProgress(100 / numberOfActions);

                        //$rootScope.lessonsOrder = 'attributes.name';
                        $rootScope.$apply();
                        console.log("print all lessons: ", $rootScope.lessons);
                    }
                };
            });
        };

        function getMyGroups(myGroups) {
            $rootScope.myGroups = myGroups;
            //$scope.groupsOrder = "attributes.groupName";
            progressLoader.setLoaderProgress(100 / numberOfActions);

            $rootScope.$apply();
        };

        /* *END* Parse Call Back Sections */


        /* * Privileges Manage */

        function managePrivileges(currentUser) {
            var userPrivileges = currentUser.attributes.privileges;

            if (userPrivileges > 1) {
                $rootScope.mainApplicationView = true;
            } else {
                $rootScope.errorPage = true;
            }

            if (userPrivileges > 4) {
                $rootScope.showAdminTabs = true;
                $rootScope.$apply();
            }

        };

        /* *END*  Privileges Manage */

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

    $scope.addNewUser = function (queryItem, privileges) {




        // Create the New User Object
        var newUser = [];
        newUser["googleHangoutId"] = queryItem.id;
        newUser["username"] = queryItem.displayName;
        newUser["password"] = queryItem.id;
        newUser["privileges"] = privileges;
        newUser["badges"] = [];
        newUser["favoriteFood"] = [];
        newUser["imageUrl"] = queryItem.image.url;
        newUser["googlePlusUrl"] = queryItem.url;
        console.log("Query Item ", queryItem);


        if (privileges == 1) {
            newUser["organizationId"] = Parse.User.current().get("organizationId");
        }

        if (privileges == 3) {
            newUser["organizationId"] = $rootScope.newOrganizationId;
        }

        //getGoogleInfo(getUserInfoCallback , queryItem.id);

        function getUserInfoCallback(result) {
            console.log(result);
            // Create the new Parse User in cloud .

        };

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
        parseManager.saveObject(saveGameCallback, "Games", gameDetails);

        function saveGameCallback(result, error) {
            if (result) {
                if (!game.id) {
                    $rootScope.games.push(result);
                    $rootScope.$apply();
                }
            } else {
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


    $scope.deleteGroup = function (group) {
        function deleteGroupCallback(result) {
            var index = $rootScope.myGroups.indexOf(group);
            $rootScope.myGroups.splice(index, 1);
            $rootScope.$apply();
            var successAlert = new Alert('success', 'delete group "' + group.attributes.groupName + '" succesfully');
            successAlert.start();
        };

        parseManager.deleteObject(deleteGroupCallback, group);

    };


    $scope.saveGroup = function (group) {


        function saveGroupCallback(result) {
            // TODO CHECK FOR ERROR
            $rootScope.myGroups.push(result);
            delete $scope.newGroup;
            $rootScope.$apply();
        };

        group["ownerId"] = Parse.User.current();

        var fileUploadControl = $("#fileUploader")[0];
        var parseFile = new Parse.File("group_image_" + group.groupName, fileUploadControl.files[0]);
        group['usersIds'] = [];
        parseFile.save().then(function () {
            group.imageFile = parseFile;
            parseManager.saveObject(saveGroupCallback, "UserGroups", group);
        }, function (error) {

            // TODO HANDLE ERROR

        });


    };

    $scope.deleteSelectedItems = function () {


        if ($rootScope.selectedItems.length > 0) {
            parseManager.deleteMultipleItems(multipleDeleteCallback, $rootScope.selectedItems);
        }

        function deleteUserFromTablesCallback(result) {
            var successAlert = new Alert('success', 'delete connected item successfully');
            successAlert.start();
        }


        function removeFromUsers2GroupCallback(result) {
            console.log('delete users from group');
            console.log(result);
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    parseManager.deleteObject(deleteUserFromTablesCallback, result[i]);
                }
            }
        };


        function multipleDeleteCallback(result) {

            var successAlert = new Alert('success', 'delete items successfully');
            successAlert.start();
            for (var i = 0; i < $rootScope.selectedItems.length; i++) {
                var index = $scope.myGroups.indexOf($rootScope.selectedItems[i]);

                parseManager.getParseObjectById(removeFromUsers2GroupCallback, "Users2Groups", "groupId", $rootScope.selectedItems[i].id);

                $rootScope.myGroups.splice(index, 1);
            }
            $rootScope.$apply();
            $rootScope.selectedItems = [];
        };


    };


    $scope.sendEmail = function (email, item) {
        var counter = 0;
        // Getting Groups Users Email
        parseManager.getParseObjectById(getGroupUsersDetailsCallback, "_User", null, null, null, null, null, "objectId", item.attributes.usersIds);


        function getGroupUsersDetailsCallback(results) {
            if (results) {
                results.forEach(function (parseUser) {
                    parseManager.sendEmail(sendEmailCallback, Parse.User.current(), parseUser, email.subject, email.fullText);

                    function sendEmailCallback(result) {
                        counter++;
                        if (result) {

                        }
                        if (counter == results.length) {
                            alertManager.succesAlert("Send Email Success", "The Emails Have Been Sent Successfully");
                        }
                    };
                });

            }
        };


    };

    $scope.sendMailsToGroup = function (group) {

    };


}]);

/**
 * Group Details Controller - Handles the Selected Group Edit Screen.
 * $scope Vars : @param $scope.users - contain all "Users" object from parse .
 *               @param $scope.userOrder - init the starting order . (default = username)
 */


groupController.controller('GroupDetailsController', ['$rootScope' , '$scope', '$http', '$routeParams' , function ($rootScope, $scope, $http, $routeParams) {

    //*// ---------------------------------    $scope  Vars    ----------------------------------------------------\\*\\

    // @int whichItem - index of the selected group (get it from URL)
    $scope.whichItem = Number($routeParams.groupId);


    //*// ---------------------------------    *END*  $scope  Vars    ---------------------------------------------\\*\\

    //*// ---------------------------------    $scope  Init      --------------------------------------------------\\*\\
    if ($rootScope.myGroups.length > 0) {
        $scope.currentGroup = $rootScope.myGroups[$scope.whichItem];
        // Get all group's users
        parseManager.getParseObjectById(getSelectedUsersCallback, "_User", null, null, null, null, null, "objectId", $scope.currentGroup.attributes.usersIds);
        parseManager.getParseObjectById(getUnselectedUsersCallback, "_User", null, null, null, "objectId", $scope.currentGroup.attributes.usersIds, null, null);
    }


    $scope.$watch('myGroups', function () {
        $scope.currentGroup = $rootScope.myGroups[$scope.whichItem];
        if ($scope.currentGroup) {

            console.log('root scope myGroup ', $rootScope.myGroups);
            $scope.currentGroup = $rootScope.myGroups[$scope.whichItem];
            // Get all group's users

            parseManager.getParseObjectById(getSelectedUsersCallback, "_User", null, null
                , null, null, null, "objectId", $scope.currentGroup.attributes.usersIds);

            parseManager.getParseObjectById(getUnselectedUsersCallback, "_User", null, null
                , null, "objectId", $scope.currentGroup.attributes.usersIds, null, null);
        }

    });


    /**
     *  $scope Call Back Functions
     */


        // Get all users don't belong to this group
    function getSelectedUsersCallback(result) {
        console.log('selected users ', result);
        $scope.selectedUsers = result;
        $scope.selectedUsersBackup = angular.copy($scope.selectedUsers);
        $scope.$apply();
    };

    function getUnselectedUsersCallback(result) {
        $scope.unSelectedUsers = result;
        $scope.unSelectedUsersBackup = angular.copy($scope.unSelectedUsers);
        $scope.$apply();
    }


    //*// ---------------------------------    * END * $scope Init     --------------------------------------------\\*\\

    //*// ---------------------------------    $scope  On Click Events --------------------------------------------\\*\\

    $scope.saveGroupUsers = function () {
        $scope.currentGroup.attributes.usersIds = [];
        for (var i = 0; i < $scope.selectedUsers.length; i++) {
            $scope.currentGroup.attributes.usersIds.push($scope.selectedUsers[i].id);
        }

        parseManager.saveObject(saveGroupUsersCallback, "UserGroups", $scope.currentGroup);

        function saveGroupUsersCallback(result) {
            if (result) {
                $scope.selectedUsersBackup = angular.copy($scope.selectedUsers);
                $scope.unSelectedUsersBackup = angular.copy($scope.unSelectedUsers);
                alertManager.succesAlert("Save Users", "Save Users Success");
            } else {

            }
        }
    }

    $scope.undoChanges = function () {
        $scope.selectedUsers = angular.copy($scope.selectedUsersBackup);
        $scope.unSelectedUsers = angular.copy($scope.unSelectedUsersBackup);
    }

    $scope.addToSelected = function (item) {
        var index = $scope.unSelectedUsers.indexOf(item);
        $scope.unSelectedUsers.splice(index, 1);
        $scope.selectedUsers.push(item);


    };

    $scope.addToUnselected = function (item) {
        var index = $scope.selectedUsers.indexOf(item);
        $scope.selectedUsers.splice(index, 1);
        $scope.unSelectedUsers.push(item);

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

        item["organizationId"] = Parse.User.current().get("organizationId");

        parseManager.saveObject(saveContentCallback, "Content", item);

    };


    $scope.deleteContent = function (item) {

        parseManager.deleteObject( deleteContentCallback , item, "Content");

        function deleteContentCallback ( result){
            var index = $rootScope.content.indexOf(item);
            $rootScope.content.splice( index , 1);
            $rootScope.$apply();
            var successAlert = new Alert('success', 'delete connected item successfully');
            successAlert.start();
        };
    };


    $scope.deleteSelectedItems = function () {


        if ($rootScope.selectedItems.length > 0) {
            parseManager.deleteMultipleItems(multipleDeleteCallback, $rootScope.selectedItems);
        }

        function deleteContentFromTablesCallback( result) {

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

lessonsController.controller('LessonsListController', ['$rootScope' , '$scope', '$http', '$routeParams' , function ($rootScope, $scope, $http, $routeParams) {

    //*// ---------------------------------    $scope  Vars    ----------------------------------------------------\\*\\

    $scope.selectedContent = [];
    $scope.unselectedContent = [];
    $scope.selectedGames = [];
    $scope.unselectedGames = [];

    //*// ---------------------------------    *END*  $scope  Vars    ---------------------------------------------\\*\\

    //*// ---------------------------------    $scope  OnClickEvents      -----------------------------------------\\*\\

    $scope.deleteLesson = function (item){
        console.log("delete item: ", item);
        console.log("delete from lessons: ", $rootScope.lessons);

        //console.log("delete index: ", index);

        parseManager.deleteObject( deleteLessoncallback , item);


        function deleteLessoncallback (result){
            var index = $rootScope.lessons.indexOf(item);
            $rootScope.lessons.splice( index , 1);
            $rootScope.$apply();

        };



    }

    $scope.saveNewLesson = function (lesson) {
        lesson['contents'] = [];
        lesson['games'] = [];
        lesson['createdBy'] = Parse.User.current();

        $scope.selectedContent.forEach(function(content){
            lesson.contents.push(content.id);
        });

        $scope.selectedGames.forEach(function(game){
            lesson.games.push(game.id);
        });

        parseManager.saveObject(saveNewLessonCallback, 'Lesson', lesson);

        function saveNewLessonCallback(result) {
            result['contents'] = [];
            result.contents['content'] = $scope.selectedContent;
            result.contents['games'] = $scope.selectedGames;

            $rootScope.lessons.push(result);
            $scope.$apply();

            $scope.selectedGames = [];
            $scope.unselectedGames = [];
            $scope.selectedContent = [];
            $scope.unselectedContent = [];
        }
    }

    $scope.saveLesson = function (lesson) {

        lesson.attributes.contents = [];
        lesson.attributes.games = [];

        $scope.selectedContent.forEach(function(content){
            lesson.attributes.contents.push(content.id);
        });

        $scope.selectedGames.forEach(function(game){
            lesson.attributes.games.push(game.id);
        });

        if (lesson.contents == undefined){
            lesson['contents'] = [];
            lesson.contents['content'] = $scope.selectedContent;
            lesson.contents['games'] = $scope.selectedGames;
        }
        else{
            lesson.contents.content = $scope.selectedContent;
            lesson.contents.games = $scope.selectedGames;
        }

        parseManager.saveObject(saveContentCallback, 'Lesson', lesson);

        function saveContentCallback(result) {

        }

        $scope.selectedGames = [];
        $scope.unselectedGames = [];
        $scope.selectedContent = [];
        $scope.unselectedContent = [];
    };

    $scope.initNewLesson = function () {

        $scope.selectedContent = [];
        $scope.unselectedContent = $rootScope.content;
        $scope.selectedGames = [];
        $scope.unselectedGames = $rootScope.games;
    };

    $scope.initUnselectedItems = function (item) {

        $scope.selectedContent = [];
        $scope.unselectedContent = [];
        $scope.selectedGames = [];
        $scope.unselectedGames = [];

        parseManager.getParseObjectById(getUnselectedItemsCallback, "Content", null, null, null, "objectId", item.attributes.contents);

        function getUnselectedItemsCallback(results) {
            $scope.unselectedContent = results;
            $scope.$apply();
        }

        parseManager.getParseObjectById(getUnselectedGamesCallback, "Games", null, null, null, "objectId", item.attributes.games);

        function getUnselectedGamesCallback(results) {
            $scope.unselectedGames = results;
            $scope.$apply();
        }

        $scope.selectedContent = item.contents != undefined ? item.contents.content : [];
        $scope.selectedGames = item.contents != undefined ? item.contents.games : [];
    };

    $scope.addToSelected = function (unselectedItem) {
        var index = $scope.unselectedContent.indexOf(unselectedItem);
        $scope.unselectedContent.splice(index, 1);
        $scope.selectedContent.push(unselectedItem);
    }

    $scope.addToUnselected = function (selectedItem) {
        var index = $scope.selectedContent.indexOf(selectedItem);
        $scope.selectedContent.splice(index, 1);
        $scope.unselectedContent.push(selectedItem);
    }

    $scope.addToSelectedGames = function (unselectedGame) {
        var index = $scope.unselectedGames.indexOf(unselectedGame);
        $scope.unselectedGames.splice(index, 1);
        $scope.selectedGames.push(unselectedGame);
    }

    $scope.addToUnselectedGames = function (selectedGame) {
        var index = $scope.selectedGames.indexOf(selectedGame);
        $scope.selectedGames.splice(index, 1);
        $scope.unselectedGames.push(selectedGame);
    }

    //*// ---------------------------------    * END * $scope OnClickEvents     -----------------------------------\\*\\

}]);


/**
 * System Admin Controllers - Handles The Organizations Management , Visible Only To Super Users .
 * $scope Vars : @param $scope.users - contain all "Users" object from parse .
 *               @param $scope.userOrder - init the starting order . (default = username)
 */


var systemAdminController = angular.module('systemAdminController', []);

systemAdminController.controller('SystemAdminController', ['$rootScope' , '$scope', '$http', '$routeParams' , function ($rootScope, $scope, $http, $routeParams) {
    $scope.organizations = [];
    $scope.currentStep = 1;
    $scope.step1 = true;
    $scope.step2 = false;
    parseManager.getParseObject(getAllOrganizationsCallback, "Organizations", null);


    function getAllOrganizationsCallback(organizations) {
        console.log(organizations);
        var counter = 0;
        organizations.forEach(function (organization) {
            parseManager.getParseObjectById(getOrgnizationUsersCallback, "_User", "organizationId", organization.id);

            function getOrgnizationUsersCallback(result) {
                counter++;
                organization["users"] = [];
                organization["users"] = result;
                console.log(organization);

                if (counter == organizations.length) {
                    $scope.organizations = organizations;
                    $scope.organizationsOrder = 'attributes.name';
                    console.log("this is", $scope.organizations);
                    $scope.$apply();
                }
            };
        });

    };

    $scope.isStepActive = function (step) {
        console.log(step);
        if ($scope.currentStep == step)
            return true;

    };


    $scope.nextStep = function (newOrganization) {

        $scope.newOrganization = newOrganization;
        $scope.step1 = false;
        $scope.step2 = true;
        $scope.currentStep++;


    };

    $scope.setNewUser = function (queryItem) {
        console.log("SETTING QUERY ITEM ", queryItem);
        // Change actions button's icons view to Success .
        $rootScope.doneAdding = true;
        // Init the query Array
        $rootScope.queryResults = [];

        // Push the new added user to be the only one in the list .
        $rootScope.queryResults.push(queryItem);
        $scope.queryItem = queryItem;
    };


    $scope.saveNewOrganization = function () {
        parseManager.saveObject(saveOrganizationCallback, "Organizations", $scope.newOrganization);
        function saveOrganizationCallback(result) {
            if (result) {
                addNewUser($scope.queryItem, result);
                console.log("Result:", result);
                delete $scope.newOrganization;
            }
        };


        function addNewUser(queryItem, organizaionItem) {


            // Create the New User Object
            console.log("queryitem:", queryItem);
            var newUser = [];
            newUser["googleHangoutId"] = queryItem.id;
            newUser["username"] = queryItem.displayName;
            newUser["password"] = queryItem.id;
            newUser["privileges"] = 3;
            newUser["badges"] = [];
            newUser["favoriteFood"] = [];
            newUser["imageUrl"] = queryItem.image.url;
            newUser["googlePlusUrl"] = queryItem.url;

            newUser["organizationId"] = organizaionItem.id;


            // Create the new Parse User in cloud .
            parseManager.createNewUserParseAccount(addNewUserCallback, newUser);


            function addNewUserCallback(result, error) {
                // Case of Fail
                if (error) {
                    var faildAlert = new Alert('danger', 'faild to add new user');
                    faildAlert.start();
                    // Case of Success
                } else {

                    delete $scope.newOrganization;
                    $rootScope.queryResults = [];
                    // Push The new Parse User to the $scope list.
                    $rootScope.users.push(result);
                    organizaionItem["users"] = [];
                    organizaionItem["users"].push(result);
                    console.log("Add New User To New Org ", organizaionItem);
                    // organizaionItem.users.push(result);
                    $scope.organizations.push(organizaionItem);

                    $rootScope.$apply();


                    var successAlert = new Alert('success', 'Add New User Success');
                    successAlert.start();
                }
            }
        }
    };

    $scope.initLocalVars = function () {
        $scope.step1 = true;
        $scope.step2 = false;
        $scope.currentStep = 1;

    }

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

var favoritesController = angular.module('favoritesController', []);

favoritesController.controller('FavoritesListController', ['$rootScope' , '$scope', '$http', '$routeParams' , function ($rootScope, $scope, $http, $routeParams) {


    $scope.isSelected = function (item, type) {
        if (item.attributes.type == type) {
            return 'select';
        } else {
            return "";
        }
    };




    //*// ---------------------------------   $scope Init Functions ------------------------------------------------\\*\\

    parseManager.getParseObject(getFavoritesCallback, "Favorites", null);

    /**
     *  $scope Call Back Functions
     */

    function getFavoritesCallback(results) {
        $scope.favorites = results;
        $rootScope.itemsOrder = 'attributes.name';
        for (var i = 0; i < results.length; i++) {
            var objectACL = results[i].getACL();
            $rootScope.showActions[i] = objectACL.getWriteAccess(Parse.User.current().id);
        }

        $scope.$apply();

    };
    //*// ---------------------------------   * END * $scope  Init Functions ---------------------------------------\\*\\

    //*// ---------------------------------   * END * $scope  On Click Events --------------------------------------\\*\\

    $scope.saveFavorite = function (favorite) {
        if (!favorite.id) {
            var fileUploadControl1 = $("#fileUploader")[0];
            var parseFile = new Parse.File("fav_" + favorite.name, fileUploadControl1.files[0]);
            parseFile.save().then(function () {
                favorite.imageFile = parseFile;
                parseManager.saveObject(saveNewFavoriteCallback, "Favorites", favorite);
            }, function (error) {

                // TODO HANDLE ERROR

            });
        }

        function saveNewFavoriteCallback(result) {
            delete $scope.newFavoriteModel;

            $scope.favorites.push(result);
            $scope.$apply();

        };




    };


    $scope.editFavorite = function (favorite , index) {

            var fileUploadControl = $("#editFavoriteFileUploader"+index)[0];

            if(fileUploadControl.files[0]){
                var parseFile = new Parse.File("fav_image_"+favorite.attributes.name , fileUploadControl.files[0]);
                parseFile.save().then(function () {
                    favorite.attributes.imageFile = parseFile;
                    parseManager.saveObject(saveFavoriteCallback, "Favorites", favorite);
                }, function (error) {

                    // TODO HANDLE ERROR

                });
            }else{
                parseManager.saveObject(saveFavoriteCallback, "Favorites", favorite);
            }


        function saveFavoriteCallback(result) {
            if(result){
                $scope.$apply();
                alertManager.succesAlert("עריכת מועדפים" , "תהליך עריכת המועדפים הושלם בהצלחה ");
            }else{
                alertManager.errorAlert("עריכת מועדפים" , "תהליך עריכת המועדפים נכשל ");
            }
        };




    };



    $scope.deleteFavorite = function (item){
        parseManager.deleteObject( deleteFavoriteCallback , item);

        function deleteFavoriteCallback ( result  , error ){
            if(result){
                var index = $scope.favorites.indexOf(item);
                $scope.favorites.splice( index , 1 );
                $scope.$apply();
                alertManager.succesAlert("Delete Favorite" , "Delete Favorite Success" );
            }else{

            }
        };
    };

    $scope.deleteSelectedItems = function(){
        if ($rootScope.selectedItems.length > 0) {
            parseManager.deleteMultipleItems(multipleFavoritesDeleteCallback, $rootScope.selectedItems);
        }

        function multipleFavoritesDeleteCallback (result){
            if(result){
                for (var i = 0; i < $rootScope.selectedItems.length; i++) {
                    var index = $scope.favorites.indexOf($rootScope.selectedItems[i]);
                    $scope.favorites.splice(index, 1);
                }
                $scope.$apply();
                $rootScope.selectedItems = [];
                alertManager.succesAlert("מחיקת פריטים נבחרים" , "מחיקת הפריטים הנבחרים שולמה בהצלחה ");
            }
        }
    };


    //*// ---------------------------------   * END * $scope  On Click Events --------------------------------------\\*\\


}]);

var badgesController = angular.module('badgesController', []);

badgesController.controller('BadgesController', ['$rootScope' , '$scope', '$http', '$routeParams' , function ($rootScope, $scope, $http, $routeParams) {
    // Getting All stack of Badges

    parseManager.getParseObjectById( getAllBadges , "Badges" , null);


    function getAllBadges (results){
        if(results){
            for (var i = 0; i < results.length; i++) {
                var objectACL = results[i].getACL();
                $rootScope.showActions[i] = objectACL.getWriteAccess(Parse.User.current().id);
            }
            $rootScope.badges = results;
            $rootScope.itemsOrder = 'attributes.title';
            $rootScope.$apply();
        }

    };


        $scope.deleteSelectedItems = function () {
            console.log("DELETEING SELECtED ITEMS");
            if ($rootScope.selectedItems.length > 0) {
                console.log('Delete ' + $rootScope.selectedItems.length + ' Items');
                parseManager.deleteMultipleItems(multipleDeleteCallback, $rootScope.selectedItems);
            }

            function multipleDeleteCallback(result) {

                for (var i = 0; i < $rootScope.selectedItems.length; i++) {
                    // After delete in Parse success - Removing elements from $scope
                    var index = $rootScope.badges.indexOf($rootScope.selectedItems[i]);
                    $rootScope.badges.splice(index, 1);
                }
                alertManager.succesAlert("מחיקת פריטים מרובים" , "מחיקת הפריטים הנבחרים הושלמה בהצלחה");
                $rootScope.$apply();
                $rootScope.selectedItems = [];
            };
        };


    $scope.saveNewBadge = function (newBadge) {

        if (!newBadge.id) {

            var fileUploadControl1 = $("#fileUploaderNormal")[0];
            var fileUploadControl2 = $("#fileUploaderExtra")[0];
            var fileUploadControl3 = $("#fileUploaderSuper")[0];


            var parseFileNormalImage = new Parse.File("badge_" + newBadge.title+"_normal", fileUploadControl1.files[0]);
            var parseFileExtraImage = new Parse.File("badge_" + newBadge.title+"_extra", fileUploadControl2.files[0]);
            var parseFileSuperImage = new Parse.File("badge_" + newBadge.title+"_super", fileUploadControl3.files[0]);

            parseFileNormalImage.save().then(function () {
                newBadge.normalBadgeImage = parseFileNormalImage;
            }, function (error) {
                console.log("FIRST FILE ERROR ", error);
                // TODO HANDLE ERROR

            });

            parseFileExtraImage.save().then(function () {
                newBadge.extraBadgeImage = parseFileExtraImage;
            }, function (error) {
                console.log("2ND FILE ERROR ", error);
                // TODO HANDLE ERROR

            });

            parseFileSuperImage.save().then(function () {
                newBadge.superBadgeImage = parseFileSuperImage;
                console.log('saving new ' , newBadge);
                parseManager.saveObject(saveNewBadgeCallback, "Badges", newBadge);
            }, function (error) {
                console.log("3RD FILE ERROR ", error);
                // TODO HANDLE ERROR

            });


            function saveNewBadgeCallback(result , error) {
                delete $scope.newBadgeModel;
                console.log(result);
                $rootScope.badges.push(result);
                $rootScope.$apply();

            };

        }


    };


    $scope.editBadge = function (badge , index) {


        var normalImageFlag = false;
        var extraImageFlag = false;
        var superImageFlag = false;


        var fileUploadControl1 = $("#editNormalFileUploader"+index)[0];
        var fileUploadControl2 = $("#editExtraFileUploader"+index)[0];
        var fileUploadControl3 = $("#editSuperFileUploader"+index)[0];


        if(fileUploadControl1.files[0]){
            var parseFileNormalImage = new Parse.File("badge_" + badge.attributes.title+"_normal", fileUploadControl1.files[0]);
            parseFileNormalImage.save().then(function () {
                badge.attributes.normalBadgeImage = parseFileNormalImage;
                normalImageFlag = true;
                if ( normalImageFlag && extraImageFlag && superImageFlag){
                    parseManager.saveObject(editBadgeCallback , "Badges" , badge);
                }
            }, function (error) {

                // TODO HANDLE ERROR

            });
        }else{
            normalImageFlag = true;
        }

        if(fileUploadControl2.files[0]){
            var parseFileExtraImage = new Parse.File("badge_" + badge.attributes.title+"_extra", fileUploadControl2.files[0]);
            parseFileExtraImage.save().then(function () {
                badge.attributes.extraBadgeImage = parseFileExtraImage;
                extraImageFlag = true;
                if ( normalImageFlag && extraImageFlag && superImageFlag){
                    parseManager.saveObject(editBadgeCallback , "Badges" , badge);
                }
            }, function (error) {

                // TODO HANDLE ERROR

            });
        }else{
            extraImageFlag = true;
        }

        if(fileUploadControl3.files[0]){
            var parseFileSuperImage = new Parse.File("badge_" + badge.attributes.title+"_super", fileUploadControl3.files[0]);
            parseFileSuperImage.save().then(function () {
                badge.attributes.superBadgeImage = parseFileSuperImage;
                superImageFlag = true;
                if ( normalImageFlag && extraImageFlag && superImageFlag){
                    parseManager.saveObject(editBadgeCallback , "Badges" , badge);
                }
            }, function (error) {

                // TODO HANDLE ERROR

            });
        }else{
            superImageFlag = true;
        }

        if ( normalImageFlag && extraImageFlag && superImageFlag){
            parseManager.saveObject(editBadgeCallback , "Badges" , badge);
        }


        function editBadgeCallback (result){
            if(result){
                $scope.$apply();
                alertManager.succesAlert( "עריכת תג" , "תהליך עריכת התג הושלם בהצלחה");
            }else{
                alertManager.errorAlert("עריכת תג" , "תהליך עריכת התג נכשל");
            }
        };
    };

    $scope.deleteBadge = function (badge){
        console.log(badge);
        parseManager.deleteObject(deleteBadgeCallback , badge);

        function deleteBadgeCallback ( result ){
            if(result){
                var index = $rootScope.badges.indexOf(badge);
                $rootScope.badges.splice(index , 1);
                $rootScope.showActions[index] = true;
                $rootScope.$apply();
                alertManager.succesAlert("Delete Badge" , "Delete Badge Success");
            }
        };
    };





}]);