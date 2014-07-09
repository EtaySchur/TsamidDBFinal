'use strict';

/* Games Controllers */


angular.module('myApp.controllers',[]).
    controller('GamesCtrl', function ($scope, $http, $location, $rootScope) {
        console.log("init ctrl");
        $rootScope.initVars('Create_Game');

        $scope.games = [
            {
                title: "טריוויה",
                img: "trivia.svg",
                path: "trivia",
                gameType: "Trivia",
                description: 'משחק הטריוויה הינו משחק בו תוכלו ליצור שאלות ולתת לכל שאלה ארבע תשובות ואת התשובה הנכונה.  למידע נוסף אודות הטריוויה לחצו על צור משחק'

            },
            {
                title: "משחק הכירות",
                img: "intro.svg",
                path: "view2",
                gameType: "MettingGame",
                description: 'משחק הכירות הינו משחק שנוצר מראש עלידנו ומטרתו היא למלא את האיזור האישי של כל חניך בתחביבים שלו כגון: אוכל אהוב משחק אהוב וכדומה.'

            },
            {
                title: "טיול עולם",
                img: "world.svg",
                path: "view2",
                gameType: "MettingGame",
                description: 'משחק הכירות הינו משחק שנוצר מראש עלידנו ומטרתו היא למלא את האיזור האישי של כל חניך בתחביבים שלו כגון: אוכל אהוב משחק אהוב וכדומה.'
            }
        ];
        //this function takes place when the user click on one of the games and the only thing that she is take care of
        // is wich view to render(wich view to show)

        $scope.gameSelected = function(index){
            $rootScope.gameIndex = index;

        }
        //this function takes user game name and assign it to parse with auto creat fileds like object id etc.
        $rootScope.currentGame = [];
        $scope.newGameModel = [];
        $scope.addNewTriviaGame = function(tName){
            $scope.newGameModel["gameName"] = tName;
            $scope.newGameModel["type"] = "Trivia";
            $scope.newGameModel["createdBy"] = Parse.User.current();
	    $scope.newGameModel["organizationId"] = Parse.User.current().get("organizationId");
            parseManager.saveObject($scope.saveNewTriviaGameCallback,"Games",$scope.newGameModel);
            /*callback function,   tableName, object to save */

        }

        //a callback function for saving type,name and createdBy in games table
        $scope.saveNewTriviaGameCallback = function(result, error) {
            //pnotify an extrnal moudle that takes place after saving game type,name,createdBy in parse
            if(result){
                $rootScope.currentGame.push(result);
                new PNotify({
                    title: 'איזה יופי!!!! משחק הטריוויה שלך נשמר בהצלחה',
                    text: 'עכשיו אתה מוכן לשלב הבא! קדימה לעבודה התחל להכניס שאלות',
                    type: 'success',
                    width: "300px",
                    delay: "3000"
                });
                $scope.$apply($location.path('Games_Manage/Trivia_Table'));
            }else if(error){
                new PNotify({
                    title: 'אוי לא!!!',
                    text: 'משהו לא הסתדר כמו שהיינו רוצים אנא נסה ליצור משחק מחדש',
                    type: 'error',
                    width: "300px",
                    delay: "3000"
                });
            }
        }

	$scope.addNewWorldTour=function(TourName){
            $scope.newGameModel["gameName"] = TourName;
            $scope.newGameModel["type"] = "Tour";
            $scope.newGameModel["createdBy"] = Parse.User.current();
	    $scope.newGameModel["organizationId"] = Parse.User.current().get("organizationId");
            parseManager.saveObject($scope.saveNewWorldTourCallback,"Games",$scope.newGameModel);
	    
	}

        //a callback function for saving type,name and createdBy in games table
        $scope.saveNewWorldTourCallback = function(result, error) {
            //pnotify an extrnal moudle that takes place after saving game type,name,createdBy in parse
            if(result){
                $rootScope.currentGame.push(result);
                new PNotify({
                    title: 'איזה יופי!!!! הטיול שלך נשמר בהצלחה',
                    type: 'success',
                    width: "300px",
                    delay: "3000"
                });
		$scope.$apply($location.path('Games_Manage/Tour_Table'));
            }else if(error){
                new PNotify({
                    title: 'אוי לא!!!',
                    text: 'משהו לא הסתדר כמו שהיינו רוצים אנא נסה ליצור משחק מחדש',
                    type: 'error',
                    width: "300px",
                    delay: "3000"
                });
            }
        }


	$scope.addNewIntro=function(IntroName){
            $scope.newGameModel["gameName"] = IntroName;
            $scope.newGameModel["type"] = "Intro";
            $scope.newGameModel["createdBy"] = Parse.User.current();
	    $scope.newGameModel["organizationId"] = Parse.User.current().get("organizationId");
            parseManager.saveObject($scope.saveNewIntroCallback,"Games",$scope.newGameModel);
	    
	}

        //a callback function for saving type,name and createdBy in games table
        $scope.saveNewIntroCallback = function(result, error) {
            //pnotify an extrnal moudle that takes place after saving game type,name,createdBy in parse
            if(result){
                $rootScope.currentGame.push(result);
                new PNotify({
                    title: 'איזה יופי!!!! משחק ההכרות שלך נשמר בהצלחה',
                    type: 'success',
                    width: "300px",
                    delay: "3000"
                });
		$scope.$apply($location.path('Games_Manage/My_Games'));
            }else if(error){
                new PNotify({
                    title: 'אוי לא!!!',
                    text: 'משהו לא הסתדר כמו שהיינו רוצים אנא נסה ליצור משחק מחדש',
                    type: 'error',
                    width: "300px",
                    delay: "3000"
                });
            }
        }        //this function fires when the user change the rout to my games in order to get all his games form the DB
        // $scope.$on('$routeChangeStart', function(next,prev){
        //     console.log($scope.currentGame);
        //     if($location.path() == '/gamestable/'){
        // 	if($rootScope.currentGame.id == undefined){
        // 	    $location.path('/');
        // 	}else{
        // 	    $location.path('/gamestable');
        // 	}

        //     }
        // });
        //this function save the question and the answers that the user insert from gametable page
    }).
    controller('TourTableCtrl', function ($scope,$rootScope,$location,$sce) {
	// $rootScope.$on('$routeChangeStart', function(next,prev){
	//     console.log("current is:",$rootScope.currentGame);
	//     if(typeof $rootScope.currentGame){
	//     	$location.path('Games_Manage/Create_Game');
	//     }
	// });
	if($rootScope.currentGame == undefined){
            $location.path('Games_Manage/My_Games');
        }
	$scope.tourModel = [];
	$scope.tour = [];
	$scope.tour.drivePath = "";
	$scope.tour.mapPath = "";
	$scope.$watch('tour.drivePath + tour.mapPath',function(newVal,oldVal){
	    if($scope.tour.drivePath == ""){
		$scope.drivePath = false; 
	    }else{	    
		$scope.drivePath = true; 
	    }
	    if($scope.tour.mapPath == ""){
		$scope.mapPath = false; 
	    }else{	    
		$scope.mapPath = true; 
	    }

	});
	$scope.saveNewTour=function(tour){
	    if($scope.mapPath == true && tour.mapPath.match('@')){	    
		var parsePath = tour.mapPath.split('@');
		var cordinate = parsePath[1].split(',');
		$scope.tourModel["latitude"] = parseFloat(cordinate[0]);
		$scope.tourModel["longitude"] = parseFloat(cordinate[1]);
		
	    }
	    if($scope.drivePath == true && tour.drivePath.match('https://docs.google.com/presentation/d/')){
		var tmpDrivePath =  $scope.tour.drivePath.split('https://docs.google.com/presentation/d/');
		var tmpDrivePathHelper = tmpDrivePath[1].split('/');
		$scope.tour.drivePath = tmpDrivePathHelper[0];

	    }
 
            $scope.tourModel["gameId"] = $rootScope.currentGame[0].id;
            $scope.tourModel["presentationLink"] = tour.drivePath;
            parseManager.saveObject($scope.saveNewTourCallback, "WorldTour", $scope.tourModel);
	}
        //a callback function for saving type,name and createdBy in games table
        $scope.saveNewTourCallback = function(result, error) {
            //pnotify an extrnal moudle that takes place after saving game type,name,createdBy in parse
            if(result){
		console.log(result);
                new PNotify({
                    title: 'איזה יופי!!!! הטיול שלך נשמר בהצלחה',
                    type: 'success',
                    width: "300px",
                    delay: "3000"
                });
		$scope.$apply($location.path('Games_Manage/Create_Game'));
            }else if(error){
                new PNotify({
                    title: 'אוי לא!!!',
                    text: 'משהו לא הסתדר כמו שהיינו רוצים אנא נסה ליצור משחק מחדש',
                    type: 'error',
                    width: "300px",
                    delay: "3000"
                });
            }
        }
	$scope.driveClicked = false;
	$scope.mapClicked = false;

	$scope.makSafeUrl = function(path){
	    if(path.match("/edit")){
		var newPath = path.replace('/edit','/embed');
		$scope.modalSrc = $sce.trustAsResourceUrl(newPath);
	    }else{
		$scope.modalSrc = $sce.trustAsResourceUrl(path);

	    }
	    $scope.driveClicked = true;
	    $scope.mapClicked = false;
	}
	$scope.urlToCoordiates = function(url){
	    if($scope.mapPath == true && $scope.tour.mapPath.match('@')){	    
		var parsePath = $scope.tour.mapPath.split('@');
		var cordinate = parsePath[1].split(',');
		$scope.latitude = parseFloat(cordinate[0]);
		$scope.longitude = parseFloat(cordinate[1]);
		$scope.loadStreetView($scope.latitude,$scope.longitude)
	    }
	    
	    $scope.driveClicked = false;
	    $scope.mapClicked = true;
	}
	
	$scope.loadStreetView = function(latitude,longitude)
	{
            var destination = new google.maps.LatLng(latitude,longitude);
            var panoramaOptions = {
		position: destination,
		pov: {
                    heading: 344.2,
                    pitch: 10
		},
		visible: true
            };
            var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
	}
    }).
    controller('GamesTableCtrl', function ($scope, $http, $location, $routeParams, $rootScope) {
        $scope.pencil = false;
         if($rootScope.currentGame == undefined){
             $location.path('Games_Manage/My_Games');
         }
        //array to that hold user input and sending to parse
        $scope.newQuestionModal = [];
        //model that coneected to the user input from the view
        $scope.newQuestionModel = [];
        //array that hold all new records
        $scope.currentGameQuestions = [];
        $scope.questionCounter = 0;
        $scope.saveNewQuestion = function(userInput){
            $scope.newQuestionModel["gameId"] = $rootScope.currentGame[0].id;
            $scope.newQuestionModel["question"] = userInput.question;
            $scope.newQuestionModel["answer1"] = userInput.answer1;
            $scope.newQuestionModel["answer2"] = userInput.answer2;
            $scope.newQuestionModel["answer3"] = userInput.answer3;
            $scope.newQuestionModel["answer4"] = userInput.answer4;
            $scope.newQuestionModel["correctAnswer"] = parseInt(userInput.correctAnswer);
            parseManager.saveObject($scope.saveNewQuestionCallback, "TriviaQuestions", $scope.newQuestionModel);
            console.log($scope.newQuestionModel);
        }
        //new Question modal callback in this function i check if the user input (question, 4 answers and correct answer)
        // is properly saved in DB
        $scope.saveNewQuestionCallback = function(result, error){
            //pnotify an extrnal moudle that takes place after saving game type,name,createdBy in parse
            if(result){
                $scope.newQuestionModel.question = "";
                $scope.newQuestionModel.answer1 = "";
                $scope.newQuestionModel.answer2 = "";
                $scope.newQuestionModel.answer3 = "";
                $scope.newQuestionModel.answer4 =  "";
                $scope.newQuestionModel.correctAnswer =  -1;
                new PNotify({
                    title: 'השאלה שלך נשמרה בהצלחה (; ',
                    text: 'אתה מוכן להוסיף עוד שאלות',
                    type: 'success',
                    width: "300px",
                    delay: "3000"
                });
                $scope.$apply($scope.currentGameQuestions.push(result));
                //add new property to parse obj in order to ditect if the obj is selected or not
                $scope.$apply($scope.currentGameQuestions[$scope.questionCounter].selected = false);
                $scope.questionCounter++;
                console.log($scope.currentGameQuestions);
            }else if(error){
                new PNotify({
                    title: 'אוי לא!!!',
                    text: 'משהו לא הסתדר כמו שהיינו רוצים אנא נסה שאלה מחדש',
                    type: 'error',
                    width: "300px",
                    delay: "3000"
                });
            }
        }

        //this function firs when the usr click on question and change the selected prop to true/false as needed
        $scope.questionClicked = function(index){
            console.log(index);
            if($scope.currentGameQuestions[index].selected == true){
                $scope.currentGameQuestions[index].selected = false;
            }else{
                $scope.currentGameQuestions[index].selected = true;
            }
        }
        // this function delete all the chosen elems from view and DB
        //not working with 2 elem needs to chack
        $scope.multeDeleteGameQuestions = function(){
            var objToDelete = [];
            for(var i=0; i <= $scope.currentGameQuestions.length -1; i++){
                if($scope.currentGameQuestions[i].selected == true)
                {
                    parseManager.deleteObject($scope.multeDeleteGameQuestionsCallback , $scope.currentGameQuestions[i]);
                }
            }
        }
        //parse callback function for delete qusetions
        $scope.multeDeleteGameQuestionsCallback = function(result,error){
            if(result){
                for(var i =0; i <= $scope.currentGameQuestions.length -1; i++){
                    if($scope.currentGameQuestions[i].selected == true){
                        console.log($scope.currentGameQuestions[i]);
                        $scope.questionCounter--;
                        $scope.$apply($scope.currentGameQuestions.splice(i,1));
                    }
                }
            }
        }
        $scope.tmpCurrentGameQuestion = -1;
        //this function connect betwen the chosen qustion and the current question model in order to edit the selected question
        $scope.editSelectedQuestion = function(index){
            $scope.pencil = true;
            $scope.newQuestionModel.question = $scope.currentGameQuestions[index].attributes.question;
            $scope.newQuestionModel.answer1 = $scope.currentGameQuestions[index].attributes.answer1;
            $scope.newQuestionModel.answer2 = $scope.currentGameQuestions[index].attributes.answer2;
            $scope.newQuestionModel.answer3 = $scope.currentGameQuestions[index].attributes.answer3;
            $scope.newQuestionModel.answer4 = $scope.currentGameQuestions[index].attributes.answer4;
            $scope.newQuestionModel.correctAnswer = parseInt($scope.currentGameQuestions[index].attributes.correctAnswer);
            $scope.tmpCurrentGameQuestion = index;

        }
        $scope.saveEditQuestion = function()
        {
            $scope.currentGameQuestions[$scope.tmpCurrentGameQuestion].attributes.question = $scope.newQuestionModel.question;
            $scope.currentGameQuestions[$scope.tmpCurrentGameQuestion].attributes.answer1 = $scope.newQuestionModel.answer1;
            $scope.currentGameQuestions[$scope.tmpCurrentGameQuestion].attributes.answer2 = $scope.newQuestionModel.answer2;
            $scope.currentGameQuestions[$scope.tmpCurrentGameQuestion].attributes.answer3 = $scope.newQuestionModel.answer3;
            $scope.currentGameQuestions[$scope.tmpCurrentGameQuestion].attributes.answer4 = $scope.newQuestionModel.answer4;
            $scope.currentGameQuestions[$scope.tmpCurrentGameQuestion].attributes.correctAnswer = parseInt($scope.newQuestionModel.correctAnswer);
            parseManager.saveObject($scope.saveEditQuestionCallback, "TriviaQuestions", $scope.currentGameQuestions[$scope.tmpCurrentGameQuestion]);
            $scope.pencil = false;
            $scope.newQuestionModel.question = "";
            $scope.newQuestionModel.answer1 = "";
            $scope.newQuestionModel.answer2 = "";
            $scope.newQuestionModel.answer3 = "";
            $scope.newQuestionModel.answer4 =  "";
            $scope.newQuestionModel.correctAnswer =  -1;
        }
        $scope.saveEditQuestionCallback = function(result,error){
            if(result){
                new PNotify({
                    title: 'השאלה שלך נשמרה בהצלחה (; ',
                    text: 'אתה מוכן להוסיף עוד שאלות',
                    type: 'success',
                    width: "300px",
                    delay: "3000"
                });
            }else if(error){
                new PNotify({
                    title: 'אוי לא!!!',
                    text: 'משהו לא הסתדר כמו שהיינו רוצים אנא נסה שאלה מחדש',
                    type: 'error',
                    width: "300px",
                    delay: "3000"
                });
            }
        }
        $scope.cleanModal = function(){
            $scope.newQuestionModel.question = "";
            $scope.newQuestionModel.answer1 = "";
            $scope.newQuestionModel.answer2 = "";
            $scope.newQuestionModel.answer3 = "";
            $scope.newQuestionModel.answer4 =  "";
            $scope.newQuestionModel.correctAnswer = -1;
        }
    }).

    controller('AllGamesTableCtrl', function ($scope, $http, $location, $routeParams, $rootScope) {
        //this function get all trivia games from DB
        $rootScope.initVars("All_Games");
        $scope.allGames = [];
        $scope.getAllGamesCallback = function(result, error){
            if(result){

                $scope.$apply($scope.allGames.push(result));
                $rootScope.numberOfPages=function(){
                    console.log($scope.allGames);
                    return Math.ceil($scope.allGames[0].length/$rootScope.pageSize);
                }
            }else if(error){
                new PNotify({
                    title: 'אוי לא!!!',
                    text: 'משהו לא הסתדר כמו שהיינו רוצים אנא בדוק את חיבור האינטרנט שלך וטען את הדף מחדש',
                    type: 'error',
                    width: "300px",
                    delay: "8000"
                });
            }
        }
        parseManager.getParseObject($scope.getAllGamesCallback , "Games" , null , Parse.User.current(), "createdBy","createdBy");
        $scope.selectedTriviaToImpotIndex  = -1;
        $scope.gameIndex = function(index){
            $scope.selectedTriviaToImpotIndex  = index;
        }

        $scope.importGame = function(newGameName){
            console.log(newGameName);
            console.log($scope.allGames[0][$scope.selectedTriviaToImpotIndex]);
            parseManager.duplicateTriviaGame($scope.importGameCallback, newGameName, $scope.allGames[0][$scope.selectedTriviaToImpotIndex]);
        }

        $scope.importGameCallback = function(result,error){
            if(result){
		$rootScope.itemsCounter++;
                new PNotify({
                    title: 'המשחק נוסף בהצלחה (; ',
                    text: 'על מנת לראות\לערוך את המשחק החדש לך למשחקים שלי',
                    type: 'success',
                    width: "300px",
                    delay: "3000"
                });
            }else if(error){
                new PNotify({
                    title: 'אוי לא!!!',
                    text: 'משהו לא הסתדר כמו שהיינו רוצים אנא נסה שאלה מחדש',
                    type: 'error',
                    width: "300px",
                    delay: "3000"
                });
            }
        }

    }).
    controller('MyGamesTableCtrl', function ($scope, $http, $location, $routeParams, $rootScope) {
        if($scope.selectedGameQuestions == undefined){
            $location.path('Games_Manage/My_Games');
        }
	$rootScope.itemsCounter = 0;
        $rootScope.initVars("My_Games");
        //this function get all trivia games from DB
        // var selectedGameQuestions = localStorageService.get('selectedGameQuestions')
        // var gameId = localStorageService.get('gameId')
        // if(selectedGameQuestions != null && gameId != null){
        //     console.log("sdaasdasda");
        //     $rootScope.selectedGameQuestions = selectedGameQuestions;
        //     console.log("from local storeg",$rootScope.selectedGameQuestions)
        //     $rootScope.gameId = gameId;
        // }
        $rootScope.selectedGameQuestions = [];
        $rootScope.gameId = $routeParams.gameId;
        $rootScope.allMyGames = [];
        $scope.getAllMyGamesCallback = function(result, error){
            if(result){
                $scope.$apply($rootScope.allMyGames.push(result));
                $rootScope.numberOfPages=function(){
                    return Math.ceil($rootScope.allMyGames[0].length/$rootScope.pageSize);
                }
                console.log("all MyGames",$scope.allMyGames);
            }else if(error){
                new PNotify({
                    title: 'אוי לא!!!',
                    text: 'משהו לא הסתדר כמו שהיינו רוצים אנא בדוק את חיבור האינטרנט שלך וטען את הדף מחדש',
                    type: 'error',
                    width: "300px",
                    delay: "8000"
                });
            }
        }

        parseManager.getParseObject($scope.getAllMyGamesCallback , "Games" ,  "createdBy" , Parse.User.current());
        $scope.goToSelectedGame = function(index){
            parseManager.getParseObjectById($scope.getSelectedGameQuestionCallback, "TriviaQuestions", "gameId", $rootScope.allMyGames[0][index].id);
            $rootScope.gameId = index;
            $location.path('/Games_Manage/Edit_My_Game/'+index);

        }

        $scope.getSelectedGameQuestionCallback = function(result,error){
            if(result){
                $scope.$apply($rootScope.selectedGameQuestions.push(result));
                for(var i=0; i<$rootScope.selectedGameQuestions[0].length; i++){
                    $rootScope.selectedGameQuestions[0][i].selected = false;
                }
            }else{
                console.log(error.description);
            }
        }

        $scope.newQuestionModel = [];
        $scope.saveNewQuestion = function(userInput){
            $scope.newQuestionModel["gameId"] = $rootScope.allMyGames[0][$rootScope.gameId].id;
            $scope.newQuestionModel["question"] = userInput.question;
            $scope.newQuestionModel["answer1"] = userInput.answer1;
            $scope.newQuestionModel["answer2"] = userInput.answer2;
            $scope.newQuestionModel["answer3"] = userInput.answer3;
            $scope.newQuestionModel["answer4"] = userInput.answer4;
            $scope.newQuestionModel["correctAnswer"] = parseInt(userInput.correctAnswer);
	    console.log("the new question is:", $scope.newQuestionModel);
            parseManager.saveObject($scope.saveNewQuestionCallback, "TriviaQuestions", $scope.newQuestionModel);
            console.log($scope.newQuestionModel);
        }

	$scope.$watch('newQuestionModel.question + newQuestionModel.answer1 + newQuestionModel.answer2 + newQuestionModel.answer3 + newQuestionModel.answer4 + newQuestionModel.correctAnswer', function(newVal,oldVal){
	    if($scope.newQuestionModel.question != undefined && $scope.newQuestionModel.answer1 != undefined && $scope.newQuestionModel.answer2 != undefined && $scope.newQuestionModel.answer3 != undefined && $scope.newQuestionModel.answer4 != undefined ){
		if($scope.newQuestionModel.correctAnswer != -1){
		    $scope.questionForm.$invalid = false;
		}else{
		    $scope.questionForm.$invalid = true;
		}
	    }
		
	});
        //new Question modal callback in this function i check if the user input (question, 4 answers and correct answer)
        // is properly saved in DB
        $scope.saveNewQuestionCallback = function(result, error){
            //pnotify an extrnal moudle that takes place after saving game type,name,createdBy in parse
            if(result){
                $scope.newQuestionModel.question = "";
                $scope.newQuestionModel.answer1 = "";
                $scope.newQuestionModel.answer2 = "";
                $scope.newQuestionModel.answer3 = "";
                $scope.newQuestionModel.answer4 =  "";
                new PNotify({
                    title: 'השאלה שלך נשמרה בהצלחה (; ',
                    text: 'אתה מוכן להוסיף עוד שאלות',
                    type: 'success',
                    width: "300px",
                    delay: "3000"
                });
                $scope.$apply($scope.selectedGameQuestions[0].push(result));
                $scope.$apply($scope.selectedGameQuestions[0].selected = false);
                //add new property to parse obj in order to ditect if the obj is selected or not
                $scope.questionCounter++;
                console.log($scope.selectedGameQuestions);
            }else if(error){
                new PNotify({
                    title: 'אוי לא!!!',
                    text: 'משהו לא הסתדר כמו שהיינו רוצים אנא נסה שאלה מחדש',
                    type: 'error',
                    width: "300px",
                    delay: "3000"
                });
            }
        }
        //this function firs when the usr click on question and change the selected prop to true/false as needed
        $scope.questionClicked = function(index){
            console.log(index);
            if($scope.selectedGameQuestions[0][index].selected == true){
                $scope.selectedGameQuestions[0][index].selected = false;
            }else{
                $scope.selectedGameQuestions[0][index].selected = true;
                console.log($scope.selectedGameQuestions[0][index]);
            }
        }
        // this function delete all the chosen elems from view and DB
        //not working with 2 elem needs to chack
        $scope.multeDeleteGameQuestions = function(){
            var objToDelete = [];
            for(var i=0; i <= $scope.selectedGameQuestions[0].length -1; i++){
                if($scope.selectedGameQuestions[0][i].selected == true)
                {
                    parseManager.deleteObject($scope.multeDeleteGameQuestionsCallback , $scope.selectedGameQuestions[0][i]);
                }
            }
        }
        //parse callback function for delete qusetions
        $scope.multeDeleteGameQuestionsCallback = function(result,error){
            if(result){
                for(var i =0; i <= $scope.selectedGameQuestions[0].length -1; i++){
                    if($scope.selectedGameQuestions[0][i].selected == true){
                        console.log($scope.selectedGameQuestions[0][i]);
                        $scope.questionCounter--;
                        $scope.$apply($scope.selectedGameQuestions[0].splice(i,1));
                    }
                }
            }
        }
        $scope.tmpCurrentGameQuestion = -1;
        //this function connect betwen the chosen qustion and the current question model in order to edit the selected question
        $scope.editSelectedQuestion = function(index){
            $scope.pencil = true;
            $scope.newQuestionModel.question = $scope.selectedGameQuestions[0][index].attributes.question;
            $scope.newQuestionModel.answer1 = $scope.selectedGameQuestions[0][index].attributes.answer1;
            $scope.newQuestionModel.answer2 = $scope.selectedGameQuestions[0][index].attributes.answer2;
            $scope.newQuestionModel.answer3 = $scope.selectedGameQuestions[0][index].attributes.answer3;
            $scope.newQuestionModel.answer4 = $scope.selectedGameQuestions[0][index].attributes.answer4;
            $scope.newQuestionModel.correctAnswer = parseInt($scope.selectedGameQuestions[0][index].attributes.correctAnswer);
            $scope.tmpCurrentGameQuestion = index;

        }
        $scope.saveEditQuestion = function()
        {
            $scope.selectedGameQuestions[0][$scope.tmpCurrentGameQuestion].attributes.question = $scope.newQuestionModel.question;
            $scope.selectedGameQuestions[0][$scope.tmpCurrentGameQuestion].attributes.answer1 = $scope.newQuestionModel.answer1;
            $scope.selectedGameQuestions[0][$scope.tmpCurrentGameQuestion].attributes.answer2 = $scope.newQuestionModel.answer2;
            $scope.selectedGameQuestions[0][$scope.tmpCurrentGameQuestion].attributes.answer3 = $scope.newQuestionModel.answer3;
            $scope.selectedGameQuestions[0][$scope.tmpCurrentGameQuestion].attributes.answer4 = $scope.newQuestionModel.answer4;
	    $scope.selectedGameQuestions[0][$scope.tmpCurrentGameQuestion].attributes.correctAnswer = parseInt($scope.newQuestionModel.correctAnswer);
	    
            parseManager.saveObject($scope.saveEditQuestionCallback, "TriviaQuestions", $scope.selectedGameQuestions[0][$scope.tmpCurrentGameQuestion]);
            $scope.pencil = false;
            $scope.newQuestionModel.question = "";
            $scope.newQuestionModel.answer1 = "";
            $scope.newQuestionModel.answer2 = "";
            $scope.newQuestionModel.answer3 = "";
            $scope.newQuestionModel.answer4 =  "";
        }
        $scope.saveEditQuestionCallback = function(result,error){
            if(result){
                new PNotify({
                    title: 'השאלה שלך נשמרה בהצלחה (; ',
                    text: 'אתה מוכן להוסיף עוד שאלות',
                    type: 'success',
                    width: "300px",
                    delay: "3000"
                });
            }else if(error){
                new PNotify({
                    title: 'אוי לא!!!',
                    text: 'משהו לא הסתדר כמו שהיינו רוצים אנא נסה שאלה מחדש',
                    type: 'error',
                    width: "300px",
                    delay: "3000"
                });
            }
        }

        $scope.cleanModal = function(){
            $scope.newQuestionModel.question = "";
            $scope.newQuestionModel.answer1 = "";
            $scope.newQuestionModel.answer2 = "";
            $scope.newQuestionModel.answer3 = "";
            $scope.newQuestionModel.answer4 =  "";
            $scope.newQuestionModel.correctAnswer = -1;
        }

        $scope.deleteSelectedGame = function(selectedGame, index){
	    switch(selectedGame.attributes.type) {
	    case "Trivia":
		parseManager.deleteTriviaGame($scope.deleteTriviaGameCallback, selectedGame.id, selectedGame);
		break;
	    case "Tour":
		parseManager.deleteWorldTour($scope.deleteWorldTourCallback,selectedGame);
		break;
	    case "Intro":
                parseManager.deleteObject($scope.deleteWorldTourCallback,selectedGame);
		break;
	    }
            $rootScope.selectedGameToDeleteIndex = index;
        }

        $scope.deleteTriviaGameCallback = function(result,error){
            if(result){
		console.log($scope.allMyGames[0],$rootScope.selectedGameToDeleteIndex);
                $scope.$apply($scope.allMyGames[0].splice($rootScope.selectedGameToDeleteIndex,1));
                new PNotify({
                    title: 'המשחק שלך נמחק בהצלחה',
                    type: 'success',
                    width: "300px",
                    delay: "3000"
                });
            }else if(error){
                new PNotify({
                    title: 'אוי לא!!!',
                    text: 'משהו לא הסתדר כמו שהיינו רוצים אנא נסה שאלה מחדש',
                    type: 'error',
                    width: "300px",
                    delay: "3000"
                });
	    }
	    
	}
        $scope.deleteWorldTourCallback = function(result,error){
	    if(result){
		console.log($scope.allMyGames[0],$rootScope.selectedGameToDeleteIndex);
                $scope.$apply($scope.allMyGames[0].splice($rootScope.selectedGameToDeleteIndex,1));
                new PNotify({
		    title: 'המשחק שלך נמחק בהצלחה',
		    type: 'success',
		    width: "300px",
		    delay: "3000"
                });
	    }else if(error){
                new PNotify({
		    title: 'אוי לא!!!',
		    text: 'משהו לא הסתדר כמו שהיינו רוצים אנא נסה שאלה מחדש',
		    type: 'error',
		    width: "300px",
		    delay: "3000"
                });
	    }
	}	
    });
