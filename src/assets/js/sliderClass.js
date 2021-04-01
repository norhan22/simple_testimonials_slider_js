/////////////////////////////////////////////////////////
// Helpers
/////////////////////////////////////////////////////////
const $ = document.querySelector.bind(document),
  $$ = document.querySelectorAll.bind(document);

/////////////////////////////////////////////////////////
// Slider
/////////////////////////////////////////////////////////

class Slider {
  /////////////////////////////
  // private Props && methods
  /////////////////////////////
  static slideTime = 0;
  static prevCase = false;


  /////////////////////////////
  // Public Props && methods
  /////////////////////////////
  constructor(slider = ".slider", autoPlay = true) {
    // Slider Selector
    this.slider = $(slider);
    this.slidesContainer = $(slider).querySelector('.slides');
    this.slides = this.slider.querySelectorAll('.item');

    // Navigation Arrows
    this.navPrev = $(slider).querySelector('.prev');
    this.navNext = $(slider).querySelector('.next');

    // Autoplay
    this.autoPlay = autoPlay;

    ////////////////////
    // Run By Default
    ////////////////////
    this.slides[0].classList.add("active")

    if (this.isSliderVisible) {

      // Window Events
      this.addEvents()
      // AutoPlay
      if (this.autoPlay) return this.autoPlayStart();


    } else {
      Slider.slideTime = 0
      this.autoPlayStop()
      this.removeEvents()
    }
  }
  /////////////////////
  // Checking ....
  /////////////////////

  // if slider is visible in the viewport
  get isSliderVisible() {
    return this.slider.offsetTop < 100;
  }
  /////////////////////
  // Handle items
  /////////////////////

  // Get ActiveItem
  get activeItemSelector() {
    const activeItems = this.slider.querySelectorAll('.active');
    return activeItems[activeItems.length - 1];
  }
  // set items
  handleItems() {
    this.firstItem = this.slides[0];
    this.lastItem = this.slides[this.slides.length - 1];
    this.activeItem = this.activeItemSelector;
    this.currentListItem = this.activeItem || this.firstItem;
    this.nextListItem = this.currentListItem.nextElementSibling;
    this.prevListItem = this.currentListItem.previousElementSibling;
  }

  // setTargetItem
  setTargetItem() {
    if (Slider.prevCase) this.targetListItem = this.prevListItem || this.lastItem;
    else this.targetListItem = this.nextListItem || this.firstItem;
  }

  // reset items
  resetItems() {
    this.slides.forEach((e) => e.classList.remove('active'));
  }

  /////////////////////
  // Sliding
  /////////////////////
  sliding() {
    // Handle items
    this.handleItems();

    // reset Slider
    this.resetItems();

    // Set Target Item
    this.setTargetItem();

    // set active List && Sections
    this.targetListItem.classList.add('active');
  }
  /////////////////////
  // autoPlay
  /////////////////////

  // Start
  autoPlayStart() {
    Slider.slideTime = 0;
    if (this.isSliderVisible)
      Slider.slideTime = setInterval(() => this.sliding(), 7000);
  }

  // Stop
  autoPlayStop() {
    clearInterval(Slider.slideTime);
  }
  /////////////////////
  // Navigation
  /////////////////////

  // prev
  goPrev() {

    this.autoPlayStop();
    Slider.prevCase = true;
    this.sliding();
  }

  // next
  goNext() {
    this.autoPlayStop();
    Slider.prevCase = false;
    this.sliding();
  }

  // navigate Click
  onNavigateClick() {
    if (this.navPrev) this.navPrev.onclick = () => this.goPrev();
    if (this.navNext) this.navNext.onclick = () => this.goNext();
  }

  ///////////////////////////////
  // handleEvent (Window Events)
  ///////////////////////////////
  handleEvent(e) {

    if (e.repeat) return false;
    /////////////////////////
    // Handle Touch events
    /////////////////////////

    var
      touchStartPosY = 0,
      touchStartPosX = 0;

    switch (e.type) {
      ////////////////////////////
      // Keyboard Events
      //onkeydown = e.keyCode 
      // 37 => left , 39 => right 
      // 38 => up, 40 => down
      /////////////////////////////
      case "keydown":
        if (e.keyCode == 37) this.goPrev();
        if (e.keyCode == 39) this.goNext();

        break;

        /////////////////////////
        //  Touch Events
        /////////////////////////
      case "touchstart":
        touchStartPosY = parseInt(e.touches[0].clientY);
        touchStartPosX = parseInt(e.touches[0].clientX);
        break;
      case "touchend":
        const
          target = e.target,
          target_classes = Array.from(e.target.classList.toString().split(' ')),
          isSlider = target.closest('.slider'),
          is_scrollY = window.innerHeight - touchStartPosY > 50,
          is_scrollX_left = window.innerWidth - touchStartPosX > 77;


        if (isSlider) {
          if (is_scrollX_left) this.goPrev();
          else this.goNext();
        } else return
        break;

    }
  }
  get events() {
    return ["keydown", "touchstart", "touchend"]
  }
  addEvents() {
    //  Navigation
    this.onNavigateClick();

    // Hover
    this.onHover();

    this.events.forEach(ev => window.addEventListener(ev, (e) => this.handleEvent(e)))
  }
  removeEvents() {
    this.events.forEach(ev => window.removeEventListener(ev, (e) => this.handleEvent(e)))
  }
  /////////////////////
  // Hover
  /////////////////////
  onHover() {
    this.slidesContainer.onmousemove = () => this.autoPlayStop();
    this.slidesContainer.onmouseleave = () => this.autoPlayStart();
  }
}

export default Slider;