// based on https://stackoverflow.com/a/33542499
openBibtex = function(event) {
  const key = event.target.getAttribute("href").substring(1); // remove #
  const bibtex = event.target.getAttribute("data-bibtex").replace(/\&quot;/g, '"');
  const blob = new Blob([bibtex], {type: 'text/plain;charset=latin-1'});
  if (window.navigator.msSaveOrOpenBlob) { // Internet Explorer and Edge
    window.navigator.msSaveOrOpenBlob(blob, key + ".bib");
  } else {
    const dummyLink = document.createElement('a');
    dummyLink.href = window.URL.createObjectURL(blob);
    dummyLink.target = "_blank";
    dummyLink.download = key + ".bib";
    document.body.appendChild(dummyLink);
    dummyLink.click();
    document.body.removeChild(dummyLink);
  }
}

containsQuery = function(entry, queryWords) {
  const attributes = entry.attributes;
  for (let q = 0; q < queryWords.length; ++q) {
    const queryWord = queryWords[q];
    let found = false;
    for (let a = 0; a < attributes.length; ++a) {
      const attribute = attributes[a];
      if (attribute.name.startsWith("data-")) {
        if (attribute.value.toLowerCase().indexOf(queryWord) >= 0) {
          found = true;
          break;
        }
      }
    }
    if (!found) {
      return false;
    }
  }
  return true;
}

filter = function() {
  const query = document.getElementById("search-field").value;
  const years = document.querySelectorAll(".year-entry");
  if (query == "") {
    for (let y = 0; y < years.length; ++y) {
      const year = years[y];
      const entries = year.querySelectorAll(".bib-entry");
      for (let e = 0; e < entries.length; ++e) {
        entries[e].classList.remove("filtered");
      }
      year.classList.remove("filtered");
    }
  } else {
    const queryWords = query.toLowerCase().replace(/[^a-z0-9-]/, " ").split(/\s+/);
    for (let y = 0; y < years.length; ++y) {
      const year = years[y];
      let filteredAll = true;
      const entries = year.querySelectorAll(".bib-entry");
      for (let e = 0; e < entries.length; ++e) {
        const entry = entries[e];
        if (containsQuery(entry, queryWords)) {
          filteredAll = false;
          entry.classList.remove("filtered");
        } else {
          entry.classList.add("filtered");
        }
      }

      if (filteredAll) {
        year.classList.add("filtered");
      } else {
        year.classList.remove("filtered");
      }
    }
  }
}

filter();

