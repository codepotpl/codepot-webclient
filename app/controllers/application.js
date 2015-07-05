import Ember from 'ember';
import upsert from '../utils/upsert';

export default Ember.Controller.extend({
  userData: null,

  userDataChanged: function () {
    localStorage.setItem('userData', JSON.stringify(this.get('userData')));
  }.observes('userData'),

  loadUserFromLocalstorage: function () {
    if (localStorage.userData) {
      var userData = JSON.parse(localStorage.userData);
      this.setUser(userData.user, userData.token);
    }
  }.on('init'),

  setUser: function (userData, token) {
    this.set('userData', {
      user: userData ? upsert(this.store, 'user', userData) : null,
      token: token
    });
    EmberENV.AUTHORIZATION_TOKEN = this.isUserSignedIn() ? token : null;
  },

  isUserSignedIn: function () {
    return this.get('userData.token') && this.get('userData.user');
  },

  isUserSignedInProperty: function () {
    return this.isUserSignedIn();
  }.property('userData.token'),

  signOut: function () {
    this.setUser(null, null);
    this.transitionToRoute('');
  },

  actions: {
    signOut: function () {
      this.signOut();
    }
  }
});
