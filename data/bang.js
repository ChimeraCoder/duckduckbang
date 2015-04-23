//document.body.innerHTML = "<h1>Page matches ruleset</h1>";

console.log("loaded bang.js");
var query = $("#search_form_input").val();

function urlBuilder(query, bang){
    return "https://duckduckgo.com/?q=" + bang + "%20" + query;
}

function linkBuilder(query, bang){
    var url = urlBuilder(query, bang);
    var val = "<a class='button bang-btn' href='" + url + "'>" + bang + "</a>";
    console.log(val)
    return val
}

$("#links").prepend(linkBuilder(query, "!yt"));
$("#links").prepend(linkBuilder(query, "!g"));


