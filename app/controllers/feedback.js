import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],

  userId: function () {
    return this.get('controllers.application.userData').user.get('id');
  }.property('controllers.application.userData'),

  userToken: function () {
    return this.get('controllers.application.userData').token;
  }.property('controllers.application.userData'),

  parsedWorkshops: function () {
    if (this.get('workshops')) {
      return this.get('workshops').map(function (workshop) {
        return {
          title: workshop.get('title'),
          id: workshop.get('id'),
          mentors: workshop.get('mentors').map(function (mentor) {
            return {
              name: mentor.get('firstName') + ' ' + mentor.get('lastName'),
              id: mentor.get('id')
            }
          })
        }
      });
    } else {
      return [];
    }
  }.property('workshops')
});
