import { useRef, useState } from "react";

export default function VirtualJoystick({ onMove }) {
  const baseRef = useRef(null);
  const [active, setActive] = useState(false);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const originRef = useRef({ x: 0, y: 0 });

  const handleStart = (e) => {
    const rect = baseRef.current.getBoundingClientRect();
    originRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    setActive(true);
    handleMove(e);
  };

  const handleMove = (e) => {
    const touch = e.touches ? e.touches[0] : e;
    const dx = touch.clientX - originRef.current.x;
    const dy = touch.clientY - originRef.current.y;
    const maxR = 38;
    const dist = Math.min(Math.hypot(dx, dy), maxR);
    const angle = Math.atan2(dy, dx);
    const kx = Math.cos(angle) * dist;
    const ky = Math.sin(angle) * dist;
    setKnob({ x: kx, y: ky });
    onMove(kx / maxR, ky / maxR);
  };

  const handleEnd = () => {
    setActive(false);
    setKnob({ x: 0, y: 0 });
    onMove(0, 0);
  };

  return (
    <div
      className="joystick-base"
      ref={baseRef}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      onMouseDown={handleStart}
      onMouseMove={(e) => active && handleMove(e)}
      onMouseUp={handleEnd}
      onMouseLeave={() => active && handleEnd()}
    >
      <div
        className="joystick-knob"
        style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }}
      />
    </div>
  );
}
