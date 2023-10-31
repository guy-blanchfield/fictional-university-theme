class Like {
	constructor() {
		this.likeBox = document.querySelector(".like-box");
		this.events();
	}

	events() {
		// document.querySelector(".like-box").addEventListener("click", this.ourClickDispatcher.bind(this))
		// this.likeBox.addEventListener("click", this.ourClickDispatcher.bind(this));
		const likeBoxes = document.querySelectorAll(".like-box");
		for (const likeBox of likeBoxes) {
			likeBox.addEventListener("click", this.ourClickDispatcher.bind(this));
		}
	}

	// methods
	ourClickDispatcher(e) {
		const currentLikeBox = e.target.closest(".like-box");
		// const currentProfessor = currentLikeBox.dataset.professor
		if (currentLikeBox.dataset.exists == "yes") {
			console.log(`exists is ${currentLikeBox.dataset.exists} so delete`);
			this.deleteLike(currentLikeBox);
		} else {
			console.log(`exists is ${currentLikeBox.dataset.exists} so create`);
			this.createLike(currentLikeBox);
		}
	}

	async createLike(currentLikeBox) {
		// alert("Create test message");
		console.log("createLike");

		// NB!!!!!!!! wp rest api wants data as URL Encoded NOT JSON
		// so create the data as URLSearchParams object
		// or create as js object then convert
		// e.g. const data = {bla: bla}
		// const dataUSP = new URLSearchParams(data).toString();

		// also, we need to specify content-type as "application/x-www-form-urlencoded"

		// see: https://rapidapi.com/guides/query-parameters-fetch

		// create the data object
		const data = { professorId: currentLikeBox.dataset.professor };
		// convert to URLSearchParams - this works!
		const dataUSP = new URLSearchParams(data).toString();

		// create as urlSearchParams - this also works!
		// const dataUSP = new URLSearchParams();
		// dataUSP.append("professorId", "789");

		// if all else fails, put it in the url
		// const resource = universityData.root_url + "/wp-json/university/v1/manageLike?professorId=789";
		const resource = universityData.root_url + "/wp-json/university/v1/manageLike";
		const options = {
			method: "POST",

			headers: {
				// try content type as url encoded
				// yeah, definitely needs this!
				"Content-Type": "application/x-www-form-urlencoded",
				// 'Content-Type' : 'application/json',

				// the nonce is required for wp to consider the user logged in
				// without this, is_user_logged_in() will return false
				"X-WP-Nonce": universityData.nonce,
			},

			body: dataUSP,
			/*
            credentials: {

            }
            */
		};

		try {
			const response = await fetch(resource, options);

			if (!response.ok) {
				throw new Error(response.status);
			}

			// if the php function createLike (in includes/like-route.php)
			// calls the die() function
			// response will be text NOT json
			// so response.json() will error
			// we need to test the response and if it is text
			// get the text message and throw an error with it
			// if it's json carry on with the response.json

			// NB we can't try .json() then catch .text()
			// bc we get a 'body has already been consumed' error
			// so we do this nifty thing with JSON.parse instead

			// get the text first so we can use it in both blocks
			const responseText = await response.text();
			//  declare data so we can use it outside the try block
			let data;

			try {
				// now try to parse the text as JSON
				// this will error if resultText is just text
				data = JSON.parse(responseText);
				console.log("data from JSON parse try: ", data);
			} catch {
				// JSON parsing failed
				// so must be just text
				throw new Error(responseText);
			}

			// update the data-exists attribute
			// (this will cause the css to fill in the heart)
			currentLikeBox.dataset.exists = "yes";

			// increment the count number
			const likeCountEl = currentLikeBox.querySelector(".like-count");
			// can't increment a number, only a variable
			// i.e we can't do Number(foo)++
			// so if we wanna do it one line it needs to be:
			const likeCount = Number(likeCountEl.textContent) + 1;
			likeCountEl.textContent = likeCount;

			// update the data-like attribute
			// with the value returned by the php createLike function
			// (in includes/like-route.php)
			// which will be the ID number of the newly created post
			currentLikeBox.dataset.like = data;

			console.log("Logging the returned data: ", data);
		} catch (err) {
			// catch the errors
			console.log(err);
		}
	}

	async deleteLike(currentLikeBox) {
		// alert("delete test message");
		console.log("deleteLike");
		// here we need to find the id of the like post
		// NOT the id of the professor post
		// (it's in the like-box data-like attribute)
		const data = { like: currentLikeBox.dataset.like };
		// convert to URLSearchParams - this works!
		const dataUSP = new URLSearchParams(data).toString();
		const resource = universityData.root_url + "/wp-json/university/v1/manageLike";
		const options = {
			method: "DELETE",

			headers: {
				// 'Content-Type' : 'application/json',
				"Content-Type": "application/x-www-form-urlencoded",
				"X-WP-Nonce": universityData.nonce,
			},
			body: dataUSP,
			/*
            credentials: {

            }
            */
		};

		try {
			const response = await fetch(resource, options);

			if (!response.ok) {
				throw new Error(response.status);
			}

			// php deleteLike() function might return text not json
			// the congrats message seems to be json
			// but the die() message is text
			// so we need to do the text json parse routine
			// get the text first so we can use it in both blocks
			const responseText = await response.text();
			//  declare data so we can use it outside the try block
			let data;

			try {
				// now try to parse the text as JSON
				// this will error if resultText is just text
				data = JSON.parse(responseText);
				console.log("data from JSON parse try: ", data);
			} catch {
				// JSON parsing failed
				// so must be just text
				throw new Error(responseText);
			}

			// console.log("response: ", response);
			// const data = await response.json();

			// update the data-exists attribute
			// (this will cause the css to hollow out the heart)
			currentLikeBox.dataset.exists = "no";

			// decrement the count number
			const likeCountEl = currentLikeBox.querySelector(".like-count");
			// can't decrement a number, only a variable
			// i.e we can't do Number(foo)--
			// so if we wanna do it one line it needs to be:
			const likeCount = Number(likeCountEl.textContent) - 1;
			likeCountEl.textContent = likeCount;

			// update the data-like attribute
			// the like is being deleted
			// so set it to an empty string
			currentLikeBox.dataset.like = "";

			console.log("Logging the returned data: ", data);
		} catch (err) {
			// catch the errors
			console.log("Bugger!", err);
		}
	}
}

export default Like;
