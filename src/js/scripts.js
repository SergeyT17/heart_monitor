$(function(){
    $('.carousel__inner').slick({
        speed: 1000,
        // adaptiveHeight: true,
        prevArrow: '<button type="button" class="slick-prev"><img src="icons/left.png"></button>',
        nextArrow: '<button type="button" class="slick-next"><img src="icons/right.png"></button>',
        responsive: [
            {
                breakpoint: 991,
                settings: {
                    dots: true,
                    arrows: false
                }
            }
        ]   
    });
});
      