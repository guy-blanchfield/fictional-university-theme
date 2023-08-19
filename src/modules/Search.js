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
		// call events method, set up the event listeners
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
	}

	// 3. methods (function, action...)
	openOverlay() {
		console.log("openOverlay");
		this.searchOverlay.classList.add("search-overlay--active");
	}

	closeOverlay() {
		console.log("closeOverlay");
		this.searchOverlay.classList.remove("search-overlay--active");
	}
}

export default Search;
