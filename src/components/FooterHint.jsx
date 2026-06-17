export default function FooterHint({ isMobile }) {
  return (
    <div className="footer-hint">
      {isMobile
        ? "조이스틱으로 캐릭터를 움직여 구역을 탐험하세요"
        : "WASD 또는 방향키로 이동 · 구역에 들어가면 Enter로 정보 열기"}
    </div>
  );
}
