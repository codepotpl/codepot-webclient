import Ember from 'ember';

export default Ember.Component.extend({
  workshops: [],
  expanded: false,

  workshopsChanged: function () {
    this.set('expanded', false);
    this.get('workshops').forEach(function (workshop) {
      workshop.get('mentors').forEach(function (mentor, index, mentors) {
        mentor.set('lastInList', index === mentors.length - 1);
      });
    });
  }.observes('workshops'),

  noWorkshops: function () {
    return this.get('workshops').length === 0;
  }.property('workshops'),

  hide: function () {
    return this.get('parentController.filteredWorkshopsOnly') && this.get('noWorkshops');
  }.property('parentController.filteredWorkshopsOnly'),

  actions: {
    toggleExpanded: function () {
      var height = 0;
      if (!this.get('expanded')) {
        height = this.$('.workshop-list ul').height();
      }
      this.$('.workshop-list').css('max-height', height + 'px');
      this.set('expanded', !this.get('expanded'));
    },

    showWorkshopDetails: function (workshop) {
      $('.reveal-modal#' + workshop.get('id')).foundation('reveal', 'open');
    }
  }
});
