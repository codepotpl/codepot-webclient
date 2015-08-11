export default DS.Model.extend({
  day: DS.attr('string'),
  startTime: DS.attr('date'),
  endTime: DS.attr('date'),
  room: DS.attr('string'),
  order: DS.attr('number')
});
