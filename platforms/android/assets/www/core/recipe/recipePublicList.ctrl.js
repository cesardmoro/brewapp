
app.controller('recipePublicListCtrl', function($scope, $ionicSideMenuDelegate, Recipe, BrewHelper, $state,  $ionicLoading, $ionicPopup, $rootScope) {
   
   	$scope.config = {};
   	$scope.config.limit = 25;
   	$scope.config.skip=0;
   	$scope.config.sort= '-publishDate';
   	$scope.config.searchCriteria = "";
   	$scope.searched = false;


   	$scope.recipes = [];
   	$scope.noMoreItemsAvailable = true;
	$scope.init = function(){
       // var recipes = JSON.parse( window.localStorage.getItem( "recipes" ));
   
       
    	//$scope.updateRecipes();
     	/*if(!recipes || recipes.length ==0) {
        }else{
        	$scope.recipes = recipes;
	        $scope.refreshRecipeDownloadDate();  
        }*/
	}
	/*$scope.search = function(){
		$scope.updateRecipes();
	}*/
	$scope.refreshRecipeDownloadDate = function(){
		if($scope.recipes){
		$scope.recipes.forEach(function(recipe){

		        var rec = JSON.parse( window.localStorage.getItem( "recipe-"+recipe._id ));
				if(!rec) {
					recipe.download_date = false;
				}else{
					recipe.download_date = rec.download_date;
				}
			});
		}
	}
	$scope.updateRecipes = function(newSearch){

		if(!$scope.config.searchCriteria){
			$ionicPopup.show({
			        title: 'Recetas Publicas',
			        template: 'Debe ingresar un criterio de busqueda',
			        buttons: [
   						{ text: 'Aceptar' }, 
   					]
			});
			return;
		}
		$scope.searched = true;
		$ionicLoading.show({
	      template: 'Descargando Listado de Recetas... <ion-spinner icon="lines"></ion-spinner>',
	    });
		Recipe.findPublic($scope.config).$promise.then(function(d){
			 	//window.localStorage.setItem( "recipes", JSON.stringify(d));   
			 	if(d.length<25) $scope.noMoreItemsAvailable = true; 
			 	if(d.length==25) $scope.noMoreItemsAvailable = false;  
			 	if(newSearch){
			 		$scope.recipes = [];
			 	}
			 	$scope.recipes = $scope.recipes.concat(d); 
		 		$scope.$broadcast('scroll.infiniteScrollComplete');
			 	$scope.refreshRecipeDownloadDate();
			 	$ionicLoading.hide(); 
		}, function(d) {
		  $ionicLoading.hide();
		   var user = JSON.parse( window.localStorage.getItem( "user" ));
	      if(user){
		     
		    	$ionicPopup.confirm({
                         title: "Error al descargar el listado de recetas",
                         template: "Desea reintentar o volver?",
                         cancelText: "Volver",
                         okText:"Reintentar",
                 })   
                .then(function(res) { 
                         if(res) {  
                           $scope.updateRecipes();
                         } else {
                            $state.go('recipe');  
                         }
               }); 

	      }else{
	       
	       $state.go('login'); 
	      }
		}); 

	}
	$scope.loadMore= function(){
		$scope.config.skip+= 25;
		$scope.updateRecipes();  
	
		if(false)$scope.noMoreItemsAvailable = true;
	} 
	/*$scope.$on('$ionicView.enter', function() {
	    $scope.refreshRecipeDownloadDate();
	});	*/

	
   $scope.convertColor = function(srm) {
	    return BrewHelper.convertColor(srm);
	};
	$scope.shouldShowDelete = false;
	$scope.shouldShowReorder = false;
	$scope.recipeClick = function(recipe){
		$state.go('tabs.recipeEdit', {"recipeId":recipe._id});
	}

	$scope.init();//go
})
