const container = document.querySelector(".container");
    const containerCarousel = container.querySelector(".container-carousel");
    const carousel = container.querySelector(".carousel");
    const carouselItems = carousel.querySelectorAll(".carousel-item");
    const hand = document.getElementById('hand');

    // Initialize variables
    let isMouseDown = false;
    let currentMousePos = 0;
    let lastMousePos = 0;
    let lastMoveTo = 0;
    let moveTo = 0;

    const createCarousel = () => {
      const carouselProps = onResize();
      const length = carouselItems.length; // Number of items
      const degrees = 360 / length; // Degrees per item
      const gap = 20; // Space between items
      const tz = distanceZ(carouselProps.w, length, gap);

      const fov = calculateFov(carouselProps);
      const height = calculateHeight(tz);

      container.style.width = tz * 2 + gap * length + "px";
      container.style.height = height + "px";

      carouselItems.forEach((item, i) => {
        const degreesByItem = degrees * i + "deg";
        item.style.setProperty("--rotatey", degreesByItem);
        item.style.setProperty("--tz", tz + "px");
      });
    };

    // Smooth animation function
    const lerp = (a, b, n) => {
      return n * (a - b) + b;
    };

    // Distance Z function
    const distanceZ = (widthElement, length, gap) => {
      return widthElement / 2 / Math.tan(Math.PI / length) + gap; // Distance Z of items
    };

    // Calculate container height using field of view and perspective distance
    const calculateHeight = (z) => {
      const t = Math.atan((90 * Math.PI) / 180 / 2);
      const height = t * 2 * z;

      return height;
    };

    // Calculate carousel field of view
    const calculateFov = (carouselProps) => {
      const perspective = window.getComputedStyle(containerCarousel).perspective.split("px")[0];
      const length = Math.sqrt(carouselProps.w * carouselProps.w) + Math.sqrt(carouselProps.h * carouselProps.h);
      const fov = 2 * Math.atan(length / (2 * perspective)) * (180 / Math.PI);
      return fov;
    };

    // Get X position and evaluate if the position is right or left
    const getPosX = (x) => {
      currentMousePos = x;

      moveTo = currentMousePos < lastMousePos ? moveTo - 2 : moveTo + 2;

      lastMousePos = currentMousePos;
    };

    const update = () => {
      lastMoveTo = lerp(moveTo, lastMoveTo, 0.05);
      carousel.style.setProperty("--rotatey", lastMoveTo + "deg");

      requestAnimationFrame(update);
    };

    const onResize = () => {
      // Get carousel size properties
      const boundingCarousel = containerCarousel.getBoundingClientRect();

      const carouselProps = {
        w: boundingCarousel.width,
        h: boundingCarousel.height,
      };

      return carouselProps;
    };

    const initEvents = () => {
      // Mouse events
      carousel.addEventListener("mousedown", (e) => {
        startX = e.clientX;
        isMouseDown = true;
        hand.style.display = 'block'; // Show hand when dragging starts
        hand.style.left = `${e.clientX}px`; // Set hand position
        hand.style.top = `${e.clientY}px`;
        carousel.style.cursor = "grabbing";
      });

      carousel.addEventListener("mousemove", (e) => {
        if (isMouseDown) {
          getPosX(e.clientX);
          hand.style.left = `${e.clientX}px`;
          hand.style.top = `${e.clientY}px`;
        }
      });

      carousel.addEventListener("mouseup", () => {
        isMouseDown = false;
        hand.style.display = 'none'; // Hide hand when dragging ends
        carousel.style.cursor = "grab";
      });

      container.addEventListener("mouseleave", () => (isMouseDown = false));

      // Touch events
      carousel.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        isMouseDown = true;
        hand.style.display = 'block'; // Show hand when touching starts
        hand.style.left = `${e.touches[0].clientX}px`; // Set hand position
        hand.style.top = `${e.touches[0].clientY}px`;
        carousel.style.cursor = "grabbing";
      });

      carousel.addEventListener("touchmove", (e) => {
        if (isMouseDown) {
          getPosX(e.touches[0].clientX);
          hand.style.left = `${e.touches[0].clientX}px`;
          hand.style.top = `${e.touches[0].clientY}px`;
        }
      });

      carousel.addEventListener("touchend", () => {
        isMouseDown = false;
        hand.style.display = 'none'; // Hide hand when touch ends
        carousel.style.cursor = "grab";
      });

      window.addEventListener("resize", createCarousel);

      update();
      createCarousel();
    };

    initEvents();
  