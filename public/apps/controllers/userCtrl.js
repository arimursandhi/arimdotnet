angular.module('userCtrl', ['userService'])

.controller('regCtrl', function($http, $location, $timeout, User) {

  var app = this;

  this.regUser = function(regData, valid) {
    app.disabled = true;
    app.loading = true;
    app.errorMsg = false;

    if (valid) {
        User.create(app.regData).then(function(data) {
          //console.log(data.data.success);
          //console.log(data.data.message);
          if (data.data.success) {
            app.loading = false; //animasi loading diset false
            //bikin sukses message
            app.successMsg = data.data.message + '...redirectX';
            //$location.path('/');
            //jika sukses redirect ke home page
            $timeout(function() {
              $location.path('/');
            }, 4000);
          } else {
            //bikin error message
            app.disabled = false;
            app.loading = false;
            //app.successMsg = false;
            app.errorMsg = data.data.message;
          }
        });
    } else {
        //bikin error message
        app.loading = false;
        //app.successMsg = false;
        app.errorMsg = 'pastikan form sudah terisi dengan benar';
    }

  };

  this.checkUsername = function(regData) {

      app.checkingUsername = true;
      app.usernameMsg = false;
      app.usernameInvalid = false;

      User.checkUsername(app.regData).then(function(data) {
          //console.log(data);
          if (data.data.success) {
              app.checkingUsername = false;
              app.usernameInvalid = false;
              app.usernameMsg = data.data.message;
          } else {
              app.checkingUsername = false;
              app.usernameInvalid = true;
              app.usernameMsg = data.data.message;
          }
      });
  }

  this.checkEmail = function(regData) {

      app.checkingEmail = true;
      app.emailMsg = false;
      app.emailInvalid = false;

      User.checkEmail(app.regData).then(function(data) {
          //console.log(data);
          if (data.data.success) {
              app.checkingEmail = false;
              app.emailInvalid = false;
              app.emailMsg = data.data.message;
          } else {
              app.checkingEmail = false;
              app.emailInvalid = true;
              app.emailMsg = data.data.message;
          }
      });
  }

})

.directive('match', function() {
    return {
        restrict: 'A',
        controller: function($scope) {

            $scope.confirmed = false;

            $scope.doConfirm = function(values) {

              values.forEach(function(ele) {

                  if ($scope.confirm == ele) {
                      $scope.confirmed = true;
                  } else {
                      $scope.confirmed = false;
                  }
              });
            }
        },

        link: function(scope, element, attrs) {

            attrs.$observe('match', function() {
                scope.matches = JSON.parse(attrs.match);
                scope.doConfirm(scope.matches);
            });

            scope.$watch('confirm', function() {
                scope.matches = JSON.parse(attrs.match);
                scope.doConfirm(scope.matches);
            });
        }
    };
})


.controller('facebookCtrl', function($routeParams, Auth, $location, $window) {
    //console.log($routeParams.token);
    var app = this;
    app.errorMsg = false;
    app.disabled = true;

    if ($window.location.pathname == '/facebookerror') {
        app.errorMsg = 'facebook email tidak ditemukan di database';
    } else if ($window.location.pathname == '/facebook/inactive/error') {
        app.expired = true;
        app.errorMsg = 'Account is not yet activated. Please check youtr E-Mail for activations link pacebuk';
    } else {
        Auth.facebook($routeParams.token);
        $location.path('/');
    }
})

.controller('twitterCtrl', function($routeParams, Auth, $location, $window) {
    //console.log($routeParams.token);
    var app = this;
    app.errorMsg = false;
    app.expired = false;
    app.disabled = true;

    if ($window.location.pathname == '/twittererror') {
        app.errorMsg = 'twitter email tidak ditemukan di database';
    } else if ($window.location.pathname == '/twitter/inactive/error') {
        app.expired = true;
        app.errorMsg = 'Account is not yet activated. Please check youtr E-Mail for activations link twity';
    } else {
        Auth.facebook($routeParams.token);
        $location.path('/');
    }
})

.controller('googleCtrl', function($routeParams, Auth, $location, $window) {
    //console.log($routeParams.token);
    var app = this;
    app.errorMsg = false;
    app.disabled = true;

    if ($window.location.pathname == '/googleerror') {
        app.errorMsg = 'google email tidak ditemukan di database';
    } else if ($window.location.pathname == '/google/inactive/error') {
        app.expired = true;
        app.errorMsg = 'Account is not yet activated. Please check youtr E-Mail for activations link gugel';
    } else {
        Auth.facebook($routeParams.token);
        $location.path('/');
    }
});
