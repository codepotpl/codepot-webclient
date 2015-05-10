import Ember from 'ember';
import showLoadingIndicator from '../utils/show-loading-indicator.js';
import cdptRequest from '../utils/cdpt-request.js';

export default Ember.Route.extend({
  beforeModel: function (transition, queryParams) {
    if (this.controllerFor('application').isUserSingnedIn()) {
      transition.abort();
      this.transitionTo('dashboard');
    }
  },

  actions: {
    signIn: function () {
      showLoadingIndicator(true);
      var data = {
        email: this.controller.get('signInEmail'),
        password: this.controller.get('signInPassword')
      };
      var route = this;
      cdptRequest('api/auth/sign-in/', 'POST', data)
        .then(function (responseData, status, response) {
          route.controllerFor('application').setUser(responseData, response.getResponseHeader('token'));
          route.transitionTo('dashboard');
        })
        .fail(function (error) {
          if (error.status === 409) {
            route.controller.showFailedToSignInError();
          }
        })
        .always(function () {
          showLoadingIndicator(false);
        });
    },
    signUp: function () {
      showLoadingIndicator(true);
      var data = {
        firstName: this.controller.get('signUpFirstName'),
        lastName: this.controller.get('signUpLastName'),
        email: this.controller.get('signUpEmail'),
        password: this.controller.get('signUpPassword')
      };
      var route = this;
      cdptRequest('api/auth/sign-up/', 'POST', data)
        .then(function (responseData, status, response) {
          route.controllerFor('application').setUser(responseData, response.getResponseHeader('token'));
          route.transitionTo('dashboard');
        })
        .fail(function (error) {
          if (error.responseJSON.code === 100) {
            route.controller.showEmailAddressAlreadyTakenError();
          }
        })
        .always(function () {
          showLoadingIndicator(false);
        });
    }
  }
});
