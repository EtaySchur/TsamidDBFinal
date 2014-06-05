/**
 * Created by etayschur on 5/20/14.
 */



var currentUser;


(function() {

    var po = document.createElement('script');
    po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/client:plusone.js?onload=render';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);
})();

/* Executed when the APIs finish loading */
function render() {
    console.log('RENDERING PARSE ADMIN');
    // Additional params including the callback, the rest of the params will
    // come from the page-level configuration.
    var additionalParams = {
        'callback': fuadCallback
    };

    gapi.auth.signIn(additionalParams); // Will use page level configuration

}


function signinCallback(authResult) {
    console.log('CALLBACK GOOGLE Parse admin');
    if (authResult['status']['signed_in']) {
        console.log('Constructing (NEW) Parse MAnager');
        parseManager.setGoogleProfileCurrentUser(authResult);
        console.log("Getting current Goggle User");
        console.log(parseManager.getGoogleProfileCurrentUser());

        console.log("ENERING RESULT!!!!");

        // Update the app to reflect a signed in user
        // Hide the sign-in button now that the user is authorized, for example:
        //onsole.log('result',authResult);
        gapi.client.load('plus','v1', function(){
            var request = gapi.client.plus.people.get( {'userId' : 'me'} );
            request.execute(loadProfileCallback);

            function loadProfileCallback (result){
                console.log("TODO PARSE SIGN IN HERE");
                console.log("GETTING GOOGLE USER");
                console.log(result);
                parseManager.setGoogleProfileCurrentUser(result);

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
}



function googlePlusSearch ( callback , query ){
    var request = gapi.client.plus.people.search({
        'query' : query,
        'maxResults' : 5
    });

    request.execute(function(resp) {
       callback(resp);
    });
};


function getCurrentUserGoogleProfile (){
   return currentUser;
};


function getGoogleInfo (callback , googleId){
    var request = gapi.client.plus.people.get( {'userId' : 'me'} );
    request.execute(loadProfileCallback);

    function loadProfileCallback (result) {
        console.log("TODO PARSE SIGN IN HERE");
        console.log("GETTING GOOGLE USER");
        console.log(result);
        callback(result);

    };
};







