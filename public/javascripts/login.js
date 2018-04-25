document.addEventListener('DOMContentLoaded', () => {
    console.log(document.getElementsByTagName("form"));
  document.getElementsByTagName("form")[0].addEventListener('submit', (e) => {
      // e.preventDefault();

      Cookies.set('login', e.target[0].value);
      console.log(document.cookie);
      // e.stopPropagation();
    })
}, false);