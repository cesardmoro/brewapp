

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
   'ion-floating-menu'
   ])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('login', {
      url: '/login',
      templateUrl: 'core/login.tpl.html',
      controller: 'LoginController'
    }) 
   .state('tabs', {
      url: "/tab",
      abstract: true, 
      templateUrl: "core/tabs.tpl.html"
    })
    .state('tabs.recipe', {
      url: '/recipe',
      views: {
        'home-tab': {
           templateUrl: 'core/recipe/recipe-list.tpl.html',
           controller: 'RecipeListCtrl'
        }
      }   
    })
    .state('tabs.newRecipe', {
      url: '/newrecipe',
      views: {
        'home-tab': {
           templateUrl: 'core/recipe/recipe-new.tpl.html',
           controller: 'RecipeNewCtrl'
        }
      }   
    })
    .state('tabs.colaborate', {
      url: '/colaborate',
      views: {
        'home-tab': {
           templateUrl: 'core/recipe/recipe-list.tpl.html',
           controller: 'RecipeListCtrl'
        }
      }   
    }).state('tabs.favorite', {
      url: '/favorite',
      views: {
        'home-tab': {
           templateUrl: 'core/recipe/recipe-list.tpl.html',
           controller: 'RecipeListCtrl'
        }
      }   
    }).state('tabs.public', {
      url: '/public',
      views: {
        'home-tab': {
           templateUrl: 'core/recipe/recipe-public-list.tpl.html',
           controller: 'RecipePublicListCtrl'
        }
      }   
    })//No es hijo de recipe porque si fuera asi tendria que ser una view internior por ionic
    .state('tabs.recipeDetail', {
      url: '/recipe/detail/:recipeId',
      views: {
        'home-tab': {
          templateUrl: 'core/recipe/recipe-detail.tpl.html',
          controller: 'RecipeDetailCtrl'
        }
      }
    }).state('tabs.recipeEdit', {
      url: '/recipe/edit/:recipeId',
      views: {
        'home-tab': {
          templateUrl: 'core/recipe/recipe-edit.tpl.html',
          controller: 'RecipeEdiCtrl' 
        }
      }
    }).state('tabs.recipeFermentables', {
      url: '/recipe/fermentable',
      views: {
        'home-tab': {
          templateUrl: 'core/recipe/recipe-fermentable.tpl.html',
          controller: 'RecipeFermentableCtrl',
          params: {recipe: null}, 
        }
      }
    }).state('tabs.recipeLupulo', {
      url: '/recipe/lupulo',
      views: {
        'home-tab': {
          templateUrl: 'core/recipe/recipe-lupulo.tpl.html',
          controller: 'RecipeLupuloCtrl',
        }
      }
    }).state('tabs.recipeLevadura', {
      url: '/recipe/levadura',
      views: {
        'home-tab': {
          templateUrl: 'core/recipe/recipe-levadura.tpl.html',
          controller: 'RecipeLevaduraCtrl',
        }
      }
    }).state('tabs.recipeOtros', {
      url: '/recipe/otros',
      views: {
        'home-tab': {
          templateUrl: 'core/recipe/recipe-otros.tpl.html',
          controller: 'RecipeOtrosCtrl',
        }
      }
    }).state('tabs.recipeAgua', {
      url: '/recipe/agua',
      views: {
        'home-tab': {
          templateUrl: 'core/recipe/recipe-agua.tpl.html',
          controller: 'RecipeAguaCtrl',
        }
      }
    }).state('tabs.recipeMash', {
      url: '/recipe/mash', 
      views: {
        'home-tab': {
          templateUrl: 'core/recipe/recipe-mash.tpl.html',
          controller: 'RecipeMashCtrl',
        }
      }
    }).state('tabs.recipeHervido', {
      url: '/recipe/hervido',
      views: {
        'home-tab': {
          templateUrl: 'core/recipe/recipe-hervido.tpl.html',
          controller: 'RecipeHervidoCtrl',
        }
      }
    })
   .state('tabs.timer', {
      url: '/timer',
      views: {
        'timer-tab': {
           templateUrl: 'core/timer/timer.tpl.html',
           controller: 'timerCtrl' 
        }
      }  
    }).state('tabs.calculator', {
      url: '/calculator',
      views: {
        'calculator-tab': { 
           templateUrl: 'core/calculator/calculator-main.tpl.html',
           controller: 'calculatorMainCtrl' 
        }
      }  
    }).state('tabs.calculatomixr', {
      url: '/calculator/mix',
      views: {
        'calculator-tab': { 
          templateUrl: 'core/calculator/calculator-mix.tpl.html',
           controller: 'calculatorMixCtrl' 
        }
      }  
    }).state('tabs.calculatorabv', {
      url: '/calculator/abv',
      views: {
        'calculator-tab': { 
           templateUrl: 'core/calculator/calculator-abv.tpl.html',
           controller: 'calculatorAbvCtrl' 
        }
      }  
    }).state('tabs.calculatorhydro', {
      url: '/calculator/hydro',
      views: {
        'calculator-tab': { 
           templateUrl: 'core/calculator/calculator-hydro.tpl.html',
           controller: 'calculatorHydroCtrl' 
        }
      }  
    }).state('tabs.calculatorrefract', {
      url: '/calculator/refract',
      views: {
        'calculator-tab': { 
           templateUrl: 'core/calculator/calculator-refract.tpl.html',
           controller: 'calculatorRefractCtrl' 
        }
      }  
    }).state('tabs.calculatordilution', {
      url: '/calculator/dilution',
      views: {
        'calculator-tab': { 
           templateUrl: 'core/calculator/calculator-dilution.tpl.html',
           controller: 'calculatorDilutionCtrl' 
        }
      }  
    })
