$(function () {
    // 화면 크기 변경 시 nav 변경
    let header = $('header');
    let gnb1 = $('nav.gnb1');
    let mobileGnb = $('nav.mobileGnb');
    let section = $("section");
    let carousel_btn_all = $('.carousel_btn');


    function handleResize() {
        if (window.innerWidth < 768) {
            header.hide();
            gnb1.hide();
            mobileGnb.show();
            carousel_btn_all.hide();
        } else {
            header.show();
            gnb1.show();
            mobileGnb.hide();
            carousel_btn_all.show();
            section.show();
        }
    }

    handleResize();

    $(window).on('resize', function () {
        handleResize();
    });


    // 모바일 nav 메뉴 드랍
    let hambergerBtn = $(".hambergerBtn");
    let mobileMenu = $(".mobileMenu");
    let footer = $("#footer");
    let close = $(".close");

    hambergerBtn.click(function () {
        mobileMenu.show();
        section.hide();
        footer.hide();
    })

    close.click(function () {
        mobileMenu.hide();
        section.show();
        footer.show();
    })

    // 전체 상품 드랍 다운 메뉴
    $("nav.gnb1 .menu, nav.gnb1 .allMenu").click(function (e) {
        e.preventDefault();
        $(this).siblings(".gnb1_dropDown").slideToggle(200);

        let menu = $(this).closest(".allItemBox").find(".menu");
        let menuText = menu.text();
        menu.text(menuText === "menu" ? "close" : "menu");

    })

    // 캐로셀
    let carousel_btn = $(".carousel_btn li").not(".carousel_btn li:last-child");
    let carousel_gallery = $(".gallery li");
    let current = 0;

    carousel_gallery.css("left", "100%");
    carousel_gallery.eq(current).css("left", 0);
    updateCountDisplay(current);

    carousel_btn.click(function () {
        carousel_btn.removeClass("active");
        $(this).addClass("active");
        let current = $(this).index();
        clearInterval(clock);
        carousel_gallery.css("left", "100%");
        carousel_gallery.eq(current).animate({
            "left": 0
        }, 200);
        updateCountDisplay(current);
        move_btn(current);

    })

    function move_btn(current) {
        clock = window.setInterval(function () {
            prev = carousel_gallery.eq(current);
            prev.css("left", 0).animate({
                "left": "-100%"
            }, 200);
            carousel_btn.removeClass("active");
            carousel_btn.eq(current + 1).addClass("active");
            current = (current + 1) % carousel_gallery.length;

            let next = carousel_gallery.eq(current);
            next.css("left", "100%").animate({
                "left": 0
            }, 200);
            carousel_btn.eq(current).addClass("active");
            updateCountDisplay(current);
        }, 5000);
    }

    move();

    function move() {
        clock = window.setInterval(function () {
            let prev = carousel_gallery.eq(current);
            prev.css("left", 0).animate({
                "left": "-100%"
            }, 200);
            carousel_btn.removeClass("active");
            carousel_btn.eq(current + 1).addClass("active");
            current = (current + 1) % carousel_gallery.length;

            let next = carousel_gallery.eq(current);
            next.css("left", "100%").animate({
                "left": 0
            }, 200);
            carousel_btn.eq(current).addClass("active");

            updateCountDisplay(current);

        }, 5000);
    }

    function updateCountDisplay(currentIndex) {
        let total = carousel_gallery.length;
        $(".currentCount").text(currentIndex + 1)
        $(".totalCount").text(total)
    }

    // 할인 가격
    $(".items .itemLink").each(function () {
        let priceText = $(this).find(".price").text(); // "699,000원"
        let saleText = $(this).find(".sale").text(); // "10%"

        // 쉼표랑 원, % 제거해서 숫자만 추출
        let price = parseInt(priceText.replace(/[^0-9]/g, ""));
        let sale = parseInt(saleText.replace(/[^0-9]/g, ""));

        // 계산: 할인 적용된 가격
        let discounted = price - Math.floor(price * (sale / 100));

        // 세자리마다 콤마 찍기
        let formatted = discounted.toLocaleString() + "원";

        // salePrice에 넣기
        $(this).find(".salePrice").text(formatted);
    });

    // 추천상품 슬라이더
    new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 50,
        speed: 1000,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        },
        breakpoints: {
            768: {
                slidesPerView: 4,
                spaceBetween: 50,
            },
        }
    })

    // 급상승 키워드 슬라이더
    let swiper;
    const $originalSlides = $('.keyword .items').clone();

    function initSwiper(filteredSlides) {
        if (swiper) swiper.destroy(true, true); // 기존 swiper 제거

        const $wrapper = $('.keyword .swiper-wrapper');
        $wrapper.empty().append(filteredSlides);

        swiper = new Swiper('.keyword .swiper', {
            slidesPerView: 1,
            spaceBetween: 40,
            speed: 1000,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
            }
        });
    }

    const defaultGroup = "0";
    const $defaultSlides = $('.keyword .items').filter(`[data-group="${defaultGroup}"]`).clone();
    initSwiper($defaultSlides);

    $('.keywordList li').hover(function () {
        const group = $(this).data('group');
        console.log("hover group:", group);

        const $filteredSlides = $originalSlides.filter(`[data-group="${group}"]`).clone();
        initSwiper($filteredSlides);
    });


    // img 호버 아이콘 추가
    const iconClass = "imgIcons";

    $(".itemBox, .swiper-wrapper").on("mouseenter", ".items", function () {
        const thumb = $(this).find(".thumb");

        const iconHtml = `
                <div class="${iconClass}">
                    <a href="#"><span class="cartIcon material-symbols-outlined">shopping_cart</span></a>
                    <a href="#"><span class="favIcon material-symbols-outlined">favorite</span></a>
                </div>`;

        if (!thumb.find(`.${iconClass}`).length) {
            thumb.append(iconHtml);
        }
    })

    // img 호버 아이콘 삭제
    $(".itemBox, .swiper-wrapper").on("mouseleave", ".items", function () {
        $(this).find(`.${iconClass}`).remove();
    })

    // 고객 정보 마스킹
    $("section.review .itemLink .customer_info").each(function() {
        let originalInfo = $(this).text(); 
        let maskingInfo = '***' + originalInfo.slice(3);
        $(this).text(maskingInfo);
    });

    // 패밀리 사이트 이동
    $("footer select").on("change", function() {
        let siteUrl = $(this).val();
        if(siteUrl.length > 0) {
            window.open(siteUrl, "_blank");
        }
    });

    // nav 아이콘 변경
    let navIcon = false;
    let btnScrollTop = $($(".scrollRight a"));

    $(window).on("scroll", function(){
        let scrollTop = $(window).scrollTop();
        let loginGroup = $("nav .loginGroup li"); 
        let login = $("nav .loginGroup .login");
        let join = $("nav .loginGroup .join");
        let cart = $("nav .loginGroup .cart");
        
        if(scrollTop > 150 && !navIcon) {
            loginGroup.addClass("material-symbols-outlined");
            login.text("logout");
            join.text("person");
            cart.text("shopping_cart");
            isIcon = true;
            
        } else if (scrollTop <= 150 && isIcon) {
            loginGroup.removeClass("material-symbols-outlined");
            login.text("로그인");
            join.text("회원가입");
            cart.text("장바구니");
            isIcon = false;
        } 

        if (scrollTop > 950) {
            btnScrollTop.fadeIn();  
        } else {
            btnScrollTop.fadeOut(); 
        }
    });
    
    
    // 타임 세일
    $(".timeSaleText").each(function() {
        let itemLink = $(this).closest('.itemLink');
        itemLink.find('.sale').after('<img class="timeSaleIcon" src="img/icon_time_sale_cost.png"></img>');
    });
    
    // 베스트
    $(".bestIconText").each(function() {
        let itemLink = $(this).closest('.itemLink');
        itemLink.find('.sale').after('<img class="bestIcon" src="img/ico_best.png"></img>');
    });

    // 스크롤 버튼 애니메이션
    btnScrollTop.on("click", function() {
        $("html, body").animate({scrollTop:0}, 2000);
    });


});