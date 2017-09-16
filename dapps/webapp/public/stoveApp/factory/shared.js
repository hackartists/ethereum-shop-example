var myModule = angular.module('stovecoinApp');

myModule.service("sharedService", function() {
    this.user = {};
    this.callback=function(){};
	this.selectedProductIndex=0;
	this.products=[];
	this.changeProductCallback=function(index){};

	this.setUser = function(user) {
		this.user = user;
	};

    this.setCallback = function(callback) {
        this.callback=callback;
    };

	this.selectedProduct = function(index) {
		this.selectedProductIndex=index;
	};

	this.setProducts = function(products) {
		this.products = products;
		this.changeProductCallback(this.selectedProductIndex);
	};

	this.pushProduct = function(product) {
		this.products.push(product);
		this.changeProductCallback(this.selectedProductIndex);
	};

	this.setChangeProductCallback = function(handler) {
		this.changeProductCallback = handler;
	};
});
