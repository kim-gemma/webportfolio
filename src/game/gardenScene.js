// ============================================================
// Phaser 게임 씬: "코드 정원" 탐험 맵
// 캐릭터가 타일맵을 돌아다니며 각 구역(Zone)에 들어가면
// React 쪽으로 콜백을 보내 모달을 띄운다.
// 외부 스프라이트 없이 Phaser Graphics API로 모든 비주얼을 그린다.
// ============================================================
import Phaser from "phaser";

export const TILE = 32;
export const MAP_COLS = 24;
export const MAP_ROWS = 16;
export const WORLD_W = TILE * MAP_COLS;
export const WORLD_H = TILE * MAP_ROWS;

const COLORS = {
  grassA: 0x4a7c59,
  grassB: 0x537f63,
  path: 0xd9b370,
  pathEdge: 0xc4a05f,
  water: 0x355c7d,
  waterLight: 0x4a78a0,
  building: 0x6b4f3a,
  buildingRoof: 0xb5563a,
  buildingRoofShadow: 0x9a4730,
  signpost: 0x8a6d4b,
  flowerPink: 0xe98ca0,
  flowerYellow: 0xf4d35e,
  treeTrunk: 0x5c4530,
  treeLeaf: 0x3f6b4a,
  treeLeafLight: 0x4d8159,
  playerBody: 0xf4a259,
  playerShirt: 0x7ec8c9,
  outline: 0x1a1f2e,
};

// 맵 위 의미있는 구역들. 좌표는 타일 기준.
export const ZONES = [
  {
    key: "about",
    label: "About Me",
    tile: { x: 3, y: 3 },
    icon: "house",
    color: COLORS.buildingRoof,
  },
  {
    key: "skills",
    label: "Skills",
    tile: { x: 19, y: 3 },
    icon: "book",
    color: 0x7ec8c9,
  },
  {
    key: "experience",
    label: "Experience",
    tile: { x: 3, y: 12 },
    icon: "scroll",
    color: 0xc99a3b,
  },
  {
    key: "projects",
    label: "Projects",
    tile: { x: 19, y: 12 },
    icon: "board",
    color: 0xe98ca0,
  },
  {
    key: "contact",
    label: "Contact",
    tile: { x: 11, y: 8 },
    icon: "mailbox",
    color: 0xf4a259,
  },
];

const ZONE_RADIUS = TILE * 1.4;

