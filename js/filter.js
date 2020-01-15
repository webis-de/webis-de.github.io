function containQuery(attributes, queryWords) {
    for (let q = 0; q < queryWords.length; ++q) {
        let queryWord = queryWords[q].replace(/\+/g, " ");
        let found = false;

        const attributeSpecificatorPos = queryWord.indexOf(":");
        if (attributeSpecificatorPos >= 0) {
            const attribute = queryWord.substr(0, attributeSpecificatorPos);
            queryWord = queryWord.substr(attributeSpecificatorPos + 1);
            if (attributes.hasOwnProperty(attribute)) {
                const attributeValue = attributes[attribute];
                if (attributeValue.indexOf(queryWord) >= 0) {
                    found = true;
                }
            }
        } else {
          for (let a in attributes) {
              const attributeValue = attributes[a];
              if (attributeValue.indexOf(queryWord) >= 0) {
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
};

function filterByQuery(query, groupSelector, elementSelector, root = document) {
    query = query.trim();
    const groups = root.querySelectorAll(groupSelector);
    let filteredAll = true;
    if (query === "") {
        for (let g = 0; g < groups.length; ++g) {
            groups[g].classList.remove("uk-hidden");
            const elements = groups[g].querySelectorAll(elementSelector);
            for (let e = 0; e < elements.length; ++e) {
                elements[e].classList.remove("uk-hidden");
            }
        }
        filteredAll = false;
    } else {
        const queryWords = normalize(query, protectCommata = false, protectQueryModifiers = true).split(/\s+/);
        for (let g = 0; g < groups.length; ++g) {
            const group = groups[g];
            let filteredAllOfGroup = true;
            const elements = group.querySelectorAll(elementSelector);
            for (let e = 0; e < elements.length; ++e) {
                const element = elements[e];
                const attributes = element.dataset;
                if (containQuery(attributes, queryWords)) {
                    element.classList.remove("uk-hidden");
                    filteredAllOfGroup = false;
                } else {
                    element.classList.add("uk-hidden");
                }
            }

            if (filteredAllOfGroup) {
                group.classList.add("uk-hidden");
            } else {
                group.classList.remove("uk-hidden");
                filteredAll = false;
            }
        }
    }

    const filteredAllMessage = document.getElementById("filtered-all-message");
    if (filteredAllMessage !== null) {
      if (filteredAll) {
          filteredAllMessage.classList.remove("uk-hidden");
          filteredAllMessage.removeAttribute("aria-hidden");
      } else {
          filteredAllMessage.classList.add("uk-hidden");
          filteredAllMessage.setAttribute("aria-hidden", "true");
      }
    }

    if (query.trim() !== "") {
      document.location.hash = "#?q=" + query;
    }

    if (root === document) { // webis.de page
      // Force UIkit update to prevent glitches
      UIkit.update();
    }

    return filteredAll;
};

function normalize(value, protectCommata = false, protectQueryModifiers = false) {
  const regexBase = /[^\u{61}-\u{7a}\u{df}-\u{f6}\u{f8}-\u{ff}\u{100}-\u{17F}0-9\-,:+\s]/gu;
  const regexCommata = /[,]/g;
  const regexQueryModifiers = /[:+]/g;
  const regexWhitespace = /[\s]/g;
  
  let tmp = value.toLowerCase().normalize("NFD").replace(/[\u{300}-\u{36f}]/gu, "").replace(regexBase, "");
  if (!protectCommata) tmp = tmp.replace(regexCommata, "");
  if (!protectQueryModifiers) tmp = tmp.replace(regexQueryModifiers, "");
  tmp = tmp.replace(regexWhitespace, " ");

  return tmp;
};

function removeHyphenationPossibilities(value) {
  return value.replace(/&shy;/g, "");
};

/*
 * groupSelector: query selector that specifies a group of elements to be filtered
 * elementSelector: query selector that specifies each element within a group to be filtered
 * populateDataAttributes: a function that takes the DOM node of an element and sets the data- attributes for filtering
 */
function initFiltering(groupSelector, elementSelector, populateDataAttributes, root = document) {
  // populate data- attributes
  const groups = root.querySelectorAll(groupSelector);
  for (let g = 0; g < groups.length; ++g) {
      const elements = groups[g].querySelectorAll(elementSelector);
      for (let e = 0; e < elements.length; ++e) {
          populateDataAttributes(elements[e]);
          // remove &shy; from all attributes (Chrome seems to insert them automatically)
          const dataset = elements[e].dataset;
          for (let a in dataset) {
            dataset[a] = removeHyphenationPossibilities(dataset[a]);
          }
      }
  }

  // make filter function
  const filterFunction = (query) => {
      return filterByQuery(query, groupSelector, elementSelector, root);
  };

  const filterField = document.getElementById("filter-field");
  if (filterField !== null) {
    // remove spurious "\"
    if (document.location.hash.indexOf("\\") > 0) {
        document.location.hash = document.location.hash.replace(/\\/g, "");
    }

    // Set up filter field
    if (document.location.hash.startsWith("#?q=")) {
        const query = decodeURIComponent(document.location.hash.substr(4));
        filterField.value = query;
    }
    filterField.addEventListener("input", event => filterFunction(event.target.value));
    filterFunction(filterField.value);
    if (document.location.hash.startsWith("#?q=") || document.location.hash === "") {
        filterField.focus();
    }

    // Update if hash in URL changed (e.g., browser back button)
    window.addEventListener("hashchange", event => {
        if (document.location.hash.startsWith("#?q=")) {
            const query = decodeURIComponent(document.location.hash.substr(4));
            if (query !== filterField.value) {
              filterField.value = query;
              filterFunction(query);
            }
        }
    });
  }

  return filterFunction;
};

// update legacy 'filter:' option
if (document.location.hash.startsWith("#filter:")) {
    const query = decodeURIComponent(document.location.hash.substr(8));
    document.location.hash = "#?q=" + query;
}

////////////////////////////////////////////////////
// Specific code for common web page layouts
////////////////////////////////////////////////////

function initWebisListFiltering(root = document) {
    initFiltering(".webis-list", ".entry", entry => {
        const attributes = entry.dataset;
        attributes['text'] = normalize(entry.textContent);
        return attributes;
    }, root);
}

function initWebisParagraphsFiltering(root = document) {
    initFiltering(".webis-paragraphs", "p", paragraph => {
        const attributes = paragraph.dataset;
        attributes['text'] = normalize(paragraph.textContent);
        return attributes;
    });
}

////////////////////////////////////////////////////
// Specific code for publications
////////////////////////////////////////////////////

// Show BibTeX on click
function activateBibtexToggle(root = document) {
    root.querySelectorAll('.bib-toggle').forEach(el => el.addEventListener("click", (event) => {
        event.preventDefault();

        const bibtexId = event.target.dataset.target;
        const bibtex = document.getElementById(bibtexId);

        bibtex.classList.toggle("uk-hidden");
        const isHidden = bibtex.classList.contains("uk-hidden");
        if (!isHidden) {
            bibtex.focus();
        }
        bibtex.setAttribute("aria-hidden", isHidden ? "true" : "false");

        bibtex.style.height = "5px";
        bibtex.style.height = (bibtex.scrollHeight + 5) + "px";
    }));
};

function initPublicationsFiltering(publicationsList = document) {
    const filterFunction = initFiltering(".year-entry", ".bib-entry", entry => {
        const attributes = entry.dataset;
        for (let a in attributes) {
          if (a == "author" || a == "tags" || a == "editor") {
            attributes[a] = normalize(attributes[a], protectCommata = true, protectQueryModifiers = false);
          } else {
            attributes[a] = normalize(attributes[a]);
          }
        }
    }, publicationsList);
    activateBibtexToggle(publicationsList);
    return filterFunction;
};

// include from other page
//   parentElement: element to which the bibentries should be added
//   query:         filter query as used on the webis.de page
//   source:        URL of the page the contains the bibentries
function includeBibentries(parentElement, query = "", source = "https://webis.de/publications.html") {
    parentElement.innerText = "Loading...";

    /* add style sheet if not added already */
    if (document.querySelector('link[href="https://webis.de/css/style.css"]') == null) {
        var linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'stylesheet');
        linkElement.setAttribute('href', 'https://webis.de/css/style.css');
        document.getElementsByTagName('head')[0].appendChild(linkElement);
    }

    const request = new XMLHttpRequest();
    request.onload = function() {
        const publicationsList = this.response.documentElement.querySelector(".publications-list");
        const filterFunction = initPublicationsFiltering(publicationsList);
        filterFunction(query);
        publicationsList.classList.remove("uk-container", "uk-margin-medium");
        parentElement.innerText = "";
        parentElement.appendChild(publicationsList);
    }
    request.open("GET", source);
    request.responseType = "document";
    request.send();
}



