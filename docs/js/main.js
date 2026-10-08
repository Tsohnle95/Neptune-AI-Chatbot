let sidePanelButton = document.querySelector('.side-menu-button');
let sidePanel = document.querySelector('.side-panel');

sidePanelButton.addEventListener('click', () => {
  sidePanel.classList.toggle('is-open');
})

document.addEventListener('click', (event) => {
  if (
    !sidePanel.contains(event.target) &&
    !sidePanelButton.contains(event.target)
  ) {
    sidePanel.classList.remove('is-open');
  }
});

//Earlier Conversations Dropdown
let dropButton = document.querySelector('.earlier-conversations');
let dropMenu = document.querySelector('.earlier-convo-dropdown');
let dropDownSvgArrow = document.querySelector('.dropdown-arrow');

dropButton.addEventListener('click', (event) => {
  dropMenu.classList.toggle('d-none');
  dropDownSvgArrow.classList.toggle('rotate');

})


