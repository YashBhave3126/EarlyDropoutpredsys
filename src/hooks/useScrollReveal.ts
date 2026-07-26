/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * useScrollReveal
 *
 * Scans the given container for elements marked with data-reveal
 * attributes and animates them into view with GSAP + ScrollTrigger
 * as the user scrolls the page.
 *
 * Supported markers:
 *  - [data-reveal]                 -> fades/slides a single text/heading block up into place
 *  - [data-reveal="fade"]          -> plain fade in (no vertical movement) e.g. for badges/labels
 *  - [data-reveal-words]           -> wraps a headline built with <SplitWords>; each inner
 *                                     [data-word] span masks/rises into place, staggered
 *  - [data-reveal-cards]           -> a grid/row wrapper; its direct [data-reveal-card] children
 *                                     fade/slide/scale in with a staggered delay and alternating
 *                                     left/right entrance for a more dynamic "converging" feel
 *  - [data-reveal-icon]            -> a small icon badge that pops/rotates into place (back-ease)
 *  - [data-counter="92"]           -> animates a number counting up from 0 to the target value
 *    [data-counter-suffix="%"]        once the element scrolls into view (suffix appended, e.g. "%")
 *  - [data-parallax="0.2"]         -> subtle vertical parallax drift tied to scroll position,
 *                                     useful for background blur/glow shapes
 */
export function useScrollReveal(containerRef: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // --- Text / heading reveals -------------------------------------------------
      const textEls = gsap.utils.toArray<HTMLElement>("[data-reveal]", containerRef.current!);
      textEls.forEach((el) => {
        const mode = el.getAttribute("data-reveal");
        const fromVars = mode === "fade" ? { opacity: 0 } : { opacity: 0, y: 44 };

        gsap.fromTo(el, fromVars, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // --- Word-by-word headline mask reveal ---------------------------------------
      const wordGroups = gsap.utils.toArray<HTMLElement>("[data-reveal-words]", containerRef.current!);
      wordGroups.forEach((group) => {
        const words = group.querySelectorAll<HTMLElement>("[data-word]");
        if (!words.length) return;

        gsap.fromTo(
          words,
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.045,
            ease: "power3.out",
            scrollTrigger: {
              trigger: group,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // --- Staggered card grid reveals (alternating left/right entrance) ----------
      const cardGroups = gsap.utils.toArray<HTMLElement>("[data-reveal-cards]", containerRef.current!);
      cardGroups.forEach((group) => {
        const cards = group.querySelectorAll<HTMLElement>("[data-reveal-card]");
        if (!cards.length) return;

        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 56,
            scale: 0.94,
            x: (i: number) => (i % 2 === 0 ? -26 : 26),
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.14,
            ease: "power3.out",
            scrollTrigger: {
              trigger: group,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // --- Icon badge pop-in --------------------------------------------------------
      const icons = gsap.utils.toArray<HTMLElement>("[data-reveal-icon]", containerRef.current!);
      icons.forEach((icon) => {
        gsap.fromTo(
          icon,
          { opacity: 0, scale: 0.3, rotate: -18 },
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.65,
            ease: "back.out(1.8)",
            scrollTrigger: {
              trigger: icon,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // --- Animated number counters -------------------------------------------------
      const counters = gsap.utils.toArray<HTMLElement>("[data-counter]", containerRef.current!);
      counters.forEach((el) => {
        const target = parseFloat(el.getAttribute("data-counter") || "0");
        const suffix = el.getAttribute("data-counter-suffix") || "";
        if (Number.isNaN(target)) return;
        const proxy = { val: 0 };

        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.to(proxy, {
              val: target,
              duration: 1.5,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = `${Math.round(proxy.val)}${suffix}`;
              },
            });
          },
        });
      });

      // --- Subtle parallax drift (background blobs, glows, decorative shapes) -----
      const parallaxEls = gsap.utils.toArray<HTMLElement>("[data-parallax]", containerRef.current!);
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.getAttribute("data-parallax") || "0.2");
        const scrollHost = el.closest("section") || (containerRef.current as HTMLElement);
        gsap.to(el, {
          yPercent: speed * 100,
          ease: "none",
          scrollTrigger: {
            trigger: scrollHost,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Recalculate trigger positions once layout settles (images, fonts, etc.)
      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

