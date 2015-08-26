import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],
  workshop: null,
  signedIn: false,
  hasAccessToThisWorkshop: false,
  newMessage: ''
});
