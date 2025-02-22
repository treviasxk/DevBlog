/*
    Software Developed by Trevias Xk
    Social Networks:     treviasxk
    Github:              https://github.com/treviasxk
*/


// Rederict to /
const params = window.location.search;
const path = window.location.pathname;
const urlParams = new URLSearchParams(window.location.search);
let searchParams = new URLSearchParams(urlParams);

if(path == "/index.html")
    window.location.href= "/" + params;


var Loading = true;
var supabase = null;
var toastTimer = null;
var supabaseUser = null;
var Authenticated = null;
var pageIndex = 0;
var firstRunning = true;
ChangeTitle(title);

window.addEventListener("load", function() {
    CheckSession();
    AppMain();
}, false); 

window.addEventListener("scroll", () => {
    LoadPostsBlog();
});

async function CheckSession() {
    const { data: { session }, } = await supabase.auth.getSession();
    Authenticated = session ? session.user.aud == "authenticated" : false;
}

function ShowToast(text, color){
    clearInterval(toastTimer);
    if(Alert){
        Alert.style.visibility = "visible";
        Alert.innerText = text;
        Alert.style.opacity = "1";
        if(color)
            Alert.style.backgroundColor = color;
        else
            Alert.style.backgroundColor = "#FF0000";
    }
    toastTimer = setInterval(function (){
        Alert.style.opacity = "0";
        Alert.style.visibility = "hidden";
        clearInterval(toastTimer);
    }, 5000);
}

async function AppMain(){
    var z, i, content, page;
    z = document.getElementsByTagName("div");
    for(i = 0; i < z.length; i++){
        content = z[i];
        page = content.getAttribute("w3-include-html");

        if(searchParams.get("post") && searchParams.get("post") != 0)
            if(page == "data/layout/appbar.html")
                page = "data/layout/appbar_backpage.html";

        if(searchParams.get("page") && page == "data/pages/home.html"){
            if(searchParams.get("page") == "blog")
                await LoadBlog(searchParams.get("page"), content)
            else
                await LoadPage(searchParams.get("page"), content);
        }else
        if(searchParams.get("post") && page == "data/pages/home.html"){
            await LoadPost(searchParams.get("post"), content);
        }else{
            if(page){
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function(){
                    if(this.readyState == 4) {
                        var elmnt = content.parentNode;
                        if(this.status == 200){
                            content.innerHTML = this.responseText;
                            if(page == "data/pages/home.html"){
                                SelectMenuItem("home");
                                ChangeTitle("Home");
                            }
                        }
                        if(this.status == 404) {LoadPage("404", content);}
                        for(const child of content.childNodes)
                            elmnt.appendChild(child.cloneNode(true));
                        content.remove();
                        AppMain();
                    }
                }
                xhttp.open("GET", page, true);
                xhttp.send();
                return;
            }
        }
    }
    LoadSwipe();

    if(Authenticated){
        var SignIn = document.getElementById("SignIn");
        if(SignIn){
            if(searchParams.get("post") && searchParams.get("post") == 0){
                SignIn.setAttribute("id","NoButton");
            }else{
                SignIn.setAttribute("onclick","window.location.href='?post=0';");
                SignIn.setAttribute("id","Edit");
            }
        }
    }
}



function LoadSwipe() {
    CloseScreenLoading();
    var content = document.getElementById('Content');
    if(!document.body.contains(document.getElementById('BackPage'))){
        swipedetect(content, (swipedir) => {
            if (swipedir =='right')
                OpenNavigation(true);
        });
        var navigate = document.getElementById('Navigate')
        swipedetect(navigate, (swipedir) => {
            if (swipedir =='left')
                OpenNavigation(false);
        });
    }else{
        swipedetect(content, (swipedir) => {
            if(swipedir =='right')
                BackPage();
        });
    }
};

// Back Page
function BackPage(){
    document.getElementById("Content").classList.add("SlideRight");
    setTimeout(function() {
        window.history.back();
    }, 200);
}

