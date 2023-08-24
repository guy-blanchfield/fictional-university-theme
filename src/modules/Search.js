// import $ from "jquery";

class Search {
	// 1. describe and create/initiate our object
	constructor() {
		this.addSearchHTML();
		// create a post property for the fetched, jsoned result
		// this.posts;

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
		// otherwise it's going to run on every key press
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
				console.log("clearing results div from handleTyping");
				this.clearResults();
			}
		}

		this.previousValue = this.searchField.value;
	}

	// despite the name, this method is mostly to clear the spinner
	clearResults() {
		// clear out the resultsDiv
		this.resultsDiv.textContent = "";
		// update spinner state
		this.isSpinnerVisible = false;
	}

	async doFetch(url, query) {
		const response = await fetch(url + query);
		// json the response and store it in a property
		// (created in constructor)
		// so other methods can use it
		// const data = await response.json();
		// return data;
		return await response.json();
	}

	async getResults() {
		// NB variables are fine here bc they are scoped to a method (getResults)
		// they would not be allowed in the main scope of the class

		// do the posts fetch
		// const posts = await this.doFetch(universityData.root_url + "/wp-json/wp/v2/posts?search=", this.searchField.value);
		// do the pages fetch
		// const pages = await this.doFetch(universityData.root_url + "/wp-json/wp/v2/pages?search=", this.searchField.value);

		// true async version (i.e parallel not serial)
		// brad was using jQuery when().then();

		// nb tried putting .catch() on the end of Promise.all - didn't take
		try {
			const [posts, pages] = await Promise.all([
				this.doFetch(universityData.root_url + "/wp-json/wp/v2/posts?search=", this.searchField.value),
				this.doFetch(universityData.root_url + "/wp-json/wp/v2/pages?search=", this.searchField.value),
			]);

			// spread (sources must be arrays):
			// const combinedResults = [...posts, ...pages]
			// concat (sources could be anything, should still work)
			const combinedResults = posts.concat(pages);
			this.displayResults(combinedResults);
		} catch (err) {
			this.clearResults();
			console.log(`error: ${err}`);
			const resultsErrorDiv = document.createElement("div");
			const resultsErrorPara1 = document.createElement("p");
			const resultsErrorPara2 = document.createElement("p");
			resultsErrorPara1.textContent = "Sorry, there has been an unexpected error. Please try again.";
			// resultsErrorPara2.textContent = "Please try again.";
			resultsErrorDiv.appendChild(resultsErrorPara1);
			// resultsErrorDiv.appendChild(resultsErrorPara2);
			this.resultsDiv.insertBefore(resultsErrorDiv, null);
		}
	}

	displayResults(results) {
		// update the results div

		// start by clearing it out (the spinner probably)
		// and updating the spinner state
		this.clearResults();

		// the heading
		const resultsHeading = document.createElement("h2");
		resultsHeading.className = "search-overlay__section-title";
		// const resultsHeadingContent = document.createTextNode("General Information");
		// resultsHeading.appendChild(resultsHeadingContent);
		// for this purpose textContent is no different to createTextNode
		// except it's a line shorter
		resultsHeading.textContent = "General Information";
		// the ul
		const resultsList = document.createElement("ul");
		resultsList.className = "link-list min-list";

		// we write the heading no matter what
		this.resultsDiv.insertBefore(resultsHeading, null);

		// this can run unconditionally bc it'll do nothing if there are no results
		results.forEach((result) => {
			// the li
			const resultsLi = document.createElement("li");
			// the link
			const resultsLink = document.createElement("a");
			resultsLink.href = result.link;
			const resultsLinkContent = document.createTextNode(result.title.rendered);
			// append link text to link
			// (the text is a Node so it needs appendChild, the others could use append)
			// (caniuse says append has 93% support so probably not)
			resultsLink.appendChild(resultsLinkContent);
			// append link to li
			resultsLi.appendChild(resultsLink);
			// append li to ul
			resultsList.appendChild(resultsLi);
		});

		// this is where we need some conditions
		// if we have results write the ul
		// brad did this as ternary bc its all in template literal
		// in arrow function within jQuery getJSON()
		// else write 'no information' message
		if (results.length) {
			// try with insertBefore (marginally quicker than appendChild)
			// (If referenceNode is null, then newNode is inserted at the end of node's child nodes.)
			this.resultsDiv.insertBefore(resultsList, null);
		} else {
			const resultsPara = document.createElement("p");
			resultsPara.textContent = "No general information matches that search.";
			this.resultsDiv.insertBefore(resultsPara, null);
		}
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

	// this method is a callback for the transitionend eventlistener
	searchFocus() {
		this.searchOverlay.addEventListener("transitionend", () => {
			this.searchField.focus();
		});
	}

	openOverlay() {
		console.log("openOverlay");
		this.searchOverlay.classList.add("search-overlay--active");
		document.body.classList.add("body-no-scroll");
		// set focus to search field
		console.log(`setting focus to ${this.searchField}`);

		// the search overlay has an opacity transition
		// so focus won't work till it's fully visible
		// so set an eventlistener for transitionend
		// and use that to call the searchfocus method
		this.searchOverlay.addEventListener("transitionend", this.searchFocus.bind(this));

		// clear the field
		this.searchField.value = "";
		// clear the results
		this.clearResults();

		this.isOverlayOpen = true;
	}

	closeOverlay() {
		console.log("closeOverlay");
		this.searchOverlay.classList.remove("search-overlay--active");
		document.body.classList.remove("body-no-scroll");

		// remove the transitionend eventlistener
		this.searchOverlay.removeEventListener("transitionend", this.searchFocus);

		// remove focus from the search field otherwise it interferes with
		// the handleKeyPress conditions, which check for inputs or textareas having focus
		this.searchField.blur();
		this.isOverlayOpen = false;
	}

	// insert the search div html
	addSearchHTML() {
		console.log("Adding search HTML");
		// suppose we're gonna have to use insertAdjacentHTML
		// just this once
		document.body.insertAdjacentHTML(
			"beforeend",
			`
			<div class="search-overlay">
				<div class="search-overlay__top">
				<div class="container">
					<i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
					<input type="text" class="search-term" placeholder="What are you looking for?" autocomplete="off" id="search-term">
					<i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
				</div>
				</div>
			
				<div class="container">
				<div id="search-overlay__results"></div>
				</div>
			</div>
		`
		);
	}
}

export default Search;
