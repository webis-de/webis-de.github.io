initFiltering(".webis-paragraphs", "p", paragraph => {
  return {
    text: paragraph.textContent.toLowerCase()
  };
});
