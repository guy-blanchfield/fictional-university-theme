// we need DOMPurify for the innerHTML stuff
import { sanitize } from "dompurify";

class MyNotes {
	constructor() {
		// get ref to #my-notes, we'll need it more than once
		this.myNotesUl = document.querySelector("#my-notes");
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

		// we need to add event listener to the ul (#my-notes)
		// then checks if the click has come from '.delete-note'
		// event delegation?

		this.myNotesUl.addEventListener("click", this.handleMyNotesClick.bind(this));

		/*
		const editBtns = document.querySelectorAll(".edit-note");
		for (const editBtn of editBtns) {
			// editNote uses 'this' to call other methods
			// so we need to bind it here
			editBtn.addEventListener("click", this.editNote.bind(this));
			// console.log(editBtn);
		}

		const updateBtns = document.querySelectorAll(".update-note");
		for (const updateBtn of updateBtns) {
			updateBtn.addEventListener("click", this.updateNote.bind(this));
		}
		
		*/

		// NB there's only ONE submit button on the page
		// it's in the create note section
		// and it calls create note
		// it's NOT the update buttons
		// it's separate from the note lis
		const submitBtn = document.querySelector(".submit-note");
		submitBtn.addEventListener("click", this.createNote.bind(this));
	}

	// methods
	// --------------------------------------------------------

	//  event delegation
	handleMyNotesClick(e) {
		console.log("handleMyNotesClick");
		console.log(e);

		if (e.target.className.includes("delete-note")) {
			this.deleteNote(e);
			return;
		}

		if (e.target.className.includes("edit-note")) {
			this.editNote(e);
			return;
		}

		if (e.target.className.includes("update-note")) {
			this.updateNote(e);
			return;
		}

		if (e.target.className.includes("create-note")) {
			this.createNote();
			return;
		}
	}

