openBibtex = function(event) {
  const bibtexId = event.target.getAttribute("data-target");
  const bibtex = document.getElementById(bibtexId);
  bibtex.classList.toggle("hidden");
  bibtex.style.height = "5px";
  bibtex.style.height = (bibtex.scrollHeight + 5) + "px";
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
  let filteredAll = false;

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
    filteredAll = true;
    const queryWords = query.toLowerCase().replace(/[^a-z0-9-]/, " ").split(/\s+/);
    for (let y = 0; y < years.length; ++y) {
      const year = years[y];
      let filteredAllOfYear = true;
      const entries = year.querySelectorAll(".bib-entry");
      for (let e = 0; e < entries.length; ++e) {
        const entry = entries[e];
        if (containsQuery(entry, queryWords)) {
          filteredAllOfYear = false;
          entry.classList.remove("filtered");
        } else {
          entry.classList.add("filtered");
        }
      }

      if (filteredAllOfYear) {
        year.classList.add("filtered");
      } else {
        year.classList.remove("filtered");
        filteredAll = false;
      }
    }
  }

  const filteredAllMessage = document.getElementById("filtered-all-message");
  if (filteredAll) {
    filteredAllMessage.classList.remove("hidden");
  } else {
    filteredAllMessage.classList.add("hidden");
  }
}

const urlFilterParameter = document.location.search.replace(/^\?/, "");
if (urlFilterParameter != "") {
  document.getElementById("search-field").value = urlFilterParameter;
}
filter();

