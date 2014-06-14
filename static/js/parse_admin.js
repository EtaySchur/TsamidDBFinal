/**
*	Parse Manager Class - Handles all Parse Admin Actions
*/





var ParseManager = function() {
	this._currentUser;
    this._googleProfileCurrentUser;

};








ParseManager.CurrentUser = function(currentUser){
	this._userName = currentUser.attributes.username;
	this._userEmail = currentUser.attributes.email;
	this._parseUserObject = currentUser;
}

ParseManager.prototype.setGoogleProfileCurrentUser = function (googleCurrentUser){
    this._googleProfileCurrentUser = googleCurrentUser ;
};

ParseManager.prototype.getGoogleProfileCurrentUser = function (){
    return this._googleProfileCurrentUser;
};


ParseManager.CurrentUser.prototype.getCurrentUserName = function (){
	return this._userName;
};

ParseManager.CurrentUser.prototype.getCurrentUserEmail = function (){
	return this._userEmail;
};

ParseManager.CurrentUser.prototype.getCurrentParseUser = function (){
	return this._parseUserObject;
};

ParseManager.prototype.getCurrentUser = function (){
	return this._currentUser;
};

ParseManager.prototype.setCurrentUser = function (currentUser){
	this._currentUser = currentUser;
};

ParseManager.prototype.deleteMultipleItems = function (callback , parseObjects , tablesArray) {

    var counter = 0;
    function deleteItemCallback(result){
           // TODO CHECK FOR ERROROS
           counter++;
           if(counter == parseObjects.length){

               callback(result);
           }
    };

    for (var index = 0; index < parseObjects.length; ++index) {
        this.deleteObject( deleteItemCallback , parseObjects[index] , tablesArray);
    }

};

ParseManager.prototype.deleteObject = function (callback , parseObject){

	$('body').css('cursor' , 'progress');
	parseObject.destroy({
  		success: function(myObject) {
    		callback(myObject);
    		$('body').css('cursor' , 'default');
  	},
  		error: function(myObject, error) {
    	    callback(error);
    	    $('body').css('cursor' , 'default');
  	}
});
};


ParseManager.prototype.createParseObject = function (tableName) {
		var table = Parse.Object.extend(tableName);
		object = new table();
		return object;

};

ParseManager.prototype.saveObject = function (callback , tableName , object) {
    $('body').css('cursor' , 'progress');

    // case not a Parse Object
    if(!object.id){

        var resultArray = [];
        // Create parse object
        parseObject = parseManager.createParseObject(tableName);
        for(detail in object){
            parseObject.set(detail , object[detail]);
        }
        resultArray.push(parseObject);
        alertText = 'New Object Saved';

    }else{
        parseObject = object;
        for(detail in object.attributes){
            parseObject.set(detail , object.attributes[detail]);
        }
        alertText = 'Edit Object';
    }
    var defaultACL = new Parse.ACL();
    defaultACL.setWriteAccess(Parse.User.current(), true);
    defaultACL.setPublicReadAccess(true);
    parseObject.setACL(defaultACL);


    parseObject.save().then(function (success) {
            successAlert = new Alert('success' , alertText+' Success');
            successAlert.start();
            $('body').css('cursor' , 'default');
            callback(success);
        }
        , function (error){
            failAlert = new Alert('danger' , alertText+' Fail');
            failAlert.start();
            console.log("Error: " + error.description);
            $('body').css('cursor' , 'default');
            callback(error);
        });
};




/**
*	Admin Log In function
*
*	@params : @callback - returned callback with the results
*			  @username - filled current user name
*			  @password - filled current user password
*/

ParseManager.prototype.adminLogIn = function (callback , username , password){

	  $('body').css('cursor', 'progress');
      Parse.User.logIn( username, password , null).then(
      function(user) {
      	// Setting user details in ParseManager


      },
      function(error) {
      	$('body').css('cursor', 'default');
        callback(error);
      }).then(
          function(user) {
          Parse.User.current().set("isOnline", true, null); // Setting the user as logged in in the DB
          Parse.User.current().save().then(
                    function(user) {
                      console.log(user.get("username") + " logged in.");
                      $('body').css('cursor', 'default');
                      callback(user);
      });
  });
};



