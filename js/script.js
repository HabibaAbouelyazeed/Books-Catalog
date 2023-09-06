const dotHolderDiv = document.querySelector("#dot-holder");
const promotionBannerImg = document.querySelector("#promotion-banner");
const searchInpt = document.querySelector("#searchInpt");
const searchBtn = document.querySelector(".search-bar .search-btn");
const booksCardsHolderDiv = document.querySelector("#booksCardsHolder");

const bannerImagesSRC = [
  "./assets/books-banner1.png",
  "./assets/books-banner2.png",
];
const ApiBasicPart = "https://www.googleapis.com/books/v1/volumes?q=";
let searchQuery = "software+development";

let xhr = new XMLHttpRequest();

let slideIndex = 0;
let data = [];
let currentbookID = "";

if (document.body.id === "indexPage") {
  searchBtn.addEventListener("click", function () {
    if (searchInpt.value.trim().length > 0) {
      searchInpt.value = searchInpt.value.trim();
      searchQuery = formatSearchQuery(searchInpt.value);

      booksCardsHolderDiv.innerHTML = '';
      booksCardsHolderDiv.appendChild(renderLoader());

      xhr.open("GET", `${ApiBasicPart}${searchQuery}`);
      xhr.responseType = "json";
      xhr.send();

      xhr.onload = function () {
        if (xhr.status != 200) {
          alert(`Error ${xhr.status}: ${xhr.statusText}`);
        } else {
          data = xhr.response;
          booksCardsHolderDiv.innerHTML = "";
          for (let i = 0; i < data.items.length; i++) {
            booksCardsHolderDiv.appendChild(createBookCard(data.items[i]));
          }
        }
      };

      xhr.onprogress = function (event) {
        booksCardsHolderDiv.innerHTML = '';
        booksCardsHolderDiv.appendChild(renderLoader());
      };

      xhr.onerror = function () {
        alert("Request failed");
      };
    }
  });
}

/*********************************************************************************************************************************/
function onPageLoad() {
  createBannerDots();
  dotHolderDiv.childNodes[slideIndex].classList.add("active");

  setInterval(function () {
    slideShow();
  }, 3500);

  booksCardsHolderDiv.innerHTML = '';
  booksCardsHolderDiv.appendChild(renderLoader());

  xhr.open("GET", `${ApiBasicPart}${searchQuery}`);

  xhr.responseType = "json";
  xhr.send();

  xhr.onload = function () {
    if (xhr.status != 200) {
      alert(`Error ${xhr.status}: ${xhr.statusText}`);
    } else {
      data = xhr.response;
      booksCardsHolderDiv.innerHTML = "";
      for (let i = 0; i < data.items.length; i++) {
        if (data.items[i] != null) {
          booksCardsHolderDiv.appendChild(createBookCard(data.items[i]));
        }
      }
    }
  };
  xhr.onprogress = function (event) {
    booksCardsHolderDiv.innerHTML = '';
    booksCardsHolderDiv.appendChild(renderLoader());
  };
  xhr.onerror = function () {
    alert("Request failed");
  };
}

function createBookCard(bookItem) {
  const bookItemDiv = document.createElement("div");
  let bookTemp = ``;
  bookTemp += `
      <div class="book-Item-Card">
      `;
  if (bookItem.volumeInfo.hasOwnProperty("imageLinks")) {
    bookTemp += `
      <div class="book-image-holder">
          <img src="${bookItem.volumeInfo.imageLinks.thumbnail}" alt="bookThumbnail" class="image-fluid">
      </div>
      `;
  }
  bookTemp += `
    <div class="book-info">
            <h2 class="book-name">${bookItem.volumeInfo.title}</h2>
  `;
  if (bookItem.volumeInfo.hasOwnProperty("description")) {
    bookTemp += `

      <p class="book-details">
      <span><i>Description: </i><br></span>
      ${bookItem.volumeInfo.description}
      </p>
      `;
  }
  bookTemp += `
            <h4 class="book-author"><span><i>Author: </i></span>${bookItem.volumeInfo.authors[0]}</h4>
        </div>
        <div onclick="goToDetailsPage(this)" data-info="${bookItem.id}" class="moreDetails-btn btn rounded-pill">Book Details</div>
    </div>
  `;
  bookItemDiv.innerHTML = bookTemp;
  return bookItemDiv;
}

function goToDetailsPage(book) {
  let bookID = book.getAttribute("data-info");
  let redirectUrl = "./bookDetails.html?id=" + bookID;
  document.location.href = redirectUrl;
}


