const selected = document.querySelector('.selected')
const selectText = document.querySelector('.selected p')
const selectIcon = document.querySelector('.select-icon')
const optionList = document.querySelector('.option-container')
const options = document.querySelectorAll('.option')

if (selected) {
  selected.addEventListener('click', () => {
    optionList.classList.toggle('active')
    selectIcon.classList.replace('ion-chevron-down', 'ion-chevron-up')
  })
}
if (options) {
  options.forEach(o => {
    o.addEventListener('click', () => {
      selectText.innerHTML = o.querySelector('label').innerHTML;
      optionList.classList.add('active')
    })
  })

}


const contents = document.querySelectorAll('.content div');
const tabs = document.querySelectorAll('.tab');


// if (tabs) {
//   tabs.forEach(tab => {
    
//     tab.addEventListener('click', () => {
//       tabs.forEach(tab => tab.classList.remove('tab-active'))
//       const target = document.querySelector(tab.dataset.tabTarget)
//       contents.forEach(content => {
//         content.classList.remove("con-active")
//       })
//       tab.classList.add('tab-active')
//       target.classList.add('con-active')
//     })
//   })
// }


const burger = document.querySelector('.handburger');
const menu = document.querySelector('.res-menu')

if(burger) {
  burger.addEventListener('click', () => {
    menu.classList.toggle('nav-active');
  })
}