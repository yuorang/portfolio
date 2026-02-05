$(function () {
    /* Lenis */
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    /*  2. 커스텀 커서 (Custom Cursor) - 1024px 이상 데스크탑에서만 동작 / 특정 섹션 진입 시 색상 반전(Invert) 처리 */
    const cursor = document.querySelector('.custom-cursor');

    if (cursor) {
        gsap.set(cursor, { xPercent: -50, yPercent: -50 });
        let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

        // 마우스 움직임 감지 및 좌표 업데이트
        document.addEventListener('mousemove', (e) => {
            if (window.innerWidth >= 1024) {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
                handleCursorInvert(); // 반전 체크 실행
            }
        });

        // 커서 추적 애니메이션 (GSAP Ticker)
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

        // 화면 출입 시 커서 투명도 조절
        document.addEventListener('mouseleave', () => {
            if (window.innerWidth >= 1024) gsap.to(cursor, { autoAlpha: 0, duration: 0.2 });
        });
        document.addEventListener('mouseenter', () => {
            if (window.innerWidth >= 1024) gsap.to(cursor, { autoAlpha: 1, duration: 0.2 });
        });

        // 작품 링크 호버 시 기본 커서 숨김 처리
        document.querySelectorAll(".works-link").forEach(link => {
            link.addEventListener("mouseenter", () => {
                if (window.innerWidth >= 1024) gsap.to(cursor, { autoAlpha: 0, duration: 0.2 });
            });
            link.addEventListener("mouseleave", () => {
                if (window.innerWidth >= 1024) gsap.to(cursor, { autoAlpha: 1, duration: 0.2 });
            });
        });

        // 커서 색상 반전(Invert) 함수
        function handleCursorInvert() {
            if (window.innerWidth < 1024) {
                gsap.set(cursor, { display: 'none', autoAlpha: 0 });
                return;
            } else {
                gsap.set(cursor, { display: 'block' });
            }

            const scrollY = window.scrollY || window.pageYOffset;
            const cursorY = mouse.y + scrollY;
            const cursorX = mouse.x;
            let invert = false;

            // 반전 체크 구간 설정
            const header = document.getElementById('header');
            const mainVisual = document.querySelector('.main-visual');
            const section03 = document.getElementById('section03');
            const section05 = document.getElementById('section05');
            const footer = document.querySelector('footer');
            const heroFooter = document.querySelector('.main-visual .hero-footer');

            // 예외: 히어로 푸터 영역에서는 반전 안함
            if (heroFooter && isMouseInElement(heroFooter, cursorX, mouse.y)) {
                cursor.style.filter = '';
                return;
            }

            // 헤더 ~ 메인비주얼 구간 반전
            const headerPos = getAbsPosAndHeight(header);
            const mainVisualPos = getAbsPosAndHeight(mainVisual);
            if (headerPos && mainVisualPos && cursorY >= headerPos.top && cursorY <= mainVisualPos.bottom) invert = true;

            // 섹션 03 구간 반전
            const section03Pos = getAbsPosAndHeight(section03);
            if (section03Pos && cursorY >= section03Pos.top && cursorY <= section03Pos.bottom) invert = true;

            // 섹션 05 ~ 푸터 끝까지 반전
            const section05Pos = getAbsPosAndHeight(section05);
            if (section05Pos) {
                let footerEnd = footer ? getAbsPosAndHeight(footer).bottom : section05Pos.bottom;
                if (cursorY >= section05Pos.top && cursorY <= footerEnd) invert = true;
            }

            cursor.style.filter = invert ? 'invert(1)' : '';
        }

        // 반전 체크용 위치 계산 보조 함수
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
        handleCursorInvert(); // 초기 로드 시 1회 실행
    }

    /* 3. 인트로 랜딩 애니메이션 (Intro Animation) - 애니메이션 진행 중 전체 스크롤 차단 */
    gsap.registerPlugin(ScrollTrigger);

    // 스크롤 차단 설정
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";

    function preventScroll(e) { e.preventDefault(); }
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });

    const landing = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: function () {
            // 애니메이션 완료 후 스크롤 복구
            document.body.style.overflow = "";
            document.body.style.height = "";
            document.body.style.position = "";
            document.body.style.width = "";
            window.removeEventListener('wheel', preventScroll);
            window.removeEventListener('touchmove', preventScroll);
        }
    });

    landing.to({}, { duration: 0.4 })
        .to(".intro-title .text", { x: 0, opacity: 1, duration: 1, stagger: 0.2 })
        .to(".intro-title .text", { x: -80, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.in" })
        .to(".slide-bg01", { y: "-100%", duration: 1, ease: "power4.inOut" })
        .to(".slide-bg02", { y: "-100%", duration: 1.5, ease: "power4.inOut" }, "-=0.7")
        .set(".landing-intro", { display: "none" });

    /* 4. 헤더 및 모바일 메뉴 (Header & Mobile Nav) */
    $('.hamburger').click(function (e) {
        e.preventDefault();
        $('.nav-mobile-overlay').toggleClass('show');
        $(this).toggleClass('active');
        $('body').css('overflow', $('.nav-mobile-overlay').hasClass('show') ? 'hidden' : 'auto');
    });

    $('.mo-menu-link').click(function () {
        $('.nav-mobile-overlay').removeClass('show');
        $('.hamburger').removeClass('active');
        $('body').css('overflow', 'auto');
    });

    /* 5. Section 03 (About) - 텍스트 쪼개기 애니메이션 */
    function splitWordsToSpans(selector) {
        const el = document.querySelector(selector);
        if (!el || el.classList.contains("animated-split")) return;

        const originalText = el.innerText.trim();
        el.setAttribute("aria-label", originalText);
        el.setAttribute("role", "text");

        let html = "";
        el.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const words = node.textContent.trim().split(/\s+/);
                words.forEach((word, idx) => {
                    if (word.length > 0) {
                        html += `<span class="split-word" style="display:inline-block; white-space:pre;" aria-hidden="true">${word}${idx !== words.length - 1 ? " " : ""}</span>`;
                    }
                });
            } else if (node.nodeName === "BR") {
                html += "<br>";
            } else {
                html += node.outerHTML;
            }
        });
        el.innerHTML = html;
        el.classList.add("animated-split");
    }

    splitWordsToSpans("#section03 h2");
    document.querySelectorAll("#section03 .desc").forEach((_, i) => splitWordsToSpans(`#section03 .desc:nth-of-type(${i + 1})`));

    gsap.set("#section03 h2 .split-word", { y: 40, opacity: 0 });
    gsap.set("#section03 .desc .split-word", { y: 0, opacity: 0.2 });

    gsap.timeline({
        scrollTrigger: {
            trigger: "#section03",
            start: "top 40%",
            end: "bottom 50%",
            scrub: 1,
        }
    })
        .to("#section03 h2 .split-word", { y: 0, opacity: 1, stagger: 0.06, duration: 1 }, 0)
        .to("#section03 .desc .split-word", { opacity: 1, stagger: 0.035, duration: 0.8 }, ">-0.3");

    /* 6. Section 04 (Selected Works) - 다크 모드 배경 전환 및 작품 등장 애니메이션 */
    ScrollTrigger.create({
        trigger: ".works",
        start: "0% 80%",
        endTrigger: "#section05",
        end: "0% 60%",
        toggleClass: { targets: "body", className: "dark" },
    });

    const thumb = gsap.timeline({
        scrollTrigger: {
            trigger: ".works-thumb",
            start: "0% 80%",
            end: "100% 60%",
            scrub: 0,
        },
    });
    thumb.to(".viewTitle-up, .viewTitle-down", { x: 0 });

    // 작품 리스트(왼쪽) 텍스트 애니메이션
    document.querySelectorAll('.works .left .works-link').forEach(link => {
        if (link.classList.contains('words-split')) return;
        const html = link.innerHTML.replace(/(<[^>]*>)/g, '\u200B$1\u200B');
        let result = '';
        html.split(/(\u200B[^]*?\u200B)/g).forEach(part => {
            if (part.startsWith('\u200B<')) {
                result += part.replace(/\u200B/g, '');
            } else {
                result += part.split(/(\s+)/).map(w =>
                    w.trim() ? `<span class="word" style="display:inline-block; opacity:0; transform:translateY(32px)">${w}</span>` : w
                ).join('');
            }
        });
        link.innerHTML = result;
        link.classList.add('words-split');
    });

    gsap.timeline({
        scrollTrigger: {
            trigger: ".works .flex-area",
            start: "0% 100%",
            end: "+=900",
            scrub: 0
        }
    }).to('.works .left .works-link .word', {
        opacity: 1, y: 0, stagger: 0.09, duration: 0.8, ease: "power3.out"
    });

    // 작품 카드(오른쪽) 카드 등장
    gsap.timeline({
        scrollTrigger: {
            trigger: ".works .flex-area",
            start: "0% 100%",
            end: "+=900",
            scrub: 0,
        },
    }).to(".works .right .works-card", { x: 0, stagger: 0.5 });

    // 카드 호버 시 썸네일 이미지 마우스 추적 (Desktop 전용)
    if (window.innerWidth > 1024) {
        document.querySelectorAll('.works .right .works-card').forEach((card) => {
            const img = card.querySelector('.item-cursor_img01, .item-cursor_img02, .item-cursor_img03, .item-cursor_img04');
            if (!img) return;

            gsap.set(img, { opacity: 0, x: 0, y: 0 });

            function moveImg(e) {
                gsap.to(img, {
                    x: e.offsetX,
                    y: e.offsetY,
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

            card.addEventListener("mouseleave", () => {
                gsap.to(img, { opacity: 0, duration: 0.18, overwrite: 'auto' });
                window.removeEventListener("mousemove", moveImg);
            });
        });
    }

    /* 7. 텍스트 효과 (Blur Reveal) - brand-statement 및 service-title 에 적용 */
    function applyBlurReveal(selector, trigger) {
        document.querySelectorAll(selector).forEach(el => {
            const text = el.innerText.trim();
            el.setAttribute("aria-label", text);
            el.setAttribute("role", "text");

            el.innerHTML = [...text].map(char => {
                const content = char === ' ' ? '&nbsp;' : char;
                return `<span class="blur-char" aria-hidden="true" style="opacity:0;filter:blur(5px);display:inline-block">${content}</span>`;
            }).join('');

            gsap.fromTo(el.querySelectorAll('.blur-char'),
                { opacity: 0, filter: 'blur(5px)' },
                {
                    opacity: 1,
                    filter: 'blur(0px)',
                    duration: 0.65,
                    stagger: 0.05,
                    scrollTrigger: {
                        trigger: trigger || el,
                        start: "top 80%",
                        toggleActions: "play reverse play reverse",
                    }
                }
            );
        });
    }

    applyBlurReveal('.brand-statement');
    applyBlurReveal('.service-title', '#section05');

    /* 8. Section 05 (My Approach) - 아코디언 및 카테고리 하이라이트 */
    const sect05 = gsap.timeline({
        scrollTrigger: {
            trigger: "#section05",
            start: "0% 50%",
            end: "100% 100%",
            scrub: 0,
        },
    });
    sect05.to("#section05 .right .accordion-text", { x: 0, opacity: 1, stagger: 0.5 });

    // 왼쪽 카테고리 스크롤 하이라이트
    const serviceCategories = document.querySelectorAll("#section05 .left .service-category");
    serviceCategories.forEach((el) => { el.style.opacity = 0.5; });

    document.querySelectorAll("#section05 .arcodien-list .accordion-item").forEach((item, idx) => {
        ScrollTrigger.create({
            trigger: item,
            start: "top top",
            onEnter: () => updateCategory(idx),
            onEnterBack: () => updateCategory(idx),
        });
    });

    function updateCategory(idx) {
        serviceCategories.forEach((el, i) => { el.style.opacity = (i <= idx) ? 1 : 0.5; });
    }

    // 아코디언 클릭 이벤트
    $('.accordion-item').click(function () {
        const $this = $(this);
        $('.accordion-item').not($this).removeClass('is-open').find('.top').attr('aria-expanded', 'false');
        const isOpen = $this.toggleClass('is-open').hasClass('is-open');
        $this.find('.top').attr('aria-expanded', isOpen ? 'true' : 'false');
    });

    /* 9. Footer - 스포트라이트 효과 (Spotlight)*/
    (function () {
        const footerTitle = document.querySelector('.footer-title p');
        const footerContainer = document.querySelector('.footer-title');
        if (!footerTitle) return;

        let fillOverlay = null;

        function initSpotlight() {
            if (fillOverlay || window.innerWidth < 1024) return;
            footerContainer.style.position = 'relative';
            footerTitle.style.webkitTextStroke = '1px #fff';
            footerTitle.style.webkitTextFillColor = 'transparent';

            fillOverlay = document.createElement('span');
            fillOverlay.innerText = footerTitle.innerText;
            fillOverlay.className = 'footer-title-fill-overlay';

            Object.assign(fillOverlay.style, {
                position: 'absolute', left: '0', top: '0', width: '100%', height: '100%',
                color: '#b3ec11', WebkitTextFillColor: '#b3ec11', opacity: '0',
                pointerEvents: 'none', transition: 'opacity 0.2s ease', zIndex: '2'
            });

            footerTitle.appendChild(fillOverlay);
            footerTitle.addEventListener('mouseenter', (e) => {
                fillOverlay.style.opacity = '1';
                updateSpotlight(e);
            });
            footerTitle.addEventListener('mousemove', updateSpotlight);
            footerTitle.addEventListener('mouseleave', () => { fillOverlay.style.opacity = '0'; });
        }

        function updateSpotlight(e) {
            if (window.innerWidth < 1024 || !fillOverlay) return;
            const rect = footerTitle.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const mask = `radial-gradient(circle at ${x}px ${y}px, #fff 80px, transparent 160px)`;
            fillOverlay.style.maskImage = mask;
            fillOverlay.style.WebkitMaskImage = mask;
        }

        initSpotlight();
        window.addEventListener('resize', initSpotlight);
    })();

    /* 10. 상단 이동 버튼 (Back to Top) */
    const backToTopBtn = document.querySelector('.backToTop');
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        const isVisible = window.scrollY > 300;
        backToTopBtn.style.opacity = isVisible ? '1' : '0';
        backToTopBtn.style.pointerEvents = isVisible ? 'auto' : 'none';
    });
});