$(function () {
    // --- 부드러운 스크롤 (Lenis) 설정 ---
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // --- 커스텀 마우스 커서 설정 ---
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
    // --- 섹션 04 ~ 05 구간 배경색 반전 처리 ---
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


    // --- 랜딩 인트로 애니메이션 ---
    gsap.registerPlugin(ScrollTrigger);

    // 최초 진입시 모든 방식의 스크롤 차단
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = "0";
    document.body.style.left = "0";

    function preventScroll(e) {
        e.preventDefault();
    }
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', function (e) {
        // 스페이스, 방향키, PgUp, PgDn, Home, End 키 차단
        if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
            e.preventDefault();
        }
    }, { passive: false });

    const landing = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: function () {
            // 애니메이션 종료 후 스크롤 다시 허용
            document.body.style.overflow = "";
            document.body.style.height = "";
            document.body.style.position = "";
            document.body.style.width = "";
            document.body.style.top = "";
            document.body.style.left = "";

            window.removeEventListener('wheel', preventScroll, { passive: false });
            window.removeEventListener('touchmove', preventScroll, { passive: false });
        }
    });

    // 랜딩 시퀀스 실행
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

    // 헤더 스크롤에 따른 숨김처리
    let lastScroll = 0;
    const header = document.querySelector("header");

    window.addEventListener("scroll", () => {
        let currentScroll = window.pageYOffset;

        if (currentScroll > lastScroll) {
            // 스크롤 내림
            header.classList.add("hide");
        } else {
            // 스크롤 올림
            header.classList.remove("hide");
        }

        lastScroll = currentScroll;
    });
    // --- 헤더 네비게이션 및 햄버거 메뉴 ---
    $(function () {
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
    });

    //모션텍스트
    const motionTexts = document.querySelectorAll(".motionText");
    const section03 = document.querySelector("#section03");

    window.addEventListener("scroll", () => {
        const sectionRect = section03.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;
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

    // visual_vedio

    gsap.registerPlugin(ScrollTrigger);

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

    // --- 섹션 03: ABOUT 텍스트 애니메이션 ---
    function splitWordsToSpans(selector) {
        // querySelector 대신 querySelectorAll을 사용하여 모든 p태그 대응
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return;

        elements.forEach(el => {
            if (el.classList.contains("animated-split")) return;

            let html = "";
            // trim() 후 innerHTML을 사용하여 내부 <br> 태그를 유지하며 쪼갬
            el.innerHTML.trim().split(/\s+/).forEach((word, idx, arr) => {
                // <br> 태그가 포함된 단어거나 <br> 자체일 경우 처리
                if (word.includes("<br")) {
                    html += "<br> ";
                } else {
                    html += `<span class="split-word" style="display:inline-block; white-space:pre;">${word}${idx !== arr.length - 1 ? " " : ""}</span>`;
                }
            });
            el.innerHTML = html;
            el.classList.add("animated-split");
        });
    }

    // p.desc를 대상으로 실행
    splitWordsToSpans("#section03 .desc");
    // id 대신 클래스로 모든 p태그 선택

    // 초기 세팅 (p태그가 여러 개이므로 전체 선택자 사용)
    gsap.set("#section03 .desc .split-word", { y: 0, opacity: 0.2 });

    // 스크롤 시 텍스트 순차 등장 (Scrub 적용)
    gsap.timeline({
        scrollTrigger: {
            trigger: "#section03",
            start: "top 40%",
            end: "bottom 50%",
            scrub: 1,
        }
    })
        .to("#section03 .desc .split-word", {
            // 모든 p.desc의 단어들에 애니메이션 적용
            opacity: 1,
            stagger: 0.01,
            // 단어가 많으므로 stagger 값을 약간 조절해서 자연스럽게 설정
            duration: 0.8,
            ease: "power3.out"
        }, ">-0.3");


    // --- 섹션 04: FEATURED WORKS 애니메이션 ---
    const thumb = gsap.timeline({
        scrollTrigger: {
            trigger: ".works-thumb",
            start: "0% 80%",
            end: "100% 60%",
            scrub: 0,
        },
    });

    // 타이틀 수평 이동
    thumb.to(".viewTitle-up", { x: 0 }, 'a')
    thumb.to(".viewTitle-down", { x: 0 }, 'a')

    // 우측 카드 등장 애니메이션
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

    // 마우스 호버가 가능한 기기(PC)에서만 실행
    if (window.matchMedia("(hover: hover)").matches) {
        document.querySelectorAll('.works-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                const imgPath = card.dataset.preview;
                preview.style.backgroundImage = `url(${imgPath})`;
                gsap.to(preview, { opacity: 1, duration: 0.2 });
            });

            card.addEventListener('mousemove', (e) => {
                gsap.to(preview, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.2,
                    ease: "power2.out"
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(preview, { opacity: 0, duration: 0.2 });
            });
        });
    }

    // --- 섹션 05: MY APPROACH 애니메이션 ---
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

    // 좌측 카테고리 강조 효과 (아코디언 위치에 따라)
    const serviceCategories = document.querySelectorAll("#section05 .left .service-category");
    const accordionItems = document.querySelectorAll("#section05 .arcodien-list .accordion-item");

    serviceCategories.forEach((el) => { el.style.opacity = 0.5; });

    accordionItems.forEach((item, idx) => {
        ScrollTrigger.create({
            trigger: item,
            start: "top top",
            onEnter: () => {
                serviceCategories.forEach((el, i) => {
                    el.style.opacity = (i <= idx) ? 1 : 0.5;
                });
            },
            onEnterBack: () => {
                serviceCategories.forEach((el, i) => {
                    el.style.opacity = (i <= idx) ? 1 : 0.5;
                });
            },
        });
    });

    // 타이틀 블러 효과
    document.querySelectorAll('.service-title').forEach(title => {
        const text = title.innerText.trim();
        title.innerHTML = [...text].map(char => {
            if (char === ' ') {
                return '<span class="service-title-char" style="opacity:0;filter:blur(5px);display:inline-block;">&nbsp;</span>';
            } else {
                return `<span class="service-title-char" style="opacity:0;filter:blur(5px);display:inline-block">${char}</span>`;
            }
        }).join('');

        const chars = title.querySelectorAll('.service-title-char');
        gsap.fromTo(chars,
            { opacity: 0, filter: "blur(5px)" },
            {
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.6,
                stagger: 0.05,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: "#section05",
                    start: "top 50%",
                    toggleActions: "play none none reset",
                }
            }
        );
    });

    // 아코디언 토글 기능
    $(function () {
        $('.accordion-item').click(function (e) {
            e.preventDefault();
            const $item = $(this).closest('.accordion-item');
            $('.accordion-item').not($item).removeClass('is-open');
            $item.toggleClass('is-open');
        });
    });

    // --- 상단 이동 버튼 (Back to Top) ---
    const backToTopBtn = document.querySelector('.backToTop');

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.pointerEvents = 'auto';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.pointerEvents = 'none';
        }
    });
})