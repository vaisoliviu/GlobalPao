// ============================================================
// The Demolition Dozer — top-down edition.
// Guide the dozer with the mouse (it drives toward the cursor)
// or with the arrow keys / WASD. Space or TURBO = speed boost
// that hits twice as hard. Smash crates, rocks and walls;
// avoid the toxic barrels.
// ============================================================
(() => {
  const t = (key) => window.GP_I18N.t(key);
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("gameScore");
  const timeEl = document.getElementById("gameTime");
  const startBtn = document.getElementById("gameStart");

  const W = canvas.width;   // 900
  const H = canvas.height;  // 520
  const MARGIN = 46;        // playfield border (hazard stripes)
  const GAME_SECONDS = 60;

  const TYPES = {
    crate:  { points: 20,  hp: 1, r: 28 },
    rock:   { points: 30,  hp: 2, r: 30 },
    wall:   { points: 50,  hp: 3, r: 42 },
    barrel: { points: -40, hp: 1, r: 22 },
  };
  const MAX_OBJECTS = 6;

  let dozer, objects, score, timeLeft, playing, popups, particles, patches, treads;
  let lastTime, timerAcc, keys = {}, mouseTarget = null, keyboardMode = false;
  let turboT = 0, turboCd = 0, treadAcc = 0;

  // ---------------- Setup ----------------
  function makePatches() {
    return Array.from({ length: 26 }, () => ({
      x: MARGIN + Math.random() * (W - MARGIN * 2),
      y: MARGIN + Math.random() * (H - MARGIN * 2),
      rx: 18 + Math.random() * 46,
      ry: 12 + Math.random() * 30,
      dark: Math.random() > 0.5,
    }));
  }

  function spawnObject() {
    // Barrels are rarer than the demolition targets
    const pool = ["crate", "crate", "rock", "rock", "wall", "wall", "barrel"];
    const type = pool[Math.floor(Math.random() * pool.length)];
    const def = TYPES[type];
    for (let tries = 0; tries < 60; tries++) {
      const x = MARGIN + def.r + Math.random() * (W - (MARGIN + def.r) * 2);
      const y = MARGIN + def.r + Math.random() * (H - (MARGIN + def.r) * 2);
      const farFromDozer = Math.hypot(x - dozer.x, y - dozer.y) > 170;
      const farFromOthers = objects.every((o) => Math.hypot(o.x - x, o.y - y) > o.r + def.r + 34);
      if (farFromDozer && farFromOthers) {
        objects.push({
          type, x, y,
          r: def.r, hp: def.hp, maxHp: def.hp,
          angle: Math.random() * Math.PI * 2,
          hitCd: 0, shake: 0,
        });
        return;
      }
    }
  }

  function reset() {
    dozer = { x: W / 2, y: H / 2, angle: -Math.PI / 2, v: 0 };
    objects = [];
    score = 0;
    timeLeft = GAME_SECONDS;
    timerAcc = 0;
    popups = [];
    particles = [];
    treads = [];
    patches = makePatches();
    turboT = 0;
    turboCd = 0;
    mouseTarget = null;
    keyboardMode = false;
    while (objects.length < MAX_OBJECTS) spawnObject();
    updateHud();
  }

  function updateHud() {
    scoreEl.textContent = `${t("game.score")}: ${score}`;
    timeEl.textContent = `${t("game.time")}: ${Math.ceil(timeLeft)}`;
  }
  window.GP_I18N.onChange(() => updateHud());

  // ---------------- Input ----------------
  function canvasPos(e) {
    const r = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * W,
      y: ((e.clientY - r.top) / r.height) * H,
    };
  }

  canvas.addEventListener("mousemove", (e) => {
    mouseTarget = canvasPos(e);
    keyboardMode = false;
  });
  canvas.addEventListener("mouseleave", () => (mouseTarget = null));
  canvas.addEventListener("pointerdown", (e) => {
    mouseTarget = canvasPos(e);
    keyboardMode = false;
  });
  canvas.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" && e.buttons) {
      mouseTarget = canvasPos(e);
      keyboardMode = false;
    }
  });

  function isCanvasVisible() {
    const r = canvas.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }

  const DRIVE_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyW", "KeyA", "KeyS", "KeyD", "Space"];
  document.addEventListener("keydown", (e) => {
    if (!playing) return;
    if (DRIVE_KEYS.includes(e.code) && isCanvasVisible()) e.preventDefault();
    keys[e.code] = true;
    if (e.code !== "Space" && DRIVE_KEYS.includes(e.code)) keyboardMode = true;
    if (e.code === "Space") turbo();
  });
  document.addEventListener("keyup", (e) => (keys[e.code] = false));

  function turbo() {
    if (!playing || turboCd > 0) return;
    turboT = 0.9;
    turboCd = 2.2;
  }
  document.getElementById("btnDig").addEventListener("pointerdown", (e) => { e.preventDefault(); turbo(); });

  startBtn.addEventListener("click", () => {
    reset();
    playing = true;
    startBtn.dataset.i18n = "game.restart";
    startBtn.textContent = t("game.restart");
  });

  // ---------------- Game logic ----------------
  function bladePos() {
    return {
      x: dozer.x + Math.cos(dozer.angle) * 58,
      y: dozer.y + Math.sin(dozer.angle) * 58,
    };
  }

  function normAngle(a) {
    while (a > Math.PI) a -= Math.PI * 2;
    while (a < -Math.PI) a += Math.PI * 2;
    return a;
  }

  function hitObject(obj, damage) {
    obj.hp -= damage;
    obj.hitCd = 0.32;
    obj.shake = 0.25;
    const def = TYPES[obj.type];
    spawnDebris(obj.x, obj.y, obj.type, 8);

    if (obj.hp <= 0) {
      spawnDebris(obj.x, obj.y, obj.type, 20);
      const text = obj.type === "barrel" ? `${def.points} ${t("game.barrel")}` : `+${def.points}`;
      const color = { crate: "#e8b168", rock: "#e3e5e8", wall: "#ff9d80", barrel: "#7ee787" }[obj.type];
      popups.push({ x: obj.x, y: obj.y - obj.r, text, color, t: 0 });
      score += def.points;
      objects.splice(objects.indexOf(obj), 1);
      spawnObject();
      updateHud();
    } else if (obj.type !== "wall") {
      // Shove movable objects along the dozer's heading
      obj.x += Math.cos(dozer.angle) * 18;
      obj.y += Math.sin(dozer.angle) * 18;
      obj.x = Math.max(MARGIN + obj.r, Math.min(W - MARGIN - obj.r, obj.x));
      obj.y = Math.max(MARGIN + obj.r, Math.min(H - MARGIN - obj.r, obj.y));
    }
  }

  function spawnDebris(x, y, type, n) {
    const color = { crate: "#a06a2c", rock: "#8d8d8d", wall: "#b5533c", barrel: "#3fae4a" }[type];
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 60 + Math.random() * 200;
      particles.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        r: 2.5 + Math.random() * 3.5,
        color,
        t: 0,
        life: 0.6 + Math.random() * 0.5,
      });
    }
  }

  function spawnSmoke() {
    particles.push({
      x: dozer.x - Math.cos(dozer.angle) * 30,
      y: dozer.y - Math.sin(dozer.angle) * 30,
      vx: (Math.random() - 0.5) * 40,
      vy: (Math.random() - 0.5) * 40,
      r: 4 + Math.random() * 4,
      color: "rgba(90,90,90,0.7)",
      t: 0,
      life: 0.8,
    });
  }

  function update(dt) {
    if (playing) {
      timeLeft -= dt;
      timerAcc += dt;
      if (timerAcc > 0.2) { timerAcc = 0; updateHud(); }
      if (timeLeft <= 0) {
        timeLeft = 0;
        playing = false;
        updateHud();
      }

      turboCd = Math.max(0, turboCd - dt);
      turboT = Math.max(0, turboT - dt);
      const maxSpeed = turboT > 0 ? 420 : 230;
      const accel = 700;
      const turnRate = 3.4;

      let throttle = 0;
      if (keyboardMode) {
        if (keys.ArrowLeft || keys.KeyA) dozer.angle -= turnRate * dt;
        if (keys.ArrowRight || keys.KeyD) dozer.angle += turnRate * dt;
        if (keys.ArrowUp || keys.KeyW) throttle = 1;
        if (keys.ArrowDown || keys.KeyS) throttle = -0.6;
      } else if (mouseTarget) {
        const dx = mouseTarget.x - dozer.x;
        const dy = mouseTarget.y - dozer.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 26) {
          const desired = Math.atan2(dy, dx);
          const diff = normAngle(desired - dozer.angle);
          const step = Math.sign(diff) * Math.min(Math.abs(diff), turnRate * dt);
          dozer.angle += step;
          // Only push forward when roughly facing the target
          if (Math.abs(diff) < Math.PI / 2) throttle = 1;
        }
      }

      if (throttle !== 0) {
        dozer.v += throttle * accel * dt;
      } else {
        dozer.v *= Math.max(0, 1 - 5 * dt);
        if (Math.abs(dozer.v) < 4) dozer.v = 0;
      }
      dozer.v = Math.max(-maxSpeed * 0.6, Math.min(maxSpeed, dozer.v));

      dozer.x += Math.cos(dozer.angle) * dozer.v * dt;
      dozer.y += Math.sin(dozer.angle) * dozer.v * dt;
      dozer.x = Math.max(MARGIN + 34, Math.min(W - MARGIN - 34, dozer.x));
      dozer.y = Math.max(MARGIN + 34, Math.min(H - MARGIN - 34, dozer.y));

      // Tread marks while moving
      treadAcc += dt;
      if (Math.abs(dozer.v) > 40 && treadAcc > 0.06) {
        treadAcc = 0;
        const px = -Math.sin(dozer.angle), py = Math.cos(dozer.angle);
        for (const side of [-26, 26]) {
          treads.push({ x: dozer.x + px * side, y: dozer.y + py * side, angle: dozer.angle, t: 0 });
        }
        if (treads.length > 320) treads.splice(0, treads.length - 320);
      }

      if (turboT > 0 && Math.random() < 0.6) spawnSmoke();

      // Blade hits
      const blade = bladePos();
      for (const obj of [...objects]) {
        obj.hitCd = Math.max(0, obj.hitCd - dt);
        obj.shake = Math.max(0, obj.shake - dt);
        const d = Math.hypot(blade.x - obj.x, blade.y - obj.y);
        if (d < obj.r + 14 && Math.abs(dozer.v) > 60 && obj.hitCd === 0) {
          hitObject(obj, turboT > 0 ? 2 : 1);
          dozer.v *= 0.5; // impact slows you down
        }
      }

      // Body collision: don't drive through what's still standing
      for (const obj of objects) {
        const d = Math.hypot(dozer.x - obj.x, dozer.y - obj.y);
        const minD = obj.r + 34;
        if (d < minD && d > 0.01) {
          const nx = (dozer.x - obj.x) / d;
          const ny = (dozer.y - obj.y) / d;
          dozer.x = obj.x + nx * minD;
          dozer.y = obj.y + ny * minD;
        }
      }
    }

    treads.forEach((tr) => (tr.t += dt));
    treads = treads.filter((tr) => tr.t < 4);
    popups = popups.filter((p) => (p.t += dt) < 1.2);
    particles = particles.filter((p) => {
      p.t += dt;
      p.vx *= Math.max(0, 1 - 3 * dt);
      p.vy *= Math.max(0, 1 - 3 * dt);
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      return p.t < p.life;
    });
  }

  // ---------------- Drawing ----------------
  function draw() {
    // Dirt field
    ctx.fillStyle = "#a9713a";
    ctx.fillRect(0, 0, W, H);
    for (const p of patches) {
      ctx.fillStyle = p.dark ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)";
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.rx, p.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Tread marks
    for (const tr of treads) {
      ctx.save();
      ctx.translate(tr.x, tr.y);
      ctx.rotate(tr.angle);
      ctx.globalAlpha = 0.22 * (1 - tr.t / 4);
      ctx.fillStyle = "#4a2f14";
      ctx.fillRect(-7, -3, 14, 6);
      ctx.restore();
    }
    ctx.globalAlpha = 1;

    drawBorder();

    for (const obj of objects) drawObject(obj);
    drawDozer();

    // Particles
    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, 1 - p.t / p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Popups
    ctx.textAlign = "center";
    ctx.font = "bold 22px Archivo, sans-serif";
    for (const p of popups) {
      ctx.globalAlpha = 1 - p.t / 1.2;
      ctx.fillStyle = p.color;
      ctx.fillText(p.text, p.x, p.y - p.t * 40);
    }
    ctx.globalAlpha = 1;

    // Turbo indicator
    if (playing) {
      ctx.fillStyle = "rgba(23,24,28,0.55)";
      roundRectPath(14, 14, 130, 14, 7);
      ctx.fill();
      ctx.fillStyle = turboCd === 0 ? "#ffc400" : "#6b6e76";
      const frac = turboCd === 0 ? 1 : 1 - turboCd / 2.2;
      roundRectPath(14, 14, 130 * frac, 14, 7);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "700 11px Archivo, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("TURBO", 20, 25);
      ctx.textAlign = "center";
    }

    if (!playing) drawOverlay();
  }

  function drawBorder() {
    // Hazard-stripe frame around the playfield
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, W, H);
    ctx.rect(MARGIN, MARGIN, W - MARGIN * 2, H - MARGIN * 2);
    ctx.clip("evenodd");
    ctx.fillStyle = "#17181c";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#ffc400";
    ctx.lineWidth = 14;
    for (let i = -H; i < W + H; i += 44) {
      ctx.beginPath();
      ctx.moveTo(i, -10);
      ctx.lineTo(i + H + 20, H + 10);
      ctx.stroke();
    }
    ctx.restore();
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = 3;
    ctx.strokeRect(MARGIN, MARGIN, W - MARGIN * 2, H - MARGIN * 2);
  }

  function drawObject(obj) {
    const shake = obj.shake > 0 ? (Math.random() - 0.5) * 5 : 0;
    ctx.save();
    ctx.translate(obj.x + shake, obj.y);

    if (obj.type === "crate") {
      ctx.rotate(obj.angle);
      const s = obj.r * 1.7;
      ctx.fillStyle = "#a06a2c";
      ctx.fillRect(-s / 2, -s / 2, s, s);
      ctx.strokeStyle = "#7a4e1d";
      ctx.lineWidth = 4;
      ctx.strokeRect(-s / 2 + 2, -s / 2 + 2, s - 4, s - 4);
      ctx.beginPath();
      ctx.moveTo(-s / 2 + 4, -s / 2 + 4);
      ctx.lineTo(s / 2 - 4, s / 2 - 4);
      ctx.moveTo(s / 2 - 4, -s / 2 + 4);
      ctx.lineTo(-s / 2 + 4, s / 2 - 4);
      ctx.stroke();
    } else if (obj.type === "rock") {
      ctx.rotate(obj.angle);
      ctx.fillStyle = obj.hp < obj.maxHp ? "#7c7c7c" : "#8d8d8d";
      ctx.beginPath();
      ctx.moveTo(-obj.r, 6);
      ctx.lineTo(-obj.r * 0.5, -obj.r * 0.8);
      ctx.lineTo(obj.r * 0.4, -obj.r);
      ctx.lineTo(obj.r, -obj.r * 0.1);
      ctx.lineTo(obj.r * 0.6, obj.r * 0.8);
      ctx.lineTo(-obj.r * 0.4, obj.r);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.16)";
      ctx.beginPath();
      ctx.arc(-obj.r * 0.3, -obj.r * 0.3, obj.r * 0.28, 0, Math.PI * 2);
      ctx.fill();
    } else if (obj.type === "wall") {
      ctx.rotate(obj.angle);
      const len = 104, wid = 30, brick = 26;
      ctx.fillStyle = obj.hp === 1 ? "#8f4030" : "#b5533c";
      ctx.fillRect(-len / 2, -wid / 2, len, wid);
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineWidth = 2;
      ctx.strokeRect(-len / 2, -wid / 2, len, wid);
      ctx.beginPath();
      for (let bx = -len / 2 + brick; bx < len / 2; bx += brick) {
        ctx.moveTo(bx, -wid / 2);
        ctx.lineTo(bx, wid / 2);
      }
      ctx.moveTo(-len / 2, 0);
      ctx.lineTo(len / 2, 0);
      ctx.stroke();
    } else if (obj.type === "barrel") {
      ctx.fillStyle = "#3fae4a";
      ctx.beginPath();
      ctx.arc(0, 0, obj.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#2e8437";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, obj.r - 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#ffe27a";
      ctx.font = "900 20px Archivo, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("☠", 0, 7);
    }

    // Damage cracks
    if (obj.hp < obj.maxHp && obj.type !== "barrel") {
      ctx.strokeStyle = "rgba(0,0,0,0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-8, -12);
      ctx.lineTo(0, 0);
      ctx.lineTo(-6, 12);
      ctx.moveTo(0, 0);
      ctx.lineTo(12, 6);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawDozer() {
    ctx.save();
    ctx.translate(dozer.x, dozer.y);
    ctx.rotate(dozer.angle);

    // Tracks (left & right)
    ctx.fillStyle = "#3b3b3b";
    roundRectPath(-40, -34, 82, 15, 7);
    ctx.fill();
    roundRectPath(-40, 19, 82, 15, 7);
    ctx.fill();
    // Tread lines
    ctx.strokeStyle = "#5c5c5c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = -34; x < 40; x += 9) {
      ctx.moveTo(x, -33);
      ctx.lineTo(x, -20);
      ctx.moveTo(x, 20);
      ctx.lineTo(x, 33);
    }
    ctx.stroke();

    // Body
    ctx.fillStyle = "#ffc400";
    roundRectPath(-38, -20, 70, 40, 7);
    ctx.fill();
    // Engine hood (front)
    ctx.fillStyle = "#e5a800";
    roundRectPath(2, -16, 28, 32, 5);
    ctx.fill();
    // Cab (rear) with operator
    ctx.fillStyle = "#ffce33";
    roundRectPath(-34, -14, 30, 28, 5);
    ctx.fill();
    ctx.fillStyle = "#17181c";
    ctx.beginPath();
    ctx.arc(-19, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    // Operator's hard hat
    ctx.fillStyle = "#ff7f2a";
    ctx.beginPath();
    ctx.arc(-19, 0, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // Exhaust
    ctx.fillStyle = "#444";
    ctx.beginPath();
    ctx.arc(8, -10, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Blade arms
    ctx.strokeStyle = "#e5a800";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(26, -22);
    ctx.lineTo(48, -30);
    ctx.moveTo(26, 22);
    ctx.lineTo(48, 30);
    ctx.stroke();

    // Blade (slightly curved)
    ctx.fillStyle = "#8c8c8c";
    ctx.beginPath();
    ctx.moveTo(48, -42);
    ctx.quadraticCurveTo(62, 0, 48, 42);
    ctx.lineTo(56, 42);
    ctx.quadraticCurveTo(70, 0, 56, -42);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#6f6f6f";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  function roundRectPath(x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, Math.max(w, 0.01), h, r);
  }

  function drawOverlay() {
    ctx.fillStyle = "rgba(15,16,19,0.72)";
    ctx.fillRect(0, 0, W, H);
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffc400";
    ctx.font = "900 40px Archivo, sans-serif";

    if (timeLeft === 0) {
      ctx.fillText(t("game.over"), W / 2, H / 2 - 40);
      ctx.fillStyle = "#fff";
      ctx.font = "700 26px Archivo, sans-serif";
      ctx.fillText(`${t("game.final")} ${score}`, W / 2, H / 2 + 4);
      ctx.font = "500 17px Inter, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      const msg =
        score >= 500 ? t("game.rank1") :
        score >= 250 ? t("game.rank2") :
        t("game.rank3");
      ctx.fillText(msg, W / 2, H / 2 + 38);
      ctx.fillText(t("game.again"), W / 2, H / 2 + 66);
    } else {
      ctx.fillText(t("game.title"), W / 2, H / 2 - 44);
      ctx.fillStyle = "#fff";
      ctx.font = "500 18px Inter, sans-serif";
      ctx.fillText(t("game.intro1"), W / 2, H / 2);
      ctx.fillText(t("game.intro2"), W / 2, H / 2 + 28);
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.fillText(t("game.intro3"), W / 2, H / 2 + 64);
    }
  }

  // ---------------- Main loop ----------------
  function loop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  playing = false;
  reset();
  lastTime = performance.now();
  requestAnimationFrame(loop);
})();
