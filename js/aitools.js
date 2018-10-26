function changeStyleSheet(name) {
  var components = document.getElementsByClassName("component");
  for (var i = 0; i < components.length; i++) {
    var component = components[i];
    if (shouldBeActive(component, name)) {
      setActive(component);
    } else {
      setInactive(component);
    }
  }
}

function shouldBeActive(component, name) {
  if (name === "") {
    return true;
  }

  var classes = component.getAttribute('class').split(' ');
  for (var i = 0; i < classes.length; i++) {
    if (classes[i] === name) {
      return true;
    }
  }
  return false;
}

function setActive(component) {
  setInactive(component); // to remove class active if present
  var currentClasses = component.getAttribute('class');
  var newClasses = currentClasses + " component-active";
  component.setAttribute('class', newClasses);
}

function setInactive(component) {
  var currentClasses = component.getAttribute('class');
  var newClasses = currentClasses.replace(/ component-active/, "");
  component.setAttribute('class', newClasses);
}