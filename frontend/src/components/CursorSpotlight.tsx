import { useEffect, useState } from 'react';

export function CursorSpotlight() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only activate on devices with mouse pointer
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-none z-30 transition-opacity duration-300 w-[30rem] h-[30rem] rounded-full -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        background:
          'radial-gradient(circle, rgba(34,197,94,0.08) 0%, rgba(59,130,246,0.04) 40%, transparent 70%)',
      }}
    />
  );
}
