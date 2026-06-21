import Phaser from "phaser";

// ============================================================
// 인트로 씬: "벚꽃이 흩날리는 공원 산책로" 타이틀 화면
// 768x512 기준 좌표를 실제 캔버스 크기에 맞춰 스케일/오프셋(letterbox)한다.
// 낮→석양→밤→새벽 사이클은 색을 매번 다시 그리는 대신, 어두운 오버레이의
// 알파값만 보간해서 표현한다 (배경/플라자/오브젝트는 한 번만 그려서 가볍다).
// ============================================================

const BASE_W = 768;
const BASE_H = 512;
const CYCLE_MS = 18000; // 낮→석양→밤→새벽 한 바퀴 (15~20초 권장 범위)

const DEPTH = {
  sky: 0,
  mountains: 1,
  city: 2,
  river: 3,
  clouds: 4,
  plaza: 5,
  decor: 6,
  fountainBase: 7,
  npc: 8,
  birds: 9,
  overlay: 10,
  stars: 11,
  celestial: 12,
  glow: 13,
  petals: 15,
  ui: 20,
};

// 사이클 진행도(0~1)에 따른 색/밝기 키프레임. 0과 1은 같은 "낮"이라 자연스럽게 반복된다.
const CYCLE_STOPS = [
  { p: 0.0, ambient: 0.0, sunAlpha: 1, moonAlpha: 0, starAlpha: 0, lightsOn: 0 },
  { p: 0.18, ambient: 0.0, sunAlpha: 1, moonAlpha: 0, starAlpha: 0, lightsOn: 0 },
  { p: 0.27, ambient: 0.12, sunAlpha: 1, moonAlpha: 0, starAlpha: 0.1, lightsOn: 0.25 },
  { p: 0.38, ambient: 0.35, sunAlpha: 0.25, moonAlpha: 0.6, starAlpha: 0.55, lightsOn: 0.8 },
  { p: 0.48, ambient: 0.58, sunAlpha: 0, moonAlpha: 1, starAlpha: 1, lightsOn: 1 },
  { p: 0.8, ambient: 0.58, sunAlpha: 0, moonAlpha: 1, starAlpha: 1, lightsOn: 1 },
  { p: 0.9, ambient: 0.28, sunAlpha: 0.5, moonAlpha: 0.4, starAlpha: 0.3, lightsOn: 0.4 },
  { p: 1.0, ambient: 0.0, sunAlpha: 1, moonAlpha: 0, starAlpha: 0, lightsOn: 0 },
];

function sampleStops(phase, field) {
  let i = 0;
  while (i < CYCLE_STOPS.length - 2 && phase > CYCLE_STOPS[i + 1].p) i++;
  const a = CYCLE_STOPS[i];
  const b = CYCLE_STOPS[i + 1];
  const span = b.p - a.p || 1;
  const t = Phaser.Math.Clamp((phase - a.p) / span, 0, 1);
  return Phaser.Math.Linear(a[field], b[field], t);
}

export class IntroScene extends Phaser.Scene {
  constructor() {
    super("IntroScene");
  }

