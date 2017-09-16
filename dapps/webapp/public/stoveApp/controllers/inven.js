angular.module('stovecoinApp')
    .controller('InvenController', function($scope, $http, $window, $mdDialog, sha256, sharedService, EthereumService) {
        var inven = this;
        inven.all_items = [];
        inven.selected_cat=0;
        inven.category = [];
        inven.items = [];

        inven.init = function() {
            var req = {
                method: 'GET',
                url: '/inven/items?uid='+sharedService.user.username,
            };

            $http(req).then(function successCallback(response) {
			    inven.all_items=response.data.data;
                inven.build_category();
                inven.build_items(inven.selected_cat);
            }, function errorCallback(response) {
            });

            var req = {
                method: 'GET',
                url: '/contract',
            };

            $http(req).then(function successCallback(response) {
			    inven.contract=response.data.data;
            }, function errorCallback(response) {
            });
        };
        inven.init();
        sharedService.setCallback(inven.init);

        inven.build_category = function() {
            for(var i=0; i < inven.all_items.length; i++) {
			    filter = function(value) {
				    return value.name == inven.all_items[i].category
			    };

			    if (inven.category.filter(filter).length == 0) {
				    inven.category.push({id:inven.category.length, name:inven.all_items[i].category});
			    }
		    }
        };

        inven.build_items = function(index) {
            inven.items=[];
            inven.selected_cat=index;

            for (var i=0; i< inven.all_items.length; i++) {
                if (inven.category[index].name == inven.all_items[i].category) {
                    inven.items.push(inven.all_items[i]);
                }
            }
        };

        inven.sellItem = function(index) {
			var confirm = $mdDialog.prompt()
				.title('How much is the item?')
				.textContent('Price')
				.placeholder('10000')
				.initialValue('1000')
				.ok('Okay')
				.cancel('Cancel');


			$mdDialog.show(confirm).then(function(result) {
				if (!parseInt(result)) {
					return
				}

				var bytecode = inven.contract.bytecode;
				var abiDefinition = inven.contract.abi;
				var product = {
					id: inven.items[index]._id,
					price: parseInt(result),
					name: inven.items[index].name,
					image: inven.items[index].image,
					owner: inven.items[index].owner
				};
				contract = EthereumService.deployContract(
					abiDefinition, product, bytecode,
					sharedService.user.account);
			}, function() {
			});
        };
    });
