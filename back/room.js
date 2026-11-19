// The 3D room. Poly Haven models (CC0) for the furniture; the room shell, window, floor lamp,
// arcade cabinet and panda are built here. Exposes focus(thing), reset(), hop(), pause() and resume().

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const W = 6, D = 5, H = 2.7, T = 0.14;               // room width (x), depth (z), wall height, wall thickness
export const HOME = { pos: new THREE.Vector3(7.4, 5.1, 8.2), target: new THREE.Vector3(-0.15, 0.6, -0.35) };

const COL = {
  wall: 0xb7c3b0, skirting: 0xf1ede4, floor: 0xa8774c, rug: 0xd9a441, rugInner: 0xe9c983,
  arcade: 0x23408e, arcadeTrim: 0x14244f, lampShade: 0xf7e7c6, metal: 0x2b2f33,
  pandaWhite: 0xf3f0ea, pandaBlack: 0x1c1d20,
};

export async function startRoom({ canvas, tag, labels, reduceMotion, onPick, onProgress }) {
  const gsap = window.gsap;

  /* ---------- Renderer, scene, camera ---------- */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.45;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 80);
  camera.position.copy(HOME.pos);

  const controls = new OrbitControls(camera, canvas);
  controls.target.copy(HOME.target);
  controls.enablePan = false;
  controls.enableDamping = !reduceMotion;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.5;
  controls.minDistance = 2.2;
  controls.maxDistance = 13.5;
  controls.minAzimuthAngle = 0.12;                    // keep the camera on the open side of the room
  controls.maxAzimuthAngle = 1.45;
  controls.minPolarAngle = 0.55;
  controls.maxPolarAngle = 1.3;
  controls.update();

  /* ---------- Light ---------- */
  const key = new THREE.DirectionalLight(0xffe3c4, 2.6);
  key.position.set(4.5, 7, 3.5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 1, far: 20 });
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  key.shadow.radius = 4;
  scene.add(key);
  scene.add(new THREE.HemisphereLight(0xc6d6ff, 0x6b4a33, 0.55));

  /* ---------- Room shell ---------- */
  const std = (color, rough = 0.85, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0, ...extra });
  const mesh = (geo, mat, { x = 0, y = 0, z = 0, cast = true, receive = true } = {}) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z); m.castShadow = cast; m.receiveShadow = receive;
    return m;
  };
  const shell = new THREE.Group();
  scene.add(shell);

  shell.add(mesh(new THREE.BoxGeometry(W + T, T, D + T), std(0xffffff, 0.55, { map: planks() }), { x: -T / 2, y: -T / 2, z: -T / 2, cast: false }));
  const wallMat = std(COL.wall, 0.92);
  shell.add(mesh(new THREE.BoxGeometry(W + T, H, T), wallMat, { x: -T / 2, y: H / 2, z: -D / 2 - T / 2 }));
  shell.add(mesh(new THREE.BoxGeometry(T, H, D), wallMat, { x: -W / 2 - T / 2, y: H / 2, z: 0 }));
  const skirt = std(COL.skirting, 0.6);
  shell.add(mesh(new THREE.BoxGeometry(W, 0.1, 0.02), skirt, { x: 0, y: 0.05, z: -D / 2 + 0.01 }));
  shell.add(mesh(new THREE.BoxGeometry(0.02, 0.1, D), skirt, { x: -W / 2 + 0.01, y: 0.05, z: 0 }));

  // Rug: a soft rounded rectangle.
  const rug = new THREE.Group();
  rug.add(mesh(roundedSlab(2.6, 1.8, 0.28, 0.012), std(COL.rug, 1), { cast: false }));
  rug.add(mesh(roundedSlab(2.2, 1.4, 0.2, 0.014), std(COL.rugInner, 1), { cast: false }));
  rug.position.set(0.5, 0, 0.55);
  shell.add(rug);

  // Window over the desk: an evening sky with a city line, glowing a little.
  const win = new THREE.Group();
  const pane = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.0), new THREE.MeshBasicMaterial({ map: eveningSky(), toneMapped: false }));
  win.add(pane);
  const frame = std(COL.skirting, 0.5);
  [[0, 0.53, 1.72, 0.06], [0, -0.53, 1.72, 0.06], [-0.83, 0, 0.06, 1.12], [0.83, 0, 0.06, 1.12], [0, 0, 0.04, 1.0]].forEach(([x, y, w, h]) =>
    win.add(mesh(new THREE.BoxGeometry(w, h, 0.06), frame, { x, y, z: 0.02 })));
  win.add(mesh(new THREE.BoxGeometry(1.8, 0.05, 0.16), frame, { x: 0, y: -0.57, z: 0.06 }));
  win.position.set(-0.75, 1.65, -D / 2 + 0.01);
  shell.add(win);
  const sky = new THREE.PointLight(0xffb27a, 2.2, 4.5, 2);
  sky.position.set(-0.75, 1.6, -D / 2 + 0.6);
  scene.add(sky);

  // Floor lamp in the cosy corner.
  const lamp = new THREE.Group();
  lamp.add(mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.03, 48), std(COL.metal, 0.4, { metalness: 0.6 }), { y: 0.015 }));
  lamp.add(mesh(new THREE.CylinderGeometry(0.014, 0.014, 1.45, 16), std(COL.metal, 0.4, { metalness: 0.6 }), { y: 0.75 }));
  const shade = mesh(new THREE.CylinderGeometry(0.15, 0.23, 0.3, 48, 1, true),
    new THREE.MeshStandardMaterial({ color: COL.lampShade, emissive: 0xffc56e, emissiveIntensity: 0.45, side: THREE.DoubleSide, roughness: 0.9 }),
    { y: 1.5, cast: false });
  lamp.add(shade);
  const bulb = new THREE.PointLight(0xffc56e, 5, 5, 2);
  bulb.position.y = 1.45;
  lamp.add(bulb);
  lamp.position.set(2.7, 0, -2.2);
  scene.add(lamp);

  /* ---------- Things you can click ---------- */
  const picks = [];   // groups with userData.thing
  const thing = (name, obj) => { obj.userData.thing = name; picks.push(obj); scene.add(obj); return obj; };

  const manager = new THREE.LoadingManager();
  manager.onProgress = (_u, loaded, total) => onProgress?.(loaded / total);
  const loader = new GLTFLoader(manager);
  const MODELS = ["metal_office_desk", "classic_laptop", "modern_arm_chair_01", "wooden_bookshelf_worn", "standing_chalkboard_01",
    "mid_century_lounge_chair", "potted_plant_02", "rubber_duck_toy", "gamepad"];
  const loaded = Object.fromEntries(await Promise.all(MODELS.map(async n => [n, (await loader.loadAsync(`models/${n}/${n}.gltf`)).scene])));
  Object.values(loaded).forEach(o => o.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } }));

  // Desk, laptop and office chair: the learning log.
  const desk = new THREE.Group();
  const deskModel = sit(loaded.metal_office_desk, 0, 0, 0);
  desk.add(deskModel);
  const top = box(deskModel).max.y;
  desk.add(sit(loaded.classic_laptop, -0.15, -0.05, 0.15, top));
  desk.add(sit(loaded.modern_arm_chair_01, 0.1, 0.75, Math.PI + 0.25));
  desk.position.set(-0.75, 0, -D / 2 + 0.45);
  thing("desk", desk);

  // Bookshelf on the left wall, with the duck on top: the museum.
  const shelf = new THREE.Group();
  const shelfModel = sit(loaded.wooden_bookshelf_worn, 0, 0, Math.PI / 2);
  shelf.add(shelfModel);
  shelf.add(sit(loaded.rubber_duck_toy, 0, 0.05, Math.PI / 2 + 0.5, box(shelfModel).max.y));
  // The museum's three exhibits, framed on the shelves.
  // Find the tops of the shelf boards by casting a ray down through the middle of the shelf.
  const sb = box(shelfModel);
  const mid = sb.getCenter(new THREE.Vector3());
  const probe = new THREE.Raycaster(new THREE.Vector3(mid.x, sb.max.y + 1, mid.z), new THREE.Vector3(0, -1, 0));
  const boardTops = probe.intersectObject(shelfModel, true)
    .filter(h => h.face && h.face.normal.clone().transformDirection(h.object.matrixWorld).y > 0.5)
    .map(h => h.point.y).filter(y => y < sb.max.y - 0.05).sort((p, q) => p - q);
  // Books on the boards, in a few soft colours, with gaps like a real shelf.
  const bookCols = [0x2e6b34, 0x7fb07c, 0xd9a441, 0x3d5a80, 0xb5584a, 0xe2d9c4, 0x5d4a6e];
  const inner = sb.getSize(new THREE.Vector3());
  boardTops.slice(0, -1).forEach((y, level) => {
    let z = mid.z - inner.z / 2 + 0.08;
    let n = level * 3;
    while (z < mid.z + inner.z / 2 - 0.1) {
      n++;
      if (n % 7 === 3) { z += 0.12; continue; }                      // a gap
      const t = 0.03 + ((n * 17) % 4) * 0.008, h = 0.17 + ((n * 29) % 5) * 0.018;
      const b = mesh(new THREE.BoxGeometry(0.2, h, t), std(bookCols[(n * 5) % bookCols.length], 0.7));
      b.position.set(mid.x - 0.04, y + h / 2, z + t / 2);
      shelf.add(b);
      z += t + 0.004;
    }
  });
  shelf.position.set(-W / 2 + 0.3, 0, -0.55);
  thing("shelf", shelf);

  // Chalkboard: future goals.
  const board = new THREE.Group();
  const chalk = loaded.standing_chalkboard_01;
  chalk.scale.setScalar(0.78);
  board.add(sit(chalk, 0, 0, -0.35));
  board.position.set(1.15, 0, -D / 2 + 0.5);
  thing("board", board);

  // Lounge chair with the plant and the gamepad: hobbies.
  const chair = new THREE.Group();
  chair.add(sit(loaded.mid_century_lounge_chair, 0, 0, -Math.PI * 0.72));
  chair.add(sit(loaded.potted_plant_02, 0.75, -0.55, 0));
  chair.position.set(2.15, 0, 0.55);
  thing("chair", chair);

  // Arcade cabinet against the left wall, near the front.
  const arcade = makeArcade();
  arcade.rotation.y = Math.PI / 2;
  arcade.position.set(-W / 2 + 0.42, 0, 1.55);
  thing("arcade", arcade);

  // The panda, sitting on the rug.
  const panda = makePanda();
  panda.position.set(0.55, 0.012, 0.75);
  panda.rotation.y = 0.55;
  const pad = sit(loaded.gamepad, 0.08, 0.36, 0.4);
  panda.add(pad);
  thing("panda", panda);

  // Each thing keeps its own materials, so hover can light it without touching the others.
  picks.forEach(g => g.traverse(c => {
    if (!c.isMesh) return;
    c.material = c.material.clone();
    c.userData.baseEmissive = c.material.emissive?.clone();
    c.userData.baseEmissiveIntensity = c.material.emissiveIntensity;
  }));

  /* ---------- Size and render ---------- */
  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(canvas);
  resize();

  let running = true;
  renderer.setAnimationLoop(() => {
    if (!running) return;
    controls.update();
    renderer.render(scene, camera);
    if (hovered) placeTag(hovered);
  });

  /* ---------- Hover and click ---------- */
  const ray = new THREE.Raycaster();
  const ptr = new THREE.Vector2();
  let hovered = null, down = null, moving = false;

  const hitAt = e => {
    const r = canvas.getBoundingClientRect();
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, camera);
    const hit = ray.intersectObjects(picks, true)[0];
    if (!hit) return null;
    let o = hit.object;
    while (o && !o.userData.thing) o = o.parent;
    return o;
  };
  const light = (g, on) => g.traverse(c => {
    if (!c.isMesh || !c.material.emissive) return;
    if (on) { c.material.emissive.set(0xffd9a0); c.material.emissiveIntensity = 0.12; }
    else { c.material.emissive.copy(c.userData.baseEmissive); c.material.emissiveIntensity = c.userData.baseEmissiveIntensity; }
  });
  const setHover = g => {
    if (g === hovered) return;
    if (hovered) light(hovered, false);
    hovered = g;
    if (g) { light(g, true); tag.textContent = labels[g.userData.thing]; }
    tag.classList.toggle("is-on", !!g);
    canvas.classList.toggle("is-hot", !!g);
  };
  const v = new THREE.Vector3();
  const placeTag = g => {
    const b = new THREE.Box3().setFromObject(g);
    b.getCenter(v); v.y = b.max.y;
    v.project(camera);
    tag.style.left = `${(v.x + 1) / 2 * canvas.clientWidth}px`;
    tag.style.top = `${(1 - v.y) / 2 * canvas.clientHeight}px`;
  };

  canvas.addEventListener("pointermove", e => {
    if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) moving = true;
    if (e.pointerType === "mouse" && !down) setHover(hitAt(e));
  });
  canvas.addEventListener("pointerleave", () => setHover(null));
  canvas.addEventListener("pointerdown", e => { down = { x: e.clientX, y: e.clientY }; moving = false; });
  canvas.addEventListener("pointerup", e => {
    const wasDrag = moving;
    down = null; moving = false;
    if (wasDrag) return;
    const g = hitAt(e);
    if (g) onPick(g.userData.thing);
  });

  /* ---------- Camera moves ---------- */
  const views = {};
  const up = new THREE.Vector3(0, 1, 0);
  for (const g of picks) {
    const b = new THREE.Box3().setFromObject(g);
    const c = b.getCenter(new THREE.Vector3());
    const r = b.getSize(new THREE.Vector3()).length() / 2;
    const dir = HOME.pos.clone().sub(HOME.target).normalize();
    const dist = Math.max(3.2, r * 3.6 + 1.2);
    const right = new THREE.Vector3().crossVectors(up, dir).normalize();
    const shift = right.multiplyScalar(dist * 0.2);    // keep the thing left of the panel
    views[g.userData.thing] = { target: c.clone().add(shift), pos: c.clone().add(dir.multiplyScalar(dist)).add(shift) };
  }

  let move = null;
  const glide = ({ pos, target }, duration = 1.1, ease = "power3.inOut") => {
    move?.kill();
    if (reduceMotion || !gsap) {
      camera.position.copy(pos); controls.target.copy(target); controls.update();
      return;
    }
    controls.enabled = false;
    move = gsap.timeline({ defaults: { duration, ease }, onComplete: () => { controls.enabled = true; } })
      .to(camera.position, { x: pos.x, y: pos.y, z: pos.z }, 0)
      .to(controls.target, { x: target.x, y: target.y, z: target.z }, 0);
  };

  // The way in: the camera starts a little closer, as if still finishing the zoom from the portfolio, and settles back.
  if (!reduceMotion && gsap) {
    camera.position.lerpVectors(HOME.pos, HOME.target, 0.22);
    controls.update();
    glide(HOME, 1.6, "expo.out");
  }

  // Wait one frame so the first visible frame is a finished one.
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

  return {
    focus: name => views[name] && glide(views[name]),
    reset: () => glide(HOME),
    hop: () => {
      if (reduceMotion || !gsap) return;
      gsap.timeline()
        .to(panda.position, { y: 0.22, duration: 0.22, ease: "power2.out" })
        .to(panda.position, { y: 0.012, duration: 0.36, ease: "bounce.out" });
    },
    pause: () => { running = false; },
    resume: () => { running = true; },
    // For the design checker: renders a frame and reports how much of it is drawn.
    stats: () => {
      renderer.render(scene, camera);
      const gl = renderer.getContext();
      const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight;
      const px = new Uint8Array(4 * 64 * 64);
      gl.readPixels(Math.floor(w / 2 - 32), Math.floor(h / 2 - 32), 64, 64, gl.RGBA, gl.UNSIGNED_BYTE, px);
      let drawn = 0;
      for (let i = 3; i < px.length; i += 4) if (px[i] > 0) drawn++;
      return { things: picks.map(p => p.userData.thing), drawn: drawn / (64 * 64), camera: camera.position.toArray().map(n => +n.toFixed(2)) };
    },
  };
}

