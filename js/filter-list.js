initFiltering(".webis-list", ".entry", entry => {
  return {
    text: entry.textContent.toLowerCase()
  };
});
