Parse.initialize("hCiKNPSGy9q5iT40j0d9DAiLHpavkJMWxmsC15tS", "TmiPKzW632NWSIkuBB0Yj4HzYR4sJTba04k3iA8F");

var GLOBAL_PREFIX = ""; //  -> "//obscure-reaches-3647.herokuapp.com/"

// Local paths
var LOCAL_BADGE_PATH = "assets/images/badges/";
var LOCAL_AVATAR_PATH = "assets/images/avatarImages/";
var LOCAL_FULL_AVATAR_PATH = "assets/images/fullAvatarImages/";
var LOCAL_FAVORITES_PATH = "assets/images/myZonePage/";

/**
 * Signup function for new users
 */
function signUp (callback, username, password, email, gender)
{
    var user = new Parse.User();
    var avatarObject = Parse.Object.extend("Avatars");
    var avatar = new avatarObject();

    // Setting the new user credentials
    user.set("username", username);
    user.set("password", password);
    user.set("email", email);

    user.set("privileges", 1); // 1 Is for normal user 2 is for admin
    user.set("isOnline", true); // Setting the user as online
    user.set("gender", gender); // Setting the user gender
    user.set("badges", new Array()); // Setting an empty array of badges for the new user
    user.set("favorites", new Array()); // Setting an empty array of favorites for the new user.
    avatar.set("achievements", new Array()); // Setting an empty array of achievements for the new user avatar

    avatar.save().then(
        function (avatar) {
            user.set("avatar",avatar);
            user.signUp(null, {
                success: function(user) {
                    callback(true);
                },
                error: function(user, error) {
                    console.log("Signup error: " + error.description);
                }
            });
        }
    );
}

/**
* Logs out the current user
*/
function logout () {
  Parse.User.current().set("isOnline", false, null); // Setting the user as logged off in the DB
  Parse.User.current().save().then(
            function(arg) {
              console.log('User logged off.');
            },
            function(error) {
              console.log('Could not log off, with error: ' + error.description);
            }
  );

  Parse.User.logOut(); // Logging out the current user from the session
}

/**
* Adding the new given achievement to the current user
*/
function addAchievementToUser(achievement, user) {
  var achievementArray = new Array();
  var usersTable = Parse.Object.extend("_User");
  var query = new Parse.Query(usersTable);
  
  query.include("avatar");
  query.get(Parse.User.current().id).then(
              function (parseUser) {
                achievementArray = parseUser.get("avatar").get("achievements"); // Getting the current extras
                achievementArray.push(achievement); // Adding the new achievement
                parseUser.get("avatar").set("achievements", achievementArray);
                parseUser.get("avatar").save(); // Saving the new updated avatar
              },
              function (error) {
                console.log("Could not save achievement, error: " + error.description);
  });
}

/**
* Adding new badge to the given user
*/
function addBagdeToUser (badge, user) {
  var badgesArray = new Array();
  badgesArray = user.getBadges();
  badgesArray.push(badge); // This will add the badge to the local user object

  Parse.User.current().set("badges", badgesArray, null);
  Parse.User.current().save().then(
            function(badge) {
              console.log('Badge was added');
            },
            function(error) {
              console.log('Badge was not added, with error code: ' + error.description);
            }
  );
}

/**
 * add new favorite to DB
 * on the callback you receive the favoriteId to add to the user...
 */
function createNewFavorite(callback, type, path, name)
{
    var Favorite = Parse.Object.extend("Favorites");
    var favorite = new Favorite();

    favorite.set("type", type);
    favorite.set("path", path);
    favorite.set("name", name);


    favorite.save(null,
        {
            success: function() {
                callback(favorite.id);
            },
            error: function(favorite, error) {
                callback(undefined, error);
            }
        });
}

/**
 * Adding multiple favorites to user - by favorites Ids.
 */
function addFavoritesToUser(callback, favoritesIds, user){
    favoritesIds.forEach(function (favoriteId){
        user.add("favorites", favoriteId);
    });

    user.save(null,
        {
            success: function() {
                callback(true);
            },
            error: function(user, error) {
                callback(false, error);
            }
        });
}

/**
 * Adding one favorite to user - by favorite Id.
 */
function addFavoriteToUser(callback, favoriteId, user)
{
    user.add("favorites", favoriteId);

    user.save(null,
        {
        success: function() {
            callback(true);
        },
        error: function(user, error) {
            callback(false, error);
        }
    });
}