/* ---------- Helpers ---------- */

// Turn a model, stand it on the floor (or on a surface at height y) with its footprint centred on (x, z).
function sit(obj, x, z, rotY, y = 0) {
  const holder = new THREE.Group();
  obj.rotation.y = rotY;
  obj.position.set(0, 0, 0);
  holder.add(obj);
  holder.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(obj);
  const c = b.getCenter(new THREE.Vector3());
  obj.position.set(-c.x, -b.min.y, -c.z);
  holder.position.set(x, y, z);
  return holder;
}
function box(obj) { obj.updateMatrixWorld(true); return new THREE.Box3().setFromObject(obj); }

function roundedSlab(w, d, r, h) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -d / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + d - r); s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
  s.lineTo(x + r, y + d); s.quadraticCurveTo(x, y + d, x, y + d - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false, curveSegments: 24 });
  g.rotateX(-Math.PI / 2);
  return g;
}

// Oak planks, drawn once into a canvas.
function planks() {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 1024;
  const x = c.getContext("2d");
  const rows = 12, h = c.height / rows;
  for (let r = 0; r < rows; r++) {
    let at = -(r * 137) % 400;
    while (at < c.width) {
      const len = 300 + ((r * 97 + at) % 260);
      const l = 50 + ((r * 31 + at) % 9) - 4;
      x.fillStyle = `hsl(27 34% ${l}%)`;
      x.fillRect(at, r * h, len, h);
      x.fillStyle = "rgba(60,35,20,.35)";
      x.fillRect(at, r * h, 2, h);
      at += len;
    }
    x.fillStyle = "rgba(60,35,20,.4)";
    x.fillRect(0, r * h, c.width, 2);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1.5, 1.5);
  t.anisotropy = 8;
  return t;
}

