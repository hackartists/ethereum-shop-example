angular.module('stovecoinApp')
    .controller('StovecoinController', function($scope, $http, $window, sha256, sharedService) {
    var stove = this;
    stove.sellView="hide";
    stove.sellButton="show";
    stove.selectedCategory=0;
	stove.login=false;
    stove.allproducts = [];

	stove.products = [];
    stove.category = [];

    stove.init = function() {
		stove.getDummyProducts();
		sharedService.setChangeProductCallback(stove.changeCategory);
		sharedService.setProducts(stove.allproducts);
    };

	stove.changeCategory = function(index) {
		//change products
		stove.products = [];

		for (var i=0; i < stove.allproducts.length; i++) {
			if (stove.category[index].name == stove.allproducts[i].category) {
				stove.products.push(stove.allproducts[i]);
			}
		}

        stove.selectedCategory=index;
		sharedService.selectedProduct(index);
	};

    stove.signin = function() {
		var hashedpw = sha256.convertToSHA256(stove.upw);
        var req = {
            method: 'POST',
            url: '/users/signin',
            data: 'uid='+ stove.uid
                + '&upw=' + hashedpw,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        };

        $http(req).then(function successCallback(response) {
			stove.login=true;
			stove.user=response.data.value;
            sharedService.user = stove.user;
            sharedService.callback();
        }, function errorCallback(response) {
        });
    };

    stove.signup = function() {
        var hashedpw = sha256.convertToSHA256(stove.upw);
        var req = {
            method: 'POST',
            url: '/users/signup',
            data: 'uid='+ stove.uid
                + '&upw=' + hashedpw,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        };

        $http(req).then(function successCallback(response) {
			stove.login=true;
			stove.user=response.data.value;
            sharedService.setUser(stove.user);
        }, function errorCallback(response) {
        });
    };

	stove.getDummyProducts = function() {
		stove.allproducts = [
			{
				id: 0,
				name: "LostAry Item1",
                owner: "10001",
				price: 40000,
                image: "http://lh3.googleusercontent.com/wQaIfsanPg7fcgguQ5p2vSKM3b7Z6893aIRl_SQTYYkL_5yLTYfc_eYviKnxiLMyZH0=w170-rw",
				category: "Game"
			},
			{
				id: 1,
				name: "LostAry Item2",
                owner: "10001",
				price: 40000,
                image: "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg",
				category: "Video"
			},
			{
				id: 2,
				name: "LostAry Item3",
                owner: "10001",
				price: 40000,
                image: "http://lh3.googleusercontent.com/wQaIfsanPg7fcgguQ5p2vSKM3b7Z6893aIRl_SQTYYkL_5yLTYfc_eYviKnxiLMyZH0=w170-rw",
				category: "Appliance"
			},
			{
				id: 3,
				name: "LostAry Item4",
                owner: "10001",
				price: 40000,
                image: "http://lh3.googleusercontent.com/wQaIfsanPg7fcgguQ5p2vSKM3b7Z6893aIRl_SQTYYkL_5yLTYfc_eYviKnxiLMyZH0=w170-rw",
				category: "Hardware"
			}
		];

		for(var i=0; i < stove.allproducts.length; i++) {
			filter = function(value) {
				return value == stove.allproducts[i].category
			};

			if (stove.category.filter(filter).length == 0) {
				stove.category.push({id:stove.category.length, name:stove.allproducts[i].category});
			}
		}
	};

    stove.getProducts = function() {
        var result=[];

        // Getting a list of products from contract.
        // Then, put the list to `result.`

        stove.products=result;
    };
});
