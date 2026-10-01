import { useEffect } from "react";

export function ScrollRoot() {
  useEffect(() => {
    const root = document.documentElement;
    let scrollFrame = 0;
    let mouseFrame = 0;

    const applyScroll = () => {
      const y = window.scrollY;
      const max = Math.max(1, root.scrollHeight - window.innerHeight);
      root.style.setProperty("--scrolly", String(y));
      root.style.setProperty("--scroll", String(y / max));
    };

    const applyMouse = (clientX: number, clientY: number) => {
      // Calculate mouse position as percentage (0-100) of the viewport
      const x = (clientX / window.innerWidth) * 100;
      const y = (clientY / window.innerHeight) * 100;
      root.style.setProperty("--mouseX", String(x));
      root.style.setProperty("--mouseY", String(y));
    };

    const onScroll = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        applyScroll();
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      if (mouseFrame) return;
      mouseFrame = window.requestAnimationFrame(() => {
        mouseFrame = 0;
        applyMouse(e.clientX, e.clientY);
      });
    };

    applyScroll();
    applyMouse(window.innerWidth / 2, window.innerHeight / 2);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onScroll);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      if (mouseFrame) window.cancelAnimationFrame(mouseFrame);
    };
  }, []);

  return null;
}
