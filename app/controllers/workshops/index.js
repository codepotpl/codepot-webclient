import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],
  workshops: [],

  day1Workshops: function () {
    return this.filterWorkshopsByDay('FIRST');
  }.property('workshops'),

  day2Workshops: function () {
    return this.filterWorkshopsByDay('SECOND');
  }.property('workshops'),

  filterWorkshopsByDay: function (day) {
    var workshops = this.get('workshops').filter(function (workshop) {
      var timeSlots = workshop.get('timeSlots').filter(function (timeSlot) {
        return timeSlot.get('day') === day;
      });
      return timeSlots.length > 0;
    });
    return workshops;
  }
});
