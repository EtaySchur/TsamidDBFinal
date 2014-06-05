<?php
/*
 * Copyright 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
session_start();

set_include_path("src/" . PATH_SEPARATOR . get_include_path());
require_once 'Google/Client.php';
require_once 'Google/Service/Urlshortener.php';
require_once 'Google/Service/Plus.php';
//require_once 'php/google-signin.php'

?>

<!doctype html>
<html lang="en" ng-app="myApp" ng-controller="MainController">
<head>
    <meta charset="UTF-8">
    <title>Angular Management</title>
    <meta name="google-signin-clientid" content="929183822302-1uci18s700c7sq3062gg85vopep2ione.apps.googleusercontent.com" />
    <meta name="google-signin-scope" content="https://www.googleapis.com/auth/plus.login" />
    <meta name="google-signin-scope" content="https://www.googleapis.com/auth/plus.me" />
    <meta name="google-signin-scope" content="https://www.googleapis.com/auth/plus.profile.emails.read" />
    <meta name="google-signin-requestvisibleactions" content="http://schemas.google.com/AddActivity" />
    <meta name="google-signin-cookiepolicy" content="single_host_origin" />
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js">
    </script>
    <script src="//apis.google.com/js/client:plusone.js"></script>
    <script src="http://www.parsecdn.com/js/parse-1.2.15.min.js"></script>
    <script src="static/js/pnotify.custom.min.js"></script>
    <script src="static/js/alerts.js"></script>
    <script src="static/js/parse.js"></script>
    <script src="static/js/parse_admin.js"></script>
    <script src="static/js/bootstrap.js"></script>
    <script src="static/js/angular.min.js"></script>
    <script src="static/js/angular-animate.min.js"></script>
    <script src="static/js/angular-route.min.js"></script>
    <script src="static/js/app.js"></script>
    <script src="static/js/controllers.js"></script>
    <script src="static/js/google_handler.js"></script>

    <link rel="stylesheet" href="static/css/pnotify.custom.min.css">
    <link rel="stylesheet" href="static/css/zocial.css">
    <link rel="stylesheet" href="static/css/style.css">
    <link rel="stylesheet" href="static/css/bootstrap.css">
    <link rel="stylesheet" href="static/css/bootstrap-theme.css">

</head>
<body>
<div class="box">
    <div ng-show="googleSignInButton" class="request">
            <a class='g-signin zocial googleplus' href='<?php echo $authUrl; ?>'>Sign In</a>
    </div>
</div>



<div  ng-show="mainApplicationView" ng-init="verifyUser('Etay Schur' , '106491051853698546810')" class="wrapper">
<!--     <div ng-show="mainPage = true" ng-init="verifyUser('<?php //echo $me->id; ?>' , '<?php //echo $me->displayName; ?>')" class="wrapper"> -->
        <div class="header row">
            <!--  <h1 class="col-md-8 col-md-offset-4" id="admin_title"> Tsamid Admin App </h1> -->
            <ul class="nav nav-pills col-md-13 col-md-offset-1" id="admin_top_menu">
                <li ng-click="initVars()" ng-class="{ active: isActive('/Lessons_Manage') }"
                    class="menu_category col-md-2"><a href="#/Lessons_Manage">Manage Lessons</a></li>
                <li ng-click="initVars()" ng-class="{ active: isActive('/Users_Manage') }"
                    class="menu_category col-md-2" id="manage_users"><a href="#/Users_Manage">Manage Users</a></li>
                <li ng-click="initVars()" ng-class="{ active: isActive('/Games_Manage') }"
                    class="menu_category col-md-2" id="manage_games"><a href="#/Games_Manage">Games Zone</a></li>
                <li ng-click="initVars()" ng-class="{ active: isActive('/Groups_Manage') }"
                    class="menu_category col-md-2" id="manage_groups"><a href="#/Groups_Manage">Manage Groups</a></li>
                <li ng-click="initVars()" ng-class="{ active: isActive('/Content_Manage') }"
                    class="menu_category col-md-2" id="manage_content"><a href="#/Content_Manage">Manage Content</a>
                </li>
                <li ng-show="showAdminTabs" ng-click="initVars()" ng-class="{ active: isActive('/System_Admin') }"
                    class="menu_category col-md-2" id="manage_admins"><a href="#/System_Admin">System Admin</a>
                </li>
                <li ng-show="showAdminTabs" ng-click="initVars()" ng-class="{ active: isActive('/Manage_Favorites') }"
                    class="menu_category col-md-2" id="manage_admins">
                    <div class="dropdown">
                        <button class="btn dropdown-toggle sr-only" type="button" id="dropdownMenu1" data-toggle="dropdown">
                            Dropdown
                            <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
                            <li role="presentation"><a href="#/Manage_Favorites">Manage Favorites</a></li>
                        </ul>
                    </div>
                </li>

            </ul>
            <a class='logout btn btn-danger col-md-1' href='?logout'> LogOut</a>
        </div>
    <div class="global_details row">

        <div class="col-md-3">Logged in as : {{currentUser.attributes.username}}</div>

    </div>



        <div  class="main" ng-view></div>
        <div class="alert_section col-md-14 col-md-offset-1">
            <div>
            </div>
        </div>



            <div ng-show="googleSigninButton"> Please Log In</div>

    </div>
    <div ng-show="errorPage" class="error_page">
        You Are Not Allowed To Access , Please Contact Admin
    </div>
</body>
</html>