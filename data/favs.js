self.port.on("disp", function(links) {
	var first_div = document.createElement("div");
	first_div.setAttribute("id", "first_div");
	first_div.className = "first_div";
	var list = document.createElement("ul");
	
<<<<<<< HEAD
<<<<<<< HEAD
	first_div.innerHTML = "<h3><b>List of Favourite Websites:<br /> <br /></h3>";
=======
	first_div.innerHTML = "<h3><b>List of Favourite Websites:</b><br /> <br /></h3>";
>>>>>>> cde18a174e393f26ac368d772e4c4267626e42b8
=======
	first_div.innerHTML = "<h3><b>List of Favourite Websites:</b><br /> <br /></h3>";
>>>>>>> cde18a174e393f26ac368d772e4c4267626e42b8
	
	for (var url in links){
		
		var item = "<a href='"+url+"'>"+links[url][0].title+"</a> saved by ";

		for (var save in links[url]){
			item += " "+links[url][save].userid+",";
		}
		item = item.replace(/,+$/, " "); 
<<<<<<< HEAD
<<<<<<< HEAD

		var itemList = document.createElement('li');
		itemList.innerHTML = item;
		list.appendChild(itemList);
=======
=======
>>>>>>> cde18a174e393f26ac368d772e4c4267626e42b8
		
		var itemList = document.createElement('li');
		var listText = document.createElement('p');
		listText.innerHTML = item;
		itemList.appendChild(listText);

		//Delete button
		var delBtn = document.createElement('button');
		delBtn.type = "button";
		delBtn.name = "del";
		delBtn.value = "del";
		delBtn.onclick = function() {
			console.log("Deletar");
		}
		var delText=document.createTextNode("Delete");
		delBtn.appendChild(delText);
		itemList.appendChild(delBtn);		
<<<<<<< HEAD
>>>>>>> cde18a174e393f26ac368d772e4c4267626e42b8
=======
>>>>>>> cde18a174e393f26ac368d772e4c4267626e42b8

		//Like button
		var Like = document.createElement('input');
		Like.type = "image";
		Like.name = "like";
		Like.src = "up.png";
		Like.value = "like";
		Like.onclick = function() {
			//action
<<<<<<< HEAD
<<<<<<< HEAD
			//console.log("Gostou");
=======
			console.log("Gostou");
>>>>>>> cde18a174e393f26ac368d772e4c4267626e42b8
=======
			console.log("Gostou");
>>>>>>> cde18a174e393f26ac368d772e4c4267626e42b8
		};
		var likeText =document.createTextNode("Like");
		Like.appendChild(likeText);

		//Number of likes
		var likes = "<p>" + "10" + "</p>";

		//Dislike button
		var disLike = document.createElement('input');
		disLike.type = "image";
		disLike.name = "dislike";
		disLike.value = "dislike";
		disLike.src = "down.png";
		disLike.onclick = function() {
			//action
			console.log("desgostou");
		};
		var disLikeText =document.createTextNode("Dislike");
		disLike.appendChild(disLikeText); 
		
		//Number of dislikes
		var disLikes = "<p>" + "15" + "</p>";

		var likeBtnTd = document.createElement('td');
		likeBtnTd.appendChild(Like);
		var likeNumberTd = document.createElement('td');
		likeNumberTd.innerHTML = likes;
		var disLikeBtnTd = document.createElement('td');
		disLikeBtnTd.appendChild(disLike);
		var disLikeNumberTd = document.createElement('td');
		disLikeNumberTd.innerHTML = disLikes;
		var likeDislikeTr = document.createElement('tr');
		
		likeDislikeTr.appendChild(likeBtnTd);
		likeDislikeTr.appendChild(likeNumberTd);
		likeDislikeTr.appendChild(disLikeBtnTd);
		likeDislikeTr.appendChild(disLikeNumberTd);
		
		var likeDislikeTable = document.createElement('table');
		likeDislikeTable.appendChild(likeDislikeTr);

<<<<<<< HEAD
<<<<<<< HEAD
		list.appendChild(likeDislikeTable);
=======
		itemList.appendChild(likeDislikeTable);
		list.appendChild(itemList);
>>>>>>> cde18a174e393f26ac368d772e4c4267626e42b8
=======
		itemList.appendChild(likeDislikeTable);
		list.appendChild(itemList);
>>>>>>> cde18a174e393f26ac368d772e4c4267626e42b8
	}
	document.body.appendChild(first_div);
	document.body.appendChild(list);
});