/**
 * Delete ALL the favorites of the parse user.
 */
function deleteUserFavorites(callback, user)
{
    var array = [];

    user.set("favorites", array);

    user.save(null,
        {
            success: function() {
                callback(true);
            },
            error: function(user, error) {
                callback(false, error);
            }
        });
}

/**
 * get array of arrays with user favorites.
 * ex: [food: Array[2], music: Array[3]]
 */
function getUserFavorites(callback, user)
{
    var counter = 0;
    var resultsArray = [];
    var favoritesArray = user.get("favorites");

    favoritesArray.forEach(
        function(item){
            getParseObjectById(getFavoriteCallback, "Favorites", "objectId", item);

        });

    function getFavoriteCallback(result){
        counter++;
        if (result){
            result.attributes.path = GLOBAL_PREFIX + LOCAL_FAVORITES_PATH + result.attributes.path;
            result.attributes.favoriteId = result.id;
            if (resultsArray[result.attributes.type]== undefined){
                resultsArray[result.attributes.type] = [];
            }
            resultsArray[result.attributes.type].push(result.attributes);
        }

        if (counter >= favoritesArray.length){
            callback(resultsArray);
        }
    }
}

function getUserBadges(callback, user)
{
    var counter = 0;
    var resultsArray = [];
    var badgesArray = user.get("badges");

    badgesArray.forEach(
        function(item){
            getParseObjectById(getBadgesCallback, "Badges", "objectId", item);
        });

    function getBadgesCallback(result){
        counter++;
        if (result){
            result.attributes.path = GLOBAL_PREFIX + LOCAL_BADGE_PATH + result.attributes.path;
            resultsArray.push(result);
        }

        if (counter >= badgesArray.length){
            callback(resultsArray);
        }
    }
}

function getAllFavorites(callback)
{
    var resultsArray = [];

    var table = Parse.Object.extend("Favorites");
    var query = new Parse.Query(table);

    query.find().then(
        function(results)
        {
            for (var i = 0; i < results.length; i++)
            {
                var item = results[i];

                item.attributes.path = GLOBAL_PREFIX + LOCAL_FAVORITES_PATH + item.attributes.path;
                item.attributes.favoriteId = item.id;
                if (resultsArray[item.attributes.type]== undefined){
                    resultsArray[item.attributes.type] = [];
                }
                resultsArray[item.attributes.type].push(item.attributes);
            }
            callback(resultsArray);
        },
        function(error) {
            console.log('Failed to get favorites, with error code: ' + error.code);
        }
    );
}


/**
* Retriving the given user badges, in the callback function an associative array will be received
*/
function getAllUserBadges (callback, user) {
  var usersTable = Parse.Object.extend("_User");
  var query = new Parse.Query(usersTable);

  query.get(Parse.User.current().id).then(
              function (parseUser) {
                var badgesTable = Parse.Object.extend("Badges");
                var query = new Parse.Query(badgesTable);

                query.containedIn("objectId", parseUser.get("badges"));
                query.find().then(
                    function (results) {
                      var badges = new Array();
                      var path = GLOBAL_PREFIX + LOCAL_BADGE_PATH;

                      for (i in results)
                        badges.push({ "id":results[i].id, "path": path + results[i].get("path") }); // Creating the associative array
                      callback(badges);
                    }
                );
  });
}

/**
* Retriving the given user achievements (extras), in the callback function an associative array will be received
*/
function getAllUserAchievements (callback, user) {
  var avatarTable = Parse.Object.extend("Avatars");
  var query = new Parse.Query(avatarTable);
  var avatarID = user.getAvatar().id;

  query.get(avatarID).then(
        function (parseAvatar) {
          var extraTable = Parse.Object.extend("AvatarExtra");
          var query = new Parse.Query(extraTable);

          query.containedIn("objectId", parseAvatar.get("achievements"));
          query.find().then(
              function (results) {
                var extras = new Array();
                var path = GLOBAL_PREFIX + LOCAL_AVATAR_PATH;

                for (i in results)
                  extras.push({ "id":results[i].id, "path": path + results[i].get("path") }); // Creating the associative array
                callback(extras);
              }
          );
  });
}

