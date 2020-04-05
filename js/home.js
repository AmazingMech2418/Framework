$(document).ready(()=>{
  if(document.body.getAttribute('bg-img')) {
    document.documentElement.style.setProperty('--background',document.body.getAttribute('bg-img'));
  }
});
