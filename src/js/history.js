const addHistoryOperation = (operation, result) => {
  const mHistory = document.querySelector('.m-history');
  const template = document.querySelector('#history-row-template');
  const clon = template.content.cloneNode(true);

  clon.querySelector('.m-history__operation').textContent = operation;
  clon.querySelector('.m-history__result').textContent = result;

  console.log();
  mHistory.insertAdjacentHTML('beforeend', clon.firstElementChild.outerHTML);
  mHistory.scrollTop = -500;
};
