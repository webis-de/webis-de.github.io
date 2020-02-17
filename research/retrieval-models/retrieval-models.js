/* DATE. October 30th, 2018 */

function showPopup(id) {
  const lastPopup = document.querySelector('.popup-active');
  if (lastPopup != null) {
    lastPopup.classList.remove('popup-active');
  }

  const newPopup = document.querySelector(id);
  newPopup.classList.add('popup-active');
}

const map = document.querySelector('#retrieval-models-map');
map.addEventListener('click', function(event) {
  event.preventDefault();
  showPopup(event.target.getAttribute('href'));
});

showPopup('#boolean-box');
