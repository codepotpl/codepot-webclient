export default DS.Model.extend({
  title: DS.attr('string'),
  description: DS.attr('string'),
  mentors: DS.hasMany('mentor'),
  timeSlots: DS.hasMany('time-slot'),

  room: function () {
    var room;
    this.get('timeSlots').forEach(function (timeSlot) {
      room = timeSlot.get('room');
    });
    return room;
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

  startTimeDay:function() {
    return moment(this.get('startTime')).format('dddd');
  }.property('startTime'),

  startTimeHour:function() {
    return moment(this.get('startTime')).format('HH:mm');
  }.property('startTime'),

  endTimeHour:function() {
    return moment(this.get('endTime')).format('HH:mm');
  }.property('endTime')
});
