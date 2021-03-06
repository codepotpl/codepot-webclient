import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],

  firstName: function () {
    return this.get('controllers.application.userData.user.firstName');
  }.property('controllers.application.userData')
});
