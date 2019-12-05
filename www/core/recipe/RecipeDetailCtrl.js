app.controller('RecipeDetailCtrl', function ($scope, Recipe, $stateParams,$state,  BrewHelper, $rootScope, $ionicLoading, $ionicPopup) {


    $scope.init = function(){
        var recipe = JSON.parse( window.localStorage.getItem( "recipe-"+$stateParams.recipeId ));
        if(!recipe) {
          $rootScope.updateRecipe($scope);
        }else{
           $scope.recipe = recipe;
           $rootScope.recipe = recipe;
        }
    }
    $scope.updateRecipe = function(){
        $rootScope.updateRecipe($scope);
    }
    $scope.editRecipe = function(recipe){
        if($rootScope.checkConection()){
            $scope.refresh=true;
            $state.go('tabs.recipeEdit', {"recipeId":recipe._id});
        }else{
            var confirmPopup = $ionicPopup.alert({
                                     title: "Error Editar",
                                     template: "Para editar la receta necesita tener conexion a internet"
                             })
        }
    }
    $scope.$on('$ionicView.enter', function() {
        if($scope.refresh){
            $scope.refresh = false;
            $scope.updateRecipe();
        }
    });
    $scope.goList  = function(){
      $state.go('tabs.recipe');
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
