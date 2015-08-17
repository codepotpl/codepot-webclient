import Ember from 'ember';

export default Ember.Controller.extend({
  workshops: [],

  filterWorkshopsByDay: function(day) {
    var workshops = this.get('workshops').filter(function (workshop) {
      var timeSlots = workshop.get('timeSlots').filter(function (timeSlot) {
        return timeSlot.get('day') === day;
      });
      return timeSlots.length > 0;
    });
    return workshops;
  },

  noWorkshopsFoundDay1: function () {
    return !this.filterWorkshopsByDay('FIRST').length;
  }.property('workshops'),

  noWorkshopsFoundDay2: function () {
    return !this.filterWorkshopsByDay('SECOND').length;
  }.property('workshops'),

  searchTextChanged: function () {
    Ember.run.debounce(this, this.filterWorkshops, 500);
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
