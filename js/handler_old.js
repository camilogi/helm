'use strict';

var init = function (){
  $.mobile.loading().hide();
  $.extend($.mobile, {
    defaultPageTransition: 'fade'
  });

  //disable copypaste on selected inputs
  $('input.disablecopypaste').bind('copy paste', function (e){
    e.preventDefault();
  });

  //image verification view
  $('.verificate-image').click(function (e){
    e.preventDefault();
    $('.error').removeClass('error');
    if (!$('#vf-image').is(':checked')) {
      $('.image-verification, .confirm').addClass('error');
      showError('Es necesario certificar la imagen');
    } else if (!$('#password').val()) {
      $('#password').addClass('error');
      showError('Por favor ingresa tu clave');
    } else {
      window.location.hash = 'questions';
    }
  });

  $('#main-menu').panel().enhanceWithin();

  //click on list item
  $('.ui-content .select-view > li:not(.accounts)').click(function (){
    var animated = false;
    $('.ui-content .select-view > li.accounts').each(function (){
      if ($(this).is(':animated')) {
        animated = true;
      }
    });
    if (!animated) {
      $(this).siblings().removeClass('open');
      $(this).siblings('.accounts').stop().slideUp();
      $(this).toggleClass('open').next().stop().slideToggle(300);
    }
  });

  //toggle founds
  $('.toggle-founds li').click(function (){
    $(this).siblings().stop().slideToggle(300);
  });

  //map clicks to navigate
  $('[data-navigate]').click(function (e){
    e.preventDefault();
    window.location.hash = $(this).data('navigate');
  });

  //click on movement detail
  $('li.accounts li').click(function (){
    window.location.hash = 'movements';
  });

  //toggle contact
  $('.toggle-contact span').click(function (){
    $(this).addClass('selected').siblings().removeClass('selected');
    $(this).parent().parent().find('[data-contact-ref]').hide();
    $(this).parent().parent().find('[data-contact-ref="' + $(this).data('contact-view') + '"]').show();
  });

  //contact header
  $('.switch-contact-header').click(function (){
    $('.info-bar').toggle();
    $('.icon-menu').toggleClass('onContact');
    $('#contact .ui-content').toggleClass('onContactNoLogin');
  });
  
  //office search
  $('.trigger-office-search').click(function(){
    $('.form-buscar').hide();
    $('.resultado-busqueda').show();
  });

  //banner swipe
  bannerSwipe();

  onPageChange();
},
onPageChange = function (){
  var hash = window.location.hash;
  console.log(hash);
  $('.ui-content').css('min-height', $(window).height() - $('[data-role="header"]').height() - 100);
  if (!hash) {
    window.location.hash = 'intro';
    showSplash();
  } else {
    if (hash === '#intro') {
      $('.icon-menu, .info-bar').hide();
      $('.banner').show();
      //showSplash();
    } else if (hash === '#login') {
      $('.icon-menu, .info-bar, .indicators, .back-to').hide();
      $('.banner').show();
      //showSplash();
    } else if (hash === '#detalle-oficina') {
      $('[data-role="header"]').hide();
      $('[role="main"]').addClass('detail');
    } else if (hash === '#image-verification' || hash === '#questions') {
      $('.info-bar, .swiper-container, .indicators').hide();
    } else if(hash === '#contact'){
      $('.icon-menu, .info-bar, .indicators, .swiper-container, .span-header').hide();
    } else if(hash === '#sucursales'){
      $('.icon-menu, .info-bar, .swiper-container').hide();
    } else if(hash === '#sucursales-busqueda'){
      $('.icon-menu, .info-bar, .indicators, .swiper-container').hide();
    } else {
      $('.icon-menu, .info-bar').show();
      $('.banner').hide();
      $('[role="main"]').removeClass('detail');
      $('[data-role="header"]').show();
    }
  }
  $('.ui-content .select-view > li:not(.accounts)').removeClass('open');
},
showError = function (message){
  $('.error-message div').text(message).parent().stop().slideDown(200);
  setTimeout(function (){
    $('.error-message').slideUp(200);
  }, 4000);
},
showSplash = function (){
  $('.splash').show().delay(2500).children('.logo').fadeIn(2000, function (){
    $(this).children('.text').delay(500).fadeIn(2000, function (){
      $(this).parent().parent().delay(1000).fadeOut(1000);
    });
  });
},
bannerSwipe = function (){
  $('.banner ul li').width($(window).width() - 24);
  var bannerItemWidth = $('.banner ul li').width() + 12;
  $('.banner ul').width($(window).width() * $('.banner ul li').size())
  .css('margin-left', 0);
  setTimeout(function (){
    $('.banner').on('swipe', function (e){
      var start = e.swipestart.coords[0];
      var stop = e.swipestop.coords[0];
      var move;
      if (start > stop) {
        move = Math.abs(parseInt($('.banner ul').css('margin-left'), 10)) + (bannerItemWidth);
        if (parseInt($('.banner ul').css('margin-left'), 10) === -(bannerItemWidth * ($('.banner ul li').size() - 1))) {
          move = 0;
        }
      } else {
        move = Math.abs(parseInt($('.banner ul').css('margin-left'), 10)) - (bannerItemWidth);
        if (parseInt($('.banner ul').css('margin-left'), 10) === 0) {
          move = (bannerItemWidth * ($('.banner ul li').size() - 1));
        }
      }
      $('.banner ul').stop().animate({
        'margin-left': -move + 'px'
      }, 500, 'linear', function (){
        setTimeout(function (){
          $('.banner ul li').each(function (){
            if (parseInt($(this).offset().left, 10) < 20) {
              $('.bullets span:eq(' + $(this).index() + ')').addClass('active').siblings().removeClass('active');
            }
          });
        }, 500);
      });
    });
  }, 500);
};

$(document).bind('pageinit', init);
$(window).bind('hashchange', onPageChange).resize(function (){
  bannerSwipe();
});
$('input, textarea, button, a, select').off('touchstart mousedown').on('touchstart mousedown', function(e) {
    e.stopPropagation();
});

//Hidding login banner & footer

$(function(){
  $('input').focus(function(){
    $(".swiper-container, .indicators").slideUp();
    $('#image-verification .ui-content').addClass('less-padding');
  });
});
$(function(){
  $('input.input-login').focus(function(){
    $("div[data-role=footer]").hide();
  }).blur(function(){
    $("div[data-role=footer]").show();
  });
});

//Overflow scrolling
$(document).bind("mobileinit", function(){
  $.mobile.touchOverflowEnabled = true;
});

// Selected menu
$(document).ready(function(){
  $("div[data-role=footer] li").on('click', function(){
    var currentClass = $(this).find('span').attr('class');
    var currentObject = $(this).find('span');
    var thisElement = $(this);

    if(!currentObject.hasClass('active')){
      // Change background color
      thisElement.siblings('li').css('background-color', '#FFF');
      thisElement.css('background-color', '#f37c20');
      $('.weird-flap div').css('background', '#f37c20');

      thisElement.siblings('li').find('p').css('color', '#59595a');
      thisElement.find('p').css('color', '#FFF');

      thisElement.siblings('li').find('span').removeClass('active');
      currentObject.addClass('active');
    }
  })
});

// slider
$(document).ready(function() {
    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true
    });

    // Style after input focus
    $('.contact-form input, .contact-form textarea, .content input').focusout(function(){
      $(this).addClass('after-focus');
    });
    $('.contact-form select').blur(function(){
      $(this).parent('.ui-btn').addClass('after-focus');
    });
    $('.select-sucursales').blur(function(){
      $(this).parent('.ui-btn').addClass('after-focus');
    })

});