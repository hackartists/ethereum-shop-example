angular.module('stovecoinApp')
    .controller('ShopController', function($scope, $http, $window, $mdDialog, sha256, sharedService, EthereumService) {
        var shop = this;
        shop.sellView="hide";
        shop.sellButton="show";
        shop.selectedCategory=0;

	    shop.products = [];
        shop.category = [];

        shop.init = function() {
			if(sharedService.user) {
				sharedService.user.eth=EthereumService.getBalance(sharedService.user);
			}

            shop.getCategory(function(){
				shop.getProducts();
				sharedService.setChangeProductCallback(shop.changeCategory);
			});
        };

	    shop.changeCategory = function(index) {
		    shop.selectedCategory=index;
            shop.getProducts();
	    };

        shop.getCategory = function(callback) {
            var req = {
                method: 'GET',
                url: '/product/category'
            };

            $http(req).then(function successCallback(response) {
                if (response.data.result == "OK") {
                    shop.category = response.data.category;
					callback();
                }
            }, function errorCallback(response) {
            });
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
					shop.products = products;
                    var abi = response.data.abi;

                    for (var i=0; i<products.length; i++) {
                        var contract = EthereumService.getContract(abi,products[i].contract);

                        if (contract.result) {
							var contract = contract.contract;
							shop.products[i].contract = contract;
							var info = EthereumService.getInfo(contract);

							var r = {
								method: 'GET',
								url: '/inven/item?inven_id='+info._id
							};

							$http(r).then(function callback(res) {
								var item = res.data.data;
								var product = shop.products.filter(function(x) {
									return x.product == item._id
								})[0];

								product.image = item.image;
								product.name = item.name;
								//shop.products.push(item);
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
				.ok('Purchase')
				.cancel('Cancel');

			$mdDialog.show(confirm).then(function() {
				EthereumService.purchase(shop.products[index].contract, shop.products[index], sharedService.user);
				shop.getProducts();
			}, function() {
			});

        };

	    shop.init();
    });
