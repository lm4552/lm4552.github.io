
window.onload = init;
window.onhashchange = set_active_nav;

function init(){
    replace_html_objects_with_its_contents();
    set_active_nav();
    document.querySelector('#bottomNav h3:first-child').onclick = function(){ change_bottomNav(true);};
    document.querySelector('#bottomNav h3:last-child').onclick = function(){ change_bottomNav(false);};
}


function init_image_zoom(){

    document.getElementById('imageZoom').onclick = function(){
        document.getElementById('imageZoom').style.display = 'none';
    }; 
    let img_elems = document.getElementsByClassName('content')[0].getElementsByTagName('img');
    for (let i = 0; i < img_elems.length; i++){
        img_elems[i].onclick = function(){ 
            if (window.location.hash =='#/pages/gallery/readme.html'){
                let html_str = img_elems[i].parentNode.parentNode.parentNode.parentNode.children[1].innerHTML
                html_str = html_str.substring(html_str.indexOf('<a href=')+9);
                html_str = html_str.substring(0,html_str.indexOf('>')-1);
                window.location.href = html_str;
            }else{
                document.getElementById('imageZoom').children[2].innerHTML = "";
                document.getElementById('imageZoom').style.display = 'block';
                let img = document.createElement('img');
                img.src = img_elems[i].src;
                document.getElementById('imageZoom').children[2].appendChild(img); 
            }
        };
    }
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

    if(! window.location.hash)
        window.location.href = document.getElementById('defaultNav').href;

    
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

    let img_sel = document.querySelector('.content>div:target');
    if (img_sel != null){
        let imgs = img_sel.getElementsByTagName('img');
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
    init_image_zoom();
}
