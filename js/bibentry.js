containsQuery = (entry, queryWords) => {
    const attributes = entry.dataset;
    for (let q = 0; q < queryWords.length; ++q) {
        let queryWord = queryWords[q].replace(/\+/, " ");
        let found = false;

        const attributeSpecificatorPos = queryWord.indexOf(":");
        if (attributeSpecificatorPos >= 0) {
            const attribute = queryWord.substr(0, attributeSpecificatorPos);
            queryWord = queryWord.substr(attributeSpecificatorPos + 1);
            if (attributes.hasOwnProperty(attribute) && attributes[attribute].toLowerCase().indexOf(queryWord) >= 0) {
                found = true;
            }
        } else {
          for (let a in attributes) {
              if (attributes[a].toLowerCase().indexOf(queryWord) >= 0) {
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

doFilter = (doc, query) => {
    const years = doc.querySelectorAll(".year-entry");
    query = query.trim();

    let filteredAll = false;

    if (query === "") {
        for (let y = 0; y < years.length; ++y) {
            const year = years[y];
            const entries = year.querySelectorAll(".bib-entry");
            for (let e = 0; e < entries.length; ++e) {
                entries[e].classList.remove("uk-hidden");
            }
            year.classList.remove("uk-hidden");
        }
    } else {
        filteredAll = true;
        const queryWords = query.toLowerCase().replace(/[^a-z0-9-:+]/, " ").split(/\s+/);
        for (let y = 0; y < years.length; ++y) {
            const year = years[y];
            let filteredAllOfYear = true;
            const entries = year.querySelectorAll(".bib-entry");
            for (let e = 0; e < entries.length; ++e) {
                const entry = entries[e];
                if (containsQuery(entry, queryWords)) {
                    filteredAllOfYear = false;
                    entry.classList.remove("uk-hidden");
                } else {
                    entry.classList.add("uk-hidden");
                }
            }

            if (filteredAllOfYear) {
                year.classList.add("uk-hidden");
            } else {
                year.classList.remove("uk-hidden");
                filteredAll = false;
            }
        }
    }

    return filteredAll;
};

// Show BibTeX on click
document.querySelectorAll('.bib-toggle').forEach(el => el.addEventListener("click", (event) => {
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

// include from other page
//   parentElement: element to which the bibentries should be added
//   query:         filter query as used on the webis.de page
//   source:        URL of the page the contains the bibentries
includeBibentries = (parentElement, query = "", source = "https://webis.de/publications.html") => {
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
        const doc = this.response.documentElement.querySelector(".publications-list");
        doFilter(doc, query);
        parentElement.innerText = "";
        parentElement.classList.add("uk-container", "uk-margin-medium", "publications-list");
        parentElement.appendChild(doc);
    }
    request.open("GET", source);
    request.responseType = "document";
    request.send();
}


