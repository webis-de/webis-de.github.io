function showMore(list) {
  const more = list.getElementsByClassName('more');
  for (var m = 0; m < more.length; ++m) {
    more[m].classList.remove("hidden");
  }

  const buttons = list.getElementsByClassName('show-more');
  for (var b = 0; b < buttons.length; ++b) {
    buttons[b].classList.add("hidden");
  }
}

