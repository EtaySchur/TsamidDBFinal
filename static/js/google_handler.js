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

    // Additional params including the callback, the rest of the params will
    // come from the page-level configuration.
    var additionalParams = {
        'callback': signinCallback
    };

    gapi.auth.signIn(additionalParams); // Will use page level configuration

}

function signinCallback(authResult) {
    if (authResult['status']['signed_in']) {
        console.log("ENERING RESULT!!!!");
        currentUser = authResult;
        // Update the app to reflect a signed in user
        // Hide the sign-in button now that the user is authorized, for example:
        c//onsole.log('result',authResult);
        gapi.client.load('plus','v1', function(){
            var request = gapi.client.plus.people.search({
                'query' : 'etay schur',
                'maxResults' : 5
            });

            request.execute(function(resp) {
                //console.log(resp);
            });
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
        'query' : query
    });

    request.execute(function(resp) {
       callback(resp);
    });
};


function getCurrentUserGoogleProfile (){
   return currentUser;
};







