var app = angular.module('calculatorApp', ['ngMessages','ngRoute']);
app.config(['$routeProvider', function($routeProvider){
  // if users try to visit any routes other than the three that have been explicitly defined, they should be redirected to the index of the site.
  $routeProvider
  .when('/', {
    templateUrl : 'home.html',
    activetab: 'home'
  })
  .when('/newMeal', {
    templateUrl : 'newMeal.html',
    controller : 'MealCtrl',
    controllerAs: 'vm',
    activetab: 'meal'
  })
  .when('/myEarnings', {
    templateUrl : 'myEarnings.html',
    controller : 'EarningsCtrl',
    controllerAs: 'vm',
    activetab: 'earnings'
  })
  .otherwise('/');
}])
.run(['$rootScope','$route', function($rootScope,$route) {
  $rootScope.charges = [];
  $rootScope.tipTotal = 0;
  $rootScope.mealCount = 0;
  $rootScope.avgTip = 0;
  $rootScope.route = $route;
}])
.controller('MealCtrl', ['$rootScope', function($rootScope) {
  var vm = this;
  vm.currentCharge = {
    subtotal: 0,
    tip:0,
    total:0
  }
  var round = function(value) {
    return Number(Math.round(value + 'e' + 2)+ 'e-' + 2);
  }
  vm.addCharges = function(subtotal,tipAmt,total) {
    if( subtotal && tipAmt ) {
      var obj = {
        subtotal: round(subtotal),
        tip: round(tipAmt),
        total: total
      };
      $rootScope.charges.push(obj);
      /* 
        * copy obj using angular.extend
      */
      angular.extend( vm.currentCharge, $rootScope.charges[$rootScope.charges.length - 1] );
      /* 
        * convert all props of 'currentCharge' to be strings with 2 decimal places
      */
      Object.keys(vm.currentCharge).forEach(function(key,index) {
        vm.currentCharge[key] = vm.currentCharge[key].toFixed(2);
      });
    }
  }
  vm.submit = function() {
    if( vm.calculatorForm.$valid ) {

      vm.subtotal = vm.price + vm.tax/100 * vm.price;
      vm.tipAmt = vm.subtotal * (vm.tip/100);
      vm.total = vm.subtotal + vm.tipAmt;
      vm.addCharges( vm.subtotal, vm.tipAmt, vm.total );

      $rootScope.mealCount = $rootScope.charges.length;
      $rootScope.tipTotal = 0;
      /* 
        * add up tips
      */
      for (var i=0; i < $rootScope.mealCount; i++) {
        $rootScope.tipTotal += $rootScope.charges[i].tip;
      }

      $rootScope.avgTip = $rootScope.tipTotal / $rootScope.mealCount;
      /* 
        * account for JS number handling errors
      */
      $rootScope.tipTotal = $rootScope.tipTotal.toFixed(2);
      $rootScope.avgTip = $rootScope.avgTip.toFixed(2);
    }
  }
}])
.controller('EarningsCtrl', ['$rootScope', function($rootScope) {
  var vm = this;

  vm.reset = function() {
    $rootScope.tipTotal = 0;
    $rootScope.mealCount = 0;
    $rootScope.avgTip = 0;
    $rootScope.charges = [];
  }
}]);

