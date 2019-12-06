 var alerts = angular.module("alerts",[]);

    alerts.factory("alertFactory", function($rootScope) {
        var alerts = [];
        return {
            create: function(type,text,title) {
                alerts = [];
                var a = {
                    type:  type,
                    text: text,
                    title: title
                };
                alerts.push(a)
                setTimeout(function() {
                    util.Arrays.remove(alerts,a);
                    $rootScope.$apply();
                },5000)
            },
            getAlerts: function() {
                return alerts;
            }
        };
    });