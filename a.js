
let blue = "#69adce"
let green = "#6ebda4"
let pos = "beforeend";

let drag = false
let prevX = currX = 0

let LIST, index = 0;
let list;
let data = localStorage.getItem("list");


function loadData(list)
{
	if(data)
	{
		LIST = JSON.parse(data);
		index = LIST.length;

		LIST.forEach(function(ele) {
			if(ele.delete == 0)
				addData(ele, list);
		});
	}
	else
	{
		LIST = [];
		index = 0;
	}
}

function addData(ele, list)
{
	let html = createElement(ele);
	list.insertAdjacentHTML(pos, html);
}

function createElement(ele)
{
	let html = `<li id="${ele.id}" class="task-li ${(ele.state == 1)? 'complete' : ''}" draggable="true" ondragstart="dragStart(event)" ondrag="dragging(event)" ondragend="dragover(event)">
					${ele.text}
					<span id="del-li" onclick="remove(event)"><i class="fas fa-times"></i></span>
				</li>`

	return html;
}

function addToList(ele, list)
{
	addData(ele, list);
	LIST.push(ele);
	index += 1;
	toLocalStorage();
}

function toLocalStorage()
{
	localStorage.setItem("list", JSON.stringify(LIST));
}


window.onload = function() {

	const content = document.getElementsByClassName("content")[0];

	const input = content.querySelector("#inputBar");
	list = content.querySelector("#ul-list");
	const scrollList = list.parentNode;

	console.log(input);
	console.log(list);

	const check = content.querySelector("#check");
	const times = content.querySelector("#times");


	loadData(list);

	let options = {weekday:'long', month:'short', day:'numeric', year:'numeric'};
	let today = new Date();

	const date = document.getElementById("date");
	date.innerHTML = today.toLocaleDateString("en-us", options);


	input.addEventListener("keyup", function(event){
		if(event.key == "Enter" && input.value != "")
		{
			var text = input.value;
			console.log(text);
						
			var ele = {
				'id': index,
				'text': text,
				'state': 0,
				'delete': 0
			};

			addToList(ele, list);
			input.value = '';
			scrollToBottom(scrollList);

			

		}
	});

};


function clearList(event) {
	console.log(event);
	var ele = event.target.parentNode.nextElementSibling.children[0];
	ele.innerHTML = "";
	LIST = [];
	index = 0;
	toLocalStorage();
}

function remove(event){
	var ele = event.target;
	var li = ele.parentNode.parentNode;
	var ul = li.parentNode;
	ul.removeChild(li);
	// LIST.splice(ele.id,1);
	// index -= 1;
	LIST[li.id]["delete"] = 1;
	// ul.children[li.id].hidden = true;
	toLocalStorage();

}

function scrollToBottom(ele)
{
	ele.scrollTop = ele.scrollHeight - ele.clientHeight;
}


function allCompleted(event) 
{
	var li = list.children;
	for(var i=0; i<li.length; i++)
	{
		rightSwipe(li[i]);
	}
	
	toLocalStorage();
}

function allPending(event) 
{
	var li = list.children;
	for(var i=0; i<li.length; i++)
	{
		leftSwipe(li[i]);
	}
	
	toLocalStorage();
}



function rightSwipe(ele)
{
	ele.classList = "task-li complete";
	if(LIST[ele.id]["state"] == 0)
		LIST[ele.id]["state"] = 1;
}


function leftSwipe(ele)
{
	ele.classList = "task-li";
	if(LIST[ele.id]["state"] == 1)
		LIST[ele.id]["state"] = 0;
}












function dragStart(event){
	if(event.target.localName == "li")
	{
		console.log(event);
		drag = true;
		prevX = event.screenX;
		event.dataTransfer.setData("id", event.target.id);
	}

}

function dragging(event){
	var ele = event.target;
	if(ele.localName == "li" && drag)
	{
		console.log("dragging");
		currX = event.screenX;
		if(currX !=0 && (currX - prevX >= 100 || prevX - currX >= 100))
		{
			console.log(currX, prevX);
			console.log(event);
			drag = false;

			if(currX > prevX)
				rightSwipe(ele);
			else
				leftSwipe(ele);
	
			toLocalStorage();
		}
	}
}

function dragover(event) {
	event.preventDefault();
	console.log("dragover");
}

function drop(event){
	event.preventDefault();
	target = event.target;
	var id = event.dataTransfer.getData("id");
	// var ele = document.getElementById(id);
	var ele = list.querySelector("#id")
	if(ele)
	{
		if(target.classList.contains("task-li"))
		{
			console.log("task-li");
			var parent = target.parentNode;
 			parent.insertBefore(ele, target);
		}
		else if(target.className == "ul-list")
		{
			target.appendChild(ele);
			scrollToBottom(target.parentNode);
		}
		console.log("dropped");
	}
}