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
			this.deleteLike(currentLikeBox);
		} else {
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
				// 'X-WP-Nonce' : UniversityData.nonce
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
			/*
			if (someothererror) {
				throw new Error("Some other error");
			}
            */

			// console.log("response: ", response);
			const data = await response.json();
			console.log("Logging the returned data: ", data);
		} catch (err) {
			// catch the errors
			console.log(err);
		}
	}

	async deleteLike(currentLikeBox) {
		// alert("delete test message");
		console.log("deleteLike");

		const data = { professorID: currentLikeBox.dataset.professor };
		// convert to URLSearchParams - this works!
		const dataUSP = new URLSearchParams(data).toString();
		const resource = universityData.root_url + "/wp-json/university/v1/manageLike";
		const options = {
			method: "DELETE",

			headers: {
				// 'Content-Type' : 'application/json',
				// 'X-WP-Nonce' : UniversityData.nonce
				"Content-Type": "application/x-www-form-urlencoded",
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
			/*
			if (someothererror) {
				throw new Error("Some other error");
			}
            */

			// console.log("response: ", response);
			const data = await response.json();
			console.log("data: ", data);
		} catch (err) {
			// catch the errors
			console.log("Bugger!", err);
		}
	}
}

export default Like;
