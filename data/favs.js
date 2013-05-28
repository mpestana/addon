self.port.on("disp", function(links) {
    var first_div = document.createElement("div");
    first_div.setAttribute("id", "first_div");
    first_div.className = "first_div";
	var list = document.createElement("ul");

    first_div.innerHTML = "<h3><b>List of Favourite Websites:<br /> <br /></h3>";
    for (var url in links){
        var item = "<li><a href='"+url+"'>"+links[url][0].title+"</a> saved by "; 
        for (var save in links[url]){
            item += " "+links[url][save].userid+",";
        }
        list.innerHTML += item.replace(/,+$/, "</li>"); 
    }
    document.body.appendChild(first_div);
    document.body.appendChild(list);
});
