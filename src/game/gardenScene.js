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
// 월드를 3개의 화면으로 확장 (좌측, 중앙, 우측)
export const WORLD_W = TILE * MAP_COLS * 3;
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
    key: "technologies",
    label: "Technologies",
    tile: { x: 19, y: 3 },
    icon: "book",
    color: 0x7ec8c9,
  },
  {
    key: "cv",
    label: "CV",
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
const ROAD_TOP = 140;
const ROAD_BOTTOM = 204;
const ROAD_LANE_TOP = ROAD_TOP + 16;
const ROAD_LANE_BOTTOM = ROAD_BOTTOM - 16;
const VEHICLE_SAFE_PADDING = 14;
const GREETINGS = [
  "안녕하세요!",
  "좋은 하루예요 :)",
  "여기 풍경이 마음에 들어요",
  "탐험 잘 하고 계신가요?",
  "구역들을 둘러보세요!",
];

export function createGardenScene({ onZoneEnter, onZoneExit, onReady }) {
  class GardenScene extends Phaser.Scene {
    constructor() {
      super("GardenScene");
      this.activeZone = null;
      this.cursors = null;
      this.player = null;
      this.zoneMarkers = {};
      this.joystickVector = { x: 0, y: 0 };
      this.currentMapIndex = 0;
      this.screenWidth = TILE * MAP_COLS;
    }

    preload() {
      // 모든 비주얼은 procedural graphics로 생성하므로 외부 에셋 로드가 필요 없다.
    }

    create() {
      this.cameras.main.setBackgroundColor("#d8d0c3");

      // 월드와 카메라 설정
      this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);
      this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);

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
      this.interactKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.E
      );

      this.foodTrucks = [];
      this.vehicles = [];
      this.activeBubble = null;
      this.obstacles = this.physics.add.staticGroup();

      for (let screenIndex = 0; screenIndex < 3; screenIndex++) {
        this.drawScreen(screenIndex);
      }

      this.createZoneLabels();
      this.createCrowdCharacters();
      // this.createAnimatedFoodTruck(TILE * MAP_COLS + 260, 120);
      this.createVehicles();
      this.createPlayer();
      this.createCompass();
      this.createInteractPrompt();
      this.createZoneEnterPrompt();
      this.createPlayerGuideBubble();
      this.setupCollisions();

      this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
      this.updateCameraZoom();
      this.scale.on("resize", () => this.updateCameraZoom());

      if (onReady) onReady(this);
    }

    drawScreen(screenIndex) {
      const offsetX = screenIndex * (TILE * MAP_COLS);
      this.drawCityGround(offsetX);
      this.drawRoad(offsetX);
      this.drawDecorations(offsetX);
      this.drawBenches(offsetX);
      this.drawZoneBuildings(offsetX);
    }

    // 차량이 다니는 2차선 도로 (인도 영역 안쪽, 건물/나무와 겹치지 않는 띠)
    drawRoad(offsetX = 0) {
      const g = this.add.graphics();
      const screenW = TILE * MAP_COLS;
      const top = ROAD_TOP;
      const bottom = ROAD_BOTTOM;

      g.fillStyle(0x33363f, 1);
      g.fillRect(offsetX, top, screenW, bottom - top);

      // 연석
      g.fillStyle(0xcfc9bd, 1);
      g.fillRect(offsetX, top - 3, screenW, 3);
      g.fillRect(offsetX, bottom, screenW, 3);

      // 중앙 점선
      g.fillStyle(0xf0ebe1, 0.85);
      const dashW = 18;
      const gapW = 14;
      const centerY = top + (bottom - top) / 2 - 2;
      for (let x = offsetX; x < offsetX + screenW; x += dashW + gapW) {
        g.fillRect(x, centerY, dashW, 4);
      }
    }

    // 보이지 않는 충돌용 사각 영역을 obstacles 그룹에 추가한다
    createObstacle(x, y, w, h) {
      const zone = this.add.zone(x, y, w, h);
      this.physics.add.existing(zone, true);
      this.obstacles.add(zone);
      return zone;
    }

    updateCameraZoom() {
      const viewportW = this.scale.width;
      const singleScreenW = TILE * MAP_COLS;

      // 구역들은 가로로 배치되어 있으므로 너비를 기준으로 맞춘다.
      // 세로로 긴 모바일 화면에서는 위아래로 여백(레터박스)이 생기지만,
      // 대신 한 화면에 너무 줌인되어 구역들이 겹쳐 보이는 문제를 피한다.
      const zoom = Phaser.Math.Clamp(viewportW / singleScreenW, 0.6, 1.6);

      this.cameras.main.setZoom(zoom);
    }

    // 체크보드 타일 패턴을 그려 픽셀아트 텍스처 느낌을 낸다
    drawTiledBand(g, offsetX, screenW, yStart, yEnd, colorA, colorB) {
      const tileFirst = Math.floor(yStart / TILE);
      const tileLast = Math.ceil(yEnd / TILE);
      const cols = screenW / TILE;
      for (let ty = tileFirst; ty < tileLast; ty++) {
        const rowY = Math.max(ty * TILE, yStart);
        const rowH = Math.min((ty + 1) * TILE, yEnd) - rowY;
        if (rowH <= 0) continue;
        for (let tx = 0; tx < cols; tx++) {
          g.fillStyle((tx + ty) % 2 === 0 ? colorA : colorB, 1);
          g.fillRect(offsetX + tx * TILE, rowY, TILE, rowH);
        }
      }
    }

    // 바닥 타일 패턴
    drawCityGround(offsetX = 0) {
      const g = this.add.graphics();
      const screenW = TILE * MAP_COLS;

      // 전체 바닥
      g.fillStyle(0xd8d0c3, 1);
      g.fillRect(offsetX, 0, screenW, WORLD_H);

      // 인도 (체크보드 텍스처)
      this.drawTiledBand(g, offsetX, screenW, 90, 210, 0xd9d4ca, 0xcfc9bd);

      // 잔디 (체크보드 텍스처)
      this.drawTiledBand(g, offsetX, screenW, 210, WORLD_H, COLORS.grassA, COLORS.grassB);

      // 잔디 디테일
      g.fillStyle(0x24783a, 1);
      for (let i = 0; i < 80; i++) {
        const x = offsetX + Phaser.Math.Between(0, screenW);
        const y = Phaser.Math.Between(220, WORLD_H);
        g.fillRect(x, y, 4, 8);
      }

      // 대각선 벽돌길
      g.fillStyle(0x9e9e9e, 1);
      g.beginPath();
      g.moveTo(offsetX + 330, 260);
      g.lineTo(offsetX + screenW, 330);
      g.lineTo(offsetX + screenW, WORLD_H);
      g.lineTo(offsetX + 420, WORLD_H);
      g.closePath();
      g.fillPath();

      // 인도-잔디 경계 라인 (입체감)
      g.fillStyle(0x1d6b34, 0.6);
      g.fillRect(offsetX, 210, screenW, 3);
    }


    // 나무(충돌 있음), 꽃(분위기용, 충돌 없음) 장식
    drawDecorations(offsetX = 0) {
      const g = this.add.graphics();
      const treeSpots = [
        [1, 1], [1, 14], [22, 1], [22, 14],
        [7, 1], [16, 1], [1, 7], [22, 8],
        [7, 14], [16, 14],
      ];
      treeSpots.forEach(([col, row]) => {
        const cx = offsetX + col * TILE + TILE / 2;
        const cy = row * TILE + TILE / 2;
        g.fillStyle(COLORS.treeTrunk, 1);
        g.fillRect(cx - 4, cy + 2, 8, 12);
        g.fillStyle(COLORS.treeLeaf, 1);
        g.fillCircle(cx, cy - 6, 14);
        g.fillStyle(COLORS.treeLeafLight, 1);
        g.fillCircle(cx - 4, cy - 10, 8);

        // 줄기 부분만 막아서 발이 걸리는 느낌을 자연스럽게 한다
        this.createObstacle(cx, cy + 8, 16, 18);
      });

      const flowerSpots = [
        [5, 6, COLORS.flowerPink], [6, 6, COLORS.flowerYellow],
        [17, 6, COLORS.flowerPink], [18, 6, COLORS.flowerYellow],
        [5, 10, COLORS.flowerYellow], [17, 10, COLORS.flowerPink],
        [9, 4, COLORS.flowerPink], [14, 11, COLORS.flowerYellow],
      ];
      flowerSpots.forEach(([col, row, color]) => {
        const cx = offsetX + col * TILE + TILE / 2;
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

    // 벤치 (충돌 있음)
    drawBenches(offsetX = 0) {
      const benchSpots = [
        [170, 260],
        [460, 330],
      ];
      benchSpots.forEach(([x, y]) => this.drawBench(offsetX, x, y));
    }

    drawBench(offsetX, x, y) {
      const g = this.add.graphics();
      const sx = offsetX + x;
      g.fillStyle(0x5a3e2b, 1);
      g.fillRect(sx - 40, y, 80, 10);
      g.fillRect(sx - 40, y + 18, 80, 10);
      g.fillStyle(0x222222, 1);
      g.fillRect(sx - 45, y - 5, 5, 40);
      g.fillRect(sx + 40, y - 5, 5, 40);

      this.createObstacle(sx, y + 14, 80, 30);
    }

    // 각 zone 위치에 작은 건물/오브젝트 아이콘을 그린다
    drawZoneBuildings(offsetX = 0) {
      ZONES.forEach((zone) => {
        const g = this.add.graphics();
        const cx = offsetX + zone.tile.x * TILE + TILE / 2;
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

        // 건물 본체만 막아서 플레이어가 안으로 들어가지 못하게 한다
        this.createObstacle(cx, cy + 8, 40, 30);

        // 외곽선 느낌의 글로우 (펄스 애니메이션 대상)
        const glowKey = `${zone.key}-screen-${Math.floor(offsetX / (TILE * MAP_COLS))}`;
        const glow = this.add.circle(cx, cy, ZONE_RADIUS, zone.color, 0.08);
        glow.setStrokeStyle(2, zone.color, 0.35);
        this.tweens.add({
          targets: glow,
          alpha: { from: 0.06, to: 0.16 },
          duration: 1400,
          yoyo: true,
          repeat: -1,
        });

        this.zoneMarkers[glowKey] = { cx, cy, glow };
      });
    }

    createCrowdCharacters() {
      // 움직이는 NPC 캐릭터들 (중앙 화면)
      const screenW = TILE * MAP_COLS;
      const offsetX = screenW; // 중앙 화면

      this.npcCharacters = [];
      this.createMovingCharacter(offsetX + 210, 310, "me", 60);
      this.createMovingCharacter(offsetX + 260, 260, "redShirt", 50);
      this.createMovingCharacter(offsetX + 300, 250, "catStudent", 55);
      this.createMovingCharacter(offsetX + 345, 260, "rabbitWoman", 65);
      this.createMovingCharacter(offsetX + 390, 265, "developer", 45);
      this.createMovingCharacter(offsetX + 450, 240, "man", 70);
      this.createMovingCharacter(offsetX + 520, 320, "cafeGuest", 50);
      this.createMovingCharacter(offsetX + 590, 290, "redShirt", 55);
      this.createMovingCharacter(offsetX + 650, 335, "lionWorker", 60);
      this.createMovingCharacter(offsetX + 120, 370, "girlPink", 50);
    }

    createMovingCharacter(x, y, type, speed = 50) {
      const container = this.add.container(x, y);

      // 그림자 (걷기 애니메이션과 분리해 바닥에 고정)
      const shadow = this.add.graphics();
      shadow.fillStyle(0x000000, 0.25);
      shadow.fillEllipse(0, 22, 30, 8);
      container.add(shadow);

      // 인물 그래픽은 별도 컨테이너에 넣어 걷기 바운스/방향 전환에 사용
      const visual = this.add.container(0, 0);
      const g = this.add.graphics();
      this.drawStandingPerson(g, type);
      visual.add(g);
      container.add(visual);
      container.visual = visual;
      container.facing = 1;
      container.walkTime = Phaser.Math.Between(0, 1000);

      // Physics body 추가
      this.physics.world.enable(container);
      container.body.setSize(20, 50);
      container.body.setOffset(-10, -20);
      container.body.setCollideWorldBounds(true);
      container.body.setBounce(0.3);

      // 움직임 데이터
      container.characterType = type;
      container.targetX = x + Phaser.Math.Between(-100, 100);
      container.targetY = y + Phaser.Math.Between(-50, 50);
      container.speed = speed;
      container.idle = 0;

      this.npcCharacters.push(container);
      return container;
    }

    createAnimatedFoodTruck(x, y) {
      const container = this.add.container(x, y);
      const g = this.add.graphics();

      // 푸드트럭 그리기
      g.fillStyle(0xffb000, 1);
      g.fillRect(0, 0, 270, 95);

      g.fillStyle(0x2f2f3f, 1);
      g.fillRect(25, 35, 100, 45);

      g.fillStyle(0x2ea83a, 1);
      g.fillRect(20, 25, 110, 18);

      g.fillStyle(0xffc21a, 1);
      g.fillRect(190, 20, 70, 70);

      g.fillStyle(0x9fd3ff, 1);
      g.fillRect(205, 30, 35, 35);

      g.fillStyle(0x222222, 1);
      g.fillCircle(80, 95, 20);
      g.fillCircle(220, 95, 20);

      g.fillStyle(0x555555, 1);
      g.fillCircle(80, 95, 10);
      g.fillCircle(220, 95, 10);

      container.add(g);

      // Physics body 추가
      this.physics.world.enable(container);
      container.body.setSize(270, 95);
      container.body.setOffset(0, 0);
      container.body.setCollideWorldBounds(true);
      container.body.setBounce(0.6);

      // 움직임 데이터
      container.startX = x;
      container.range = 80;
      container.direction = 1;
      container.speed = 30;

      this.foodTrucks.push(container);
      return container;
    }

    // 빨강/노랑/초록 차량을 도로 위에 배치한다. 각 차량은 한 방향으로만
    // 계속 이동하다가 월드 끝을 벗어나면 반대편에서 다시 나타난다.
    createVehicles() {
      this.createVehicle(220, ROAD_LANE_TOP, 0xe63946, 1, 95);
      this.createVehicle(TILE * MAP_COLS + 180, ROAD_LANE_TOP, 0x3fa34d, 1, 95);
      this.createVehicle(TILE * MAP_COLS * 2 - 260, ROAD_LANE_BOTTOM, 0xf4c542, -1, 120);
    }

    createVehicle(x, y, color, direction, speed) {
      const w = 64;
      const h = 28;
      const container = this.add.container(x, y);
      const g = this.add.graphics();

      // 차체
      g.fillStyle(0x000000, 0.2);
      g.fillEllipse(0, h / 2 + 2, w - 6, 10);
      g.fillStyle(color, 1);
      g.fillRoundedRect(-w / 2, -h / 2, w, h, 6);

      // 창문
      g.fillStyle(0x9fd3ff, 1);
      g.fillRoundedRect(-w / 2 + 16, -h / 2 + 4, 22, h - 14, 3);

      // 바퀴
      g.fillStyle(0x1a1f2e, 1);
      g.fillCircle(-w / 2 + 14, h / 2, 7);
      g.fillCircle(w / 2 - 14, h / 2, 7);

      // 진행 방향 쪽 전조등
      g.fillStyle(0xfff4cc, 1);
      if (direction > 0) {
        g.fillRect(w / 2 - 4, -5, 4, 8);
      } else {
        g.fillRect(-w / 2, -5, 4, 8);
      }

      container.add(g);

      this.physics.world.enable(container);
      container.body.setSize(w, h);
      container.body.setOffset(-w / 2, -h / 2);
      container.body.setImmovable(true);
      container.body.setVelocityX(direction * speed);

      container.vehicleWidth = w;
      container.vehicleHeight = h;
      container.direction = direction;

      this.vehicles.push(container);
      return container;
    }

    // 차량이 월드 끝을 완전히 벗어나면 반대편 끝으로 옮겨 순환 이동을 만든다
    updateVehicleWrap(vehicle) {
      const halfW = vehicle.vehicleWidth / 2;
      if (vehicle.direction > 0 && vehicle.x - halfW > WORLD_W) {
        vehicle.setPosition(-halfW, vehicle.y);
      } else if (vehicle.direction < 0 && vehicle.x + halfW < 0) {
        vehicle.setPosition(WORLD_W + halfW, vehicle.y);
      }
    }

    createZoneLabels() {
      const screenW = TILE * MAP_COLS;
      ZONES.forEach((zone) => {
        for (let screenIndex = 0; screenIndex < 3; screenIndex++) {
          const offsetX = screenIndex * screenW;
          const glowKey = `${zone.key}-screen-${screenIndex}`;
          const marker = this.zoneMarkers[glowKey];
          if (marker) {
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
          }
        }
      });
    }

    drawStandingPerson(g, type) {

  const styles = {
    me: [0x2b1d1d, 0xffd0bd, 0xffc0cb, 0xff8fa3],
    man: [0x111111, 0xffd0bd, 0x6ac3ff, 0x333333],
    redShirt: [0x402030, 0xffd0bd, 0xe63946, 0x223355],
    rabbitWoman: [0x2b1d1d, 0xffd0bd, 0xffffff, 0xf3c6d8],
    catStudent: [0x111111, 0xffd0bd, 0xffffff, 0x333366],
    lionWorker: [0x8a5a2b, 0xffc49b, 0x222222, 0x444444],
    developer: [0x2b1d1d, 0xffd0bd, 0x5c7cfa, 0x222222],
    cafeGuest: [0x3a2a22, 0xffd0bd, 0xc98b5c, 0x355c7d],
    girlPink: [0x6b3a2e, 0xffd0bd, 0xff5c8a, 0xffb36b],
  };

  const colorData = styles[type];
  if (!colorData) {
    // 타입이 없으면 기본 스타일 사용
    return;
  }

  const [hair, skin, top, bottom] = colorData;

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
      // 중앙 화면(화면 1)의 중앙에 플레이어 배치
      const screenW = TILE * MAP_COLS;
      const startX = screenW + (MAP_COLS / 2) * TILE;
      const startY = (MAP_ROWS / 2) * TILE + TILE * 2;

      const container = this.add.container(startX, startY);
      container.setDepth(10);

      const shadow = this.add.graphics();
      shadow.fillStyle(0x000000, 0.25);
      shadow.fillEllipse(0, 22, 30, 8);
      container.add(shadow);

      const visual = this.add.container(0, 0);
      const g = this.add.graphics();
      this.drawStandingPerson(g, "me");
      visual.add(g);
      container.add(visual);
      container.visual = visual;
      container.facing = 1;
      container.walkTime = 0;

      this.physics.world.enable(container);

      container.body.setSize(20, 50);
      container.body.setOffset(-10, -20);
      container.body.setCollideWorldBounds(true);

      this.player = container;
    }

    // 이동 중일 때 살짝 통통 튀고, 이동 방향에 따라 좌우로 뒤집는다
    applyWalkVisuals(container, delta) {
      const vx = container.body.velocity.x;
      const vy = container.body.velocity.y;
      const moving = Math.abs(vx) > 1 || Math.abs(vy) > 1;

      if (vx > 1) container.facing = 1;
      else if (vx < -1) container.facing = -1;
      container.visual.scaleX = container.facing;

      if (moving) {
        container.walkTime += delta;
        container.visual.y = Math.sin(container.walkTime / 90) * 2;
      } else {
        container.walkTime = 0;
        container.visual.y = 0;
      }
    }

    // 화면 밖에 있는 구역을 화면 가장자리 화살표로 가리킨다
    createCompass() {
      this.compassItems = {};
      ZONES.forEach((zone) => {
        const arrow = this.add
          .triangle(0, 0, 0, -8, 7, 8, -7, 8, zone.color)
          .setStrokeStyle(2, 0x1a1f2e, 0.6)
          .setDepth(25)
          .setVisible(false);
        const label = this.add
          .text(0, 0, zone.label, {
            fontFamily: "monospace",
            fontSize: "10px",
            color: "#1a1f2e",
            backgroundColor: "#f0ebe1cc",
            padding: { x: 4, y: 2 },
          })
          .setOrigin(0.5)
          .setDepth(25)
          .setVisible(false);
        this.compassItems[zone.key] = { arrow, label, zone };
      });
    }

    updateCompass() {
      const cam = this.cameras.main;
      const screenW = TILE * MAP_COLS;
      const screenIndex = Phaser.Math.Clamp(
        Math.floor(this.player.x / screenW),
        0,
        2
      );
      const margin = 30;
      const viewW = cam.width / cam.zoom;
      const viewH = cam.height / cam.zoom;
      const centerX = cam.scrollX + viewW / 2;
      const centerY = cam.scrollY + viewH / 2;
      const halfW = viewW / 2 - margin;
      const halfH = viewH / 2 - margin;

      Object.values(this.compassItems).forEach(({ arrow, label, zone }) => {
        const markerKey = `${zone.key}-screen-${screenIndex}`;
        const marker = this.zoneMarkers[markerKey];
        if (!marker) {
          arrow.setVisible(false);
          label.setVisible(false);
          return;
        }

        const dx = marker.cx - centerX;
        const dy = marker.cy - centerY;
        const withinView = Math.abs(dx) <= halfW && Math.abs(dy) <= halfH;

        if (withinView) {
          arrow.setVisible(false);
          label.setVisible(false);
          return;
        }

        const angle = Math.atan2(dy, dx);
        const ex = Math.cos(angle) || 0.0001;
        const ey = Math.sin(angle) || 0.0001;
        const scale = Math.min(halfW / Math.abs(ex), halfH / Math.abs(ey));
        const px = centerX + ex * scale;
        const py = centerY + ey * scale;

        arrow.setPosition(px, py);
        arrow.setRotation(angle + Math.PI / 2);
        arrow.setVisible(true);

        label.setPosition(px - ex * 18, py - ey * 18);
        label.setVisible(true);
      });
    }

    // NPC와 상호작용할 때 쓰는 "E" 프롬프트 + 말풍선
    createInteractPrompt() {
      this.interactPrompt = this.add
        .text(0, 0, "E", {
          fontFamily: "monospace",
          fontSize: "12px",
          color: "#1a1f2e",
          backgroundColor: "#f4a259",
          padding: { x: 6, y: 3 },
        })
        .setOrigin(0.5)
        .setDepth(30)
        .setVisible(false);
    }

    // 둥근 말풍선 모양(배경 + 꼬리)을 그려서 컨테이너로 묶어 반환한다
    createRoundedCallout(label, { fillColor = 0xf0ebe1, borderColor = 0x1a1f2e, padX = 14, padY = 10 } = {}) {
      const w = label.width + padX * 2;
      const h = label.height + padY * 2;

      const g = this.add.graphics();
      g.fillStyle(fillColor, 0.97);
      g.lineStyle(2, borderColor, 0.8);
      g.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
      g.fillTriangle(-7, h / 2 - 2, 7, h / 2 - 2, 0, h / 2 + 9);
      g.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);

      label.setPosition(0, 0).setOrigin(0.5);
      return this.add.container(0, 0, [g, label]);
    }

    // 입장 가능한 구역 위에 표시할 "Enter 키로 입장" 안내 말풍선
    createZoneEnterPrompt() {
      const label = this.add.text(0, 0, "⏎ Enter 키로 입장", {
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#1a1f2e",
      });

      this.zoneEnterPrompt = this.createRoundedCallout(label, {
        fillColor: 0xf4a259,
        borderColor: 0x1a1f2e,
      })
        .setDepth(35)
        .setVisible(false);
    }

    // 게임 시작 시 플레이어 머리 위에 조작 방법 안내 말풍선을 띄운다.
    // 처음 이동 입력이 들어오면 사라지고 이후 다시 표시되지 않는다.
    createPlayerGuideBubble() {
      const isMobileInput = window.matchMedia(
        "(max-width: 768px), (pointer: coarse)"
      ).matches;

      const moveLine = isMobileInput
        ? "조이스틱으로 이동해 보세요!"
        : "⬅️⬆️⬇️➡️ 화살표 키로 아바타를 이동해 보세요!";
      const enterLine = "Enter 키를 누르면 공간에 입장할 수 있어요.";

      const label = this.add.text(0, 0, `${moveLine}\n${enterLine}`, {
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#1a1f2e",
        align: "center",
        lineSpacing: 6,
      });

      this.playerGuideBubble = this.createRoundedCallout(label, {
        fillColor: 0xf0ebe1,
        borderColor: 0xf4a259,
        padX: 16,
        padY: 12,
      })
        .setPosition(this.player.x, this.player.y - 80)
        .setDepth(40);
    }

    // 플레이어 이동 입력이 처음 발생하면 안내 말풍선을 페이드아웃하며 제거한다
    dismissPlayerGuideBubble() {
      if (!this.playerGuideBubble) return;
      const bubble = this.playerGuideBubble;
      this.playerGuideBubble = null;
      this.tweens.add({
        targets: bubble,
        alpha: 0,
        y: bubble.y - 12,
        duration: 250,
        ease: "Sine.easeIn",
        onComplete: () => bubble.destroy(),
      });
    }

    findNearestNpc(maxDist) {
      let nearest = null;
      let nearestDist = maxDist;
      this.npcCharacters.forEach((npc) => {
        const d = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          npc.x,
          npc.y
        );
        if (d < nearestDist) {
          nearestDist = d;
          nearest = npc;
        }
      });
      return nearest;
    }

    showSpeechBubble(npc) {
      this.hideSpeechBubble();
      const text = Phaser.Utils.Array.GetRandom(GREETINGS);
      const label = this.add
        .text(0, 0, text, {
          fontFamily: "monospace",
          fontSize: "11px",
          color: "#1a1f2e",
          backgroundColor: "#f0ebe1",
          padding: { x: 6, y: 4 },
        })
        .setOrigin(0.5);
      const container = this.add
        .container(npc.x, npc.y - 56, [label])
        .setDepth(30);
      this.activeBubble = { container, npc, expireAt: this.time.now + 1600 };
    }

    hideSpeechBubble() {
      if (this.activeBubble) {
        this.activeBubble.container.destroy();
        this.activeBubble = null;
      }
    }

    // 플레이어/NPC가 장애물(나무, 벤치, 건물, 푸드트럭)을 통과하지 못하도록 충돌 등록
    // 차량은 일반 충돌체로 등록하지 않는다: immovable 차량과 일반 충돌로 묶으면
    // 차량이 사람을 그대로 밀고 가는("carry") 현상이 생기므로, 대신
    // keepSafeDistanceFromVehicles()로 안전 거리를 유지시켜 접촉 자체가 일어나지 않게 한다.
    setupCollisions() {
      this.physics.add.collider(this.player, this.obstacles);
      this.physics.add.collider(this.player, this.foodTrucks);

      this.npcCharacters.forEach((npc) => {
        this.physics.add.collider(npc, this.obstacles, () => this.retargetNpc(npc));
        this.physics.add.collider(npc, this.foodTrucks, () => this.retargetNpc(npc));
      });
    }

    // 차량과 사람(플레이어/NPC) 사이에 항상 VEHICLE_SAFE_PADDING 이상의 간격을 유지시킨다.
    // 차량의 진행 방향(X)으로는 절대 밀지 않는다 — 그 축으로 밀면 차량 속도에 끌려가는
    // "carry" 현상이 생기기 때문에, 항상 차로 바깥쪽(Y)으로만 비켜서게 하여 접촉 자체를 막는다.
    keepSafeDistanceFromVehicles(target, onBlocked) {
      this.vehicles.forEach((vehicle) => {
        const halfW = vehicle.vehicleWidth / 2 + VEHICLE_SAFE_PADDING + target.body.halfWidth;
        const halfH = vehicle.vehicleHeight / 2 + VEHICLE_SAFE_PADDING + target.body.halfHeight;
        const dx = target.x - vehicle.x;
        const dy = target.y - vehicle.y;

        if (Math.abs(dx) >= halfW || Math.abs(dy) >= halfH) return;

        target.y = vehicle.y + Math.sign(dy || 1) * halfH;
        target.body.velocity.y = 0;

        if (onBlocked) onBlocked();
      });
    }

    // 장애물에 부딫힌 NPC가 다른 방향의 새 목표를 잡아 우회하도록 한다
    retargetNpc(npc) {
      npc.targetX = npc.x + Phaser.Math.Between(-80, 80);
      npc.targetY = npc.y + Phaser.Math.Between(-60, 60);
      npc.idle = 0;
    }

    movePlayerHome() {
      const startX = (MAP_COLS / 2) * TILE;
      const startY = (MAP_ROWS / 2) * TILE + TILE * 2;
      this.player.setPosition(startX, startY);
      this.cameras.main.centerOn(startX, startY);
    }

    setJoystickVector(x, y) {
      this.joystickVector.x = x;
      this.joystickVector.y = y;
    }

    update(time, delta) {
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
      this.applyWalkVisuals(this.player, delta);

      // 조작 안내 말풍선: 플레이어를 따라다니다가 첫 이동 입력이 들어오면 사라진다
      if (this.playerGuideBubble) {
        if (vx !== 0 || vy !== 0) {
          this.dismissPlayerGuideBubble();
        } else {
          this.playerGuideBubble.setPosition(this.player.x, this.player.y - 80);
        }
      }

      // NPC 캐릭터들 움직이기
      if (this.npcCharacters) {
        this.npcCharacters.forEach((npc) => {
          this.updateNPCMovement(npc);
          this.applyWalkVisuals(npc, delta);
        });
      }

      // 푸드트럭들 움직이기
      if (this.foodTrucks) {
        this.foodTrucks.forEach((truck) => {
          this.updateFoodTruckMovement(truck);
        });
      }

      // 차량들 순환 이동 (월드 끝을 벗어나면 반대편에서 다시 등장)
      if (this.vehicles) {
        this.vehicles.forEach((vehicle) => {
          this.updateVehicleWrap(vehicle);
        });

        // 차량과 사람 사이에 항상 안전 거리를 유지시켜, 닿거나 밀리는 현상을 막는다
        this.keepSafeDistanceFromVehicles(this.player);
        if (this.npcCharacters) {
          this.npcCharacters.forEach((npc) => {
            this.keepSafeDistanceFromVehicles(npc, () => this.retargetNpc(npc));
          });
        }
      }

      // 가장 가까운 zone 체크
      let nearestZone = null;
      let nearestMarker = null;
      let nearestDist = Infinity;

      Object.entries(this.zoneMarkers).forEach(([markerKey, marker]) => {
        const d = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          marker.cx,
          marker.cy
        );
        if (d < ZONE_RADIUS && d < nearestDist) {
          nearestDist = d;
          // markerKey는 "zoneName-screen-0" 형식이므로 첫 번째 부분만 추출
          nearestZone = markerKey.split("-screen-")[0];
          nearestMarker = marker;
        }
      });

      this.updateZoneEnterPrompt(nearestMarker);

      if (nearestZone !== this.activeZone) {
        if (this.activeZone && onZoneExit) onZoneExit(this.activeZone);
        if (nearestZone && onZoneEnter) onZoneEnter(nearestZone);
        this.activeZone = nearestZone;
      }

      this.updateCompass();
      this.updateInteraction();
    }

    // 입장 가능한 구역 근처에 도착하면 그 구역 위에 "Enter 키로 입장" 안내를 띄운다
    updateZoneEnterPrompt(marker) {
      if (marker) {
        this.zoneEnterPrompt.setPosition(marker.cx, marker.cy - 58);
        this.zoneEnterPrompt.setVisible(true);
      } else {
        this.zoneEnterPrompt.setVisible(false);
      }
    }

    updateInteraction() {
      const nearest = this.findNearestNpc(60);

      if (nearest && !this.activeBubble) {
        this.interactPrompt.setPosition(nearest.x, nearest.y - 50);
        this.interactPrompt.setVisible(true);
      } else {
        this.interactPrompt.setVisible(false);
      }

      if (
        this.interactKey &&
        Phaser.Input.Keyboard.JustDown(this.interactKey) &&
        nearest
      ) {
        this.showSpeechBubble(nearest);
      }

      if (this.activeBubble) {
        this.activeBubble.container.setPosition(
          this.activeBubble.npc.x,
          this.activeBubble.npc.y - 56
        );
        if (this.time.now > this.activeBubble.expireAt) {
          this.hideSpeechBubble();
        }
      }
    }

    updateNPCMovement(npc) {
      const dx = npc.targetX - npc.x;
      const dy = npc.targetY - npc.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 10) {
        // 목표에 도달했으므로 대기 시간 설정
        npc.idle += 1;
        if (npc.idle > 120) {
          // 새로운 목표 설정
          const screenW = TILE * MAP_COLS;
          npc.targetX = npc.x + Phaser.Math.Between(-80, 80);
          npc.targetY = npc.y + Phaser.Math.Between(-60, 60);
          npc.idle = 0;
        }
        npc.body.setVelocity(0, 0);
      } else {
        // 목표를 향해 이동
        const speed = npc.speed || 50;
        const vel = (dist > 0 ? 1 : 0) * speed;
        npc.body.setVelocity((dx / dist) * vel, (dy / dist) * vel);
      }
    }

    updateFoodTruckMovement(truck) {
      // 푸드트럭이 일정 범위 내에서 앞뒤로 움직임
      truck.x += truck.direction * truck.speed * 0.016; // deltaTime 근사값

      if (truck.x > truck.startX + truck.range) {
        truck.direction = -1;
      } else if (truck.x < truck.startX - truck.range) {
        truck.direction = 1;
      }

      truck.body.setVelocity(truck.direction * truck.speed, 0);
    }

  }

  return GardenScene;
}
