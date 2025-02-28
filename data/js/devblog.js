/*
    Software Developed by Trevias Xk
    Social Networks:     treviasxk
    Github:              https://github.com/treviasxk
*/


// Rederict to /
const params = window.location.search;
const path = window.location.pathname;
const urlParams = new URLSearchParams(window.location.search);
const hostname = window.location.origin + window.location.pathname;
let searchParams = new URLSearchParams(urlParams);

if(path == "/index.html")
    window.location.href=hostname + (params ? params : "");

var Loading = true;
var supabase = null;
var toastTimer = null;
var supabaseUser = null;
var Authenticated = null;
var pageIndex = 0;
var firstRunning = true;
var ImageContent = null;

window.addEventListener("load", async function(){
    await CheckSession();
    await LoadMenuPages();
    await LoadSocialNetworks();
    await AppMain();
    CloseScreenLoading();
}, false);

function LoadMenuPages(){
    var pages = document.getElementsByClassName("VerticalMenu").item(0);
    var valores = Object.entries(Pages);
    for(const page of valores){
        var url = hostname + (page[0] == "home" ? "" : "?page=" + page[0]);
        pages.innerHTML += `<a href="${url}" class="MenuItem">${page[1]}</a>`;
    }
}

function LoadSocialNetworks(){
    var socials = document.getElementsByClassName("Footer").item(0);
    var valores = Object.entries(SocialNetworks);
    for(const social of valores){
        socials.innerHTML += `<a href="${social[1]}"><img src="../../data/img/socials/${social[0]}.png" title="${social[0]}" draggable="false"></a>`;
    }
    socials.innerHTML += `<p>Made with <a href="https://github.com/treviasxk/DevBlog">DevBlog</a></p>`;
}

window.addEventListener("scroll", ()=> {
    LoadPostsBlog();
});

async function CheckSession() {
    try{
        const { data: { session }, } = await supabase.auth.getSession();
        Authenticated = session ? session.user.aud == "authenticated" : false;
    }catch(e){
        Authenticated = false;
    }
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
    var includes, i, content, page;

    includes = Array.from(document.getElementsByTagName("div")).filter(item => item.getAttribute("w3-include-html"));
    for(i = 0; i < includes.length; i++) {
        content = includes[i].parentElement;
        page = includes[i].getAttribute("w3-include-html");
        includes[i].remove();

        var AU = ()=>{
            ChangeTitle(Title);
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

        if(searchParams.get("post") && searchParams.get("post") != 0)
            if(page == "data/layout/appbar.html")
                page = "data/layout/appbar_backpage.html";

        if(page == "data/layout/appbar.html" || page == "data/layout/appbar_backpage.html")
            await LoadLayout(page, content, AU);

        if(page == "data/layout/content.html")
            if(searchParams.get("page")){
                await LoadPage(searchParams.get("page"), content);
            }else{
                if(!SupabaseKey && !SupabaseUrl)
                    await LoadLayout("data/layout/setup.html", content);
                else
                if(searchParams.get("post"))
                    await LoadPost(searchParams.get("post"), content);
                else
                    await LoadLayout(page, content, LoadPostsBlog);
            }
    }

    LoadSwipe();
}


function LoadSwipe() {
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
    newtitle ??= Title;
    newtitle = newtitle[0].toUpperCase() + newtitle.slice(1);
    var elment = document.getElementById("Title");
    if(header)
        elment.innerText = header;
    else
        if(elment)
            elment.innerText = newtitle;
    if(newtitle != Title)
        newtitle += " - " + Title;
    document.title = newtitle;
}


async function LoadPost(id, content){
    const { data } = supabase ? await supabase
    .from('blog')
    .select()
    .eq('id', id) : { data: null };

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
            var content = EmbedContent(data[0].content);
            document.getElementsByClassName("title").item(0).innerHTML = (data[0].pin ? '<div id="Pin"></div>' : "") + data[0].title;
            document.getElementsByClassName("title").item(0).innerHTML += CreateTag(data[0].tags); 
            document.getElementsByClassName("content").item(0).innerHTML = content;
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
        await LoadLayout("data/layout/post.html", content, afterContent);
        document.getElementById("Content").classList.add("SlideLeft");
    }else{
        if(id == 0 && Authenticated){
            await LoadLayout("data/layout/post.html", content, afterContent);
        }else
            await LoadLayout("data/layout/nocontent.html", content);
    }
}


function SelectMenuItem(){
    var navigate = document.querySelectorAll('.MenuItem');
    for(const child of navigate)
      if(child.getAttribute("href") == window.location.href)
        child.setAttribute("class", "MenuItemSeleteced");
}

async function LoadPage(page, content, action = null){
    var file = "data/pages/" + page + ".html";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = async function(){
      if(this.readyState == 4) {

        if(this.status == 200) {
          content.innerHTML = this.responseText;
          action?.apply();
          ChangeTitle(page);
        }

        // Talvez remova
        if(this.status == 404){
            await LoadLayout("data/layout/404.html", content);
        }
      }
    }

    xhttp.open("GET", file, true);
    xhttp.send();
}

