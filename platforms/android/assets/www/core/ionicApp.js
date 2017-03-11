

var app = angular.module('ionicApp', 
  ['ionic',
   'login',
   'ngResource',
   'resources', 
   'login', 
   'helper',
   'env',
   'alerts',
   'calculator',
   'ui.bootstrap',
   'print',
   'ngCordova',
   ])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('login', {
      url: '/login',
      views: {
        'login-view': {
           templateUrl: 'core/login.tpl.html',
           controller: 'LoginController'
        }
      }  
    })
   
    .state('recipe', {
      url: '/recipe',
      views: {
        'home-tab': {
           templateUrl: 'core/recipe/recipe-list.tpl.html',
           controller: 'recipeListCtrl'
        }
      }  
    })//No es hijo de recipe porque si fuera asi tendria que ser una view internior por ionic
    .state('recipeEdit', {
      url: 'recipe/edit/:recipeId',
      views: {
        'home-tab': {
          templateUrl: 'core/recipe/recipe-detail.tpl.html',
          controller: 'RecipeDetailCtrl'
        }
      }
    }).state('recipeFermentables', {
      url: 'recipe/fermentable',
      views: {
        'home-tab': {
          templateUrl: 'core/recipe/recipe-fermentable.tpl.html',
          controller: 'RecipeFermentableCtrl',
          params: {recipe: null}, 
        }
      }
    }).state('recipeLupulo', {
      url: 'recipe/lupulo',
      views: {
        'home-tab': {
          templateUrl: 'core/recipe/recipe-lupulo.tpl.html',
          controller: 'RecipeLupuloCtrl',
        }
      }
    }).state('recipeLevadura', {
      url: 'recipe/levadura',
      views: {
        'home-tab': {
          templateUrl: 'core/recipe/recipe-levadura.tpl.html',
          controller: 'RecipeLevaduraCtrl',
        }
      }
    }).state('recipeOtros', {
      url: 'recipe/otros',
      views: {
        'home-tab': {
          templateUrl: 'core/recipe/recipe-otros.tpl.html',
          controller: 'RecipeOtrosCtrl',
        }
      }
    }).state('recipeAgua', {
      url: 'recipe/agua',
      views: {
        'home-tab': {
          templateUrl: 'core/recipe/recipe-agua.tpl.html',
          controller: 'RecipeAguaCtrl',
        }
      }
    }).state('recipeMash', {
      url: 'recipe/mash', 
      views: {
        'home-tab': {
          templateUrl: 'core/recipe/recipe-mash.tpl.html',
          controller: 'RecipeMashCtrl',
        }
      }
    }).state('recipeHervido', {
      url: 'recipe/hervido',
      views: {
        'home-tab': {
          templateUrl: 'core/recipe/recipe-hervido.tpl.html',
          controller: 'RecipeHervidoCtrl',
        }
      }
    })
    .state('home', {
      url: "/home",
      views: {
        'home-tab': {
          templateUrl: "home.html",
          controller: 'HomeTabCtrl'
        }
      }
    }).state('timer', {
      url: '/timer',
      views: {
        'timer-tab': {
           templateUrl: 'core/timer/timer.tpl.html',
           controller: 'timerCtrl' 
        }
      }  
    }).state('info', {
      url: '/info',
      views: {
        'info-tab': {
           templateUrl: 'core/info/info.tpl.html',
           controller: 'infoCtrl' 
        }
      }  
    });

      var user = JSON.parse( window.localStorage.getItem( "user" ));
      if(user){

       $urlRouterProvider.otherwise("recipe");
      }else{

       $urlRouterProvider.otherwise("login");
      }

})

.run(function($rootScope,$filter,$location,BrewCalc,env,color, alertFactory,BrewHelper,$templateCache, $ionicPlatform, WaterReport) {
         $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
              cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
              cordova.plugins.Keyboard.disableScroll(true);


            }
            if (window.StatusBar) {
              // org.apache.cordova.statusbar required
              StatusBar.styleDefault();
            }
            if( window.plugin){ 

                window.plugin.notification.local.onadd = function (id, state, json) {
                  var notification = {
                      id: id,
                      state: state,
                      json: json
                  };
                  $timeout(function() {
                      $rootScope.$broadcast("$cordovaLocalNotification:added", notification);
                  });
              }; 
            }
          });

         //si esta logueado lo guardo en el root 
         var user = JSON.parse( window.localStorage.getItem( "user" ));
        if(user){
            $rootScope.loginSuccess = true;
            $rootScope.user = user; 
        }

        $rootScope.$templateCache = $templateCache;

        $rootScope.BrewCalc = BrewCalc;

        $rootScope.BrewHelper = BrewHelper;


        $rootScope.env = env;

        $rootScope.color = color;

         //preload
        var reports = JSON.parse( window.localStorage.getItem( "waterReport" ));
        if(!reports) {
          WaterReport.query(function(reports) {
            window.localStorage.setItem( "waterReport", JSON.stringify(reports)); 
          });
        }
       

        $rootScope.getAlerts = function() {
            return alertFactory.getAlerts();
        };

        $rootScope.encodeName = function(name) {
            return encodeURIComponent(name);
        };

        $rootScope.sharedUrl = function(_id) {
            return 'http://'+$location.host() + ":" + $location.port() + '/share.html#/' + _id;
        };

        $rootScope.formatDate = function(date) {
            return util.formatDate(date, $filter('date'));
        };

        $rootScope.round = function(value) {
            return Math.round(value);
        };

        $rootScope.round1 = function(value) {
            return BrewHelper.round(value,10);
        };

        $rootScope.round2 = function(value) {
            return BrewHelper.round(value,100);
        };
    })
.controller('NavCtrl', function($scope, $ionicSideMenuDelegate) {
  $scope.showMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.showRightMenu = function () {
    $ionicSideMenuDelegate.toggleRight();
  };
})
.controller('HomeTabCtrl', function($scope) {
});



