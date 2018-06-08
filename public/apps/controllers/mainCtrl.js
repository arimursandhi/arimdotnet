angular.module('mainCtrl', ['authService', 'userService'])

  //.controller('loginCtrl', function(Auth, $timeout, $location, $rootScope, $window, $interval, $route, User, AuthToken) {
  .controller('loginCtrl', function(Auth, $timeout, $location, $rootScope, $window, $interval, $route, User, AuthToken) {
    var app = this;
    app.loadme = false;

    app.checkSession = function() {
      if (Auth.isLoggedIn()) {
        app.checkingSession = true;
        var interval = $interval(function() {
          var token = $window.localStorage.getItem('token');
          if (token === null) {
            $interval.cancel(interval);
          } else {
            self.parseJwt = function(token) {
              var base64Url = token.split('.')[1];
              var base64 = base64Url.replace('-', '+').replace('_', '/');
              return JSON.parse($window.atob(base64));
            }
            var expireTime = self.parseJwt(token);
            var timeStamp = Math.floor(Date.now() / 1000);
            console.log(expireTime.exp);
            console.log(timeStamp);
            var timeCheck = expireTime.exp - timeStamp;
            console.log('waktu cek:' + timeCheck);
            if (timeCheck <= 1800) {
              console.log('token wis expayet');
              showModal(1);
              $interval.cancel(interval);
            } else {
              console.log('token durung expayet');
            }
          }
        }, 30000);

      }
    };

    app.checkSession();

    var showModal = function(option) {
      app.choiceMade = false;
      app.modalHeader = undefined;
      app.modalBody = undefined;
      app.hideButton = false;

      if (option === 1) {
        app.modalHeader = 'Timeout Warning';
        app.modalBody = 'Your session akan expayet dalam 30 minit. Wold you akan renew your session?';
        $("#myModal").modal({backdrop: "static"});
      } else if (option === 2) {
        app.hideButton = true;
        app.modalHeader = 'Logging Out';
        $("#myModal").modal({backdrop: "static"});
        $timeout(function() {
          Auth.logout();
          $location.path('/');
          hideModal();
          $route.reload();
        }, 2000);
      }
      $timeout(function() {
        if (!app.choiceMade){
          //console.log('Logged Out')
          hideModal();
        }
      }, 10000);
    };

    app.renewSession = function() {
      app.choiceMade = true;
      User.renewSession(app.username).then(function(data) {
        if (data.data.success) {
          AuthToken.setToken(data.data.token);
          app.checkSession();
        } else {
          app.modalBody = data.data.message;
        }
      });
      //console.log('Sesi diperbaharui');
      hideModal();
    };
    app.endSession = function() {
      app.choiceMade = false;
      //console.log('Sesi telah selesai');
      hideModal();
      $timeout(function() {
        showModal(2);
      }, 1000);
    };

    var hideModal = function(){
      $("#myModal").modal('hide');
    };


    // Will run code every time a route changes
    $rootScope.$on('$routeChangeStart', function() {
        if (!app.checkingSession) app.checkSession();

        // Check if user is logged in
        if (Auth.isLoggedIn()) {
            app.isLoggedIn = true;
            // Custom function to retrieve user data
            Auth.getUser().then(function(data) {
              app.username = data.data.username; // Get the user name for use in index
              app.useremail = data.data.email; // Get the user e-mail for us ein index

              User.getPermission().then(function(data) {
                  if (data.data.permission === 'admin' || data.data.permission === 'moderator') {
                    app.authorized = true;
                    app.loadme = true;
                  } else {
                    app.loadme = true;
                  }
              });
            });
          } else {
              app.isLoggedIn = false; // User is not logged in, set variable to falses
              app.username = {}; // Clear username
              app.loadme = true; // Show main HTML now that data is obtained in AngularJS
          }
          if ($location.hash() == '_=_') $location.hash(null); // Check if facebook hash is added to URL
          app.disabled = false; // Re-enable any forms
          app.errorMsg = false; // Clear any error messages

      });

    this.facebook = function() {
      //console.log($window.location.host); localhost:3000
      //console.log($window.location.protocol); http:
      app.disabled = true;
      $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/facebook';
    };

    this.twitter = function() {
      //console.log($window.location.host); localhost:3000
      //console.log($window.location.protocol); http:
      app.disabled = true;
      $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/twitter';
    };

    this.google = function() {
      //console.log($window.location.host); localhost:3000
      //console.log($window.location.protocol); http:
      app.disabled = true;
      $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/google';
    };

    this.doLogin = function(loginData) {
      app.loading = true;
      app.errorMsg = false;
      app.expired = false;
      app.disabled = true;

      Auth.login(app.loginData).then(function(data) {
        if (data.data.success) {
          app.loading = false;
          //bikin sukses message
          app.successMsg = data.data.message + '...redirect';
          //jika sukses redirect ke about
          $timeout(function() {
            $location.path('/');
            app.loginData = {}; //mengosongkan textbox username dan password
            app.successMsg = false;
            app.disabled = false;
            app.checkSession();
          }, 2000);
        } else {
          if (data.data.expired) {
            //bikin error message
            app.expired = true;
            app.loading = false;
            //----app.successMsg = false;
            app.errorMsg = data.data.message;
          } else {
            //bikin error message
            app.loading = false;
            app.disabled = false;
            //---app.successMsg = false;
            app.errorMsg = data.data.message;
          }
        }
      });
    };

    app.logout = function() {
      showModal(2);
    };
    /*
    this.logout = function() {
      Auth.logout();
      $location.path('/logout');

      $timeout(function() {
        $location.path('/');
      }, 1000);
    };
    */
  });
