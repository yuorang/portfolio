$(function () {
    // --- 부드러운 스크롤 (Lenis) 설정 ---
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // --- 커스텀 마우스 커서 설정 ---
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

        // 마우스 출입 및 호버 처리 (1024px 이상 가드 추가)
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

        // 커서 색상 반전 처리 함수
        function handleCursorInvert() {
            // 1024px 미만(모바일/태블릿)이면 커서 강제 숨김 및 중단
            if (window.innerWidth < 1024) {
                gsap.set(cursor, { display: 'none', autoAlpha: 0 });
                return;
            } else {
                // 1024px 이상일 때만 보이게 설정
                gsap.set(cursor, { display: 'block' });
            }

            const scrollY = window.scrollY || window.pageYOffset;
            const cursorY = mouse.y + scrollY;
            const cursorX = mouse.x;

            let invert = false;

            // 색상반전 구간 관련 DOM
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

        // 보조 함수: 절대 위치 및 높이 계산
        function getAbsPosAndHeight(el) {
            if (!el) return null;
            const rect = el.getBoundingClientRect();
            return { top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY };
        }

        // 보조 함수: 특정 요소 내 마우스 존재 여부 확인
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

    // --- 섹션 04 ~ 05 구간 배경색 반전 처리 ---
    ScrollTrigger.create({
        trigger: ".works",
        start: "0% 80%",
        endTrigger: "#section05",
        end: "0% 60%",
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

    // h2와 모든 p.desc를 대상으로 실행
    splitWordsToSpans("#section03 h2");
    splitWordsToSpans("#section03 .desc"); // id 대신 클래스로 모든 p태그 선택

    // 초기 세팅 (p태그가 여러 개이므로 전체 선택자 사용)
    gsap.set("#section03 h2 .split-word", { y: 40, opacity: 0 });
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
        .to("#section03 h2 .split-word", {
            y: 0,
            opacity: 1,
            stagger: 0.06,
            duration: 1,
            ease: "power3.out"
        }, 0)
        .to("#section03 .desc .split-word", { // 모든 p.desc의 단어들에 애니메이션 적용
            opacity: 1,
            stagger: 0.01, // 단어가 많으므로 stagger 값을 약간 조절해서 자연스럽게 설정
            duration: 0.8,
            ease: "power3.out"
        }, ">-0.3");


    // --- 섹션 04: SELECTED WORKS 애니메이션 ---
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
    document.querySelectorAll('.works .right .works-card').forEach((card) => {
        const img = card.querySelector('.item-cursor_img01, .item-cursor_img02, .item-cursor_img03, .item-cursor_img04');
        if (!img) return;

        gsap.set(img, { opacity: 0, x: 0, y: 0 });

        function moveImg(e) {
            const mouseX = e.offsetX;
            const mouseY = e.offsetY;

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
            moveImg(e);
            window.addEventListener("mousemove", moveImg);
        });

        card.addEventListener("mouseleave", (e) => {
            gsap.to(img, { opacity: 0, duration: 0.18, overwrite: 'auto' });
            window.removeEventListener("mousemove", moveImg);
        });
    });

    // --- 브랜드 스테이트먼트: 글자별 블러 등장 효과 ---
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
            { opacity: 0, filter: 'blur(5px)' },
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
                    toggleActions: "play none none reset",
                    once: false,
                }
            }
        );
    });

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

    // 서브텍스트 단어별 등장 효과
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
            stagger: { amount: 0.3, each: 0.020 },
            ease: "cubic-bezier(0.32, 0.72, 0, 1)",
            scrollTrigger: {
                trigger: desc,
                start: "top 60%",
                toggleActions: "play reverse play reverse",
            }
        });
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


    // --- 푸터 스포트라이트 효과 (Desktop 전용) ---
    (function () {
        const footerTitle = document.querySelector('.footer-title p');
        const footerContainer = document.querySelector('.footer-title');
        if (!footerTitle) return;

        let fillOverlay = null;

        function initSpotlight() {
            if (fillOverlay || window.innerWidth < 1024) return;

            footerContainer.style.position = 'relative';
            footerTitle.style.webkitTextFillColor = 'transparent';
            footerTitle.style.webkitTextStroke = '1px #fff';

            fillOverlay = document.createElement('span');
            fillOverlay.innerText = footerTitle.innerText;
            fillOverlay.className = 'footer-title-fill-overlay';

            Object.assign(fillOverlay.style, {
                position: 'absolute', left: '0', top: '0', width: '100%', height: '100%',
                color: '#b3ec11', font: 'inherit', display: 'block', pointerEvents: 'none',
                zIndex: '2', WebkitTextFillColor: '#fff', WebkitTextStroke: '0px',
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

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024) initSpotlight();
        });

        initSpotlight();
    })();

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