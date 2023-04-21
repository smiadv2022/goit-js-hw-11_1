import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";

const DEBOUNCE_DELAY = 300;

import { fetchCountries } from './js/GetApi.js';
const res = fetchCountries("sw");
console.log('000', res);

const refs = {
  inputFilter: document.getElementById('search-box'),
  resultCountry: document.querySelector('.country-info'),
  resultListCountries: document.querySelector('.country-list'),
};

refs.inputFilter.addEventListener(
  'input',
  debounce(onInputCountries, DEBOUNCE_DELAY)
);

async function onInputCountries(e) {
  e.preventDefault();
  const searchQuery = refs.inputFilter.value.trim();
  

  if (searchQuery !== '') {
    try {
      const dataFilter = await fetchCountries(searchQuery);
      if (dataFilter.length > 10) {
        refs.resultListCountries.innerHTML='';
        refs.resultCountry.innerHTML='';
        Notiflix.Notify.info(
          'Too many matches found. Please enter more specific name'
        );
      } else if (dataFilter.length >= 2 && dataFilter.length <= 10) {
      

        const markupList = dataFilter.reduce(
          (markup, data) => markup + createMarkupList(data),
          ''
        );
        // refs.resultListCountries.innerHTML = markupText;
        updateList(markupList);
      
        
      } else if (dataFilter.length === 0) {
        refs.resultListCountries.innerHTML='';
        refs.resultCountry.innerHTML='';
        Notiflix.Notify.failure(
          'Oops, there is no country with that name'
        );
      } else if (dataFilter.length === 1) {
        

        

        const markupCountry = dataFilter.reduce(
          (markup, data) => markup + createMarkupCountry(data),
          ''
        );
        // refs.resultListCountries.innerHTML = markupText;
        updateList(markupCountry);
       
      }
    } catch (error) {
      console.log(error);
    }
  }


function onError (err) {
console.log(err);
}

function createMarkupList({name,flags}){
console.log(name,flags.svg);
return ` <li>  <img src=${flags.svg} width="25">   ${name.common} </li> 
`
} 

function updateList (markup) {

refs.resultListCountries.innerHTML = markup;
}
function createMarkupCountry({name,capital,population,flags,languages}){
  console.log(name,capital,population,flags.svg,(languages));
  return ` <li >  <img src=${flags.svg} width="25">  <span class="boldspan"> ${name.common} </span> </li> 
  <li > <span > Capital: </span>  ${capital} </li> 
  <li > <span> Population:</span> ${population} </li> 
  <li > <span>Languages: </span> ${Object.values(languages)} </li> 
  `
  } 
