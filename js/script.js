const bannerImagesSRC = ['../assets/books-banner1.png','../assets/books-banner2.png'];

const dotHolderDiv = document.querySelector('#dot-holder')
const promotionBannerImg = document.querySelector('#promotion-banner'); 
const searchInpt = document.querySelector('#searchInpt');
const searchBtn = document.querySelector('.search-bar .search-btn')

const ApiBasicPart = 'https://www.googleapis.com/books/v1/volumes?q=';
let searchQuery = 'software+development';


let slideIndex = 0;
createBannerDots();
dotHolderDiv.childNodes[slideIndex].classList.add('active');

// setInterval(function(){
//     slideShow();
// }, 3500);


searchBtn.addEventListener('click', function(){
    if(searchInpt.value.trim().length > 0){
        searchInpt.value = searchInpt.value.trim();
        searchQuery = formatSearchQuery(searchInpt.value);
    }
});

function formatSearchQuery(queryString){
    let formatedString = '';
    queryString = queryString.trim().split(' ');
    for(let i = 0; i < queryString.length ; i++){
        if(queryString[i].length > 0){
            formatedString += queryString[i] + '+';
        }
    }
    formatedString = (formatedString.substring(0, formatedString.length - 1)); 
    return formatedString;
}

function slideShow(){
    dotHolderDiv.childNodes[slideIndex].classList.remove('active')    
    slideIndex++;
    if(slideIndex >= bannerImagesSRC.length){
        slideIndex = 0;
    }

    promotionBannerImg.setAttribute('src', bannerImagesSRC[slideIndex]);
    dotHolderDiv.childNodes[slideIndex].classList.add('active')
}

function createBannerDots(){
    let dots = [];
    for(let i = 0; i < bannerImagesSRC.length ; i++){
        let dotElement = document.createElement('span');
        dotElement.classList.add('slide-dot');
        dotHolderDiv.appendChild(dotElement);
        dots += dotElement;
    }

    return dots;
}
