angular.module('stovecoinApp')
    .controller('StovecoinController', function($scope, $http, $window, sha256, sharedService, EthereumService) {
    var stove = this;
    stove.sellView="hide";
    stove.sellButton="show";
    stove.selectedCategory=0;
	stove.login=false;
    stove.allproducts = [];

	stove.products = [];
    stove.category = [];

    stove.init = function() {
		sharedService.setChangeProductCallback(stove.changeCategory);
		sharedService.setProducts(stove.allproducts);
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
			stove.user.eth=EthereumService.getBalance(stove.user);
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
			stove.user.eth=EthereumService.getBalance(stove.user);
			sharedService.user = stove.user;
            sharedService.setUser(stove.user);
        }, function errorCallback(response) {
        });
    };
});
