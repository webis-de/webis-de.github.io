function containsQuery(entry, queryWords) {
    const attributes = {
      name: entry.children[1].textContent.toLowerCase(),
      publisher: entry.children[2].textContent.toLowerCase(),
      year: entry.children[3].textContent,
      units: entry.children[6].textContent.toLowerCase(),
      task: entry.children[7].textContent.toLowerCase()
    };
    for (let q = 0; q < queryWords.length; ++q) {
        let queryWord = queryWords[q].replace(/\+/g, " ");
        let found = false;

        const attributeSpecificatorPos = queryWord.indexOf(":");
        if (attributeSpecificatorPos >= 0) {
            const attribute = queryWord.substr(0, attributeSpecificatorPos);
            queryWord = queryWord.substr(attributeSpecificatorPos + 1);
            if (attributes.hasOwnProperty(attribute) && attributes[attribute].indexOf(queryWord) >= 0) {
                found = true;
            }
        } else {
          for (let a in attributes) {
              if (attributes[a].indexOf(queryWord) >= 0) {
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

function doFilter(doc, query) {
    const tables = doc.querySelectorAll(".targetable");
    query = query.trim();
    let filteredAll = true;
    if (query === "") {
        for (let t = 0; t < tables.length; ++t) {
            tables[t].classList.remove("uk-hidden");
        }

        const entries = doc.querySelectorAll("tr");
        for (let e = 0; e < entries.length; ++e) {
            entries[e].classList.remove("uk-hidden");
        }

        filteredAll = false;
    } else {
        const queryWords = query.toLowerCase().replace(/[^a-z0-9-:+]/g, " ").split(/\s+/);
        for (let t = 0; t < tables.length; ++t) {
            const table = tables[t];
            let filteredAllOfTable = true;
            const entries = table.querySelectorAll("tbody tr");
            for (let e = 0; e < entries.length; ++e) {
                const entry = entries[e];
                if (containsQuery(entry, queryWords)) {
                    entry.classList.remove("uk-hidden");
                    filteredAllOfTable = false;
                } else {
                    entry.classList.add("uk-hidden");
                }
            }

            if (filteredAllOfTable) {
                table.classList.add("uk-hidden");
            } else {
                table.classList.remove("uk-hidden");
                filteredAll = false;
            }
        }
    }

    return filteredAll;
};

function doFilterWebisDe(query) {
    const filteredAll = doFilter(document, query);

    const filteredAllMessage = document.getElementById("filtered-all-message");
    if (filteredAll) {
        filteredAllMessage.classList.remove("uk-hidden");
        filteredAllMessage.removeAttribute("aria-hidden");
    } else {
        filteredAllMessage.classList.add("uk-hidden");
        filteredAllMessage.setAttribute("aria-hidden", "true");
    }

    if (query.trim() !== "") {
      document.location.hash = "#?q=" + query;
    }

    // Force UIkit update to prevent glitches
    UIkit.update();
};

// legacy 'filter:' option
if (document.location.hash.startsWith("#filter:")) {
    const query = decodeURIComponent(document.location.hash.substr(8));
    document.location.hash = "#?q=" + query;
}
// remove spurious "\"
if (document.location.hash.indexOf("\\") > 0) {
  document.location.hash = document.location.hash.replace(/\\/g, "");
}

// Set up filter field
const filterField = document.getElementById("data-filter-field");
if (document.location.hash.startsWith("#?q=")) {
    const query = decodeURIComponent(document.location.hash.substr(4));
    filterField.value = query;
}
filterField.addEventListener("input", event => doFilterWebisDe(event.target.value));
doFilterWebisDe(filterField.value);
if (document.location.hash.startsWith("#filter:") || document.location.hash === "") {
  filterField.focus();
}

// Update if hash in URL changed (e.g., browser back button)
window.addEventListener("hashchange", event => {
    if (document.location.hash.startsWith("#?q=")) {
        const query = decodeURIComponent(document.location.hash.substr(4));
        if (query !== filterField.value) {
          filterField.value = query;
          doFilterWebisDe(query);
        }
    }
});