  create() {
    const baseW = BASE_W;
    const baseH = BASE_H;
    // 모바일은 가로:세로 비율이 베이스(768x512, 3:2 가로형)와 크게 달라
    // 세로 기준까지 맞추면 배경/글자가 필요 이상으로 작아진다. 모바일에서는
    // 너비만 기준으로 맞추고, 남는 세로 공간은 위가 아니라 아래로 가도록
    // (top 앵커) 해서 상단 여백을 없앤다. 타이틀/PLAY 버튼은 createTitleUI에서
    // 화면 실제 높이를 기준으로 별도 배치한다.
    this.isMobile = this.scale.width <= 768;
    const scale = this.isMobile
      ? this.scale.width / baseW
      : Math.min(this.scale.width / baseW, this.scale.height / baseH);
    this.introScale = scale;
    this.introOffsetX = (this.scale.width - baseW * scale) / 2;
    this.introOffsetY = this.isMobile ? 0 : (this.scale.height - baseH * scale) / 2;
    this.cyclePhase = 0;

    this.cameras.main.setBackgroundColor("#bfe3ef");

    this.generateParticleTextures();

    this.drawSky();
    this.createStars();
    this.createCelestialBodies();
    this.drawMountains();
    this.drawCitySkyline();
    this.drawRiver();
    this.createClouds();
    this.drawPlazaGround();
    this.createFlowerBeds();
    this.createCherryTrees();
    this.createBenches();
    this.createStreetLamps();
    this.createFountain();
    this.createPetalEmitter();
    this.createWalkingPeople();
    this.createDog();
    this.createBird();
    this.createAmbientOverlay();
    this.createTitleUI();

    // 리사이즈 시 좌표계가 어긋나므로 짧은 디바운스 후 씬을 다시 구성한다
    this._resizeHandler = () => {
      if (this._resizeTimer) this._resizeTimer.remove(false);
      this._resizeTimer = this.time.delayedCall(250, () => this.scene.restart());
    };
    this.scale.on("resize", this._resizeHandler);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off("resize", this._resizeHandler);
    });
  }

  toScreen(x, y) {
    return [this.introOffsetX + x * this.introScale, this.introOffsetY + y * this.introScale];
  }

  // 디자인 기준(768x512) 거리/속도 값을 실제 캔버스 스케일로 환산한다
  S(v) {
    return v * this.introScale;
  }

  // ------------------------------------------------------------
  // 파티클 텍스처 (벚꽃잎 / 물방울) — Graphics로 한 번만 그려 텍스처로 굽는다
  // ------------------------------------------------------------
  generateParticleTextures() {
    if (!this.textures.exists("petal-tex")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xffc2d1, 1);
      g.fillEllipse(5, 3, 10, 6);
      g.fillStyle(0xffe1ea, 0.7);
      g.fillEllipse(3, 2, 4, 2.4);
      g.generateTexture("petal-tex", 10, 6);
      g.destroy();
    }
    if (!this.textures.exists("droplet-tex")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xeaf6ff, 1);
      g.fillCircle(3, 3, 3);
      g.generateTexture("droplet-tex", 6, 6);
      g.destroy();
    }
  }

  // ------------------------------------------------------------
  // 하늘 (한 번만 그리는 수직 그라디언트 — 낮/밤 표현은 어두운 오버레이가 담당)
  // ------------------------------------------------------------
  drawSky() {
    const g = this.add.graphics().setDepth(DEPTH.sky);
    const [ox, oy] = this.toScreen(0, 0);
    const w = BASE_W * this.introScale;
    const bands = 18;
    const top = [142, 206, 240];
    const bottom = [226, 246, 255];
    for (let i = 0; i < bands; i++) {
      const t = i / (bands - 1);
      const r = Phaser.Math.Linear(top[0], bottom[0], t);
      const gC = Phaser.Math.Linear(top[1], bottom[1], t);
      const b = Phaser.Math.Linear(top[2], bottom[2], t);
      g.fillStyle(Phaser.Display.Color.GetColor(r, gC, b), 1);
      const bandH = (260 / bands) * this.introScale;
      g.fillRect(ox, oy + i * bandH, w, bandH + 1);
    }
    // 캔버스 letterbox 여백까지 같은 색으로 채움
    g.fillStyle(Phaser.Display.Color.GetColor(bottom[0], bottom[1], bottom[2]), 1);
    g.fillRect(0, oy + 260 * this.introScale, this.scale.width, this.scale.height);
  }

  createStars() {
    this.starContainer = this.add.container(0, 0).setDepth(DEPTH.stars);
    for (let i = 0; i < 40; i++) {
      const x = Phaser.Math.Between(10, BASE_W - 10);
      const y = Phaser.Math.Between(15, 150);
      const [sx, sy] = this.toScreen(x, y);
      const star = this.add.circle(sx, sy, this.S(Phaser.Math.FloatBetween(0.8, 1.6)), 0xffffff, 1);
      this.starContainer.add(star);
      this.tweens.add({
        targets: star,
        alpha: { from: Phaser.Math.FloatBetween(0.3, 0.6), to: 1 },
        duration: Phaser.Math.Between(900, 2200),
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 1500),
      });
    }
  }

  createCelestialBodies() {
    const [cx, cy] = this.toScreen(0, 0);
    this.sun = this.add.circle(cx, cy, this.S(22), 0xffe27a, 1).setDepth(DEPTH.celestial);
    this.sun.setStrokeStyle(this.S(6), 0xfff3c4, 0.5);
    this.moon = this.add.circle(cx, cy, this.S(18), 0xeef2ff, 1).setDepth(DEPTH.celestial);
    this.moonCraters = this.add.container(0, 0).setDepth(DEPTH.celestial);
    [[-5, -3, 3], [4, 2, 2.4], [-2, 5, 2]].forEach(([dx, dy, r]) => {
      const crater = this.add.circle(0, 0, this.S(r), 0xd7ddf0, 0.7);
      crater.setData("offset", [dx, dy]);
      this.moonCraters.add(crater);
    });
  }

  updateCelestialBodies(phase) {
    const s = this.introScale;
    // 해: 새벽(0.85)에 떠서 낮을 가로질러 석양 끝(0.40)에 진다
    const sunWinStart = 0.85;
    const sunWinLen = 0.55;
    const sunT = Phaser.Math.Clamp(((phase - sunWinStart + 1) % 1) / sunWinLen, 0, 1);
    const sunX = Phaser.Math.Linear(-40, BASE_W + 40, sunT);
    const sunY = 150 - Math.sin(sunT * Math.PI) * 110;
    const [sx, sy] = this.toScreen(sunX, sunY);
    this.sun.setPosition(sx, sy);
    this.sun.setAlpha(sampleStops(phase, "sunAlpha"));

    // 달: 석양(0.40)에 떠서 새벽(0.90)에 진다
    const moonT = Phaser.Math.Clamp((phase - 0.4) / 0.5, 0, 1);
    const moonX = Phaser.Math.Linear(-40, BASE_W + 40, moonT);
    const moonY = 150 - Math.sin(moonT * Math.PI) * 110;
    const [mx, my] = this.toScreen(moonX, moonY);
    this.moon.setPosition(mx, my);
    this.moon.setAlpha(sampleStops(phase, "moonAlpha"));
    this.moonCraters.setAlpha(this.moon.alpha);
    this.moonCraters.list.forEach((crater) => {
      const [dx, dy] = crater.getData("offset");
      crater.setPosition(mx + dx * s, my + dy * s);
    });

    this.starContainer.setAlpha(sampleStops(phase, "starAlpha"));
  }

  // ------------------------------------------------------------
  // 산 / 도시 스카이라인 / 강
  // ------------------------------------------------------------
  drawMountains() {
    const g = this.add.graphics().setDepth(DEPTH.mountains);
    const baseline = 198;
    const drawRange = (peaks, color, alpha) => {
      g.fillStyle(color, alpha);
      g.beginPath();
      const [sx0, sy0] = this.toScreen(0, baseline);
      g.moveTo(sx0, sy0);
      peaks.forEach(([x, y]) => {
        const [px, py] = this.toScreen(x, y);
        g.lineTo(px, py);
      });
      const [sx1, sy1] = this.toScreen(BASE_W, baseline);
      g.lineTo(sx1, sy1);
      g.closePath();
      g.fillPath();
    };
    drawRange(
      [[0, 175], [110, 135], [230, 168], [340, 120], [460, 160], [600, 132], [720, 170], [BASE_W, 150]],
      0x9fb4cf,
      0.55
    );
    drawRange(
      [[0, 190], [150, 158], [300, 184], [470, 150], [620, 182], [BASE_W, 165]],
      0x7b93b8,
      0.7
    );
  }

  drawCitySkyline() {
    const g = this.add.graphics().setDepth(DEPTH.city);
    const baseline = 212;
    const buildings = [];
    let x = 20;
    while (x < BASE_W - 20) {
      const w = Phaser.Math.Between(14, 26);
      const h = Phaser.Math.Between(14, 42);
      buildings.push({ x, w, h });
      x += w + Phaser.Math.Between(4, 10);
    }
    this.cityWindows = this.add.container(0, 0).setDepth(DEPTH.glow);
    buildings.forEach(({ x: bx, w, h }) => {
      const [px, py] = this.toScreen(bx, baseline - h);
      g.fillStyle(0x4a5a78, 0.8);
      g.fillRect(px, py, this.S(w), this.S(h));
      // 창문 불빛 (밤에만 보임)
      const cols = Math.max(1, Math.floor(w / 6));
      const rows = Math.max(1, Math.floor(h / 8));
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() < 0.45) continue;
          const wx = px + this.S(3 + c * 6);
          const wy = py + this.S(3 + r * 8);
          const win = this.add.rectangle(wx, wy, this.S(2.4), this.S(2.4), 0xffe9a8, 1);
          this.cityWindows.add(win);
        }
      }
    });
  }

  drawRiver() {
    const g = this.add.graphics().setDepth(DEPTH.river);
    const [rx, ry] = this.toScreen(0, 212);
    const rw = BASE_W * this.introScale;
    const rh = (252 - 212) * this.introScale;
    g.fillStyle(0x3f7fa8, 1);
    g.fillRect(rx, ry, rw, rh);
    // 물결 하이라이트 줄
    g.fillStyle(0xbfe3f5, 0.35);
    for (let i = 0; i < 4; i++) {
      g.fillRect(rx, ry + this.S(6 + i * 9), rw, this.S(1.4));
    }

    this.sunReflection = this.add.ellipse(rx, ry + rh / 2, this.S(26), this.S(10), 0xffe27a, 0.5).setDepth(DEPTH.river);
    this.moonReflection = this.add.ellipse(rx, ry + rh / 2, this.S(20), this.S(8), 0xeef2ff, 0.5).setDepth(DEPTH.river);
    this.riverY = 212 + (252 - 212) / 2;
  }

  updateReflections(phase) {
    const sunX = this.sun.x;
    const moonX = this.moon.x;
    const [, ry] = this.toScreen(0, this.riverY);
    this.sunReflection.setPosition(sunX, ry);
    this.sunReflection.setAlpha(sampleStops(phase, "sunAlpha") * 0.5);
    this.moonReflection.setPosition(moonX, ry);
    this.moonReflection.setAlpha(sampleStops(phase, "moonAlpha") * 0.5);
  }

  createClouds() {
    this.clouds = [];
    const positions = [
      [90, 60, 1.1],
      [320, 40, 0.8],
      [520, 75, 1.3],
      [680, 50, 0.9],
    ];
    positions.forEach(([x, y, sc]) => {
      const container = this.add.container(...this.toScreen(x, y)).setDepth(DEPTH.clouds);
      const g = this.add.graphics();
      g.fillStyle(0xffffff, 0.85);
      [[-18, 0, 16], [0, -6, 20], [20, 0, 16], [38, 2, 12]].forEach(([dx, dy, r]) => {
        g.fillCircle(this.S(dx * sc), this.S(dy * sc), this.S(r * sc));
      });
      container.add(g);
      container.driftSpeed = this.S(Phaser.Math.FloatBetween(4, 9));
      this.clouds.push(container);
    });
  }

  updateClouds(delta) {
    const dt = delta / 1000;
    const [leftBound] = this.toScreen(-90, 0);
    const [rightBound] = this.toScreen(BASE_W + 90, 0);
    this.clouds.forEach((cloud) => {
      cloud.x += cloud.driftSpeed * dt;
      if (cloud.x > rightBound) cloud.x = leftBound;
    });
  }

  // ------------------------------------------------------------
  // 광장 바닥 (벽돌 패턴)
  // ------------------------------------------------------------
  drawPlazaGround() {
    const g = this.add.graphics().setDepth(DEPTH.plaza);
    const [px, py] = this.toScreen(0, 250);
    const pw = BASE_W * this.introScale;
    // 모바일에서는 배경 높이가 실제 화면보다 짧아질 수 있으므로, 바닥(광장) 색을
    // 화면 맨 아래까지 늘려서 중간에 색이 끊기는 듬성한 여백이 보이지 않게 한다.
    const phBase = (BASE_H - 250) * this.introScale;
    const ph = this.isMobile ? Math.max(phBase, this.scale.height - py) : phBase;
    g.fillStyle(0xcdb89a, 1);
    g.fillRect(px, py, pw, ph);

    // 잔디 가장자리 (강변)
    g.fillStyle(0x5a9456, 1);
    g.fillRect(px, py, pw, this.S(10));

    // 벽돌 줄무늬 (가로줄 + 어긋난 세로줄)
    g.lineStyle(Math.max(1, this.S(1)), 0xb59c7a, 0.6);
    const brickH = this.S(11);
    const brickW = this.S(26);
    let row = 0;
    for (let y = py + this.S(14); y < py + ph; y += brickH) {
      g.lineBetween(px, y, px + pw, y);
      const offset = row % 2 === 0 ? 0 : brickW / 2;
      for (let x = px + offset; x < px + pw; x += brickW) {
        g.lineBetween(x, y, x, y + brickH);
      }
      row++;
    }
  }

  createFlowerBeds() {
    const spots = [
      [120, 430],
      [648, 430],
    ];
    spots.forEach(([x, y]) => this.createFlowerBed(x, y));
  }

  createFlowerBed(x, y) {
    const [cx, cy] = this.toScreen(x, y);
    const w = this.S(58);
    const h = this.S(28);
    const g = this.add.graphics().setDepth(DEPTH.decor);
    g.fillStyle(0x6b4a2f, 1);
    g.fillRoundedRect(cx - w / 2, cy - h / 2, w, h, this.S(6));
    g.lineStyle(this.S(3), 0x8a6d4b, 1);
    g.strokeRoundedRect(cx - w / 2, cy - h / 2, w, h, this.S(6));

    const colors = [0xe98ca0, 0xf4d35e, 0xe98ca0, 0xf4d35e];
    const offsets = [[-w / 2 + this.S(12), 0], [-w / 2 + this.S(26), -this.S(6)], [w / 2 - this.S(26), -this.S(4)], [w / 2 - this.S(12), this.S(5)]];
    offsets.forEach(([dx, dy], i) => this.createSwayingFlower(cx + dx, cy + dy, colors[i % colors.length]));
  }

  createSwayingFlower(cx, cy, color) {
    const container = this.add.container(cx, cy).setDepth(DEPTH.decor).setScale(this.introScale * 0.8);
    const g = this.add.graphics();
    g.fillStyle(color, 1);
    g.fillCircle(-3, 0, 3);
    g.fillCircle(3, 0, 3);
    g.fillCircle(0, -3, 3);
    g.fillCircle(0, 3, 3);
    g.fillStyle(0xffffff, 0.9);
    g.fillCircle(0, 0, 2);
    container.add(g);
    this.tweens.add({
      targets: container,
      angle: { from: -8, to: 8 },
      duration: Phaser.Math.Between(1600, 2400),
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      delay: Phaser.Math.Between(0, 800),
    });
  }

  // ------------------------------------------------------------
  // 벚꽃나무 / 벤치 / 가로등
  // ------------------------------------------------------------
  createCherryTrees() {
    const spots = [
      [55, 300], [150, 320],
      [615, 300], [715, 320],
    ];
    spots.forEach(([x, y]) => this.createCherryTree(x, y));
  }

  createCherryTree(x, y) {
    const [cx, cy] = this.toScreen(x, y);
    const trunk = this.add.graphics().setDepth(DEPTH.decor);
    trunk.fillStyle(0x6b4530, 1);
    trunk.fillRect(cx - this.S(5), cy, this.S(10), this.S(34));

    const canopy = this.add.container(cx, cy - this.S(8)).setDepth(DEPTH.decor);
    const leaves = this.add.graphics();
    leaves.fillStyle(0xf3a9c2, 1);
    leaves.fillCircle(0, 0, this.S(26));
    leaves.fillCircle(-this.S(16), this.S(6), this.S(18));
    leaves.fillCircle(this.S(16), this.S(4), this.S(18));
    leaves.fillStyle(0xffd9e6, 0.9);
    leaves.fillCircle(-this.S(8), -this.S(8), this.S(13));
    leaves.fillCircle(this.S(10), -this.S(4), this.S(10));
    canopy.add(leaves);

    this.tweens.add({
      targets: canopy,
      angle: { from: -2.5, to: 2.5 },
      duration: Phaser.Math.Between(2600, 3600),
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      delay: Phaser.Math.Between(0, 1200),
    });
  }

  createBenches() {
    [[195, 365], [575, 365]].forEach(([x, y]) => this.createBench(x, y));
  }

  createBench(x, y) {
    const [sx, sy] = this.toScreen(x, y);
    const g = this.add.graphics().setDepth(DEPTH.decor);
    g.fillStyle(0x5a3e2b, 1);
    g.fillRect(sx - this.S(40), sy, this.S(80), this.S(9));
    g.fillRect(sx - this.S(40), sy + this.S(16), this.S(80), this.S(9));
    g.fillStyle(0x222222, 1);
    g.fillRect(sx - this.S(45), sy - this.S(5), this.S(5), this.S(36));
    g.fillRect(sx + this.S(40), sy - this.S(5), this.S(5), this.S(36));
  }

  createStreetLamps() {
    [[90, 340], [330, 350], [440, 350], [678, 340]].forEach(([x, y]) => this.createStreetLamp(x, y));
  }

  createStreetLamp(x, y) {
    const [cx, cy] = this.toScreen(x, y);
    const glow = this.add.circle(cx, cy - this.S(26), this.S(24), 0xfff4cc, 0.2).setDepth(DEPTH.glow);
    this.tweens.add({
      targets: glow,
      alpha: { from: 0.14, to: 0.3 },
      duration: Phaser.Math.Between(1800, 2600),
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    const g = this.add.graphics().setDepth(DEPTH.decor);
    g.fillStyle(0x2c2c2c, 1);
    g.fillRect(cx - this.S(2), cy - this.S(22), this.S(4), this.S(48));
    g.fillCircle(cx, cy - this.S(22), this.S(3));
    g.fillStyle(0x3a3a3a, 1);
    g.fillRoundedRect(cx - this.S(9), cy - this.S(36), this.S(18), this.S(16), this.S(4));

    const bulb = this.add.circle(cx, cy - this.S(28), this.S(6), 0xfff4cc, 1).setDepth(DEPTH.glow);

    if (!this.lampGlows) this.lampGlows = [];
    this.lampGlows.push({ glow, bulb });
  }

  updateLamps(phase) {
    const lightsOn = sampleStops(phase, "lightsOn");
    this.lampGlows.forEach(({ glow, bulb }) => {
      bulb.setAlpha(Phaser.Math.Linear(0.15, 1, lightsOn));
      glow.setVisible(lightsOn > 0.05);
    });
    if (this.cityWindows) this.cityWindows.setAlpha(lightsOn);
    if (this.fountainGlow) this.fountainGlow.setAlpha(lightsOn * 0.6);
  }

  // ------------------------------------------------------------
  // 분수대: 물줄기 파티클 + 수면 파동 + 야간 조명
  // ------------------------------------------------------------
  createFountain() {
    const x = BASE_W / 2;
    const y = 390;
    const [cx, cy] = this.toScreen(x, y);

    const shadow = this.add.graphics().setDepth(DEPTH.fountainBase);
    shadow.fillStyle(0x000000, 0.2);
    shadow.fillEllipse(cx, cy + this.S(34), this.S(96), this.S(20));

    const g = this.add.graphics().setDepth(DEPTH.fountainBase);
    g.fillStyle(0xcfc9bd, 1);
    g.fillEllipse(cx, cy + this.S(20), this.S(88), this.S(34));
    g.fillStyle(0x4a78a0, 1);
    g.fillEllipse(cx, cy + this.S(17), this.S(68), this.S(24));
    g.fillStyle(0xcfc9bd, 1);
    g.fillRect(cx - this.S(8), cy - this.S(12), this.S(16), this.S(32));
    g.fillEllipse(cx, cy - this.S(14), this.S(34), this.S(15));
    g.fillStyle(0x4a78a0, 1);
    g.fillEllipse(cx, cy - this.S(14), this.S(20), this.S(8));

    this.fountainGlow = this.add.circle(cx, cy + this.S(14), this.S(60), 0xfff4cc, 0).setDepth(DEPTH.glow);

    // 수면 파동 (반복되는 확장 링)
    for (let i = 0; i < 3; i++) {
      const ring = this.add.circle(cx, cy + this.S(17), this.S(14), 0xffffff, 0).setDepth(DEPTH.fountainBase);
      ring.setStrokeStyle(this.S(1.4), 0xeaf6ff, 0.5);
      this.tweens.add({
        targets: ring,
        radius: this.S(34),
        alpha: { from: 0.5, to: 0 },
        duration: 2600,
        repeat: -1,
        delay: i * 850,
        ease: "Sine.easeOut",
      });
    }

    // 물줄기 파티클 (위로 솟았다가 포물선으로 떨어짐)
    this.add.particles(cx, cy - this.S(18), "droplet-tex", {
      speedY: { min: -this.S(120), max: -this.S(160) },
      speedX: { min: -this.S(12), max: this.S(12) },
      gravityY: this.S(260),
      lifespan: { min: 700, max: 950 },
      scale: { start: this.introScale * 1.1, end: this.introScale * 0.5 },
      alpha: { start: 0.95, end: 0 },
      frequency: 45,
      quantity: 1,
    }).setDepth(DEPTH.fountainBase);
  }

  // ------------------------------------------------------------
  // 벚꽃잎 파티클 (화면 전체, 항상 흩날림)
  // ------------------------------------------------------------
  createPetalEmitter() {
    const [ox] = this.toScreen(0, 0);
    const [, oy] = this.toScreen(0, -16);
    const width = BASE_W * this.introScale;

    this.petalEmitter = this.add.particles(0, 0, "petal-tex", {
      x: { min: ox, max: ox + width },
      y: oy,
      lifespan: { min: 11000, max: 17000 },
      speedY: { min: this.S(14), max: this.S(34) },
      speedX: { min: -this.S(18), max: this.S(26) },
      rotate: { min: 0, max: 360 },
      scale: { min: this.introScale * 0.5, max: this.introScale * 1.3 },
      alpha: { start: 0.95, end: 0.6 },
      frequency: 180,
      quantity: 1,
    }).setDepth(DEPTH.petals);
  }

  // ------------------------------------------------------------
  // 산책하는 사람들 (목표 지점으로 천천히 이동 -> 멈춤 -> 새 목표)
  // ------------------------------------------------------------
  createWalkingPeople() {
    this.people = [
      this.createPerson(140, 380, 0xff8fa3),
      this.createPerson(560, 420, 0x5c7cfa),
      this.createPerson(300, 400, 0xffffff),
      this.createPerson(470, 410, 0xffc857),
      this.createPerson(420, 300, 0x9bd1a4),
    ];
  }

  createPerson(x, y, shirtColor) {
    const [sx, sy] = this.toScreen(x, y);
    const container = this.add.container(sx, sy).setDepth(DEPTH.npc);

    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.22);
    shadow.fillEllipse(0, this.S(13), this.S(16), this.S(5));
    container.add(shadow);

    const visual = this.add.container(0, 0);
    const g = this.add.graphics();
    g.fillStyle(0x2b1d1d, 1);
    g.fillRect(-this.S(8), -this.S(28), this.S(16), this.S(14));
    g.fillStyle(0xffd0bd, 1);
    g.fillRect(-this.S(6), -this.S(22), this.S(12), this.S(12));
    g.fillStyle(0x111111, 1);
    g.fillCircle(-this.S(3), -this.S(17), this.S(1));
    g.fillCircle(this.S(3), -this.S(17), this.S(1));
    g.fillStyle(shirtColor, 1);
    g.fillRect(-this.S(7), -this.S(8), this.S(14), this.S(18));
    g.fillStyle(0x222222, 1);
    g.fillRect(-this.S(5), this.S(10), this.S(4), this.S(14));
    g.fillRect(this.S(2), this.S(10), this.S(4), this.S(14));
    visual.add(g);
    container.add(visual);

    container.visual = visual;
    container.facing = 1;
    container.walkTime = Phaser.Math.Between(0, 1000);
    container.baseX = x;
    container.baseY = y;
    container.targetX = x + Phaser.Math.Between(-70, 70);
    container.targetY = y + Phaser.Math.Between(-30, 30);
    container.speed = Phaser.Math.Between(16, 26);
    container.idle = 0;

    return container;
  }

  updatePeople(delta) {
    const dt = delta / 1000;
    this.people.forEach((p) => {
      const [tx, ty] = this.toScreen(p.targetX, p.targetY);
      const dx = tx - p.x;
      const dy = ty - p.y;
      const dist = Math.hypot(dx, dy);

      if (dist < this.S(4)) {
        p.idle += delta;
        if (p.idle > 1800) {
          p.targetX = Phaser.Math.Clamp(p.baseX + Phaser.Math.Between(-80, 80), 50, BASE_W - 50);
          p.targetY = Phaser.Math.Clamp(p.baseY + Phaser.Math.Between(-40, 40), 270, 460);
          p.idle = 0;
        }
        p.walkTime = 0;
        p.visual.y = 0;
        return;
      }

      const vx = (dx / dist) * this.S(p.speed) * dt;
      const vy = (dy / dist) * this.S(p.speed) * dt;
      p.x += vx;
      p.y += vy;
      if (vx > 0.1) p.facing = 1;
      else if (vx < -0.1) p.facing = -1;
      p.visual.scaleX = p.facing;

      p.walkTime += delta;
      p.visual.y = Math.sin(p.walkTime / 110) * this.S(1.6);
    });
  }

  // ------------------------------------------------------------
  // 강아지: 좌우 산책 + 꼬리 흔들기 (마우스/터치 포인터가 가까이 오면 신나게 흔든다)
  // ------------------------------------------------------------
  createDog() {
    const x = 250;
    const y = 450;
    const [cx, cy] = this.toScreen(x, y);
    const container = this.add.container(cx, cy).setDepth(DEPTH.npc);

    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.2);
    shadow.fillEllipse(0, this.S(10), this.S(22), this.S(7));
    container.add(shadow);

    const body = this.add.graphics();
    body.fillStyle(0xc99a5b, 1);
    body.fillRoundedRect(-this.S(12), -this.S(6), this.S(24), this.S(12), this.S(5));
    body.fillCircle(this.S(10), -this.S(8), this.S(7));
    body.fillStyle(0xa9794a, 1);
    body.fillTriangle(this.S(6), -this.S(14), this.S(12), -this.S(18), this.S(9), -this.S(10));
    body.fillTriangle(this.S(13), -this.S(14), this.S(17), -this.S(16), this.S(14), -this.S(9));
    body.fillStyle(0x2b1d12, 1);
    body.fillCircle(this.S(13), -this.S(9), this.S(1.2));
    body.fillStyle(0x111111, 1);
    body.fillRect(-this.S(12), this.S(4), this.S(5), this.S(6));
    body.fillRect(-this.S(2), this.S(4), this.S(5), this.S(6));
    body.fillRect(this.S(6), this.S(4), this.S(5), this.S(6));
    container.add(body);

    const tail = this.add.container(-this.S(12), -this.S(2));
    const tailG = this.add.graphics();
    tailG.fillStyle(0xc99a5b, 1);
    tailG.fillRoundedRect(-this.S(2), -this.S(8), this.S(5), this.S(10), this.S(2));
    tail.add(tailG);
    container.add(tail);

    container.tail = tail;
    container.baseX = x;
    container.range = 90;
    container.direction = 1;
    container.speed = 22;
    container.isWagging = false;
    container.tailTween = this.tweens.add({
      targets: tail,
      angle: { from: -6, to: 6 },
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.dog = container;
  }

  updateDog(delta) {
    const dog = this.dog;
    if (!dog) return;
    const dt = delta / 1000;
    const [baseSx] = this.toScreen(dog.baseX, 0);
    dog.x += dog.direction * this.S(dog.speed) * dt;
    if (dog.x > baseSx + this.S(dog.range)) dog.direction = -1;
    else if (dog.x < baseSx - this.S(dog.range)) dog.direction = 1;
    dog.setScale(dog.direction, 1);

    const pointer = this.input.activePointer;
    const near = pointer && Phaser.Math.Distance.Between(pointer.x, pointer.y, dog.x, dog.y) < this.S(70);
    if (near !== dog.isWagging) {
      dog.isWagging = near;
      if (dog.tailTween) dog.tailTween.stop();
      dog.tailTween = this.tweens.add({
        targets: dog.tail,
        angle: near ? { from: -25, to: 25 } : { from: -6, to: 6 },
        duration: near ? 140 : 900,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }
  }

  // ------------------------------------------------------------
  // 하늘을 가로지르는 새
  // ------------------------------------------------------------
  createBird() {
    const [ox, oy] = this.toScreen(-60, 70);
    const bird = this.add.container(ox, oy).setDepth(DEPTH.birds).setVisible(false);
    const g = this.add.graphics();
    g.fillStyle(0x2c2c2c, 1);
    g.fillTriangle(-this.S(8), this.S(2), 0, -this.S(4), 0, this.S(2));
    g.fillTriangle(this.S(8), this.S(2), 0, -this.S(4), 0, this.S(2));
    bird.add(g);
    this.bird = bird;
    this.flyBirdAcross();
  }

  flyBirdAcross() {
    const startY = Phaser.Math.Between(50, 110);
    const [startX] = this.toScreen(-60, 0);
    const [, sy] = this.toScreen(0, startY);
    const [endX] = this.toScreen(BASE_W + 60, 0);
    this.bird.setPosition(startX, sy);
    this.bird.setScale(1, 1);
    this.bird.setVisible(true);

    const flap = this.tweens.add({
      targets: this.bird,
      scaleY: { from: 1, to: 0.45 },
      duration: 220,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.tweens.add({
      targets: this.bird,
      x: endX,
      y: sy + this.S(Phaser.Math.Between(-20, 20)),
      duration: Phaser.Math.Between(14000, 19000),
      ease: "Sine.easeInOut",
      onComplete: () => {
        flap.stop();
        this.bird.setVisible(false);
        this.time.delayedCall(Phaser.Math.Between(8000, 18000), () => this.flyBirdAcross());
      },
    });
  }

  // ------------------------------------------------------------
  // 낮/밤 어두움 오버레이 (전체 화면을 균일하게 어둡게 — 가벼운 day/night 표현)
  // ------------------------------------------------------------
  createAmbientOverlay() {
    this.overlay = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x0a1030, 0)
      .setOrigin(0, 0)
      .setDepth(DEPTH.overlay);
  }

  // ------------------------------------------------------------
  // 타이틀 UI
  // ------------------------------------------------------------
  createTitleUI() {
    const scale = this.introScale;
    const isMobile = this.isMobile;

    // 모바일은 introScale 자체가 작아서(가로폭 기준) 글자/버튼을 거기에 그대로
    // 묶으면 너무 작아진다. 제목/PLAY 버튼은 화면 실제 크기를 기준으로 따로
    // 크기·위치를 정해, 배경 그림은 작아도 UI는 "모바일 게임처럼" 크게 보이게 한다.
    const titleFontPx = isMobile
      ? Math.round(Phaser.Math.Clamp(this.scale.width * 0.1, 30, 44))
      : 42 * scale;
    const subtitleFontPx = isMobile
      ? Math.round(Phaser.Math.Clamp(this.scale.width * 0.042, 13, 18))
      : 17 * scale;
    const playFontPx = isMobile
      ? Math.round(Phaser.Math.Clamp(this.scale.width * 0.075, 22, 30))
      : 32 * scale;
    const playPaddingX = isMobile ? Math.round(this.scale.width * 0.09) : 30 * scale;
    // 폰트 + 패딩 합이 항상 48px 이상이 되도록 모바일은 고정 18px 패딩을 쓴다
    const playPaddingY = isMobile ? 18 : 12 * scale;

    const [titleX, titleY] = isMobile
      ? [this.scale.width / 2, this.scale.height * 0.16]
      : this.toScreen(384, 110);
    const [subX, subY] = isMobile
      ? [this.scale.width / 2, this.scale.height * 0.27]
      : this.toScreen(384, 162);
    const [playX, playY] = isMobile
      ? [this.scale.width / 2, this.scale.height * 0.5]
      : this.toScreen(384, 295);

    const title = this.add
      // 모바일은 좁은 화면에 어울리게 이름을 2줄로 나눠 표시한다
      .text(titleX, titleY, isMobile ? "KIM\nHYUNNEUNG" : "KIM HYUNNEUNG", {
        fontFamily: "monospace",
        fontSize: `${titleFontPx}px`,
        color: "#ffffff",
        align: "center",
        lineSpacing: 4,
        stroke: "#333333",
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setDepth(DEPTH.ui);

    this.add
      .text(subX, subY, "Frontend Developer\nReact Native Developer", {
        fontFamily: "monospace",
        fontSize: `${subtitleFontPx}px`,
        color: "#ffffff",
        align: "center",
        lineSpacing: 6,
        stroke: "#333333",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(DEPTH.ui);

    const playButton = this.add
      .text(playX, playY, "PLAY", {
        fontFamily: "monospace",
        fontSize: `${playFontPx}px`,
        color: "#ffffff",
        backgroundColor: "#e76f51",
        padding: { x: playPaddingX, y: playPaddingY },
      })
      .setOrigin(0.5)
      .setDepth(DEPTH.ui)
      .setInteractive({ useHandCursor: true });

    playButton.on("pointerdown", () => {
      this.scene.start("GardenScene");
    });
    playButton.on("pointerover", () => playButton.setScale(1.06));
    playButton.on("pointerout", () => playButton.setScale(1));

    this.tweens.add({
      targets: title,
      y: titleY - 10,
      duration: 900,
      yoyo: true,
      repeat: -1,
    });
  }

  update(time, delta) {
    this.cyclePhase = (this.cyclePhase + delta / CYCLE_MS) % 1;

    this.updateCelestialBodies(this.cyclePhase);
    this.updateReflections(this.cyclePhase);
    this.updateLamps(this.cyclePhase);
    this.updateClouds(delta);
    this.updatePeople(delta);
    this.updateDog(delta);

    if (this.overlay) {
      this.overlay.setFillStyle(0x0a1030, sampleStops(this.cyclePhase, "ambient"));
    }
  }
}
