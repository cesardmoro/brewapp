 var reponsive = angular.module("responsive",[]);

reponsive.factory("Responsive", function($window) {
        return {
            isXs: function() {
                return $window.innerWidth < 768;
            },
            isSm: function() {
                return $window.innerWidth >= 768 && $window.innerWidth < 992;
            },
            isMd: function() {
                return $window.innerWidth >= 992 && $window.innerWidth < 1200;
            },
            isLg: function() {
                return $window.innerWidth >= 1200;
            }
        };
    });