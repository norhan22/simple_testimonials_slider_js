import slider from './sliderClass.js'
const sliders = document.querySelectorAll("[id*='slider']")

sliders.forEach(el => new slider())
// new slider(`#testimonials-slider`, true);
// new slider(`#test-slider`, true);