"use client";
import { useEffect } from "react";

export default function AnimationProvider() {
  useEffect(() => {
    // Reveal on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("active");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    const attach = () => {
      document.querySelectorAll(".reveal").forEach(el => {
        observer.observe(el);
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.95) {
          (el as HTMLElement).classList.add("active");
        }
      });
    };

    attach();
    const timer = setTimeout(attach, 200);

    // Mouse parallax
    const onMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;

      document.querySelectorAll(".parallax-el[data-speed]").forEach(el => {
        const speed = parseFloat((el as HTMLElement).dataset.speed ?? "0.1");
        (el as HTMLElement).style.transform =
          `translate(${x * speed * 100}px, ${y * speed * 100}px)`;
      });
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return null;
}
