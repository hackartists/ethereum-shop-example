var stovecoinApp = angular.module('stovecoinApp', ['ui.router','ngMaterial']);

stovecoinApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');

    var view_path='/stoveApp/views/'

    $stateProvider
        .state({
            name: 'home',
            url: '/home',
            templateUrl: view_path + 'home.html',
            controller: 'StovecoinController',
            controllerAs: 'stove'
        })
        .state({
            name: 'shop',
            url: '/shop',
            templateUrl: view_path + 'shop.html',
            controller: 'ShopController',
            controllerAs: 'shopCtrl'
        })
        .state({
            name: 'inven',
            url: '/inven',
            templateUrl: view_path + 'inven.html',
            controller: 'InvenController',
            controllerAs: 'invenCtrl'
        })
        .state({
            name: 'activity',
            url: '/activity',
            templateUrl: view_path + 'activity.html',
            controller: 'ActivityController',
            controllerAs: 'activity'
        });
});

stovecoinApp.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
    $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
    $mdThemingProvider.theme('dark-purple').backgroundPalette('purple').dark();
    $mdThemingProvider.theme('dark-deep-purple').backgroundPalette('deep-purple').dark();
});
