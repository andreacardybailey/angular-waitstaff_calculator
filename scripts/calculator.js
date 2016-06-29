var app = angular.module('calculatorApp', ['ngMessages']);
app.controller('myCtrl', function() {
  var vm = this;
  vm.tipTotal = 0;
  vm.mealCount = 0;
  vm.avgTip = 0;
  vm.charges = [];
  vm.currentCharge = {
    subtotal: 0,
    tip:0,
    total:0
  }
  /*
   * round number to 2 decimals
   * retain JS number type
  */
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
      vm.charges.push(obj);
      /* 
        * copy obj using angular.extend
      */
      angular.extend( vm.currentCharge, vm.charges[vm.charges.length - 1] );
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
      vm.validForm = true;

      vm.subtotal = vm.price + vm.tax/100 * vm.price;
      vm.tipAmt = vm.subtotal * (vm.tip/100);
      vm.total = vm.subtotal + vm.tipAmt;
      vm.addCharges( vm.subtotal, vm.tipAmt, vm.total );

      vm.mealCount = vm.charges.length;
      vm.tipTotal = 0;
      /* 
        * add up tips
      */
      for (var i=0; i < vm.mealCount; i++) {
        vm.tipTotal += vm.charges[i].tip;
      }

      vm.avgTip = vm.tipTotal / vm.mealCount;
      /* 
        * account for JS number handling errors
      */
      vm.tipTotal = vm.tipTotal.toFixed(2);
      vm.avgTip = vm.avgTip.toFixed(2);
    }
  }

  vm.reset = function() {
    vm.calculatorForm.$setPristine();
    vm.price = "";
    vm.tax = "";
    vm.tip = "";
    vm.tipTotal = 0;
    vm.mealCount = 0;
    vm.avgTip = 0;
    vm.charges = [];
    vm.currentCharge = {
      subtotal: 0,
      tip:0,
      total:0
    }
    vm.validForm = false;
  }

});