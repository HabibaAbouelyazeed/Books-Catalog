const dotHolderDiv = document.querySelector("#dot-holder");
const promotionBannerImg = document.querySelector("#promotion-banner");
const searchInpt = document.querySelector("#searchInpt");
const searchBtn = document.querySelector(".search-bar .search-btn");
const booksCardsHolderDiv = document.querySelector("#booksCardsHolder");
const seeMoreBtn = document.querySelector('.seeMore-btn');


// const pageLimit = 20;
// let currentPageItems = pageLimit;
const bannerImagesSRC = [
  "../assets/books-banner1.png",
  "../assets/books-banner2.png",
];
const ApiBasicPart = "https://www.googleapis.com/books/v1/volumes?q=";
let searchQuery = "software+development";

// 1. Create a new XMLHttpRequest object
let xhr = new XMLHttpRequest();

let slideIndex = 0;
let data = [];

if(document.body.id === "indexPage"){
  onPageLoad();
}

searchBtn.addEventListener("click", function () {
  if (searchInpt.value.trim().length > 0) {
    searchInpt.value = searchInpt.value.trim();
    searchQuery = formatSearchQuery(searchInpt.value);

    // 2. Configure it: GET-request for the URL /article/.../load
    xhr.open("GET", `${ApiBasicPart}${searchQuery}`);

    xhr.responseType = "json";
    // 3. Send the request over the network
    xhr.send();

    // 4. This will be called after the response is received
    xhr.onload = function () {
      if (xhr.status != 200) {
        // analyze HTTP status of the response
        alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
      } else {
        // show the result
        data = xhr.response;
        console.log(data.items.length);
        booksCardsHolderDiv.innerHTML = '';
        for(let i = 0; i < data.items.length; i++){
          booksCardsHolderDiv.appendChild(createBookCard(data.items[i]));
        } 
      }
    };

    xhr.onprogress = function (event) {
      booksCardsHolderDiv.innerHTML = "<p>Loading ... </p>";
    };

    xhr.onerror = function () {
      alert("Request failed");
    };
  }
});

// seeMoreBtn.addEventListener('click',function(){
//   displayNextLimit();
// });


/*********************************************************************************************************************************/
function onPageLoad(){
  createBannerDots();
  dotHolderDiv.childNodes[slideIndex].classList.add("active");

  setInterval(function(){
      slideShow();
  }, 3500);
      xhr.open("GET", `${ApiBasicPart}${searchQuery}`);

      xhr.responseType = "json";
      xhr.send();
  
      xhr.onload = function () {
        if (xhr.status != 200) {
          alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
        } else {
          data = xhr.response;
          // console.log(data.items.length);
          booksCardsHolderDiv.innerHTML = '';
          for(let i = 0; i < data.items.length; i++){
            if(data.items[i] != null){
              booksCardsHolderDiv.appendChild(createBookCard(data.items[i]));
            }
          } 
        }
      };
      xhr.onprogress = function (event) {
        booksCardsHolderDiv.innerHTML = "<p>Loading ... </p>";
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
  if(bookItem.volumeInfo.hasOwnProperty('imageLinks')){
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
  if(bookItem.volumeInfo.hasOwnProperty('description')){
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
        <div  onclick="getBookID(this)" data-info="${bookItem.id}" class="moreDetails-btn btn rounded-pill">Book Details</div>
    </div>
  `;
  bookItemDiv.innerHTML = bookTemp;
  return bookItemDiv;
}
//href="bookDetails.html"

function getBookID(book){
  let bookID = book.getAttribute('data-info');
  console.log(bookID);
  return bookID;
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
