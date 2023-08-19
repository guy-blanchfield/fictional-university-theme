import "../css/style.scss";

// Our modules / classes
import MobileMenu from "./modules/MobileMenu";
import HeroSlider from "./modules/HeroSlider";
import GoogleMap from "./modules/GoogleMap";
import Search from "./modules/Search";

// Instantiate a new object using our modules/classes
const mobileMenu = new MobileMenu();
const heroSlider = new HeroSlider();
const googleMap = new GoogleMap();
const search = new Search();

console.log("testing");
// document.querySelector(".js-search-trigger").addEventListener("click", () => {console.log("openButton clicked");});

// document.querySelector(".some-other-div").style.visibility = "hidden";
document.querySelector(".js-search-trigger").addEventListener("click", () => {
	console.log("search trigger clicked");
});
// document.querySelector(".myclass");
// const searchTrigger = document.querySelector(".js-search-trigger");
// searchTrigger.style.visibility = "hidden";
// searchTrigger.addEventListener("click", function () {console.log("searchTrigger clicked");});