// An evening sky over a city line, for the window.
function eveningSky() {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 320;
  const x = c.getContext("2d");
  const g = x.createLinearGradient(0, 0, 0, c.height);
  g.addColorStop(0, "#2d4a73"); g.addColorStop(0.55, "#d98a6a"); g.addColorStop(1, "#f6c27a");
  x.fillStyle = g; x.fillRect(0, 0, c.width, c.height);
  const towers = [[0, 150], [40, 110], [70, 170], [120, 90], [150, 140], [200, 120], [240, 60], [262, 60], [300, 130], [345, 100], [390, 160], [430, 115], [470, 140]];
  towers.forEach(([at, top], i) => {
    const w = 38 + (i * 13) % 20;
    x.fillStyle = "#1f2a3d"; x.fillRect(at, top, w, c.height - top);
    x.fillStyle = "rgba(255,214,140,.85)";
    for (let wy = top + 10; wy < c.height - 6; wy += 14)
      for (let wx = at + 6; wx < at + w - 6; wx += 10)
        if ((wx * 7 + wy * 3 + i) % 5 === 0) x.fillRect(wx, wy, 4, 6);
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function textPanel(text, { w = 512, h = 160, bg = "#0d1430", fg = "#ffd46b", size = 64 } = {}) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const x = c.getContext("2d");
  x.fillStyle = bg; x.fillRect(0, 0, w, h);
  x.fillStyle = fg;
  x.font = `800 ${size}px "Bricolage Grotesque", system-ui, sans-serif`;
  x.textAlign = "center"; x.textBaseline = "middle";
  text.split("\n").forEach((line, i, all) => x.fillText(line, w / 2, h / 2 + (i - (all.length - 1) / 2) * size * 1.05));
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeArcade() {
  const g = new THREE.Group();
  // Side profile (z forward, y up), extruded across the cabinet's width.
  const p = [[-0.35, 0], [0.35, 0], [0.35, 0.86], [0.46, 0.95], [0.27, 1.06], [0.2, 1.1], [0.05, 1.56], [0.2, 1.6], [0.2, 1.86], [-0.35, 1.86]];
  const s = new THREE.Shape(p.map(([z, y]) => new THREE.Vector2(z, y)));
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.7, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.025, bevelSegments: 5, curveSegments: 8 });
  geo.rotateY(-Math.PI / 2);
  geo.translate(0.35, 0.025, 0);
  const body = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: COL.arcade, roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.3 }));
  body.castShadow = body.receiveShadow = true;
  g.add(body);

  // Screen, leaning back along the slope.
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 0.44),
    new THREE.MeshBasicMaterial({ map: textPanel("SQUASH\nTHE BUGS", { w: 512, h: 384, bg: "#0b1a2e", fg: "#8fd18c", size: 88 }), toneMapped: false }));
  const a = Math.atan2(0.15, 0.46);
  screen.rotation.x = -a;
  screen.position.set(0, 1.335, 0.125 + 0.03);
  g.add(screen);

  // Marquee.
  const marquee = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.2),
    new THREE.MeshBasicMaterial({ map: textPanel("ARCADE", { w: 512, h: 170, bg: "#ffc56e", fg: "#14244f", size: 96 }), toneMapped: false }));
  marquee.position.set(0, 1.73, 0.2 + 0.03);
  g.add(marquee);

  // Joystick and two buttons on the control panel.
  const slope = Math.atan2(0.11, 0.19);
  const deck = new THREE.Group();
  deck.position.set(0, 1.02, 0.36);
  deck.rotation.x = slope;
  const red = new THREE.MeshStandardMaterial({ color: 0xe0453a, roughness: 0.3 });
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.035, 32, 16), red);
  knob.position.set(-0.14, 0.11, 0);
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.1, 12), new THREE.MeshStandardMaterial({ color: 0x222222 }));
  stick.position.set(-0.14, 0.06, 0);
  deck.add(knob, stick);
  [[0.06, 0x8fd18c], [0.15, 0xffc56e]].forEach(([x, col]) => {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.025, 32), new THREE.MeshStandardMaterial({ color: col, roughness: 0.3 }));
    b.position.set(x, 0.035, 0);
    deck.add(b);
  });
  g.add(deck);
  g.traverse(c => { if (c.isMesh) c.castShadow = true; });
  return g;
}

