'use strict';

var angularApp = angular.module('angularjsFormBuilderApp', ['ui.bootstrap', '$strap.directives','formAndView.services','ui.tree','ngFileUpload','textAngular','ngRoute']);

angularApp.config(function ($routeProvider,$compileProvider,$locationProvider) {

    $routeProvider
        .when('/main/:Id', {
            templateUrl: 'views/screenPage.html',
            controller: 'BasicExampleCtrl'
        })
        .when('/forms/create', {
            templateUrl: 'views/create.html',
            controller: 'CreateCtrl'
        })
        .when('/forms/:id/view', {
            templateUrl: 'views/view.html',
            controller: 'ViewCtrl'
        })
        .when('/forms/createView/:aId/:sId', {
            templateUrl: 'views/createView.html',
            controller: 'CreateCtrl'
        })
        .when('/forms/createAction/:aId/:sId', {
            templateUrl: 'views/createAction.html',
            controller: 'CreateCtrl'
        })
        .when('/forms/createSequrity/:AId/:SId', {
            templateUrl: 'views/createSequrity.html',
            controller: 'CreateCtrl'
        })
        .when('/forms/createService/:aId/:sId', {
            templateUrl: 'views/createService.html',
            controller: 'CreateCtrl'
        })
        .when('/forms/dataPage/:aId/:sId', {
            templateUrl: 'views/dataPage.html',
            controller: 'CreateCtrl'
        })
        .when('/forms/viewForms', {
            templateUrl: 'views/formList.html',
            controller: 'showFromsDataCtrl'
        })
        .when('/forms/flowInnerPage/:aId/:sId', {
            templateUrl: 'views/formPage.html',
            controller: 'CreateCtrl'
        })
        .when('/forms/flowInnerPageView', {
            templateUrl: 'views/viewPage.html',
            controller: 'CreateCtrl'
        })
        .when('/createApplicationCtrl/:Pid/:Lid', {
            templateUrl: 'views/application.html',
            controller: 'createApplicationCtrl'
        })
        .when('/', {
            templateUrl: 'views/login.html',
            controller: 'createApplicationCtrl'
        })
        .when('/dashBoard', {
            templateUrl: 'views/dashBoard.html',
            controller: 'createApplicationCtrl'
        })
        .when('/multiAppPage/:id', {
            templateUrl: 'views/multiAppPage.html',
            controller: 'createApplicationCtrl'
        })
        .when('/mobileAppImagesControl', {
            templateUrl: 'views/mobileAppImagesControl.html',
            controller: 'mobileAppImagesControlller'
        })
        .when('/appLandinPageBg', {
            templateUrl: 'views/appLandinPageBg.html',
            controller: 'appLandinPageBg'
        })
        .when('/layout/:Id', {
            templateUrl: 'views/layout.html',
            controller: 'mobileAppImagesControlller'
        })
        .when('/newsFeedSection/:Pid/:Lid', {
            templateUrl: 'views/newsFeedSection.html',
            controller: 'mobileAppImagesControlller'
        })
        .when('/pages', {
            templateUrl: 'views/pages.html',
            controller: 'mobileAppImagesControlller'
        })
        .when('/htmlContentSection/:Pid/:Lid', {
            templateUrl: 'views/htmlData.html',
            controller: 'mobileAppImagesControlller'
        })
        .otherwise({
            redirectTo: '/'
        });
         //$compileProvider.debugInfoEnabled(false);
}).constant('BASE_URL', window.appConfig.apiRoot)
.run(['$rootScope',  function() {}])



