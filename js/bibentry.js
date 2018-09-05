containsQuery = (entry, queryWords) => {
    const attributes = entry.dataset;
    for (let q = 0; q < queryWords.length; ++q) {
        const queryWord = queryWords[q];
        let found = false;
        for (let a in attributes) {
            if (attributes[a].toLowerCase().indexOf(queryWord) >= 0) {
                found = true;
                break;
            }
        }
        if (!found) {
            return false;
        }
    }
    return true;
};

const years = document.querySelectorAll(".year-entry");
doFilter = (query) => {
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
        const queryWords = query.toLowerCase().replace(/[^a-z0-9-]/, " ").split(/\s+/);
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

    const filteredAllMessage = document.getElementById("filtered-all-message");
    if (filteredAll) {
        filteredAllMessage.classList.remove("uk-hidden");
        filteredAllMessage.removeAttribute("aria-hidden");
    } else {
        filteredAllMessage.classList.add("uk-hidden");
        filteredAllMessage.setAttribute("aria-hidden", "true");
    }

    document.location.hash = "#filter:" + query;

    // Force UIkit update to prevent glitches
    UIkit.update();
};

// Set up filter field
const filterField = document.getElementById("bib-filter-field");
if (document.location.hash.startsWith("#filter:")) {
    filterField.value = decodeURIComponent(document.location.hash.substr(8));
}
filterField.addEventListener("input", event => doFilter(event.target.value));
doFilter(filterField.value);
filterField.focus();


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
