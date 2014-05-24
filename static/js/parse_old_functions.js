

//THE FUNCTIONS ON THIS FILE ARE DEPRECATED!!!

//DON'T USE THEM!!!



function testFavorites()
{
    var user = Parse.User.current();
    getUserFavorites(call, user);
    createNewFavorite(call2, "music", "music-3.svg", "song3")

    function call(arr)
    {
        console.log("after get favorite function...");
        console.log(arr);
    }

    function call2(favoriteId, error){
        if (favoriteId)
        {
            addFavoriteToUser(call3, favoriteId, user);
        }
    }

    function call3(succsess)
    {
        if (succsess){
            console.log("add to user...");
            getUserFavorites(call, user);
        }
    }
}

 /**
 * Adding the user new favorite food
 */
function addFavoriteFoodToUser (food, user)
{
    var favoriteFoodArray = new Array();
    favoriteFoodArray = user.getFavoriteFood();
    favoriteFoodArray.push(food); // This will add the favorite food to the local user object

    Parse.User.current().set("favoriteFood", favoriteFoodArray, null);
    Parse.User.current().save().then(
        function(food) {
            console.log('Favorite food was added');
        },
        function(error) {
            console.log('Favorite food was not added, with error code: ' + error.description);
        }
    );
}

/**
 * Adding the user new favorite music
 */
function addFavoriteMusicToUser (music, user)
{
    var musicArray = new Array();
    musicArray = user.getFavoriteMusic();
    musicArray .push(music); // This will add the favorite music to the local user object

    Parse.User.current().set("favoriteMusic", musicArray, null);
    Parse.User.current().save().then(
        function(music) {
            console.log('Favorite music was added');
        },
        function(error) {
            console.log('Favorite music was not added, with error code: ' + error.description);
        }
    );
}

/**
 * Adding the user new favorite movies
 */
function addFavoriteMoviesToUser (movies, user)
{
    var moviesArray = new Array();
    moviesArray = user.getFavoriteMovies();
    moviesArray .push(movies); // This will add the favorite movies to the local user object

    Parse.User.current().set("favoriteMovies", moviesArray, null);
    Parse.User.current().save().then(
        function(movies) {
            console.log('Favorite movies was added');
        },
        function(error) {
            console.log('Favorite movies was not added, with error code: ' + error.description);
        }
    );
}

/**
 * Adding the user new favorite animals
 */
function addFavoriteAnimalsToUser (animals, user)
{
    var animalsArray = new Array();
    animalsArray = user.getFavoriteAnimals();
    animalsArray .push(animals); // This will add the favorite animals to the local user object

    Parse.User.current().set("favoriteAnimals", animalsArray, null);
    Parse.User.current().save().then(
        function(animals) {
            console.log('Favorite animals was added');
        },
        function(error) {
            console.log('Favorite animals was not added, with error code: ' + error.description);
        }
    );
}

/**
 * Adding the user new favorite hobbies
 */
function addFavoriteHobbiesToUser (hobbies, user)
{
    var hobbiesArray = new Array();
    hobbiesArray = user.getFavoriteHobbies();
    hobbiesArray .push(hobbies); // This will add the favorite hobbies to the local user object

    Parse.User.current().set("favoriteHobbies", hobbiesArray, null);
    Parse.User.current().save().then(
        function(hobbies) {
            console.log('Favorite hobbies was added');
        },
        function(error) {
            console.log('Favorite hobbies was not added, with error code: ' + error.description);
        }
    );
}

/**
 * Retriving the given user favorite food, in the callback function an associative array will be received
 */
function getAllUserFavoriteFood (callback, user) {
    var usersTable = Parse.Object.extend("_User");
    var query = new Parse.Query(usersTable);

    query.get(Parse.User.current().id).then(
        function (parseUser) {
            var foodTable = Parse.Object.extend("Food");
            var query = new Parse.Query(foodTable);

            query.containedIn("objectId", parseUser.get("favoriteFood"));
            query.find().then(
                function (results) {
                    var foodArray = new Array();
                    var path = GLOBAL_PREFIX + LOCAL_FOOD_PATH;

                    for (i in results)
                        foodArray.push({ "id":results[i].id, "path": path + results[i].get("path") }); // Creating the associative array
                    callback(foodArray);
                }
            );
        });
}

/**
 * Retrieving the given user favorite music, in the callback function an associative array will be received
 */
function getAllUserFavoriteMusic (callback, user)
{
    var usersTable = Parse.Object.extend("_User");
    var query = new Parse.Query(usersTable);

    query.get(Parse.User.current().id).then(
        function (parseUser) {
            var musicTable = Parse.Object.extend("Music");
            var query = new Parse.Query(musicTable);

            query.containedIn("objectId", parseUser.get("favoriteMusic"));
            query.find().then(
                function (results) {
                    var musicArray = new Array();
                    var path = GLOBAL_PREFIX + LOCAL_MUSIC_PATH;

                    for (i in results)
                        musicArray.push({ "id":results[i].id, "path": path + results[i].get("path") }); // Creating the associative array
                    callback(musicArray);
                }
            );
        });
}

/**
 * Retrieving the given user favorite movies, in the callback function an associative array will be received
 */
function getAllUserFavoriteMovies (callback, user)
{
    var usersTable = Parse.Object.extend("_User");
    var query = new Parse.Query(usersTable);

    query.get(Parse.User.current().id).then(
        function (parseUser) {
            var movieTable = Parse.Object.extend("Movie");
            var query = new Parse.Query(movieTable);

            query.containedIn("objectId", parseUser.get("favoriteMovies"));
            query.find().then(
                function (results) {
                    var moviesArray = new Array();
                    var path = GLOBAL_PREFIX + LOCAL_MOVIES_PATH;

                    for (i in results)
                        moviesArray.push({ "id":results[i].id, "path": path + results[i].get("path") }); // Creating the associative array
                    callback(moviesArray);
                }
            );
        });
}

/**
 * Retrieving the given user favorite animals, in the callback function an associative array will be received
 */
function getAllUserFavoriteAnimals (callback, user)
{
    var usersTable = Parse.Object.extend("_User");
    var query = new Parse.Query(usersTable);

    query.get(Parse.User.current().id).then(
        function (parseUser) {
            var animalTable = Parse.Object.extend("Animal");
            var query = new Parse.Query(animalTable);

            query.containedIn("objectId", parseUser.get("favoriteAnimals"));
            query.find().then(
                function (results) {
                    var animalsArray = new Array();
                    var path = GLOBAL_PREFIX + LOCAL_ANIMALS_PATH;

                    for (i in results)
                        animalsArray.push({ "id":results[i].id, "path": path + results[i].get("path") }); // Creating the associative array
                    callback(animalsArray);
                }
            );
        });
}

/**
 * Retrieving the given user favorite hobbies, in the callback function an associative array will be received
 */
function getAllUserFavoriteHobbies (callback, user)
{
    var usersTable = Parse.Object.extend("_User");
    var query = new Parse.Query(usersTable);

    query.get(Parse.User.current().id).then(
        function (parseUser) {
            var hobbyTable = Parse.Object.extend("Hobby");
            var query = new Parse.Query(hobbyTable);

            query.containedIn("objectId", parseUser.get("favoriteHobbies"));
            query.find().then(
                function (results) {
                    var hobbiesArray = new Array();
                    var path = GLOBAL_PREFIX + LOCAL_HOBBIES_PATH;

                    for (i in results)
                        hobbiesArray.push({ "id":results[i].id, "path": path + results[i].get("path") }); // Creating the associative array
                    callback(hobbiesArray);
                }
            );
        });
}









