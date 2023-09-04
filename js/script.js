const bannerImagesSRC = ['../assets/books-banner1.png','../assets/books-banner2.png'];

const dotHolderDiv = document.querySelector('#dot-holder')
const promotionBannerImg = document.querySelector('#promotion-banner'); 


let slideIndex = 0;
createBannerDots();
dotHolderDiv.childNodes[slideIndex].classList.add('active');

setInterval(function(){
    slideShow();
}, 3500);


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
