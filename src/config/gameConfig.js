// ============================================================
// 게임 전역 설정 파일
// 게임의 기본 상수, 색상, 레이아웃 등을 한 곳에서 관리합니다
// ============================================================

export const GAME_CONFIG = {
  // 게임 월드 설정
  world: {
    tile: 32,
    cols: 24,
    rows: 16,
  },

  // 색상 팔레트
  colors: {
    // 배경
    bg: "#1a1f2e",
    bgDark: "#0f1419",

    // 게임 세계
    grassA: 0x4a7c59,
    grassB: 0x537f63,
    path: 0xd9b370,
    pathEdge: 0xc4a05f,
    water: 0x355c7d,
    waterLight: 0x4a78a0,

    // 건물/오브젝트
    building: 0x6b4f3a,
    buildingRoof: 0xb5563a,
    buildingRoofShadow: 0x9a4730,
    signpost: 0x8a6d4b,

    // 식물
    flowerPink: 0xe98ca0,
    flowerYellow: 0xf4d35e,
    treeTrunk: 0x5c4530,
    treeLeaf: 0x3f6b4a,
    treeLeafLight: 0x4d8159,

    // 캐릭터
    playerBody: 0xf4a259,
    playerShirt: 0x7ec8c9,

    // UI
    outline: 0x1a1f2e,
    accent: "#f4a259",
    text: "#f0ebe1",
  },

  // Phaser 설정
  phaser: {
    pixelArt: true,
    physics: {
      arcade: {
        debug: false,
      },
    },
  },
};

// 계산된 월드 크기
export const WORLD_WIDTH =
  GAME_CONFIG.world.tile * GAME_CONFIG.world.cols;
export const WORLD_HEIGHT =
  GAME_CONFIG.world.tile * GAME_CONFIG.world.rows;

// 반응형 breakpoint
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
};
