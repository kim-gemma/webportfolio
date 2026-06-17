# 코드 정원 포트폴리오

React + Phaser.js로 만든 게임형 인터랙티브 포트폴리오입니다. 캐릭터가 픽셀아트 정원 맵을 돌아다니며 About / Skills / Experience / Projects / Contact 구역을 발견하는 구조입니다.

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 으로 접속합니다.

빌드:

```bash
npm run build
npm run preview
```

## 내 정보로 교체하기

모든 텍스트 콘텐츠는 `src/data/portfolioData.js` 한 파일에 모여 있습니다. 이 파일의 값만 수정하면 화면 전체가 업데이트됩니다.

- `profile`: 이름, 직무, 한 줄 소개
- `about`: 자기소개 문단
- `skills`: 기술 스택 목록 (level은 1~5)
- `experience`: 경력 타임라인
- `projects`: 프로젝트 카드
- `contact`: 연락처 및 링크

## 구조

```
src/
  main.jsx              진입점
  App.jsx                전체 레이아웃 + Phaser 게임 마운트
  styles.css             전체 스타일 (디자인 토큰 포함)
  game/
    gardenScene.js        Phaser 씬: 맵, 캐릭터, zone 충돌 로직
  components/
    IntroScreen.jsx        시작 화면
    TopBar.jsx              상단 바로가기 네비게이션
    ZoneHint.jsx            구역 근처 말풍선 힌트
    VirtualJoystick.jsx     모바일 가상 조이스틱
    ZoneModal.jsx           구역별 정보 모달 (About/Skills/Experience/Projects/Contact)
  data/
    portfolioData.js        모든 텍스트 콘텐츠
```

## 조작 방법

- PC: WASD 또는 방향키로 이동, 구역 근처에서 Enter로 정보 열기, Esc로 닫기
- 모바일: 화면 좌하단 가상 조이스틱으로 이동, 구역 진입 시 자동으로 힌트가 뜨고 탭하면 모달이 열림
- 상단 바의 메뉴를 눌러 바로 이동 없이 각 구역 정보를 열 수도 있습니다

## 비주얼 에셋에 대해

모든 캐릭터, 건물, 맵 타일은 외부 이미지 파일 없이 Phaser의 Graphics API로 코드 안에서 직접 그립니다(`gardenScene.js` 참고). 나중에 실제 스프라이트 이미지(PNG)로 교체하고 싶다면 `preload()`에서 이미지를 로드하고, `drawZoneBuildings()` / `createPlayer()`의 Graphics 호출을 `this.add.sprite(...)` 호출로 바꾸면 됩니다.

## 커스터마이징 팁

- 색상, 폰트 등 디자인 토큰은 `src/styles.css` 상단의 `:root` 변수에 모여 있습니다.
- 맵 크기나 구역 위치는 `src/game/gardenScene.js`의 `MAP_COLS`, `MAP_ROWS`, `ZONES` 배열에서 조정합니다.
- 새로운 구역(zone)을 추가하려면 `ZONES` 배열에 항목을 추가하고, `ZoneModal.jsx`에 해당 콘텐츠 컴포넌트를 추가하면 됩니다.
