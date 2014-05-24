/**
*	Parse Manager Class - Handles all Parse Admin Actions
*/

var currentGoogleUser;

var ParseManager = function() {
	this._currentUser;
    console.log('construting PArse MAnager');
    console.log(currentGoogleUser);
    this._googleProfileCurrentUser =  currentGoogleUser;

};




/* Executed when the APIs finish loading */
function render() {
    console.log('RENDERING PARSE ADMIN');
    // Additional params including the callback, the rest of the params will
    // come from the page-level configuration.
    var additionalParams = {
        'callback': signinCallback
    };

    gapi.auth.signIn(additionalParams); // Will use page level configuration

}


function signinCallback(authResult) {
    console.log('CALLBACK GOOGLE Parse admin');
    if (authResult['status']['signed_in']) {
        console.log("ENERING RESULT!!!!");
        currentGoogleUser = authResult;
        console.log("Current User " , currentUser );
        // Update the app to reflect a signed in user
        // Hide the sign-in button now that the user is authorized, for example:
        //onsole.log('result',authResult);
        gapi.client.load('plus','v1', function(){

            //var request = gapi.client.plus.people.search({
            //    'query' : 'etay schur',
            //    'maxResults' : 5
            //});

            //request.execute(function(resp) {
            //    //console.log(resp);
            //});
        });


    } else {
        // Update the app to reflect a signed out user
        // Possible error values:
        //   "user_signed_out" - User is signed-out
        //   "access_denied" - User denied access to your app
        //   "immediate_failed" - Could not automatically log in the user
        console.log('Sign-in state: ' + authResult['error']);
    }
}


ParseManager.prototype.googlePlusSignin = function (callback){
    console.log('google sign in start..');
    var po = document.createElement('script');
    po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/client:plusone.js?onload=render';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);


    /* Executed when the APIs finish loading */
    function render() {
        console.log('RENDERING');
        // Additional params including the callback, the rest of the params will
        // come from the page-level configuration.
        var additionalParams = {
            'callback': signinCallback
        };

        gapi.auth.signIn(additionalParams); // Will use page level configuration

    }

    function signinCallback(authResult) {
        console.log('CALLBACK');
        if (authResult['status']['signed_in']) {
            console.log("ENERING RESULT!!!!");
            this._googleProfileCurrentUser = authResult;

            console.log("Current User " , currentUser );
            // Update the app to reflect a signed in user
            // Hide the sign-in button now that the user is authorized, for example:
            //onsole.log('result',authResult);
            gapi.client.load('plus','v1', function(){
                callback(authResult);
                //var request = gapi.client.plus.people.search({
                //    'query' : 'etay schur',
                //    'maxResults' : 5
                //});

                //request.execute(function(resp) {
                //    //console.log(resp);
                //});
            });


        } else {
            // Update the app to reflect a signed out user
            // Possible error values:
            //   "user_signed_out" - User is signed-out
            //   "access_denied" - User denied access to your app
            //   "immediate_failed" - Could not automatically log in the user
            console.log('Sign-in state: ' + authResult['error']);
        }
    }
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
    console.log('PARSE OBJECTS');
    console.log(parseObjects);
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

ParseManager.prototype.deleteObject = function (callback , parseObject , tablesArray){

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
        console.log('not parse object');
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
      	console.log('entering current user to model');
      	
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
ParseManager.prototype.getParseObject = function ( callback , tableName , colName , object  ){
    $('body').css('cursor', 'progress');
    var table = Parse.Object.extend(tableName);
    var query = new Parse.Query(table);
    if(colName){
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
                console.log('Query is OK')
                console.log(results);
                $('body').css('cursor', 'default');
                callback(results);
            },
            function(error) {
                console.log('Query Failed')
                $('body').css('cursor', 'default');
                callback(error);
            });
    }
};




ParseManager.prototype.getParseObjectById = function ( callback , tableName , colName , objectId , pointerCol  ){
	 $('body').css('cursor', 'progress');
	 var table = Parse.Object.extend(tableName);
	 var query = new Parse.Query(table);
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
              console.log('Query is OK')
              console.log(results);
              $('body').css('cursor', 'default'); 
              callback(results);
            },
            function(error) {
              console.log('Query Failed')
              $('body').css('cursor', 'default'); 
              callback(error);
            });
	 }
};

 ParseManager.prototype.getLessonContent = function (callback , lessonId){
     var resultArray = {};
     var gamesFlag = false;
     var contentFlag = false;
     resultArray['content'] = {};
     resultArray['games'] = {};

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

     };

     function getGamesCallback(result){

         for ( var i = 0 ; i < result.length ; i++ ){
             resultArray.games[i] = result[i].attributes.game.attributes;
             resultArray.games[i]['objectId'] = result[i].attributes.game.id;
         }
         gamesFlag = true;

     };

     if(gamesFlag && contentFlag ){
         callback(resultArray);
     }



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

