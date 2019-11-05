initFiltering(".targetable", "tbody tr", entry => {
    const attributes = entry.dataset;
    attributes['name'] = entry.children[1].textContent.toLowerCase();
    return attributes;
});
