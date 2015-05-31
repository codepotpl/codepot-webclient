import Ember from 'ember';
import showLoadingIndicator from '../utils/show-loading-indicator';
import cdptRequest from '../utils/cdpt-request';

export default Ember.Controller.extend({
  needs: ['application'],

  firstName: function () {
    return this.get('controllers.application.userData.user.firstName');
  }.property('controllers.application.userData')
});
