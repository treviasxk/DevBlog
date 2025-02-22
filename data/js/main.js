/*
    Software Developed by Trevias Xk
    Social Networks:     treviasxk
    Github:              https://github.com/treviasxk
    Paypal:              trevias@live.com
*/

function EmbedContent(markdown, textOnly = false){
    let html = markdown;
    // Img
    var regex = /https?:\/\/[^\s"'<>]+?\.(jpe?g|png|gif)(\?[^"\s]*)?/g;
    var match = markdown.match(regex);
    var image = null;

    if(match){
    for(const item in match)
        if(textOnly){
            image ??= `<img  style='height: 100px;width: auto; max-width: 300px;float: left;padding-right: 15px;' src="${match[item]}"/>`;
            html = html.replaceAll("<p>" + match[item] + "</p>", "");
            html = RemoveHTMLTags(html);
        }else
            html = html.replaceAll("<p>" + match[item] + "</p>", `<img src="${match[item]}"></img>`)
        if(image){
            html = image + html;
        }
    }

    // video
    var regex = /https?:\/\/[^\s]+\.(mkv|mp4|webm)(\?[^\s<>]*)?/g;
    var match = markdown.match(regex);
    
    if(match)
    for(const item in match)
        if(textOnly){
            // Remove video link from text
            html = html.replaceAll("<p>" + match[item] + "</p>", "");
            html = RemoveHTMLTags(html);
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
            html = RemoveHTMLTags(html);
        }else{
            var id = match[item].replace("youtu.be/","").replace("youtube.com/watch?v=","").replace("https://","").replace("www.","");
            html = html.replaceAll("<p>" +match[item] + "</p>", `<iframe width="100%" height="415" src="https://www.youtube.com/embed/${id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
        }
    }

    return '<p style="margin-top:10px;' + (image ? 'min-height: 100px;' : '') + '">' + html + '</p>'; // Return original string if no match is found
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
        window.location.href='?post=' + id;
    }else{
        // insert
        const { data, error } = await supabase
        .from('blog')
        .insert([
          { title: title.value, content: textArea.innerHTML, pin: pin.checked, tags: tags.value},
        ])
        .select();
        window.location.href='?post=' + data[0].id;
    }
}

async function Delete(){
    const urlParams = new URLSearchParams(window.location.search);
    let searchParams = new URLSearchParams(urlParams);

    if(searchParams.get("post")){
        const response = await supabase
        .from('blog')
        .delete()
        .eq('id', searchParams.get("post"));
        window.location.href='?page=blog';
    }
}

function SearchPost(event){
    if(event.key == "Enter" && searchParams.get("page") == "blog")
        if(search.value != "")
            window.location.href = '/?page=blog&q=' + search.value;
        else
        window.location.href = '/?page=blog';
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

    console.log(pin.checked);
    document.getElementsByClassName("title").item(0).innerHTML = (pin.checked ? '<div id="Pin"></div>' : "") + (title.value != "" ? title.value : "Title");
    document.getElementsByClassName("title").item(0).innerHTML += CreateTag(tags.value); 

    document.getElementsByClassName("content").item(0).innerHTML = content;
    document.getElementsByClassName("CardDateTime").item(0).innerHTML = new Date();
}
