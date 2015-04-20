//document.body.innerHTML = "<h1>Page matches ruleset</h1>";

var query = $("#search_form_input").val();

function urlBuilder(query, bang){
    return "https://duckduckgo.com/?q=" + bang + "%20" + query;
}

function linkBuilder(query, bang){
    var url = urlBuilder(query, bang);
    return "<button class='button bang-btn' href='" + url + "'>" + bang + "</button>";
}

$("#links").prepend(linkBuilder(query, "!yt"));
$("#links").prepend(linkBuilder(query, "!g"));


