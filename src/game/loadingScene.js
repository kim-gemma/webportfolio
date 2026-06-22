import Phaser from "phaser";

// ============================================================
// 로딩 화면: 접속 직후 가장 먼저 보여주는 짧은 막.
// "Pixel Garden Portfolio" 로고 + 점이 늘어나는 Loading 텍스트 + 가벼운
// 벚꽃잎 효과만 띄운 뒤, 짧은 페이드아웃 후 IntroScene으로 넘어간다.
// ============================================================

export class LoadingScene extends Phaser.Scene {
  constructor() {
    super("LoadingScene");
  }

  create() {
    const isMobile = this.scale.width <= 768;
    const w = this.scale.width;
    const h = this.scale.height;

    this.cameras.main.setBackgroundColor("#0a1020");

    if (!this.textures.exists("loading-petal")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xffc2d1, 1);
      g.fillEllipse(5, 3, 10, 6);
      g.generateTexture("loading-petal", 10, 6);
      g.destroy();
    }

    this.add.particles(0, 0, "loading-petal", {
      x: { min: 0, max: w },
      y: -10,
      lifespan: { min: 4000, max: 7000 },
      speedY: { min: 20, max: 50 },
      speedX: { min: -20, max: 20 },
      rotate: { min: 0, max: 360 },
      scale: { min: 0.5, max: 1.1 },
      alpha: { start: 0.9, end: 0.5 },
      frequency: 140,
      quantity: 1,
    });

    this.add
      .text(w / 2, h / 2 - 30, "Pixel Garden Portfolio", {
        fontFamily: "monospace",
        fontSize: isMobile ? "20px" : "28px",
        color: "#ffffff",
        stroke: "#1a1f2e",
        strokeThickness: 5,
        align: "center",
        wordWrap: isMobile ? { width: w * 0.85 } : undefined,
      })
      .setOrigin(0.5);

    const loadingLabel = this.add
      .text(w / 2, h / 2 + 30, "Loading", {
        fontFamily: "monospace",
        fontSize: isMobile ? "14px" : "16px",
        color: "#cdeb6e",
      })
      .setOrigin(0.5);

    // 점(.)이 하나씩 늘어났다가 다시 줄어드는 로딩 애니메이션
    let dotCount = 0;
    this.time.addEvent({
      delay: 280,
      loop: true,
      callback: () => {
        dotCount = (dotCount + 1) % 4;
        loadingLabel.setText("Loading" + ".".repeat(dotCount));
      },
    });

    const duration = isMobile ? 1100 : 1600;
    this.time.delayedCall(duration, () => {
      this.cameras.main.fadeOut(250, 10, 16, 32);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        this.scene.start("IntroScene");
      });
    });
  }
}
