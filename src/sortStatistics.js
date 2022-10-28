function sortTable(colNumber) {
  let dir = "asc";
  let switchcount = 0;
  let switching = true;

  const table = document.querySelector("#stats-table");
  table.querySelectorAll("th").forEach((header) => {
    header.classList.remove("asc");
    header.classList.remove("desc");
  });
  const header = table.querySelector(`#stats-header :nth-child(${colNumber+1})`);
  header.classList.add(dir);

  while (switching) {
    switching = false;
    const rows = table.rows;

    for (let i = 1; i < rows.length - 1; i++) {
      let shouldSwitch = false;

      const x = rows[i].getElementsByTagName("td")[colNumber];
      const y = rows[i + 1].getElementsByTagName("td")[colNumber];

      shouldSwitch = checkSwitch(x, y, dir);

      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchcount++;
      }
    }

    if (switchcount === 0 && dir == "asc") {
      header.classList.remove(dir);
      dir = "desc";
      switching = true;
      header.classList.add(dir);
    }
  }
}

function checkSwitch(x, y, dir) {
  x = x.innerHTML.toLowerCase();
  y = y.innerHTML.toLowerCase();
  if (dir == "asc") {
    if (isNaN(Number(x))) {
      if (x > y) {
        return true;
      }
    } else if (Number(x) > Number(y)) {
      return true;
    }
  } else if (dir == "desc") {
    if (isNaN(Number(x))) {
      if (x < y) {
        return true;
      }
    } else if (Number(x) < Number(y)) {
      return true;
    }
  }
  return false;
}

export { sortTable };
