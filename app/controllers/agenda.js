import Ember from 'ember';

export default Ember.Controller.extend({
  workshops: [],
  day1slot1workshopsVisible:false,

  day1slot1workshops: function () {
    return this.get('workshops');
  }.property('workshops'),

  day1slot2workshops: function () {
    return this.get('workshops');
  }.property('workshops'),

  day1slot3workshops: function () {
    return this.get('workshops');
  }.property('workshops'),

  day2slot1workshops: function () {
    return this.get('workshops');
  }.property('workshops'),

  day2slot2workshops: function () {
    return this.get('workshops');
  }.property('workshops'),

  day2slot3workshops: function () {
    return this.get('workshops');
  }.property('workshops'),

  searchTextChanged: function () {
    Ember.run.debounce(this, this.filterWorkshops, 1000);
  }.observes('searchText'),

  filterWorkshops: function () {
    console.log(this.get('searchText'));
  },

  actions: {
    filterWorkshops: function () {
      this.filterWorkshops();
    },

    toggleShowDay1slot1workshops: function () {
      this.set('day1slot1workshopsVisible', !this.get('day1slot1workshopsVisible'));
    }
  }

});