async function LoadLayout(page, content, action = null){
    var file = page;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4) {
            if(this.status == 200) {
                content.innerHTML += this.responseText;
                SelectMenuItem();
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
    if(firstRunning && !searchParams.get("page")){
        var scrollValue = this.scrollY + document.documentElement.clientHeight;
        var scrollMaximum = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
        var apiBuffering = (scrollMaximum / 100) * TotalPostsLoadInScroll;
        var query = searchParams.get("q");
        var tag = searchParams.get("tag");
        var Card = document.getElementById("Posts");
        const search = document.getElementById("search");
        search.value = query;
        query = query == null ? "" : query;
        tag = tag == null ? "" : tag;
        if(tag != "")
            FilterBackground.style.background = 'var(--PrimaryColor)';

        if(scrollMaximum <= scrollValue + apiBuffering){
            firstRunning = false;
            // Get posts not pinned

            var { data } = supabase ? await supabase.rpc('getblogcontent', {
                query: `%${query}%`,
                tag: `%${tag}%`,
                max: MaxCharacteresPosts,
                range: TotalPostsLoadInScroll,
                next: pageIndex * TotalPostsLoadInScroll,
            }) : { data: null };

            if(data && data[0]){
                for(i = 0; i < data.length; i++){
                    Card.innerHTML += `<div class="Card"><a style='width:calc(100% - 40px)' ` + (data[i].pin ? 'class="Pin"' : '') +' href="?post=' +data[i].id +'">' +  (data[i].pin ? '<div id="Pin"></div>' : '') + data[i].title + `</a><div class="dropdown">
  <div id="Options"></div>
  <div class="dropdown-content">
    <a href="#" onclick="navigator.clipboard.writeText('${window.location.hostname}/?post=${data[i].id}');ShowToast('URL Copied!', 'var(--PrimaryColor)');">Copy URL</a>
  </div>
</div>` + '<br/>' + await CreateTag(data[i].tags) + EmbedContent(data[i].content, true) + '<hr/><div class="CardDateTime">' + new Date(data[i].date) + '</div></div></div>';
                }
                ++pageIndex;
                firstRunning = true;
                LoadPostsBlog();
            }else{
                if(pageIndex == 0)
                    LoadLayout("data/layout/nopost.html", Card);
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


function EmbedContent(markdown, textOnly = false){
    let html = markdown;
    // Img
    var regex = /https?:\/\/[^\s"'<>]+?\.(jpe?g|png|gif)(\?[^"\s]*)?/g;
    var match = markdown.match(regex);

    if(match)
    for(const item in match){
        ImageContent = match[0];

        if(textOnly)
            html = html.replaceAll("<p>" + match[item] + "</p>", "");
        else
            html = html.replaceAll("<p>" + match[item] + "</p>", `<img src="${match[item]}"></img>`)
    }

    // video
    var regex = /https?:\/\/[^\s]+\.(mkv|mp4|webm)(\?[^\s<>]*)?/g;
    var match = markdown.match(regex);
    
    if(match)
    for(const item in match)
        if(textOnly){
            // Remove video link from text
            html = html.replaceAll("<p>" + match[item] + "</p>", "");
        }else
        html = html.replaceAll("<p>" + match[item] + "</p>", `<video autoplay="" muted="" loop="" disablepictureinpicture="" width="100%" controls><source src="${match[item]}"></video>`)

    // Youtube
    regex = /(?:https?:\/\/)?(?:www\.)?youtu(be\.com\/watch\?v=|\.be\/)([a-zA-Z0-9_-]+)/g;
    match = markdown.match(regex);

    if(match)
    for(const item in match){
        if(textOnly){
            // Remove youtube link from text
            html = html.replaceAll("<p>" +match[item] + "</p>","");
        }else{
            var id = match[item].replace("youtu.be/","").replace("youtube.com/watch?v=","").replace("https://","").replace("www.","");
            html = html.replaceAll("<p>" +match[item] + "</p>", `<iframe width="100%" height="415" src="https://www.youtube.com/embed/${id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
        }
    }

    if(textOnly){
        html = RemoveHTMLTags(html);
        if(ImageContent)
            html = `<img style='height: 100px;width: auto; max-width: 300px;float: left;padding-right: 15px;' src="${ImageContent}"/>` + html;    
    }
    
    return '<p style="margin-top:10px;' + (ImageContent ? 'min-height: 100px;' : '') + '">' + html + '</p>'; // Return original string if no match is found
}

function RemoveHTMLTags(html){
    var wrapper= document.createElement('p');
    var result = html.replaceAll("<br>"," ").replaceAll("<br/>"," ").replaceAll("<br />"," ").replaceAll("<p>"," ").replaceAll("</p>"," ").replaceAll("<div>"," ").replaceAll("</div>"," ").replaceAll("<h1>"," ").replaceAll("</h1>"," ").replaceAll("<h2>"," ").replaceAll("</h2>"," ").replaceAll("<h3>"," ").replaceAll("</h3>"," ").replaceAll("<h4>"," ").replaceAll("</h4>"," ").replaceAll("<h5>"," ").replaceAll("</h5>"," ").replaceAll("<h6>"," ").replaceAll("</h6>"," ").replaceAll("<ul>"," ").replaceAll("</ul>"," ").replaceAll("<li>"," ").replaceAll("</li>"," ").replaceAll("<ol>"," ").replaceAll("</ol>"," ").replaceAll("<a>"," ").replaceAll("</a>"," ").replaceAll("<img>"," ").replaceAll("</img>"," ").replaceAll("<video>"," ").replaceAll("</video>"," ").replaceAll("<iframe>"," ").replaceAll("</iframe>"," ");

    wrapper.innerHTML = result;
    result = wrapper.innerText;

    return result;
}

async function Login(){
    if(Email && Password && Submit){
        if(Email.value == "" || Password.value == "")
            ShowToast("Please fill in all required fields");
        else{
            Email.disabled = true;
            Password.disabled = true;
            Submit.disabled = true;

            const { data, error } = await supabase.auth.signInWithPassword({
                email: Email.value,
                password: Password.value,
            })
            if(error == null){
                window.location.href='/';
            }else{
                Email.disabled = false;
                Password.disabled = false;
                Submit.disabled = false;
                Password.value = "";
                ShowToast("Username or password incorrect!");
            }
        }
    }
}

async function Publish(){
    const textArea = document.getElementsByClassName('ql-editor').item(0);
    const title = document.getElementById('titlepost');
    const pin = document.getElementById('pinpost');
    const tags = document.getElementById('tagspost');
    const urlParams = new URLSearchParams(window.location.search);
    let searchParams = new URLSearchParams(urlParams);
    document.getElementById("Process").style.display = "grid";
    if(title.value.length < 5)
        ShowToast("The title cannot be less than 5 characteres!")
    else
    if(title.value == "")
        ShowToast("The title cannot be empty!")
    else
    if(searchParams.get("post") && searchParams.get("post") != 0){
        // update
        const id = searchParams.get("post");
        const { error } = await supabase
        .from('blog')
        .update({ title: title.value, content: textArea.innerHTML, pin: pin.checked, tags: tags.value})
        .eq('id', id)

        window.location.href=`${hostname}?post=${id}`;
    }else{
        // insert
        const { data, error } = await supabase
        .from('blog')
        .insert([
          { title: title.value, content: textArea.innerHTML, pin: pin.checked, tags: tags.value},
        ])
        .select();

        await SendDiscordWebHook(title.value, textArea.innerHTML, `${hostname}?post=${data[0].id}`);
        window.location.href=`${hostname}?post=${data[0].id}`;
    }
    document.getElementById("Process").style.display = "none";
}

async function Delete(){
    const urlParams = new URLSearchParams(window.location.search);
    let searchParams = new URLSearchParams(urlParams);
    document.getElementById("Process").style.display = "grid";
    if(searchParams.get("post")){
        const response = await supabase
        .from('blog')
        .delete()
        .eq('id', searchParams.get("post"));
        window.location.href='?page=blog';
    }
    document.getElementById("Process").style.display = "none";
}

function SearchPost(event){
    if(event.key == "Enter")
        if(search.value != "")
            window.location.href = '/?q=' + search.value;
        else
            window.location.href = '/';
}


function RefreshContent(){
    var textArea;
    textArea = document.getElementsByClassName('ql-editor').item(0);
    if(!textArea)
        textArea = document.getElementById('editor');
    const title = document.getElementById('titlepost');
    const pin = document.getElementById("pinpost");
    const tags = document.getElementById('tagspost');
    const content = EmbedContent(textArea.innerHTML);

    document.getElementsByClassName("title").item(0).innerHTML = (pin.checked ? '<div id="Pin"></div>' : "") + (title.value != "" ? title.value : "Title");
    document.getElementsByClassName("title").item(0).innerHTML += CreateTag(tags.value); 

    document.getElementsByClassName("content").item(0).innerHTML = content;
    document.getElementsByClassName("CardDateTime").item(0).innerHTML = new Date();
}

async function SendDiscordWebHook(title, description, url) {
    if(title && description){
        description = RemoveHTMLTags(EmbedContent(description)).substring(0, MaxCharacteresPosts);
        description += description.length < MaxCharacteresPosts ? "" : "...";

        if(url)
            description += `\n\n[Visit WebSite](${url})`;

        const mensagem = {
            username: "DevBlog", // Nome do bot (opcional)
            avatar_url: 'https://treviasxk.github.io/DevBlog/data/img/logo.png', // URL do avatar (opcional)
            embeds: [{
                title: title,
                description: description,
                color: 5814783, // Cor em decimal (azul neste caso)
                image: {
                    url: ImageContent ? ImageContent : '' // URL da imagem
                },
                footer: {
                    text: Title,
                    icon_url: hostname + '/data/img/logo.png'
                },
                timestamp: new Date().toISOString()
            }]
        };
        
        try{
            await fetch(DiscordWebHook, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mensagem)
            });
        }catch (erro) {

        }
    }
}