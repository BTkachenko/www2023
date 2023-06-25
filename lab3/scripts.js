document.addEventListener("DOMContentLoaded", function () {
    var hamburger = document.querySelector(".hamburger");
    var navLinks = document.querySelector(".nav-links");
  
    hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("nav-links--active");
    });
  });

  
  function loadImage(src) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.src = src;
      img.onload = function () {
        resolve(img);
      };
      img.onerror = function () {
        reject(new Error("Nie udało się załadować obrazu: " + src));
      };
    });
  }
  
  var gallery = document.getElementById("gallery");
  var imageSources = ["img1.jpg", "img2.jpg", "img3.jpg"];
  
  Promise.all(imageSources.map(loadImage)).then(function (images) {
    images.forEach(function (img) {
      gallery.appendChild(img);
    });
  });
  