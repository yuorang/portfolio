$(function () {
    // lenis
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // custom-cursor
    const cursor = document.querySelector('.custom-cursor');

    if (cursor) {
        gsap.set(cursor, {
            xPercent: -50,
            yPercent: -50
        });

        let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

        // 마우스 움직임 감지
        document.addEventListener('mousemove', (e) => {
            // 1024px 이상일 때만 좌표 업데이트 및 로직 실행
            if (window.innerWidth >= 1024) {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
                handleCursorInvert(); // 마우스 움직일 때만 반전 체크
            }
        });

        // GSAP ticker: 1024px 이상일 때만 추적 동작
        gsap.ticker.add(() => {
            if (window.innerWidth >= 1024) {
                gsap.to(cursor, {
                    x: mouse.x,
                    y: mouse.y,
                    duration: 0.16,
                    ease: 'power3.out',
                    overwrite: 'auto'
                });
            }
        });

        // 마우스 출입 및 호버 처리 (전부 1024px 이상 가드 추가)
        document.addEventListener('mouseleave', () => {
            if (window.innerWidth >= 1024) gsap.to(cursor, { autoAlpha: 0, duration: 0.2 });
        });
        document.addEventListener('mouseenter', () => {
            if (window.innerWidth >= 1024) gsap.to(cursor, { autoAlpha: 1, duration: 0.2 });
        });

        document.querySelectorAll(".works-link").forEach(link => {
            link.addEventListener("mouseenter", () => {
                if (window.innerWidth >= 1024) gsap.to(cursor, { autoAlpha: 0, duration: 0.2 });
            });
            link.addEventListener("mouseleave", () => {
                if (window.innerWidth >= 1024) gsap.to(cursor, { autoAlpha: 1, duration: 0.2 });
            });
        });

        // 반전 처리 함수
        function handleCursorInvert() {
            // 1024px 미만(모바일/태블릿)이면 커서 강제 숨김 및 중단
            if (window.innerWidth < 1024) {
                gsap.set(cursor, { display: 'none', autoAlpha: 0 });
                return;
            } else {
                // 1024px 이상일 때만 보이게 설정 (애니메이션 상태에 따라 autoAlpha는 별도 제어)
                gsap.set(cursor, { display: 'block' });
            }

            const scrollY = window.scrollY || window.pageYOffset;
            const cursorY = mouse.y + scrollY;
            const cursorX = mouse.x;

            let invert = false;

            // 색상반전 구간 관련 DOM (함수 내부에서 최신 상태 유지)
            const header = document.getElementById('header');
            const mainVisual = document.querySelector('.main-visual');
            const section03 = document.getElementById('section03');
            const section05 = document.getElementById('section05');
            const footer = document.querySelector('footer');
            const heroFooter = document.querySelector('.main-visual .hero-footer');

            if (heroFooter && isMouseInElement(heroFooter, cursorX, mouse.y)) {
                cursor.style.filter = '';
                return;
            }

            const headerPos = getAbsPosAndHeight(header);
            const mainVisualPos = getAbsPosAndHeight(mainVisual);
            if (headerPos && mainVisualPos) {
                if (cursorY >= headerPos.top && cursorY <= mainVisualPos.bottom) invert = true;
            }

            const section03Pos = getAbsPosAndHeight(section03);
            if (section03Pos && cursorY >= section03Pos.top && cursorY <= section03Pos.bottom) invert = true;

            const section05Pos = getAbsPosAndHeight(section05);
            if (section05Pos) {
                let footerEnd = footer ? getAbsPosAndHeight(footer).bottom : section05Pos.bottom;
                if (cursorY >= section05Pos.top && cursorY <= footerEnd) invert = true;
            }

            cursor.style.filter = invert ? 'invert(1)' : '';
        }

        // 보조 함수들
        function getAbsPosAndHeight(el) {
            if (!el) return null;
            const rect = el.getBoundingClientRect();
            return { top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY };
        }

        function isMouseInElement(el, mouseX, mouseY) {
            if (!el) return false;
            const rect = el.getBoundingClientRect();
            return (mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom);
        }

        window.addEventListener('scroll', handleCursorInvert);
        window.addEventListener('resize', handleCursorInvert);

        // 초기 실행
        handleCursorInvert();
    }

    // #section04 ~ #section05 구간까지 bgc 반전
    ScrollTrigger.create({
        trigger: ".works",
        start: "0% 80%",
        endTrigger: "#section05",
        end: "0% 60%",
        // markers: true,
        toggleClass: {
            targets: "body",
            className: "dark",
        },
    });


    // landing-intro
    gsap.registerPlugin(ScrollTrigger);

    // 최초 진입시 body 스크롤 완전히 막기 (키보드·터치·휠 등 모든 스크롤 차단)
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = "0";
    document.body.style.left = "0";

    // ? 스크롤 관련 이벤트 막기
    function preventScroll(e) {
        e.preventDefault();
    }
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', function (e) {
        // ? 스페이스, 방향키, PgUp, PgDn, Home, End
        if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
            e.preventDefault();
        }
    }, { passive: false });

    const landing = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: function () {
            // ? 애니메이션 끝나면 스크롤 다시 허용
            document.body.style.overflow = "";
            document.body.style.height = "";
            document.body.style.position = "";
            document.body.style.width = "";
            document.body.style.top = "";
            document.body.style.left = "";

            window.removeEventListener('wheel', preventScroll, { passive: false });
            window.removeEventListener('touchmove', preventScroll, { passive: false });
            // ? 키보드 이벤트는 remove 불가(익명), 무시(메모리 영향 無)
        }
    });
    // landing 애니메이션
    landing.to({}, { duration: 0.4 })

        .to(".intro-title .text", {
            x: 0,
            opacity: 1,
            duration: 1,
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

    // header
    $(function () {
        $('.hamburger').click(function (e) {
            e.preventDefault();

            // ? 오버레이에 show 클래스 토글
            $('.nav-mobile-overlay').toggleClass('show');

            // ? 햄버거 버튼에 active 클래스 토글 (X자 변경용)
            $(this).toggleClass('active');

            // ? 메뉴가 열렸을 때 본문(body) 스크롤 막기 (매우 중요)
            if ($('.nav-mobile-overlay').hasClass('show')) {
                $('body').css('overflow', 'hidden');
            } else {
                $('body').css('overflow', 'auto');
            }
        });

        // ? 추가: 메뉴 링크를 클릭했을 때 메뉴가 닫히도록 설정
        $('.nav-mobile .menu-link').click(function () {
            $('.nav-mobile-overlay').removeClass('show');
            $('.hamburger').removeClass('active');
            $('body').css('overflow', 'auto');
        });
    });


    // section03 ABOUT
    function splitWordsToSpans(selector) {
        const el = document.querySelector(selector);
        if (!el) return;
        // ? 이미 처리되었으면 중복 작업하지 않음
        if (el.classList.contains("animated-split")) return;

        let html = "";
        // ? <br> 태그는 innerHTML로 바로 문자열화되어 들어옴 - 이 부분은 태그이므로 별도 처리
        // ? split한 뒤 <br>이 문자로 들어가면 태그로 바꿔줌
        el.innerHTML.trim().split(/\s+/).forEach((word, idx, arr) => {
            if (
                word === "<br>" ||
                word === "<br/>" ||
                word === "<br>" ||
                word === "<br />"
            ) {
                html += "<br>";
            } else {
                html += `<span class="split-word" style="display:inline-block; white-space:pre;">${word}${idx !== arr.length - 1 ? " " : ""}</span>`;
            }
        });
        el.innerHTML = html;
        el.classList.add("animated-split");
    }

    // ? h2, p를 각각 처리
    splitWordsToSpans("#section03 h2");
    splitWordsToSpans("#section03 p");

    // ? h2는 y:40에서 올라옴, p는 y:0에서 opacity 0.2로 시작(스크롤 시 1이 됨)
    gsap.set("#section03 h2 .split-word", { y: 40, opacity: 0 });
    gsap.set("#section03 p .split-word", { y: 0, opacity: 0.2 });

    // ? h2, p를 동시에 트리거: h2 기준, scrub 적용(p reveal이 h2 타이틀 reveal과 진행이 같이)
    gsap.timeline({
        scrollTrigger: {
            trigger: "#section03",
            start: "top 40%",
            end: "bottom 50%",
            scrub: 1,
            // markers: true,
        }
    })
        .to("#section03 h2 .split-word", {
            y: 0,
            opacity: 1,
            stagger: 0.06,
            duration: 1,
            ease: "power3.out"
        }, 0)
        .to("#section03 p .split-word", {
            opacity: 1,
            stagger: 0.035,
            duration: 0.8,
            ease: "power3.out"
        }, ">-0.3");



    // section04 selected works
    const thumb = gsap.timeline({
        scrollTrigger: {
            trigger: ".works-thumb",
            start: "0% 80%",
            end: "100% 60%",
            scrub: 0,
            // markers: true
        },
    });
    // ? 타이틀 
    thumb.to(".viewTitle-up", {
        x: 0,
    }, 'a')
    thumb.to(".viewTitle-down", {
        x: 0,
    }, 'a')

    // ? 1. 단어 쪼개기: 각 .works-link 내부를 span.word로 wrap
    document.querySelectorAll('.works .left .works-link').forEach(link => {
        // ? 이미 한 번 쪼갠 것을 반복 호출시 덮어씌우지 않도록
        if (link.classList.contains('words-split')) return;
        const html = link.innerHTML
            .replace(/(<[^>]*>)/g, '\u200B$1\u200B'); // ? 태그 보존 위해 임시마킹
        // ? 태그 아닌 부분만 단어별로 쪼개기
        let result = '';
        html.split(/(\u200B[^]*?\u200B)/g).forEach(part => {
            if (part.startsWith('\u200B<')) {
                result += part.replace(/\u200B/g, '');
            } else {
                // ? 한글, 영어, 숫자 모두 단어기준 쪼갬
                result += part
                    .split(/(\s+)/).map(w =>
                        w.trim() ? `<span class="word" style="display:inline-block; opacity:0; transform:translateY(32px)">${w}</span>` : w
                    ).join('');
            }
        });
        link.innerHTML = result;
        link.classList.add('words-split');
    });

    // ? 2. 애니메이션: 단어별로 순차적으로 밑에서 올라오게
    const worksLeftWords = gsap.utils.toArray('.works .left .works-link .word');
    gsap.set(worksLeftWords, { opacity: 0, y: 32 }); // ? 초기값
    gsap.timeline({
        scrollTrigger: {
            trigger: ".works .flex-area",
            start: "0% 100%",
            // end: "100% 100%",
            end: "+=900",
            scrub: 0
            // markers: true
        }
    }).to(worksLeftWords, {
        opacity: 1,
        y: 0,
        stagger: 0.09,
        duration: 0.8,
        ease: "power3.out"
    }, 0);

    // ? 기존 오른쪽 카드 애니메이션도 유지
    const works = gsap.timeline({
        scrollTrigger: {
            trigger: ".works .flex-area",
            start: "0% 100%",
            end: "+=900",
            scrub: 0,
            // markers: true
        },
    });

    works.to(".works .right .works-card", {
        x: 0,
        stagger: 0.5
    });










    
    // works-card 각각에 직접 포함된 .item-cursor_img0*가 커서 따라다니기 (hover시만)
    document.querySelectorAll('.works .right .works-card').forEach((card) => {
        const img = card.querySelector('.item-cursor_img01, .item-cursor_img02, .item-cursor_img03, .item-cursor_img04');
        if (!img) return;

        // 초기에 숨기기, 위치 초기화(고정포지션따라)
        gsap.set(img, {
            opacity: 0,
            x: 0,
            y: 0
        });

        function moveImg(e) {
            // 마우스 좌표(화면 전체 기준)
            const mouseX = e.offsetX;
            const mouseY = e.offsetY;

            // fixed라서 viewport 기준으로 맞춤
            gsap.to(img, {
                x: mouseX,
                y: mouseY,
                duration: 0.21,
                ease: "power2.out",
                overwrite: "auto"
            });
        }

        card.addEventListener("mouseenter", (e) => {
            gsap.to(img, { opacity: 1, duration: 0.18, overwrite: 'auto', pointerEvents: 'none' });
            // 바로 위치 한번 갱신
            moveImg(e);
            window.addEventListener("mousemove", moveImg);
        });

        card.addEventListener("mouseleave", (e) => {
            gsap.to(img, { opacity: 0, duration: 0.18, overwrite: 'auto' });
            window.removeEventListener("mousemove", moveImg);
        });
    });













    // ? brand-statement 블러 텍스트 나타나기
    document.querySelectorAll('.brand-statement').forEach(statement => {
        const text = statement.textContent;
        statement.innerHTML = text.split('').map(char => {
            if (char === ' ') {
                return '<span class="text-char" style="opacity:0;filter:blur(5px);display:inline-block;width:0.6em">&nbsp;</span>';
            } else {
                return `<span class="text-char" style="opacity:0;filter:blur(5px);display:inline-block">${char}</span>`;
            }
        }).join('');

        const chars = statement.querySelectorAll('.text-char');
        gsap.fromTo(chars,
            {
                opacity: 0,
                filter: 'blur(5px)'
            },
            {
                opacity: 1,
                filter: 'blur(0px)',
                duration: 0.65,
                stagger: 0.05,
                ease: 'power2.out',
                delay: 0.2,
                scrollTrigger: {
                    trigger: statement,
                    start: "top 80%",
                    toggleActions: "play reverse play reverse", // ? repeat on scroll up/down
                    once: false,
                }
            }
        );
    });

    // section05 My Approach
    const sect05 = gsap.timeline({
        scrollTrigger: {
            trigger: "#section05",
            start: "0% 50%",
            end: "100% 100%",
            scrub: 0,
            // markers: true
        },
    });

    sect05.to("#section05 .right .accordion-text", {
        x: 0,
        opacity: 1,
        stagger: 0.5,
    })

    // ? service-category(p)들이 순차적으로(1→2→3→4) 밝아지며, 각 li가 뷰포트 맨 위에 도달할 때 실행됨
    const serviceCategories = document.querySelectorAll("#section05 .left .service-category");
    const accordionItems = document.querySelectorAll("#section05 .arcodien-list .accordion-item");

    // ? 초기 상태: 모두 0.5로
    serviceCategories.forEach((el) => {
        el.style.opacity = 0.5;
    });

    // ? 그냥 li에 도달할 때 실행되게
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
            // markers: true,
        });
    });
    // ? 타이틀 블러 텍스트 효과
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
                    toggleActions: "play reverse play reverse",
                    // markers: true
                }
            }
        );
    });
    // ? 서브텍스트 애니메이션
    document.querySelectorAll(".service-sub").forEach(desc => {
        if (desc.dataset.wordAnimated) return;
        desc.dataset.wordAnimated = "true";

        let html = desc.innerHTML;
        let temp = document.createElement("div");
        temp.innerHTML = html;
        let nodes = Array.from(temp.childNodes);

        let wrapped = '';
        nodes.forEach(node => {
            if (node.nodeType === 3) {
                let words = node.textContent.split(/(\s+)/);
                words.forEach(word => {
                    if (word.trim() === '') {
                        wrapped += word;
                    } else {
                        wrapped += `<span class="service-desc-word" style="display:inline-block;opacity:0;transform:translateY(24px);">${word}</span>`;
                    }
                });
            } else if (node.nodeType === 1 && node.tagName === "BR") {
                wrapped += "<br>";
            }
        });

        desc.innerHTML = wrapped;

        const words = desc.querySelectorAll(".service-desc-word");
        gsap.to(words, {
            opacity: 1,
            y: 0,
            duration: 0.22,
            stagger: {
                amount: 0.3, // ? 전체 애니메이션 길이 짧고, 약간 겹치듯 자연스럽게
                each: 0.020
            },
            ease: "cubic-bezier(0.32, 0.72, 0, 1)", // ? 더욱 부드러운 인터폴레이션
            scrollTrigger: {
                trigger: desc,
                start: "top 60%",
                toggleActions: "play reverse play reverse",
                // markers: true,
            }
        });
    });

    // ? 아코디언
    $(function () {
        // ? 아코디언 제목 클릭
        $('.accordion-item').click(function (e) {
            e.preventDefault();

            const $item = $(this).closest('.accordion-item');

            // ? 다른 항목 닫기
            $('.accordion-item').not($item).removeClass('is-open');

            // ? 클릭한 항목 토글
            $item.toggleClass('is-open');
        });
    });



    // footer
    (function () {
        const footerTitle = document.querySelector('.footer-title p');
        const footerContainer = document.querySelector('.footer-title');
        if (!footerTitle) return;

        let fillOverlay = null;

        function initSpotlight() {
            // 이미 생성되어 있다면 중단
            if (fillOverlay || window.innerWidth < 1024) return;

            footerContainer.style.position = 'relative';
            footerTitle.style.webkitTextFillColor = 'transparent';
            footerTitle.style.webkitTextStroke = '0.5px rgb(122, 161, 14)';

            fillOverlay = document.createElement('span');
            fillOverlay.innerText = footerTitle.innerText;
            fillOverlay.className = 'footer-title-fill-overlay';

            Object.assign(fillOverlay.style, {
                position: 'absolute', left: '0', top: '0', width: '100%', height: '100%',
                color: '#b3ec11', font: 'inherit', display: 'block', pointerEvents: 'none',
                zIndex: '2', WebkitTextFillColor: '#b3ec11', WebkitTextStroke: '0px',
                textAlign: 'inherit', whiteSpace: 'pre', opacity: '0',
                transition: 'opacity 0.2s ease'
            });

            footerTitle.appendChild(fillOverlay);

            footerTitle.addEventListener('mouseenter', showSpotlight);
            footerTitle.addEventListener('mousemove', updateSpotlight);
            footerTitle.addEventListener('mouseleave', hideSpotlight);
        }

        let isMouseInside = false;
        function moveSpotlight(e) {
            if (window.innerWidth < 1024 || !fillOverlay) return;
            const rect = footerTitle.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const maskVal = `radial-gradient(circle at ${x}px ${y}px, #fff 80px, transparent 160px)`;
            fillOverlay.style.maskImage = maskVal;
            fillOverlay.style.WebkitMaskImage = maskVal;
        }

        function showSpotlight(e) { isMouseInside = true; moveSpotlight(e); if (fillOverlay) fillOverlay.style.opacity = '1'; }
        function updateSpotlight(e) { if (isMouseInside) requestAnimationFrame(() => moveSpotlight(e)); }
        function hideSpotlight() { isMouseInside = false; if (fillOverlay) fillOverlay.style.opacity = '0'; }

        // 리사이즈 시 체크
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024) {
                initSpotlight();
            }
        });

        initSpotlight();
    })();

    // ? 버튼 요소 가져오기
    const backToTopBtn = document.querySelector('.backToTop');

    // ? 버튼 클릭 시 상단으로 이동
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    // ? 스크롤을 어느 정도 내렸을 때만 버튼 보이게 하기
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