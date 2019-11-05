initFiltering(".webis-list", ".entry", entry => {
    const attributes = entry.dataset;
    attributes['text'] = entry.textContent.toLowerCase();
    return attributes;
});
