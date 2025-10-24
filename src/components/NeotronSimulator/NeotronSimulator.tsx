import { useEffect, useRef } from "react";
import { Application, Graphics, Container } from "pixi.js";
import { simStore } from "../../core/store/simStore";

function layoutGrid(n: number, w: number, h: number) {
  const cols = Math.max(1, Math.ceil(Math.sqrt(n)));
  const rows = Math.ceil(n / cols);
  const cell = Math.min(w / cols, h / rows);
  const r = Math.max(2, Math.min(12, cell * 0.35));
  const pos: { x: number; y: number; r: number }[] = [];
  for (let i = 0; i < n; i++) {
    const c = i % cols;
    const rIdx = Math.floor(i / cols);
    pos.push({ x: (c + 0.5) * cell, y: (rIdx + 0.5) * cell, r });
  }
  return { pos, contentW: cols * cell, contentH: rows * cell };
}

export default function NeotronField() {
  console.log("[NeotronField] render"); // component render
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const drawRef = useRef<((n: number) => void) | null>(null);

  const result = simStore((s:any) => s.result);

  useEffect(() => {
    console.log("[NeotronField] mount effect start");
    let cleanup = () => {};

    (async () => {
      if (!wrapRef.current) {
        console.warn("[NeotronField] wrapRef is null");
        return;
      }

      console.log("[NeotronField] creating Pixi Application…");
      const app = new Application();
      await app.init({
        backgroundAlpha: 0,
        antialias: true,
        resizeTo: wrapRef.current, // keep canvas sized to container
      });
      appRef.current = app;
      wrapRef.current.appendChild(app.canvas);
      console.log("[NeotronField] Pixi initialized, canvas appended");

      const root = new Container();
      app.stage.addChild(root);

      const draw = (n: number) => {
        console.log("[NeotronField] draw() called with n =", n);
        root.removeChildren();

        const w = app.renderer.width;
        const h = app.renderer.height;
        const { pos, contentW, contentH } = layoutGrid(n, w, h);
        const ox = (w - contentW) / 2;
        const oy = (h - contentH) / 2;

        for (const p of pos) {
          const g = new Graphics();
          g.circle(p.x + ox, p.y + oy, p.r);
          g.fill(0x3b82f6);
          root.addChild(g);
        }
      };

      drawRef.current = draw;


      const onResize = () => {
        console.log("[NeotronField] resize");
        drawRef.current?.(100);
      };
      app.renderer.on("resize", onResize);

      cleanup = () => {
        console.log("[NeotronField] cleanup");
        app.renderer.off("resize", onResize);
        app.destroy(true);
        appRef.current = null;
        drawRef.current = null;
      };
    })();

    return () => cleanup();
  }, []);


  useEffect(() => {
    console.log("[NeotronField] result effect fired:", result);
    if (!result || !result.steps?.length) return;

    const n = Math.max(...result.steps.map((s:any) => s.end)); 
    console.log("[NeotronField] computed n from result =", n);

    if (drawRef.current) {
      drawRef.current(n);
    } else {
      console.warn("[NeotronField] drawRef not ready yet");
    }
  }, [result]);

  return (
    <div
      ref={wrapRef}
    //   style={{
    //     width: "100%",
    //     height: "60vh",
    //     background: "rgba(0,0,0,0.05)",
    //     borderTop: "1px solid rgba(0,0,0,0.1)",
    //   }}
    />
  );
}