/**
*	Generic Parse Object Query function
*
*	@params : @callback - returned callback with the results
*			  @tableName - requiered Parse Table
*			  @objectId  - requiered Parse ObjectId , get NULL for all objects.
*/
ParseManager.prototype.getParseObject = function ( callback , tableName , colName , object , notColName , pointerCol  ){
    $('body').css('cursor', 'progress');
    var table = Parse.Object.extend(tableName);
    var query = new Parse.Query(table);

    if(pointerCol){
        query.include(pointerCol);
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




ParseManager.prototype.getParseObjectById = function ( callback , tableName , colName , objectId , pointerCol , notContainedCol , notEqualParams  , containedInCol , containedInParams ){
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

ParseManager.prototype.getParseLessonContent = function (callback , lesson){
    var resultArray = [];
    var gamesFlag = false;
    var contentFlag = false;
    resultArray['content'] = [];
    resultArray['games'] = [];

    function getContentCallback(result){
        result.forEach(function (content){

            resultArray['content'].push(content);
            contentFlag = true;
        });

        if(gamesFlag && contentFlag ){
            callback(resultArray);
        }
    };

    function getGamesCallback(games){
        resultArray['games'] = games;
        gamesFlag = true;

        if(gamesFlag && contentFlag ){

            callback(resultArray);
        }

    };

    this.getParseObjectById(getContentCallback, "Content", null, null, null, null, null, "objectId", lesson.attributes.contents);
    this.getParseObjectById(getGamesCallback, "Games", null, null, null, null, null, "objectId", lesson.attributes.games);
}

 ParseManager.prototype.getLessonContent = function (callback , lessonId){

     var resultArray = [];
     var gamesFlag = false;
     var contentFlag = false;
     resultArray['content'] = [];
     resultArray['games'] = [];

    if(!lessonId){
        lessonId = 'wmKCpsrQ5T';
    }

    function getContentCallback(result){
         for ( var i = 0 ; i < result.length ; i++ ){
             resultArray.content[i] = result[i].attributes.content.attributes;
             resultArray.content[i][result[i].attributes.content.attributes.type] = true;
             resultArray.content[i]['objectId'] = result[i].attributes.content.id;
         }
         contentFlag = true;

        if(gamesFlag && contentFlag ){

            callback(resultArray);
        }
     };

     function getGamesCallback(result){
         var gamesCounter = 0;
         for ( var i = 0 ; i < result.length ; i++ ){
             resultArray.games[i] = result[i].attributes.game.attributes;
             resultArray.games[i]['objectId'] = result[i].attributes.game.id;
             var gameType = result[i].attributes.game.attributes.type;

             switch (gameType){
                 case 'Trivia' :  parseManager.getParseObjectById(getGamesQuestionsCallback  , "TriviaQuestions" , 'gameId' , result[i].attributes.game.id );
                                    function getGamesQuestionsCallback (questionsResult){
                                        resultArray.games[gamesCounter]['questions'] = questionsResult;
                                        gamesCounter++;
                                    };
                                  break;
             }
         }

         gamesFlag = true;

         if(gamesFlag && contentFlag ){
             callback(resultArray);
         }

     };

         this.getParseObjectById(getContentCallback , "Content2Lesson" , 'lessonId' , lessonId , 'content');
         this.getParseObjectById(getGamesCallback , "Games2Lesson" , 'lessonId' , lessonId , 'game');


};


function editUser(user){

	var UserTable = Parse.Object.extend("_User");
	var query = new Parse.Query(UserTable);
	id = user.id;
	console.log(user.id);
	query.equalTo("objectId" , id);
	query.find({
 		 success: function(results) {

    // Do something with the returned Parse.Object values
    		for (var i = 0; i < results.length; i++) {

			      var object = results[i];
			      console.log(user.attributes.username);
			 	  object.set("username" , user.attributes.username);
			 	  object.save();
			 	  return true;

    			}
 		 },
  error: function(error) {
    alert("Error: " + error.code + " " + error.message);
  }
});

};



ParseManager.prototype.getGame4Avi = function ( callback , gameId ){

        gameId = "8evK8zFbse";


    function getGames4AviCallback (result){
        callback(result);
    };

    getParseObjectById( getGames4AviCallback , "TriviaQuestions" , 'gameId' , gameId );
};

ParseManager.prototype.getLessonsListById = function (callback , parseUser ){
    function getLessonByIdCallback(results){
        var resultArray = [];

        for(var i = 0  ; i < results.length ; i++){
            resultArray[i] = [];
            resultArray[i]["objectId"] = results[i].id;
            resultArray[i]["lessonName"] = results[i].attributes.name;
        };

        callback(resultArray);
    }

    parseManager.getParseObject(getLessonByIdCallback , "Lesson" , "createdBy" , parseUser);
};



ParseManager.prototype.createNewUserParseAccount = function ( callback , newUser) {
    $('body').css('cursor' , 'progress');
    var user = new Parse.User();
    var avatarObject = Parse.Object.extend("Avatars");
    var avatar = new avatarObject();

    for(var detail in newUser){
        user.set(detail , newUser[detail]);
    }

    avatar.set("achievements", new Array()); // Setting an empty array of achievements for the new user avatar

    avatar.save().then(
        function (avatar) {
            user.set("avatar",avatar);
            user.signUp(null, {
                success: function(user) {
                    $('body').css('cursor' , 'default');
                    callback(user);
                },
                error: function(user, error) {
                    $('body').css('cursor' , 'default');
                    callback(user , error);
                    console.log("Signup error: " + error.description);
                }
            });
        }
    );



};

ParseManager.prototype.duplicateTriviaGame = function( callback , newGameName ,  triviaGameObject ) {

        var counter = 0;
        var newTriviaGameObject = [];
        newTriviaGameObject["gameName"] = newGameName;
        newTriviaGameObject["createdBy"] = Parse.User.current();
        newTriviaGameObject["organizationId"] = Parse.User.current().get("organizationId");
        newTriviaGameObject["type"] = "Trivia";

        parseManager.saveObject(duplicateGameCallback , "Games" , newTriviaGameObject );

        function duplicateGameCallback (result){

            parseManager.getParseObjectById( getGameQuestionCallback , "TriviaQuestions" , "gameId" , triviaGameObject.id);

            function getGameQuestionCallback (questionsResults){
                questionsResults.forEach(function (question){
                    var duplicatedQuestion = question.attributes;
                    duplicatedQuestion["gameId"] = result.id;
                    parseManager.saveObject(duplicateQuestionCallback , "TriviaQuestions" ,duplicatedQuestion );

                    function duplicateQuestionCallback (duplicateQuestionResult) {
                         counter++;
                         if(counter == questionsResults.length ){
                             alertManager.succesAlert("העתקת משחק" , "העתקת המשחק הושלמה בהצלחה");
                             callback(result);ß
                         }
                    };
                });
            }

        }





}

ParseManager.prototype.deleteTriviagame = function( callback , gameId, triviaGameObject ) {
    parseManager.getParseObjectById(getTriviaQuestionsByIdCallback, "TriviaQuestions", "gameId", triviaGameObject.id)

    function getTriviaQuestionsByIdCallback(triviaQuestions) {
        triviaQuestions.forEach(function(triviaQuestion){
            parseManager.deleteObject(deleteTriviaQuestionCallback, triviaQuestion)

            function deleteTriviaQuestionCallback() {

            }
        })
    }

    parseManager.deleteObject(deleteGameCallback, triviaGameObject);

    function deleteGameCallback(result) {
        console.log("success", result);
        callback(result);
    }
}

ParseManager.prototype.sendEmail  = function (callback , fromCurrentUser , toUser ,  subject , fullText){

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
};

