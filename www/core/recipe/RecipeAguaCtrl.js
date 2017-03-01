app.controller('RecipeAguaCtrl', function ($scope, Recipe, $stateParams, BrewHelper, $rootScope, WaterReport, BrewCalc ) {
		
        $scope.init = function(){
            var reports = JSON.parse( window.localStorage.getItem( "waterReport" ));
            if(!reports) {
                $scope.updateReport();
            }else{
               $scope.reports = reports;  
            }
        }
        $scope.updateReport = function(){
            WaterReport.query(function(reports) {
                $scope.reports = reports; 
                window.localStorage.setItem( "waterReport", JSON.stringify(reports)); 
            });
        }
        $scope.ions = [
            {txt: 'Ca',sup:'+2',key:'ca',balance: 'Ca_balance',showLevel:true,wr:'calcium',type:'cations'},
            {txt: 'Mg',sup:'+2',key:'mg',balance: 'Mg_balance',showLevel:true,wr:'magnesium',type:'cations'},
            {txt: 'SO',sup:'-2',sub:'4',key:'so4',balance: 'SO4_balance',showLevel:true,wr:'sulfate',type:'anions'},
            {txt: 'Na',sup:'+',key:'na',balance: 'Na_balance',showLevel:true,wr:'sodium',type:'cations'},
            {txt: 'Cl',sup:'-',key:'cl',balance: 'Cl_balance',showLevel:true,wr:'chloride',type:'anions'},
            {txt: 'HCO',sup:'-',sub:'3',key:'hco3',balance: 'SO4Cl_balance',wr:'bicarbonate',type:'anions'},
            {txt: 'Alkalinity',key:'alc'}
        ];

        $scope.output = {
            diluted: new Array(6),
            diff: new Array(6),
            salts: new Array(6),
            result: new Array(6),
            adjusted: new Array(6)
        };

        $scope.updateSource = function() {
            var report = $scope.getReport($scope.recipe.water.selectedSource);
            if ( report ) {
                for ( var i=0;i<$scope.ions.length-1;i++) {
                    var ion = $scope.ions[i];
                    $scope.recipe.water.source[ion.key] = report[ion.type][ion.wr];
                }
                $scope.onChange();
            }
        };

        $scope.sourceEqual = function() {
            var report = $scope.getReport($scope.recipe.water.selectedSource);
            if ( report ) {
                var ret = true;
                for ( var i=0;i<$scope.ions.length-1;i++) {
                    var ion = $scope.ions[i];
                    ret = ret && ($scope.recipe.water.source[ion.key] === report[ion.type][ion.wr]);
                }
                return ret;
            } else {
                return false;
            }
        };

        $scope.updateTarget = function() {
            var report = $scope.getReport($scope.recipe.water.selectedTarget);
            if ( report ) {
                for ( var i=0;i<$scope.ions.length-1;i++) {
                    var ion = $scope.ions[i];
                    $scope.recipe.water.target[ion.key] = report[ion.type][ion.wr];
                }
                $scope.onChange();
            }
        };

        $scope.targetEqual = function() {
            var report = $scope.getReport($scope.recipe.water.selectedTarget);
            if ( report ) {
                var ret = true;
                for ( var i=0;i<$scope.ions.length-1;i++) {
                    var ion = $scope.ions[i];
                    ret = ret && ($scope.recipe.water.target[ion.key] === report[ion.type][ion.wr]);
                }
                return ret;
            } else {
                return false;
            }
        };

        $scope.getReport = function(id) {
            if ( $scope.reports ) {
                var ret = null;
                angular.forEach($scope.reports, function(report) {
                    if (report._id === id) {
                        ret = report;
                    }
                });
                return ret;
            }
        };

        $scope.getLiters = function() {
            var total = BrewCalc.calculateBoilSize($scope.recipe.BATCH_SIZE,
                                           $scope.recipe.TrubChillerLosses,
                                           $scope.recipe.BOIL_TIME,
                                           $scope.recipe.PercentEvap,
                                           $scope.recipe.TopUpWater)
                    +$scope.recipe.SpargeDeadSpace
                    +$scope.recipe.GrainAbsorbtion*$scope.recipe.totalAmountMash;
            $scope.recipe.water.liters = Math.round(total);
            $scope.onChange();
        };

        $scope.suggest = function() {
            if($scope.recipe.water.liters>0){
                var input = {
                    dilution: $scope.recipe.water.dilution,
                    mashvolume: $scope.recipe.water.liters,
                    source: convertArray($scope.recipe.water.source),
                    target: convertArray($scope.recipe.water.target),
                    CaCO3: $scope.recipe.water.CaCO3,
                    NaHCO3: $scope.recipe.water.NaHCO3,
                    CaSO4: $scope.recipe.water.CaSO4,
                    CaCl2: $scope.recipe.water.CaCl2,
                    MgSO4: $scope.recipe.water.MgSO4,
                    NaCl: $scope.recipe.water.NaCl
                };

                var suggest = BrewCalc.suggestWaterCalculation(input, {
                    diluted: new Array(6),
                    diff: new Array(6),
                    salts: new Array(6),
                    result: new Array(6),
                    adjusted: new Array(6)
                });

                $scope.recipe.water.CaCO3 = suggest.CaCO3;
                $scope.recipe.water.NaHCO3 = suggest.NaHCO3;
                $scope.recipe.water.CaSO4 = suggest.CaSO4;
                $scope.recipe.water.CaCl2 = suggest.CaCl2;
                $scope.recipe.water.MgSO4 = suggest.MgSO4;
                $scope.recipe.water.NaCl = suggest.NaCl;

                $scope.onChange();
            }else{
                console.log('Litros en 0');
            }

        };

        $scope.onChange = function() {
            var input = {
                dilution: $scope.recipe.water.dilution,
                mashvolume: $scope.recipe.water.liters,
                source: convertArray($scope.recipe.water.source),
                target: convertArray($scope.recipe.water.target),
                CaCO3: $scope.recipe.water.CaCO3,
                NaHCO3: $scope.recipe.water.NaHCO3,
                CaSO4: $scope.recipe.water.CaSO4,
                CaCl2: $scope.recipe.water.CaCl2,
                MgSO4: $scope.recipe.water.MgSO4,
                NaCl: $scope.recipe.water.NaCl
            };

            BrewCalc.waterCalculation(input, $scope.output);

            $scope.recipe.water.source.alc = input.source[6];
        };

        function convertArray(ions) {
            var ret = [];
            angular.forEach($scope.ions, function(ion) {
                ret.push(ions[ion.key]);
            })
            return ret;
        };

        $scope.init(); 
        $scope.onChange();

    })
    .filter('result', function() {
        return function(value) {
            if ( value > 0 ) {
                return '+ ' + value;
            } if ( value === 0 ) {
                return '0';
            } else {
                return '- '+(-value);
            }
        }
    });