app.controller('RecipeEdiCtrl', ['$scope', '$rootScope' , '$sce', '$stateParams' , function ($scope, $rootScope, $sce,$stateParams) {
	$scope.user = $rootScope.user; 
  
	$scope.editRecipeUrl = $sce.trustAsResourceUrl("http://brew-o-matic.com.ar/#/recipe/edit/"+$stateParams.recipeId+"?googleId="+$scope.user.google_id+"&name="+encodeURI($scope.user.name));
	

}]);
