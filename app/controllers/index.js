import Ember from "ember";

function validateEmail(email) {
  var regex = new RegExp('^[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$');
  return regex.test(email);
}

export default Ember.Controller.extend({
  signInButtonDisabled: function () {
    return !this.get('signInPassword') || !validateEmail(this.get('signInEmail'));
  }.property('signInEmail', 'signInPassword'),

  signUpButtonDisabled: function () {
    return !this.get('signUpFirstName') || !this.get('signUpLastName') || !this.get('signUpPassword') || !validateEmail(this.get('signUpEmail'));
  }.property('signUpFirstName', 'signUpLastName', 'signUpPassword', 'signUpEmail'),

  signInEmailChanged: function () {
    var emailInput = Ember.$('#sign-in-email-input');
    emailInput.removeClass('error');
    emailInput.siblings().addClass('hidden');
  }.observes('signInEmail'),

  signInPasswordChanged: function() {
    var passwordInput = Ember.$('#sign-in-pasword-input');
    passwordInput.removeClass('error');
    passwordInput.siblings().addClass('hidden');
  }.observes('signInPassword'),

  signUpEmailChanged: function () {
    var emailInput = Ember.$('#sign-up-email-input');
    emailInput.removeClass('error');
    emailInput.siblings().addClass('hidden');
  }.observes('signUpEmail'),

  actions: {
    onSignInEmailFocusOut: function () {
      this.showErrorLabelIfNeeded('signInEmail', '#sign-in-email-input');
    },
    onSignUpEmailFocusOut: function () {
      this.showErrorLabelIfNeeded('signUpEmail', '#sign-up-email-input');
    }
  },

  showErrorLabelIfNeeded : function(propertyName, id) {
    var email = this.get(propertyName);
    if (email && !validateEmail(email)) {
      var emailInput = Ember.$(id);
      emailInput.addClass('error');
      emailInput.siblings().not('#email-taken-error').removeClass('hidden');
    }
  },

  showFailedToSignInError : function() {
    this.set('signInPassword', '');
    var passwordInput = Ember.$('#sign-in-pasword-input');
    passwordInput.addClass('error');
    Ember.$('#failed-to-sign-in-error').removeClass('hidden');
    passwordInput.select();
  },

  showEmailAddressAlreadyTakenError : function() {
    var emailInput = Ember.$('#sign-up-email-input');
    emailInput.addClass('error');
    Ember.$('#email-taken-error').removeClass('hidden');
    emailInput.select();
  }
});
