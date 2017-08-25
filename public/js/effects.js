    $(".admin >div").hide();
    $(".admin  >div").first().show();

    $(".nav-tabs li").click(function () {
        var mid = $(this).attr("id");
        console.log($("." + mid));
        $(this).addClass("active").siblings().removeClass("active")
        $(".admin >div").hide();
        $("." + mid).fadeIn();
    });
    var messages = $('.tumbles');
    var num = messages.children('input').length;
    $('.add-tumb').click(function () {



        var message = document.createElement('input');
        message.setAttribute('class', 'form-control');
        message.setAttribute('name', 'tumble[' + num + "]");

        messages.append(message);
        num++;
    });
    var bigThumb = $('.bigtumb').attr('src');
    $('.small-view img').hover(function () {
        $('.bigtumb').attr('src', $(this).attr('src')).addClass('show')

    }, function () {

        $('.bigtumb').attr('src', bigThumb).removeClass(
            "show"
        )
    });

    $(window).load(function(){
        $(".loading").fadeOut(500,function(){
            $("html").css("overflow","auto");
        });
    });
    $('.owl-carousel').owlCarousel({
        autoplay:true,
        loop:true,
        margin:20,
        responsive:{
            0:{
                items:1
            },
            800:{
            items:2
           },
            1100:{
                items:5
            }
          
        }
    });