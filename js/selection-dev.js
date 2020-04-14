function clearHighlight() {
  document.querySelectorAll('.target').forEach(target => {
    target.classList.remove("target");
  });
}

/*
 * type: "table" for table row highlighting
 *       "bibentry" for bibentry highlighting
 */
function refreshHighlight(type) {
  clearHighlight();
  const hash = window.location.hash;
  if (hash !== "") {
    const targeted = document.querySelector(window.location.hash);
    if (targeted !== null) {
      switch (type) {
        case "table":
          var el = targeted.closest("tr");
          break;
        case "bibentry":
          var el = targeted.nextElementSibling;
          break;
      }

      if (el !== null) {
        el.classList.add("target");
      }
    }
  }
}

/////////////////////////////////////////////////////////////
// Specific code for publications
/////////////////////////////////////////////////////////////

function initBibHighlightOnShare(shareLinks = document.querySelectorAll('.share')) {
  shareLinks.forEach(el => el.addEventListener("click", (event) => {
    const bibentry = event.target.parentElement;
    clearHighlight();
    bibentry.classList.add("target");
  }));

  refreshHighlight("bibentry");
  window.addEventListener("hashchange", function () { refreshHighlight("bibentry"); });
}

/////////////////////////////////////////////////////////////
// Specific code for tables
/////////////////////////////////////////////////////////////

function highlightRow(row) {
  const idCell = row.querySelector("[id]");
  if (idCell !== null) {
    const id = idCell.getAttribute("id");
    const hash = "#" + id;
    if (window.location.hash !== hash) {
      clearHighlight();
      row.classList.add("target");
      history.pushState( { target: id }, "", hash);
    }
  }
}

function initTableHighlightOnClick(tables = document.querySelectorAll('table')) {
  tables.forEach(table => {
    table.querySelectorAll('tr').forEach(row => {
      row.addEventListener("click", evt => {
        highlightRow(evt.target.closest("tr"));
      });
    });
  });

  refreshHighlight("table");
  window.addEventListener("hashchange", function () { refreshHighlight("table") });
}