/**
* Log in function to parse, this will create a parse user over the current session
*/
function logIn (callback, username, password) {
	// Log in to the system
  Parse.User.logIn(username, password, null).then(
  		function(user) {
    	 return user;
  		},
  		function(error) {
    		console.log("LogIn error: " + error.description);
        callback(false);
  		}).then(
          function(user) {
          Parse.User.current().set("isOnline", true, null); // Setting the user as logged in in the DB
          Parse.User.current().save().then(
                    function(arg) {
                      callback(user);
      });
  });
}

/**
* Returning toadys lesson (Activity)
*/
function getTodayLesson (callback) {
  var startDate = new Date();
  startDate.setSeconds(0);
  startDate.setMinutes(0);
  startDate.setHours(0);

  var endDate = new Date();
  endDate.setSeconds(59);
  endDate.setMinutes(59);
  endDate.setHours(23);

  var lessonTable = Parse.Object.extend("Lesson");
  var query = new Parse.Query(lessonTable);
  query.greaterThanOrEqualTo("due_date", startDate);
  query.lessThanOrEqualTo("due_date", endDate);
  query.include("badge"); // Including the badge pointer

  query.first().then(
        function(parseLesson) {
          var newLesson = new Lesson();
          if(parseLesson) // If there are any lessons today
          {
            newLesson.setName (parseLesson.get("name"));
            newLesson.setDate (parseLesson.get("due_date"));
            newLesson.setBadge (parseLesson.get("badge").id, GLOBAL_PREFIX + LOCAL_BADGE_PATH + parseLesson.get("badge").get("path"));
            newLesson.setGoogleLink (parseLesson.get("google_link"));
            newLesson.setYoutubeLink (parseLesson.get("youtube_link"));

            callback(newLesson);
          }
          else // Else call the callback with null
            callback(null);
        },
        function(error) {
          console.log("Error: " + error.description);
        }
  );
}

/**
* Returning the current log in user
*/
function getCurrentUser (callback) {
  var usersTable = Parse.Object.extend("_User");
  var query = new Parse.Query(usersTable);

  query.include("avatar"); // Including the avatar pointer

  query.get(Parse.User.current().id).then(
          function(parseUser) {
            callback ( createUserFromParseUser(parseUser) );
          },
          function(error) {
            console.log("Error: " + error.description);
  });
}

/**
* Getting the user avatar, if the function recieve 1 in option then returns the head avatar only
* if option is 2 then returns the path for the full avatar.
* Default is the head avatar
*/
function getUserAvatar (callback, parseAvatar, option) {
    var avatarTable = Parse.Object.extend("Avatars");
    var query = new Parse.Query(avatarTable);
    var avatarID = parseAvatar.id;

    query.include("head_body"); // Including the head pointer
    query.include("hair");      // Including the hair pointer
    query.include("eyes");      // Including the eyes pointer
    query.include("extra");     // Including the body pointer
    query.include("mouth");     // Including the mouth pointer
    query.include("nose");      // Including the nose pointer
    query.include("hat");       // Including the hat pointer
    query.include("pants");     // Including the pants pointer
    query.include("shirt");     // Including the shirt pointer
    query.include("shoes");     // Including the shoes pointer
    
    query.get(avatarID).then(
            function(parseAvatar) {
              callback(createAvatarFromParseObject(parseAvatar, option));
            },
            function(error) {
              console.log("Error: " + error.description);
            }
    );
}

