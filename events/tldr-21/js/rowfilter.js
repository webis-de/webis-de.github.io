containsQuery = (row, queryWords) => {
    const text = row.textContent.toLowerCase();
    for (let q = 0; q < queryWords.length; ++q) {
        let queryWord = queryWords[q].replace(/\+/g, " ");
        let found = false;

        if (text.indexOf(queryWord) < 0) {
            return false;
        }
    }
    return true;
};

doFilter = (doc, query) => {
    const rows = doc.querySelectorAll("#table-tldr-examples tbody tr");
    query = query.trim();

    let filteredAll = false;

    if (query === "") {
        for (let r = 0; r < rows.length; ++r) {
            const row = rows[r];
            row.classList.remove("uk-hidden");
        }
    } else {
        filteredAll = true;
        const queryWords = query.toLowerCase().replace(/[^a-z0-9-:+]/g, " ").split(/\s+/);
        for (let r = 0; r < rows.length; ++r) {
            const row = rows[r];
            if (containsQuery(row, queryWords)) {
                filteredAll = false;
                row.classList.remove("uk-hidden");
            } else {
                row.classList.add("uk-hidden");
            }
        }
    }

    return filteredAll;
};

doFilterTldr = (query) => {
    const filteredAll = doFilter(document, query);

    const filteredAllMessage = document.getElementById("filtered-all-message");
    if (filteredAll) {
        filteredAllMessage.classList.remove("uk-hidden");
        filteredAllMessage.removeAttribute("aria-hidden");
    } else {
        filteredAllMessage.classList.add("uk-hidden");
        filteredAllMessage.setAttribute("aria-hidden", "true");
    }

    document.location.hash = "#?q=" + query;

    // Force UIkit update to prevent glitches
    UIkit.update();
};

// remove spurious "\"
if (document.location.hash.indexOf("\\") > 0) {
  document.location.hash = document.location.hash.replace(/\\/g, "");
}

// Set up filter field
const filterField = document.getElementById("tldr-filter-field");
if (document.location.hash.startsWith("#?q=")) {
    const query = decodeURIComponent(document.location.hash.substr(4));
    filterField.value = query;
}
filterField.addEventListener("input", event => doFilterTldr(event.target.value));
doFilterTldr(filterField.value);
filterField.focus();

// Update if hash in URL changed (e.g., browser back button)
window.addEventListener("hashchange", event => {
    if (document.location.hash.startsWith("#?q=")) {
        const query = decodeURIComponent(document.location.hash.substr(4));
        if (query !== filterField.value) {
          filterField.value = query;
          doFilterTldr(query);
        }
    }
});

