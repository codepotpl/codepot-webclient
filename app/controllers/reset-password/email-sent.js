import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['reset-password/index'],
  email: Ember.computed.alias('controllers.reset-password/index.email')
});

