/**
 * Collection of buttons used to add new items to the columns.
 * @const {NodeList} addBtns - NodeList of non-solid buttons with class '.add-btn' for showing input boxes.
 */
const addBtns = document.querySelectorAll('.add-btn:not(.solid)');

/**
 * Collection of buttons used to save new items into the lists.
 * @const {NodeList} saveItemBtns - NodeList of solid buttons with class '.solid' for saving items.
 */
const saveItemBtns = document.querySelectorAll('.solid');

/**
 * Collection of containers where new items are added.
 * @const {NodeList} addItemContainers - NodeList of containers with class '.add-container' used for inputting new tasks.
 */
const addItemContainers = document.querySelectorAll('.add-container');

/**
 * Collection of text inputs for entering new items into the columns.
 * @const {NodeList} addItems - NodeList of elements where new list items are inputted.
 */
const addItems = document.querySelectorAll('.add-item');

/**
 * Array of lists where draggable items are displayed and managed.
 * @const {NodeList} listColumns - NodeList of columns represented by '.drag-item-list' where items can be dragged between.
 */
const listColumns = document.querySelectorAll('.drag-item-list');

/**
 * List element where backlog items are managed.
 * @const {HTMLElement} backlogList - Element corresponding to backlog tasks.
 */
const backlogList = document.getElementById('backlog-list');

/**
 * List element where progress items are managed.
 * @const {HTMLElement} progressList - Element corresponding to tasks in progress.
 */
const progressList = document.getElementById('progress-list');

/**
 * List element where completed items are managed.
 * @const {HTMLElement} completeList - Element corresponding to completed tasks.
 */
const completeList = document.getElementById('complete-list');

/**
 * List element where on-hold items are managed.
 * @const {HTMLElement} onHoldList - Element corresponding to tasks on hold.
 */
const onHoldList = document.getElementById('on-hold-list');

/**
 * Flag to check whether the columns have been updated with data from localStorage on initial load.
 * @var {boolean} updatedOnLoad - Initially false, set to true after the first DOM update from localStorage.
 */
let updatedOnLoad = false;

/**
 * Stores items for the backlog list column.
 * @var {Array<string>} backlogListArray - Array containing strings of backlog items.
 */
let backlogListArray = [];

/**
 * Stores items for the progress list column.
 * @var {Array<string>} progressListArray - Array containing strings of items in progress.
 */
let progressListArray = [];

/**
 * Stores items for the complete list column.
 * @var {Array<string>} completeListArray - Array containing strings of completed items.
 */
let completeListArray = [];

/**
 * Stores items for the on-hold list column.
 * @var {Array<string>} onHoldListArray - Array containing strings of on-hold items.
 */
let onHoldListArray = [];

/**
 * Master list of arrays that holds items for all columns.
 * @var {Array<Array<string>>} listArrays - Array of arrays containing items in each column.
 */
let listArrays = [];

/**
 * The item currently being dragged.
 * @var {HTMLElement} draggedItem - The element that is being dragged.
 */
let draggedItem;

/**
 * Flag to track whether an item is currently being dragged.
 * @var {boolean} dragging - Boolean indicating if drag operation is active.
 */
let dragging = false;

/**
 * Stores the index of the column currently being interacted with during a drag event.
 * @var {number} currentColumn - Index of the current column in interaction during dragging.
 */
let currentColumn;

/**
 * Retrieves columns data from localStorage if available, sets default values if not.
 * Initializes arrays with data or default entries for each column.
 */
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Backlog Test entry'];
    progressListArray = ['Progress Test entry'];
    completeListArray = ['Complete Test entry'];
    onHoldListArray = ['On Hold Test entry'];
  }
}

/**
 * Updates localStorage with the current state of the lists.
 * Serializes the array data of each column into JSON and stores it under a named key.
 */
function updateSavedColumns() {
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];

  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];

  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  });
}

/**
 * Filters an array to remove null items.
 * @param {Array<any>} array - The array to filter.
 * @returns {Array<any>} The filtered array with no null values.
 */
function filterArray(array) {
  const filteredArray = array.filter((item) => item !== null);
  return filteredArray;
}

/**
 * Creates a draggable and editable list item element for a given column.
 * @param {HTMLElement} columnEl - The column element to append this new item to.
 * @param {number} column - The index of the column (0 for backlog, 1 for progress, etc.).
 * @param {string} item - The text content for the new item.
 * @param {number} index - The index of the item within its column for tracking and updates.
 */
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);

  // Append
  columnEl.appendChild(listEl);
}

/**
 * Updates all columns in the DOM by resetting their content, filtering their arrays, and updating localStorage.
 * Ensures each column displays the current items and is synchronized with storage.
 */
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }

  // Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);

  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);

  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);

  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

/**
 * Updates the value or deletes an item in a list depending on content, triggered when editing is completed.
 * @param {number} id - The index of the item in its column.
 * @param {number} column - The column index of the item.
 */
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;

  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }

    updateDOM();
  }
}

/**
 * Adds a new item to a specific column and resets the input box.
 * @param {number} column - The index of the column to add the item to.
 */
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];

  selectedArray.push(itemText);
  addItems[column].textContent = '';

  updateDOM();
}

/**
 * Shows the input box for adding new items in a specific column.
 * @param {number} column - The index of the column to show the input box for.
 */
function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

/**
 * Hides the input box after adding an item and resets the visibility of buttons.
 * @param {number} column - The index of the column to hide the input box for.
 */
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';

  addToColumn(column);
}

/**
 * Rebuilds the arrays by extracting text content from DOM elements, reflecting any drag-and-drop changes.
 */
function rebuildArrays() {
  backlogListArray = Array.from(backlogList.children).map((i) => i.textContent);
  progressListArray = Array.from(progressList.children).map((i) => i.textContent);
  completeListArray = Array.from(completeList.children).map((i) => i.textContent);
  onHoldListArray = Array.from(onHoldList.children).map((i) => i.textContent);

  updateDOM();
}

/**
 * Handles the drag start event by setting the dragged item and marking the drag state.
 * @param {DragEvent} e - The drag event object.
 */
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

/**
 * Allows dropping by preventing the default handling of the drop event.
 * @param {DragEvent} e - The event object associated with the drop.
 */
function allowDrop(e) {
  e.preventDefault();
}

/**
 * Adds styling to indicate a column can accept a drop when a draggable item enters it.
 * @param {number} column - The index of the column that is being dragged over.
 */
function dragEnter(column) {
  listColumns[column].classList.add('over');
  currentColumn = column;
}

/**
 * Removes styling from a column when a draggable item leaves it.
 * @param {number} column - The index of the column that the draggable item is leaving.
 */
function dragLeave(column) {
  listColumns[column].classList.remove('over');
}

/**
 * Handles the drop event by appending the dragged item to the new column and updating arrays.
 * @param {DragEvent} e - The event object associated with the drop.
 */
function drop(e) {
  e.preventDefault();

  // Remove Background Color/Padding
  listColumns.forEach((column) => {
    column.classList.remove('over');
  });

  // Add Item to Column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);

  // Dragging complete
  dragging = false;

  rebuildArrays();
}

/**
 * Calls the updateDOM function to initialize and render the UI based on local storage data when the script loads.
 */
updateDOM();
