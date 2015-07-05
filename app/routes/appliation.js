import Ember from 'ember';

export default Ember.Route.extend({
  error: function (error) {
    console.log('application: ');
    console.log(error);
  }
});
