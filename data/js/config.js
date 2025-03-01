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
// example "donate": "Donate" -> /data/pages/donate.html
var Pages = {
    "home": "Home", // Dont remove this element, this is default path /
    "donate": "Donate",
    "contact": "Contact",
    "about": "About",
};

// Social Networks
// Available: Github, X, Linkedin, Instagram, YouTube, Discord, Facebook, Twitch
var SocialNetworks = {
    //example: "github": "https://github.com/treviasxk",
    "Github": "",
    "X": "",
    "Linkedin": "",
    "YouTube": "",
}

// Webhook
var DiscordWebHook = "";

// Supabase
var SupabaseUrl = "";
var SupabaseKey = "";