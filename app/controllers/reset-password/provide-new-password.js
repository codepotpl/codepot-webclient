import Ember from 'ember';
import showLoadingIndicator from '../../utils/show-loading-indicator';
import cdptRequest from '../../utils/cdpt-request';

export default Ember.Controller.extend({
  buttonDisabled: function () {
    return !this.get('password')
  }.property('password'),

  actions: {
    resetPassword: function () {
      showLoadingIndicator(true);
      console.log(this.get('model'));
      var data = {
        password: this.get('password'),
        token: this.get('model.hash')
      };
      var controller = this;
      cdptRequest('/api/auth/reset-pass/finalize/', 'POST', data)
        .then(function () {
          controller.transitionToRoute('reset-password.success');
        })
        .fail(function (error) {
          console.error(error.responseText);
          alert(error.responseText);
        })
        .always(function () {
          showLoadingIndicator(false);
        });
    }
  }
});

