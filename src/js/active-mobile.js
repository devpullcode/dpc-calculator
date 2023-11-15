const loadElementMobile = (status, classElements) => {
  classElements.forEach(classElement => {
    const elements = document.querySelectorAll(`.${classElement}`);
    if (status) elements.forEach(element => element.classList.remove('u-is-hidden'));
    if (!status) elements.forEach(element => element.classList.add('u-is-hidden'));
  });
};

window.addEventListener('load', () => {
  const elements = ['fa-calendar']; // Specify the classes for elements that should be active on mobile.
  if (navigator.maxTouchPoints > 0) {
    loadElementMobile(true, elements);
  } else {
    loadElementMobile(false, elements);
  }
});