/**
* This function is to set the user avatar, it needs to get the ID's of the elements.
*/
function setUserAvatar (callback, user, head_body, hair, eyes, extra, mouth, nose, hat, pants, shirt, shoes) {
    var headBodyObject = Parse.Object.extend("AvatarHeadBody");
    var hairObject = Parse.Object.extend("AvatarHair");
    var eyesObject = Parse.Object.extend("AvatarEyes");
    var extraObject = Parse.Object.extend("AvatarExtra");
    var mouthObject = Parse.Object.extend("AvatarMouth");
    var noseObject = Parse.Object.extend("AvatarNose");
    var hatObject = Parse.Object.extend("AvatarHat");
    var pantsObject = Parse.Object.extend("AvatarPants");
    var shirtObject = Parse.Object.extend("AvatarShirt");
    var shoesObject = Parse.Object.extend("AvatarShoes");

    var newAvatar = user.getAvatar();

    if (head_body)
        newAvatar.set("head_body", new headBodyObject().set("objectId", head_body));
    if (hair)
        newAvatar.set("hair", new hairObject().set("objectId", hair));
    if (eyes)
        newAvatar.set("eyes", new eyesObject().set("objectId", eyes));
    if (mouth)
        newAvatar.set("mouth", new mouthObject().set("objectId", mouth));
    if (nose)
        newAvatar.set("nose", new noseObject().set("objectId", nose));
    if (hat)
        newAvatar.set("hat", new hatObject().set("objectId", hat));
    if (pants)
        newAvatar.set("pants", new pantsObject().set("objectId", pants));
    if (shirt)
        newAvatar.set("shirt", new shirtObject().set("objectId", shirt));
    if (shoes)
        newAvatar.set("shoes", new shoesObject().set("objectId", shoes));
    if (extra) // If there is an extra to set
        newAvatar.set("extra", new extraObject().set("objectId", extra));

    newAvatar.save().then(
        function (newAvatar) {
            callback(true),
                function (error) {
                    console.log("Error: " + error.description);
                }
        });
}

/**
* Create new class with the given arguments
*/
function createNewLesson (name, date, badge, youtube, google) {
  var Lesson = Parse.Object.extend("Lesson");
  var lesson = new Lesson();
  var badgeObject = Parse.Object.extend("Badges");

  lesson.set("name", name);
  lesson.set("due_date", date);
  lesson.set("youtube_link", youtube);
  lesson.set("google_link", google);
  lesson.set("badge", new badgeObject().set("objectId", badge));


  lesson.save().then(
    function(lesson) {
       console.log('New lesson created with objectId: ' + lesson.id);
      },
      function(error) {
        console.log('Failed to create new lesson, with error: ' + error.description);
      }
  );
}

/**
* Return to the callback function an array of all items with their id and path
* The possible tables are
* AvatarExtra, AvatarEyes, AvatarHair, AvatarHeadBody, AvatarMouth, Badges, Food
*/
function getAllItems (callback, tableName, option) {
  var table = Parse.Object.extend(tableName);
  var query = new Parse.Query(table);
  var avatarPath = "";

  // Switch case for the tables, Badges table has the full path already
  switch (tableName) {
    case "Badges":
      avatarPath = GLOBAL_PREFIX + LOCAL_BADGE_PATH;
      break;

    default:
      if (option == 1)
        avatarPath = GLOBAL_PREFIX + LOCAL_AVATAR_PATH;
      else
        avatarPath = GLOBAL_PREFIX + LOCAL_FULL_AVATAR_PATH;
      break;
  }

  query.find().then(
        function(results) {
          var items = new Array();

          for (var i = 0; i < results.length; i++) {
            var item = results[i];

            items.push({ "id":item.id, "path": avatarPath + item.get("path") });
          }
          callback(items);
        },
        function(error) {
          console.log('Failed to get arrays, with error code: ' + error.code);
        }
  );
}

/**
* Calling the callback function with an array of all the online users
*/
function getAllOnlineUsers (callback) {
  var usersTable = Parse.Object.extend("_User");
  var query = new Parse.Query(usersTable);

  query.equalTo("isOnline", true); // Looking for only the online users
  query.include("avatar"); // Including the avatar pointer

  query.find().then(
        function(results) {
          var usersArray = new Array();

          // Going over the results and creating the users array
          for (var i = 0; i < results.length; i++) {
            var user = new User();
            var parseUser = results[i]; // Getting the user from the resuts array
            
            user = createUserFromParseUser(parseUser);

            usersArray.push(user);
          }

          callback(usersArray);
        },
        function(error) {
          console.log('Failed to get users, with error: ' + error.description);
        }
  );
}

/**
* Inner function for creating custom user object from the parse user object
*/
function createUserFromParseUser (parseUser) {
    var user = new User();

    user.setName( parseUser.get("username") );
    user.setEmail( parseUser.get("email") );
    user.setPrivileges( parseUser.get("privileges") );
    user.setGender( parseUser.get("gender") );
    user.setAvatar( parseUser.get("avatar") );
    user.setBadges( parseUser.get("badges") );
    user.setFavorites( parseUser.get("favorites") );

    return user;
}

