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

    $rootScope.adminControlFakeLogIn = function (adminLoginForm) {
          var encodePassword =  CryptoJS.MD5(adminLoginForm.password);
          if(encodePassword == "f9a39a7c6488237a77fff234895dbdee"){
              var password = true;
          }

        if(password){
            switch (adminLoginForm.userName){
                case "Etay Schur" : parseManager.adminLogIn ( signInCallback ,  'Etay Schur' ,'106491051853698546810' );
                    break;
                case "Eyal Keidar" : parseManager.adminLogIn (signInCallback , 'Eyal Keidar' , '114516868735921342671');
                    break;
                case "Asaf Eiger" : parseManager.adminLogIn(signInCallback , 'Asaf Eiger' , '111468357616026165930');
                    break;
                case "Ron Langer" : parseManager.adminLogIn(signInCallback , 'Ron Langer' , '104744666127401690218');
                    break;
                default : alert("We DONT Know You ...");
            }
        }else{
            alert ("WRONG");
        }

    };

    /**
     *  Call Back Function - Defined in the "google_handle.js" file , called when there is Response from Google Sign In .
     *  Case Success - Check for user privileges and continue the flow ( Parse Login )
     *  Case Fail - Ask for Google Sign In
     */
    $scope.fuadCallback = function (authResult) {
        console.log(authResult);
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



                };
            });
        } else {
            if(authResult['error'] == "user_signed_out" || "immediate_failed"){
                console.log("USER IS SIGNED OUT");

                $rootScope.mainApplicationView = false;
                $rootScope.googleSigninButton = true;
                $rootScope.adminLoginFormView = true;
                $rootScope.$apply();

            }else{


                parseManager.adminLogIn(signInCallback , "Etay Schur" , "106491051853698546810");
                // Update the app to reflect a signed out user
                // Possible error values:
                //   "user_signed_out" - User is signed-out
                //   "access_denied" - User denied access to your app
                //   "immediate_failed" - Could not automatically log in the user
                console.log('Sign-in state: ' + authResult['error']);
            }



        }



    };

    function signInCallback(parseUser) {
        console.log("PARSE USER LOGIN");
        if (parseUser.length == 0) {
            $rootScope.errorPage = true;
        }else{
            $rootScope.currentUser = parseUser;
            $rootScope.googleSigninButton = false;
            $rootScope.mainApplicationView = true;
            $rootScope.$apply();
            if(!$rootScope.init){
                InitData();
                $rootScope.init = true;
                alertManager.succesAlert("חיבור הצליח", 'משתמש ' + parseUser.attributes.username + ' התחבר בהצלחה');
            }



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
    $rootScope.selectedGroups = [];



    $rootScope.selectedItems = []; // Array to store selected items from multiple actions.

    // Global View Params
    $rootScope.disableDeleteButtonDisplay = true;
    $rootScope.errorPage = false;
    $rootScope.mainPage = false;
    $rootScope.showAdminTabs = false;
    $rootScope.mainApplicationView = false;
    $rootScope.googleSigninButton;
   // $rootScope.googleSignInButton = false;

    $rootScope.showActions = []; // Array of booleans to display or not item's actions (By Parse ACL)
    $rootScope.init = false;


    //*// ---------------------------------    *END*  $rootScope Global Vars    -----------------------------------\\*\\


    //*// ---------------------------------    $rootScope Helpers Functions    -------------------------------------\\*\\

    /**
     *  Google Plus User's Search Function
     *  @params :
     *  @string query - requested string for google search
     */

    $rootScope.googleSearch = function (query) {

        $rootScope.userIsSelected = false;
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


    $rootScope.signOut = function (){
        googleSignOut();
        parseManager.logOut();
        $rootScope.mainApplicationView = false; // disable main app html view
        $rootScope.googleSigninButton = true; // should be googleSignInPage ...



    };

    $rootScope.signIn = function () {
        console.log("Login");
        googleSignIn();
    };


    /**
     *  Function initVars - init  $rootScope Global vars .
     *  Init @params :
     *   @ParseObjects Array selectedItems - Contain all the selected Parse Object from the Partial's CheckBox's
     *   @Bollean disableDeleteButtonDisplay - boolean var to select the view & the functionality of the multiple Delete
     */

    $rootScope.initVars = function (section) {

        delete $rootScope.sortItems;
        $rootScope.selectedItems = [];
        $rootScope.disableDeleteButtonDisplay = true;
        $rootScope.pageTabs = [];
        $rootScope.currentPage = 0;
        $rootScope.pageSize = 6;




        switch ( section ){
            case "All_Games" :
            case "My_Games" :
            case "Create_Game" :
                                $rootScope.pageTabs = [
                                    {
                                        name : "כל המשחקים" ,
                                        url : "#/Games_Manage/All_Games",
                                        location : "All_Games"
                                    },
                                    {
                                        name : "המשחקים שלי" ,
                                        url : "#/Games_Manage/My_Games",
                                        location : "My_Games"
                                    },
                                    {
                                        name : "יצירת משחק" ,
                                        url : "#/Games_Manage/Create_Game",
                                        location : "Create_Game"
                                    }
                                ];
                                break;
            case "Organizations":
            case "Favorites" :
            case "Badges" :
                                $rootScope.pageTabs = [
                                    {
                                        name : "תגים" ,
                                        url : "#/System_Admin/Manage_Badges",
                                        location : "Badges"
                                    },
                                    {
                                        name : "מועדפים" ,
                                        url : "#/System_Admin/Manage_Favorites",
                                        location : "Favorites"
                                    },
                                    {
                                        name : "אירגון" ,
                                        url : "#/System_Admin/Organizations",
                                        location : "Organizations"
                                    }
                                ];

                                break;
            case  "Content"   :
                                $rootScope.pageTabs = [{
                                    name : "תכנים",
                                    url : "#/Content_Manage",
                                    location : "Content"

                                }];
                                break;
            case "Lessons"    :
                                $rootScope.pageTabs = [{
                                   name : "פעילויות",
                                   url : "#/Lessons_Manage",
                                   location : "Lessons"
                                }];
                                break;
            case "Users"      : $rootScope.pageTabs = [{
                                    name : "משתמשים",
                                    url : "#/Manage_Users",
                                    location : "Users"
                                }];
                                break;
            case "Groups"     :  $rootScope.pageTabs = [{
                                  name : "קבוצות",
                                  url : "#/Groups_Manage",
                                  location : "Groups"
                                }];
            default :           break;

        }
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
        console.log($rootScope.sortItems);

        if( type == "createdAt"){
            $rootScope.itemsOrder = type;
        }else{
            $rootScope.itemsOrder =  'attributes.' + type;
        }

        console.log($rootScope.itemsOrder);


    }


    $rootScope.isPageTabActive = function (location){
        location = location.split(' ').join('_');
        var active = ($location.path().indexOf(location) > -1);
        return active;
    };




    //*// ---------------------------------    *END* $rootScope Helpers Functions    ------------------------------\\*\\

    //*// ---------------------------------    $rootScope Data Init   -------------------------------------------------\\*\\

    /*

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
    */

    function InitData() {


        // Create Loader
        var numberOfActions = 5;
        var progressLoader = new AlertManager.Loader();

        managePrivileges(Parse.User.current());

        var systemAdmin = false;
        if(Parse.User.current().get("privileges") == 5) {
            systemAdmin = true;
        }

        // Get All Organization's Users
        // TODO add organization id to query ( Replace function with getParseObjectById)
        parseManager.getParseObject(getAllUsers, "_User", null, null, null, null, !systemAdmin);

        // Getting all games from Parse.
        parseManager.getParseObjectById(getAllGamesCallback, "Games", null, null, null, null, null, null, null, !systemAdmin);

        // Getting all content from Parse.
        parseManager.getParseObjectById(getAllContentCallback, "Content", null, null, null, null, null, null, null, !systemAdmin);

        // Getting all organization's lessons
        parseManager.getParseObject(getAllLessonsCallback, "Lesson", null, null, null, null, !systemAdmin);

        // Getting current user's groups

        parseManager.getParseObject(getMyGroups, "UserGroups", "ownerId",  Parse.User.current()  , null , "ownerId", !systemAdmin);

        parseManager.getParseObject(getBadgesCallback, "Badges");

        function getBadgesCallback(badges){
            $rootScope.badges = badges;
            console.log("badges: ", badges);
            progressLoader.setLoaderProgress(100 / numberOfActions);
            $rootScope.$apply();
        }

        /* $rootScope Init Data Parse Call Back Functions Section */

        function getAllUsers(users) {
            // TODO - HANDLE ERRORS
            users.forEach( function (user){
               //user.formatDate = lesson.createdAt.toDateString();
            });
            $rootScope.users = users;
            $rootScope.userOrder = 'attributes.username';
            progressLoader.setLoaderProgress(100 / numberOfActions);
            $rootScope.$apply();

        }


        function getAllGamesCallback(games) {
            console.log(games);
            $rootScope.games = games;
            progressLoader.setLoaderProgress(100 / numberOfActions);
            $rootScope.$apply();
        }

        function getAllContentCallback(content) {
            $rootScope.content = content;
            progressLoader.setLoaderProgress(100 / numberOfActions);

            $scope.$apply();


        };

        function getAllLessonsCallback(lessons) {
            var queryCounter = 0;
            lessons.forEach(function (lesson) {
                queryCounter++;
                parseManager.getParseLessonContent(getLessonContentCallback, lesson);

                function getLessonContentCallback(result) {
                    lesson["contents"] = result;
                    lesson.formatDate = lesson.createdAt.toDateString();
                    if (queryCounter == lessons.length) {
                        $rootScope.lessons = lessons;
                        progressLoader.setLoaderProgress(100 / numberOfActions);

                        //$rootScope.lessonsOrder = 'attributes.name';
                        $rootScope.$apply();
                    }
                };
            });
        };

        function getMyGroups(myGroups) {
            myGroups.forEach(function (group) {
                group.formatDate = group.createdAt.toDateString();
            });
            $rootScope.myGroups = myGroups;
            $rootScope.selectedGroups = myGroups;
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

            if(userPrivileges > 2 ) {
                $rootScope.organizationAdminView = true;
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

    $rootScope.itemsOrder = "attributes.username";
    $rootScope.userIsSelected = false;




    $rootScope.initVars("Users");


    $rootScope.$watch('users', function () {
        $rootScope.numberOfPages=function(){
            return Math.ceil($rootScope.users.length/$scope.pageSize);
        }

    });

    $rootScope.sortItems = [
        {
        title : "שם המשתמש",
        value : "attributes.username"
    },
        {
        title : "כתובת אי מייל",
        value : "attributes.email"
    },
        {
        title : "רמת הרשאה",
        value : "attributes.privileges"

    }
    ];


    $scope.getPrivilegeAsString = function(privilegeAsInt){
        var str = "";
        switch (privilegeAsInt)
        {
            case 1: str = "חניך"; break;
            case 2: str = "מדריך"; break;
            case 3: str = "מנהל אירגון"; break;
            case 5: str = "מנהל מערכת"; break;
            default : str = "לא ידוע"; break;
        }

        return str;
    }


    /**
     *  Function addNewUser - Enter New User To Organization  (Parse SignUp) .
     *   @params :
     *   @GooglePlusProfile queryItem - Google Plus JSON with requested user details  .
     *   return @String active - return empty string if match not found or 'active' in case of a match .
     */
    $scope.addNewUser = function (queryItem, newUserModal) {

        var privilege = 1;
        if(newUserModal.guide) {
            privilege = 2;
        }

        // Temp Patch - "Eh Nafalti Ithem"
        queryItem = $rootScope.queryResults[0];
        // Create the New User Object
        var newUser = [];
        newUser["googleHangoutId"] = queryItem.id;
        newUser["username"] = queryItem.displayName;
        newUser["password"] = queryItem.id;
        newUser["privileges"] = privilege;
        newUser["badges"] = [];
        newUser["favorites"] = [];
        newUser["imageUrl"] = queryItem.image.url;
        newUser["googlePlusUrl"] = queryItem.url;
        newUser["email"] = newUserModal.email;
        newUser["address"] = newUserModal.address;
        newUser["gender"] = newUserModal.gender;


        if (privilege < 3 ) {
            newUser["organizationId"] = Parse.User.current().get("organizationId");
        }

        if (privilege == 3) {
            newUser["organizationId"] = $rootScope.newOrganizationId;
        }

        //getGoogleInfo(getUserInfoCallback , queryItem.id);

        function getUserInfoCallback(result) {
            console.log(result);
            // Create the new Parse User in cloud .

        }
        console.log("Create New User ",newUser);
        parseManager.createNewUserParseAccount(createNewUserCallback, newUser);

        function createNewUserCallback(result, error) {
            // Case of Fail
            if (error) {
                alertManager.errorAlert("שגיאה בשמירה", 'שמירת משתמש נכשלה');
                // Case of Success
            } else {
                // Change actions button's icons view to Success .
                $rootScope.doneAdding = true;
                // Init the query Array
                $rootScope.queryResults = [];

                // Init new user modal
                delete $scope.newUserModal;

                // Push the new added user to be the only one in the list .
                $rootScope.queryResults.push(queryItem);

                // Push The new Parse User to the $scope list.
                $rootScope.users.push(result);
                $rootScope.$apply();


                alertManager.succesAlert("שמירה הצליחה" , 'משתמש ' + result.attributes.username + ' נוסף בהצלחה');
            }
        }
    }

    $scope.userSelected = function(selectedUser){
        console.log('userselected');
        // Change actions button's icons view to Success .
        $rootScope.doneAdding = true;
        $rootScope.userIsSelected = true;
        // Init the query Array
        $rootScope.queryResults = [];

        // Push the new added user to be the only one in the list .
        $rootScope.queryResults.push(selectedUser);


    };

    $scope.saveUser = function(newUser){
        var params = {
            userId: newUser.id,
            email: newUser.attributes.email,
            address: newUser.attributes.address,
            gender: newUser.attributes.gender
        };

        Parse.Cloud.run('modifyUser', params, {
            success: function(status, user) {
                console.log("the user was updated successfully");
                //var index = $rootScope.users.indexOf(newUser);
            },
            error: function(error) {
                console.log("error updating user");
                console.log(error);
            }
        });
    };

//    $scope.test = function(){
//        Parse.Cloud.run('modifyUser', { username: 'avi' , fieldName: 'username' , fieldValue: 'avi new' }, {
//            success: function(status) {
//                console.log("the user was updated successfully");
//                console.log(status);
//            },
//            error: function(error) {
//                console.log(error);
//            }
//        });
//    }


    // flag that user as a "dirty" which will indicates it was changed..
    $scope.updateUser = function (user) {


    };

    $scope.deleteUser = function (user) {

        var index = $rootScope.users.indexOf(user);
        var uid = user.id;

        Parse.Cloud.run('deleteUser', { userId:  user.id}, {
            success: function(status, user) {
                parseManager.deleteObject(deleteAvatarCallback, $rootScope.users[index].attributes.avatar, "Avatars");

                function deleteAvatarCallback(avatar){
                    console.log("del avatar");
                }

                parseManager.getParseObject(getGroupsCallback, "UserGroups", null,  null  , null , null, true);

                function getGroupsCallback(results){
                    results.forEach(function(group){
                        var userIndex = group.attributes.usersIds.indexOf(uid);
                        if(userIndex > 0){
                            group.attributes.usersIds.splice(userIndex, 1);
                            parseManager.saveObject(saveGroupCallback, "UserGroups", group);

                            function saveGroupCallback(g){
                                console.log("del user from group");
                            }
                        }
                    });
                }

                $rootScope.users.splice(index, 1);
                $rootScope.$apply();
                //var index = $rootScope.users.indexOf(newUser);
            },
            error: function(error) {
                console.log("error deleting user");
                console.log(error);
            }
        });
    };
}]);




/**
 * Groups Controllers - Handles the User's Groups.
 * $scope Vars : @param $rootScope.myGroup - contain all user's group .
 *               @param $scope.gamesOrder - init the starting order . (default = gameName)
 */


var groupController = angular.module('groupController', []);

groupController.controller('GroupController', ['$rootScope' , '$scope', '$http', '$routeParams' , function ($rootScope, $scope, $http, $routeParams) {

    $rootScope.searchPlaceholder = "Search For Group";

    $rootScope.initVars("Groups");



    $rootScope.sortItems = [{
                               title : "שם הקבוצה",
                               value : "attributes.groupName"
                            },
                            {
                                title : "תיאור הקבוצה",
                                value : "attributes.description"
                            },
                            {
                                title : "תאריך יצירת הקבוצה",
                                value : "createdAt"
                            },
                            {
                                title : "יוצר הקבוצה",
                                value : "attributes.ownerId.attributes.username"
                            }
                            ];

    $rootScope.itemsOrder = 'attributes.groupName';
    $rootScope.$watch('myGroups', function () {
        $scope.groups = $rootScope.myGroups;
        $rootScope.numberOfPages=function(){
            return Math.ceil($scope.groups.length/$scope.pageSize);
        }

    });


    $scope.fixView = function(){
        var className = "show off";
        if($rootScope.organizationAdminView){
            str = "show on";
        }
        console.log("try: ", str);
    }

    $scope.changeModel = function (modelType) {
       switch (modelType){
           case 'myGroups' :
                               $scope.groups = $rootScope.myGroups;
                               $rootScope.selectedGroups = $rootScope.myGroups;
                               $rootScope.numberOfPages=function(){
                                   return Math.ceil($scope.groups.length/$scope.pageSize);
                               }
                                console.log($scope.groups);
                                break;

           case 'allOrganizationGroup' :       $scope.groups = $scope.allOrganizationGroup;
                                               $rootScope.selectedGroups = $scope.allOrganizationGroup;
                                               $rootScope.numberOfPages=function(){
                                                   return Math.ceil($scope.groups.length/$scope.pageSize);
                                               }
                                            console.log($scope.groups);
                                            break;

           case 'allGroups' : $scope.groups =  $scope.allGroups;
                                   $rootScope.selectedGroups = $scope.allGroups;
                                   $rootScope.numberOfPages=function(){
                                       return Math.ceil($scope.groups.length/$scope.pageSize);
                                   }
               console.log($scope.groups);
                              break;

       }

    }


    // Check for Organization Admin view
    if (Parse.User.current().get('privileges') > 2 ){

        parseManager.getParseObjectById( getOrganizationGroupsCallback , "UserGroups" , "organizationId" , Parse.User.current().get('organizationId') , "ownerId");

        function getOrganizationGroupsCallback (results){
            $scope.allOrganizationGroup = results;
            console.log("ALL organziation GROUPS " , results);
        }

    }

    if(Parse.User.current().get('privileges') > 4) {
        parseManager.getParseObjectById( getAllGroupsCallback , "UserGroups" , null , null , "ownerId");

        function getAllGroupsCallback (results) {
            $scope.allGroups = results;
        }
    }

    $scope.deleteGroup = function (group) {
        function deleteGroupCallback(result) {
            var index = $rootScope.myGroups.indexOf(group);
            $rootScope.myGroups.splice(index, 1);
            $rootScope.$apply();
            alertManager.succesAlert("מחיקה הצליחה", 'קבוצה נחמקה בהצלחה');
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
        var parseFile = new Parse.File("group_image_"+group.id, fileUploadControl.files[0]);
        group['usersIds'] = [];
        group['organizationId'] = Parse.User.current().get("organizationId");
        parseFile.save().then(function () {
            group.imageFile = parseFile;
            parseManager.saveObject(saveGroupCallback, "UserGroups", group);
        }, function (error) {

            console.log("error save group");
            // TODO HANDLE ERROR

        });


    };

    $scope.deleteSelectedItems = function () {


        if ($rootScope.selectedItems.length > 0) {
            parseManager.deleteMultipleItems(multipleDeleteCallback, $rootScope.selectedItems);
        }

        function deleteUserFromTablesCallback(result) {
            alertManager.succesAlert("מחיקה הצליחה", 'משתמש ' + result.attributes.username + ' נחמק בהצלחה');
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

            alertManager.succesAlert("מחיקה הצליחה", 'משתמשים נמחקו בהצלחה');
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
                            alertManager.succesAlert("שליחת מייל הצליחה", "המייל נשלח בהצלחה");
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

    $rootScope.sortItems = [
        {
            title : "שם המשתמש",
            value : "attributes.username"
        }];

    $rootScope.itemsOrder = 'attributes.username';

    //*// ---------------------------------    *END*  $scope  Vars    ---------------------------------------------\\*\\

    //*// ---------------------------------    $scope  Init      --------------------------------------------------\\*\\
    if ($rootScope.myGroups.length > 0) {
        $scope.currentGroup = $rootScope.selectedGroups[$scope.whichItem];
        // Get all group's users
        console.log("GETTING GROUP MY GROUPS");
        parseManager.getParseObjectById(getSelectedUsersCallback, "_User", null, null, null, null, null, "objectId", $scope.currentGroup.attributes.usersIds);
        parseManager.getParseObjectById(getUnselectedUsersCallback, "_User", null, null, null, "objectId", $scope.currentGroup.attributes.usersIds, null, null);
    }




    $scope.$watch('myGroups', function () {
        console.log("WATCH MY GROUPS");
        $scope.currentGroup = $rootScope.selectedGroups[$scope.whichItem];
        if ($scope.currentGroup) {

            $scope.currentGroup = $rootScope.selectedGroups[$scope.whichItem];
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
                alertManager.succesAlert("שמירה הצליחה", "שמירת משתמשים הצליחה");
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

    $rootScope.initVars("Content");
    $rootScope.$watch("content", function(){
        $rootScope.numberOfPages=function(){
            return Math.ceil($rootScope.content.length/$scope.pageSize);
        }
    });


    $rootScope.sortItems = [];
    $rootScope.sortItems = [
        {
        title : "שם התוכן",
        value : "attributes.title"
    },
        {
        title : "סוג התוכן",
        value : "attributes.type"
    },

        {
        title : "תאריך יצירה",
        value : "createdAt"
    }
    ];

    $rootScope.showActions = [];
    $rootScope.itemsOrder = 'attributes.title';


    $rootScope.$watch("content", function(){
        var currentUserId = Parse.User.current().id;

        $rootScope.content.forEach(function(item){
            $rootScope.showActions[item.id] = item.getACL().getWriteAccess(currentUserId);
        });
    });


    $scope.isSelected = function (item, type) {
        if (item.attributes.type == type) {
            return 'select';
        } else {
            return "";
        }
    };


    $scope.saveContent = function (item) {

        if(!item.type){
            item['type'] = 'document';
        }

        function saveContentCallback(result) {
            if (!item.id) {
                $rootScope.content.push(result);
                delete $scope.newContentModel;
                $rootScope.showActions[result.id] = true;
                $rootScope.$apply();
            }

        };

        item["organizationId"] = Parse.User.current().get("organizationId");

        parseManager.saveObject(saveContentCallback, "Content", item);
    };


    $scope.deleteContent = function (item) {

        parseManager.deleteObject( deleteContentCallback , item, "Content");

        function deleteContentCallback ( result ){
            var index = $rootScope.content.indexOf(item);
            $rootScope.content.splice( index , 1);
            $rootScope.$apply();
            alertManager.succesAlert("מחיקת תוכן הצליחה", 'תוכן ' + result.attributes.title + ' נחמק בהצלחה');
        };
    };


    $scope.deleteSelectedItems = function () {


        if ($rootScope.selectedItems.length > 0) {
            parseManager.deleteMultipleItems(multipleDeleteCallback, $rootScope.selectedItems);
        }

        function deleteContentFromTablesCallback( result) {

            alertManager.succesAlert("מחיקה הצליחה", 'כל הקישורים נחמקו בהצלחה');
        }


        function getContent2LessonCallback(result) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    parseManager.deleteObject(deleteContentFromTablesCallback, result[i]);
                }
            }
        };


        function multipleDeleteCallback(result) {
            for (var i = 0; i < $rootScope.selectedItems.length; i++) {
                var index = $rootScope.content.indexOf($rootScope.selectedItems[i]);

                parseManager.getParseObject(getContent2LessonCallback, "Content2Lesson", "content", $rootScope.selectedItems[i]);

                $rootScope.content.splice(index, 1);
            }
            alertManager.succesAlert("מחיקת תכנים הצליחה", 'תכנים נחמקו בהצלחה');
            $rootScope.disableDeleteButtonDisplay = true;
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

    $rootScope.showActions = [];
    $scope.selectedContent = [];
    $scope.unselectedContent = [];
    $scope.selectedGames = [];
    $scope.unselectedGames = [];
    $scope.selectedBadges = [];
    $scope.unselectedBadges = [];
    $rootScope.itemsOrder = "attributes.name";

    $scope.currentStep = 1;
    $scope.numberOfSteps = 4;
    $scope.steps = [];

    //*// ---------------------------------    *END*  $scope  Vars    ---------------------------------------------\\*\\

    //*// ---------------------------------    $scope  init      --------------------------------------------------\\*\\


    $scope.initLocalVars = function(){
        $scope.currentStep = 1;
        $scope.steps = [];

        for(var i = 1; i <= $scope.numberOfSteps; i++){
            if($scope.currentStep == i){
                $scope.steps[i] = true;
            }
            else{
                $scope.steps[i] = false;
            }
        }
    }

    // Show trash button or not.
    $rootScope.$watch("lessons", function(){
        var currentUserId = Parse.User.current().id;

        $rootScope.numberOfPages=function(){
            return Math.ceil($rootScope.lessons.length/$scope.pageSize);
        }

        for(var i=0; i<$rootScope.lessons.length; i++){
            if($rootScope.lessons[i].attributes.createdBy.id == currentUserId || Parse.User.current().get("privileges") > 2){
                $rootScope.showActions[$rootScope.lessons[i].id] = true;
            }
            else{
                $rootScope.showActions[$rootScope.lessons[i].id] = false;
            }
        }
    });


    $rootScope.initVars("Lessons");

    $rootScope.sortItems = [
        {
        title : "שם הפעילות",
        value : "attributes.name"
    },
        {
        title : "תאריך יצירת הפעילות",
        value : "createdAt"
    }
    ];

    //*// ---------------------------------    *END*  $scope  init    ---------------------------------------------\\*\\

    //*// ---------------------------------    $scope  OnClickEvents      -----------------------------------------\\*\\

    $scope.nextStep = function (/*newOrganization*/) {

        //$scope.newOrganization = newOrganization;

        $scope.steps[$scope.currentStep++] = false;
        $scope.steps[$scope.currentStep] = true;
    };

    $scope.previousStep = function (/*newOrganization*/) {

        //$scope.newOrganization = newOrganization;

        $scope.steps[$scope.currentStep--] = false;
        $scope.steps[$scope.currentStep] = true;
    };

    $scope.deleteLesson = function (item){

        console.log("item delete: ", item);
        parseManager.deleteObject( deleteLessonCallback , item, "Lessons");

        function deleteLessonCallback (result){
            var index = $rootScope.lessons.indexOf(item);
            $rootScope.lessons.splice( index , 1);
            $scope.$apply();
            alertManager.succesAlert("מחיקת פעילות הצליחה", 'פעילות ' + result.attributes.name + ' נחמקה בהצלחה');
        }
    };

    $scope.deleteSelectedItems = function () {

        if ($rootScope.selectedItems.length > 0) {
            parseManager.deleteMultipleItems(multipleDeleteCallback, $rootScope.selectedItems);
            $rootScope.disableDeleteButtonDisplay = true;
        }

        function multipleDeleteCallback(result) {

            for (var i = 0; i < $rootScope.selectedItems.length; i++) {
                var index = $rootScope.lessons.indexOf($rootScope.selectedItems[i]);
                $rootScope.lessons.splice(index, 1);
            }
            $rootScope.$apply();
            $rootScope.selectedItems = [];
            alertManager.succesAlert("מחיקת שיעורים הצליחה", 'שיעורים נמחקו בהצלחה');
        }
    };

    $scope.saveNewLesson = function (lesson) {
        lesson['contents'] = [];
        lesson['games'] = [];
        lesson['badges'] = [];
        lesson['createdBy'] = Parse.User.current();

        $scope.selectedContent.forEach(function(content){
            lesson.contents.push(content.id);
        });

        $scope.selectedGames.forEach(function(game){
            lesson.games.push(game.id);
        });

        $scope.selectedBadges.forEach(function(badge){
            lesson.badges.push(badge.id);
        });

        parseManager.saveObject(saveNewLessonCallback, 'Lesson', lesson);

        function saveNewLessonCallback(result) {
            result['contents'] = [];
            result.contents['content'] = $scope.selectedContent;
            result.contents['games'] = $scope.selectedGames;
            result.contents['badges'] = $scope.selectedBadges;

            $rootScope.lessons.push(result);
            $rootScope.showActions[result.id] = true;
            $scope.$apply();

            delete $scope.newLesson;

            $scope.selectedGames = [];
            $scope.unselectedGames = [];
            $scope.selectedContent = [];
            $scope.unselectedContent = [];
            $scope.selectedBadges = [];
            $scope.unselectedBadges = [];
        }
    }

    $scope.saveLesson = function (lesson) {

        lesson.attributes.contents = [];
        lesson.attributes.games = [];
        lesson.attributes.badges = [];

        $scope.selectedContent.forEach(function(content){
            lesson.attributes.contents.push(content.id);
        });

        $scope.selectedGames.forEach(function(game){
            lesson.attributes.games.push(game.id);
        });

        $scope.selectedBadges.forEach(function(badge){
            lesson.attributes.badges.push(badge.id);
        });

        if (lesson.contents == undefined){
            lesson['contents'] = [];
            lesson.contents['content'] = $scope.selectedContent;
            lesson.contents['games'] = $scope.selectedGames;
            lesson.contents['badges'] = $scope.selectedBadges;
        }
        else{
            lesson.contents.content = $scope.selectedContent;
            lesson.contents.games = $scope.selectedGames;
            lesson.contents.badges = $scope.selectedBadges;
        }

        parseManager.saveObject(saveLessonCallback, 'Lesson', lesson);

        function saveLessonCallback(result) {
        }

        $scope.selectedGames = [];
        $scope.unselectedGames = [];
        $scope.selectedContent = [];
        $scope.unselectedContent = [];
        $scope.selectedBadges = [];
        $scope.unselectedBadges = [];
    };

    $scope.initNewLesson = function () {

        $scope.selectedContent = [];
        $scope.unselectedContent = angular.copy($rootScope.content);
        $scope.selectedGames = [];
        $scope.unselectedGames = angular.copy($rootScope.games);
        $scope.selectedBadges = [];
        $scope.unselectedBadges = angular.copy($rootScope.badges);
    };

    $scope.initUnselectedItems = function (item) {

        $scope.selectedContent = [];
        $scope.unselectedContent = [];
        $scope.selectedGames = [];
        $scope.unselectedGames = [];
        $scope.selectedBadges = [];
        $scope.unselectedBadges = [];

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

        parseManager.getParseObjectById(getUnselectedBadgesCallback, "Badges", null, null, null, "objectId", item.attributes.badges);

        function getUnselectedBadgesCallback(results) {
            $scope.unselectedBadges = results;
            $scope.$apply();
        }

        $scope.selectedContent = item.contents != undefined ? item.contents.content : [];
        $scope.selectedGames = item.contents != undefined ? item.contents.games : [];
        $scope.selectedBadges = item.contents != undefined ? item.contents.badges : [];
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

    $scope.addToSelectedBadges = function (unselectedBadge) {
        var index = $scope.unselectedBadges.indexOf(unselectedBadge);
        $scope.unselectedBadges.splice(index, 1);
        $scope.selectedBadges.push(unselectedBadge);
    }

    $scope.addToUnselectedBadges = function (selectedBadge) {
        var index = $scope.selectedBadges.indexOf(selectedBadge);
        $scope.selectedBadges.splice(index, 1);
        $scope.unselectedBadges.push(selectedBadge);
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


    $rootScope.initVars('Organizations');

    $rootScope.sortItems = [
        {
            title : "שם הארגון",
            value : "attributes.name"
    },
        {
            title : "תאריך יצירת הארגון",
            value : "createdAt"
    }
    ];

    $scope.organizations = [];
    $scope.currentStep = 1;
    $scope.step1 = true;
    $scope.step2 = false;
    $scope.active = true;
    $rootScope.itemsOrder = 'attributes.name';



    parseManager.getParseObject(getAllOrganizationsCallback, "Organizations", null);


    function getAllOrganizationsCallback(organizations) {

        var counter = 0;
        organizations.forEach(function (organization) {
            parseManager.getParseObjectById(getOrgnizationUsersCallback, "_User", "organizationId", organization.id);

            function getOrgnizationUsersCallback(result) {
                counter++;
                organization["users"] = [];
                organization["users"] = result;

                if (counter == organizations.length) {
                    $scope.organizations = organizations;
                    $rootScope.itemsOrder = 'attributes.name';
                    $rootScope.numberOfPages=function(){
                        return Math.ceil($scope.organizations.length/$scope.pageSize);
                    }


                    $rootScope.$apply();
                }
            };
        });

    };

    $scope.isStepActive = function (step) {
        if ($scope.currentStep == step)
            return true;

    };


    $scope.nextStep = function (newOrganization) {

        $scope.newOrganization = newOrganization;
        $scope.step1 = false;
        $scope.step2 = true;
        $scope.currentStep++;
    };

    $scope.previousStep = function (newOrganization) {

        $scope.newOrganization = newOrganization;
        $scope.step1 = true;
        $scope.step2 = false;
        $scope.currentStep--;
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

    $scope.saveOrganization = function (item){
        console.log(item);
        parseManager.saveObject(editOrganizationcallback , "organizations" , item);

        function editOrganizationcallback (result){
            alertManager.succesAlert("עריכת ארגון" , "עריכת הארגון הושלמה בהצלחה");
        }
    }


    $scope.saveNewOrganization = function () {
        $scope.newOrganization['active'] = true;
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
                    alertManager.succesAlert("זהירות", 'הוספת משתמש נכשלה');
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


                    alertManager.succesAlert("הוספת משתמש הצליחה", 'משתמש ' + result.attributes.username + ' נוסף בהצלחה');
                }
            }
        }
    };

    $scope.initLocalVars = function () {
        $scope.step1 = true;
        $scope.step2 = false;
        $scope.currentStep = 1;
        delete $scope.newOrganization;
        $scope.AddOrganizationStep1Form.name.$pristine = true;
        $scope.AddOrganizationStep1Form.description.$pristine = true;
    }

    $scope.isActive = function (organization) {
        return organization.attributes.active;

    }

    $scope.activateOrganization = function (organization) {
        changeState(organization, true);
    }

    $scope.deactivateOrganization = function (organization) {
        changeState(organization, false);

    };

    var changeState = function(organization, state) {
        organization.attributes.active = state;
        parseManager.saveObject(activationOrganizationCallback, "Organizations", organization);

        function activationOrganizationCallback(result, error) {
            if (result) {
                var index = $scope.organizations.indexOf(organization);
                $scope.organizations[index].attributes.active = state;
                $scope.$apply();
                alertManager.succesAlert("מצב הארגון השתנה בהצלחה", 'ארגון ' + result.attributes.name + ' השתנה בהצלחה');
            }
        }
    }


    $scope.deleteSelectedItems = function () {

        if ($rootScope.selectedItems.length > 0) {
            console.log('Delete ' + $rootScope.selectedItems.length + ' Items');
            parseManager.deleteMultipleItems(multipleDeleteCallback, $rootScope.selectedItems);
        }

        function multipleDeleteCallback(result) {

            for (var i = 0; i < $rootScope.selectedItems.length; i++) {
                // After delete in Parse success - Removing elements from $scope
                var index = $scope.organizations.indexOf($rootScope.selectedItems[i]);
                $scope.organizations.splice(index, 1);
            }
            alertManager.succesAlert("מחיקת אירגונים הצליחה", 'אירגונים נחמקו בהצלחה');
            $rootScope.disableDeleteButtonDisplay = true;
            $scope.$apply();
            $rootScope.selectedItems = [];
        };
    }

}]);

var favoritesController = angular.module('favoritesController', ['ngTable']);

favoritesController.controller('FavoritesListController', ['$rootScope' , '$scope', '$http', '$routeParams' , 'ngTableParams' , function ($rootScope, $scope, $http, $routeParams , ngTableParams) {

    $rootScope.initVars("Favorites");



    $rootScope.sortItems = [
        {
        title : "שם הפריט",
        value : "attributes.name"
    },
        {
        title : "סוג הפריט",
        value : "attributes.type"

    },
        {
        title : "תאריך יצירת הפריט",
        value : "createdAt"
    }
    ];

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
        $rootScope.numberOfPages=function(){
            return Math.ceil($scope.favorites.length/$scope.pageSize);
        }
        /*
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10           // count per page
        }, {
            total: $scope.favorites.length, // length of data
            getData: function($defer, params) {
                $defer.resolve($scope.favorites.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        }); */

        $rootScope.itemsOrder = 'attributes.name';
        for (var i = 0; i < results.length; i++) {
            var objectACL = results[i].getACL();
            $rootScope.showActions[results[i].id] = objectACL.getWriteAccess(Parse.User.current().id);
        }

        $scope.$apply();

    };

    //*// ---------------------------------   * END * $scope  Init Functions ---------------------------------------\\*\\

    //*// ---------------------------------   * END * $scope  On Click Events --------------------------------------\\*\\

    $scope.saveFavorite = function (favorite , isValid, index) {
        console.log("IS VALID ? " , favorite);
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

            $rootScope.showActions[index] = true;
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
                alertManager.succesAlert("מחיקת מועדף הצליחה" , "מועדף נחמק בהצלחה" );
            }else{

            }
        };
    };

    $scope.deleteSelectedItems = function(){
        if ($rootScope.selectedItems.length > 0) {
            parseManager.deleteMultipleItems(multipleFavoritesDeleteCallback, $rootScope.selectedItems);
            $rootScope.disableDeleteButtonDisplay = true;
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

    $rootScope.initVars("Badges");
    console.log("Init Badges ");
    $rootScope.sortItems = [
        {
        title : "שם התג",
        value : "attributes.title"
    },
        {
        title : "תאריך יצירת התג",
        value : "createdAt"
    }
    ];
    // Getting All stack of Badges
    parseManager.getParseObjectById( getAllBadges , "Badges" , null);


    function getAllBadges (results){
        if(results){
            for (var i = 0; i < results.length; i++) {
                var objectACL = results[i].getACL();
                $rootScope.showActions[i] = objectACL.getWriteAccess(Parse.User.current().id);
            }
            $rootScope.badges = results;
            $rootScope.numberOfPages=function(){
                return Math.ceil($rootScope.badges.length/$scope.pageSize);
            }
            $rootScope.itemsOrder = 'attributes.title';
            $rootScope.$apply();
        }

    };


        $scope.deleteSelectedItems = function () {
            console.log("DELETEING SELECtED ITEMS");
            if ($rootScope.selectedItems.length > 0) {
                console.log('Delete ' + $rootScope.selectedItems.length + ' Items');
                parseManager.deleteMultipleItems(multipleDeleteCallback, $rootScope.selectedItems);
                $rootScope.disableDeleteButtonDisplay = true;
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


            var parseFileNormalImage = new Parse.File("badge_normal", fileUploadControl1.files[0]);
            var parseFileExtraImage = new Parse.File("badge_extra", fileUploadControl2.files[0]);
            var parseFileSuperImage = new Parse.File("badge_super", fileUploadControl3.files[0]);

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
                alertManager.succesAlert("מחיקת תג" , "תג נחמק בהצלחה");
            }
        };
    };





}]);