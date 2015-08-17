import Ember from 'ember';

export default Ember.Controller.extend({
  workshops: [],

  filterWorkshopsByDayAndTimeSlotOrder: function (day, order) {
    var workshops = this.get('workshops').filter(function (workshop) {
      var timeSlots = workshop.get('timeSlots').filter(function (timeSlot) {
        return timeSlot.get('day') === day && timeSlot.get('order') === order;
      });
      return timeSlots.length > 0;
    });
    return workshops;
  },

  day1slot1workshops: function () {
    return this.filterWorkshopsByDayAndTimeSlotOrder('FIRST', 0);
  }.property('workshops'),

  day1slot2workshops: function () {
    return this.filterWorkshopsByDayAndTimeSlotOrder('FIRST', 1);
  }.property('workshops'),

  day1slot3workshops: function () {
    return this.filterWorkshopsByDayAndTimeSlotOrder('FIRST', 2);
  }.property('workshops'),

  day1slot4workshops: function () {
    return this.filterWorkshopsByDayAndTimeSlotOrder('FIRST', 3);
  }.property('workshops'),

  day2slot1workshops: function () {
    return this.filterWorkshopsByDayAndTimeSlotOrder('SECOND', 0);
  }.property('workshops'),

  day2slot2workshops: function () {
    return this.filterWorkshopsByDayAndTimeSlotOrder('SECOND', 1);
  }.property('workshops'),

  day2slot3workshops: function () {
    return this.filterWorkshopsByDayAndTimeSlotOrder('SECOND', 2);
  }.property('workshops'),

  day2slot4workshops: function () {
    return this.filterWorkshopsByDayAndTimeSlotOrder('SECOND', 3);
  }.property('workshops'),

  searchTextChanged: function () {
    Ember.run.debounce(this, this.filterWorkshops, 1000);
  }.observes('searchText'),

  filteredWorkshopsOnly: function () {
    return !!this.get('searchText');
  }.property('workshops'),

  filterWorkshops: function () {
    ga('send', 'event', 'seach', 'performed', this.get('searchText'));
    this.target.send('filterWorkshops', this, this.get('searchText'));
  },

  actions: {
    filterWorkshops: function () {
      this.filterWorkshops();
    }
  }
});
