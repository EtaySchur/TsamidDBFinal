<?php

/************************************************
ATTENTION: Fill in these values! Make sure
the redirect URI is to this page, e.g:
http://localhost:8080/user-example.php
 ************************************************/
$client_id = '929183822302-1uci18s700c7sq3062gg85vopep2ione.apps.googleusercontent.com';
$client_secret = 'T54a4Vc2W58INeJ8g8Z1r76s';
$redirect_uri = 'http://localhost/sites/TsamidDBFinal/index.php';

/************************************************
Make an API request on behalf of a user. In
this case we need to have a valid OAuth 2.0
token for the user, so we need to send them
through a login flow. To do this we need some
information from our API console project.
 ************************************************/
$client = new Google_Client();
$client->setClientId($client_id);
$client->setClientSecret($client_secret);
$client->setRedirectUri($redirect_uri);

// add the wanted services to request
$client->addScope("https://www.googleapis.com/auth/userinfo.profile");
$client->addScope("https://www.googleapis.com/auth/userinfo.email");
$plus = new Google_Service_Plus($client);



/************************************************
When we create the service here, we pass the
client to it. The client then queries the service
for the required scopes, and uses that when
generating the authentication URL later.
 ************************************************/
$service = new Google_Service_Urlshortener($client);

/************************************************
If we're logging out we just need to clear our
local access token in this case
 ************************************************/
if (isset($_REQUEST['logout'])) {
    unset($_SESSION['access_token']);
}

/************************************************
If we have a code back from the OAuth 2.0 flow,
we need to exchange that with the authenticate()
function. We store the resultant access token
bundle in the session, and redirect to ourself.
 ************************************************/
if (isset($_GET['code'])) {
    $auth = $client->authenticate($_GET['code']);
    $_SESSION['access_token'] = $client->getAccessToken();
    $redirect = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'];
    header('Location: ' . filter_var($redirect, FILTER_SANITIZE_URL));
    $token = $_SESSION['access_token'];
    $refresh_token = $token['refresh_token'];
    $client->refreshToken($refresh_token);

}

/************************************************
If we have an access token, we can make
requests, else we generate an authentication URL.
 ************************************************/
if (isset($_SESSION['access_token']) && $_SESSION['access_token']) {
    $client->setAccessToken($_SESSION['access_token']);
} else {
    //$google_token= json_decode($_SESSION['access_token']);
    //$client->refreshToken($google_token->refresh_token);
    //$_SESSION['access_token']= $client->getAccessToken();
    $authUrl = $client->createAuthUrl();
}

/************************************************
If we're signed in and have a request to shorten
a URL, then we create a new URL object, set the
unshortened URL, and call the 'insert' method on
the 'url' resource. Note that we re-store the
access_token bundle, just in case anything
changed during the request - the main thing that
might happen here is the access token itself is
refreshed if the application has offline access.
 ************************************************/
if ($client->getAccessToken() && isset($_GET['url'])) {
    $url = new Google_Service_Urlshortener_Url();
    $url->longUrl = $_GET['url'];
    $short = $service->url->insert($url);
    $_SESSION['access_token'] = $client->getAccessToken();

}

?>

