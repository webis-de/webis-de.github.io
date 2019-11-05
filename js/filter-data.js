// legacy 'filter:' option
if (document.location.hash.startsWith("#filter:")) {
    const query = decodeURIComponent(document.location.hash.substr(8));
    document.location.hash = "#?q=" + query;
}

initFiltering(".targetable", "tbody tr", entry => {
    const attributes = entry.dataset;
    attributes['name'] = entry.children[1].textContent.toLowerCase();
    attributes['publisher'] = entry.children[2].textContent.toLowerCase();
    attributes['year'] = entry.children[3].textContent;
    attributes['units'] = entry.children[6].textContent.toLowerCase();
    attributes['task'] = entry.children[7].textContent.toLowerCase();
    return attributes;
});
