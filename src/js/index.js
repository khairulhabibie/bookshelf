// id : int
// nameBook : string
// authorBook : string
// yearBook : int
// isCompleted : boolean

const books = [];
const RENDER_EVENT = 'render-book';
const SAVE_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

const generateId = () => {
  return +new Date();
};

const generateBookObject = (id, titleBook, authorBook, yearBook, isCompleted) => {
  return {
    id,
    titleBook,
    authorBook,
    yearBook,
    isCompleted,
  };
};

const checkReading = () => {
  let checkbox = document.getElementById('isCompleted');

  if (checkbox.checked) {
    checkbox = true;
  } else {
    checkbox = false;
  }
  return checkbox;
};

const findBook = (bookId) => {
  for (bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
};

const findBookIndex = (bookId) => {
  for (index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
};

// local storage
const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert('Browser ini tidam mendukung local storage !');
    return false;
  }
  return true;
};

const loadDataFromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const saveData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVE_EVENT));
  }
};

const makeBook = (bookObject) => {
  const { id, titleBook, authorBook, yearBook, isCompleted } = bookObject;

  const title = document.createElement('tr');
  title.innerHTML = `<td>Judul</td><td>:</td><td >${titleBook}</td>`;

  const author = document.createElement('tr');
  author.innerHTML = `<td>Penulis</td><td>:</td><td>${authorBook}</td>`;

  const year = document.createElement('tr');
  year.innerHTML = `<td>Tahun</th><td>:</td><td>${yearBook}</td>`;

  const table = document.createElement('table');
  table.append(title, author, year);

  const textContainer = document.createElement('article');
  textContainer.append(table);

  const container = document.createElement('div');
  container.classList.add('book_item');
  container.append(textContainer);
  container.setAttribute('id', `book-${id}`);

  if (isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('green');
    undoButton.innerText = `belum dibaca`;

    const trashButton = document.createElement('button');
    trashButton.classList.add('red');
    trashButton.innerText = `hapus`;

    const smallContainer = document.createElement('div');
    smallContainer.classList.add('action');
    smallContainer.append(undoButton, trashButton);
    textContainer.append(smallContainer);

    undoButton.addEventListener('click', () => {
      undoFromReadCompleted(id);
    });

    trashButton.addEventListener('click', () => {
      removeBookFromCompleted(id);
    });
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('green');
    checkButton.innerText = `sudah dibaca`;

    const trashButton = document.createElement('button');
    trashButton.classList.add('red');
    trashButton.innerText = `hapus`;

    const smallContainer = document.createElement('div');
    smallContainer.classList.add('action');
    smallContainer.append(checkButton, trashButton);
    textContainer.append(smallContainer);

    checkButton.addEventListener('click', () => {
      addReadCompleted(id);
    });

    trashButton.addEventListener('click', () => {
      removeBookFromCompleted(id);
    });
  }

  return container;
};

const addBook = () => {
  const titleBook = document.getElementById('titleBook').value;
  const authorBook = document.getElementById('authorBook').value;
  const yearBook = document.getElementById('yearBook').value;
  const isCompleted = checkReading();

  const generateID = generateId();
  const bookObject = generateBookObject(generateID, titleBook, authorBook, yearBook, isCompleted);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const addReadCompleted = (bookId) => {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = true;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const removeBookFromCompleted = (bookId) => {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const undoFromReadCompleted = (bookId) => {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

document.addEventListener('DOMContentLoaded', () => {
  const submitForm = document.getElementById('inputBook');

  submitForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addBook();
    submitForm.reset();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }

  document.addEventListener(SAVE_EVENT, () => {
    console.log('Data berhasil disimpan');
  });
});

document.addEventListener(RENDER_EVENT, () => {
  const unRead = document.getElementById('unRead');
  const readyRead = document.getElementById('readyRead');

  unRead.innerHTML = '';
  readyRead.innerHTML = '';

  for (bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      readyRead.append(bookElement);
    } else {
      unRead.append(bookElement);
    }
  }
});
