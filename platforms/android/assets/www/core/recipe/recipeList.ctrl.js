
app.controller('recipeListCtrl', function($scope, $ionicSideMenuDelegate, Recipe, BrewHelper, $state,  $ionicLoading, $ionicPopup, $rootScope) {
  
	$scope.init = function(){
        var recipes = JSON.parse( window.localStorage.getItem( "recipes" ));
        if(!recipes || recipes.length ==0) {
        	$scope.updateRecipes();
        }else{
        	$scope.recipes = recipes;
	        $scope.refreshRecipeDownloadDate();
        }
	}
	$scope.refreshRecipeDownloadDate = function(){
		$scope.recipes.forEach(function(recipe){

		        var rec = JSON.parse( window.localStorage.getItem( "recipe-"+recipe._id ));
				if(!rec) {
					recipe.download_date = false;
				}else{
					recipe.download_date = rec.download_date;
				}
			});
	}
	$scope.updateRecipes = function(){

		$ionicLoading.show({
	      template: 'Descargando Listado de Recetas... <ion-spinner icon="lines"></ion-spinner>',
	    });
		Recipe.query().$promise.then(function(d){
			 	window.localStorage.setItem( "recipes", JSON.stringify(d));   
			 	$scope.recipes = d;
			 	$scope.refreshRecipeDownloadDate();
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
	$scope.$on('$ionicView.enter', function() {
	    $scope.refreshRecipeDownloadDate();
	});	

	
   $scope.convertColor = function(srm) {
	    return BrewHelper.convertColor(srm);
	};
	$scope.shouldShowDelete = false;
	$scope.shouldShowReorder = false;
	$scope.recipeClick = function(recipe){
		$state.go('recipeEdit', {"recipeId":recipe._id});
	}

	$scope.init();//go
})
