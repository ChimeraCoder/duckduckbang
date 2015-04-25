'use strict';

const searchElement = document.getElementById('search_form_input')
const linksElement = document.getElementById('links');

const urlBuilder = (query, bang) => {
    return "https://duckduckgo.com/?q=" + bang + "%20" + query;
}

const linkBuilder = (query, bang) => {
    const url = urlBuilder(query, bang);
    const a = document.createElement('a');
    a.className = 'button bang-btn';
    a.href = url;
    a.textContent = bang;

    return a;
}



const inject = (query) => {
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".bang-btn { margin: 20px; }";
    document.body.appendChild(css);



    const containerElement = linksElement.parentElement;
    containerElement.insertBefore(linkBuilder(query, '!g'), linksElement);
    containerElement.insertBefore(linkBuilder(query, '!w'), linksElement);
    containerElement.insertBefore(linkBuilder(query, '!yt'), linksElement);
}

if(searchElement !== null && linksElement !== null) {
    inject(searchElement.value);
}
