import Ember from 'ember';
import showLoadingIndicator from '../../utils/show-loading-indicator';
import cdptRequest from '../../utils/cdpt-request';

function validateEmail(email) {
  var regex = new RegExp('^[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$');
  return regex.test(email);
}

export default Ember.Controller.extend({
  buttonDisabled: function () {
    return !validateEmail(this.get('email'))
  }.property('email'),

  actions: {
    resetPassword: function () {
      showLoadingIndicator(true);
      var data = {
        email:  this.get('email')
      };
      var controller = this;
      cdptRequest('/api/auth/reset-pass/initialize/', 'POST', data)
        .then(function () {
          controller.transitionToRoute('reset-password.email-sent');
        })
        .always(function () {
          showLoadingIndicator(false);
        });
    }
  }
});

