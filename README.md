# LEGO — Build Your Space

BEXCO 팝업 공간 디자인 발표 사이트. 원본 PPT 20페이지의 리서치와 콘셉트를 스크롤 발표로 재구성했습니다.

## 실행

Node.js 24 환경에서:

```sh
npm ci
npm run dev
```

배포 파일 생성: `npm run build` (결과: `dist/`). 미리보기: `npm run preview`.

## GitHub Pages

공개 저장소의 `main` 브랜치에 소스를 올리고 Settings → Pages → Source에서 **GitHub Actions**를 선택합니다. 포함된 `.github/workflows/deploy.yml`이 빌드 후 배포합니다. GitHub Pages 기본 도메인을 사용하며 서버와 유료 API는 필요 없습니다.

## 발표 조작

- 첫 방문: 약 7초 동안 실제 3D 브릭이 모여 LEGO 글자를 구성합니다. 무음입니다.
- SKIP INTRO 또는 Esc: 즉시 발표 화면으로 이동합니다.
- INTRO / 인트로 다시 보기: 처음부터 다시 재생합니다.
- 같은 탭에서 새로고침하면 오프닝을 반복하지 않습니다.
- 스크롤 / PageDown / PageUp / 방향키: 발표 진행.
- 오른쪽 목차: 해당 구간 이동.
- 핵심 공간 버튼과 변화 시연 버튼: 네 가지 개념 시뮬레이션.
- 하단: 전체 화면 및 모션 줄이기.

## 콘텐츠 범위

실측 평면과 공간 렌더링은 원본 PPT에 없습니다. 사이트의 프로그램 관계도 및 체험 다이어그램은 개념 시뮬레이션이며 확정 설계가 아닙니다. BEXCO 내 정확한 대상 구역, 면적, 출입구, 층고는 후속 설계 자료가 필요합니다. 사용자 제공 이미지는 블록의 재질 참고로만 사용합니다.

## 오프닝

Three.js의 둥근 모서리 형상, Stud, 플라스틱 물리 재질, 환경 반사, 바닥 그림자로 구현합니다. 실제 영상 파일을 재생하는 방식이 아니라 브라우저 3D 렌더링입니다. 픽셀 비율을 1.5로 제한하고, 약 7초 뒤 렌더러·재질·형상을 해제합니다. WebGL이 불가능하면 본문 진입 버튼이 표시됩니다. 느린 네트워크에서도 건너뛰기가 가능합니다.

## 주요 수정 위치

- `app/page.tsx`: 발표 내용, 조닝, 핵심 공간 다이어그램
- `components/brick-intro.tsx`: LEGO 브릭 조립 오프닝
- `app/globals.css`: 레이아웃, 반응형, 모션
- `public/brick-reference.png`: 사용자 제공 참고 이미지

학과 프로젝트이며 LEGO 또는 BEXCO의 공식 사이트가 아닙니다.
