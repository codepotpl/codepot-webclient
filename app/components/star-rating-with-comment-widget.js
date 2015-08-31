import Ember from 'ember';

export default Ember.Component.extend({
  rating: 0,
  alreadySent: false,

  star1highlighted: function () {
    return this.get('rating') >= 1;
  }.property('rating'),

  star2highlighted: function () {
    return this.get('rating') >= 2;
  }.property('rating'),

  star3highlighted: function () {
    return this.get('rating') >= 3;
  }.property('rating'),

  star4highlighted: function () {
    return this.get('rating') >= 4;
  }.property('rating'),

  star5highlighted: function () {
    return this.get('rating') >= 5;
  }.property('rating'),

  sendFeedback: function () {
    this.set('alreadySent', false);
    this.$('.overlay').removeClass('hidden');

    console.log(this.get('rating'));
    console.log(this.get('questionId'));
    console.log(this.get('userId'));
    console.log(this.get('userToken'));
    console.log(this.get('comment'));
    console.log(this.get('workshopId'));
    console.log(this.get('mentorId'));

    var data = {
      feedbackId: {
        questionId: this.get('questionId'),
        userId: this.get('userId'),
        userToken: this.get('userToken')
      },
      answer: this.get('rating'),
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
    textareaFocusOut: function () {
      this.sendFeedback();
    },
    rate: function (rating) {
      this.set('rating', rating);
      this.sendFeedback();
    }
  }
});
