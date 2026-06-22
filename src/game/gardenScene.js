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
  lampPole: 0x3a3a3a,
  lampGlow: 0xfff4cc,
  fountainBase: 0xcfc9bd,
  fountainWater: 0x4a78a0,
  dogBody: 0xc99a5b,
  dogDark: 0xa9794a,
  bedSoil: 0x6b4a2f,
  bedBorder: 0x8a6d4b,
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

// 우체통(이력서/포트폴리오 다운로드) 오브젝트 위치: 중앙 화면의 빈 잔디 공간
const MAILBOX_TILE = { x: 16, y: 10 };
const MAILBOX_RADIUS = TILE * 1.3;

// AI Portfolio Assistant NPC 위치: 우체통과 같은 중앙 화면, 충분히 떨어진 빈 공간
const AI_NPC_TILE = { x: 20, y: 10 };
const AI_NPC_RADIUS = TILE * 1.3;

export function createGardenScene({
  onZoneEnter,
  onZoneExit,
  onReady,
  onMailboxEnter,
  onMailboxExit,
  onAiNpcEnter,
  onAiNpcExit,
}) {
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
      this.isNearMailbox = false;
      this.isNearAiNpc = false;
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
      this.dogs = [];
      this.fountains = [];
      this.activeBubble = null;
      this.obstacles = this.physics.add.staticGroup();

      for (let screenIndex = 0; screenIndex < 3; screenIndex++) {
        this.drawScreen(screenIndex);
      }

      this.createZoneLabels();
      this.createCrowdCharacters();
      // this.createAnimatedFoodTruck(TILE * MAP_COLS + 260, 120);
      this.createVehicles();
      this.createBird();
      this.createCherryBlossoms();
      this.createFountainSoundIcon();
      this.createProjectsSparkle();
      this.createMailbox();
      this.createAiNpc();
      this.createPlayer();
      this.createCompass();
      this.createZoneEnterPrompt();
      this.createMailboxEnterPrompt();
      this.createAiNpcEnterPrompt();
      this.createPlayerGuideBubble();
      this.setupCollisions();

      this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
      this.updateCameraZoom();
      this.scale.on("resize", () => this.updateCameraZoom());

      // 🌙 Pixel Garden Night: 다크모드일 때 맵 자체에 밤 분위기를 적용한다.
      // index.html의 anti-FOUC 스크립트가 React/Phaser보다 먼저 data-theme을
      // 설정해두므로, 시작 시점에 바로 현재 테마를 읽어 반영할 수 있다.
      this.createNightEffects();
      this.applyThemeVisuals(this.readCurrentTheme(), true);

      this.handleThemeChange = (e) => this.applyThemeVisuals(e.detail);
      window.addEventListener("themechange", this.handleThemeChange);
      this.events.once("shutdown", () => {
        window.removeEventListener("themechange", this.handleThemeChange);
      });

      if (onReady) onReady(this);
    }

    drawScreen(screenIndex) {
      const offsetX = screenIndex * (TILE * MAP_COLS);
      this.drawCityGround(offsetX);
      this.drawRoad(offsetX);
      this.drawDecorations(offsetX);
      this.drawFlowerBeds(offsetX);
      this.drawStreetLamps(offsetX);
      this.drawBenches(offsetX);
      this.drawZoneBuildings(offsetX);
      this.createFountainForScreen(offsetX);
      this.createDogForScreen(offsetX);
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
      const viewportH = this.scale.height;
      const singleScreenW = TILE * MAP_COLS;
      const isMobile = viewportW <= 768;

      let zoom;
      if (isMobile) {
        // 모바일은 세로로 길고 가로로 좁다. 너비 기준으로 줌을 맞추면 화면에
        // 보이는 세로 영역이 WORLD_H(맵의 실제 높이)보다 훨씬 커져서, 카메라가
        // 맵 위/아래 바깥의 빈 배경색까지 그대로 보여준다 — 이게 "위아래 여백이
        // 많고 화면이 납작한 띠처럼 보이는" 원인이다. 대신 세로(높이) 기준으로
        // 줌을 맞춰 보이는 세로 영역이 WORLD_H를 넘지 않게 하면 빈 여백이
        // 없어지고, 그만큼 가로로 보이는 영역은 좁아진다(요구사항대로 가로를
        // 희생해 세로를 화면 전체에 꽉 채운다).
        zoom = Phaser.Math.Clamp(viewportH / WORLD_H, 1.0, 2.2);
      } else {
        // 데스크톱은 구역들이 가로로 배치되어 있으므로 너비를 기준으로 맞춘다.
        zoom = Phaser.Math.Clamp(viewportW / singleScreenW, 0.6, 1.6);
      }

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


    // 나무(충돌 있음, 잎이 살짝 흔들림), 꽃(분위기용, 충돌 없음, 바람에 흔들림) 장식
    drawDecorations(offsetX = 0) {
      const treeSpots = [
        [1, 1], [1, 14], [22, 1], [22, 14],
        [7, 1], [16, 1], [1, 7], [22, 8],
        [7, 14], [16, 14],
      ];
      treeSpots.forEach(([col, row]) => {
        const cx = offsetX + col * TILE + TILE / 2;
        const cy = row * TILE + TILE / 2;
        this.createSwayingTree(cx, cy);
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
        this.createSwayingFlower(cx, cy, color);
      });
    }

    // 줄기는 고정, 잎(캐노피)만 별도 컨테이너에 넣어 바람에 살짝 흔들리게 한다
    createSwayingTree(cx, cy) {
      const trunk = this.add.graphics();
      trunk.fillStyle(COLORS.treeTrunk, 1);
      trunk.fillRect(cx - 4, cy + 2, 8, 12);

      const canopy = this.add.container(cx, cy - 6);
      const leaves = this.add.graphics();
      leaves.fillStyle(COLORS.treeLeaf, 1);
      leaves.fillCircle(0, 0, 14);
      leaves.fillStyle(COLORS.treeLeafLight, 1);
      leaves.fillCircle(-4, -4, 8);
      canopy.add(leaves);

      this.tweens.add({
        targets: canopy,
        angle: { from: -3, to: 3 },
        duration: Phaser.Math.Between(2400, 3400),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        delay: Phaser.Math.Between(0, 1000),
      });

      // 줄기 부분만 막아서 발이 걸리는 느낌을 자연스럽게 한다
      this.createObstacle(cx, cy + 8, 16, 18);
    }

    // 꽃 전체를 컨테이너로 묶어 바람에 흔들리는 듯한 회전 애니메이션을 준다
    createSwayingFlower(cx, cy, color, scale = 1) {
      const container = this.add.container(cx, cy).setScale(scale);
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

      return container;
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

    // 작은 화단 (충돌 있음, 안에는 흔들리는 꽃 몇 송이)
    drawFlowerBeds(offsetX = 0) {
      const bedSpots = [
        [2, 9],
        [21, 9],
      ];
      bedSpots.forEach(([col, row]) =>
        this.createFlowerBed(offsetX + col * TILE + TILE / 2, row * TILE + TILE / 2)
      );
    }

    createFlowerBed(cx, cy) {
      const w = 56;
      const h = 30;
      const g = this.add.graphics();

      g.fillStyle(0x000000, 0.18);
      g.fillEllipse(cx, cy + h / 2 + 2, w + 6, 10);

      g.fillStyle(COLORS.bedSoil, 1);
      g.fillRoundedRect(cx - w / 2, cy - h / 2, w, h, 6);
      g.lineStyle(3, COLORS.bedBorder, 1);
      g.strokeRoundedRect(cx - w / 2, cy - h / 2, w, h, 6);

      const colors = [COLORS.flowerPink, COLORS.flowerYellow, COLORS.flowerPink, COLORS.flowerYellow];
      const positions = [
        [cx - w / 2 + 12, cy],
        [cx - w / 2 + 26, cy - 6],
        [cx + w / 2 - 26, cy - 4],
        [cx + w / 2 - 12, cy + 5],
      ];
      positions.forEach(([fx, fy], i) =>
        this.createSwayingFlower(fx, fy, colors[i % colors.length], 0.7)
      );

      this.createObstacle(cx, cy, w, h);
    }

    // 가로등 (충돌 있음, 따뜻한 빛이 은은하게 깜빡인다)
    drawStreetLamps(offsetX = 0) {
      const lampSpots = [
        [9, 1],
        [15, 1],
      ];
      lampSpots.forEach(([col, row]) =>
        this.createStreetLamp(offsetX + col * TILE + TILE / 2, row * TILE + TILE / 2)
      );
    }

    createStreetLamp(cx, cy) {
      const glow = this.add.circle(cx, cy - 24, 22, COLORS.lampGlow, 0.16);
      this.tweens.add({
        targets: glow,
        alpha: { from: 0.1, to: 0.26 },
        duration: Phaser.Math.Between(1800, 2600),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      const g = this.add.graphics();
      g.fillStyle(0x000000, 0.2);
      g.fillEllipse(cx, cy + 24, 16, 6);
      g.fillStyle(COLORS.lampPole, 1);
      g.fillRect(cx - 2, cy - 22, 4, 46);
      g.fillCircle(cx, cy - 22, 3);
      g.fillStyle(0x3a3a3a, 1);
      g.fillRoundedRect(cx - 9, cy - 36, 18, 16, 4);
      g.fillStyle(COLORS.lampGlow, 1);
      g.fillCircle(cx, cy - 28, 6);

      this.createObstacle(cx, cy + 22, 8, 16);
    }

    // 화면마다 분수대를 하나씩 배치하고, 근접 판정을 위해 좌표를 등록한다
    createFountainForScreen(offsetX = 0) {
      const cx = offsetX + 12 * TILE + TILE / 2;
      const cy = 1 * TILE + TILE / 2 + 10;
      this.createFountainAt(cx, cy);
      this.fountains.push({ cx, cy });
    }

    // 물이 솟아오르고 수면이 반짝이는 분수대 (충돌 있음)
    createFountainAt(cx, cy) {
      const container = this.add.container(cx, cy);

      const shadow = this.add.graphics();
      shadow.fillStyle(0x000000, 0.2);
      shadow.fillEllipse(0, 28, 70, 16);
      container.add(shadow);

      const base = this.add.graphics();
      base.fillStyle(COLORS.fountainBase, 1);
      base.fillEllipse(0, 16, 64, 26);
      base.fillStyle(COLORS.fountainWater, 1);
      base.fillEllipse(0, 14, 48, 18);
      base.fillStyle(COLORS.fountainBase, 1);
      base.fillRect(-6, -8, 12, 24);
      base.fillEllipse(0, -10, 26, 12);
      base.fillStyle(COLORS.fountainWater, 1);
      base.fillEllipse(0, -10, 16, 7);
      container.add(base);

      // 수면 반짝임 (펄스)
      const sparkle = this.add.circle(0, 14, 18, 0xffffff, 0.18);
      container.add(sparkle);
      this.tweens.add({
        targets: sparkle,
        alpha: { from: 0.08, to: 0.3 },
        scale: { from: 0.9, to: 1.1 },
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      // 위로 솟았다가 떨어지는 물방울들
      for (let i = 0; i < 4; i++) {
        const drop = this.add.circle(Phaser.Math.Between(-4, 4), -8, 2, 0xeaf6ff, 0.9);
        container.add(drop);
        this.tweens.add({
          targets: drop,
          y: { from: -8, to: -28 },
          alpha: { from: 0.9, to: 0.05 },
          duration: Phaser.Math.Between(700, 1000),
          delay: i * 180,
          repeat: -1,
          ease: "Sine.easeOut",
        });
      }

      this.createObstacle(cx, cy + 10, 56, 30);

      return container;
    }

    // 화면마다 산책하는 강아지를 한 마리씩 배치한다
    createDogForScreen(offsetX = 0) {
      const x = offsetX + 9 * TILE;
      const y = 13 * TILE + 16;
      this.dogs.push(this.createDogAt(x, y, 60));
    }

    // 좌우로 산책하는 강아지. 플레이어가 근처에 오면 꼬리를 신나게 흔든다
    createDogAt(x, y, range = 60) {
      const container = this.add.container(x, y);

      const shadow = this.add.graphics();
      shadow.fillStyle(0x000000, 0.2);
      shadow.fillEllipse(0, 10, 22, 7);
      container.add(shadow);

      const body = this.add.graphics();
      body.fillStyle(COLORS.dogBody, 1);
      body.fillRoundedRect(-12, -6, 24, 12, 5);
      body.fillCircle(10, -8, 7);
      body.fillStyle(COLORS.dogDark, 1);
      body.fillTriangle(6, -14, 12, -18, 9, -10);
      body.fillTriangle(13, -14, 17, -16, 14, -9);
      body.fillStyle(0x2b1d12, 1);
      body.fillCircle(13, -9, 1.2);
      body.fillStyle(0x111111, 1);
      body.fillRect(-12, 4, 5, 6);
      body.fillRect(-2, 4, 5, 6);
      body.fillRect(6, 4, 5, 6);
      container.add(body);

      const tail = this.add.container(-12, -2);
      const tailG = this.add.graphics();
      tailG.fillStyle(COLORS.dogBody, 1);
      tailG.fillRoundedRect(-2, -8, 5, 10, 2);
      tail.add(tailG);
      container.add(tail);

      container.tail = tail;
      container.baseX = x;
      container.range = range;
      container.direction = 1;
      container.speed = 24;
      container.isWagging = false;
      container.tailTween = this.tweens.add({
        targets: tail,
        angle: { from: -6, to: 6 },
        duration: 900,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      return container;
    }

    // 강아지가 정해진 범위 안에서 좌우로 걸어다니게 한다
    updateDogMovement(dog, delta) {
      dog.x += dog.direction * dog.speed * (delta / 1000);
      if (dog.x > dog.baseX + dog.range) dog.direction = -1;
      else if (dog.x < dog.baseX - dog.range) dog.direction = 1;
      dog.setScale(dog.direction, 1);
    }

    // 플레이어가 강아지 근처에 오면 꼬리를 빠르게 흔들고, 멀어지면 다시 느긋해진다
    updateDogTailProximity(dog) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, dog.x, dog.y);
      const near = dist < 70;
      if (near === dog.isWagging) return;

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

    // 하늘을 가로지르는 새 한 마리. 도착하면 잠시 쉬었다가 다시 날아온다
    createBird() {
      const bird = this.add.container(-60, 60).setDepth(50).setVisible(false);
      const g = this.add.graphics();
      g.fillStyle(0x2c2c2c, 1);
      g.fillTriangle(-8, 2, 0, -4, 0, 2);
      g.fillTriangle(8, 2, 0, -4, 0, 2);
      bird.add(g);
      this.bird = bird;
      this.flyBirdAcross();
    }

    flyBirdAcross() {
      const startY = Phaser.Math.Between(40, 90);
      this.bird.setPosition(-60, startY);
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
        x: WORLD_W + 60,
        y: startY + Phaser.Math.Between(-20, 20),
        duration: Phaser.Math.Between(16000, 22000),
        ease: "Sine.easeInOut",
        onComplete: () => {
          flap.stop();
          this.bird.setVisible(false);
          this.time.delayedCall(Phaser.Math.Between(9000, 20000), () => this.flyBirdAcross());
        },
      });
    }

    // 화면 곳곳에 떠다니는 벚꽃잎. 적은 개수로 가볍게 흩날리는 느낌만 낸다
    createCherryBlossoms() {
      this.petals = [];
      const count = 16;
      for (let i = 0; i < count; i++) {
        const petal = this.add.graphics().setDepth(45);
        petal.fillStyle(i % 2 === 0 ? 0xffc2d1 : 0xffd9e2, 0.85);
        petal.fillEllipse(0, 0, 6, 4);
        petal.x = Phaser.Math.Between(0, WORLD_W);
        petal.y = Phaser.Math.Between(-WORLD_H, WORLD_H);
        petal.speed = Phaser.Math.FloatBetween(16, 28);
        petal.sway = Phaser.Math.FloatBetween(6, 14);
        petal.seed = Phaser.Math.FloatBetween(0, Math.PI * 2);
        this.petals.push(petal);
      }
    }

    updatePetals(time, delta) {
      const dt = delta / 1000;
      this.petals.forEach((petal) => {
        petal.y += petal.speed * dt;
        petal.x += Math.sin(time / 1000 + petal.seed) * petal.sway * dt;
        petal.angle += dt * 30;
        if (petal.y > WORLD_H + 10) {
          petal.y = -10;
          petal.x = Phaser.Math.Between(0, WORLD_W);
        }
      });
    }

    // 분수 근처에 다가가면 물소리를 표현하는 작은 말풍선 아이콘을 띄운다
    createFountainSoundIcon() {
      const label = this.add.text(0, 0, "♪ 물소리", {
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#eaf6ff",
      });
      this.fountainSoundIcon = this.createRoundedCallout(label, {
        fillColor: 0x355c7d,
        borderColor: 0xeaf6ff,
        padX: 8,
        padY: 6,
      })
        .setDepth(35)
        .setVisible(false);
    }

    updateFountainProximity() {
      let nearest = null;
      let nearestDist = 90;
      this.fountains.forEach((f) => {
        const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, f.cx, f.cy);
        if (d < nearestDist) {
          nearestDist = d;
          nearest = f;
        }
      });

      if (nearest) {
        this.fountainSoundIcon.setPosition(nearest.cx, nearest.cy - 50);
        this.fountainSoundIcon.setVisible(true);
      } else {
        this.fountainSoundIcon.setVisible(false);
      }
    }

    // Projects 구역 근처에 다가가면 표시되는 반짝임 효과
    createProjectsSparkle() {
      this.projectsSparkle = this.add.container(0, 0).setDepth(40).setVisible(false);
      this.sparkleDots = [];
      for (let i = 0; i < 6; i++) {
        const dot = this.add.star(0, 0, 4, 2, 5, COLORS.lampGlow, 0.9).setScale(0.4);
        this.projectsSparkle.add(dot);
        this.sparkleDots.push(dot);
        this.tweens.add({
          targets: dot,
          alpha: { from: 0.2, to: 1 },
          scale: { from: 0.3, to: 0.7 },
          duration: Phaser.Math.Between(500, 900),
          yoyo: true,
          repeat: -1,
          delay: i * 120,
        });
      }
    }

    layoutSparkleDots(cx, cy) {
      const radius = 34;
      this.sparkleDots.forEach((dot, i) => {
        const angle = (i / this.sparkleDots.length) * Math.PI * 2;
        dot.setPosition(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.6 - 10);
      });
      this.projectsSparkle.setPosition(cx, cy);
    }

    // 구역에 들어서면 해당 구역의 글로우가 짧게 "톡" 튀어오르며 반응한다
    pulseZoneGlow(marker) {
      if (!marker?.glow) return;
      this.tweens.add({
        targets: marker.glow,
        scaleX: 1.4,
        scaleY: 1.4,
        duration: 220,
        yoyo: true,
        ease: "Sine.easeOut",
      });
    }

    // 이력서/포트폴리오 다운로드용 픽셀아트 우체통(📮). 중앙 화면의 빈 잔디 공간에
    // 하나만 배치하며, 플레이어가 근처에서 Enter를 누르면 React 쪽 다운로드 모달이 열린다.
    createMailbox() {
      const centerScreenOffsetX = TILE * MAP_COLS;
      const cx = centerScreenOffsetX + MAILBOX_TILE.x * TILE + TILE / 2;
      const cy = MAILBOX_TILE.y * TILE + TILE / 2;
      this.mailbox = { cx, cy };

      const g = this.add.graphics();

      // 바닥 그림자
      g.fillStyle(0x000000, 0.25);
      g.fillEllipse(cx, cy + 20, 34, 12);

      // 받침대(기둥)
      g.fillStyle(COLORS.signpost, 1);
      g.fillRect(cx - 3, cy, 6, 22);

      // 우체통 몸체
      g.fillStyle(0xb5563a, 1);
      g.fillRoundedRect(cx - 14, cy - 26, 28, 26, 8);
      g.fillStyle(0x9a4730, 1);
      g.fillRect(cx - 14, cy - 6, 28, 5);

      // 투입구
      g.fillStyle(0x1a1f2e, 1);
      g.fillRoundedRect(cx - 8, cy - 19, 16, 5, 2);

      // 깃발
      g.fillStyle(0xf4d35e, 1);
      g.fillTriangle(cx + 14, cy - 24, cx + 24, cy - 20, cx + 14, cy - 16);

      // 이모지 라벨 (요구사항: 📮 픽셀아트 오브젝트)
      // this.add.text(cx, cy - 46, "📮", { fontSize: "20px" }).setOrigin(0.5);

      const nameLabel = this.add
        .text(cx, cy + 32, "Mailbox", {
          fontFamily: "monospace",
          fontSize: "11px",
          color: "#f0ebe1",
          backgroundColor: "#1a1f2eaa",
          padding: { x: 6, y: 3 },
        })
        .setOrigin(0.5);
      this.mailbox.label = nameLabel;

      // 살짝 떠 있는 듯한 펄스 글로우로 시선을 끈다
      const glow = this.add.circle(cx, cy - 8, MAILBOX_RADIUS, 0x4a78a0, 0.08);
      glow.setStrokeStyle(2, 0x4a78a0, 0.35);
      this.tweens.add({
        targets: glow,
        alpha: { from: 0.06, to: 0.18 },
        duration: 1500,
        yoyo: true,
        repeat: -1,
      });
      this.mailbox.glow = glow;
      this.mailbox.bodyGraphics = g;

      // 우체통 본체만 막아서 플레이어가 통과하지 못하게 한다
      this.createObstacle(cx, cy - 4, 28, 30);

      // 마우스 호버 시 살짝 들썩이며 글로우가 밝아지는 반응을 준다 (PC 전용 — 모바일은 터치라 무관)
      this.addHoverBounce(this.mailbox, cx, cy - 4, 40, 56);
    }

    // 플레이어와 우체통 사이 거리를 매 프레임 확인해 안내 말풍선과
    // React 쪽 근접 상태(onMailboxEnter/onMailboxExit)를 갱신한다
    updateMailboxProximity() {
      if (!this.mailbox) return;
      const dist = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.mailbox.cx,
        this.mailbox.cy
      );
      const near = dist < MAILBOX_RADIUS;

      if (near) {
        this.mailboxEnterPrompt.setPosition(this.mailbox.cx, this.mailbox.cy - 64);
        this.mailboxEnterPrompt.setVisible(true);
      } else {
        this.mailboxEnterPrompt.setVisible(false);
      }

      if (near !== this.isNearMailbox) {
        this.isNearMailbox = near;
        if (near) {
          this.pulseZoneGlow(this.mailbox);
          if (onMailboxEnter) onMailboxEnter();
        } else if (onMailboxExit) {
          onMailboxExit();
        }
      }
    }

    // AI Portfolio Assistant NPC: 작은 로봇 모양 픽셀아트. 근처에서 Enter를 누르면
    // React 쪽 AI 챗봇 모달(NpcChatModal)이 열린다.
    createAiNpc() {
      const centerScreenOffsetX = TILE * MAP_COLS;
      const cx = centerScreenOffsetX + AI_NPC_TILE.x * TILE + TILE / 2;
      const cy = AI_NPC_TILE.y * TILE + TILE / 2;
      this.aiNpc = { cx, cy };

      const g = this.add.graphics();

      // 바닥 그림자
      g.fillStyle(0x000000, 0.25);
      g.fillEllipse(cx, cy + 22, 30, 11);

      // 로봇 몸체
      g.fillStyle(0x7ec8c9, 1);
      g.fillRoundedRect(cx - 12, cy - 8, 24, 26, 6);
      g.fillStyle(0x4a78a0, 1);
      g.fillRect(cx - 12, cy + 10, 24, 6);

      // 로봇 머리/화면
      g.fillStyle(0xf0ebe1, 1);
      g.fillRoundedRect(cx - 14, cy - 30, 28, 22, 6);
      g.fillStyle(0x1a1f2e, 1);
      g.fillRoundedRect(cx - 9, cy - 25, 8, 8, 2);
      g.fillRoundedRect(cx + 1, cy - 25, 8, 8, 2);

      // 안테나
      g.fillStyle(0x8a6d4b, 1);
      g.fillRect(cx - 1, cy - 38, 2, 8);
      g.fillStyle(0xf4d35e, 1);
      g.fillCircle(cx, cy - 40, 3);

      const nameLabel = this.add
        .text(cx, cy + 34, "AI Assistant", {
          fontFamily: "monospace",
          fontSize: "11px",
          color: "#f0ebe1",
          backgroundColor: "#1a1f2eaa",
          padding: { x: 6, y: 3 },
        })
        .setOrigin(0.5);
      this.aiNpc.label = nameLabel;

      // 펄스 글로우로 시선을 끈다
      const glow = this.add.circle(cx, cy - 8, AI_NPC_RADIUS, 0x7ec8c9, 0.08);
      glow.setStrokeStyle(2, 0x7ec8c9, 0.35);
      this.tweens.add({
        targets: glow,
        alpha: { from: 0.06, to: 0.18 },
        duration: 1500,
        yoyo: true,
        repeat: -1,
      });
      this.aiNpc.glow = glow;
      this.aiNpc.bodyGraphics = g;

      // 로봇 본체만 막아서 플레이어가 통과하지 못하게 한다
      this.createObstacle(cx, cy - 4, 26, 38);

      // 마우스 호버 시 살짝 들썩이며 글로우가 밝아지는 반응을 준다
      this.addHoverBounce(this.aiNpc, cx, cy - 10, 40, 60);
    }

    // 플레이어와 AI NPC 사이 거리를 매 프레임 확인해 안내 말풍선과
    // React 쪽 근접 상태(onAiNpcEnter/onAiNpcExit)를 갱신한다
    updateAiNpcProximity() {
      if (!this.aiNpc) return;
      const dist = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.aiNpc.cx,
        this.aiNpc.cy
      );
      const near = dist < AI_NPC_RADIUS;

      if (near) {
        this.aiNpcEnterPrompt.setPosition(this.aiNpc.cx, this.aiNpc.cy - 64);
        this.aiNpcEnterPrompt.setVisible(true);
      } else {
        this.aiNpcEnterPrompt.setVisible(false);
      }

      if (near !== this.isNearAiNpc) {
        this.isNearAiNpc = near;
        if (near) {
          this.pulseZoneGlow(this.aiNpc);
          if (onAiNpcEnter) onAiNpcEnter();
        } else if (onAiNpcExit) {
          onAiNpcExit();
        }
      }
    }

    // 마우스를 올리면 살짝 들썩이고 글로우가 밝아지는 호버 반응을 추가한다.
    // (PC 마우스 전용 — 모바일 터치에서는 pointerover가 거의 발생하지 않아 자연히 무동작)
    addHoverBounce(target, cx, cy, width, height) {
      const zone = this.add.zone(cx, cy, width, height).setInteractive({ useHandCursor: true });
      const baseY = target.bodyGraphics.y;
      const idleGlowTween = {
        targets: target.glow,
        alpha: { from: 0.06, to: 0.18 },
        duration: 1500,
        yoyo: true,
        repeat: -1,
      };

      zone.on("pointerover", () => {
        this.tweens.killTweensOf(target.bodyGraphics);
        this.tweens.add({
          targets: target.bodyGraphics,
          y: baseY - 5,
          duration: 220,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });
        if (target.glow) {
          this.tweens.killTweensOf(target.glow);
          this.tweens.add({ targets: target.glow, alpha: 0.32, duration: 200, ease: "Sine.easeOut" });
        }
      });

      zone.on("pointerout", () => {
        this.tweens.killTweensOf(target.bodyGraphics);
        this.tweens.add({ targets: target.bodyGraphics, y: baseY, duration: 150, ease: "Sine.easeOut" });
        if (target.glow) {
          this.tweens.killTweensOf(target.glow);
          this.tweens.add(idleGlowTween);
        }
      });
    }

    // 외부 에셋이 없으므로 작은 단색 원 텍스처를 직접 생성해 파티클(반딧불이)에 사용한다
    createGlowTexture(key, color, radius) {
      if (this.textures.exists(key)) return key;
      const size = radius * 2;
      const g = this.add.graphics();
      g.fillStyle(color, 1);
      g.fillCircle(radius, radius, radius);
      g.generateTexture(key, size, size);
      g.destroy();
      return key;
    }

    // 다크모드(밤) 전용 비주얼: 톤다운 오버레이 + 별 + 반딧불이 + NPC 네온 라이트.
    // 라이트모드에서는 전부 알파 0으로 숨겨두고, 테마 전환 시 부드럽게 페이드한다.
    createNightEffects() {
      // 모바일은 GPU/배터리 부담이 크므로 별/반딧불이 개수와 파티클 발생 빈도를 줄인다
      const isSmallScreen = this.scale.width < 768;
      const starCount = isSmallScreen ? 35 : 70;
      const fireflyFrequency = isSmallScreen ? 600 : 350;

      // 전체 톤다운 오버레이. 카메라 줌/스크롤에 영향받지 않도록 화면이 아니라
      // 월드 전체 크기로 깔아둔다 (뷰포트는 항상 월드 범위 안에 있으므로 항상 덮인다).
      this.nightOverlay = this.add
        .rectangle(0, 0, WORLD_W, WORLD_H, 0x0a1020, 0)
        .setOrigin(0, 0)
        .setDepth(9000);

      // 별: 도로 위쪽(원래 '하늘'이 보이던 영역)에 흩어 놓고 각자 다른 박자로 깜빡인다
      this.starsLayer = this.add.container(0, 0).setDepth(9010).setAlpha(0);
      for (let i = 0; i < starCount; i++) {
        const x = Phaser.Math.Between(0, WORLD_W);
        const y = Phaser.Math.Between(0, ROAD_TOP - 8);
        const baseAlpha = Phaser.Math.FloatBetween(0.3, 0.9);
        const star = this.add.circle(x, y, Phaser.Math.Between(1, 2), 0xf0ebe1, baseAlpha);
        this.starsLayer.add(star);
        this.tweens.add({
          targets: star,
          alpha: { from: baseAlpha, to: baseAlpha * 0.25 },
          duration: Phaser.Math.Between(1200, 2600),
          yoyo: true,
          repeat: -1,
          delay: Phaser.Math.Between(0, 1500),
        });
      }

      // 반딧불이: 잔디/인도 영역을 떠다니는 옅은 연두색 파티클
      const fireflyTextureKey = this.createGlowTexture("firefly-glow", 0xcdeb6e, 6);
      this.fireflyEmitter = this.add
        .particles(0, 0, fireflyTextureKey, {
          x: { min: 0, max: WORLD_W },
          y: { min: ROAD_BOTTOM + 20, max: WORLD_H - 16 },
          lifespan: { min: 3000, max: 6000 },
          speedX: { min: -10, max: 10 },
          speedY: { min: -10, max: 10 },
          scale: { start: 0.6, end: 0.1 },
          alpha: { start: 0.85, end: 0 },
          frequency: fireflyFrequency,
          blendMode: "ADD",
        })
        .setDepth(9005);
      this.fireflyEmitter.stop();

      // AI Assistant 주변 블루 네온 (오버레이보다 위 depth라 어둠 속에서도 또렷하게 빛난다)
      this.aiNpcNeon = this.add
        .container(this.aiNpc.cx, this.aiNpc.cy - 8)
        .setDepth(9001)
        .setAlpha(0);
      const aiNeonRing = this.add.circle(0, 0, AI_NPC_RADIUS + 6, 0x4fc3f7, 0.22);
      aiNeonRing.setStrokeStyle(3, 0x4fc3f7, 0.6);
      this.aiNpcNeon.add(aiNeonRing);
      this.tweens.add({
        targets: aiNeonRing,
        alpha: 0.5,
        duration: 900,
        yoyo: true,
        repeat: -1,
      });

      // 우체통 주변 은은한 조명
      this.mailboxNeon = this.add
        .container(this.mailbox.cx, this.mailbox.cy - 8)
        .setDepth(9001)
        .setAlpha(0);
      const mailboxLight = this.add.circle(0, 0, MAILBOX_RADIUS + 4, 0xfff4cc, 0.15);
      this.mailboxNeon.add(mailboxLight);
      this.tweens.add({
        targets: mailboxLight,
        alpha: 0.32,
        duration: 1400,
        yoyo: true,
        repeat: -1,
      });
    }

    // data-theme 속성을 읽어 현재 테마를 판단한다 (속성이 없으면 다크 테마가 기본값)
    readCurrentTheme() {
      return document.documentElement.dataset.theme === "light" ? "light" : "dark";
    }

    // 테마 전환 시 밤 비주얼 전체를 부드럽게 페이드 인/아웃한다.
    // instant=true면(최초 진입 시) 깜빡임 없이 즉시 목표 알파로 맞춘다.
    applyThemeVisuals(theme, instant = false) {
      const isDark = theme === "dark";
      const overlayAlpha = isDark ? 0.45 : 0;
      const layerAlpha = isDark ? 1 : 0;

      // 월드 바깥(레터박스) 영역의 배경색도 함께 바꿔 '하늘'이 옅은 크림색으로
      // 남아있지 않게 한다. setBackgroundColor는 트윈 대상이 될 수 없으므로
      // 카메라의 fadeOut/fadeIn 없이 즉시 전환하되, 오버레이 페이드와 겹쳐
      // 어색함이 드러나지 않게 한다.
      this.cameras.main.setBackgroundColor(isDark ? "#0a1020" : "#d8d0c3");

      if (instant) {
        this.nightOverlay.setAlpha(overlayAlpha);
        this.starsLayer.setAlpha(layerAlpha);
        this.aiNpcNeon.setAlpha(layerAlpha);
        this.mailboxNeon.setAlpha(layerAlpha);
      } else {
        const duration = 600;
        const ease = "Sine.easeInOut";
        this.tweens.add({ targets: this.nightOverlay, alpha: overlayAlpha, duration, ease });
        this.tweens.add({ targets: this.starsLayer, alpha: layerAlpha, duration, ease });
        this.tweens.add({ targets: this.aiNpcNeon, alpha: layerAlpha, duration, ease });
        this.tweens.add({ targets: this.mailboxNeon, alpha: layerAlpha, duration, ease });
      }

      if (isDark) {
        this.fireflyEmitter?.start();
      } else {
        this.fireflyEmitter?.stop();
      }
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
    // 플레이어 전용 색상 — NPC 팔레트(아래)와 겹치지 않는 사이트 시그니처 오렌지 상의로
    // 첫눈에 "내 캐릭터"를 구분할 수 있게 한다 (상의 중앙엔 코드 배지를 별도로 그린다)
    me: [0x2b1d1d, 0xffd0bd, 0xf4a259, 0x2e3550],
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

    // 개발자 컨셉 포인트: 플레이어 상의 중앙에만 작은 코드 배지를 달아
    // NPC와 즉시 구분되도록 한다. 1px 선은 이 해상도에서 뭉개져 보이므로
    // 2px 블록으로 큼직한 ">" 쉐브론을 그려 작아도 또렷하게 보이게 한다.
    if (type === "me") {
      g.fillStyle(0xf0ebe1, 1);
      g.fillRoundedRect(-5, -6, 10, 10, 2);
      g.lineStyle(1, 0x1a1f2e, 1);
      g.strokeRoundedRect(-5, -6, 10, 10, 2);

      g.fillStyle(0x1a1f2e, 1);
      g.fillRect(-2, -4, 2, 2);
      g.fillRect(0, -2, 2, 2);
      g.fillRect(-2, 0, 2, 2);
    }

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

    // Home 버튼/플레이어 스폰이 항상 같은 위치를 가리키도록 한 곳에서 계산한다
    getHomePosition() {
      const screenW = TILE * MAP_COLS;
      return {
        x: screenW + (MAP_COLS / 2) * TILE,
        y: (MAP_ROWS / 2) * TILE + TILE * 2,
      };
    }

    createPlayer() {
      // 중앙 화면(화면 1)의 중앙에 플레이어 배치
      const { x: startX, y: startY } = this.getHomePosition();

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

    // 입장 가능한 구역 위에 표시할 안내 말풍선
    createZoneEnterPrompt() {
      const isMobile =
        this.scale.width <= 768 ||
        window.matchMedia("(pointer: coarse)").matches;

      const text = isMobile
        ? "📍 구역에 들어왔습니다"
        : "⏎ Enter 키로 입장";

      const label = this.add.text(0, 0, text, {
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

    // 우체통 위에 표시할 "Enter 키로 열기" 안내 말풍선 (Zone과 다른 색으로 구분)
    createMailboxEnterPrompt() {
      const isMobile =
        this.scale.width <= 768 ||
        window.matchMedia("(pointer: coarse)").matches;

      const text = isMobile ? "✉️ 우편함에 도착했습니다" : "✉️ Enter 키로 우편함 열기";

      const label = this.add.text(0, 0, text, {
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#f0ebe1",
      });

      this.mailboxEnterPrompt = this.createRoundedCallout(label, {
        fillColor: 0x4a78a0,
        borderColor: 0xf0ebe1,
      })
        .setDepth(35)
        .setVisible(false);
    }

    createAiNpcEnterPrompt() {
      const isMobile =
        this.scale.width <= 768 ||
        window.matchMedia("(pointer: coarse)").matches;

      const text = isMobile ? "🤖 AI와 대화할 수 있어요" : "🤖 Enter 키로 대화하기";

      const label = this.add.text(0, 0, text, {
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#1a1f2e",
      });

      this.aiNpcEnterPrompt = this.createRoundedCallout(label, {
        fillColor: 0x7ec8c9,
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
      const enterLine = isMobileInput
        ? "구역 근처에서 버튼을 탭하면 입장할 수 있어요."
        : "Enter 키를 누르면 공간에 입장할 수 있어요.";

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
      const { x: startX, y: startY } = this.getHomePosition();
      // setPosition()만 호출하면 Arcade Body가 다음 스텝에 예전 위치로 되돌려 버려서
      // 텔레포트가 즉시 취소된 것처럼 보인다. body.reset()으로 body와 좌표를 함께 옮긴다.
      this.player.body.reset(startX, startY);
      this.cameras.main.centerOn(startX, startY);
    }

    // Home 버튼이 불필요하게 카메라/플레이어를 다시 이동시키지 않도록,
    // 이미 홈 위치 근처에 있는지 확인한다
    isAtHome() {
      if (!this.player) return true;
      const { x: startX, y: startY } = this.getHomePosition();
      return Phaser.Math.Distance.Between(this.player.x, this.player.y, startX, startY) < 4;
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

      // 강아지 산책 + 꼬리 흔들기 상호작용
      if (this.dogs) {
        this.dogs.forEach((dog) => {
          this.updateDogMovement(dog, delta);
          this.updateDogTailProximity(dog);
        });
      }

      // 분수 근처 물소리 아이콘
      if (this.fountains) {
        this.updateFountainProximity();
      }

      // 떠다니는 벚꽃잎
      if (this.petals) {
        this.updatePetals(time, delta);
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
        if (nearestZone && nearestMarker) this.pulseZoneGlow(nearestMarker);
        this.activeZone = nearestZone;
      }

      // Projects 구역 근처 반짝임 효과
      if (this.projectsSparkle) {
        if (nearestZone === "projects" && nearestMarker) {
          this.layoutSparkleDots(nearestMarker.cx, nearestMarker.cy);
          this.projectsSparkle.setVisible(true);
        } else {
          this.projectsSparkle.setVisible(false);
        }
      }

      this.updateCompass();
      this.updateInteraction();
      this.updateMailboxProximity();
      this.updateAiNpcProximity();
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
