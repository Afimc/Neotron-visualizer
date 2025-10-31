import { useEffect, useRef, useState, useCallback } from "react";
import { Application, Graphics, Container, Text } from "pixi.js";
import { simStore } from "../../core/store/simStore";

interface NeutronParticle {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  color: number;
  radius: number;
  isMoving: boolean;
  action?: "keep" | "fusion" | "leave";
  fusionPartner?: string;
}

function layoutNeutronsInColumn(n: number, h: number, stepX: number) {
  const usableHeight = h - 120;
  const spacing = Math.min(40, usableHeight / Math.max(1, n));
  const startY = 80 + (usableHeight - (n - 1) * spacing) / 2;

  const particles: NeutronParticle[] = [];
  for (let i = 0; i < n; i++) {
    particles.push({
      id: `${stepX}-${i}`,
      x: stepX,
      y: startY + i * spacing,
      targetX: stepX,
      targetY: startY + i * spacing,
      color: 0x3b82f6,
      radius: Math.max(4, Math.min(12, spacing * 0.3)),
      isMoving: false,
    });
  }
  return particles;
}

function layoutNeutronsWithFusions(step: any, h: number, centerX: number) {
  const usableHeight = h - 120;
  const particles: NeutronParticle[] = [];
  
  const totalNeutrons = step.end;
  const maxNeutronsPerColumn = Math.floor(usableHeight / 25);
  const columns = Math.max(1, Math.ceil(totalNeutrons / maxNeutronsPerColumn));
  const neutronsPerColumn = Math.ceil(totalNeutrons / columns);
  const spacing = Math.min(40, usableHeight / neutronsPerColumn);
  const columnWidth = 30;
  
  let neutronIndex = 0;
  
  for (let i = 0; i < step.kept; i++) {
    const col = Math.floor(neutronIndex / neutronsPerColumn);
    const row = neutronIndex % neutronsPerColumn;
    const x = centerX + (col - (columns - 1) / 2) * columnWidth;
    const y = 80 + row * spacing;
    
    particles.push({
      id: `${centerX}-kept-${i}`,
      x: x,
      y: y,
      targetX: x,
      targetY: y,
      color: 0x3b82f6,
      radius: Math.max(4, Math.min(8, spacing * 0.3)),
      isMoving: false,
    });
    neutronIndex++;
  }
  
  step.fusions.forEach((fusionPower: number, fusionIndex: number) => {
    for (let i = 0; i < fusionPower; i++) {
      const col = Math.floor(neutronIndex / neutronsPerColumn);
      const row = neutronIndex % neutronsPerColumn;
      const x = centerX + (col - (columns - 1) / 2) * columnWidth;
      const y = 80 + row * spacing;
      
      particles.push({
        id: `${centerX}-fusion-${fusionIndex}-${i}`,
        x: x,
        y: y,
        targetX: x,
        targetY: y,
        color: 0x10b981,
        radius: Math.max(4, Math.min(6, spacing * 0.3)),
        isMoving: false,
        action: 'fusion',
        fusionPartner: `fusion-${fusionIndex}`
      });
      neutronIndex++;
    }
  });
  
  return particles;
}

