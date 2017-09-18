angular.module('stovecoinApp')
    .controller('ActivityController', function($scope, $http, $window, sha256, sharedService, EthereumService) {
        var activity = this;
        activity.fab = {
            isOpen:false,
            count: 0,
            selectedDirection: 'right'
        }
        activity.acts = [];

        activity.ex_unit = '';
        activity.ex_units = ["ETHER","CASH"];

        activity.getActivities = function() {
            var req = {
                method: 'GET',
                url: '/activity?uid='+sharedService.user.username,
            };

            $http(req).then(function successCallback(response) {
                activity.acts = response.data.data;

                for (var i =0; i< activity.acts.length; i++) {
                    if (activity.acts[i].action == "purchase") {
                        var t = new Date( activity.acts[i].timestamp );
                        activity.acts[i].msg = t + ": You purchased a product for "+activity.acts[i].ether+" ethers."
                        activity.acts[i].theme = "dark-orange";
                    } else if (activity.acts[i].action == "sell") {
                        var t = new Date( activity.acts[i].timestamp );
                        activity.acts[i].msg = t + ": You sold a product for "+activity.acts[i].ether+" ethers."
                        activity.acts[i].theme = "dark-blue";
                    }
                }
            }, function errorCallback(response) {
            });
        };

        activity.sel_ex = function() {
            if (activity.ex_unit == "ETHER") {
                activity.ex_msg=" to Stovecash";
                return activity.ex_unit;
            }
            activity.ex_msg=" to Ether";
            return activity.ex_unit;
        };

        activity.exchange = function() {
            var stove_address = "0xbaf62c502dc7f911b5048b710ff420945d9ad469"

            if (activity.ex_unit == "ETHER") {
                EthereumService.sendBalance(stove_address, sharedService.user.account, activity.amount, "8910");
                activity.exchangeToStovecash(activity.amount);
                return;
            } else {
                EthereumService.sendBalance(sharedService.user.account, stove_address, activity.amount,"08252143");
                activity.exchangeToEther(activity.amount);
            }
        };

        activity.exchangeToStovecash = function(amount){
            var req = {
                method: 'POST',
                url: '/exchange/to_cash',
                data: 'upw=8910&uid='+ sharedService.user.username
                    + '&amount=' + amount,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            };

            $http(req).then(function successCallback(response) {
            }, function errorCallback(response) {
            });
        };

        activity.exchangeToEther = function(amount){
            var req = {
                method: 'POST',
                url: '/exchange/to_ether',
                data: 'upw=8910&uid='+ sharedService.user.username
                    + '&amount=' + amount,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            };

            $http(req).then(function successCallback(response) {
            }, function errorCallback(response) {
            });
        };

        activity.getActivities();
    });
