
window.onload = init;
window.onhashchange = function(){
    window.scrollTo(0,0);
    set_active_nav();
};

function init(){
    replace_html_objects_with_its_contents();
    set_active_nav();
    document.querySelector('#bottomNav h3:first-child').onclick = function(){ change_bottomNav(true);};
    document.querySelector('#bottomNav h3:last-child').onclick = function(){ change_bottomNav(false);};
}

function init_left_sidebar(){
    if (document.getElementById('leftSidebar').firstChild.innerHTML == ""){
        // left sidebar -> gallery
        document.getElementById('leftSidebar').firstChild.innerHTML = "<h3><a href=\"#/pages/gallery/readme.html\">Gallery</a></h3>";

        let img_sel = document.querySelectorAll('.content > div')
        for(let i = 0; i< img_sel.length;i++){
            if (img_sel[i].id == '/pages/gallery/readme.html')
                img_sel =  img_sel[i];
        }

        if (img_sel != null){
            let imgs = img_sel.getElementsByTagName('img');
            if (imgs != null)
                for(let i = 0; i< imgs.length;i++){
                    if (imgs[i].src.split('.').pop() != 'svg'){
                        let img = imgs[i].cloneNode(true);
                        img.onclick = function(){
                            window.location.href = '#/pages/gallery/readme.html';
                            }
                        document.getElementById('leftSidebar').firstChild.appendChild(img);
                        if (i > 3)
                            break;
                    }
                }
        }
    }
}

function init_right_sidebar(){
    if (document.getElementById('rightSidebar').firstChild.innerHTML == ""){
        // right sidebar -> updates
        document.getElementById('rightSidebar').firstChild.innerHTML = "<h3><a href=\"#/pages/updates/readme.html\">Updates</a></h3>";

        let ent_sel = document.querySelectorAll('.content > div')
        for(let i = 0; i< ent_sel.length;i++){
            if (ent_sel[i].id == '/pages/updates/readme.html')
                ent_sel =  ent_sel[i];
        }

        if (ent_sel != null){
            let ents = ent_sel.children;
            let i = 0;
            let cur_ent = ents[0];
            while (cur_ent.nextSibling.tagName != 'HR')
                cur_ent = cur_ent.nextSibling;
            while (i < 4){
                let elem = cur_ent.cloneNode(true);
                elem.onclick = function(){
                    window.location.href = '#/pages/updates/readme.html';
                    }
                if (cur_ent.tagName == 'HR')
                    i = i+1;
                else
                    document.getElementById('rightSidebar').firstChild.appendChild(elem);
                cur_ent = cur_ent.nextSibling;
            }
        }
    }
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
            if (contents[i].id == '/pages/updates/readme.html')
                init_right_sidebar();
            if (contents[i].id == '/pages/gallery/readme.html')
                init_left_sidebar();
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
