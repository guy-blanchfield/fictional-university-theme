class MyNotes {
	constructor() {
		this.events();
	}

	events() {
		// remember!! this.whatever fro properties of the object
		// (including methods!)
		// const (or let) for variables that are scoped to a method
		const deleteBtns = document.querySelectorAll(".delete-note");
		for (const deleteBtn of deleteBtns) {
			deleteBtn.addEventListener("click", this.deleteNote);
		}

		const editBtns = document.querySelectorAll(".edit-note");
		for (const editBtn of editBtns) {
			editBtn.addEventListener("click", this.editNote);
			console.log(editBtn);
		}
	}

	// methods will go here
	async deleteNote(e) {
		// send delete request to wp-json
		// this requires a nonce, see functions.php > university_files()

		// see https://stackoverflow.com/questions/46204166/wordpress-rest-api-authentication-using-fetch
		// for how to pass nonce to wp api using fetch
		// console.log(e.target.parentElement);
		// const id = e.target.parentElement?.getAttribute("data-id"); // would also work
		const thisNote = e.target.parentElement;
		// const id = thisNote.dataset.id;
		const url = universityData.root_url + "/wp-json/wp/v2/note/" + thisNote.dataset.id;
		// console.log(`Url: ${url}`);
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
			// add css class to replace jquery slideUp()
			// this is brad's class specific to the ul#my-notes li
			// in css/modules/my-notes.scss
			thisNote.classList.add("fade-out");
			console.log(`Congrats`);
			console.log(`Result: ${result.content.rendered}`);
		} catch (err) {
			console.log("Sorry");
			console.log(`Error: ${err}`);
		}
	}

	editNote(e) {
		const thisNote = e.target.parentElement;
		const noteFields = thisNote.querySelectorAll(".note-title-field, .note-body-field");
		for (const noteField of noteFields) {
			noteField.removeAttribute("readonly");
			noteField.classList.add("note-active-field");
		}
		thisNote.querySelector(".update-note").classList.add("update-note--visible");
		// thisNote.querySelector('.edit-note').innerHTML = `<span class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</span>`

		// doing it long hand just for the practice

		// get a ref to the edit button
		const editNoteBtn = thisNote.querySelector(".edit-note");
		// remove all the children of editNoteBtn (hollow it out)
		while (editNoteBtn.firstChild) {
			editNoteBtn.removeChild(editNoteBtn.lastChild);
		}
		// const cancelNoteBtn = document.createElement("span");
		// cancelNoteBtn.className = "cancel-note";

		// now create the icon and the text node
		const cancelNoteBtnIcon = document.createElement("i");
		cancelNoteBtnIcon.className = "fa fa-times";
		cancelNoteBtnIcon.setAttribute("aria-hidden", "true");
		const cancelNoteBtnText = document.createTextNode(" Cancel");
		// append the icon and text to editNoteBtn
		editNoteBtn.appendChild(cancelNoteBtnIcon);
		editNoteBtn.appendChild(cancelNoteBtnText);
	}
}

export default MyNotes;