/**
* Inner function for creating custom avatar object from the parse avatar object
*/
function createAvatarFromParseObject (parseAvatar, option) {
    userAvatar = new Avatar();

    switch (option) {
        case 1:
            var avatarPath = GLOBAL_PREFIX + LOCAL_AVATAR_PATH;
            break;

        case 2:
            var avatarPath = GLOBAL_PREFIX + LOCAL_FULL_AVATAR_PATH;
            break;

        default:
            var avatarPath = GLOBAL_PREFIX + LOCAL_AVATAR_PATH;
            break;
    }

    userAvatar.setHead (avatarPath + parseAvatar.get("head_body").get("path"));
    userAvatar.setEyes (avatarPath + parseAvatar.get("eyes").get("path"));
    userAvatar.setHair (avatarPath + parseAvatar.get("hair").get("path"));
    userAvatar.setMouth (avatarPath + parseAvatar.get("mouth").get("path"));
    userAvatar.setNose (avatarPath + parseAvatar.get("nose").get("path"));
    userAvatar.setHat (avatarPath + parseAvatar.get("hat").get("path"));
    userAvatar.setPants (avatarPath + parseAvatar.get("pants").get("path"));
    userAvatar.setShirt (avatarPath + parseAvatar.get("shirt").get("path"));
    userAvatar.setShoes (avatarPath + parseAvatar.get("shoes").get("path"));

    if (parseAvatar.get("extra")) // If the user has any extra
        userAvatar.setExtra (avatarPath + parseAvatar.get("extra").get("path"));

    return userAvatar;
}

function getParseObjectById( callback , tableName , colName , objectId , pointerCol
    , notContainedCol , notEqualParams  , containedInCol , containedInParams, useOrganization){
    $('body').css('cursor', 'progress');

    if(objectId != null)
        this.writeToLog(tableName, "trying to get parse object by id ", objectId);

    var table = Parse.Object.extend(tableName);
    var query = new Parse.Query(table);

    //query.equalTo("organizationId" , Parse.User.current().get("organizationId"));

    if(useOrganization) {
        query.equalTo("organizationId", Parse.User.current().get("organizationId"));
    }

    if(notContainedCol){
        query.notContainedIn( notContainedCol , notEqualParams);
    }

    if(containedInCol){
        query.containedIn( containedInCol , containedInParams);
    }

    query.include(pointerCol);
    if(colName){
        query.equalTo( colName , objectId );
        query.find({
            success: function(results) {
                $('body').css('cursor', 'default');

                callback(results);
            },
            error: function(error) {
                $('body').css('cursor', 'default');

                callback(error);
            }
        });
    }else{
        query.find().then(
            function(results) {
                $('body').css('cursor', 'default');

                callback(results);
            },
            function(error) {
                $('body').css('cursor', 'default');

                callback(error);
            });
    }
};

function getParseObjectByIdLesson( callback , tableName , colName , objectId , pointerCol , notContainedCol , notEqualParams  , containedInCol , containedInParams ){
    $('body').css('cursor', 'progress');
    var table = Parse.Object.extend(tableName);
    var query = new Parse.Query(table);

    //query.equalTo("organizationId" , Parse.User.current().get("organizationId"));

    if(notContainedCol){
        query.notContainedIn( notContainedCol , notEqualParams);
    }

    if(containedInCol){
        query.containedIn( containedInCol , containedInParams);
    }

    query.include(pointerCol);
    if(colName){
        query.equalTo( colName , objectId );
        query.find({
            success: function(results) {
                $('body').css('cursor', 'default');
                callback(results);
            },
            error: function(error) {
                $('body').css('cursor', 'default');
                callback(error);
            }
        });
    }else{
        query.find().then(
            function(results) {
                $('body').css('cursor', 'default');
                callback(results);
            },
            function(error) {
                $('body').css('cursor', 'default');
                callback(error);
            });
    }
};


/**
 * Calling the callback function with all the question
 */

function getGame4Avi( callback , gameId ){
    gameId = "8evK8zFbse";


    function getGames4AviCallback (result){
        callback(result);
    };

    getParseObjectById( getGames4AviCallback , "TriviaQuestions" , 'gameId' , gameId );
};


/**
 * arr of all groups for later use..
 * @type {Array}
 */
var groupsArray;

