// legacy 'filter:' option
if (document.location.hash.startsWith("#filter:")) {
    const query = decodeURIComponent(document.location.hash.substr(8));
    document.location.hash = "#?q=" + query;
}

initFiltering(".targetable", "tbody tr", entry => {
    return {
        name: entry.children[1].textContent.toLowerCase(),
        publisher: entry.children[2].textContent.toLowerCase(),
        year: entry.children[3].textContent,
        units: entry.children[6].textContent.toLowerCase(),
        task: entry.children[7].textContent.toLowerCase()
    };
});
