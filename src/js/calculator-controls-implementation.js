(() => {
  const elMbtns = document.querySelector('.m-btns');
  const operatorsRegex = /[-|\+|=|\*|\/|percent|negative|AC|C]/;
  const decimalRegex = /^-?\d+\.\d+$/;
  const numberRegex = /^-?\d+(\.\d+)?$/;
  let operation = '';

  const calcOperation = () => {
    const elMCalOperation = document.querySelector('.m-calculation__operation');
    const fragmentOperation = operation.split(' ');
    let resultOperation = Number(fragmentOperation.shift());

    while (fragmentOperation.length > 0) {
      switch (fragmentOperation.shift()) {
        case '+':
          resultOperation += Number(fragmentOperation.shift());
          break;
        case '-':
          resultOperation -= Number(fragmentOperation.shift());
          break;
        case '*':
          resultOperation *= Number(fragmentOperation.shift());
          break;
        case '/':
          resultOperation /= Number(fragmentOperation.shift());
          break;
        case 'porcent':
          break;
        case 'negative':
          break;
      }

      if (decimalRegex.test(resultOperation.toString())) resultOperation = Number(resultOperation.toFixed(2));
    }

    elMCalOperation.textContent = 0;
    operation = '';

    return resultOperation;
  };

  const showValueUI = valueBtn => {
    const elMCalResult = document.querySelector('.m-calculation__result');
    const elMCalOperation = document.querySelector('.m-calculation__operation');
    const elBtnAC = document.querySelector('.m-btns__btn[data-value="AC"]');
    const elBtnC = document.querySelector('.m-btns__btn[data-value="C"]');

    if (valueBtn !== 'AC' && elMCalOperation.textContent === '0') elMCalOperation.textContent = '';

    switch (valueBtn) {
      case '+':
        elMCalOperation.insertAdjacentHTML('beforeend', `<i class="fa-solid fa-plus"></i>`);
        break;
      case '-':
        elMCalOperation.insertAdjacentHTML('beforeend', `<i class="fa-solid fa-minus"></i>`);
        break;
      case '*':
        elMCalOperation.insertAdjacentHTML('beforeend', `<i class="fa-solid fa-xmark"></i>`);
        break;
      case '/':
        elMCalOperation.insertAdjacentHTML('beforeend', `<i class="fa-solid fa-divide"></i>`);
        break;
      case '=':
        let resultOperation = calcOperation();
        elMCalResult.textContent = resultOperation;

        elBtnC.dataset.value = 'AC';
        elBtnC.textContent = 'AC';
        break;
      case 'AC':
        elMCalResult.textContent = '0';
        break;
      case 'C':
        elMCalOperation.textContent = '0';
        operation = '';

        elBtnC.dataset.value = 'AC';
        elBtnC.textContent = 'AC';
        break;
      case 'porcent':
        break;
      case 'negative':
        convertNegPos(valueBtn);
        break;
      default:
        if (valueBtn !== '=') {
          elMCalOperation.insertAdjacentHTML('beforeend', valueBtn);

          if (elBtnAC && elBtnAC.dataset.value !== 'C') {
            elBtnAC.dataset.value = 'C';
            elBtnAC.textContent = 'C';
          }
        }
    }
  };

  const createOperation = (valueBtn, isNumber) => {
    const elMCalOperation = document.querySelector('.m-calculation__operation');

    // prettier-ignore
    if (operatorsRegex.test(valueBtn) && 
        !numberRegex.test(elMCalOperation.lastChild?.textContent)) {
      elMCalOperation.lastChild.remove();
      operation = operation.slice(0, -3);
      console.log('operation.slice(0, -3):', operation.slice(0, -3));
    }

    if (isNumber) operation += valueBtn;
    if (!isNumber && valueBtn !== '=') operation += ' ' + valueBtn + ' ';
  };

  const verifyValue = valueBtn => {
    let check = false;

    if (numberRegex.test(valueBtn)) {
      createOperation(valueBtn, true);
      check = true;
    }
    if (operatorsRegex.test(valueBtn) && valueBtn !== 'AC' && valueBtn !== 'C') {
      createOperation(valueBtn, false);
      check = true;
    }
    if (valueBtn === 'AC' || valueBtn === 'C') check = true;

    return check;
  };

  const checkStatus = valueBtn => {
    // ========== verify data ==========
    // verifies that the data is correct
    if (!valueBtn) return false;
    // prevents adding an operator as the first value
    if (operation === '' && operatorsRegex.test(valueBtn) && valueBtn !== 'AC') return false;

    // ========== limits ==========
    if (valueBtn !== '=' && valueBtn !== 'C') {
      // limits the number of digits for the operation
      if (!(operation.split(' ').join('').length < 18)) return false;
      // blocks the possibility of the last character being an operator
      if (operation.split(' ').join('').length === 17 && operatorsRegex.test(valueBtn)) return false;
    }

    // ========== equal ==========
    // checks that there is at least one operator before calculating the operation
    if (valueBtn === '=' && numberRegex.test(operation)) return false;

    return verifyValue(valueBtn);
  };

  elMbtns.addEventListener('click', function (e) {
    const valueBtn = e.target.dataset.value;

    if (!checkStatus(valueBtn)) return;

    showValueUI(valueBtn);
  });
})();
