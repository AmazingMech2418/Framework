/* The JavaScript behind Framework CSS */


/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function openNav() {
  var x = document.getElementsByClassName("navbar")[0];
  if (x.className == "navbar") {
    x.style.height = '55px';
    x.className += " responsive";
    x.style.height = (55+mh)+'px';
  } else {
    x.className = "navbar";
    x.style.height = '55px';
  }
}
let max_size = 0;

let mh = 0;
$(document).ready(function() {
  initAngles();
  $(".sitename").css("height", $(".icon").height());
  document.getElementsByClassName("navbar")[0].style.height = '55px';
  for(let i=0; i<document.getElementsByClassName('navbar')[0].getElementsByTagName('button').length; i++) {
    max_size += Number(document.getElementsByClassName('navbar')[0].getElementsByTagName('button')[i].offsetWidth);
    mh += Number(document.getElementsByClassName('navbar')[0].getElementsByTagName('button')[i].offsetHeight);
    //console.log(Number(document.getElementsByClassName('navbar')[0].getElementsByTagName('button')[i].offsetWidth));
    //console.log(document.getElementsByClassName('navbar')[0].getElementsByTagName('button')[i].textContent);
  }
  max_size+=$('.sitename')[0].offsetWidth;
  //console.log(max_size);
  if(window.innerWidth<max_size) {
    document.body.className += ' mobile';
  } else {
    let temp = document.body.className.split(' ');
    let t2 = [];
    for(let i in temp) {
      if(temp[i]!='mobile') {
        t2.push(temp[i])
      }
    }
    document.body.className = t2.join(' ');
  }

  $('.icon')[0].onclick = () => {
    openNav();
  };
  initBtns();
  pageManager();
  //initPR();
  processAngles();
});

document.head.appendChild(document.createElement('style'));
let dynamic_style = document.getElementsByTagName('style')[document.getElementsByTagName('style').length-1];

window.addEventListener('resize',() => {
  document.getElementsByClassName("navbar")[0].style.height = '55px';
  document.getElementsByClassName("navbar")[0].className = 'navbar';
  if(window.innerWidth<max_size) {
    document.body.className += ' mobile';
  } else {
    let temp = document.body.className.split(' ');
    let t2 = [];
    for(let i in temp) {
      if(temp[i]!='mobile') {
        t2.push(temp[i])
      }
    }
    document.body.className = t2.join(' ');
  }
});
let mainpage;
function pageManager() {
  let pages = document.getElementsByTagName('page');
  let hash = location.hash;
  let old_mainpage = mainpage;
  mainpage = undefined;
  for(let i=0; i<pages.length; i++) {
    if(pages[i].getAttribute('hash')==hash) {
      mainpage = i;
      break;
    }
  }
  if(!mainpage) {
    for(let i=0; i<pages.length; i++) {
      if(pages[i].getAttribute('main')==true || pages[i].getAttribute('main')=="true" || pages[i].getAttribute('main')=="" && pages[i].getAttribute('main')!=null) {
        mainpage = i;
        break;
      }
    }
  }
  if(mainpage||mainpage===0) {
    for(let i=0; i<pages.length; i++) {
      if(i!=mainpage) {
        pages[i].hidden = true;
      }
    }
    pages[mainpage].hidden = false;
    if(mainpage!=old_mainpage) {
      pages[mainpage].scrollTop = 0;
    }
  }
  window.requestAnimationFrame(pageManager);
}

function initBtns() {
  for(let i=0; i<document.getElementsByTagName('button').length; i++) {
    if("redir" in document.getElementsByTagName('button')[i].attributes){
      document.getElementsByTagName('button')[i].onclick = Function(`return (function(){${['','if(window.innerWidth<max_size) {openNav();}'][Number(Array.from(document.querySelectorAll('.navbar button')).indexOf(document.getElementsByTagName('button')[i])!=-1)]}location.assign("${document.getElementsByTagName('button')[i].getAttribute("redir")}");})`)();
    } 
  }
}


function hideLoader() {

  document.getElementsByClassName('loader')[0].hidden = true;
}


function showLoader() {

  document.getElementsByClassName('loader')[0].hidden = false;
}

function loadData(url,method,callback,data=undefined) {
  let fn = (d) => {callback(d); hideLoader();};
  showLoader();
  if(method=="GET") {
    try {
    $.get(url,fn);
    } catch(err) {
      hideLoader();
      throw Error(err);
    }
  } else if(method=="POST") {
    try {
    $.post(url,data,fn);
    } catch(err) {
      hideLoader();
      throw Error(err);
    }
  } else {
    hideLoader();
    throw Error(`Invalid request method ${method}`);
  }
}

