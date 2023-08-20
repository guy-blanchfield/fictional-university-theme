// import $ from "jquery";

class Search {
	// 1. describe and create/initiate our object
	constructor() {
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

		// maybe initialise the timeout
		// don't need to initialise to null, we're not checking it
		// just clearing it each time regardless
		// this.typingTimeout = null;
		this.typingTimeout;

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
		this.searchField.addEventListener("keydown", this.handleTyping.bind(this));
	}

	// 3. methods (function, action...)
	handleTyping() {
		// console.log("handleTyping");
		// clear timer
		clearTimeout(this.typingTimeout);
		// this.typingTimeout = setTimeout(this.handleTypingTimeout, 750);
		// set timer
		this.typingTimeout = setTimeout(this.handleTypingTimeout, 750);
		// console.log(`typingTimeout: ${this.typingTimeout}`);
	}

	handleTypingTimeout() {
		console.log("timed out, start the search!");
		clearTimeout(this.typingTimeout);
		this.typingTimeout = null;
		// console.log(`typingTimeout: ${this.typingTimeout}`);
	}

	handleKeyPress(e) {
		// s = 83, esc = 27
		// console.log(`keypress: ${e.keyCode} isOverlayOpen: ${this.isOverlayOpen}`);

		if (e.keyCode == 83 && !this.isOverlayOpen) {
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