// Close or open Menu Navigation
function OpenNavigation(Open){
    if(Open == false){
        Navigate.style.left = "0px";
        Content.style.top = "50px";
        Content.style.minHeight = "calc(100% - 50px)";
        Content.style.opacity = null;
        document.getElementById("AppBar").style.marginTop = "0px";

    }else{
        Navigate.style.left = "-100%";
        Content.style.top = "0px";
        Content.style.minHeight = "100%";
        Content.style.opacity = "0.2";
        if(!Loading)
        document.getElementById("AppBar").style.marginTop = "-50px";
    }
    
    if(Navigate.style.left == "0px"){
        Navigate.style.left = "-100%";
        if(Loading == false){
            document.body.style.overflowY = "visible";
        }
    }else{
        Navigate.style.left = "0px";
        document.body.style.overflowY = "hidden";
    }
}

// Close screen loading.
function CloseScreenLoading(){
    Loading = false;
    document.body.style.overflowY = "visible";
    ScreenLoading.style.display = "none";
}

// Function to detect action swipe
function swipedetect(el, callback){
    var touchsurface = el,
    swipedir,
    startX,
    startY,
    distX,
    distY,
    threshold = 100,
    restraint = 100,
    allowedTime = 200,
    elapsedTime,
    startTime,
    handleswipe = callback
    touchsurface.addEventListener('touchstart', (e) => {
        var touchobj = e.changedTouches[0]
        swipedir = 'none'
        dist = 0
        startX = touchobj.pageX
        startY = touchobj.pageY
        startTime = new Date().getTime()
    }, false)

    touchsurface.addEventListener('touchend', (e) => {
    var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX
        distY = touchobj.pageY - startY
        elapsedTime = new Date().getTime() - startTime
        if (elapsedTime <= allowedTime){
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
                swipedir = (distX < 0)? 'left' : 'right'
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){
                swipedir = (distY < 0)? 'up' : 'down'
            }
        }
        handleswipe(swipedir)
    }, false)
}

//Show and hide AppBar
var prevScrollpos = window.pageYOffset;
window.onscroll = () => {
    if(Loading == false){
        var currentScrollPos = window.pageYOffset;
        if(prevScrollpos >= currentScrollPos || prevScrollpos == 0){
            document.getElementById("AppBar").style.marginTop = "0px";
        }else{
            document.getElementById("AppBar").style.marginTop = "-50px";
        }
        prevScrollpos = currentScrollPos;
    }
    else{
        document.getElementById("AppBar").style.marginTop = "0";
    }
}

// Change title from page and appbar
function ChangeTitle(newtitle, header){
    newtitle = newtitle[0].toUpperCase() + newtitle.slice(1);
    var elment = document.getElementById("Title");
    if(header)
        elment.innerText = header;
    else
        if(elment)
            elment.innerText = newtitle;
    if(newtitle != title)
        newtitle += " - " + title;
    document.title = newtitle;
}

async function LoadBlog(id, content){
    content.removeAttribute("w3-include-html");
    await LoadPage(id, content, LoadPostsBlog);
}

async function LoadPost(id, content){
    content.removeAttribute("w3-include-html");
    const { data, error } = await supabase
    .from('blog')
    .select()
    .eq('id', id);

    var afterContent = ()=>{
        if(Authenticated)
            document.getElementById("SelectMode").style.display = "flex";
        if(id == 0){
            Editor.style.display = "block";
            Preview.style.display = "none";
            editorbtn.style.background = "var(--ShadowColor)";
            previewbtn.style.background = "var(--PanelBackground)";
        }else{
            ChangeTitle(data[0].title, "Post");
            document.getElementsByClassName("title").item(0).innerHTML = (data[0].pin ? '<div id="Pin"></div>' : "") + data[0].title;
            document.getElementsByClassName("title").item(0).innerHTML += CreateTag(data[0].tags); 
            document.getElementsByClassName("content").item(0).innerHTML = EmbedContent(data[0].content);
            document.getElementsByClassName("CardDateTime").item(0).innerText = new Date(data[0].date);
            if(Authenticated){
                const title = document.getElementById('titlepost');
                const textArea = document.getElementById('editor');
                const pin = document.getElementById('pinpost');
                const tags = document.getElementById('tagspost');
                pin.checked = data[0].pin;
                textArea.innerHTML = data[0].content;
                title.value = data[0].title;
                tags.value = data[0].tags;
            }

        }

        if(Authenticated){
            const quill = new Quill("#editor", {
                theme: "snow",
            });
        }
    }
    

    if(data){
        await LoadLayout("post", content, afterContent);
        document.getElementById("Content").classList.add("SlideLeft");
    }else{
        if(id == 0 && Authenticated){
            await LoadLayout("post", content, afterContent);
        }else
            await LoadPage("404", content);
    }
}


