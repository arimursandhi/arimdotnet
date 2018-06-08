angular.module('userApp', ['appRoute', 'userCtrl', 'userService', 'ngAnimate', 'mainCtrl', 'authService', 'emailController', 'managementController'])

.config(function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptors');
});
