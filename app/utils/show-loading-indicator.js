export default function showLoadingIndicator(show) {
  var indicator = $('#loading-indicator');
  if (show) {
    indicator.removeClass('hidden');
  } else {
    indicator.addClass('hidden');
  }
};
