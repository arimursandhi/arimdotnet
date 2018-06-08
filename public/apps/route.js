var app = angular.module('appRoute', ['ngRoute'])
.config(function($routeProvider, $locationProvider) {

  $routeProvider

  .when('/', {
    templateUrl: 'apps/views/pages/home.html'
  })

  .when('/about', {
    templateUrl: 'apps/views/pages/about.html'
  })

  .when('/register', {
    templateUrl: 'apps/views/pages/users/register.html',
    controller: 'regCtrl',
    controllerAs: 'register',
    authenticated: false
  })

  .when('/login', {
    templateUrl: 'apps/views/pages/users/login.html',
    authenticated: false
  })

  .when('/logout', {
    templateUrl: 'apps/views/pages/users/logout.html',
    authenticated: true
  })

  .when('/profile', {
    templateUrl: 'apps/views/pages/users/profile.html',
    authenticated: true
  })

  .when('/facebook/:token', {
    templateUrl: 'apps/views/pages/users/socials/social.html',
    controller: 'facebookCtrl',
    controllerAs: 'facebook',
    authenticated: false
  })

  .when('/twitter/:token', {
    templateUrl: 'apps/views/pages/users/socials/social.html',
    controller: 'twitterCtrl',
    controllerAs: 'twitter',
    authenticated: false
  })

  .when('/facebookerror', {
    templateUrl: 'apps/views/pages/users/login.html',
    controller: 'facebookCtrl',
    controllerAs: 'facebook',
    authenticated: false
  })

  .when('/twittererror', {
    templateUrl: 'apps/views/pages/users/login.html',
    controller: 'twitterCtrl',
    controllerAs: 'twitter',
    authenticated: false
  })

  .when('/google/:token', {
    templateUrl: 'apps/views/pages/users/socials/social.html',
    controller: 'googleCtrl',
    controllerAs: 'google',
    authenticated: false
  })

  .when('/googleerror', {
    templateUrl: 'apps/views/pages/users/login.html',
    controller: 'googleCtrl',
    controllerAs: 'google',
    authenticated: false
  })

  .when('/facebook/inactive/error', {
    templateUrl: 'apps/views/pages/users/login.html',
    controller: 'facebookCtrl',
    controllerAs: 'facebook',
    authenticated: false
  })

  .when('/twitter/inactive/error', {
    templateUrl: 'apps/views/pages/users/login.html',
    controller: 'twitterCtrl',
    controllerAs: 'twitter',
    authenticated: false
  })

  .when('/google/inactive/error', {
    templateUrl: 'apps/views/pages/users/login.html',
    controller: 'googleCtrl',
    controllerAs: 'google',
    authenticated: false
  })

  .when('/activate/:token', {
    templateUrl: 'apps/views/pages/users/activations/activate.html',
    controller: 'emailCtrl',
    controllerAs: 'email',
    authenticated: false
  })

  .when('/resend', {
    templateUrl: 'apps/views/pages/users/activations/resend.html',
    controller: 'resendCtrl',
    controllerAs: 'resend',
    authenticated: false
  })

  .when('/resetUsername', {
    templateUrl: 'apps/views/pages/users/resets/username.html',
    controller: 'usernameCtrl',
    controllerAs: 'username',
    authenticated: false
  })

  .when('/resetPassword', {
    templateUrl: 'apps/views/pages/users/resets/password.html',
    controller: 'passwordCtrl',
    controllerAs: 'password',
    authenticated: false
  })

  .when('/reset/:token', {
    templateUrl: 'apps/views/pages/users/resets/newpassword.html',
    controller: 'resetCtrl',
    controllerAs: 'reset',
    authenticated: false
  })

  .when('/management', {
    templateUrl: 'apps/views/pages/managements/management.html',
    controller: 'managementCtrl',
    controllerAs: 'management',
    authenticated: true,
    permission: ['admin', 'moderator']
  })

  .when('/edit/:id', {
    templateUrl: 'apps/views/pages/managements/edit.html',
    controller: 'editCtrl',
    controllerAs: 'edit',
    authenticated: true,
    permission: ['admin', 'moderator']
  })

  .when('/search', {
    templateUrl: 'apps/views/pages/managements/search.html',
    controller: 'managementCtrl',
    controllerAs: 'management',
    authenticated: true,
    permission: ['admin', 'moderator']
  })



  .otherwise({ redirectTo: '/'});

  $locationProvider.html5Mode({ enabled: true, requireBase: false });

});

app.run(['$rootScope', 'Auth', '$location', 'User', function($rootScope, Auth, $location, User) {

  $rootScope.$on('$routeChangeStart', function(event, next, current) {
      if (next.$$route !== undefined) {

        if (next.$$route.authenticated === true) {
          //console.log('tidak perl'); route ini tidak perlu autentikasiong
          if (!Auth.isLoggedIn()) {
            event.preventDefault();
            $location.path('/');
          } else if (next.$$route.permission) {
            User.getPermission().then(function(data) {
              //console.log(data);
              if (next.$$route.permission[0] !== data.data.permission) {
                if (next.$$route.permission[1] !== data.data.permission) {
                  event.preventDefault();
                  $location.path('/');
                }
              }
            });

          }
        } else if (next.$$route.authenticated === false) {
          if (Auth.isLoggedIn()) {
            event.preventDefault();
            $location.path('/profile');
          }
        }
      }
  });
}]);