export function createGardenScene({ onZoneEnter, onZoneExit, onReady }) {
  class GardenScene extends Phaser.Scene {
    constructor() {
      super("GardenScene");
      this.activeZone = null;
      this.cursors = null;
      this.player = null;
      this.zoneMarkers = {};
      this.joystickVector = { x: 0, y: 0 };
    }

    preload() {
      // 모든 비주얼은 procedural graphics로 생성하므로 외부 에셋 로드가 필요 없다.
    }

    create() {
      this.cameras.main.setBackgroundColor("#d8d0c3");

      this.drawCityGround();
      this.drawFoodTruck(250, 90);
      this.drawFoodTruck(1050, 90);
      this.drawFoodTruck(1750, 90);
     
      this.drawDecorations();
      this.drawZoneBuildings();

      this.createPlayer();
      this.createCrowdCharacters();
      this.createZoneLabels();

      this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);
      this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
      this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
      this.updateCameraZoom();

      this.scale.on("resize", () => {
        this.updateCameraZoom();
      });

      this.cursors = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        up2: Phaser.Input.Keyboard.KeyCodes.UP,
        down2: Phaser.Input.Keyboard.KeyCodes.DOWN,
        left2: Phaser.Input.Keyboard.KeyCodes.LEFT,
        right2: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      });

      if (onReady) onReady(this);
    }

    updateCameraZoom() {
      const screenW = this.scale.width;
      const screenH = this.scale.height;

      const zoomX = screenW / WORLD_W;
      const zoomY = screenH / WORLD_H;

      const zoom = Math.max(zoomX, zoomY);

      this.cameras.main.setZoom(zoom);
    }

    // 잔디 바닥 타일 패턴
    drawCityGround() {
      const g = this.add.graphics();

      // 전체 바닥
      g.fillStyle(0xd8d0c3, 1);
      g.fillRect(0, 0, WORLD_W, WORLD_H);

      // 인도
      g.fillStyle(0xd9d4ca, 1);
      g.fillRect(0, 90, WORLD_W, 120);

      // 잔디
      g.fillStyle(0x2f8f45, 1);
      g.fillRect(0, 210, WORLD_W, WORLD_H - 210);

      // 잔디 디테일
      g.fillStyle(0x24783a, 1);
      for (let i = 0; i < 80; i++) {
        const x = Phaser.Math.Between(0, WORLD_W);
        const y = Phaser.Math.Between(220, WORLD_H);
        g.fillRect(x, y, 4, 8);
      }

      // 대각선 벽돌길
      g.fillStyle(0x9e9e9e, 1);
      g.beginPath();
      g.moveTo(330, 260);
      g.lineTo(WORLD_W, 330);
      g.lineTo(WORLD_W, WORLD_H);
      g.lineTo(420, WORLD_H);
      g.closePath();
      g.fillPath();

    }

    drawFoodTruck(x = 250, y = 90) {
      const g = this.add.graphics();

      g.fillStyle(0xffb000, 1);
      g.fillRect(x, y, 270, 95);

      g.fillStyle(0x2f2f3f, 1);
      g.fillRect(x + 25, y + 35, 100, 45);

      g.fillStyle(0x2ea83a, 1);
      g.fillRect(x + 20, y + 25, 110, 18);

      g.fillStyle(0xffc21a, 1);
      g.fillRect(x + 190, y + 20, 70, 70);

      g.fillStyle(0x9fd3ff, 1);
      g.fillRect(x + 205, y + 30, 35, 35);

      g.fillStyle(0x222222, 1);
      g.fillCircle(x + 80, y + 95, 20);
      g.fillCircle(x + 220, y + 95, 20);

      g.fillStyle(0x555555, 1);
      g.fillCircle(x + 80, y + 95, 10);
      g.fillCircle(x + 220, y + 95, 10);
    }
    

    
    // 나무, 꽃 같은 장식 (충돌 없음, 분위기용)
    drawDecorations() {
      const g = this.add.graphics();
      const treeSpots = [
        [1, 1], [1, 14], [22, 1], [22, 14],
        [7, 1], [16, 1], [1, 7], [22, 8],
        [7, 14], [16, 14],
      ];
      treeSpots.forEach(([col, row]) => {
        const cx = col * TILE + TILE / 2;
        const cy = row * TILE + TILE / 2;
        g.fillStyle(COLORS.treeTrunk, 1);
        g.fillRect(cx - 4, cy + 2, 8, 12);
        g.fillStyle(COLORS.treeLeaf, 1);
        g.fillCircle(cx, cy - 6, 14);
        g.fillStyle(COLORS.treeLeafLight, 1);
        g.fillCircle(cx - 4, cy - 10, 8);
      });

      const flowerSpots = [
        [5, 6, COLORS.flowerPink], [6, 6, COLORS.flowerYellow],
        [17, 6, COLORS.flowerPink], [18, 6, COLORS.flowerYellow],
        [5, 10, COLORS.flowerYellow], [17, 10, COLORS.flowerPink],
        [9, 4, COLORS.flowerPink], [14, 11, COLORS.flowerYellow],
      ];
      flowerSpots.forEach(([col, row, color]) => {
        const cx = col * TILE + TILE / 2;
        const cy = row * TILE + TILE / 2;
        g.fillStyle(color, 1);
        g.fillCircle(cx - 3, cy, 3);
        g.fillCircle(cx + 3, cy, 3);
        g.fillCircle(cx, cy - 3, 3);
        g.fillCircle(cx, cy + 3, 3);
        g.fillStyle(0xffffff, 0.9);
        g.fillCircle(cx, cy, 2);
      });
    }

    // 각 zone 위치에 작은 건물/오브젝트 아이콘을 그린다
    drawZoneBuildings() {
      ZONES.forEach((zone) => {
        const g = this.add.graphics();
        const cx = zone.tile.x * TILE + TILE / 2;
        const cy = zone.tile.y * TILE + TILE / 2;

        // 바닥 받침대
        g.fillStyle(0x000000, 0.25);
        g.fillEllipse(cx, cy + 18, 40, 14);

        if (zone.icon === "house") {
          g.fillStyle(COLORS.building, 1);
          g.fillRect(cx - 22, cy - 6, 44, 30);
          g.fillStyle(COLORS.buildingRoofShadow, 1);
          g.fillTriangle(cx - 28, cy - 6, cx + 28, cy - 6, cx, cy - 34);
          g.fillStyle(COLORS.buildingRoof, 1);
          g.fillTriangle(cx - 26, cy - 8, cx + 26, cy - 8, cx, cy - 32);
          g.fillStyle(0xf0ebe1, 1);
          g.fillRect(cx - 6, cy + 6, 12, 18);
        } else if (zone.icon === "book") {
          g.fillStyle(0x5c4530, 1);
          g.fillRect(cx - 20, cy + 10, 40, 8);
          g.fillStyle(0x7ec8c9, 1);
          g.fillRect(cx - 16, cy - 18, 10, 28);
          g.fillStyle(0xf4d35e, 1);
          g.fillRect(cx - 4, cy - 22, 10, 32);
          g.fillStyle(0xe98ca0, 1);
          g.fillRect(cx + 8, cy - 14, 10, 24);
        } else if (zone.icon === "scroll") {
          g.fillStyle(0xc99a3b, 1);
          g.fillRoundedRect(cx - 18, cy - 22, 36, 44, 6);
          g.fillStyle(0xf0ebe1, 1);
          g.fillRoundedRect(cx - 13, cy - 16, 26, 32, 3);
          g.lineStyle(2, 0xc99a3b, 0.8);
          for (let i = 0; i < 4; i++) {
            g.lineBetween(cx - 9, cy - 8 + i * 6, cx + 9, cy - 8 + i * 6);
          }
        } else if (zone.icon === "board") {
          g.fillStyle(0x8a6d4b, 1);
          g.fillRect(cx - 3, cy - 4, 6, 30);
          g.fillStyle(0xe98ca0, 0.9);
          g.fillRoundedRect(cx - 24, cy - 30, 48, 32, 4);
          g.fillStyle(0xf0ebe1, 1);
          g.fillRect(cx - 18, cy - 24, 14, 10);
          g.fillRect(cx - 2, cy - 24, 14, 10);
          g.fillRect(cx - 18, cy - 10, 14, 6);
        } else if (zone.icon === "mailbox") {
          g.fillStyle(0x8a6d4b, 1);
          g.fillRect(cx - 3, cy, 6, 22);
          g.fillStyle(0xf4a259, 1);
          g.fillRoundedRect(cx - 14, cy - 24, 28, 22, 8);
          g.fillStyle(0xc4863f, 1);
          g.fillRect(cx - 14, cy - 6, 28, 4);
        }

        // 외곽선 느낌의 글로우 (펄스 애니메이션 대상)
        const glow = this.add.circle(cx, cy, ZONE_RADIUS, zone.color, 0.08);
        glow.setStrokeStyle(2, zone.color, 0.35);
        this.tweens.add({
          targets: glow,
          alpha: { from: 0.06, to: 0.16 },
          duration: 1400,
          yoyo: true,
          repeat: -1,
        });

        this.zoneMarkers[zone.key] = { cx, cy, glow };
      });
    }

    createCrowdCharacters() {
      this.createCharacter(210, 310, "me");
      this.createCharacter(260, 260, "redShirt");
      this.createCharacter(300, 250, "catStudent");
      this.createCharacter(345, 260, "rabbitWoman");
      this.createCharacter(390, 265, "developer");
      this.createCharacter(450, 240, "man");
      this.createCharacter(520, 320, "cafeGuest");
      this.createCharacter(590, 290, "redShirt");
      this.createCharacter(650, 335, "lionWorker");
      this.createCharacter(120, 370, "girlPink");
    }

    createZoneLabels() {
      ZONES.forEach((zone) => {
        const marker = this.zoneMarkers[zone.key];
        const label = this.add
          .text(marker.cx, marker.cy + 40, zone.label, {
            fontFamily: "monospace",
            fontSize: "11px",
            color: "#f0ebe1",
            backgroundColor: "#1a1f2eaa",
            padding: { x: 6, y: 3 },
          })
          .setOrigin(0.5);
        marker.label = label;
      });
    }

    
    createNpcCharacters() {
    this.createCharacter(220, 180, "redShirt");
    this.createCharacter(500, 220, "sleeping");
    this.createCharacter(620, 350, "woman");
    this.createCharacter(300, 400, "man");
    }

    createCharacter(x, y, type = "woman") {
      const container = this.add.container(x, y);
      const g = this.add.graphics();

      // 그림자
      g.fillStyle(0x000000, 0.25);
      g.fillEllipse(0, 22, 30, 8);

      switch (type) {

        case "me":
        case "rabbitWoman":
        case "catStudent":
        case "lionWorker":
        case "developer":
        case "cafeGuest":
        case "girlPink":
          this.drawStandingPerson(g, type);
          break;

        case "woman":
          // 긴머리 여성
          g.fillStyle(0x2b1d1d, 1);
          g.fillRect(-12, -34, 24, 26);

          g.fillStyle(0xffd0bd, 1);
          g.fillRect(-8, -30, 16, 16);

          g.fillStyle(0xffffff, 1);
          g.fillRect(-10, -10, 20, 12);

          g.fillStyle(0x4d7cff, 1);
          g.fillTriangle(-12, 2, 12, 2, 0, 20);

          g.fillStyle(0xffd0bd, 1);
          g.fillRect(-5, 18, 4, 12);
          g.fillRect(2, 18, 4, 12);

          g.fillStyle(0x111111, 1);
          g.fillRect(-7, 30, 8, 4);
          g.fillRect(1, 30, 8, 4);
          break;

        case "man":
          // 남성
          g.fillStyle(0x111111, 1);
          g.fillRect(-10, -32, 20, 12);

          g.fillStyle(0xffd0bd, 1);
          g.fillRect(-8, -24, 16, 16);

          g.fillStyle(0x6ac3ff, 1);
          g.fillRect(-10, -6, 20, 20);

          g.fillStyle(0x333333, 1);
          g.fillRect(-5, 14, 4, 18);
          g.fillRect(2, 14, 4, 18);
          break;

        case "redShirt":
          // 이미지 속 빨간 줄무늬 사람
          g.fillStyle(0x402030, 1);
          g.fillRect(-12, -34, 22, 24);

          g.fillStyle(0xffd0bd, 1);
          g.fillRect(-6, -28, 16, 16);

          g.fillStyle(0xe63946, 1);
          g.fillRect(-10, -10, 20, 20);

          g.fillStyle(0xffffff, 1);
          g.fillRect(-10, -3, 20, 3);
          g.fillRect(-10, 4, 20, 3);

          g.fillStyle(0x223355, 1);
          g.fillRect(-5, 10, 4, 20);
          g.fillRect(2, 10, 4, 20);
          break;

        case "sleeping":
          // 바닥에 누운 사람
          g.fillStyle(0xffd0bd, 1);
          g.fillCircle(-18, 0, 12);

          g.fillStyle(0x111111, 1);
          g.fillRect(-5, -8, 30, 16);

          g.fillStyle(0x0f4fa8, 1);
          g.fillRect(20, -6, 30, 12);

          g.fillStyle(0x000000, 1);
          g.fillRect(46, -5, 10, 8);
          break;
      }

      container.add(g);

      return container;
    }

    drawStandingPerson(g, type) {

  const styles = {
    me: [0x2b1d1d, 0xffd0bd, 0xffc0cb, 0xff8fa3],
    rabbitWoman: [0x2b1d1d, 0xffd0bd, 0xffffff, 0xf3c6d8],
    catStudent: [0x111111, 0xffd0bd, 0xffffff, 0x333366],
    lionWorker: [0x8a5a2b, 0xffc49b, 0x222222, 0x444444],
    developer: [0x2b1d1d, 0xffd0bd, 0x5c7cfa, 0x222222],
    cafeGuest: [0x3a2a22, 0xffd0bd, 0xc98b5c, 0x355c7d],
    girlPink: [0x6b3a2e, 0xffd0bd, 0xff5c8a, 0xffb36b],
  };

  const [hair, skin, top, bottom] = styles[type];

    // 머리
    g.fillStyle(hair, 1);
    g.fillRect(-12, -36, 24, 28);

    // 얼굴
    g.fillStyle(skin, 1);
    g.fillRoundedRect(-9, -31, 18, 19, 4);

    // 눈
    g.fillStyle(0x111111, 1);
    g.fillCircle(-4, -24, 1.8);
    g.fillCircle(4, -24, 1.8);

    // 코
    g.fillStyle(0xd99680, 1);
    g.fillRect(-1, -22, 2, 4);

    // 입
    g.fillStyle(0xd96b7c, 1);
    g.fillRect(-3, -17, 6, 2);

    // 목
    g.fillStyle(skin, 1);
    g.fillRect(-3, -12, 6, 5);

    // 상의
    g.fillStyle(top, 1);
    g.fillRoundedRect(-11, -8, 22, 18, 3);

    // 팔
    g.fillStyle(skin, 1);
    g.fillRect(-15, -5, 5, 15);
    g.fillRect(10, -5, 5, 15);

    // 하의
    g.fillStyle(bottom, 1);
    g.fillRect(-9, 10, 7, 18);
    g.fillRect(2, 10, 7, 18);

    // 신발
    g.fillStyle(0x111111, 1);
    g.fillRect(-10, 28, 9, 4);
    g.fillRect(1, 28, 9, 4);

    // 개발자 노트북
    if (type === "developer") {
      g.fillStyle(0x333333, 1);
      g.fillRect(10, 0, 18, 12);
      g.fillStyle(0xdddddd, 1);
      g.fillRect(12, 2, 14, 8);
    }
  }

    createPlayer() {
      const startX = (MAP_COLS / 2) * TILE;
      const startY = (MAP_ROWS / 2) * TILE + TILE * 2;

      const container = this.add.container(startX, startY);

      const g = this.add.graphics();

      this.drawStandingPerson(g, "me");

      container.add(g);

      this.physics.world.enable(container);

      container.body.setSize(20, 50);
      container.body.setOffset(-10, -20);
      container.body.setCollideWorldBounds(true);

      this.player = container;
    }

    setJoystickVector(x, y) {
      this.joystickVector.x = x;
      this.joystickVector.y = y;
    }

    update() {
      const isSmallScreen = this.scale.width < 768;
      const speed = isSmallScreen ? 110 : 160;
      let vx = 0;
      let vy = 0;

      if (this.cursors) {
        if (this.cursors.left.isDown || this.cursors.left2.isDown) vx -= 1;
        if (this.cursors.right.isDown || this.cursors.right2.isDown) vx += 1;
        if (this.cursors.up.isDown || this.cursors.up2.isDown) vy -= 1;
        if (this.cursors.down.isDown || this.cursors.down2.isDown) vy += 1;
      }

      // 모바일 가상 조이스틱 입력 병합
      vx += this.joystickVector.x;
      vy += this.joystickVector.y;
      vx = Phaser.Math.Clamp(vx, -1, 1);
      vy = Phaser.Math.Clamp(vy, -1, 1);

      const len = Math.hypot(vx, vy) || 1;
      this.player.body.setVelocity((vx / len) * speed, (vy / len) * speed);
      this.checkMapTransition();

      // 가장 가까운 zone 체크
      let nearestZone = null;
      let nearestDist = Infinity;
      ZONES.forEach((zone) => {
        const marker = this.zoneMarkers[zone.key];
        const d = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          marker.cx,
          marker.cy
        );
        if (d < ZONE_RADIUS && d < nearestDist) {
          nearestDist = d;
          nearestZone = zone.key;
        }
      });

      if (nearestZone !== this.activeZone) {
        if (this.activeZone && onZoneExit) onZoneExit(this.activeZone);
        if (nearestZone && onZoneEnter) onZoneEnter(nearestZone);
        this.activeZone = nearestZone;
      }
    }

    checkMapTransition() {
      if (this.player.x > WORLD_W + 20) {
        this.currentMapIndex += 1;

        this.cameras.main.fadeOut(300, 0, 0, 0);

        this.time.delayedCall(300, () => {
          this.player.x = 20;

          this.redrawMapByIndex();

          this.cameras.main.fadeIn(300, 0, 0, 0);
        });
      }

      if (this.player.x < -20) {
        this.currentMapIndex = Math.max(0, this.currentMapIndex - 1);

        this.cameras.main.fadeOut(300, 0, 0, 0);

        this.time.delayedCall(300, () => {
          this.player.x = WORLD_W - 20;

          this.redrawMapByIndex();

          this.cameras.main.fadeIn(300, 0, 0, 0);
        });
      }
    }

    redrawMapByIndex() {
      if (this.currentMapIndex % 3 === 0) {
        this.cameras.main.setBackgroundColor("#d8d0c3");
      }

      if (this.currentMapIndex % 3 === 1) {
        this.cameras.main.setBackgroundColor("#8ecae6");
      }

      if (this.currentMapIndex % 3 === 2) {
        this.cameras.main.setBackgroundColor("#2f8f45");
      }
    }
  }

  return GardenScene;
}
