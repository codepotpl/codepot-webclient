export default DS.Model.extend({
  title: DS.attr('string'),
  description: DS.attr('string'),
  mentors: DS.hasMany('mentor'),
  timeSlots: DS.hasMany('time-slot')
});
