class MyNotes {
	constructor() {
		this.events();
	}

	events() {
		this.deleteBtns = document.querySelectorAll(".delete-note");
		this.deleteBtns.forEach((deleteBtn) => {
			deleteBtn.addEventListener("click", this.deleteNote);
		});
	}

	// methods will go here
	async deleteNote() {
		// send delete request to wp-json
		// this requires a nonce, see functions.php > university_files()

		// see https://stackoverflow.com/questions/46204166/wordpress-rest-api-authentication-using-fetch
		// for how to pass nonce to wp api using fetch

		const url = universityData.root_url + "/wp-json/wp/v2/note/107";
		console.log(`Url: ${url}`);
		try {
			const response = await fetch(url, {
				method: "DELETE",
				// necessary for the nonce to be accepted by wp
				credentials: "same-origin",
				// the nonce goes in headers
				headers: {
					"Content-Type": "application/json", // do we actually need this?
					// now the nonce
					"X-WP-Nonce": universityData.nonce,
				},
			});

			// if the response isn't in the right range
			if (!response.ok) {
				throw new Error(response.status);
			}
			// get on with stuff
			const result = await response.json();
			console.log(`Congrats`);
			console.log(`Result: ${result.content.rendered}`);
		} catch (err) {
			console.log("Sorry");
			console.log(`Error: ${err}`);
		}
	}
}

export default MyNotes;
