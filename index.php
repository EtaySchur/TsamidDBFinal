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
<html dir="rtl" lang="en" ng-app="myApp" ng-controller="MainController">
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
    <script src="static/js/parse-1.2.15.min.js"></script>
    <script src="static/js/pnotify.custom.min.js"></script>

    <script src="static/js/alerts.js"></script>
    <script src="static/js/parse.js"></script>
    <script src="static/js/parse_admin.js"></script>
    <script src="static/js/bootstrap.js"></script>
    <script src="static/js/angular.min.js"></script>
    <script data-require="ng-table@*" data-semver="0.3.0" src="http://bazalt-cms.com/assets/ng-table/0.3.0/ng-table.js"></script>
    <script src="static/js/angular-animate.min.js"></script>
    <script src="static/js/angular-route.min.js"></script>
    <script src="static/js/app.js"></script>
    <script src="static/js/controllers.js"></script>
    <script src="static/js/gamesController.js"></script>
    <script src="static/js/google_handler.js"></script>
    <script src="static/js/custom.app.js"></script>


    <link rel="stylesheet" href="static/css/bootstrap.css">
    <link rel="stylesheet" href="static/css/bootstrap-theme.css">
    <link rel="stylesheet" href="static/css/app.css">
    <link rel="stylesheet" href="static/css/holder.css">
    <link rel="stylesheet" href="static/css/pnotify.custom.min.css">
    <link rel="stylesheet" href="static/css/zocial.css">
    <link rel="stylesheet" href="static/css/style.css">


</head>
<body>
<div class="box">
    <div ng-show="googleSignInButton" class="request">
            <a class='g-signin zocial googleplus' href='<?php echo $authUrl; ?>'>Sign In</a>
    </div>
</div>



<div  ng-show="mainApplicationView"  ng-init="verifyUser('Etay Schur','106491051853698546810')" class="wrapper">
<!--     <div ng-show="mainPage = true" ng-init="verifyUser('<?php //echo $me->id; ?>' , '<?php //echo $me->displayName; ?>')" class="wrapper"> -->
        <div class="header row">
            <div class="organization_image col-md-2">
                <img class="organization_logo" ng-src="static/images/tribatree.svg">
            </div>

            <div class="middle-row col-md-9">
                <h1> Tsamid CMS </h1>
                <!--  <h1 class="col-md-8 col-md-offset-4" id="admin_title"> Tsamid Admin App </h1> -->
                <ul class="nav nav-tabs row" id="admin_top_menu">
                    <li ng-click="initVars('Lessons')" ng-class="{ active: isActive('/Lessons_Manage') }"
                        class="menu_category"><a class="menu_category_link" href="#/Lessons_Manage"> <h4>שיעורים</h4></a></li>
                    <li ng-click="initVars('Users')" ng-class="{ active: isActive('/Users_Manage') }"
                        class="menu_category" id="manage_users"><a class="menu_category_link" href="#/Users_Manage"> <h4>משתמשים</h4></a></li>
                    <li ng-click="initVars('Games')" ng-class="{ active: isActive('/Games_Manage') }"
                        class="menu_category" id="manage_games"><a class="menu_category_link" href="#/Games_Manage/Create_Game"> <h4>משחקים</h4></a></li>
                    <li ng-click="initVars('Groups')" ng-class="{ active: isActive('/Groups_Manage') }"
                        class="menu_category" id="manage_groups"><a class="menu_category_link" href="#/Groups_Manage"><h4>קבוצות</h4></a></li>
                    <li ng-click="initVars('Content')" ng-class="{ active: isActive('/Content_Manage') }"
                        class="menu_category" id="manage_content"><a class="menu_category_link" href="#/Content_Manage"><h4>תכנים</h4></a>
                    </li>
                    <li ng-show="showAdminTabs" ng-click="initVars('Organizations')" ng-class="{ active: isActive('/System_Admin') }"
                        class="menu_category" id="manage_admins"><a class="menu_category_link" href="#/System_Admin/Organizations"><h4>מערכת</h4></a>
                    </li>
                </ul>
            </div>
            <div class="right-row col-md-5">
                    <div class="user_details">
                        <div align="right" class="wellcome_text col-md-16"> Wellcome , {{currentUser.attributes.username}}</div>
                        <div align="right" class="logout_button col-md-16">  <button type="button" class="btn-xs btn-danger navbar-btn">
                              Logout
                            </button> </div>
                    </div>
            </div>
        </div>





    <div class="row page_top_menu">

        <div class="col-md-7 col-md-offset-1 page_top_menu_item">
            <ul class="nav inpage_tabs nav-pills list-group btn-group">
                <li  class="page_tab" ng-class="{ active: isPageTabActive(item.name)}" ng-click="initVars(item.name)" ng-repeat="item in pageTabs">
                   <a href={{item.url}}>   {{item.name}} </a>
                </li>
            </ul>
            </div>
        <div class="col-md-4 page_top_menu_item">
            <div class="input-group">

                <select  ng-model="itemsOrder" class="form-control">
                    <option ng-repeat="item in sortItems" value="{{item.value}}">{{item.title}}</option>
                </select>
                <span class="input-group-btn">
        <button ng-click="direction = !direction" class="btn btn-default" type="button"><span
                class="glyphicon glyphicon-sort">   </span></button>
      </span>
            </div>
            <!-- /input-group -->
        </div>
        <!-- /.col-lg-6 -->


        <div class="col-md-4 page_top_menu_item">
            <div class="input-group">
                <input type="text" ng-model="query" class="form-control" placeholder="חיפוש">
                <span class="input-group-addon"> <span class="glyphicon glyphicon-search"></span> </span>

            </div>
        </div>



    </div>
        <div  class="main_app_view" ng-view></div>
        <div class="alert_section col-md-14 col-md-offset-1">
            <div>
            </div>
        </div>



            <div ng-show="googleSigninButton"> Please Log In</div>

    </div>
    <div style="height: 100vh;" ng-show="errorPage" class="error_page">
        <img style="height: 100vh;" class="img-thumbnail col-md-16 col-xs-16" src="static/images/acces_deny.jpeg">
        You Are Not Allowed To Access , Please Contact Admin
    </div>
</body>
</html>