export default function NeotronField() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const drawRef = useRef<((stepIndex: number, isAnimating: boolean) => void) | null>(null);
  const intervalRef = useRef<number | null>(null);
  const particlesRef = useRef<NeutronParticle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [isAnimating, setIsAnimating] = useState(false);

  const result = simStore((s: any) => s.result);

  const startAnimation = useCallback(() => {
    if (!result?.steps?.length) return;

    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        const nextStep = prev + 1;
        if (nextStep > result.steps.length) {
          setIsPlaying(false);
          return prev;
        }
        return nextStep;
      });
    }, animationSpeed);
  }, [result, animationSpeed]);

  const pauseAnimation = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetAnimation = useCallback(() => {
    pauseAnimation();
    setCurrentStep(0);
    setIsAnimating(false);
  }, [pauseAnimation]);

  const stepForward = useCallback(() => {
    if (!result?.steps?.length) return;
    if (isPlaying) {
      pauseAnimation();
    }
    setCurrentStep((prev) => Math.min(prev + 1, result.steps.length));
  }, [result, isPlaying, pauseAnimation]);

  const stepBackward = useCallback(() => {
    if (isPlaying) {
      pauseAnimation();
    }
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    setIsAnimating(false);
  }, [isPlaying, pauseAnimation]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let cleanup = () => {};

    (async () => {
      if (!wrapRef.current) {
        return;
      }

      wrapRef.current.innerHTML = '';

      const app = new Application();
      await app.init({
        backgroundAlpha: 0,
        antialias: true,
        resizeTo: wrapRef.current,
      });
      appRef.current = app;
      
      app.canvas.style.display = 'block';
      app.canvas.style.width = '100%';
      app.canvas.style.height = '100%';
      
      wrapRef.current.appendChild(app.canvas);

      const root = new Container();
      app.stage.addChild(root);

      const draw = (stepIndex: number, animating: boolean) => {
        root.removeChildren();

        const w = app.renderer.width;
        const h = app.renderer.height;

        if (!result?.steps?.length) {
          const noDataText = new Text({
            text: "No simulation data available\nRun a simulation to see the animation",
            style: {
              fontSize: 18,
              fill: 0x666666,
              fontFamily: "Arial, sans-serif",
              align: 'center'
            },
          });
          noDataText.x = w / 2 - noDataText.width / 2;
          noDataText.y = h / 2 - noDataText.height / 2;
          root.addChild(noDataText);
          return;
        }

        const centerX = w / 2;
        const stepWidth = Math.max(80, Math.min(150, w / (result.steps.length + 3)));
        
        const baseTimelineX = centerX - (stepIndex * stepWidth);

        const timelineY = h - 60;
        for (let i = 0; i <= result.steps.length; i++) {
          const x = baseTimelineX + (i * stepWidth);
          
          if (x > -150 && x < w + 150) {
            const line = new Graphics();
            line.moveTo(x, 80);
            line.lineTo(x, timelineY);
            line.stroke({ 
              color: i === stepIndex ? 0xef4444 : 0xe5e7eb, 
              width: i === stepIndex ? 3 : 1 
            });
            root.addChild(line);

            const stepLabel = new Text({
              text: i === 0 ? "Start" : `Step ${i}`,
              style: { 
                fontSize: 12, 
                fill: i === stepIndex ? 0xef4444 : 0x6b7280,
                fontWeight: i === stepIndex ? 'bold' : 'normal'
              },
            });
            stepLabel.x = x - stepLabel.width / 2;
            stepLabel.y = timelineY + 10;
            root.addChild(stepLabel);
          }
        }

        const indicator = new Graphics();
        indicator.rect(centerX - 2, 75, 4, timelineY - 70);
        indicator.fill(0xef4444);
        root.addChild(indicator);

        const infoText = new Text({
          text: stepIndex === 0 
            ? "Initial state: 1 neutron ready to start"
            : `Step ${result.steps[stepIndex - 1].step}: ${result.steps[stepIndex - 1].start} → ${result.steps[stepIndex - 1].end} neutrons (Kept: ${result.steps[stepIndex - 1].kept}, Left: ${result.steps[stepIndex - 1].left}, Fusions: ${result.steps[stepIndex - 1].fusions.length})`,
          style: {
            fontSize: 14,
            fill: 0x333333,
            fontFamily: "Arial, sans-serif",
          },
        });
        infoText.x = 10;
        infoText.y = 10;
        root.addChild(infoText);

        if (stepIndex === 0) {
          if (!animating) {
            particlesRef.current = layoutNeutronsInColumn(1, h, centerX);
          }
        } else {
          const step = result.steps[stepIndex - 1];

          if (!animating) {
            particlesRef.current = layoutNeutronsWithFusions(step, h, centerX);
          }
        }

        if (stepIndex > 0 && !animating) {
          const prevStep = result.steps[stepIndex - 2];
          if (prevStep) {
            const prevParticles = layoutNeutronsWithFusions(prevStep, h, centerX - 120);
            prevParticles.forEach((particle) => {
              const g = new Graphics();
              g.circle(particle.x, particle.y, particle.radius * 0.6);
              g.fill({ color: particle.color, alpha: 0.3 });
              root.addChild(g);
            });
          }
        }

        particlesRef.current.forEach((particle) => {
          const g = new Graphics();
          g.circle(particle.x, particle.y, particle.radius);
          g.fill(particle.color);

          if (particle.isMoving) {
            const glowG = new Graphics();
            glowG.circle(particle.x, particle.y, particle.radius + 4);
            glowG.fill({ color: particle.color, alpha: 0.4 });
            root.addChild(glowG);
          }

          if (particle.action === 'fusion') {
            const fusionRing = new Graphics();
            fusionRing.circle(particle.x, particle.y, particle.radius + 6);
            fusionRing.stroke({ color: 0xf59e0b, width: 2, alpha: 0.7 });
            root.addChild(fusionRing);
          }

          root.addChild(g);
        });

        if (stepIndex > 0 && animating) {
          const step = result.steps[stepIndex - 1];
          
          step.fusions.forEach((fusionPower: number, fusionIndex: number) => {
            const fusionParticles = particlesRef.current.filter(p => 
              p.fusionPartner === `fusion-${fusionIndex}`
            );
            
            if (fusionParticles.length > 0) {
              const centerY = fusionParticles.reduce((sum, p) => sum + p.y, 0) / fusionParticles.length;
              const burstX = centerX - 60;
              
              const burstG = new Graphics();
              burstG.star(burstX, centerY, 8, 12, 6);
              burstG.fill({ color: 0xf59e0b, alpha: 0.9 });
              root.addChild(burstG);
              
              for (let i = 0; i < 5; i++) {
                const angle = (i * Math.PI * 2) / 5;
                const sparkX = burstX + Math.cos(angle) * 15;
                const sparkY = centerY + Math.sin(angle) * 15;
                const spark = new Graphics();
                spark.circle(sparkX, sparkY, 2);
                spark.fill({ color: 0xfbbf24, alpha: 0.8 });
                root.addChild(spark);
              }
            }
          });
        }

        const gridSpacing = 60;
        const gridOffset = (stepIndex * stepWidth) % gridSpacing;
        
        for (let x = -gridOffset; x < w + gridSpacing; x += gridSpacing) {
          const gridLine = new Graphics();
          gridLine.moveTo(x, 90);
          gridLine.lineTo(x, timelineY - 10);
          gridLine.stroke({ color: 0xf0f0f0, width: 1, alpha: 0.3 });
          root.addChild(gridLine);
        }
      };

      drawRef.current = draw;

      const animate = () => {
        let needsUpdate = false;
        
        particlesRef.current.forEach((particle) => {
          if (particle.isMoving) {
            const dx = particle.targetX - particle.x;
            const dy = particle.targetY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 1) {
              particle.x += dx * 0.08;
              particle.y += dy * 0.08;
              needsUpdate = true;
            } else {
              particle.x = particle.targetX;
              particle.y = particle.targetY;
              particle.isMoving = false;
            }
          }
        });

        if (needsUpdate) {
          if (drawRef.current) {
            drawRef.current(currentStep, true);
          }
        } else {
          setIsAnimating(false);
        }

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animationFrameRef.current = requestAnimationFrame(animate);

      draw(0, false);

      cleanup = () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        app.destroy(true, { children: true, texture: true });
        appRef.current = null;
        drawRef.current = null;
        if (wrapRef.current) {
          wrapRef.current.innerHTML = '';
        }
      };
    })();

    return () => cleanup();
  }, [result]);

  useEffect(() => {
    if (!result?.steps?.length || !drawRef.current || !appRef.current) return;

    // Force timeline redraw with proper timing
    setTimeout(() => {
      if (drawRef.current) {
        drawRef.current(currentStep, isAnimating);
      }
    }, 0);

    const w = appRef.current.renderer.width;
    const h = appRef.current.renderer.height;
    const centerX = w / 2;

    if (currentStep === 0) {
      setIsAnimating(false);
      particlesRef.current = layoutNeutronsInColumn(1, h, centerX);
      return;
    }

    if (currentStep > 0 && currentStep <= result.steps.length) {
      const step = result.steps[currentStep - 1];

      if (isPlaying) {
        setIsAnimating(true);

        const targetParticles = layoutNeutronsWithFusions(step, h, centerX);
        const newParticles: NeutronParticle[] = [];
        let keptIndex = 0;

        for (let i = 0; i < step.kept && i < particlesRef.current.length; i++) {
          const particle = { ...particlesRef.current[i] };
          
          const keptTargets = targetParticles.filter(p => p.color === 0x3b82f6);
          if (keptIndex < keptTargets.length) {
            particle.targetX = keptTargets[keptIndex].x;
            particle.targetY = keptTargets[keptIndex].y;
            particle.isMoving = true;
            particle.color = 0x3b82f6;
            particle.x = centerX - 120;
            
            newParticles.push(particle);
            keptIndex++;
          }
        }

        const fusionTargets = targetParticles.filter(p => p.color === 0x10b981);
        fusionTargets.forEach(target => {
          const newNeutron: NeutronParticle = {
            ...target,
            isMoving: true,
            x: centerX - 60,
            y: target.y,
            color: 0x10b981,
          };
          newParticles.push(newNeutron);
        });

        particlesRef.current = newParticles;
      } else {
        setIsAnimating(false);
        const targetParticles = layoutNeutronsWithFusions(step, h, centerX);
        particlesRef.current = targetParticles;
        setTimeout(() => {
          if (drawRef.current) {
            drawRef.current(currentStep, false);
          }
        }, 10);
        return;
      }
    }
  }, [currentStep, result, isPlaying]);

  const buttonStyle = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    minWidth: "80px",
  };

  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!e.currentTarget.disabled) {
      e.currentTarget.style.transform = "translateY(-1px)";
      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
    }
  };

  const handleButtonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
  };

  return (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      flexDirection: "column",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <div
        style={{
          padding: "16px 20px",
          background: "rgba(255, 255, 255, 0.95)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
          flexShrink: 0,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <button
          onClick={isPlaying ? pauseAnimation : startAnimation}
          disabled={!result?.steps?.length}
          style={{
            ...buttonStyle,
            backgroundColor: isPlaying ? "#ef4444" : "#10b981",
            color: "white",
            opacity: !result?.steps?.length ? 0.5 : 1,
          }}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
        >
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>

        <button
          onClick={pauseAnimation}
          disabled={!result?.steps?.length || !isPlaying}
          style={{
            ...buttonStyle,
            backgroundColor: "#f59e0b",
            color: "white",
            opacity: (!result?.steps?.length || !isPlaying) ? 0.5 : 1,
          }}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
        >
          ⏹ Stop
        </button>

        <button
          onClick={resetAnimation}
          disabled={!result?.steps?.length}
          style={{
            ...buttonStyle,
            backgroundColor: "#6b7280",
            color: "white",
            opacity: !result?.steps?.length ? 0.5 : 1,
          }}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
        >
          🔄 Reset
        </button>

        <div style={{ width: "1px", height: "30px", backgroundColor: "rgba(0, 0, 0, 0.1)" }} />

        <button
          onClick={stepBackward}
          disabled={!result?.steps?.length || currentStep === 0 || isAnimating}
          style={{
            ...buttonStyle,
            backgroundColor: "#3b82f6",
            color: "white",
            opacity: (!result?.steps?.length || currentStep === 0 || isAnimating) ? 0.5 : 1,
            minWidth: "auto",
            padding: "10px 16px",
          }}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
        >
          ← Step
        </button>

        <button
          onClick={stepForward}
          disabled={!result?.steps?.length || currentStep >= result?.steps?.length || isAnimating}
          style={{
            ...buttonStyle,
            backgroundColor: "#3b82f6",
            color: "white",
            opacity: (!result?.steps?.length || currentStep >= result?.steps?.length || isAnimating) ? 0.5 : 1,
            minWidth: "auto",
            padding: "10px 16px",
          }}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
        >
          Step →
        </button>

        <div style={{ width: "1px", height: "30px", backgroundColor: "rgba(0, 0, 0, 0.1)" }} />

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>Speed:</label>
          <select
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(Number(e.target.value))}
            style={{
              padding: "8px 12px",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
              backgroundColor: "white",
              cursor: "pointer",
              minWidth: "120px",
            }}
          >
            <option value={3000}>Slow (3s)</option>
            <option value={2000}>Normal (2s)</option>
            <option value={1000}>Fast (1s)</option>
            <option value={500}>Very Fast (0.5s)</option>
          </select>
        </div>

        {result?.steps?.length && (
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 16px",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: "8px",
              border: "1px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
              Step {currentStep} / {result.steps.length}
            </span>
            {isPlaying && (
              <span style={{ 
                color: "#10b981", 
                fontSize: "12px", 
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}>
                <span style={{ 
                  width: "8px", 
                  height: "8px", 
                  borderRadius: "50%", 
                  backgroundColor: "#10b981"
                }} />
                Playing
              </span>
            )}
          </div>
        )}
      </div>

      <div
        ref={wrapRef}
        style={{
          width: "100%",
          flex: 1,
          background: "rgba(255, 255, 255, 0.1)",
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      />

      <div
        style={{
          padding: "16px 20px",
          background: "rgba(255, 255, 255, 0.95)",
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
          display: "flex",
          gap: "24px",
          fontSize: "13px",
          flexShrink: 0,
          boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              backgroundColor: "#3b82f6",
              boxShadow: "0 2px 4px rgba(59, 130, 246, 0.3)",
            }}
          />
          <span style={{ fontWeight: "500", color: "#374151" }}>Kept Neutrons</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              backgroundColor: "#10b981",
              boxShadow: "0 2px 4px rgba(16, 185, 129, 0.3)",
            }}
          />
          <span style={{ fontWeight: "500", color: "#374151" }}>Created by Fusion</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "24px",
              height: "4px",
              backgroundColor: "#f59e0b",
              borderRadius: "2px",
              boxShadow: "0 2px 4px rgba(245, 158, 11, 0.3)",
            }}
          />
          <span style={{ fontWeight: "500", color: "#374151" }}>Fusion Events</span>
        </div>
      </div>
    </div>
  );
}
