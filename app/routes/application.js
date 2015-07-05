import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    error: function (error) {
      if (error.status === 401) {
        this.controllerFor(this.routeName).set('userData', null);
        this.transitionTo('index');
      }
    }
  }
});
