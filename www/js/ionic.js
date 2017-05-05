"use strict";

function getScript(src) {
    document.write('<' + 'script src="' + src + '"'
            + ' type="text/javascript"><' + '/script>');
}

function getScript2(src) {
    var headID = document.getElementsByTagName("head")[0];
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.src = src;
    headID.appendChild(newScript);

}

/*
 * if load from index.html should be _baseDir === "js". if load from jasmine
 * should be "src".
 *
 * @see pom.xml <srcDirectoryName/> in jasmine configuration
 */
var _IonicbaseDir = (_IonicbaseDir || "core") + "/";

var imports = [ 
                "common/alerts.factory.js", 
                "common/responsive.factory.js", 
                "ionicApp.js", 
                "recipe/RecipeCtrl.js",   
                "recipe/RecipeDetailCtrl.js", 
                "recipe/RecipeListCtrl.js",  
                "recipe/RecipePublicListCtrl.js",  
                "recipe/RecipeFermentableCtrl.js", 
                "recipe/RecipeLupuloCtrl.js",
                "recipe/RecipeLevaduraCtrl.js",  
                "recipe/RecipeOtrosCtrl.js",
                "recipe/RecipeAguaCtrl.js",
                "recipe/RecipeHervidoCtrl.js", 
                "recipe/RecipeMashCtrl.js", 
                "recipe/RecipeNewCtrl.js", 
                "recipe/RecipeEditCtrl.js", 
                "timer/TimerCtrl.js", 
                "info/InfoCtrl.js", 
                "calculator/calculatorMainCtrl.js", 
];

for ( var i = 0; i < imports.length; i++) {
    getScript(_IonicbaseDir + imports[i]);
}
