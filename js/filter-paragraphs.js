initFiltering(".webis-paragraphs", "p", paragraph => {
    const attributes = paragraph.dataset;
    attributes['text'] = paragraph.textContent.toLowerCase();
    return attributes;
});
