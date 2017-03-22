app.controller('RecipeDetailCtrl', function ($scope, Recipe, $stateParams,$state,  BrewHelper, $rootScope, $ionicLoading, $ionicPopup) {


    $scope.init = function(){ 
        var recipe = JSON.parse( window.localStorage.getItem( "recipe-"+$stateParams.recipeId ));
        if(!recipe) {
            $scope.updateRecipe(); 
        }else{
           $scope.recipe = recipe;  
           $rootScope.recipe = recipe;
        }
    }
    $scope.updateRecipe = function(){
        $ionicLoading.show({
          template: 'Descargando Receta... <ion-spinner icon="lines"></ion-spinner>',
        });
   
        $scope.recipe = Recipe.get({id:$stateParams.recipeId},function() {
                       
                        //Verifico si realmente existe la receta que buscaba
                        if ( $scope.recipe._id ) {
                                $rootScope.recipe = $scope.recipe; 
                                $scope.recipe.download_date = new Date();
                                window.localStorage.setItem( "recipe-"+$scope.recipe._id, JSON.stringify($scope.recipe)); 
                        } else {
                            $scope.errorLoading = true;
                            alertFactory.create('danger','La receta que intentas abrir no existe');
                        }
                         $ionicLoading.hide();

                    }, function(d) {
                            $ionicLoading.hide();

                          var alertPopup = $ionicPopup.alert({
                             title: 'Error al sincronizar',
                             template: 'Intentelo nuevamente'
                           }); 
                          $rootScope.loginSuccess = false;
                          alertPopup.then(function(res) {
                             $state.go('login'); 
                           });
                         });
    }
    $scope.showFermentables = function(){
       $state.go('tabs.recipeFermentables', {recipe: $scope.recipe});


    }
	 $scope.gravityBarValue = function(grav,max) {
        return BrewHelper.toPpg(grav) / max * 100;
    };
    $scope.convertColor = function(srm) {
            return BrewHelper.convertColor(srm);
    };
   $scope.calulateBUGU = function(bu,gu) {
        return bu/BrewHelper.toPpg(gu);
    };
    $scope.round = function(value) {
            return Math.round(value);
        };

        $scope.round1 = function(value) {
            return BrewHelper.round(value,10);
        };

        $scope.round2 = function(value) {
            return BrewHelper.round(value,100);
        };
    $scope.init();//go
})