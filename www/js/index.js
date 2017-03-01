(function() {


    var index = angular.module('index', [
                                'ngResource',
                                'ngRoute',
                                'ngSanitize',
                                'ngAnimate',
                                'data',
                                'resources',
                                'helper',
                                'login',
                                'comments',
                                'googlechart',
                                'calculator',
                                'device',
                                'brew-o-module.controller',
                                'notification',
                                'abm',
                                'gt.abm',
                                'admin',
                                'ui.bootstrap',
                                'alerts',
                                'settings',
                                'water',
                                'env',
                                'observer',
                                'print',
                                'gt.listview',
                                'vr.directives.wordCloud',
                                'ngAudio',
                                'chart.js',
                                'dashboard', 'ionic']);

   index.
        config(['$routeProvider', function($routeProvider) {
            $routeProvider.
                when('/dashboard', {templateUrl: 'partial/dashboard.html',   controller: 'DashboardCtrl'}).
                when('/recipe', {templateUrl: 'partial/recipe-list.html',   controller: 'RecipeListCtrl'}).
                when('/collaborated', {templateUrl: 'partial/recipe-collaborated.html',   controller: 'RecipeCollaboratedCtrl'}).
                when('/favorites', {templateUrl: 'partial/recipe-favorite.html',   controller: 'RecipeFavoriteCtrl'}).
                when('/public', {templateUrl: 'partial/recipe-public.html',   controller: 'RecipePublicCtrl'}).
                when('/home/:userId', {templateUrl: 'partial/user/home.html',   controller: 'HomeCtrl'}).
                when('/recipe/edit/:recipeId', {templateUrl: 'partial/recipe-detail.html', controller: 'RecipeDetailCtrl'}).
                when('/recipe/clone/:recipeId', {templateUrl: 'partial/recipe-detail.html', controller: 'RecipeDetailCtrl'}).
                when('/recipe/new', {templateUrl: 'partial/recipe-detail.html', controller: 'RecipeDetailCtrl'}).
                //when('/stats', {templateUrl: 'partial/user/user-stats.html', controller: 'UserStatsCtrl'}).
                when('/settings/water', {templateUrl: 'partial/user/user-settings-water.html', controller: 'SettingsWaterCtrl'}).
                when('/settings/water/new', {templateUrl: 'partial/user/settings/user-settings-water-detail.html', controller: 'SettingsWaterDetailCtrl'}).
                when('/settings/water/:waterId', {templateUrl: 'partial/user/settings/user-settings-water-detail.html', controller: 'SettingsWaterDetailCtrl'}).
                when('/settings', {templateUrl: 'partial/user/user-settings.html', controller: 'UserSettingsCtrl'}).
                when('/settings/device', {templateUrl: 'partial/device/device.html', controller: 'DeviceController'}).
                when('/calculator', {templateUrl: 'partial/calculator/calculator.html', controller: 'CalculatorCtrl'}).
                when('/notification', {templateUrl: 'partial/user/user-notification.html', controller: 'NotificationsCtrl'}).
                when('/data/:entity', {templateUrl: 'partial/data/abm.html', controller: 'AbmCtrl'}).
                when('/admin/Stats', {templateUrl: 'partial/admin/stats.html', controller: 'AdminCtrl'}).
                when('/admin/:entity', {templateUrl: 'partial/admin/admin.html', controller: 'AdminCtrl'}).
                otherwise({redirectTo: '/dashboard'});
    }]);


    index.config(['abmProvider',function(abmProvider) {
        abmProvider.setTemplateDir('template');
    }]);

    index.controller('NavCtrl', function($scope, $ionicSideMenuDelegate) {
      $scope.showMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
      };
      $scope.showRightMenu = function () {
        $ionicSideMenuDelegate.toggleRight();
      };
    })
    
    index.controller("HomeCtrl",function($scope,$rootScope,User,Recipe,$routeParams) {

        $scope.$watch('user',function() {
            //$scope.notifications = Notification.query($scope.updateCount);
            $scope.viewUser = User.get({id:$routeParams.userId},function() {
                $rootScope.breadcrumbs = [{
                    link: '#',
                    title: 'Home'
                },{
                    link: '#',
                    title: $scope.viewUser.name
                }];
            });

            $scope.recipes = Recipe.findByUser({id:$routeParams.userId});
        });

        $scope.addFavorites = function(recipe) {
            User.addToFavorites(recipe,function(user) {
                $rootScope.user.favorites = user.favorites;
            });
        };

        $scope.removeFavorites = function(recipe) {
            User.removeFromFavorites(recipe,function(user) {
                $rootScope.user.favorites = user.favorites;
            });
        };

    });

    var notification = angular.module("notification",[]);

    notification.factory("notificationData", function() {
        return {
            listener: null,
            reset: function() {
                if ( this.listener ) {
                    this.listener();
                }
            }
        };
    });

    notification.controller("NotificationsCtrl",function($scope,Notification,$rootScope,notificationData) {

        notificationData.reset();

        $scope.updateCount = function(notifications) {
            $scope.countUnread = 0;
            $scope.countNew = 0;
            angular.forEach(notifications, function(not) {
                if ( not.status == 'new') {
                    $scope.countNew++;
                } else if ( not.status == 'unread') {
                    $scope.countUnread++;
                }
            });
        };

        $scope.$watch('user',function() {
            $scope.notifications = Notification.query($scope.updateCount);
        });


        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        },{
            link: '#',
            title: 'Notificaciones'
        }];

        $scope.markAsRead = function(notification) {
            if ( notification.status != 'read' ) {
                notification.status = 'read';
                notification.$save();
                $scope.updateCount($scope.notifications);
            }
        };

        $scope.statusClass = function(notification) {
            if ( notification.status == 'unread') {
                return 'gt-notification-unread';
            } else if ( notification.status == 'new') {
                return 'gt-notification-new';
            }
            return '';
        };

        //$rootScope.notificationCount = 0;
        //$rootScope.notificationClass = '';

    });


    index.controller("MainController",function($scope,$rootScope,User) {
        $rootScope.breadcrumbs = [];

        $scope.login = function() {
            googleSignIn();
        };

        var infos = [{
            text: 'Si tenes 2 minutos, podes rellenar una encuesta sobre uso de Brew-o-Matic.',
            link: {
                text: 'Abrir Encuesta',
                href: 'https://docs.google.com/forms/d/1lCObRGFtB2g3S3jiwwNweNUz5hRrLuyni2zFZz40R58/viewform'
            },
            id: 'closeUseSurvey'
        },{
            text: 'Nueva pagina en Facebook, enterate de las ultimas novedades',
            link: {
                text: 'Ir a la pagina',
                href: 'https://www.facebook.com/brewomatic/timeline'
            },
            id: 'gotoFanPage'
        }];

        $scope.infos = [];

        $scope.closeInfo = function(index) {
            $scope.infos.splice(index,1);
        };

        $scope.closeForEver = function(info, index) {
            $scope.user.settings[info.id] = true;
            User.updateSettings($scope.user, function() {
                $scope.infos.splice(index,1);
            });
        };

        $scope.$watch("user", function(user) {
            if ( user ) {
                //elimino las info que ya cerre desde la configuracion del usuario
                for ( var i=0; i<infos.length; i++ ) {
                    if ( !user.settings[infos[i].id] ) {
                        $scope.infos.push(infos[i]);
                    }
                }
            }
        });
    });


    var alerts = angular.module("alerts",[]);

    alerts.factory("alertFactory", function($rootScope) {
        var alerts = [];
        return {
            create: function(type,text,title) {
                alerts = [];
                var a = {
                    type:  type,
                    text: text,
                    title: title
                };
                alerts.push(a)
                setTimeout(function() {
                    util.Arrays.remove(alerts,a);
                    $rootScope.$apply();
                },5000)
            },
            getAlerts: function() {
                return alerts;
            }
        };
    });



    index.run(function($rootScope,$filter,$location,BrewCalc,env,color,alertFactory,BrewHelper,$templateCache, $ionicPlatform) {
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
          });
        $rootScope.$templateCache = $templateCache;

        $rootScope.BrewCalc = BrewCalc;

        $rootScope.BrewHelper = BrewHelper;


        $rootScope.env = env;

        $rootScope.color = color;

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
    });

    index.factory("Responsive", function($window) {
        return {
            isXs: function() {
                return $window.innerWidth < 768;
            },
            isSm: function() {
                return $window.innerWidth >= 768 && $window.innerWidth < 992;
            },
            isMd: function() {
                return $window.innerWidth >= 992 && $window.innerWidth < 1200;
            },
            isLg: function() {
                return $window.innerWidth >= 1200;
            }
        };
    });

})();
