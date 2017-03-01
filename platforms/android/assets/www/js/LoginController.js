(function() {

    var index = angular.module('login',['GoogleLoginService']);

    index.run(function($rootScope, $state) {
        
        $rootScope.loginSuccess = false;
        var user = JSON.parse( window.localStorage.getItem( "user" ));
        if(user){
            $rootScope.loginSuccess = true;
            $state.go('recipe');
        }
        // retrieve it
        
    });
 
    index.controller("LoginController",function($scope,$rootScope,User, googleLogin, $state) {
         
        
        $scope.google_data = {};
        $scope.login = function () {
            var promise = googleLogin.startLogin();
            promise.then(function (data) {
                $scope.google_data = data;
                User.getByGoogleId({
                        id:data.google_id,
                        name: data.name
                    },function(user){
                        $rootScope.loginSuccess = true;
                        $state.go('recipe')
                        $rootScope.user = user;
                        window.localStorage.setItem( "user", JSON.stringify(user));  
                    });
            }, function (data) {
                $scope.google_data = data;
            });
        } 
        
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
        $state.go('recipe')
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