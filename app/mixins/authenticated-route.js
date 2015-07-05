import Ember from 'ember';

export default Ember.Mixin.create({
  beforeModel: function (transition) {
    if (!this.controllerFor('application').isUserSignedIn()) {
      transition.abort();
      this.transitionTo('index');
    }
  }
});
