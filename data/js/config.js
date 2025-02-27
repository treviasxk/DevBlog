/*
    Software Developed by Trevias Xk
    Social Networks:     treviasxk
    Github:              https://github.com/treviasxk
*/

// Settings
var Title = "DevBlog";
var TotalPostsLoadInScroll = 20;    // Number of posts to load when scrolling
var MaxCharacteresPosts = 500;      // Maximum number of characters to display in the post list

// Menu
// Add the name of the html file you want as the page, and the title you want it to have. html pages are loaded from /data/pages/
// example "home": "Home" -> /data/pages/home.html
var Pages = {
    "home": "Home",
    "blog": "Blog",
    "donate": "Donate",
    "contact": "Contact",
    "about": "About",
};

// Social Networks
// Available: github, x, linkedin, facebook, instagram
var SocialNetworks = {
    //example: "github": "https://github.com/treviasxk",
    "github": "",
    "x": "",
    "linkedin": "",
    "instagram": "",
}

// Webhook
var DiscordWebHook = "";

// Supabase
var SupabaseUrl = "";
var SupabaseKey = "";