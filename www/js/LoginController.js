function getAndroidVersion(ua) {
    ua = (ua || navigator.userAgent).toLowerCase(); 
    var match = ua.match(/android\s([0-9\.]*)/);
    return match ? match[1] : false;
};




(function() {
    if(!googleSecrets)googleSecrets.cesarID = ""; console.log('you have to create secrets.js file');
    var index = angular.module('login',['ionic.native']);

    index.run(function($rootScope, $state) {
        
        $rootScope.loginSuccess = false;
        var user = JSON.parse( window.localStorage.getItem( "user" ));
        if(user){
            $rootScope.loginSuccess = true;
            $state.go('tabs.recipe');
        }else {
            $state.go('login');
        }
        // retrieve it
        
    });  
 
    index.controller("LoginController",function($scope,$rootScope,User, $cordovaGooglePlus, $state, $ionicPopup, $http) {
          
        //$scope.oldlogin = (getAndroidVersion()) ? (parseFloat(getAndroidVersion())<49.3) : false;  
        
        $scope.ifLoad=function(){
            if($scope.oldlogin){
                console.log('load') ;
                document.getElementById("oldLogin").contentWindow.angular.element("#MainController").scope()


            }
        }

        $scope.google_data = {}; 
        $scope.loginWithCode = function(){
            var code = angular.element(codeInput).val();
            if(code){   
                $http({method:'GET', url:'http://brew-o-matic.com.ar/user/accessCode/'+code}).then(function(r){
                    if(r.data.google_id){
                        User.getByGoogleId({
                                id:r.data.google_id,
                                name: r.data.name
                            },function(user){
                                $rootScope.loginSuccess = true;
                                $state.go('tabs.recipe')
                                $rootScope.user = user;
                                window.localStorage.setItem( "user", JSON.stringify(user)); 

                            });
                    }else{
                         var confirmPopup = $ionicPopup.alert({
                                     title: "Error Codigo",
                                     template: "El codigo es incorrecto"
                             })   
                    }
                })
                    
            }else{
                 var confirmPopup = $ionicPopup.alert({
                                     title: "Error Codigo",
                                     template: "Ingrese un codigo"
                             })   
    
            }
        }
        $scope.login = function() {
            if(window.plugin){ 
                $cordovaGooglePlus.login({})
                .then(function(data) {
                    $scope.google_data = data;
                    User.getByGoogleId({
                            id:data.userId,
                            name: data.name
                        },function(user){
                            $rootScope.loginSuccess = true;
                            $state.go('tabs.recipe')
                            $rootScope.user = user;
                            window.localStorage.setItem( "user", JSON.stringify(user)); 

                        });
                }, function(err) {
                  console.log('error');
                  console.log(err);
                });
            }else{
                User.getByGoogleId({
                            id:googleSecrets.cesarID,
                            name: "Cesar Daniel Moro"
                        },function(user){
                            $rootScope.loginSuccess = true;
                            $state.go('tabs.recipe')
                            $rootScope.user = user;
                            window.localStorage.setItem( "user", JSON.stringify(user)); 

                        });
            }
          };

        
        $scope.$on('g+login',function(event, authResult) {
            if ( authResult == null ) {
                $rootScope.loginSuccess = true;
                $scope.loginError = '';
                $rootScope.$apply();
            } else if ( authResult['access_token']) {
              // Autorizado correctamente
              // Oculta el botÃ³n de inicio de sesiÃ³n ahora que el usuario estÃ¡ autorizado, por ejemplo:
              //Guardo el token
             // gapi.auth.setToken(authResult);
              
              //Pido los datos del usuario
              gapi.client.load('oauth2', 'v2', function() {
                var request = gapi.client.oauth2.userinfo.get();
                
                request.execute(function (obj){
                    User.getByGoogleId({
                        id:obj.id,
                        name: obj.name
                    },function(user){
                        $rootScope.loginSuccess = true;
        $state.go('tabs.recipe')
                        user.user = user;

                        console.log(user);
                    });
                    
                }); 
              });
              
              //document.getElementById('signinButton').setAttribute('style', 'display: none');
            } else if ( authResult['error'] == "immediate_failed") {
                //$rootScope.loginSuccess = true;
                $scope.loginError = '';
                $rootScope.$apply();
            } else if ( authResult['error'] ) {
                //$rootScope.loginSuccess = true;
                $scope.loginError = authResult['error'];
                $scope.$apply();
                $rootScope.$apply();
                console.log('There was an error: ' + authResult['error']);
            } else {
                //rootScope.loginSuccess = true;
                $scope.loginError = JSON.stringify(authResult);
                $scope.$apply();
                $rootScope.$apply();
                console.log('Error inesperado');
            }
        });

        $scope.googleSignIn = function() {
            googleSignIn();
        };



                
        $scope.notificationClass = '';
        $scope.notificationCount = 0;

        $scope.$watch('user',function(user) {
            if (user) {
                

            }
        });

      
        


    });

})();