import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import './css/styles.css';
import fetchPhoto from './fetchPhoto.js';


const refs = {
    formEl: document.querySelector('#search-form'),
    inputEl: document.querySelector('input'),
    galleryEl: document.querySelector('.gallery'),
    sentEl: document.querySelector('#sentinel'),
}

const { formEl, inputEl, galleryEl, sentEl } = refs;

let inputValue = '';
let userSearch = '';
let totalHits = 0;
let page = 0;
let itemArr = [];

inputEl.addEventListener('input', onInput);
function onInput(evt) {
    inputValue = evt.currentTarget.value;
    return;
}

formEl.addEventListener('submit', onSubmit);
function onSubmit(evt) {
    evt.preventDefault();
    userSearch = inputValue;
    page = 1;
    if (!userSearch) {
        deletePhotoMarkup();
        return;
    }
    deletePhotoMarkup();
    fetchPhoto(userSearch, page)
        .then(search => {
            totalHits = search.data.totalHits;
            if (totalHits > 0) {
                Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
                renderPhotoMarkup(search);
                scrollStart();
            }
            itemArr = search.data.hits;
            if (!itemArr.length) {
                return Notiflix.Notify.failure(
                    'Sorry, there are no images matching your search query. Please try again.'
                );
            }
        })
        .catch(error => console.log(error));
}

let photoLinkEl = [];
function deletePhotoMarkup() {
    photoLinkEl = document.querySelectorAll('.photo-link');
    photoLinkEl?.forEach(element => element.remove());
}

function renderPhotoMarkup(search) {
    itemArr = search.data.hits;
    const markupCard = itemArr.map(hit =>
                `
                <a class="photo-link" href="${hit.largeImageURL}">
                    <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" width=300 height=200 />
                    <div class="photo-card">
                        <div class="info">
                            <p class="info-item">
                                <b>Likes</b><br>${hit.likes}
                            </p>
                            <p class="info-item">
                                <b>Views</b><br>${hit.views}
                            </p>
                            <p class="info-item">
                                <b>Comments</b><br>${hit.comments}
                            </p>
                            <p class="info-item">
                                <b>Downloads</b><br>${hit.downloads}
                            </p>
                        </div>
                    </div>
                </a>`
        )
        .join('');
    galleryEl.insertAdjacentHTML('beforeend', markupCard);
    galleryLightbox.refresh();
}

const galleryLightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
});

/* INFINITY SCROLL - INTERSECTION OBSERVER */

const onEntry = entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && userSearch !== '') {
            page += 1;
            let numberPages = totalHits / 40;
            if (page > Math.ceil(numberPages)) {
                return Notiflix.Notify.failure(
                    "We're sorry, but you've reached the end of search results."
                );
            }
            fetchPhoto(userSearch, page)
                .then(search => {
                    renderPhotoMarkup(search);
                    scrollMore();
                })
                .catch(error => console.log(error));
        }
    });
};

const options = {
    rootMargin: '250px',
};
const observer = new IntersectionObserver(onEntry, options);
observer.observe(sentEl);

function scrollStart() {
    const { height: formHeight } = document.querySelector('.search-form').firstElementChild.getBoundingClientRect();
    window.scrollBy({
        top: formHeight * 1.2,
        behavior: 'smooth',
    });
}

function scrollMore() {
    const { height: cardHeight } = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();
    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
    });
}