function getGroupUsers(groupId ,callback){
    var group;

    groupsArray.forEach(function(g){
        if(g.id == groupId){
            group = g;
        }
    });

    getParseObjectById(getGroupUsersCallback, '_User', null, null, null, null, null, 'objectId', group.usersIds);

    function getGroupUsersCallback(results){
        var resultArray = [];

        for (var i = 0; i < results.length; i++) {
            resultArray[i] = [];
            resultArray[i]["objectId"] = results[i].id;
            resultArray[i]["userName"] = results[i].attributes.username;
            resultArray[i]['email'] = results[i].attributes.email;
            resultArray[i]['hangoutId'] = results[i].attributes.googleHangoutId;
        }

        callback(resultArray);
    }
}

function getGroupsListByUserId(parseUser, callback){
    function getGroupsCallback(results) {
        var resultArray = [];

        for (var i = 0; i < results.length; i++) {
            resultArray[i] = {};
            resultArray[i]["objectId"] = results[i].id;
            resultArray[i]["groupName"] = results[i].attributes.groupName;
            resultArray[i]['iconUrl'] = results[i].attributes.imageFile._url;
            resultArray[i]["description"] = results[i].attributes.description;
        }

        groupsArray = results; //Save locally the groups for later use.
        callback(resultArray);
    }

    getParseObject(getGroupsCallback, "UserGroups", "ownerId", parseUser);
}


/**
 * arr of all lesson for later use..
 * @type {Array}
 */
var tmpLessons = [];

function getLessonContent(callback, lessonId) {

    var lesson = tmpLessons[0];

    tmpLessons.forEach(function(les){
        if(les.id == lessonId){
            lesson = les;
        }
    });

    var resultArray = {};
    var gamesFlag = false;
    var contentFlag = false;
    var badgesFlag = false;
    resultArray['home'] = {
        "title": "Video feed"
    };
    resultArray['profileZone'] = {
        "title": "Profile"
    };
    resultArray['gameZone'] = {};
    resultArray['mediaZone'] = {};
    resultArray["badges"] = {};

    if (!lesson.objectId) {
        lesson.objectId = 'wmKCpsrQ5T';
    }


    function getContentCallback(result) {

        resultArray.mediaZone["items"] = [];
        for (var i = 0; i < result.length; i++) {
            resultArray.mediaZone.items[i] = result[i].attributes;
            resultArray.mediaZone.items[i][result[i].attributes.type] = true;
            resultArray.mediaZone.items[i]['objectId'] = result[i].id;
        }
        contentFlag = true;

        if (gamesFlag && contentFlag && badgesFlag) {
            callback(resultArray);
        }
    }

    function getGamesCallback(result) {

        resultArray.gameZone["items"] = [];
        for (var i = 0; i < result.length; i++) {
            resultArray.gameZone.items[i] = result[i].attributes;
            resultArray.gameZone.items[i]['objectId'] = result[i].id;
        }
        gamesFlag = true;

        if (gamesFlag && contentFlag && badgesFlag) {
            callback(resultArray);
        }
    }

    function getBadgesCallback(result) {

        resultArray.badges = [];
        for (var i = 0; i < result.length; i++) {
            resultArray.badges[i] = {};
            resultArray.badges[i] = result[i].attributes;
            resultArray.badges[i].objectId = result[i].id;
            resultArray.badges[i].iconUrl = result[i].attributes.normalBadgeImage._url;
        }
        badgesFlag = true;

        if (gamesFlag && contentFlag && badgesFlag) {
            callback(resultArray);
        }
    }

    getParseObjectByIdLesson(getContentCallback, "Content", null, null, null, null, null, "objectId", lesson.attributes.contents);
    getParseObjectByIdLesson(getGamesCallback, "Games", null, null, null, null, null, "objectId", lesson.attributes.games);
    getParseObjectByIdLesson(getBadgesCallback, "Badges", null, null, null, null, null, "objectId", lesson.attributes.badges);
}

function getLessonsListById(parseUser, callback) {
    function getLessonByIdCallback(results) {
        var resultArray = [];

        for (var i = 0; i < results.length; i++) {
            resultArray[i] = {};
            resultArray[i]["objectId"] = results[i].id;
            resultArray[i]["lessonName"] = results[i].attributes.name;
            resultArray[i]["contentsIds"] = results[i].attributes.contents;
            resultArray[i]["gamesIds"] = results[i].attributes.games;
        }

        console.log("get lesson res arr: ", resultArray);
        tmpLessons = results;
        callback(resultArray);
    }

    getParseObject(getLessonByIdCallback, "Lesson", "createdBy", parseUser, null, 'badge');
}

