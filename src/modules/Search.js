// import $ from "jquery";

class Search {
	// 1. describe and create/initiate our object
	constructor() {
		this.resultsDiv = document.querySelector("#search-overlay__results");
		// NB! there are two js-search-trigger buttons (one for mobile nav one for desktop nav)
		// so use querySelectorAll and some kind of loop to add the event listeners
		this.openButtons = document.querySelectorAll(".js-search-trigger");
		// this.openButton = $(".js-search-trigger");
		this.closeButton = document.querySelector(".search-overlay__close");
		this.searchOverlay = document.querySelector(".search-overlay");
		// reading variables is much cheaper on cpu than querying the DOM
		// so a variable to track the state of the overlay
		this.isOverlayOpen = false;
		// ref for the search input field
		this.searchField = document.querySelector("#search-term");
		// console.log(`searchField: ${this.searchField}`);
		// track the previous search input value
		this.previousValue;

		// initialise the timeout
		// don't need to initialise to null, we're not checking it
		// just clearing it each time regardless
		// this.typingTimeout = null;
		this.typingTimeout;

		// track the state of the spinner
		this.isSpinnerVisible = false;

		// call events method, set up the event listeners
		// make sure this is after all the refs and properties setup!!
		this.events();
	}

	// 2. events
	events() {
		// this.openButton.on("click", this.openOverlay.bind(this)); // jquery
		// NB! there are two js-search-trigger buttons (one for mobile nav one for desktop nav)
		// so foreach the list returned by querySelectorAll
		this.openButtons.forEach((openButton) => {
			// bind to 'this' otherwise the callback changes 'this' to the event target
			openButton.addEventListener("click", this.openOverlay.bind(this));
		});
		this.closeButton.addEventListener("click", this.closeOverlay.bind(this));
		// keypresses
		document.addEventListener("keydown", this.handleKeyPress.bind(this));
		// this one only wants to listen for keydowns on the search box
		// this.searchField.addEventListener("keydown", this.handleTyping.bind(this));
		// this.searchField.addEventListener("keydown", this.handleTyping);
		// search field needs to use keyup, bc keydown is too quick for handleTyping to update
		this.searchField.addEventListener("keyup", this.handleTyping.bind(this));
	}

	// 3. methods (function, action...)
	handleTyping() {
		// check if user has actually changed the searchField
		// so otherwise it's going to run on every key press
		// (shift, control, arrows etc)
		if (this.searchField.value != this.previousValue) {
			// console.log("handleTyping");
			// clear timer
			clearTimeout(this.typingTimeout);

			// check that search field isn't empty
			if (this.searchField.value) {
				// put a loading spinner in (probably redo this as createElement, insertBefore)
				//  and update spinner state
				if (!this.isSpinnerVisible) {
					this.resultsDiv.innerHTML = '<div class="spinner-loader"></div>';
					this.isSpinnerVisible = true;
				}
				// set timer
				this.typingTimeout = setTimeout(this.getResults.bind(this), 750);
			} else {
				// if field is empty clear the results div
				// and update spinner state
				this.resultsDiv.innerHTML = "";
				this.isSpinnerVisible = false;
			}
		}

		this.previousValue = this.searchField.value;
	}

	async doFetch(url, query) {
		const response = await fetch(url + query);
		const posts = await response.json();

		// then do something with the results
		console.log(`posts[0].title.rendered: ${posts[0].title.rendered}`);
		// let testArray = ["red", "orange", "yellow"];

		//  clear out the resultsDiv
		this.resultsDiv.textContent = "";

		// the heading
		const resultsHeading = document.createElement("h2");
		resultsHeading.classList.add("search-overlay__section-title");
		const resultsHeadingContent = document.createTextNode("General Information");
		resultsHeading.appendChild(resultsHeadingContent);
		// the ul
		const resultsList = document.createElement("ul");
		resultsList.classList.add("link-list", "min-list");
		// const searchListItem = createTextNode('General Information');
		this.resultsDiv.appendChild(resultsHeading);
		this.resultsDiv.appendChild(resultsList);

		posts.forEach((post) => {
			// the li
			const resultsLi = document.createElement("li");
			// the link
			const resultsLink = document.createElement("a");
			resultsLink.href = post.link;
			const resultsLinkContent = document.createTextNode(post.title.rendered);
			// append link text to link
			// (the text is a Node so it needs appendChild, the others could use append)
			// (caniuse says append has 93% support so probably not)
			resultsLink.appendChild(resultsLinkContent);
			// append link to li
			resultsLi.appendChild(resultsLink);
			// append li to ul
			resultsList.appendChild(resultsLi);
		});

		// append the populated ul to the resultsDiv
		// this.resultsDiv.appendChild(resultsList);

		// try with insertBefore
		// (If referenceNode is null, then newNode is inserted at the end of node's child nodes.)
		this.resultsDiv.insertBefore(resultsList, null); // yep, works

		// const searchItems = posts.map((item) => `<li><a href="${item.link}">${item.title.rendered}</a></li>`).join("");

		// const searchListEl = this.resultsDiv.querySelector(".link-list");
		// searchListEl.innerHTML = searchItems;

		// this.isSpinnerVisible = false;
	}

	async getResults() {
		// console.log("timed out, start the search!");
		// clearTimeout(this.typingTimeout);
		// this.typingTimeout = null;
		// console.log(`typingTimeout: ${this.typingTimeout}`);

		// Brad's code uses jQuery html()
		// let's do this without innerHTML
		// do as innerHTML first, then refactor
		// const tempResults = this.resultsDiv.innerHTML;
		// console.log(`this.resultsDiv.innerHTML: ${this.resultsDiv.innerHTML}`);
		// this.resultsDiv.innerHTML = "Imagine real search results here";
		// this.isSpinnerVisible = false;
		// console.log(`this.resultsDiv.innerHTML: ${this.resultsDiv.innerHTML}`);

		// NB variables are fine here bc they are scoped to a method (getResults)
		// they would not be allowed in the main scope of the class
		// const searchQuery = this.searchField.value;
		this.doFetch("http://amazing-college-xampp.local/wp-json/wp/v2/posts?search=", this.searchField.value);
		// console.log(`posts: ${posts}`);
	}

	handleKeyPress(e) {
		// s = 83, esc = 27

		// also check if any inputs or textareas on the page have focus
		if (e.keyCode == 83 && !this.isOverlayOpen && !document.querySelector("input:focus, textarea:focus")) {
			this.openOverlay();
		}

		if (e.keyCode == 27 && this.isOverlayOpen) {
			this.closeOverlay();
		}
	}

	openOverlay() {
		console.log("openOverlay");
		this.searchOverlay.classList.add("search-overlay--active");
		document.body.classList.add("body-no-scroll");
		this.isOverlayOpen = true;
	}

	closeOverlay() {
		console.log("closeOverlay");
		this.searchOverlay.classList.remove("search-overlay--active");
		document.body.classList.remove("body-no-scroll");
		this.isOverlayOpen = false;
	}
}

export default Search;
