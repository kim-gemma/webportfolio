import Phaser from "phaser";

export class IntroScene extends Phaser.Scene {
  constructor() {
    super("IntroScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#6fb7c8");

    this.drawIntroMap();

    const title = this.add
      .text(384, 170, "KIM HYUNNEUNG", {
        fontFamily: "monospace",
        fontSize: "42px",
        color: "#ffffff",
        stroke: "#333333",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    this.add
      .text(384, 225, "FRONT-END DEVELOPER PORTFOLIO", {
        fontFamily: "monospace",
        fontSize: "20px",
        color: "#ffffff",
        stroke: "#333333",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    const playButton = this.add
      .text(384, 310, "PLAY", {
        fontFamily: "monospace",
        fontSize: "32px",
        color: "#ffffff",
        backgroundColor: "#e76f51",
        padding: { x: 30, y: 12 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    playButton.on("pointerdown", () => {
      this.scene.start("GardenScene");
    });

    // 제목 살짝 움직이기
    this.tweens.add({
      targets: title,
      y: 160,
      duration: 900,
      yoyo: true,
      repeat: -1,
    });

    // 사람들 움직이기
    this.createWalkingPeople();
  }

  drawIntroMap() {
    const g = this.add.graphics();

    // 물
    g.fillStyle(0x1f8ca8, 1);
    g.fillRect(0, 0, 768, 512);

    // 회색 광장
    g.fillStyle(0xb8b8b8, 1);
    g.fillRect(120, 0, 520, 512);

    // 벽돌 패턴
    g.lineStyle(1, 0x666666, 0.5);
    for (let y = 0; y < 512; y += 24) {
      g.lineBetween(120, y, 640, y);
    }
    for (let x = 120; x < 640; x += 24) {
      g.lineBetween(x, 0, x, 512);
    }

    // 잔디
    g.fillStyle(0x2f8f45, 1);
    g.fillRoundedRect(70, 80, 180, 70, 12);
    g.fillRoundedRect(520, 250, 150, 60, 12);

    // 분수
    g.fillStyle(0xcccccc, 1);
    g.fillCircle(210, 330, 45);
    g.fillStyle(0x4cc9f0, 1);
    g.fillCircle(210, 330, 28);
    g.fillStyle(0xffffff, 0.8);
    g.fillCircle(210, 300, 8);

    // 벤치
    this.drawBench(120, 180);
    this.drawBench(520, 260);
  }

  drawBench(x, y) {
    const g = this.add.graphics();
    g.fillStyle(0x5a3e2b, 1);
    g.fillRect(x, y, 80, 10);
    g.fillRect(x, y + 18, 80, 10);
    g.fillStyle(0x222222, 1);
    g.fillRect(x - 5, y - 5, 5, 40);
    g.fillRect(x + 80, y - 5, 5, 40);
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
        x: person.x + Phaser.Math.Between(-60, 80),
        duration: 1800 + index * 300,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    });
  }

  createTinyPerson(x, y, shirtColor) {
    const c = this.add.container(x, y);
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