function initAngles() { // Similar to AngularJS
  document.body.innerHTML = document.body.innerHTML.replace(/```/gi, `<pre><code>{{\``).replace(/`'`/gi, `\`}}</code></pre>`).replace(/'''/gi, `<code>{{\``).replace(/'`'/gi, `\`}}</code>`);
  for(let i=0;i<document.body.innerHTML.length;i++) {
    if(document.body.innerHTML[i]=='{'&&document.body.innerHTML[i+1]=='{') {
      let curr_angle = "{{"
      i+=2;
      let bracket = 1;
      while(bracket!=0) {
        curr_angle+=document.body.innerHTML[i];
        if(document.body.innerHTML[i]=='{'&&document.body.innerHTML[i+1]=='{') {
          bracket++;
        }
        if(document.body.innerHTML[i]=='}'&&document.body.innerHTML[i-1]=='}') {
          bracket--;
        }
        i++;
      }
      let span = document.createElement("span");
      span.className = 'angle';
      span.setAttribute('js',curr_angle.slice(2,curr_angle.length-2));
      document.body.innerHTML = document.body.innerHTML.replace(curr_angle,/*`<span class="angle"></span>`*/span.outerHTML);
    }
  }
  
  for(let i=0;i<document.body.innerHTML.length;i++) {
    if(document.body.innerHTML[i]=='{'&&document.body.innerHTML[i+1]=='[') {
      let curr_angle = "{["
      i+=2;
      let bracket = 1;
      while(bracket!=0) {
        curr_angle+=document.body.innerHTML[i];
        if(document.body.innerHTML[i]=='{'&&document.body.innerHTML[i+1]=='[') {
          bracket++;
        }
        if(document.body.innerHTML[i]=='}'&&document.body.innerHTML[i-1]==']') {
          bracket--;
        }
        i++;
      }
      let span = document.createElement("span");
      span.className = 'angle-once';
      span.setAttribute('js',curr_angle.slice(2,curr_angle.length-2));
      document.body.innerHTML = document.body.innerHTML.replace(curr_angle,/*`<span class="angle"></span>`*/span.outerHTML);
    }
  }
}


let angle_run = 0;
function processAngles() {
  
  for(let i=0; i<document.getElementsByClassName('angle').length; i++) {
    //console.log(i);
    document.getElementsByClassName('angle')[i].textContent='';
  }

  if(angle_run<=1) {
    for(let i=0; i<document.getElementsByClassName('angle-once').length; i++) {
    //console.log(i);
    document.getElementsByClassName('angle-once')[i].textContent='';
  }
  for(let i=0; i<document.getElementsByClassName('angle-once').length; i++) {
    console.log(i);
    document.getElementsByClassName('angle-once')[i].textContent='';
    document.getElementsByClassName('angle-once')[i].textContent=(function(jsval){try {return Function(`return ${jsval}`)();} catch(err) {console.error(err);return '';}})(document.getElementsByClassName('angle-once')[i].getAttribute('js'));
    console.log(document.getElementsByClassName('angle-once')[i].textContent);
  }
  //PR.prettyPrint();
  } 

  for(let i=0; i<document.getElementsByClassName('angle').length; i++) {
    //console.log(i);
    document.getElementsByClassName('angle')[i].textContent='';
    document.getElementsByClassName('angle')[i].textContent=(function(jsval){try {return Function(`return ${jsval}`)();} catch(err) {console.error(err);return '';}})(document.getElementsByClassName('angle')[i].getAttribute('js'));
  }
  let list = /*document.getElementsByClassName('prettyprinted');*/$('.prettyprinted');
  for(let i=0; i<list.length; i++) {
    list[i].className = list[i].className.replace(' prettyprinted','').replace('prettyprinted ','');
    $('.pln, .tag').remove();
  }
   if (angle_run==0) {
  initPR();
  }
  PR.prettyPrint();
  angle_run++;
  window.requestAnimationFrame(processAngles);
}

function initPR() {
  /*for(let i=0; i<document.getElementsByTagName('code').length; i++) {
    //console.log(i);
    document.getElementsByTagName('code')[i].className+=' prettyprint';
  }*/
  $('code,pre').toggleClass('prettyprint');
  
  $('code,pre').addClass('prettyprint');
}
