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







