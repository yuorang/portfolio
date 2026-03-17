$(function () {
    // Lenis 및 GSAP 설정
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const backToTopBtn = document.querySelector(".backToTop");
    const motionTexts = document.querySelectorAll(".motionText");
    const section03 = document.querySelector("#section03");
    const header = document.querySelector("header");

    // 스크롤 이벤트 및 ScrollTrigger 생성

    // Back to top 버튼 및 섹션03 텍스트 토글 (Lenis 스크롤 이벤트에 통합)
    lenis.on("scroll", ({ scroll }) => {
        if (scroll > 300) {
            gsap.to(backToTopBtn, { opacity: 1, pointerEvents: 'auto', duration: 0.3 });
        } else {
            gsap.to(backToTopBtn, { opacity: 0, pointerEvents: 'none', duration: 0.3 });
        }

        // 섹션03 모션텍스트
        const sectionRect = section03.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const scrollY = scroll;
        const docHeight = document.documentElement.scrollHeight;

        motionTexts.forEach(text => {
            // 페이지 맨 밑에서는 무조건 보이게
            if (scrollY + windowHeight >= docHeight - 5) {
                text.classList.remove("hide");
            }
            // section03 화면 안에 들어가면 숨김
            else if (sectionRect.top < windowHeight && sectionRect.bottom > 0) {
                text.classList.add("hide");
            }
            // section03 위로 올라가면 다시 보이게
            else if (sectionRect.top >= windowHeight) {
                text.classList.remove("hide");
            }
            // section03 아래로 지나가면 계속 숨김
            else {
                text.classList.add("hide");
            }
        });
    });

    // 헤더 숨김/노출
    ScrollTrigger.create({
        start: "top -80",
        onUpdate: self => {
            if (self.direction === 1 && !header.classList.contains("hide")) {
                header.classList.add("hide");
            } else if (self.direction === -1 && header.classList.contains("hide")) {
                header.classList.remove("hide");
            }
        }
    });

    // 레이아웃 리프레시 (스크롤 좌표 재계산)
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });

    // 커스텀 마우스 커서 설정
    const trail = document.querySelector(".cursor-trail");

    let mouse = { x: 0, y: 0 };
    let pos = { x: 0, y: 0 };

    document.addEventListener("mousemove", (e) => {
        if (window.innerWidth < 1024) return;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function animate() {
        pos.x += (mouse.x - pos.x) * 0.08;
        pos.y += (mouse.y - pos.y) * 0.08;

        trail.style.left = pos.x + "px";
        trail.style.top = pos.y + "px";

        requestAnimationFrame(animate);
    }

    animate();
    // no-cursor
    const hideSections = document.querySelectorAll(".no-cursor");

    hideSections.forEach(section => {
        section.addEventListener("mouseenter", () => {
            trail.classList.add("is-hidden");
        });

        section.addEventListener("mouseleave", () => {
            trail.classList.remove("is-hidden");
        });
    });

    // big-cursor
    const bigSections = document.querySelectorAll(".big-cursor");

    bigSections.forEach(section => {
        section.addEventListener("mouseenter", () => {
            trail.classList.add("is-big");
        });

        section.addEventListener("mouseleave", () => {
            trail.classList.remove("is-big");
        });
    });

    // 섹션 04 ~ 05 구간 배경색 반전
    ScrollTrigger.create({
        trigger: "#section04",
        start: "0% 40%",
        endTrigger: "#section05",
        end: "0% 60%",
        // markers: true,
        toggleClass: {
            targets: "body",
            className: "dark",
        },
    });

    lenis.stop();
    document.documentElement.classList.add('lenis-stop');

    const landing = gsap.timeline({
        onComplete: function () {
            lenis.start();
            ScrollTrigger.refresh();
            document.documentElement.classList.remove('lenis-stop');
        }
    });

    landing.to({}, { duration: 0.2 })
        .to(".intro-title .text", {
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2
        })
        .to(".intro-title .text", {
            x: -80,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.in"
        })
        .to(".slide-bg01", {
            y: "-100%",
            duration: 1,
            ease: "power4.inOut"
        })
        .to(".slide-bg02", {
            y: "-100%",
            duration: 1.5,
            ease: "power4.inOut"
        }, "-=0.7")
        .set(".landing-intro", {
            display: "none"
        });


    // 헤더 네비게이션 및 햄버거 메뉴
    $('.hamburger').click(function (e) {
        e.preventDefault();
        $('.nav-mobile-overlay').toggleClass('show');
        $(this).toggleClass('active');

        // 메뉴 오픈 시 본문 스크롤 방지
        if ($('.nav-mobile-overlay').hasClass('show')) {
            $('body').css('overflow', 'hidden');
        } else {
            $('body').css('overflow', 'auto');
        }
    });

    // 메뉴 링크 클릭 시 메뉴 닫기
    $('.nav-mobile .mo-menu-link').click(function () {
        $('.nav-mobile-overlay').removeClass('show');
        $('.hamburger').removeClass('active');

        // 일반 스크롤 복구
        $('body').css('overflow', 'auto');

        // 만약 상단에 선언한 lenis 인스턴스가 있다면 스크롤 재개
        if (typeof lenis !== 'undefined') {
            lenis.start();
        }
    });

    // visual_vedio
    gsap.to(".visual_vedio", {
        scrollTrigger: {
            trigger: "#section03",
            start: "top bottom",
            end: "top top",
            scrub: true,
        },
        clipPath: "inset(0% 0% 100% 0%)",
        ease: "none"
    });

    // ABOUT 텍스트 애니메이션
    function splitWordsToSpans(selector) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(el => {
            if (el.classList.contains("animated-split")) return;

            const originalHTML = el.innerHTML;
            const newHTML = originalHTML.replace(/(\S+)/g, '<span class="split-word">$1</span>');

            el.innerHTML = newHTML;
            el.classList.add("animated-split");
        });
    }

    // 실행
    splitWordsToSpans("#section03 .desc");

    gsap.to("#section03 .desc .split-word", {
        opacity: 1,
        stagger: 0.02,
        scrollTrigger: {
            trigger: "#section03",
            start: "top 65%",
            end: "top 20%",
            scrub: 1.5,
            // markers: true
        }
    });

    // FEATURED WORKS 애니메이션
    const thumb = gsap.timeline({
        scrollTrigger: {
            trigger: ".works-thumb",
            start: "0% 80%",
            end: "100% 60%",
            scrub: 0,
        },
    });

    thumb.to(".viewTitle-up", { x: 0 }, 'a')
    thumb.to(".viewTitle-down", { x: 0 }, 'a')

    const works = gsap.timeline({
        scrollTrigger: {
            trigger: ".works .flex-area",
            start: "0% 100%",
            end: "+=900",
            scrub: 0,
        },
    });

    works.to(".works .right .works-card", {
        x: 0,
        stagger: 0.5
    });

    // --- 카드 호버 시 프리뷰 이미지 마우스 추적 ---
    const preview = document.querySelector('.cursor-preview');

    const xSetter = gsap.quickSetter(preview, "x", "px");
    const ySetter = gsap.quickSetter(preview, "y", "px");

    document.querySelectorAll('.works-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            const imgPath = card.dataset.preview;
            preview.style.backgroundImage = `url(${imgPath})`;
            gsap.to(preview, { opacity: 1, duration: 0.3, overwrite: "auto" });
        });

        card.addEventListener('mousemove', (e) => {
            xSetter(e.clientX);
            ySetter(e.clientY);
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(preview, { opacity: 0, duration: 0.3, overwrite: "auto" });
        });
    });

    // MY APPROACH 애니메이션
    const sect05 = gsap.timeline({
        scrollTrigger: {
            trigger: "#section05",
            start: "0% 50%",
            end: "100% 100%",
            scrub: 0,
        },
    });

    sect05.to("#section05 .right .accordion-text", {
        x: 0,
        opacity: 1,
        stagger: 0.5,
    })

    // 좌측 카테고리 강조 효과
    const categories = document.querySelectorAll(".service-category");

    document.querySelectorAll(".accordion-item").forEach((item, idx) => {
        ScrollTrigger.create({
            trigger: item,
            start: "top center",
            end: "bottom center",
            onToggle: ({ isActive }) => {
                if (isActive) {
                    categories.forEach(el => el.classList.remove("is-active"));
                    if (categories[idx]) {
                        categories[idx].classList.add("is-active");
                    }
                }
            }
        });
    });

    // 타이틀 블러 효과
    document.querySelectorAll('.service-title').forEach(title => {
        title.innerHTML = title.textContent.replace(/(\S)/g, '<span class="service-title-char">$1</span>');

        const chars = title.querySelectorAll('.service-title-char');

        gsap.fromTo(chars,
            {
                opacity: 0,
                filter: "blur(5px)",
            },
            {
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
                duration: 0.8,
                stagger: 0.04,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: title,
                    start: "top 80%",
                    toggleActions: "play none none reset",
                }
            }
        );
    });

    // 아코디언 토글
    $('.accordion-item').click(function (e) {
        e.preventDefault();
        const $item = $(this).closest('.accordion-item');
        $('.accordion-item').not($item).removeClass('is-open');
        $item.toggleClass('is-open');
    });

})