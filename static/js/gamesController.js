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
            parseManager.saveObject($scope.saveNewTriviaGameCallback,"Games",$scope.newGameModel);
            /*callback function,   tableName, object to save */

        }

        //a callback function for saving type,name and createdBy in games table
        $scope.saveNewTriviaGameCallback = function(result, error) {
            //pnotify an extrnal moudle that takes place after saving game type,name,createdBy in parse
            if(result){
                $scope.newGameModel.gameId = result.id;
                $rootScope.currentGame.push(result);
                //var index = $scope.allGames.indexOf(result);
                new PNotify({
                    title: 'איזה יופי!!!! משחק הטריוויה שלך נשמר בהצלחה',
                    text: 'עכשיו אתה מוכן לשלב הבא! קדימה לעבודה התחל להכניס שאלות',
                    type: 'success',
                    width: "300px",
                    delay: "5000"
                });
                console.log($location.path());
                $scope.$apply($location.path('Games_Manage/Trivia_Table'));
            }else if(error){
                new PNotify({
                    title: 'אוי לא!!!',
                    text: 'משהו לא הסתדר כמו שהיינו רוצים אנא נסה ליצור משחק מחדש',
                    type: 'error',
                    width: "300px",
                    delay: "5000"
                });
            }
        }
        //this function fires when the user change the rout to my games in order to get all his games form the DB
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
                    delay: "5000"
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
                    delay: "5000"
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
        $scope.deleteCurrentGameQuestions = function(){
            var objToDelete = [];
            for(var i=0; i <= $scope.currentGameQuestions.length -1; i++){
                if($scope.currentGameQuestions[i].selected == true)
                {
                    parseManager.deleteObject($scope.deleteCurrentGameQuestionsCallback , $scope.currentGameQuestions[i]);
                }
            }
        }
        //parse callback function for delete qusetions
        $scope.deleteCurrentGameQuestionsCallback = function(result,error){
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
            $scope.currentGameQuestions[$scope.tmpCurrentGameQuestion].attributes.answer4 = parseInt($scope.newQuestionModel.correctAnswer);
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
                    delay: "5000"
                });
            }else if(error){
                new PNotify({
                    title: 'אוי לא!!!',
                    text: 'משהו לא הסתדר כמו שהיינו רוצים אנא נסה שאלה מחדש',
                    type: 'error',
                    width: "300px",
                    delay: "5000"
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
        console.log("allGames");

        $rootScope.initVars("All_Games");
        $scope.allGames = [];
        $scope.getAllGamesCallback = function(result, error){
            if(result){
                console.log("asdasd");
                $scope.$apply($scope.allGames.push(result));
                console.log("all games",$scope.allGames);
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
        parseManager.getParseObject($scope.getAllGamesCallback , "Games" , null , Parse.User.current(), "createdBy" );

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
                console.log("משחק שוכפל צריך לראות הודעה");
                new PNotify({
                    title: 'המשחק נוסף בהצלחה (; ',
                    text: 'על מנת לראות\לערוך את המשחק החדש לך למשחקים שלי',
                    type: 'success',
                    width: "300px",
                    delay: "5000"
                });
            }else if(error){
                new PNotify({
                    title: 'אוי לא!!!',
                    text: 'משהו לא הסתדר כמו שהיינו רוצים אנא נסה שאלה מחדש',
                    type: 'error',
                    width: "300px",
                    delay: "5000"
                });
            }
        }

    }).
    controller('MyGamesTableCtrl', function ($scope, $http, $location, $routeParams, $rootScope) {
        if($scope.selectedGameQuestions == undefined){
            $location.path('Games_Manage/My_Games');
        }

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

        parseManager.getParseObject($scope.getAllMyGamesCallback , "Games" ,  "createdBy" , Parse.User.current(),null );
        $scope.goToSelectedGame = function(index){
            parseManager.getParseObjectById($scope.getSelectedGameQuestionCallback, "TriviaQuestions", "gameId", $rootScope.allMyGames[0][index].id);
            $rootScope.gameId = index;
//	    localStorageService.add('gameId',$rootScope.gameId);
            console.log();
            $location.path('/Games_Manage/Edit_My_Game/'+index);

        }

        $scope.getSelectedGameQuestionCallback = function(result,error){
            if(result){
                $scope.$apply($rootScope.selectedGameQuestions.push(result));
                for(var i=0; i<$rootScope.selectedGameQuestions[0].length; i++){
                    $rootScope.selectedGameQuestions[0][i].selected = false;
                }
                console.log("result:",result,"selected questions", $rootScope.selectedGameQuestions);
                //localStorageService.add('selectedGameQuestions',$rootScope.selectedGameQuestions);

            }else{
                console.log(error.description);
            }
        }

        $scope.newQuestionModel = [];

        $scope.saveNewQuestion = function(userInput){
            console.log(userInput);
            $scope.newQuestionModel["gameId"] = $rootScope.allMyGames[0][$rootScope.gameId].id;
            $scope.newQuestionModel["question"] = userInput.question;
            $scope.newQuestionModel["answer1"] = userInput.answer1;
            $scope.newQuestionModel["answer2"] = userInput.answer2;
            $scope.newQuestionModel["answer3"] = userInput.answer3;
            $scope.newQuestionModel["answer4"] = userInput.answer4;
            $scope.newQuestionModal["correctAnswer"] = userInput.correctAnswer;
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
                new PNotify({
                    title: 'השאלה שלך נשמרה בהצלחה (; ',
                    text: 'אתה מוכן להוסיף עוד שאלות',
                    type: 'success',
                    width: "300px",
                    delay: "5000"
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
                    delay: "5000"
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
        $scope.deleteCurrentGameQuestions = function(){
            var objToDelete = [];
            for(var i=0; i <= $scope.selectedGameQuestions[0].length -1; i++){
                if($scope.selectedGameQuestions[0][i].selected == true)
                {
                    parseManager.deleteObject($scope.deleteCurrentGameQuestionsCallback , $scope.selectedGameQuestions[0][i]);
                }
            }
        }
        //parse callback function for delete qusetions
        $scope.deleteCurrentGameQuestionsCallback = function(result,error){
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
            $scope.tmpCurrentGameQuestion = index;

        }
        $scope.saveEditQuestion = function()
        {
            $scope.selectedGameQuestions[0][$scope.tmpCurrentGameQuestion].attributes.question = $scope.newQuestionModel.question;
            $scope.selectedGameQuestions[0][$scope.tmpCurrentGameQuestion].attributes.answer1 = $scope.newQuestionModel.answer1;
            $scope.selectedGameQuestions[0][$scope.tmpCurrentGameQuestion].attributes.answer2 = $scope.newQuestionModel.answer2;
            $scope.selectedGameQuestions[0][$scope.tmpCurrentGameQuestion].attributes.answer3 = $scope.newQuestionModel.answer3;
            $scope.selectedGameQuestions[0][$scope.tmpCurrentGameQuestion].attributes.answer4 = $scope.newQuestionModel.answer4;
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
                    delay: "5000"
                });
            }else if(error){
                new PNotify({
                    title: 'אוי לא!!!',
                    text: 'משהו לא הסתדר כמו שהיינו רוצים אנא נסה שאלה מחדש',
                    type: 'error',
                    width: "300px",
                    delay: "5000"
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
            parseManager.deleteTriviagame($scope.deleteTriviaGameCallback, selectedGame.id, selectedGame);
            $scope.selectedTriviaToDeleteIndex = index;
        }

        $scope.deleteTriviaGameCallback = function(result,error){
            if(result){
                console.log("מחיקת משחק",$rootScope.allMyGames[0]);
                $scope.$apply($scope.allMyGames[0].splice($rootScope.selectedTriviaToDeleteIndex,1));
                new PNotify({
                    title: 'המשחק שלך נמחק בהצלחה',
                    type: 'success',
                    width: "300px",
                    delay: "5000"
                });
            }else if(error){
                new PNotify({
                    title: 'אוי לא!!!',
                    text: 'משהו לא הסתדר כמו שהיינו רוצים אנא נסה שאלה מחדש',
                    type: 'error',
                    width: "300px",
                    delay: "5000"
                });
            }
        }
    });
