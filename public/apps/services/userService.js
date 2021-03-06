
angular.module('userService', [])

.factory('User', function($http) {
    var userFactory = {};

    //User.create(regData) | userCtrl.js | api.js
    userFactory.create = function(regData) {
      return $http.post('/api/users', regData);
    };

    //User.chekUsername(regData) | userCtrl.js | api.js
    userFactory.checkUsername = function(regData) {
      return $http.post('/api/checkusername', regData);
    };

    //User.checkEmail(regData) | userCtrl.js | api.js
    userFactory.checkEmail = function(regData) {
      return $http.post('/api/checkemail', regData);
    };

    //User.activateAccount(token);
    userFactory.activeAccount = function(token) {
      return $http.put('/api/activate/' + token);
    };

    //User.checkCredential(loginData)
    userFactory.checkCredential = function(loginData) {
      return $http.post('/api/resend', loginData);
    };

    //User.resendLink(username)
    userFactory.resendLink = function(username) {
      return $http.put('/api/resend', username);
    };

    //User.sendUsername(userData)
    userFactory.sendUsername = function(userData) {
      return $http.get('/api/resetUsername/' + userData);
    };

    //User.sendPassword(resetData);
    userFactory.sendPassword = function(resetData) {
      return $http.put('/api/resetPassword', resetData);
    };
    //User.resetUser(token);
    userFactory.resetUser = function(token) {
      return $http.get('/api/resetPassword/' + token);
    };
    //User.savePassword(regData);
    userFactory.savePassword = function(regData) {
      return $http.put('/api/savePassword', regData);
    };
    //User.renewSession(username);
    userFactory.renewSession = function(username) {
      return $http.get('/api/renewToken/' + username);
    };
    //User.getPermission()
    userFactory.getPermission = function() {
      return $http.get('/api/permission/');
    };

    userFactory.getUsers = function() {
      return $http.get('/api/management/');
    };

    userFactory.getUser = function(id) {
      return $http.get('/api/edit/' +id);
    };

    userFactory.deleteUser = function(username) {
      return $http.delete('/api/management/' + username);
    };

    userFactory.editUser = function(id) {
      return $http.put('/api/edit', id);
    };


    return userFactory;
});
