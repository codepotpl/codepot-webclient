import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper('if-agenda-workshop-selectable', function(workshop, controller, options) {
  console.log(workshop);
  console.log(controller);
  //if (group.has_user(user)) {
    return options.fn(this);
  //} else {
    return options.inverse(this);
  //}
});
