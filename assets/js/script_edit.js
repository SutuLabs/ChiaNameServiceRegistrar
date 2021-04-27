  // Preloader js    
  $(window).on('load', function () {
    $('.preloader').fadeOut(100);
  });

  (function ($) {
    'use strict';

    $("#navbarmain ul").hide();
    $("section").hide();
    $("footer").hide();
    const mainmenu_area_color = $("#mainmenu-area").css("background-color");
    if (mainmenu_area_color != "rgba(0, 0, 0, 0)") {
      $("#mainmenu-area").css("background-color", "transparent");
      $("#mainmenu-area button").hide()
    };

    $("#box").click(function () {
      $("#box_button_container").fadeOut(600);
      $("#box").slideUp(1000, function () {
        $("#box").hide();
      });
      $("#navbarmain ul").fadeIn(1000, function () {
        if (mainmenu_area_color != "rgba(0, 0, 0, 0)") {
          $("#mainmenu-area").css("background-color", mainmenu_area_color);
          $("#mainmenu-area button").fadeIn()
        };
      });
      $("section").fadeIn(1500);
      $("footer").fadeIn(1500);

      $('body').scrollspy({
        target: '#navbarmain',
        offset: 100
      });

      /*
       * ----------------------------------------------------------------------------------------
       *  SMOTH SCROOL JS
       * ----------------------------------------------------------------------------------------
       */

      $('a.smoth-scroll').on('click', function (e) {
        var anchor = $(this);
        $('html, body').stop().animate({
          scrollTop: $(anchor.attr('href')).offset().top - 100
        }, 1000);
        e.preventDefault();
      });


      $('.testimonial-wrap').slick({
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: false,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 4000,
        responsive: [{
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 900,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          }, {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }

        ]
      });




      $('.book-preview').each(function () {
        $(this).find('.popup-gallery').magnificPopup({
          type: 'image',
          gallery: {
            enabled: true
          }
        });
      });


      /* ----------------------------------------------------------- */
      /*  Fixed header
      /* ----------------------------------------------------------- */


      $(window).on('scroll', function () {
        if ($(window).scrollTop() > 10) {
          $('.site-header').addClass('header-white');
        } else {
          $('.site-header').removeClass('header-white');
        }

      });



      // Smooth scrolling using jQuery easing
      // jQuery for page scrolling feature - requires jQuery Easing plugin


      // Closes responsive menu when a scroll trigger link is clicked
      $('.smoth-scroll').on('click', function (event) {
        $('.navbar-collapse').collapse('hide');
      });

    });


  })(jQuery);