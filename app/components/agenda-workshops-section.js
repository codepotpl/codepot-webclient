import Ember from 'ember';

export default Ember.Component.extend({
  workshops: [],
  expanded: false,

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
      $('.reveal-modal#' + workshop.get('id')).foundation('reveal', 'open');
    }
  }
});
