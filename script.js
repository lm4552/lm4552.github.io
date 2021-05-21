
window.onload = init;
window.onhashchange = set_active_nav;

function init(){
    replace_html_objects_with_its_contents();
    set_active_nav();
    document.querySelector('#bottomNav h3:first-child').onclick = function(){ change_bottomNav(true);};
    document.querySelector('#bottomNav h3:last-child').onclick = function(){ change_bottomNav(false);};
}



function change_bottomNav(prev){

    let entrys = document.getElementsByTagName('nav')[0].querySelectorAll('.entry a');
    let i = 0;

    for(i = 0; i< entrys.length; i++){
        if('#'+entrys[i].href.split('#').slice(-1) == window.location.hash)
            break;
    }

    if(prev == true)
        i = i-1 >= 0 ? i-1 : i-1 + entrys.length;
    else
        i = i+1 < entrys.length ? i+1 : i+1 - entrys.length;

    window.location.hash = '#'+entrys[i].href.split('#').slice(-1);
    find_and_set_background();
}

function set_active_nav(){
    window.scrollTo(0, 0);
    
    if (window.location.hash){
        
        let dropdowns = document.getElementsByTagName('nav')[0].querySelectorAll('.entry.dropdown');
        for(let i = 0; i< dropdowns.length; i++)
            dropdowns[i].className = 'entry dropdown';

        let entrys = document.getElementsByTagName('nav')[0].querySelectorAll('.entry a');
        for(let i = 0; i< entrys.length; i++){
            if('#'+entrys[i].href.split('#').slice(-1) == window.location.hash){
                entrys[i].className = 'active';
                if (entrys[i].parentNode.className.includes('dropdown')){
                    entrys[i].parentNode.className += ' active'
                }
            }else{
                entrys[i].className = '';
            }
        }
    }else{
        document.getElementById('defaultNav').className = 'active';
    }
    find_and_set_background();
}

function replace_html_objects_with_its_contents(){

    let contents = document.getElementsByClassName('insertHtml');
    for(let i = 0; i< contents.length; i++){

        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status == 200) 
                contents[i].innerHTML = xhr.response.replaceAll('src=\"./', 'src=\".'+contents[i].id.split('/').slice(0,-1).join('/')+'/' );
            else
                console.error('Error!');
            find_and_set_background();
        }
        xhr.open("GET", contents[i].id);
        xhr.send();
    }
}

function find_and_set_background(){

    
    let div_img = document.getElementById('bg_img');
    div_img.innerHTML = '';

    for(let j = 0; j <= 7; j++){
        let triangle = document.createElement('div');
        triangle.id = 'triangle'+j;
        div_img.appendChild(triangle);
    }

    let imgs = document.querySelector('.content>div:target').getElementsByTagName('img');
    let i;
    if (imgs != null)
        for(i = 0; i< imgs.length;i++){
            if (imgs[i].src.split('.').pop() != 'svg'){
                div_img.appendChild(imgs[i].cloneNode(true));
                div_img.firstChild.removeAttribute('width');
                break;
            }
        }
}
