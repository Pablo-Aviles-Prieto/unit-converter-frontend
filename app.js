// Imports
import {
  preLoad,
  inputFunction,
  selectFunction,
  changeSelect,
  saveConversion,
} from './controllers/conversion.js';

// Variables
const inputConvertElement = document.querySelector(
  '#result-first-unit-convert'
);
const selectConvertElement = document.querySelector('#select-convert');
const swapBtn = document.querySelector('#convert-btn');
const saveBtn = document.querySelector('#save-btn');

// Event listeners
document.addEventListener('DOMContentLoaded', preLoad);
inputConvertElement.addEventListener('input', inputFunction);
selectConvertElement.addEventListener('input', selectFunction);
swapBtn.addEventListener('click', changeSelect);
saveBtn.addEventListener('click', saveConversion);
