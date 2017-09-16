angular.module('stovecoinApp')
    .controller('ShopController', function($scope, $http, $window, $mdDialog, sha256, sharedService, EthereumService) {
        var shop = this;
        shop.sellView="hide";
        shop.sellButton="show";
        shop.selectedCategory=0;

	    shop.products = [];
        shop.category = [
            {id:0,name:"Game"},
            {id:1,name:"Video"},
            {id:2,name:"Appliance"},
            {id:3,name:"Hardware"}
        ];

        shop.init = function() {
		    shop.getProducts();
		    sharedService.setChangeProductCallback(shop.changeCategory);
        };

	    shop.changeCategory = function(index) {
		    shop.selectedCategory=index;
            shop.getProducts();
	    };

        shop.getProducts = function() {
            var req = {
                method: 'GET',
                url: '/product/items?category='+shop.category[shop.selectedCategory].name
            };

            $http(req).then(function successCallback(response) {
                if (response.data.result == "OK") {
                    shop.products = [];
                    products = response.data.data;
                    var abi = response.data.abi;

                    for (var i=0; i<products.length; i++) {
                        var contract = EthereumService.getContract(abi,products[i].contract);

                        if (contract.result) {
                            var contract = contract.contract;
							var info = EthereumService.getInfo(contract);

							var r = {
								method: 'GET',
								url: '/inven/item?inven_id='+info._id
							};

							$http(r).then(function successCallback(response) {
								var item = response.data.data;
								item.price = info.price;
								shop.products.push(item);
							}, function errorCallback(response) {
							});
                        }
                    }

                }
            }, function errorCallback(response) {
            });
        };

        shop.showSellView = function() {
            shop.sellView="show";
            shop.sellButton="hide";
        };

        shop.buyProduct = function(index) {
			var confirm = $mdDialog.confirm()
				.title('Would you like to purchase '+shop.products[index].name+'?')
				.textContent('The price of '+shop.products[index].name+' is '+shop.products[index].price )
				.ariaLabel('Lucky day')
				.ok('Purchase')
				.cancel('Cancel');

			$mdDialog.show(confirm).then(function() {
				$scope.status = 'You decided to get rid of your debt.';
			}, function() {
				$scope.status = 'You decided to keep your debt.';
			});

        };

	    shop.init();
    });
