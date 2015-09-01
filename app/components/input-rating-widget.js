import Ember from 'ember';

export default Ember.Component.extend({
  alreadySent: false,

  sendFeedback: function () {
    this.set('alreadySent', false);
    this.$('.overlay').removeClass('hidden');

    var data = {
      feedbackId: {
        questionId: this.get('questionId'),
        userId: this.get('userId'),
        userToken: this.get('userToken')
      },
      answer: this.get('value') || ' ',
      comment: this.get('comment'),
      workshopId: this.get('workshopId'),
      mentorId: this.get('mentorId')
    };

    var component = this;
    Ember.$
      .ajax({
        url: 'https://survey.codepot.pl/feedback',
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        dataType: 'json'
      })
      .fail(function (error) {
        console.error(error);
      })
      .always(function () {
        component.$('.overlay').addClass('hidden');
        component.set('alreadySent', true);
      });
  },

  actions: {
    inputFocusOut: function () {
      this.sendFeedback();
    }
  }
});
