import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(workshop, day, order) {
  var humanIndexInTimeSlots;
  workshop.get('timeSlots')
    .forEach(function (timeSlot, index, timeSlots) {
      if (timeSlots.length > 1 && timeSlot.get('day') === day && timeSlot.get('order') === order) {
        humanIndexInTimeSlots = index + 1;
      }
    });
  return humanIndexInTimeSlots;
});
