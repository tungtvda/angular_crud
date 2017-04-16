var app = angular.module('myApp', ['ngRoute','ui.select']);
app.factory("services", ['$http', function($http) {
  var serviceBase = 'services/'
    var obj = {};
    obj.getCustomers = function(){
        return $http.get(serviceBase + 'customers');
    }
    obj.getCustomer = function(customerID){
        return $http.get(serviceBase + 'customer?id=' + customerID);
    }

    obj.insertCustomer = function (customer) {
    return $http.post(serviceBase + 'insertCustomer', customer).then(function (results) {
        return results;
    });
	};

	obj.updateCustomer = function (id,customer) {
        console.log(customer);
	    //return $http.post(serviceBase + 'updateCustomer', {id:id, customer:customer}).then(function (status) {
	    //    return status.data;
	    //});
	};

	obj.deleteCustomer = function (id) {
	    return $http.delete(serviceBase + 'deleteCustomer?id=' + id).then(function (status) {
	        return status.data;
	    });
	};

    return obj;   
}]);

app.controller('listCtrl', function ($scope, services) {
    services.getCustomers().then(function(data){
        $scope.customers = data.data;
    });
});

app.controller('editCtrl', function ($scope, $rootScope, $location, $routeParams, services, customer) {
    var customerID = ($routeParams.customerID) ? parseInt($routeParams.customerID) : 0;
    $rootScope.title = (customerID > 0) ? 'Edit Customer' : 'Add Customer';
    $scope.buttonText = (customerID > 0) ? 'Update Customer' : 'Add New Customer';
      var original = customer.data;
      original._id = customerID;
      $scope.customer = angular.copy(original);
    $scope.customer.country={name: 'vietnam', country_id:1};
      $scope.customer._id = customerID;
    $scope.countries= [
        { "country_id": 1, "name": "vietnam" },
        { "country_id": 2, "name": "my" },
        { "country_id": 3, "name": "cannada" },
    ];
    $scope.states = [
        {"state_id":1, "name":"Alaska", "country_id": 1},
        {"state_id":2, "name":"California", "country_id": 1},
        {"state_id":3, "name":"New York", "country_id": 1},
        {"state_id":4, "name":"New Brunswick", "country_id": 2},
        {"state_id":5, "name":"Manitoba", "country_id": 2},
        {"state_id":6, "name":"Delhi", "country_id": 3},
        {"state_id":7, "name":"Bombay", "country_id": 3},
        {"state_id":8, "name":"Calcutta", "country_id": 3}
    ];
    $scope.getCountryStates = function(){
        $scope.sates = ($filter('filter')($scope.states, {country_id: 1}));
    }
    console.log($scope)
    $scope.isClean = function() {
        return angular.equals(original, $scope.customer);
      }

      $scope.deleteCustomer = function(customer) {
        $location.path('/');
        if(confirm("Are you sure to delete customer number: "+$scope.customer._id)==true)
        services.deleteCustomer(customer.customerNumber);
      };

      $scope.saveCustomer = function(customer) {
        $location.path('/');
        if (customerID <= 0) {
            services.insertCustomer(customer);
        }
        else {
            services.updateCustomer(customerID, customer);
        }
    };
});

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        title: 'Customers',
        templateUrl: 'partials/customers.html',
        controller: 'listCtrl'
      })
      .when('/edit-customer/:customerID', {
        title: 'Edit Customers',
        templateUrl: 'partials/edit-customer.html',
        controller: 'editCtrl',
        resolve: {
          customer: function(services, $route){
            var customerID = $route.current.params.customerID;
            return services.getCustomer(customerID);
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
}]);
app.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);
app.filter("countryFilter", function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function (item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    //if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                    if (item[prop].toString().toLowerCase() === text) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});