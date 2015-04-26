import Ember from 'ember';

export default Ember.Mixin.create({
  beforeModel: function(transition, queryParams){
    this._super(transition, queryParams);
    if (!this.controllerFor('application').isUserSingnedIn()) {
      transition.abort();
      this.transitionTo('');
    }
  }
});
