app.controller('RecipeNewCtrl', ['$scope', '$rootScope' , '$sce', '$stateParams' , function ($scope, $rootScope, $sce,$stateParams) {
	$scope.user = $rootScope.user; 
 
	$scope.newRecipeUrl = $sce.trustAsResourceUrl("http://brew-o-matic.com.ar/#/recipe/new?googleId="+$scope.user.google_id+"&name="+encodeURI($scope.user.name));
	
}]);