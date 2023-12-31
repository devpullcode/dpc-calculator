(() => {
  const elMbtns = document.querySelector('.m-btns');
  const elMCalResult = document.querySelector('.m-calculation__result');
  const elMCalOperation = document.querySelector('.m-calculation__operation');
  const operatorsRegex = /[-|\+|=|\*|\/|percent|negative|AC|C]/;
  const decimalRegex = /^-?\d+\.\d+$/;
  const numberRegex = /^-?\d+(\.\d+)?$/;
  let operation = '';
  let originalOperation;
  let activePercent = false;

  const calcOperation = () => {
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
        case 'negative':
          break;
      }

      if (decimalRegex.test(resultOperation.toString())) resultOperation = Number(resultOperation.toFixed(2));
    }

    addHistoryOperation(operation, resultOperation);

    elMCalOperation.textContent = 0;
    operation = '';

    return resultOperation;
  };

  const addPoint = () => {
    let fragmentOperation = operation.split(' ').filter(String);
    let lastValue = fragmentOperation.at(-1);

    if (typeof lastValue !== 'undefined' && !/^-?\d+\.$|^-?\d*\.\d+$/.test(lastValue)) {
      lastValue = lastValue + '.';
      fragmentOperation.splice(-1, 1, lastValue);
      operation = fragmentOperation.join(' ');
    } else if (typeof lastValue === 'undefined') {
      lastValue = '0.';
      operation = '0.';
    }
    return lastValue;
  };

  const deleteOperator = () => {
    let fragmentOperation = operation.split(' ').filter(String);
    let lastValue = fragmentOperation.at(-1);
    const fragOrigiOper = originalOperation.split(' ').filter(String);
    let lastValueOrigiOper = fragOrigiOper.at(-1);

    lastValue = lastValue.slice(0, -1);
    fragmentOperation.splice(-1, 1, lastValue);
    operation = fragmentOperation.join(' ');

    lastValueOrigiOper = lastValueOrigiOper.slice(0, -1);
    fragOrigiOper.splice(-1, 1, lastValueOrigiOper);
    originalOperation = fragOrigiOper.join(' ');

    console.log('operation.length: ', operation.length);
    return operation.length > 0 ? lastValue : '0';
  };

  const applyPorcentage = () => {
    const fragmentOperation = operation.split(' ').filter(String);
    let lastValue = fragmentOperation.at(-1);
    const fragOrigiOper = originalOperation.split(' ').filter(String);
    let lastValueOrigiOper = fragOrigiOper.at(-1);

    if (!Number.isNaN(Number(lastValue)) && !activePercent) {
      lastValue = lastValue / 100;
      activePercent = true;
    } else {
      lastValue = lastValueOrigiOper;
      activePercent = false;
    }

    fragmentOperation.splice(-1, 1, lastValue);
    operation = fragmentOperation.join(' ');

    return lastValue;
  };

  const applyNegative = () => {
    const fragmentOperation = operation.split(' ').filter(String);
    let lastValue = fragmentOperation.at(-1);
    const fragOrigiOper = originalOperation.split(' ').filter(String);
    let lastValueOrigiOper = fragOrigiOper.at(-1);

    lastValue = lastValue * -1;
    fragmentOperation.splice(-1, 1, lastValue);
    operation = fragmentOperation.join(' ');

    lastValueOrigiOper = lastValueOrigiOper * -1;
    fragOrigiOper.splice(-1, 1, lastValueOrigiOper);
    originalOperation = fragOrigiOper.join(' ');

    return lastValue;
  };

  const showValueUI = valueBtn => {
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
      case '.':
        if (operation !== '') elMCalOperation.lastChild.remove();
        elMCalOperation.insertAdjacentHTML('beforeend', addPoint());
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
      case 'erase':
        const value = deleteOperator();
        console.log('value: ', value);
        console.log('elMCalOperation: ', elMCalOperation.lastChild);

        elMCalOperation.lastChild?.remove();
        elMCalOperation.insertAdjacentHTML('beforeend', value);

        console.log('elMCalOperation: ', elMCalOperation.lastChild);
        console.log('-----------------------------------------------------');
        if (operation.length === 0) {
          elBtnC.dataset.value = 'AC';
          elBtnC.textContent = 'AC';
        }
        break;
      case 'percent':
        elMCalOperation.lastChild.remove();
        elMCalOperation.insertAdjacentHTML('beforeend', applyPorcentage());

        break;
      case 'negative':
        elMCalOperation.lastChild.remove();
        elMCalOperation.insertAdjacentHTML('beforeend', applyNegative());
        break;
      default:
        const lastValue = operation.split(' ').at(-1);
        if (lastValue.length > 1) elMCalOperation.lastChild.remove();

        const reconstructedValue = lastValue.length > 1 ? lastValue.slice(0, -1) + valueBtn : valueBtn;
        elMCalOperation.insertAdjacentHTML('beforeend', reconstructedValue);

        if (elBtnAC && elBtnAC.dataset.value !== 'C') {
          elBtnAC.dataset.value = 'C';
          elBtnAC.textContent = 'C';
        }

        activePercent = false;
    }

    if (valueBtn !== 'percent' && valueBtn !== 'negative' && valueBtn !== 'erase' && valueBtn !== '.') originalOperation = operation;
  };

  const createOperation = (valueBtn, isNumber) => {
    if (isNumber) operation += valueBtn;
    if (!isNumber && valueBtn !== 'percent' && valueBtn !== 'negative' && valueBtn !== 'erase' && valueBtn !== '.') operation += ' ' + valueBtn + ' ';
  };

  const verifyValue = valueBtn => {
    let check = false;

    if (numberRegex.test(valueBtn)) {
      createOperation(valueBtn, true);
      check = true;
    }
    if (operatorsRegex.test(valueBtn) && valueBtn !== 'AC' && valueBtn !== 'C' && valueBtn !== '=') {
      createOperation(valueBtn, false);
      check = true;
    }
    if (valueBtn === 'AC' || valueBtn === 'C' || valueBtn === '=' || valueBtn === '.') check = true;

    return check;
  };

  const checkStatus = valueBtn => {
    const fragmentOperation = operation.trim().split(' ');
    let lastValue = fragmentOperation.at(-1);

    // ========== value 0 ==========
    // impide agregar mas de un cero al comienzo de la operación
    if (valueBtn === '0' && operation.length === 0) {
      return false;
    }
    // No
    if (valueBtn === '0' && lastValue.length === 1 && lastValue === '0') {
      return false;
    }

    // ========== verify data ==========
    // Cancels the percentage operation with operators
    if (valueBtn === 'percent' || valueBtn === 'negative') {
      if (operatorsRegex.test(lastValue) && lastValue.length === 1) {
        return false;
      }
    }
    // verifies that the data is correct
    if (!valueBtn) return false;
    // prevents adding an operator as the first value
    if (operation === '' && operatorsRegex.test(valueBtn) && valueBtn !== 'AC') return false;
    if (operatorsRegex.test(lastValue) && valueBtn === '.') return false;
    // prevents the addition of consecutive operators to maintain the validity of the mathematical expression
    if (operatorsRegex.test(valueBtn) && !numberRegex.test(elMCalOperation.lastChild?.textContent) && valueBtn !== 'erase') {
      elMCalOperation.lastChild.remove();
      operation = operation.slice(0, -3);
      console.log('test');
    }

    // ========== limits ==========
    if (valueBtn !== '=' && valueBtn !== 'C') {
      // limits the number of digits for the operation
      if (!(operation.split(' ').join('').length < 18) && valueBtn !== 'erase') return false;
      // blocks the possibility of the last character being an operator
      if (operation.split(' ').join('').length === 17 && operatorsRegex.test(valueBtn) && valueBtn !== 'erase') return false;
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
  elMCalResult.addEventListener('click', function (e) {
    console.log(e.target.textContent);
    const value = e.target.textContent;

    if (value === '0') return;
    if (elMCalOperation.textContent === '0') elMCalOperation.textContent = '';

    elMCalOperation.insertAdjacentHTML('beforeend', value);
    operation = operation + value;
    originalOperation = operation;
  });
})();
