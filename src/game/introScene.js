import Phaser from "phaser";

export class IntroScene extends Phaser.Scene {
  constructor() {
    super("IntroScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#6fb7c8");

    // 디자인 기준 해상도(768x512)를 실제 캔버스 크기에 맞춰
    // 비율을 유지한 채 스케일/중앙 정렬한다 (모바일 세로 화면 대응).
    const baseW = 768;
    const baseH = 512;
    const scale = Math.min(this.scale.width / baseW, this.scale.height / baseH);
    this.introScale = scale;
    this.introOffsetX = (this.scale.width - baseW * scale) / 2;
    this.introOffsetY = (this.scale.height - baseH * scale) / 2;

    this.drawIntroMap();

    const title = this.add
      .text(...this.toScreen(384, 170), "KIM HYUNNEUNG", {
        fontFamily: "monospace",
        fontSize: `${42 * scale}px`,
        color: "#ffffff",
        stroke: "#333333",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    this.add
      .text(...this.toScreen(384, 225), "FRONT-END DEVELOPER PORTFOLIO", {
        fontFamily: "monospace",
        fontSize: `${20 * scale}px`,
        color: "#ffffff",
        stroke: "#333333",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    const playButton = this.add
      .text(...this.toScreen(384, 310), "PLAY", {
        fontFamily: "monospace",
        fontSize: `${32 * scale}px`,
        color: "#ffffff",
        backgroundColor: "#e76f51",
        padding: { x: 30 * scale, y: 12 * scale },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    playButton.on("pointerdown", () => {
      this.scene.start("GardenScene");
    });

    // 제목 살짝 움직이기
    this.tweens.add({
      targets: title,
      y: this.toScreen(384, 160)[1],
      duration: 900,
      yoyo: true,
      repeat: -1,
    });

    // 사람들 움직이기
    this.createWalkingPeople();
  }

  toScreen(x, y) {
    return [this.introOffsetX + x * this.introScale, this.introOffsetY + y * this.introScale];
  }

  drawIntroMap() {
    const g = this.add.graphics();
    const s = this.introScale;
    const ox = this.introOffsetX;
    const oy = this.introOffsetY;
    const rect = (x, y, w, h) => g.fillRect(ox + x * s, oy + y * s, w * s, h * s);

    // 물 (전체 캔버스를 채워 레터박스 여백도 자연스럽게 메운다)
    g.fillStyle(0x1f8ca8, 1);
    g.fillRect(0, 0, this.scale.width, this.scale.height);

    // 회색 광장
    g.fillStyle(0xb8b8b8, 1);
    rect(120, 0, 520, 512);

    // 벽돌 패턴
    g.lineStyle(Math.max(1, s), 0x666666, 0.5);
    for (let y = 0; y < 512; y += 24) {
      g.lineBetween(ox + 120 * s, oy + y * s, ox + 640 * s, oy + y * s);
    }
    for (let x = 120; x < 640; x += 24) {
      g.lineBetween(ox + x * s, oy, ox + x * s, oy + 512 * s);
    }

    // 잔디
    g.fillStyle(0x2f8f45, 1);
    g.fillRoundedRect(ox + 70 * s, oy + 80 * s, 180 * s, 70 * s, 12 * s);
    g.fillRoundedRect(ox + 520 * s, oy + 250 * s, 150 * s, 60 * s, 12 * s);

    // 분수
    g.fillStyle(0xcccccc, 1);
    g.fillCircle(ox + 210 * s, oy + 330 * s, 45 * s);
    g.fillStyle(0x4cc9f0, 1);
    g.fillCircle(ox + 210 * s, oy + 330 * s, 28 * s);
    g.fillStyle(0xffffff, 0.8);
    g.fillCircle(ox + 210 * s, oy + 300 * s, 8 * s);

    // 벤치
    this.drawBench(120, 180);
    this.drawBench(520, 260);
  }

  drawBench(x, y) {
    const g = this.add.graphics();
    const s = this.introScale;
    const ox = this.introOffsetX;
    const oy = this.introOffsetY;
    const sx = ox + x * s;
    const sy = oy + y * s;
    g.fillStyle(0x5a3e2b, 1);
    g.fillRect(sx, sy, 80 * s, 10 * s);
    g.fillRect(sx, sy + 18 * s, 80 * s, 10 * s);
    g.fillStyle(0x222222, 1);
    g.fillRect(sx - 5 * s, sy - 5 * s, 5 * s, 40 * s);
    g.fillRect(sx + 80 * s, sy - 5 * s, 5 * s, 40 * s);
  }

  createWalkingPeople() {
    const people = [
      this.createTinyPerson(120, 420, 0xff8fa3),
      this.createTinyPerson(650, 150, 0x5c7cfa),
      this.createTinyPerson(300, 380, 0xffffff),
      this.createTinyPerson(520, 420, 0xffc857),
    ];

    people.forEach((person, index) => {
      this.tweens.add({
        targets: person,
        x: person.x + Phaser.Math.Between(-60, 80) * this.introScale,
        duration: 1800 + index * 300,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    });
  }

  createTinyPerson(x, y, shirtColor) {
    const [sx, sy] = this.toScreen(x, y);
    const c = this.add.container(sx, sy);
    c.setScale(this.introScale);
    const g = this.add.graphics();

    // 머리
    g.fillStyle(0x2b1d1d, 1);
    g.fillRect(-8, -28, 16, 14);

    // 얼굴
    g.fillStyle(0xffd0bd, 1);
    g.fillRect(-6, -22, 12, 12);

    // 눈
    g.fillStyle(0x111111, 1);
    g.fillCircle(-3, -17, 1);
    g.fillCircle(3, -17, 1);

    // 몸
    g.fillStyle(shirtColor, 1);
    g.fillRect(-7, -8, 14, 18);

    // 다리
    g.fillStyle(0x222222, 1);
    g.fillRect(-5, 10, 4, 14);
    g.fillRect(2, 10, 4, 14);

    c.add(g);
    return c;
  }
}