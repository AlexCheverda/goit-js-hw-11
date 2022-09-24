import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import './css/styles.css';
import fetchPhoto from './fetchPhoto.js';

const refs = {
    formEl: document.querySelector('#search-form'),
    inputEl: document.querySelector('input'),
    galleryEl: document.querySelector('.gallery'),

}

