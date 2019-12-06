
app.controller('RecipeListCtrl', function($scope, $ionicSideMenuDelegate, Recipe, BrewHelper, $state,  $ionicLoading, $ionicPopup, $rootScope) {
    $scope.title = "Mis recetas";

	$scope.init = function(){ 

		if($state.current.name == "tabs.colaborate"){
			 $scope.title = "Colaboraciones";
		 	$scope.colaborate = "colaborate";
		}else{ 
			$scope.colaborate = "";
		}

        var recipes = JSON.parse( window.localStorage.getItem( "recipes"+$scope.colaborate ));
        if(!recipes || recipes.length ==0) { 
        	$scope.updateRecipes();
        }else{
        	$scope.recipes = recipes;
	        $scope.refreshRecipeDownloadDate(); 
        }
	}
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
	$scope.updateRecipes = function(){
		var recipePromise;
	    if($state.current.name == "tabs.colaborate"){
	    	 $scope.title = "Colaboraciones";

	    	 recipePromise = Recipe.findCollaborated();
	    }else{
	    	recipePromise = Recipe.query(); 
	    }
		$ionicLoading.show({
	      template: 'Descargando Listado de Recetas... <ion-spinner icon="lines"></ion-spinner>',
	    });

		recipePromise.$promise.then(function(d){
			 	window.localStorage.setItem( "recipes"+$scope.colaborate, JSON.stringify(d));   
			 	$scope.recipes = d;
			 	$scope.refreshRecipeDownloadDate();
			 	$ionicLoading.hide();
		}, function(d) {
		  $ionicLoading.hide();
		   var user = JSON.parse( window.localStorage.getItem( "user" ));
	      if(user){
		     
		    	$ionicPopup.confirm({
                         title: "Error al descargar el listado de recetas",
                         template: "Desea reintentar o volver al login?",
                         cancelText: "Login",
                         okText:"Reintentar",
                 })   
                .then(function(res) { 
                         if(res) {  
                           $scope.updateRecipes();
                         } else {
                            $state.go('login');  
                         }
               }); 

	      }else{
	       
	       $state.go('login'); 
	      }
		}); 

	}
	$scope.$on('$ionicView.enter', function() {
	    $scope.refreshRecipeDownloadDate();
	    if($scope.new){
	    	$scope.new = false;
	    	$scope.updateRecipes();
	    }
	});	

	
   $scope.convertColor = function(srm) {
	    return BrewHelper.convertColor(srm);
	};
	$scope.shouldShowDelete = false;
	$scope.shouldShowReorder = false;
	$scope.recipeClick = function(recipe){
		$state.go('tabs.recipeDetail', {"recipeId":recipe._id});
	}

	$scope.newRecipe = function(){
		if($rootScope.checkConection()){
           	$scope.new = true;
			$state.go('tabs.newRecipe'); 
        }else{
            var confirmPopup = $ionicPopup.alert({
                                     title: "Error Editar",
                                     template: "Para editar la receta necesita tener conexion a internet"
                             })   
        }
	
	}
	$scope.init();//go
})
