# 포트폴리오 코드 구조 개선 가이드

## 개선 사항 요약

### 1. **전역 상태 관리 (Context API)**
- `src/context/GameContext.jsx`: 게임의 모든 상태를 중앙에서 관리
- 게임 인스턴스, 활성 존(zone), 현재 씬 등을 Context로 제공
- `useGame()` 훅으로 어디서든 상태 접근 가능

### 2. **커스텀 훅 (Custom Hooks)**
- `src/hooks/usePhaserGame.js`: Phaser 게임 인스턴스 관리
- `src/hooks/useKeyboardInput.js`: 키보드 입력 처리
- 로직을 재사용 가능한 훅으로 분리하여 컴포넌트 단순화

### 3. **설정 중앙화 (Configuration)**
- `src/config/gameConfig.js`: 게임의 모든 상수와 설정
  - 색상 팔레트, 게임 크기, Phaser 설정 등
- `src/config/zonesConfig.js`: 존(zone) 메타데이터
  - 제목, 아이콘, 설명, 색상 등을 한 곳에서 관리

### 4. **모달 컴포넌트 분리**
- `src/components/modals/`: 각 존별 컨텐츠를 독립적인 컴포넌트로 분리
  - `AboutContent.jsx`
  - `TechnologiesContent.jsx`
  - `CvContent.jsx`
  - `ProjectsContent.jsx`
  - `ContactContent.jsx`
- `ZoneModal.jsx`: 동적으로 컴포넌트를 렌더링하는 래퍼

## 폴더 구조

```
src/
├── context/
│   └── GameContext.jsx              # 전역 상태 관리
├── hooks/
│   ├── usePhaserGame.js             # 게임 초기화 로직
│   ├── useKeyboardInput.js          # 입력 처리 로직
│   └── index.js                     # 훅 export
├── config/
│   ├── gameConfig.js                # 게임 상수 및 설정
│   └── zonesConfig.js               # 존 메타데이터
├── components/
│   ├── TopBar.jsx                   # 상단 네비게이션
│   ├── ZoneHint.jsx                 # 존 진입 힌트
│   ├── ZoneModal.jsx                # 모달 컨테이너
│   ├── FooterHint.jsx               # 하단 힌트
│   ├── VirtualJoystick.jsx          # 모바일 조이스틱
│   └── modals/                      # 모달 컨텐츠 컴포넌트
│       ├── AboutContent.jsx
│       ├── TechnologiesContent.jsx
│       ├── CvContent.jsx
│       ├── ProjectsContent.jsx
│       ├── ContactContent.jsx
│       └── index.js                 # modals export
├── game/
│   ├── gardenScene.js               # 게임 씬
│   └── introScene.js                # 인트로 씬
├── data/
│   └── portfolioData.js             # 포트폴리오 데이터
├── App.jsx                          # 메인 앱 컴포넌트
└── main.jsx                         # 진입점
```

## 핵심 패턴

### 1. Context를 통한 상태 접근
```jsx
// 어디서든 이렇게 사용
const { activeZone, hintZone, openZone, closeZone } = useGame();
```

### 2. 커스텀 훅의 활용
```jsx
// 게임 초기화
usePhaserGame(gameContainerRef);

// 키보드 입력
useKeyboardInput();
```

### 3. 설정 기반 렌더링
```jsx
// 존 목록을 설정에서 가져와 사용
{ZONES.map((zoneKey) => (
  <button key={zoneKey}>{TOP_BAR_LABELS[zoneKey]}</button>
))}
```

### 4. 모달 컴포넌트 동적 렌더링
```jsx
// 존 key에 따라 자동으로 올바른 컴포넌트 렌더링
const ContentComponent = MODAL_COMPONENTS[zoneKey];
return <ContentComponent />;
```

## peteroravec.com과의 비교

### 공통점 ✅
- 게임형 포트폴리오 인터페이스
- 영역(zone) 탐험 방식
- 모달/정보 팝업 시스템
- 픽셀 아트 스타일
- 키보드/터치 입력 지원

### 우수한 구현 패턴
- **Context API**: 전역 상태 관리의 명확한 구조
- **커스텀 훅**: 로직 재사용성 증대
- **설정 중앙화**: 유지보수와 확장이 용이
- **컴포넌트 분리**: 테스트와 재사용이 쉬움

## 장점

1. **확장성**: 새로운 존을 추가하려면 설정만 수정하면 됨
2. **유지보수**: 로직이 명확히 분리되어 있어 버그 수정이 용이
3. **테스트 가능**: 각 컴포넌트가 독립적으로 테스트 가능
4. **재사용성**: 훅과 컴포넌트를 다른 프로젝트에서도 재사용 가능
5. **성능**: Context 최적화로 불필요한 리렌더링 최소화

## 다음 단계 추천

1. **상태 관리 최적화**
   - 큰 상태 객체를 더 작은 Context로 분할
   - useMemo, useCallback으로 최적화

2. **에러 처리**
   - Error Boundary 추가
   - 로딩 상태 관리

3. **성능 모니터링**
   - React DevTools Profiler 사용
   - 불필요한 리렌더링 감지

4. **테스트 추가**
   - 컴포넌트 테스트 (Vitest)
   - 통합 테스트 (Playwright)

5. **타입 안정성**
   - TypeScript 도입 고려
