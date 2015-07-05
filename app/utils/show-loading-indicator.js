import Ember from 'ember';

export default function showLoadingIndicator(show) {
  var indicator = Ember.$('#loading-indicator');
  if (show) {
    indicator.removeClass('hidden');
  } else {
    indicator.addClass('hidden');
  }
}
