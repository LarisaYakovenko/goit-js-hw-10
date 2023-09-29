import { fetchBreeds, fetchCatByBreed } from "./cat-api";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SlimSelect from 'slim-select'
import 'slim-select/dist/slimselect.css';


const refs = {
  select: document.querySelector('.breed-select'),
  catInfo: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
};
const { select, catInfo, loader, error } = refs;

loader.classList.replace('loader', 'unvisible');
error.classList.add('unvisible');
catInfo.classList.add('unvisible');

Notify.success('Loading data, please wait...');
let arrBreedsId = [];
fetchBreeds()
  .then(data => {
    data.forEach(element => {
      arrBreedsId.push({text: element.name, value: element.id});
    });

    new SlimSelect({
      select: select,
      data: arrBreedsId
    });
  })
  .catch(onFetchError);

select.addEventListener('change', onSelectBreed);

function onSelectBreed(e) {
  e.preventDefault();

  loader.classList.replace('unvisible', 'loader');
  select.classList.add('unvisible');
  catInfo.classList.add('unvisible');

  const breedId = e.currentTarget.value;
  fetchCatByBreed(breedId)
    .then(data => {
      loader.classList.replace('loader', 'unvisible');
      select.classList.remove('unvisible');
      const { url, breeds } = data[0];

      catInfo.innerHTML = `<div class="box-img"><img src="${url}" alt="${breeds[0].name}" width="400"/></div><div class="box"><h1>${breeds[0].name}</h1><p>${breeds[0].description}</p><p><b>Temperament:</b> ${breeds[0].temperament}</p></div>`
      catInfo.classList.remove('unvisible');
    })
    .catch(onFetchError);

};

function onFetchError() {
    select.classList.remove('unvisible');
    loader.classList.replace('loader', 'unvisible');

    Notify.failure('Oops! Something went wrong! Try reloading the page!');
};
