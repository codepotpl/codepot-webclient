export default DS.Model.extend({
  title: DS.attr('string'),
  description: DS.attr('string'),
  mentors: DS.hasMany('mentor'),
  timeSlots: DS.hasMany('time-slot'),
  attendeesCount: DS.attr('number'),
  maxAttendees: DS.attr('number'),

  placesLeft: function() {
    return this.get('maxAttendees') - this.get('attendeesCount');
  }.property('attendeesCount', 'maxAttendees'),

  noPlacesLeft: function() {
    return !this.get('placesLeft');
  }.property('placesLeft'),

  room: function () {
    var room;
    this.get('timeSlots').forEach(function (timeSlot) {
      room = timeSlot.get('room');
    });
    return room;
  }.property('timeSlots.@each'),

  day: function () {
    var day;
    this.get('timeSlots').forEach(function (timeSlot) {
      day = timeSlot.get('day');
    });
    return day;
  }.property('timeSlots.@each'),

  startTime: function () {
    var startTime;
    this.get('timeSlots').forEach(function (timeSlot) {
      if (!startTime) {
        startTime = timeSlot.get('startTime');
      } else {
        if (moment(timeSlot.get('startTime')) < moment(startTime)) {
          startTime = timeSlot.get('startTime');
        }
      }
    });
    return startTime;
  }.property('timeSlots.@each'),

  endTime: function () {
    var endTime;
    this.get('timeSlots').forEach(function (timeSlot) {
      if (!endTime) {
        endTime = timeSlot.get('endTime');
      } else {
        if (moment(timeSlot.get('endTime')) > moment(endTime)) {
          endTime = timeSlot.get('endTime');
        }
      }
    });
    return endTime;
  }.property('timeSlots.@each'),

  startTimeDay: function () {
    return moment(this.get('startTime')).format('dddd');
  }.property('startTime'),

  startTimeHour: function () {
    return moment(this.get('startTime')).format('HH:mm');
  }.property('startTime'),

  endTimeHour: function () {
    return moment(this.get('endTime')).format('HH:mm');
  }.property('endTime'),

  isLongerThanOneTimeSlot: function () {
    return this.get('timeSlots').length > 1;
  }.property('timeSlots'),

  numberOfTimeSlots: function () {
    return this.get('timeSlots').length;
  }.property('timeSlots'),

  collidesWithWorkshop: function (workshop) {
    var collides = false;
    this.get('timeSlots').forEach(function (thisTimeSlot) {
      var thisDay = thisTimeSlot.get('day');
      var thisOrder = thisTimeSlot.get('order');
      workshop.get('timeSlots').forEach(function (workShopTimeSlot) {
        if(thisDay === workShopTimeSlot.get('day') && thisOrder === workShopTimeSlot.get('order')) {
          collides = true;
        }
      });
    });
    return collides;
  }
});