.state('info', {
      url: '/info',
           templateUrl: 'core/info/info.tpl.html',
           controller: 'infoCtrl' 
       
    })
    ;

      var user = JSON.parse( window.localStorage.getItem( "user" ));
      if(user){
       $urlRouterProvider.otherwise("recipe");
      }else{
       $urlRouterProvider.otherwise("login");
      }

})

.run(function($rootScope,$filter,$location,BrewCalc,env,color, $ionicPopup, alertFactory,BrewHelper,$templateCache, $ionicPlatform, WaterReport) {
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
         $rootScope.syncError = function(title, message){
            title = (title) ? title : "Error al sincronizar"; 
            message = (message) ? message :  "Desea continuar sin conexion o reloguear?";
             
             var confirmPopup = $ionicPopup.confirm({
               title: title,
               template: message,
             });  
             return confirmPopup;
            
            
         }
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
       
        $rootScope.checkConection = function(){
              if(window.Connection) {
                  if(navigator.connection.type == Connection.NONE) {
                      return false;
                  } 
              }  
              return true; 
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
.controller('NavCtrl', function($scope, $ionicSideMenuDelegate, $ionicPopup, $rootScope, $state) {

  $scope.showMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.showRightMenu = function () {
    $ionicSideMenuDelegate.toggleRight();
  };
  $scope.logout = function(){

     var confirmPopup = $ionicPopup.confirm({
         title: "Confirmaci&oacute;n logout",
         template: "Esta seguro que desea desloguear su cuenta?",
       }).then(function(res) { 
                   if(res) {  
                      $rootScope.loginSuccess = false;
                      window.localStorage.clear(); 
                       $ionicSideMenuDelegate.toggleLeft();
                      $state.go('login');  
                   } else {
                       $ionicSideMenuDelegate.toggleLeft();
                   }
         });   
  }
  $rootScope.$watch('loginSuccess', function(){
      $scope.loginSuccess = $rootScope.loginSuccess;
  })
})
.controller('HomeTabCtrl', function($scope) {
})
.directive('iframeOnload', [function(){
return {
    scope: {
        callBack: '&iframeOnload'
    },
    link: function(scope, element, attrs){
        element.on('load', function(){
            return scope.callBack();
        })
    }
}}]);


