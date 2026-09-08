'use client';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { BufferGeometry, NormalBufferAttributes } from 'three';

export default function BrickIntro({ onFinish }: { onFinish: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let disposed = false,
      frame = 0,
      cleanup = () => {};
    let timer: ReturnType<typeof setTimeout>;
    const close = () => {
      setClosing(true);
      timer = setTimeout(() => onFinish(), 650);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFinish();
    };
    document.addEventListener('keydown', key);
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    async function init() {
      try {
        const [
          T,
          { RoundedBoxGeometry },
          { mergeGeometries },
          { RoomEnvironment },
        ] = await Promise.all([
          import('three'),
          import('three/examples/jsm/geometries/RoundedBoxGeometry.js'),
          import('three/examples/jsm/utils/BufferGeometryUtils.js'),
          import('three/examples/jsm/environments/RoomEnvironment.js'),
        ]);
        if (disposed || !host.current) return;
        const container = host.current;
        const renderer = new T.WebGLRenderer({
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = T.PCFSoftShadowMap;
        renderer.toneMapping = T.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
        container.appendChild(renderer.domElement);
        const scene = new T.Scene();
        scene.background = new T.Color('#bf111d');
        const pmrem = new T.PMREMGenerator(renderer);
        const room = new RoomEnvironment();
        const environment = pmrem.fromScene(room, 0.04);
        scene.environment = environment.texture;
        room.dispose();
        pmrem.dispose();
        const camera = new T.PerspectiveCamera(34, 1, 0.1, 200);
        const floor = new T.Mesh(
          new T.PlaneGeometry(240, 240),
          new T.MeshStandardMaterial({
            color: '#bf111d',
            roughness: 0.4,
            metalness: 0,
          }),
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.018;
        floor.receiveShadow = true;
        scene.add(floor);
        const keyLight = new T.DirectionalLight('#fff6e6', 4.5);
        keyLight.position.set(-12, 24, 10);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.set(2048, 2048);
        keyLight.shadow.camera.left = -22;
        keyLight.shadow.camera.right = 22;
        keyLight.shadow.camera.top = 18;
        keyLight.shadow.camera.bottom = -18;
        keyLight.shadow.normalBias = 0.025;
        keyLight.shadow.bias = -0.0001;
        keyLight.shadow.radius = 3;
        scene.add(keyLight);
        const fill = new T.DirectionalLight('#dfedff', 1.8);
        fill.position.set(15, 10, -15);
        scene.add(fill);
        scene.add(new T.AmbientLight('#ffffff', 0.35));
        const materials = [
          new T.MeshPhysicalMaterial({
            color: '#ffce08',
            roughness: 0.24,
            metalness: 0,
            clearcoat: 1,
            clearcoatRoughness: 0.18,
            envMapIntensity: 0.8,
          }),
          new T.MeshPhysicalMaterial({
            color: '#fff7dd',
            roughness: 0.25,
            clearcoat: 1,
            clearcoatRoughness: 0.18,
          }),
        ];
        const geometryCache = new Map<
          number,
          BufferGeometry<NormalBufferAttributes>
        >();
        function brickGeometry(width: number) {
          if (geometryCache.has(width)) return geometryCache.get(width)!;
          const body = new RoundedBoxGeometry(
            width - 0.035,
            0.62,
            0.965,
            3,
            0.035,
          );
          body.translate(0, 0.31, 0);
          const parts: BufferGeometry<NormalBufferAttributes>[] = [body];
          for (let x = 0; x < width; x++)
            for (let z = 0; z < 2; z++)
              for (let s = 0; s < 2; s++) {
                const indexed = new T.CylinderGeometry(
                  0.145,
                  0.15,
                  0.13,
                  20,
                  1,
                );
                const stud = indexed.toNonIndexed();
                indexed.dispose();
                stud.translate(
                  x - (width - 1) / 2 + (s - 0.5) * 0.47,
                  0.685,
                  (z - 0.5) * 0.47,
                );
                parts.push(stud);
              }
          const merged = mergeGeometries(parts)!;
          parts.forEach((g) => g.dispose());
          geometryCache.set(width, merged);
          return merged;
        }
        const glyphs = [
          ['11000', '11000', '11000', '11000', '11000', '11111', '11111'],
          ['11111', '11111', '11000', '11110', '11000', '11111', '11111'],
          ['01111', '11111', '11000', '11011', '11001', '11111', '01110'],
          ['01110', '11111', '11011', '11011', '11011', '11111', '01110'],
        ];
        let seed = 417;
        const random = () => {
          seed = (seed * 16807) % 2147483647;
          return (seed - 1) / 2147483646;
        };
        const blocks: {
          mesh: InstanceType<typeof T.Mesh>;
          tx: number;
          tz: number;
          sx: number;
          sz: number;
          rotation: number;
          delay: number;
        }[] = [];
        glyphs.forEach((rows, letter) =>
          rows.forEach((row, z) => {
            for (let x = 0; x < 5; x++) {
              if (row[x] !== '1') continue;
              let width = 1;
              if (row[x + 1] === '1' && random() > 0.22) {
                width = 2;
                x++;
              }
              const tx = letter * 6 + x - (width - 1) / 2 - 11,
                tz = z - 3;
              const mesh = new T.Mesh(
                brickGeometry(width),
                materials[random() > 0.94 ? 1 : 0],
              );
              mesh.castShadow = true;
              mesh.receiveShadow = true;
              const angle = random() * Math.PI * 2;
              const radius = 8 + random() * 8;
              const sx = Math.cos(angle) * radius,
                sz = Math.sin(angle) * 7 + 3;
              mesh.position.set(sx, 0, sz);
              mesh.rotation.y = (random() - 0.5) * Math.PI * 2;
              scene.add(mesh);
              blocks.push({
                mesh,
                tx,
                tz,
                sx,
                sz,
                rotation: mesh.rotation.y,
                delay: 0.6 + random() * 1.65,
              });
            }
          }),
        );
        const resize = () => {
          const w = container.clientWidth,
            h = container.clientHeight;
          renderer.setSize(w, h);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        resize();
        window.addEventListener('resize', resize);
        const started = performance.now();
        let previous = 0;
        let ended = false;
        const render = (now: number) => {
          if (disposed) return;
          frame = requestAnimationFrame(render);
          if (now - previous < 1000 / 40) return;
          previous = now;
          const elapsed = (now - started) / 1000;
          for (const b of blocks) {
            const t = Math.max(0, Math.min(1, (elapsed - b.delay) / 2.65));
            const ease = t * t * t * (t * (t * 6 - 15) + 10);
            b.mesh.position.x = b.sx + (b.tx - b.sx) * ease;
            b.mesh.position.z = b.sz + (b.tz - b.sz) * ease;
            b.mesh.rotation.y = b.rotation * (1 - ease);
          }
          const rise = Math.min(elapsed / 4.8, 1);
          const distance = camera.aspect < 1 ? (49 / camera.aspect) * 0.72 : 40;
          camera.position.set(
            0,
            distance * (0.7 + 0.2 * rise),
            distance * (0.62 - 0.25 * rise),
          );
          camera.lookAt(0, 0, 0);
          renderer.render(scene, camera);
          if (elapsed > 6.7 && !ended) {
            ended = true;
            close();
          }
        };
        frame = requestAnimationFrame(render);
        const lost = (event: Event) => {
          event.preventDefault();
          cancelAnimationFrame(frame);
          setFailed(true);
        };
        renderer.domElement.addEventListener('webglcontextlost', lost);
        cleanup = () => {
          cancelAnimationFrame(frame);
          window.removeEventListener('resize', resize);
          renderer.domElement.removeEventListener('webglcontextlost', lost);
          geometryCache.forEach((g) => g.dispose());
          materials.forEach((m) => m.dispose());
          floor.geometry.dispose();
          (floor.material as InstanceType<typeof T.Material>).dispose();
          environment.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
      } catch {
        if (!disposed) setFailed(true);
      }
    }
    void init();
    return () => {
      disposed = true;
      clearTimeout(timer);
      cleanup();
      document.removeEventListener('keydown', key);
      document.body.style.overflow = old;
    };
  }, [onFinish]);
  return (
    <dialog
      open
      className={`intro ${closing ? 'intro-closing' : ''}`}
      aria-modal="true"
      aria-label="LEGO 블록 조립 오프닝"
    >
      <div
        ref={host}
        className="intro-canvas"
        aria-label="노란 LEGO 블록들이 빨간 바닥에서 모여 LEGO 글자를 만듭니다"
      />
      {failed && (
        <div className="intro-fallback">
          <strong>LEGO</strong>
          <p>이 기기에서 3D 오프닝을 재생할 수 없습니다.</p>
          <Button className="quiet-button" onClick={onFinish}>
            발표 보기 →
          </Button>
        </div>
      )}
      <Button
        autoFocus
        className="intro-skip quiet-button"
        onClick={onFinish}
        aria-label="오프닝 건너뛰기"
      >
        SKIP INTRO ↗
      </Button>
      <div className="intro-progress" />
    </dialog>
  );
}
