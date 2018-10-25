/* DATE. July 14th, 2012 */

$(document).ready(function() {
    onReady();
});

function ensureFunctioning(path) {
  $(document).ready(function() {
    onReady();
  });
}

function onReady() {
    $('#popupContent div.popup').appendTo('#rightColumn');

    showPopup('#boolean-box');

    $('#retrieval-models-map').delegate('area', 'click', function() {
        showPopup($(this).attr('href'));

        return false;
    });
}

function showPopup(id){
  $('#rightColumn div.popup').fadeOut("slow");
  var boxid = id;
  $(boxid).fadeIn();
}