function formatSearchQuery(queryString) {
  let formatedString = "";
  queryString = queryString.trim().split(" ");
  for (let i = 0; i < queryString.length; i++) {
    if (queryString[i].length > 0) {
      formatedString += queryString[i] + "+";
    }
  }
  formatedString = formatedString.substring(0, formatedString.length - 1);
  return formatedString;
}

function slideShow() {
  dotHolderDiv.childNodes[slideIndex].classList.remove("active");
  slideIndex++;
  if (slideIndex >= bannerImagesSRC.length) {
    slideIndex = 0;
  }

  promotionBannerImg.setAttribute("src", bannerImagesSRC[slideIndex]);
  dotHolderDiv.childNodes[slideIndex].classList.add("active");
}

function createBannerDots() {
  let dots = [];
  for (let i = 0; i < bannerImagesSRC.length; i++) {
    let dotElement = document.createElement("span");
    dotElement.classList.add("slide-dot");
    dotHolderDiv.appendChild(dotElement);
    dots += dotElement;
  }

  return dots;
}

// Book details functions
function onDetailsPageLoad() {
  const bookDetailsSecDiv = document.querySelector("#bookDetailsSec");
  let extractedId = extractUrlId();
  let bookUrl = "https://www.googleapis.com/books/v1/volumes/" + extractedId;

  bookDetailsSecDiv.innerHTML = '';
  bookDetailsSecDiv.appendChild(renderLoader());
  
  xhr.open("GET", bookUrl);
  xhr.responseType = "json";
  xhr.send();

  xhr.onload = function () {
    if (xhr.status != 200) {
      alert(`Error ${xhr.status}: ${xhr.statusText}`);
    } else {
      bookDetailsSecDiv.innerHTML = "";
      data = xhr.response;
      bookDetailsSecDiv.innerHTML = renderBookDetails(data);
    }
  };

  xhr.onprogress = function (event) {
    bookDetailsSecDiv.innerHTML = '';
    bookDetailsSecDiv.appendChild(renderLoader());
  };

  xhr.onerror = function () {
    alert("Request failed");
  };
}

function renderBookDetails(book) {
  let bookTemp = `
    <h1 class="txt-center">Book details</h1>
    <div class="main-info">
    `;
  if (book.volumeInfo.hasOwnProperty("imageLinks")) {
    bookTemp += `
    <div class="bookImage">
      <img src="${book.volumeInfo.imageLinks.thumbnail}" alt="book Thumbnail" class="image-fluid">
    </div>
    `;
  }
  bookTemp += `
    <div class="info">
      <h2 class="book-title">${book.volumeInfo.title}</h2>
  `;
  if (book.volumeInfo.hasOwnProperty("description")) {
    bookTemp += `
    <div class="book-description">${book.volumeInfo.description}</div>
    `;
  }
  bookTemp += `
      </div>
    </div>`;
  bookTemp += `
  <div class="book-authors">
      <h3>Authors</h3>
      <ul class="authors-list">
  `;
  for (let i = 0; i < book.volumeInfo.authors.length; i++) {
    bookTemp += `<li>${i+1}.${book.volumeInfo.authors[i]}</li> `;
  }

  bookTemp += `
      </ul>
    </div>
  `;

  bookTemp += `
    <div class="extra-info">
      <div class="publisher">
        <h3>Publisher:</h3>
        <p>${book.volumeInfo.publisher}</p>
      </div>

      <div class="published-date">
        <h3>Published Date:</h3>
        <p>${book.volumeInfo.publishedDate}</p>
      </div>
    </div>
  
  `;

  return bookTemp;
}

function extractUrlId() {
  let url = document.location.href;
  let extractedId = url.split("?")[1].split("=")[1];
  return extractedId;
}


// Loader

function animateLoader(loaderHolder){
  let index = 0;
  setInterval(function () {
      loaderHolder.children[index++].classList.remove("active-marble");
      if (index >= loaderHolder.children.length) {
        index = 0;
      }
      loaderHolder.children[index].classList.add("active-marble");
  }, 700);
}

function renderLoader(){
  let loaderHolder = document.createElement("div");
  loaderHolder.classList.add("loader-holder");
  loaderHolder.innerHTML = `
  <div class="loader-marble active-marble"></div>
  <div class="loader-marble"></div>
  <div class="loader-marble"></div>
  <div class="loader-marble"></div>
  <div class="loader-marble"></div>
  `;
  animateLoader(loaderHolder);
  return loaderHolder;
}

