/* eslint-disable jsx-a11y/prefer-tag-over-role -- SVG diagrams need an explicit accessible image role. */
/* eslint-disable next/no-img-element -- Static GitHub Pages deployment uses a supplied local image with explicit dimensions. */
'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import VideoIntro from '@/components/video-intro';

const chapters = [
  ['home', 'OPENING'],
  ['idea', 'SYSTEM'],
  ['site', 'KINTEX'],
  ['concept', 'CONCEPT'],
  ['experiences', 'EXPERIENCE'],
  ['material', 'MATERIAL'],
  ['ending', 'REBUILD'],
];
const scenes = [
  {
    name: 'BUILD WALL',
    ko: '함께 완성하는 벽',
    body: '처음엔 비어 있는 벽. 방문객이 브릭을 붙일수록 새로운 패턴과 이야기가 채워집니다.',
    detail: 'INCOMPLETE → PARTICIPATION → COMPLETE',
    color: '#ffd500',
  },
  {
    name: 'BUILD TABLE',
    ko: '규모에 맞춰 바뀌는 테이블',
    body: '하나의 모듈을 분리하고 결합합니다. 행사 규모와 체험 프로그램에 따라 가구 구성을 바꿀 수 있습니다.',
    detail: '1 MODULE × N / SEPARATE · CONNECT',
    color: '#d8272e',
  },
  {
    name: 'MINIFIG LAB',
    ko: '나만의 조합을 찾는 곳',
    body: '머리, 몸통, 다리, 액세서리를 선택하는 개인화 경험. 방문객의 취향이 하나의 조합으로 나타납니다.',
    detail: 'IDENTITY + COMBINATION',
    color: '#2984d2',
  },
  {
    name: 'LEGO CITY',
    ko: '매일 성장하는 전시',
    body: '방문객의 작품이 하나의 도시에 계속 추가됩니다. 첫날의 전시와 마지막 날의 전시는 서로 다른 풍경이 됩니다.',
    detail: 'DAY 1 → FINAL DAY',
    color: '#ffd500',
  },
];

function Diagram({ scene, step }: { scene: number; step: number }) {
  const palette = ['#ffd500', '#d8272e', '#2984d2', '#f4f2e8'];
  return (
    <svg
      viewBox="0 0 640 440"
      role="img"
      aria-label={`${scenes[scene].ko} 개념 다이어그램`}
      className="experience-svg"
    >
      <defs>
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#ffffff10" />
        </pattern>
      </defs>
      <rect width="640" height="440" fill="url(#grid)" />
      {scene === 0 &&
        Array.from({ length: 70 }, (_, i) => {
          const filled = i < 18 + step * 13;
          return (
            <g
              key={i}
              className="diagram-unit"
              style={{ transitionDelay: `${(i % 10) * 20}ms` }}
            >
              <rect
                x={52 + (i % 10) * 54}
                y={42 + Math.floor(i / 10) * 48}
                width="49"
                height="42"
                rx="3"
                fill={
                  filled
                    ? palette[(i * 7 + Math.floor(i / 10)) % 4]
                    : '#ffffff08'
                }
                stroke={filled ? 'none' : '#ffffff35'}
              />
              {filled && (
                <>
                  <circle
                    cx={66 + (i % 10) * 54}
                    cy={63 + Math.floor(i / 10) * 48}
                    r="6"
                    fill="#00000016"
                  />
                  <circle
                    cx={87 + (i % 10) * 54}
                    cy={63 + Math.floor(i / 10) * 48}
                    r="6"
                    fill="#00000016"
                  />
                </>
              )}
            </g>
          );
        })}
      {scene === 1 &&
        Array.from({ length: 6 }, (_, i) => {
          const joined = step % 2 === 1;
          return (
            <g
              key={i}
              style={{
                transform: `translate(${joined ? 170 + (i % 3) * 100 : 80 + (i % 3) * 175}px,${joined ? 125 + Math.floor(i / 3) * 100 : 80 + Math.floor(i / 3) * 180}px)`,
                transition: 'transform 900ms cubic-bezier(.22,1,.36,1)',
              }}
            >
              <rect
                width="94"
                height="94"
                fill={i % 2 ? '#e1ddd2' : '#d8272e'}
                rx="3"
              />
              <text
                x="47"
                y="53"
                textAnchor="middle"
                fill={i % 2 ? '#191919' : 'white'}
                fontSize="14"
              >
                M0{i + 1}
              </text>
            </g>
          );
        })}
      {scene === 2 &&
        ['HEAD', 'BODY', 'LEGS', 'ACCESSORY'].map((label, i) => (
          <g key={label}>
            <text
              x="64"
              y={77 + i * 88}
              fill="#b7b7b0"
              fontSize="12"
              letterSpacing="2"
            >
              {label}
            </text>
            {Array.from({ length: 4 }, (_, j) => (
              <g key={j}>
                <rect
                  x={190 + j * 92}
                  y={45 + i * 88}
                  width="72"
                  height="52"
                  rx="3"
                  fill={palette[(j + i) % 4]}
                  opacity={j === (step + i) % 4 ? 1 : 0.18}
                  style={{ transition: 'opacity 500ms' }}
                />
                <text
                  x={226 + j * 92}
                  y={76 + i * 88}
                  fontSize="12"
                  textAnchor="middle"
                  fill="#111"
                >
                  0{j + 1}
                </text>
                {j === (step + i) % 4 && (
                  <path
                    d={`M${214 + j * 92} ${108 + i * 88} h24`}
                    stroke="white"
                    strokeWidth="2"
                  />
                )}
              </g>
            ))}
          </g>
        ))}
      {scene === 3 &&
        Array.from({ length: 30 }, (_, i) => {
          const active = i < 6 + step * 8;
          const x = 80 + (i % 10) * 49,
            y = 330 - Math.floor(i / 10) * 75,
            height = 30 + ((i * 17) % 65);
          return (
            <g
              key={i}
              style={{
                opacity: active ? 1 : 0.1,
                transform: `translateY(${active ? 0 : 20}px)`,
                transition: `all 600ms ${(i % 5) * 50}ms`,
              }}
            >
              <rect
                x={x}
                y={y - height}
                width="38"
                height={height}
                fill={palette[i % 4]}
              />
              <path
                d={`M${x} ${y - height} l12 -10 h38 l-12 10Z`}
                fill={palette[i % 4]}
                opacity=".7"
              />
              <path
                d={`M${x + 38} ${y - height} l12 -10 v${height} l-12 10Z`}
                fill={palette[i % 4]}
                opacity=".45"
              />
            </g>
          );
        })}
    </svg>
  );
}

