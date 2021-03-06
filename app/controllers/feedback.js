import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],

  userId: function() {
    return this.get('controllers.application.userData').user.get('id');
  }.property('controllers.application.userData'),

  userToken: function() {
    return this.get('controllers.application.userData').token;
  }.property('controllers.application.userData'),

});