function addBadgesToUsers(badgesIds, usersHangoutIds){

    var usersIds = [];
    var counter = 0;

    usersHangoutIds.forEach(function(hid){
        getParseObject(getUsersCallback, "_User", "googleHangoutId", hid);

        function getUsersCallback(result){
            console.log("get user callback: ", result);
            usersIds.push(result[0].id);
            console.log("usersIds: ", usersIds);
            counter++;

            if(counter >= usersHangoutIds.length){
                console.log("users: ", usersIds);
                doAddBadgesToUsers();
            }
        }
    });

    function doAddBadgesToUsers(){
        usersIds.forEach(function(userId){
            var params = {
                userId: userId,
                badges: badgesIds
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
        });
    }
}

function getParseObject( callback , tableName , colName , object , notColName , pointerCol, useOrganization){
    $('body').css('cursor', 'progress');
    var table = Parse.Object.extend(tableName);
    var query = new Parse.Query(table);

    if(pointerCol){
        query.include(pointerCol);
    }

    if(useOrganization) {
        query.equalTo("organizationId", Parse.User.current().get("organizationId"));
    }

    if(notColName){
        query.notEqualTo( notColName, object);
        query.find({
            success: function(results) {
                $('body').css('cursor', 'default');
                callback(results);
            },
            error: function(error) {
                $('body').css('cursor', 'default');
                callback(error);
            }
        });
    }else if(colName){
        query.equalTo( colName , object );
        query.find({
            success: function(results) {
                $('body').css('cursor', 'default');
                callback(results);
            },
            error: function(error) {
                $('body').css('cursor', 'default');
                callback(error);
            }
        });
    }else{
        query.find().then(
            function(results) {
                $('body').css('cursor', 'default');
                callback(results);
            },
            function(error) {
                $('body').css('cursor', 'default');
                callback(error);
            });
    }
};


function inviteGroupToHangOut (callback , hangOutUrl , groupId) {
    getParseObjectById(getGroupCallback , "UserGroups" , "objectId" , groupId );

    function getGroupCallback (results){
        if(results.length > 0 ){
            getParseObjectById(getGroupsUsersCallBack , "_User", null, null
                , null, null, null, "objectId", results[0].attributes.usersIds);


        }else{

        }
    }

    function getGroupsUsersCallBack (groupsUsers){
        if(groupsUsers.length > 0){
            var counter = 0;
            groupsUsers.forEach(function (user) {
                var text =  "   לחץ כאן על מנת להיכנס לפעולה";
                var link ="<a href="+hangOutUrl+'>';
                console.log("Link" , link);
                sendEmail(sendEmailCallback , Parse.User.current().get("email") , user.attributes.email , "זימון לפעולה" , text+link  )
            });

            function sendEmailCallback (emailResult){
                counter++;
                if(counter == groupsUsers.length) {
                    callback("Success");
                }
            }
            console.log(groupsUsers);
        }else{
            callback("No Users In This Group");
        }

    };
}

function sendEmail (callback , fromCurrentUser , toUser ,  subject , fullText) {
    if(fromCurrentUser.attributes.email){
        var fromEmailAddress = fromCurrentUser.attributes.email;

    }else{
        callback(false);
        return;
    }

    if(toUser.attributes.email) {
        var toEmailAddress = toUser.attributes.email;

    }else{
        callback(false);
        return;
    }

    $.ajax({
        type: 'POST',
        url: 'https://mandrillapp.com/api/1.0/messages/send.json',
        data: {
            key: '0dlgRjV-FFF7g5oxI0OxUw',
            message: {
                from_email: fromEmailAddress ,
                to: [
                    {
                        email: toEmailAddress ,
                        name: 'Jorge',
                        type: 'to'
                    },
                    {
                        email: 'langer.ron@gmail.com',
                        name: 'Langer',
                        type: 'to'
                    }
                ],
                autotext: 'true',
                subject: subject ,
                html: fullText
            }
        }
    }).done(function(response) {

        callback(response);
    });
}

function writeToLog (tableName, action, objectId ){
    var logMessage = Parse.User.current().get("username") + " " + action + " Item ID: " + objectId + ". Table: " + tableName;
    Parse.Cloud.run("Logger", {message: logMessage}, null);
}
