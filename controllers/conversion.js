import Data from '../models/data-saved.js';

const inputConvertElement = document.querySelector(
  '#result-first-unit-convert'
);
const resultElement = document.querySelector('#result-second-unit-convert');
const selectConvertElement = document.querySelector('#select-convert');
const firstUnitConverted = document.getElementById('first-unit-convert');
const secondUnitConverted = document.getElementById('second-unit-convert');
const saveBtn = document.querySelector('#save-btn');
const savedSection = document.querySelector('#saved-section');

async function preLoad() {
  const checkingForSessions = await checkForSavedConversions();
  if (!checkingForSessions) {
    return;
  }
  printSavedData(checkingForSessions);
}

function inputFunction(event) {
  const unitToConvert = selectConvertElement.value;
  const numberToConvert = event.target.value;
  unitConverter(unitToConvert, numberToConvert);
}

function selectFunction(event) {
  const unitToConvert = event.target.value;
  const numberToConvert = inputConvertElement.value;
  unitConverter(unitToConvert, numberToConvert);
}

function unitConverter(units, value) {
  let result;
  // km --> miles = km / 1.609344
  // feet --> meters = feet / 3.281
  // cm --> inches = cm / 2.54
  switch (units) {
    case 'km-miles':
      result = value / 1.609344;
      return outputResult('km', 'miles', result);
    case 'miles-km':
      result = value * 1.609344;
      return outputResult('miles', 'km', result);
    case 'feet-meters':
      result = value / 3.281;
      return outputResult('feet', 'meters', result);
    case 'meters-feet':
      result = value * 3.281;
      return outputResult('meters', 'feet', result);
    case 'cm-inches':
      result = value / 2.54;
      return outputResult('cm', 'inches', result);
    case 'inches-cm':
      result = value * 2.54;
      return outputResult('inches', 'cm', result);
  }
}

function outputResult(firstUnit, secondUnit, value) {
  firstUnitConverted.textContent = firstUnit;
  secondUnitConverted.textContent = secondUnit;
  const calculation = Math.round(value * 100) / 100;
  resultElement.textContent = calculation.toFixed(2);
}

function changeSelect() {
  let selectValue = selectConvertElement.value;

  switch (selectValue) {
    case 'km-miles':
      selectConvertElement.value = 'miles-km';
      break;
    case 'miles-km':
      selectConvertElement.value = 'km-miles';
      break;
    case 'feet-meters':
      selectConvertElement.value = 'meters-feet';
      break;
    case 'meters-feet':
      selectConvertElement.value = 'feet-meters';
      break;
    case 'cm-inches':
      selectConvertElement.value = 'inches-cm';
      break;
    case 'inches-cm':
      selectConvertElement.value = 'cm-inches';
      break;
  }
  const firstUnit = firstUnitConverted.textContent;
  const secondUnit = secondUnitConverted.textContent;
  const firstInput = inputConvertElement.value;
  const resultNum = resultElement.textContent;

  if (firstInput <= 0) {
    firstUnitConverted.textContent = secondUnit;
    secondUnitConverted.textContent = firstUnit;
    inputConvertElement.textContent = '0';
    resultElement.textContent = '0.00';
    return;
  }

  firstUnitConverted.textContent = secondUnit;
  secondUnitConverted.textContent = firstUnit;
  inputConvertElement.value = resultNum;
  resultElement.textContent = firstInput;
}

async function saveConversion() {
  const newRegex = /^[0-9]*(\.[0-9]{0,5})?$/;
  if (!newRegex.test(inputConvertElement.value)) {
    return alert('You need to introduce a valid number!!');
  } else if (inputConvertElement.value <= 0) {
    return alert('You need to introduce a number greater than 0!!');
  }
  saveBtn.firstElementChild.classList.toggle('fa-regular');
  saveBtn.firstElementChild.classList.toggle('fa-solid');

  const newConversion = new Data(
    inputConvertElement.value,
    firstUnitConverted.textContent,
    resultElement.textContent,
    secondUnitConverted.textContent
  );
  await Data.insertDataToDb(newConversion);
  const savedSessions = await Data.getDataFromDb();
  printSavedData(savedSessions);

  inputConvertElement.value = 0;
  resultElement.textContent = '0.00';
  setTimeout(removeFullHeart, 500);
}

function printSavedData(dataArray) {
  savedSection.removeChild(savedSection.lastElementChild);
  const createUl = document.createElement('ul');
  createUl.classList.add('ul-saved-section');
  savedSection.appendChild(createUl);

  dataArray.map(function (objSaved) {
    const liElement = document.createElement('li');
    const paragraphElement = document.createElement('p');
    paragraphElement.textContent = `${objSaved.firstValue} 
        ${objSaved.firstUnit} ➝ 
        ${objSaved.secondValue} 
        ${objSaved.secondUnit}`;
    const xBtn = document.createElement('button');
    xBtn.textContent = 'x';

    liElement.appendChild(paragraphElement);
    liElement.appendChild(xBtn);
    createUl.appendChild(liElement);

    xBtn.addEventListener('click', async function (e) {
      await Data.deleteSavedSession(objSaved._id);
      e.target.parentElement.remove();
      if (dataArray.length === 1)  {
        checkForSavedConversions();
      }
    });
  });
  checkForSavedConversions();
}

function removeFullHeart() {
  if (saveBtn.firstElementChild.classList.contains('fa-solid')) {
    saveBtn.firstElementChild.classList.toggle('fa-solid');
    saveBtn.firstElementChild.classList.add('fa-regular');
  }
}

async function checkForSavedConversions() {
  const savedSessions = await Data.getDataFromDb();
  if (savedSessions.length === 0) {
    savedSection.classList.add('hide-class');
    return false;
  }
  savedSection.classList.remove('hide-class');
  return savedSessions;
}

export { preLoad, inputFunction, selectFunction, changeSelect, saveConversion };
