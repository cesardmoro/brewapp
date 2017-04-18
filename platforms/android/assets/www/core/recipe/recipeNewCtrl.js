

app.controller('recipeNewCtrl', ['$scope', '$rootScope' , '$sce' , function ($scope, $rootScope, $sce) {
	$scope.user = $rootScope.user; 
 
	$scope.newRecipeUrl = $sce.trustAsResourceUrl("http://brew-o-matic.com.ar/#/recipe/new?googleId="+$scope.user.googleId+"&name="+$scope.user.name);
	document.getElementById("newRecipe").onload = function() {
		/*var ifrm = this.contentWindow || this.contentDocument.document || this.contentDocument;

        var cssLink = document.createElement("link") 
			cssLink.href = "core/recipe/recipe-new.css"; 
			cssLink .rel = "stylesheet";  
			cssLink .type = "text/css"; 
		ifrm.document.body.appendChild(cssLink);
 */
			//ifrm.document.body.appendChild(cssLink); 

    }

}]);
