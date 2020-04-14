/////////////////////////////////////////////////////////////
// sorting
/////////////////////////////////////////////////////////////

const fileSizeMultipliers = {
    b: 1,
    kb: 1000,
    mb: 1000000,
    gb: 1000000000,
    tb: 1000000000000,
    pb: 1000000000000000
};

const unitSizeMultipliers = {
    k: 1000,
    m: 1000000,
    b: 1000000000,
    t: 1000000000000
};

const getCellValue = (tr, idx) => {
    const value = tr.children[idx].innerText || tr.children[idx].textContent;

    if (value === "-") {
        return -1;
    }

    const matchesFileSize = value.trim().match(/^(\d+(?:\.\d+)?)\s(.?B)$/);
    if (matchesFileSize) {
        const multiplier = fileSizeMultipliers[matchesFileSize[2].toLowerCase()];
        return parseFloat(matchesFileSize[1]) * multiplier;
    }

    const matchesUnitSize = value.trim().match(/^(\d+(?:\.\d+)?)([KMBT]?)$/);
    if (matchesUnitSize) {
        const multiplier = matchesUnitSize[2] === ""
            ? 1
            : unitSizeMultipliers[matchesUnitSize[2].toLowerCase()];
        return parseFloat(matchesUnitSize[1]) * multiplier;
    }

    return value;
}

const cellComparer = (idx, descending = false) => {
    const mod = descending ? -1 : 1;
    return (tr1, tr2) => {
        const value1 = getCellValue(tr1, idx);
        const value2 = getCellValue(tr2, idx);
        if (value1 !== '' && value2 !== '' && !isNaN(value1) && !isNaN(value2)) {
            return mod * (value1 - value2);
        } else {
            return mod * (value1.toString().localeCompare(value2));
        }
    }
}

const enableColumnSorting = (event) => {
    const th = event.target.closest('th');
    const descending = th.classList.contains('sort-ascending');
    const table = th.closest('table');
    table.querySelectorAll('th')
        .forEach(th2 => {
          th2.classList.remove('sort-ascending');
          th2.classList.remove('sort-descending');
        });
    if (descending) {
        th.classList.add('sort-descending');
    } else {
        th.classList.add('sort-ascending');
    }

    const idx = Array.from(th.parentNode.children).indexOf(th);
    const tbody = table.querySelector('tbody');
    Array.from(tbody.querySelectorAll('tr'))
        .sort(cellComparer(idx, descending))
        .forEach(tr => tbody.appendChild(tr));
}

function initTableSorting(tables = document.querySelectorAll('table.sortable')) {
  tables.forEach(table => {
    table.querySelectorAll('th.header').forEach(th => {
      th.addEventListener('click', enableColumnSorting)
    });
  });
};