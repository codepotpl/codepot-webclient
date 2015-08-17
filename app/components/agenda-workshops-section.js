import Ember from 'ember';

export default Ember.Component.extend({
  allWorkshops: [],
  workshops: [],
  expanded: false,

  filterWorkshopsByDayAndTimeSlotOrder: function (day, order) {
    return this.get('allWorkshops').filter(function (workshop) {
      var timeSlots = workshop.get('timeSlots').filter(function (timeSlot) {
        return timeSlot.get('day') === day && timeSlot.get('order') === order;
      });
      return timeSlots.length > 0;
    });
  },

  allWorkshopsChanged: function () {
    this.set('workshops', this.filterWorkshopsByDayAndTimeSlotOrder(this.get('day'), this.get('timeSlot')));
  }.observes('allWorkshops'),

  workshopsChanged: function () {
    this.setExpanded(false);
    this.get('workshops').forEach(function (workshop) {
      workshop.get('mentors').forEach(function (mentor, index, mentors) {
        mentor.set('lastInList', index === mentors.length - 1);
      });
    });
  }.observes('workshops'),

  setExpanded: function (expanded) {
    var height = expanded ? this.$('.workshop-list ul').height() : 0;
    this.$('.workshop-list').css('max-height', height + 'px');
    this.set('expanded', expanded);
  },

  noWorkshops: function () {
    return this.get('workshops').length === 0;
  }.property('workshops'),

  hide: function () {
    return this.get('parentController.filteredWorkshopsOnly') && this.get('noWorkshops');
  }.property('parentController.filteredWorkshopsOnly'),

  actions: {
    toggleExpanded: function () {
      this.setExpanded(!this.get('expanded'));
    },

    showWorkshopDetails: function (workshop) {
      ga('send', 'event', 'workshop details', 'displayed', workshop.get('title'));
      $('.reveal-modal#' + workshop.get('id')).foundation('reveal', 'open');
    }
  }
});