export default function Home() {
  const [intro, setIntro] = useState(true),
    [introKey, setIntroKey] = useState(0),
    [active, setActive] = useState('home'),
    [scene, setScene] = useState(0),
    [step, setStep] = useState(0),
    [reduced, setReduced] = useState(false),
    [full, setFull] = useState(false);
  const main = useRef<HTMLElement>(null);
  const finish = useCallback(() => {
    setIntro(false);
    document.getElementById('home-title')?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const media = matchMedia('(prefers-reduced-motion: reduce)');
      setReduced(media.matches);
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('main>section[id]'),
    );
    let raf = 0;
    const update = () => {
      raf = 0;
      let current = 'home';
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top < innerHeight * 0.45) current = section.id;
        const p = Math.max(
          0,
          Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)),
        );
        section.style.setProperty('--progress', String(p));
        const revealPoint = section.id === 'idea' ? 0.62 : 0.88;
        if (rect.top < innerHeight * revealPoint)
          section.classList.add('is-visible');
      }
      setActive(current);
      const experience = document.getElementById('experiences');
      if (experience && innerWidth > 1000 && innerHeight > 760) {
        const r = experience.getBoundingClientRect();
        if (r.top < 0 && r.bottom > innerHeight) {
          const t = Math.min(3.999, (-r.top / (r.height - innerHeight)) * 4);
          setScene(Math.floor(t));
          setStep(Math.min(3, Math.floor((t % 1) * 4)));
        }
      }
    };
    const scroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', scroll, { passive: true });
    const key = (e: KeyboardEvent) => {
      if (
        intro ||
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        (e.target instanceof HTMLElement &&
          /INPUT|BUTTON|SELECT|TEXTAREA/.test(e.target.tagName))
      )
        return;
      if (['PageDown', 'PageUp', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        let index = sections.findIndex((s) => s.id === currentSection());
        index += ['PageDown', 'ArrowDown'].includes(e.key) ? 1 : -1;
        sections[
          Math.min(sections.length - 1, Math.max(0, index))
        ]?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' });
      }
    };
    const currentSection = () => {
      let id = 'home';
      for (const section of sections)
        if (section.getBoundingClientRect().top < innerHeight * 0.45)
          id = section.id;
      return id;
    };
    window.addEventListener('keydown', key);
    const fs = () => setFull(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', fs);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('keydown', key);
      document.removeEventListener('fullscreenchange', fs);
    };
  }, [intro, reduced]);
  const replay = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIntroKey((k) => k + 1);
    setIntro(true);
  };
  const fullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      setFull(false);
    }
  };
  return (
    <>
      {intro && <VideoIntro key={introKey} onFinish={finish} />}
      <div
        className={intro ? 'site-shell intro-active' : 'site-shell'}
        inert={intro ? true : undefined}
        aria-hidden={intro || undefined}
      >
        <a className="skip-link" href="#idea">
          발표 내용으로 이동
        </a>
        <header className="topbar">
          <a href="#home" className="wordmark">
            LEGO<span>SPACE STUDY</span>
          </a>
          <div className="header-right">
            <span>KINTEX</span>
            <Button className="quiet-button" onClick={replay}>
              INTRO ↻
            </Button>
          </div>
        </header>
        <nav className="chapter-nav" aria-label="발표 목차">
          {chapters.map(([id, name], i) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? 'active' : ''}
              aria-current={active === id ? 'location' : undefined}
            >
              <span className="nav-number">0{i + 1}</span>
              <span className="nav-name">{name}</span>
            </a>
          ))}
        </nav>
        <main ref={main}>
          <section
            id="home"
            className={intro ? 'hero' : 'hero hero-ready'}
            onPointerMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              event.currentTarget.style.setProperty(
                '--mx',
                String((event.clientX - rect.left) / rect.width - 0.5),
              );
              event.currentTarget.style.setProperty(
                '--my',
                String((event.clientY - rect.top) / rect.height - 0.5),
              );
            }}
            onPointerLeave={(event) => {
              event.currentTarget.style.setProperty('--mx', '0');
              event.currentTarget.style.setProperty('--my', '0');
            }}
          >
            <div className="hero-grid" aria-hidden="true" />
            <div className="hero-modules" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="eyebrow">SPATIAL DESIGN PROJECT — KINTEX</div>
            <h1 id="home-title" tabIndex={-1}>
              <span className="hero-word hero-word-build">BUILD</span>
              <br />
              <span className="hero-word hero-word-your">YOUR</span>{' '}
              <span className="hero-word hero-word-space">SPACE</span>
              <span className="period">.</span>
            </h1>
            <div className="hero-bottom">
              <p>
                완성된 공간을 보는 것이 아니라,
                <br />
                참여하며 완성하는 공간.
              </p>
              <a href="#idea">
                SCROLL TO EXPLORE <span>↓</span>
              </a>
            </div>
            <div className="hero-stamp">
              A SPACE THAT IS
              <br />
              NEVER FINISHED
            </div>
            <div className="hero-side">MODULE / CONNECTION / PARTICIPATION</div>
          </section>
          <section id="idea" className="section idea">
            <div className="eyebrow">01 / SYSTEM IN PLAY</div>
            <div className="split">
              <h2>
                <span className="idea-key idea-key-first">작은 연결이</span>
                <br />
                <span className="idea-key idea-key-second">공간을 바꾼다</span>
                <span className="red-dot">.</span>
              </h2>
              <div>
                <p className="lead">
                  하나의 브릭에서,
                  <br />
                  무한한 조합으로.
                </p>
                <p className="body-copy">
                  LEGO의 핵심은 서로 맞물리고 다시 결합되는 시스템입니다. 팝업의
                  설치·운영·해체·재설치 과정에 이 원리를 적용합니다.
                </p>
              </div>
            </div>
            <div className="system-line">
              {['UNIT', 'CONNECT', 'BUILD', 'BREAK', 'REBUILD'].map(
                (name, i) => (
                  <div key={name}>
                    <span>0{i + 1}</span>
                    <div className="system-studs" aria-hidden="true">
                      {Array.from({ length: i + 1 }, (_, stud) => (
                        <i key={stud} />
                      ))}
                    </div>
                    <strong>{name}</strong>
                    <small>
                      {['작은 단위', '연결', '조립', '해체', '재구성'][i]}
                    </small>
                  </div>
                ),
              )}
            </div>
            <div className="history">
              <span>BRAND ROOTS</span>
              <p>
                <b>1932</b> 창립
              </p>
              <p>
                <b>1934</b> LEG GODT — Play Well
              </p>
              <p>
                <b>1955</b> System in Play
              </p>
              <p>
                <b>1958</b> Stud & Tube
              </p>
            </div>
          </section>
          <section
            className="image-chapter"
            aria-label="LEGO 블록 재질 레퍼런스"
          >
            <img
              src="./brick-reference.png"
              alt="매끈한 플라스틱 표면과 원형 Stud가 돋보이는 빨강, 노랑, 파랑 LEGO 블록"
              width="1280"
              height="853"
              loading="lazy"
            />
            <div className="image-shade" />
            <div className="image-caption">
              <span className="eyebrow">THE ORIGINAL MODULE</span>
              <h2>
                Small brick.
                <br />
                Big possibilities.
              </h2>
            </div>
          </section>
          <section id="site" className="section site">
            <div className="site-brick-render" aria-hidden="true">
              <img src="./assets/lego-brick-cluster.png" alt="" />
            </div>
            <div className="eyebrow">02 / LEGO × KINTEX</div>
            <div className="split">
              <div>
                <span className="collab-label">POP-UP SPACE COLLABORATION</span>
                <h2>
                  KINTEX<span className="red-dot">.</span>
                </h2>
                <p className="body-copy">
                  브랜드를 발견하고, 직접 만들고,
                  <br />
                  경험을 공유하는 팝업 공간 제안.
                </p>
              </div>
              <div className="site-note">
                <span>DESIGN BRIEF</span>
                <h3>
                  누구나 참여하는 공간.
                  <br />
                  각자의 방식으로.
                </h3>
                <p>
                  성인 팬의 몰입, 가족의 공동 체험, 처음 방문한 사람의 쉬운
                  참여를 함께 고려합니다.
                </p>
                <div className="site-conditions">
                  <b>설계 전 확인할 현장 조건</b>
                  <p>대상 면적 · 출입구 · 층고 · 기존 동선</p>
                </div>
              </div>
            </div>
            <div className="audiences">
              {[
                [
                  '01',
                  'DESIGN & CULTURE',
                  '20–30대 성인 팬',
                  '수집과 취향, 전시의 몰입',
                ],
                [
                  '02',
                  'BUILD TOGETHER',
                  '어린이 동반 가족',
                  '안전하고 직관적인 공동 체험',
                ],
                [
                  '03',
                  'DISCOVER & SHARE',
                  '공간 경험 방문객',
                  '쉬운 참여와 강한 시각적 장면',
                ],
              ].map(([n, en, ko, body]) => (
                <article key={n}>
                  <span>{n}</span>
                  <h3>{en}</h3>
                  <h4>{ko}</h4>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </section>
          <section id="concept" className="section concept">
            <div className="eyebrow">03 / SPATIAL LANGUAGE</div>
            <h2>
              브릭의 원리를
              <br />
              공간의 언어로.
            </h2>
            <div className="concept-character" aria-hidden="true">
              <img src="./assets/brick-character-cutout-4x.png" alt="" />
            </div>
            <div className="concept-words">
              <div>
                <span>01</span>
                <h3>MODULE</h3>
                <p>하나의 단위가 가구, 벽, 전시로 확장됩니다.</p>
              </div>
              <div>
                <span>02</span>
                <h3>CONNECTION</h3>
                <p>벽과 가구, 전시와 체험을 하나의 시스템으로 연결합니다.</p>
              </div>
              <div>
                <span>03</span>
                <h3>PARTICIPATION</h3>
                <p>방문객의 행동이 공간과 콘텐츠를 바꿉니다.</p>
              </div>
            </div>
            <div className="principles">
              <p>
                <b>STUD</b>원형 돌기를 조명·사인·천장 디테일로 추상화
              </p>
              <p>
                <b>GRID</b>규칙적인 기준 위에 반복과 변주를 구성
              </p>
              <p>
                <b>CARE</b>다양한 연령, 접근성, 내구성을 함께 고려
              </p>
            </div>
          </section>
          <section id="experiences" className="section experiences">
            <div className="experience-sticky">
              <div className="eyebrow">04 / FOUR EXPERIENCES</div>
              <div className="experience-heading">
                <h2>
                  공간을 바꾸는
                  <br />네 개의 장면.
                </h2>
                <p>
                  체험 장치가
                  <br />
                  콘셉트의 증거가 됩니다.
                </p>
              </div>
              <fieldset className="scene-select" aria-label="핵심 공간 선택">
                {scenes.map((s, i) => (
                  <Button
                    key={s.name}
                    className={
                      scene === i ? 'scene-button selected' : 'scene-button'
                    }
                    aria-pressed={scene === i}
                    onClick={() => {
                      setScene(i);
                      setStep(0);
                    }}
                  >
                    <span>0{i + 1}</span>
                    {s.name}
                  </Button>
                ))}
              </fieldset>
              <div className="experience-stage">
                <div className="diagram">
                  <Diagram scene={scene} step={step} />
                </div>
                <div className="scene-description">
                  <span
                    className="scene-index"
                    style={{ color: scenes[scene].color }}
                  >
                    0{scene + 1}
                  </span>
                  <h3>{scenes[scene].ko}</h3>
                  <p>{scenes[scene].body}</p>
                  <span className="caption">{scenes[scene].detail}</span>
                  <Button
                    className="demo-button"
                    onClick={() => setStep((s) => (s + 1) % 4)}
                  >
                    {scene === 1
                      ? '테이블 재구성'
                      : scene === 2
                        ? '다른 조합 보기'
                        : scene === 3
                          ? '도시 성장 보기'
                          : '참여로 채우기'}{' '}
                    <span>↗</span>
                  </Button>
                  <small>STEP {step + 1} / 4</small>
                </div>
              </div>
              <div className="gallery-principle">
                <strong>TOY → DESIGN OBJECT</strong>
                <p>
                  낮은 주변 조도, 집중 조명, 충분한 여백.
                  <br />
                  구조·스케일·빛의 대비로 브랜드를 드러냅니다.
                </p>
              </div>
            </div>
          </section>
          <section id="material" className="section material">
            <div className="eyebrow">05 / MATERIAL & COLOR</div>
            <div className="split">
              <h2>
                차분한 바탕.
                <br />
                선명한 참여.
              </h2>
              <p className="body-copy">
                원색은 움직이는 모듈과 인터랙션에 집중합니다. 전시 프레임과 기본
                구조는 중립적인 재료로 정리합니다.
              </p>
            </div>
            <div className="color-ratio">
              <div className="neutral-ratio">
                <strong>
                  70<span>%</span>
                </strong>
                <p>NEUTRAL BASE</p>
              </div>
              <div className="accent-ratio">
                <strong>
                  30<span>%</span>
                </strong>
                <p>LEGO ACCENT</p>
                <div>
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            </div>
            <div className="material-list">
              {[
                ['01', 'WHITE STEEL', '기본 구조 / 전시 프레임'],
                ['02', 'STAINLESS', '반사 / 정교한 디테일'],
                ['03', 'ACRYLIC', '컬러 / 투명성'],
                ['04', 'POLYCARBONATE', '반투명 파티션'],
                ['05', 'PLYWOOD', '체험 가구 / 촉감'],
                ['06', 'RUBBER', '안전 / 체험 바닥'],
              ].map(([n, title, desc]) => (
                <div key={n}>
                  <span>{n}</span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </section>
          <section id="ending" className="section ending">
            <div className="eyebrow">06 / THE NEXT ASSEMBLY</div>
            <h2>
              BUILD.
              <br />
              BREAK.
              <br />
              <span>REBUILD.</span>
            </h2>
            <div className="ending-bottom">
              <div>
                <h3>Temporary ≠ Disposable</h3>
                <p>
                  볼트 체결, 건식 조립, 표준 모듈.
                  <br />
                  해체 후 다른 장소에서 다시 조립되는 공간을 제안합니다.
                </p>
              </div>
              <p className="ending-statement">
                공간은 끝나도,
                <br />
                가능성은 계속됩니다.
              </p>
            </div>
            <div className="cycle">
              <span>FABRICATE</span>
              <span>ASSEMBLE</span>
              <span>OPERATE</span>
              <span>DISASSEMBLE</span>
              <span>MOVE</span>
              <span>REASSEMBLE ↗</span>
            </div>
          </section>
        </main>
        <footer>
          <div className="footer-top">
            <a href="#home" className="wordmark">
              LEGO<span>BUILD YOUR SPACE</span>
            </a>
            <div>
              <Button className="quiet-button" onClick={replay}>
                인트로 다시 보기 ↻
              </Button>
              <Button className="quiet-button" onClick={fullscreen}>
                {full ? '전체 화면 종료' : '전체 화면 ↗'}
              </Button>
              <Button
                className="quiet-button"
                aria-pressed={reduced}
                onClick={() => setReduced((v) => !v)}
              >
                {reduced ? '모션 켜기' : '모션 줄이기'}
              </Button>
            </div>
          </div>
          <details>
            <summary>REFERENCE</summary>
            <a
              href="https://www.lego.com/en-us/aboutus/lego-group/the-lego-group-history"
              target="_blank"
              rel="noreferrer"
            >
              LEGO Group History ↗
            </a>
            <a
              href="https://www.lego.com/en-us/history/articles/lego-system-in-play"
              target="_blank"
              rel="noreferrer"
            >
              System in Play ↗
            </a>
            <a
              href="https://www.lego.com/en-us/stores/store/5th-avenue"
              target="_blank"
              rel="noreferrer"
            >
              Fifth Avenue Store — 리테일 참고 사례 ↗
            </a>
          </details>
          <div className="footer-bottom">
            <span>INTERIOR DESIGN / CONCEPT STUDY</span>
            <span>KINTEX — BUILD YOUR SPACE</span>
          </div>
        </footer>
      </div>
    </>
  );
}
