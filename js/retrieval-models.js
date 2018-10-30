/* DATE. October 30th, 2018 */

function showPopup(fragment) {
  const oldPopups = document.querySelectorAll('#popupContent .popup');
  for (var i = 0; i < oldPopups.length; ++i) {
    oldPopups[i].setAttribute('style','display:none;opacity:0');
  }

  const newPopup = document.querySelector(fragment);
  newPopup.setAttribute('style','display:block;opacity:0');
  setTimeout(function() {
    newPopup.setAttribute('style','display:block;opacity:1');
  }, 100);
}

const map = document.querySelector('#retrieval-models-map');
map.addEventListener('click', function(event) {
  event.preventDefault();
  const id = event.target.getAttribute('href');
  showPopup(id);
});

showPopup("#boolean-box");