	async createNote() {
		//  get refs to the fields, we're gonna need them more than once
		const titleField = document.querySelector(".new-note-title");
		const bodyField = document.querySelector(".new-note-body");

		// if fields are empty, go no further
		if (!titleField.value && !bodyField.value) return;

		const url = universityData.root_url + "/wp-json/wp/v2/note/";

		const ourNewPost = {
			title: titleField.value,
			content: bodyField.value,
			// posts created through the rest api are drafts by default (unpublished)
			// status: "publish" to publish them by default
			// but we want the notes to be private, i.e only available to the user
			// who created them (and the admininstrator)

			// the status: 'private' also needs to be enforced server side by
			// a filter in functions.php:
			// add_filter('wp_insert_post_data', 'makeNotePrivate');
			status: "private",
		};

		try {
			const response = await fetch(url, {
				method: "POST",
				// necessary for the nonce to be accepted by wp
				credentials: "same-origin",
				// the nonce goes in headers
				headers: {
					"Content-Type": "application/json",
					// now the nonce
					"X-WP-Nonce": universityData.nonce,
				},
				body: JSON.stringify(ourNewPost),
			});

			// if the response isn't in the right range
			if (!response.ok) {
				throw new Error(response.status);
			}
			// get on with stuff
			const result = await response.json();
			console.log(result);

			// add a new item to the list of posts (notes)
			// const newNoteLi = document.createElement("li");
			// newNoteLi.dataset.id = result.id;
			// console.log(result.id);
			// newNoteLi.className = "fade-in-calc";

			// structure of the li:
			/*
			<input readonly class="note-title-field" type="text" value="<?php echo esc_attr(get_the_title()); ?>">
			<span class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</span>
			<span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i> Delete</span>
			<textarea readonly class="note-body-field" name="" id=""><?php echo esc_attr(wp_strip_all_tags(get_the_content())); ?></textarea>
			<span class="update-note btn btn--blue btn--small"><i class="fa fa-arrow-right" aria-hidden="true"></i> Save</span>
			*/

			// consider trying cloneNode for this? no b/c what if there are notes yet?
			// do as insetAdjacentHTML but with DOMPurify (installed as dependency)

			// sanitize the user input (title and body)
			const cleanTitle = sanitize(result.title.raw);
			const cleanBody = sanitize(result.content.raw);
			console.log("dirtyBody: " + result.content.raw);
			console.log("cleanBody: " + cleanBody);

			// the Li
			// not creating an element just a string
			const newNoteLiString = `<li class="fade-in-calc" data-id="${result.id}">
				<input readonly class="note-title-field" type="text" value="${cleanTitle}">
				<span class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</span>
				<span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i> Delete</span>
				<textarea readonly class="note-body-field">${cleanBody}</textarea>
				<span class="update-note btn btn--blue btn--small"><i class="fa fa-arrow-right" aria-hidden="true"></i> Save</span>
				</li>`;

			// insert the string in the UL
			this.myNotesUl.insertAdjacentHTML("afterbegin", newNoteLiString);
			// immediately remove the fade-in class
			// this should make it transition, hopefully - nope
			// try a timeout, yeah that works
			setTimeout(() => {
				// firstElementChild here not firstChild
				// b/c there's some formatting text (/n/t/t etc) presumably
				// from the template literal formatting
				this.myNotesUl.firstElementChild.classList.remove("fade-in-calc");
				// console.log(this.myNotesUl.firstElementChild);
			}, 1);

			// ok some issues
			// buttons won't work on the newly created li b/c there's
			// no event listener for them
			// possibly run this.events()?
			// this.events();

			// myNotesUl.newNoteLi.classList.remove("fade-in-calc"); // will this work?
			console.log(`Congrats`);
			console.log(response);

			// clear out the fields
			titleField.value = "";
			bodyField.value = "";
		} catch (err) {
			console.log("Sorry");
			console.log(`Error: ${err}`);
		}
	}

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
			// const result = await response.json();
			// add css class to replace jquery slideUp()
			// this is brad's class specific to the ul#my-notes li
			// in css/modules/my-notes.scss
			thisNote.classList.add("fade-out");
			console.log(`Congrats`);
			console.log(response);
		} catch (err) {
			console.log("Sorry");
			console.log(`Error: ${err}`);
		}
	}

	async updateNote(e) {
		console.log("updateNote");
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

		// prettier-ignore // made no difference
		const ourUpdatedPost = {
			// apparently we don't need the 'rendered' property
			title: thisNote.querySelector(".note-title-field").value,
			content: thisNote.querySelector(".note-body-field").value,
		};

		try {
			const response = await fetch(url, {
				method: "POST",
				// necessary for the nonce to be accepted by wp
				credentials: "same-origin",
				// the nonce goes in headers
				headers: {
					"Content-Type": "application/json", // do we actually need this?
					// now the nonce
					"X-WP-Nonce": universityData.nonce,
				},
				// the data to update
				// (also, stringify the data object)
				// data: JSON.stringify(ourUpdatedPost)
				// NB!!!! body! not data! duh!
				body: JSON.stringify(ourUpdatedPost),
			});

			// if the response isn't in the right range
			if (!response.ok) {
				throw new Error(response.status);
			}
			// get on with stuff
			// console.log(JSON.stringify(ourUpdatedPost));
			// const result = await response.json();

			// if fetch is successful, just set the textfields back to
			// readonly, hide the update button, and swap the edit button
			// (makeNoteRadOnly does all this)
			this.makeNoteReadOnly(thisNote);
			console.log(`Congrats`);
			console.log(response);
		} catch (err) {
			console.log("Sorry");
			console.log(`Error: ${err}`);
		}
	}

	editNote(e) {
		const thisNote = e.target.parentElement;
		if (thisNote.dataset.state == "editable") {
			// make readonly
			this.makeNoteReadOnly(thisNote);
		} else {
			// make editable
			this.makeNoteEditable(thisNote);
		}
	}

	makeNoteEditable(thisNote) {
		const noteFields = thisNote.querySelectorAll(".note-title-field, .note-body-field");
		for (const noteField of noteFields) {
			noteField.removeAttribute("readonly");
			noteField.classList.add("note-active-field");
		}
		// show the save button
		thisNote.querySelector(".update-note").classList.add("update-note--visible");

		// swapButton takes 2 args
		// a ref to the button and
		// an object with the new values
		this.swapButton(thisNote.querySelector(".edit-note"), {
			iconClass: "fa fa-times",
			textString: " Cancel",
		});

		// update note state
		// this will create the vlaue if it doesn't already exist
		// otherwise it will just change its value
		thisNote.dataset.state = "editable";
	}

	makeNoteReadOnly(thisNote) {
		const noteFields = thisNote.querySelectorAll(".note-title-field, .note-body-field");
		for (const noteField of noteFields) {
			noteField.setAttribute("readonly", "readonly");
			noteField.classList.remove("note-active-field");
		}
		// hide the save button
		thisNote.querySelector(".update-note").classList.remove("update-note--visible");

		// swapButton takes 2 args
		// a ref to the button and
		// an object with the new values
		this.swapButton(thisNote.querySelector(".edit-note"), {
			iconClass: "fa fa-pencil",
			textString: " Edit",
		});

		// update note state
		thisNote.dataset.state = "readonly";
	}

	swapButton(targetBtn, newValues) {
		// pretty sure this is a btter way than trying to
		// update the existing children of targetBtn
		// because one's an element and one's a node
		// and the element doesn't really have a solid identifying class (just 'fa fa-etc')

		// hollow out the button
		while (targetBtn.firstChild) {
			targetBtn.removeChild(targetBtn.lastChild);
		}

		// create the icon
		// this should get garbage collected when the <i> gets removed
		// each time swapButton runs
		// because there'll be no reference to it, so the browser will remove it
		// when the function has finished
		// you don't need to worry about a load of elements
		// piling up somewhere like the prestige
		const targetBtnIcon = document.createElement("i");
		targetBtnIcon.className = newValues.iconClass;
		targetBtnIcon.setAttribute("aria-hidden", "true");
		const targetBtnText = document.createTextNode(newValues.textString);
		// append the icon and text to the empty button
		targetBtn.appendChild(targetBtnIcon);
		targetBtn.appendChild(targetBtnText);
	}
}

export default MyNotes;