function makePanda() {
  const g = new THREE.Group();
  const white = new THREE.MeshPhysicalMaterial({ color: COL.pandaWhite, roughness: 0.95, sheen: 1, sheenColor: 0xffffff, sheenRoughness: 0.6 });
  const black = new THREE.MeshPhysicalMaterial({ color: COL.pandaBlack, roughness: 0.85, sheen: 0.6, sheenColor: 0x555555, sheenRoughness: 0.6 });
  const ball = (r, mat, [x, y, z], [sx, sy, sz] = [1, 1, 1], rz = 0) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 48, 32), mat);
    m.position.set(x, y, z); m.scale.set(sx, sy, sz); m.rotation.z = rz;
    m.castShadow = true; m.receiveShadow = true;
    g.add(m); return m;
  };
  const limb = (mat, [x, y, z], [rx, rz]) => {
    const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.13, 8, 24), mat);
    m.position.set(x, y, z); m.rotation.set(rx, 0, rz);
    m.castShadow = true; g.add(m); return m;
  };
  ball(0.22, white, [0, 0.24, 0], [1, 1.08, 0.95]);           // body
  ball(0.205, black, [0, 0.33, -0.01], [1.06, 0.42, 0.98]);   // shoulder band
  ball(0.17, white, [0, 0.55, 0.02], [1.08, 1, 1]);           // head
  ball(0.06, black, [-0.12, 0.69, 0]);                         // ears
  ball(0.06, black, [0.12, 0.69, 0]);
  ball(0.048, black, [-0.068, 0.57, 0.15], [1, 1.35, 0.5], -0.5);  // eye patches
  ball(0.048, black, [0.068, 0.57, 0.15], [1, 1.35, 0.5], 0.5);
  ball(0.014, white, [-0.062, 0.585, 0.172]);                  // eyes
  ball(0.014, white, [0.062, 0.585, 0.172]);
  ball(0.024, black, [0, 0.515, 0.183], [1.3, 0.8, 0.8]);      // nose
  limb(black, [-0.2, 0.3, 0.08], [-0.7, 0.5]);                  // arms
  limb(black, [0.2, 0.3, 0.08], [-0.7, -0.5]);
  limb(black, [-0.12, 0.08, 0.15], [Math.PI / 2 - 0.2, 0.15]);   // legs
  limb(black, [0.12, 0.08, 0.15], [Math.PI / 2 - 0.2, -0.15]);
  return g;
}
