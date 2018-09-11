doFilterWebisDe = (query) => {
    const filteredAll = doFilter(document, query);

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
filterField.addEventListener("input", event => doFilterWebisDe(event.target.value));
doFilterWebisDe(filterField.value);
filterField.focus();

