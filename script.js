window.onload = function () {
    const numRows = 100;
    const numCols = 100;
    let selectedCell = null; // Store the currently selected cell

    const dataContainer = document.querySelector('.data-container');

    function generateColumnHeaders() {
        let columns = `<div class="top-left-box"></div>`; // Placeholder for top-left box
        for (let i = 1; i <= numCols; i++) {
            const colLetter = getColumnLetter(i);
            columns += `<div class="column-cell">${colLetter}</div>`;
        } 
        return columns;
    }

    function generateRowHeaders() {
        let rows = '';
        for (let i = 1; i <= numRows; i++) {
            rows += `<div class="row-cell">${i}</div>`;
        }
        return rows;
    }

    function getColumnLetter(n) {
        let letter = '';
        while (n > 0) {
            n--;
            letter = String.fromCharCode((n % 26) + 65) + letter;
            n = Math.floor(n / 26);
        }
        return letter;
    }

    // Create column headers
    const columnNamesContainer = document.createElement('div');
    columnNamesContainer.classList.add('column-name-container');
    columnNamesContainer.innerHTML = generateColumnHeaders();
    dataContainer.appendChild(columnNamesContainer);

    // Create row headers
    const rowNamesContainer = document.createElement('div');
    rowNamesContainer.classList.add('row-name-container');
    rowNamesContainer.innerHTML = generateRowHeaders();
    dataContainer.appendChild(rowNamesContainer);

    // Create input cell grid
    const inputCellContainer = document.createElement('div');
    inputCellContainer.classList.add('input-cell-container');
    inputCellContainer.style.gridTemplateColumns = `repeat(${numCols}, 125px)`;
    inputCellContainer.style.gridTemplateRows = `repeat(${numRows}, 30px)`;

    for (let row = 1; row <= numRows; row++) {
        for (let col = 1; col <= numCols; col++) {
            const inputCell = document.createElement('div');
            inputCell.classList.add('cell');
            inputCell.setAttribute('data-row', row);
            inputCell.setAttribute('data-col', col);
            inputCell.innerHTML = `<input type="text" class="cell-input" />`;

            inputCellContainer.appendChild(inputCell);
        }
    }

    dataContainer.appendChild(inputCellContainer);

    // Undo and Redo functionality (simple)
    let undoStack = [];
    let redoStack = [];

    document.getElementById('undo').addEventListener('click', () => {
        if (undoStack.length > 0) {
            const lastState = undoStack.pop();
            redoStack.push(lastState);
            restoreState(lastState);
        }
    });

    document.getElementById('redo').addEventListener('click', () => {
        if (redoStack.length > 0) {
            const lastState = redoStack.pop();
            undoStack.push(lastState);
            restoreState(lastState);
        }
    });

    // Save state for undo/redo
    function saveState() {
        const state = [];
        document.querySelectorAll('.cell-input').forEach(input => {
            state.push(input.value);
        });
        undoStack.push(state);
        if (undoStack.length > 10) undoStack.shift(); // Limit the stack size
    }

    // Restore state
    function restoreState(state) {
        let i = 0;
        document.querySelectorAll('.cell-input').forEach(input => {
            input.value = state[i++];
        });
    }

    // Track changes in cells for undo
    document.querySelectorAll('.cell-input').forEach(input => {
        input.addEventListener('input', saveState);
    });

    // Event delegation for cell selection
    inputCellContainer.addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('cell')) {
            if (selectedCell) {
                selectedCell.classList.remove('selected-cell');
            }
            selectedCell = e.target;
            selectedCell.classList.add('selected-cell');
        }
    });
};

$(document).ready(function () {
    $("#autosave-toggle").change(function () {
        if (this.checked) {
            $(".autosave-text").text("AutoSave ");
        } else {
            $(".autosave-text").text("AutoSave ");

        }
    });// Example to handle cell selection and update cell address
let selectedCell = null;

document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', function() {
        if (selectedCell) {
            selectedCell.classList.remove('selected-cell');
        }
        selectedCell = this;
        selectedCell.classList.add('selected-cell');

        // Update the cell address
        const row = selectedCell.parentNode.rowIndex + 1; // row number (1-based index)
        const column = selectedCell.cellIndex + 1; // column number (1-based index)
        document.getElementById('cell-address').innerText = `${String.fromCharCode(64 + column)}${row}`;
    });
});

});
