import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import createCountryList from './templates/country-list.hbs';
import createCountryCard from './templates/country-card.hbs';
import { fetchCountries } from './js/fetchCountries';

const searchBoxEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countrInfoEl = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

Notiflix.Notify.init({ timeout: 4000 });

function onCatchReject(error) {
  console.error(error);
  if (error.message === '404') {
    Notiflix.Notify.failure('Oops, there is no country with that name');
    countryListEl.innerHTML = '';
    countrInfoEl.innerHTML = '';
  }
}

function onThenResolve(array) {
  countryListEl.innerHTML = '';
  countrInfoEl.innerHTML = '';

  if (array.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  if (array.length >= 2 && array.length <= 10) {
    countryListEl.innerHTML = createCountryList(array);
    return;
  }
  if (array.length === 1) {
    countrInfoEl.innerHTML = createCountryCard(array[0]);
    return;
  }
}

function onSearchBoxElInput(event) {
  const {
    target: { value },
  } = event;
  if (!value) {
    countryListEl.innerHTML = '';
    countrInfoEl.innerHTML = '';
    return;
  }
  fetchCountries(value.trim()).then(onThenResolve).catch(onCatchReject);
}

searchBoxEl.addEventListener('input', debounce(onSearchBoxElInput, DEBOUNCE_DELAY));
