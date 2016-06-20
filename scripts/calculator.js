var app = angular.module('calculatorApp', ['ngMessages']);
app.controller('myCtrl', ['$scope', function($scope) {
  $scope.tipTotal = 0;
  $scope.mealCount = 0;
  $scope.avgTip = 0;
  $scope.charges = [];
  $scope.currentCharge = {
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

  $scope.addCharges = function(subtotal,tipAmt,total) {
    if( subtotal && tipAmt ) {
      var obj = {
        subtotal: round(subtotal),
        tip: round(tipAmt),
        total: total
      };
      $scope.charges.push(obj);
      /* 
        * copy obj using angular.extend
      */
      angular.extend( $scope.currentCharge, $scope.charges[$scope.charges.length - 1] );
      /* 
        * convert all props of 'currentCharge' to be strings with 2 decimal places
      */
      Object.keys($scope.currentCharge).forEach(function(key,index) {
        $scope.currentCharge[key] = $scope.currentCharge[key].toFixed(2);
      });
    }
  }

  $scope.submit = function() {
    if( $scope.calculatorForm.$valid ) {
      $scope.validForm = true;

      $scope.subtotal = $scope.price + $scope.tax/100 * $scope.price;
      $scope.tipAmt = $scope.subtotal * ($scope.tip/100);
      $scope.total = $scope.subtotal + $scope.tipAmt;
      $scope.addCharges( $scope.subtotal, $scope.tipAmt, $scope.total );

      $scope.mealCount = $scope.charges.length;
      $scope.tipTotal = 0;
      /* 
        * add up tips
      */
      for (var i=0; i < $scope.mealCount; i++) {
        $scope.tipTotal += $scope.charges[i].tip;
      }

      $scope.avgTip = $scope.tipTotal / $scope.mealCount;
      /* 
        * account for JS number handling errors
      */
      $scope.tipTotal = $scope.tipTotal.toFixed(2);
      $scope.avgTip = $scope.avgTip.toFixed(2);
    }
  }

  $scope.reset = function() {
    $scope.calculatorForm.$setPristine();
    $scope.price = "";
    $scope.tax = "";
    $scope.tip = "";
    $scope.tipTotal = 0;
    $scope.mealCount = 0;
    $scope.avgTip = 0;
    $scope.charges = [];
    $scope.currentCharge = {
      subtotal: 0,
      tip:0,
      total:0
    }
    $scope.validForm = false;
  }

}]);