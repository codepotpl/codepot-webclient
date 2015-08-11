import Ember from 'ember';

export default Ember.Component.extend({
  workshops: [],
  expanded: false,

  workshopsChanged: function () {
    this.set('expanded', false);
  }.observes('workshops'),

  noWorkshops: function () {
    return this.get('workshops').length === 0;
  }.property('workshops'),

  hide: function () {
    return this.get('parentController.filteredWorkshopsOnly') && this.get('noWorkshops');
  }.property('parentController.filteredWorkshopsOnly'),

  actions: {
    toggleExpanded: function () {
      this.set('expanded', !this.get('expanded'));
    },

    showWorkshopDetails: function (workshop) {
      $('.reveal-modal#' + workshop.get('id')).foundation('reveal', 'open');
    }
  }
});