function SelectMenuItem(page){
    var navigate = document.querySelectorAll('.MenuItem');
    for(const child of navigate)
      if(child.getAttribute("href") == "?page=" + page || child.getAttribute("href") == "/" && page == "home")
        child.setAttribute("class", "MenuItemSeleteced");
}

async function LoadPage(page, content, action = null){
    var file = "data/pages/" + page + ".html";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = async function(){
      if(this.readyState == 4) {
        var elmnt = content.parentNode;
        if(this.status == 200) {
          content.innerHTML = this.responseText;
          SelectMenuItem(page);
          ChangeTitle(page);

          if(searchParams.get("post")){
            if(elmnt)
              elmnt.setAttribute("class", "SlideLeft");
          }
          action?.apply();
          CloseScreenLoading();
        }

        // Talvez remova
        if(this.status == 404){
            await LoadPage("404", content);
        }
      }
    }

    xhttp.open("GET", file, true);
    xhttp.send();
}

async function LoadLayout(page, content, action = null){
    var file = "data/layout/" + page + ".html";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
      if(this.readyState == 4) {
        var elmnt = content.parentNode;
        if(this.status == 200) {
          content.innerHTML += this.responseText;
          SelectMenuItem(page);
          ChangeTitle(page);
          action?.apply();
        }
      }
    }

    xhttp.open("GET", file, true);
    xhttp.send();
}



function OpenEditor(open){
    if(open){
        Editor.style.display = "block";
        Preview.style.display = "none";
        editorbtn.style.background = "var(--ShadowColor)";
        previewbtn.style.background = "var(--PanelBackground)";
    }else{
        Editor.style.display = "none";
        Preview.style.display = "block";
        editorbtn.style.background = "var(--PanelBackground)";
        previewbtn.style.background = "var(--ShadowColor)";
    }
}

async function LoadPostsBlog(){
    const page = searchParams.get("page");
    if(firstRunning && page == "blog"){
        var scrollValue = this.scrollY + document.documentElement.clientHeight;
        var scrollMaximum = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
        var apiBuffering = (scrollMaximum / 100) * totalPosts;
        var query = searchParams.get("q");
        var tag = searchParams.get("tag");
        var Card = document.getElementById("Posts");
        search.value = query;
        query = query == null ? "" : query;
        tag = tag == null ? "" : tag;
        if(tag != "")
            FilterBackground.style.background = 'var(--PrimaryColor)';

        if(scrollMaximum <= scrollValue + apiBuffering){
            firstRunning = false;
            // Get posts not pinned

            var { data } = await supabase.rpc('getblogcontent', {
                query: `%${query}%`,
                tag: `%${tag}%`,
                max: maxCharPosts,
                range: totalPosts,
                next: pageIndex * totalPosts,
            });

            if(data && data[0]){
                for(i = 0; i < data.length; i++)
                    Card.innerHTML += `<div class="Card"><a style='width:calc(100% - 40px)' ` + (data[i].pin ? 'class="Pin"' : '') +' href="?post=' +data[i].id +'">' +  (data[i].pin ? '<div id="Pin"></div>' : '') + data[i].title + `</a><div class="dropdown">
  <div id="Options"></div>
  <div class="dropdown-content">
    <a href="#" onclick="navigator.clipboard.writeText('${window.location.hostname}/?post=${data[i].id}');ShowToast('URL Copied!', 'var(--PrimaryColor)');">Copy URL</a>
  </div>
</div>` + '<br/>' + await CreateTag(data[i].tags) + EmbedContent(data[i].content, true)+'<hr/><div class="CardDateTime">' + new Date(data[i].date) + '</div></div></div>';
                ++pageIndex;
                firstRunning = true;
                LoadPostsBlog();
            }else{
                if(pageIndex == 0)
                    Card.innerHTML += "<h2>Not found post</h2>";
                LoadingContent.style.display = "none";
                firstRunning = false;
            }
        }
    }
}

function CreateTag(tags){
    var tag = tags.split(", ");
    var result = "<br/>";
    tag.forEach(element => {
        result += `<div id="Tag" onclick="window.location.href='/?page=blog&tag=${element}'">${element}</div>`;
    });
    return result;
}