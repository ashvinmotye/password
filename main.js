var button = document.querySelector('input[type=\'submit\']');

button.addEventListener('click', function(){

  var error = document.querySelector('#error');
  error.innerHTML = '';

  var selected = document.querySelectorAll('input:checked');
  var passwordLength = document.querySelector('#password-length').value;

  if(selected.length === 0) {
    error.innerHTML = 'select password components';
    return;
  }

  if(selected.length < 2) {
    error.innerHTML = 'use at least 2 components';
    return;
  }

  if(passwordLength === '' || passwordLength < 8 || passwordLength > 16) {
    error.innerHTML = 'password length from 8 to 16';
    return;
  }

  // get characters needed
  var needed = [];
  for(var i=0; i<selected.length; i++) {
    needed.push(selected[i].value);
  }

  var password = createPassword(needed, passwordLength);

  var passwordElement = document.querySelector('#password');
  var passwordContainer = document.querySelector('.password-container');

  passwordElement.innerHTML = password;
  passwordElement.style.color = '#4a4a4a';
  passwordContainer.style.borderColor = '#4a4a4a';

});

function createPassword(array, passwordLength) {
  var numberOfComponents = array.length;

  var characterRange = getRange(array);

  var eachSymbolLengthArray = getSymbolLength(numberOfComponents, passwordLength);

  var password = '';
  // #35 $36 &38 +43 @64 ^94 _95
  var symbolsArrayCharCodes = [35, 36, 38, 43, 64, 94, 95];
  var passwordArray = [];

  // user wants special symbols
  if(array.indexOf('special') !== -1) {
    var symbolsLength = eachSymbolLengthArray[numberOfComponents-1];
    
    for(var i=0; i<symbolsLength; i++) {
      var index = Math.floor(Math.random()*symbolsArrayCharCodes.length);

      passwordArray.push(symbolsArrayCharCodes[index]);
    }

    passwordArray = generateCharCodes(passwordArray, characterRange, eachSymbolLengthArray);
  }

  else {
    passwordArray = generateCharCodes(passwordArray, characterRange, eachSymbolLengthArray);
  }

  for(var j=0; j<passwordArray.length; j++) {
    password = password + '&#' + passwordArray[j] +';';
  }

  return password;
}

function shuffleArray(arr) {
  var temp, random;

  for(var i=arr.length-1; i>0; i--) {
    random = Math.floor(Math.random()*i);
    temp = arr[i];
    arr[i] = arr[random];
    arr[random] = temp;
  }

  return arr;
}

function generateCharCodes(originalArray, characterRange, eachSymbolLengthArray) {
  var tempArray = [];

  for(var i=0; i<characterRange.length; i++) {
    var length = eachSymbolLengthArray[i];
    var min = characterRange[i][0];
    var max = characterRange[i][1];
    var temp;

    for(j=0; j<length; j++) {
      do {
        temp = getRandomInclusive(min, max);
      } while(tempArray.indexOf(temp) !== -1);

      tempArray.push(temp);
    }
  }

  originalArray = originalArray.concat(tempArray);
  originalArray = shuffleArray(originalArray);

  return originalArray;
}

function getRandomInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSymbolLength(components, passwordLength) {
  var arr = [];

  for(var i=0; i<components; i++) {
    arr.push(1);
  }

  for(var j=0; j<passwordLength-components; j++) {
    var index = Math.floor(Math.random()*components);

    arr[index]++;
  }
  
  return arr;
}

function getRange(array) {
  var componentRange = [
    {
      "name": "lowercase",
      "start": 97,
      "end": 122
    },

    {
      "name": "uppercase",
      "start": 65,
      "end": 90
    },

    {
      "name": "digits",
      "start": 48,
      "end": 57
    }
  ];

  var returnArray = [];

  for(var i=0; i<componentRange.length; i++) {
    var currentComponent = componentRange[i].name;

    if(array.indexOf(currentComponent) !== -1) {
      returnArray.push([componentRange[i].start, componentRange[i].end]);
    }
  }

  return returnArray;
}