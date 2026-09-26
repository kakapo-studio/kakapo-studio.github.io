// ===== カカポをクリックすると、ジャンプしてしゃべる =====
const kakapo = document.getElementById("kakapo");
const bubble = document.getElementById("bubble");

const words = [
  "コツコツ！",
  "飛べないけど、歩けるよ",
  "作品も見てね",
  "カカポ！",
];

let count = 0;     // 何回クリックされたか
let hideTimer;     // ふきだしを消すタイマー

kakapo.addEventListener("click", () => {
  // セリフを順番に表示する（最後まで行ったら最初に戻る）
  bubble.textContent = words[count % words.length];
  count++;
  bubble.classList.add("show");

  // ジャンプのアニメーションを、最初から再生し直す
  kakapo.classList.remove("hop");
  void kakapo.offsetWidth;
  kakapo.classList.add("hop");

  // 2秒後にふきだしを消す（連打されたら、前のタイマーは取り消す）
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    bubble.classList.remove("show");
  }, 2000);
});

// ジャンプが終わったら、ゆらゆら浮かぶ動きに戻す
kakapo.addEventListener("animationend", () => {
  kakapo.classList.remove("hop");
});


// ===== スクロールで、ふわっと現れる =====
// IntersectionObserver：要素が「画面に入ったか」を見張ってくれる道具
const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target); // 一度現れたら、もう見張らない
    }
  });
}, {
  rootMargin: "0px 0px -10% 0px", // 画面の下から10%入ったところで反応
});

revealItems.forEach((item) => {
  revealObserver.observe(item);
});


// ===== スクロールしたら、ヘッダーの下に線を出す =====
const header = document.getElementById("header");

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 10);
}


// ===== スクロールで歩くカカポと足跡 =====
const hero = document.getElementById("top");
const walkTrack = document.getElementById("walkTrack");
const walker = document.getElementById("walker");

const STEP = 56;          // 足跡をつける間隔（px）
const WALK_LINE = 0.55;   // カカポが歩く高さ（画面の上から55%のところ）

let lastStepY = null;     // 最後に足跡をつけた位置
let side = 1;             // 右足・左足を交互にするための目印（1 か -1）
let walkTimer;            // 歩くのをやめるまでのタイマー

// 足跡を1つ置く
function placeFootprint(y) {
  const print = document.createElement("img");
  print.src = "images/footprint.svg";
  print.alt = "";
  print.className = "footprint";

  // 右足と左足で、少し横にずらす
  const width = walker.offsetWidth;
  if (side === 1) {
    print.style.left = width * 0.55 + "px";
  } else {
    print.style.left = width * 0.15 + "px";
  }
  print.style.top = y + walker.offsetHeight * 0.7 + "px";
  side = -side;

  walkTrack.appendChild(print);
}

function updateWalker() {
  // カカポの位置 ＝ 今見ている場所 ＋ 画面の高さの55%
  const bottomLimit = walkTrack.offsetHeight - walker.offsetHeight;
  const walkerY = Math.min(window.scrollY + window.innerHeight * WALK_LINE, bottomLimit);
  walker.style.top = walkerY + "px";

  // トップ画面にいる間は隠しておく
  const heroBottom = hero.offsetTop + hero.offsetHeight;
  const isOut = walkerY > heroBottom;
  walker.classList.toggle("is-out", isOut);
  if (!isOut) {
    return;
  }

  // 歩き始めた場所を覚える
  if (lastStepY === null) {
    lastStepY = walkerY;
  }

  // 前の足跡から STEP 以上進んでいたら、その分だけ足跡を置く
  // （下に進んだときだけ。上に戻るときは、つけた足跡の上を戻っていく）
  while (walkerY - lastStepY >= STEP) {
    lastStepY += STEP;
    placeFootprint(lastStepY);
  }
}

// スクロール中だけ、よちよち歩きのアニメーションをする
function startWalking() {
  walker.classList.add("is-walking");
  clearTimeout(walkTimer);
  walkTimer = setTimeout(() => {
    walker.classList.remove("is-walking");
  }, 150);
}


// ===== スクロールしたときの処理をまとめる =====
// requestAnimationFrame：画面を描き直すタイミングに合わせて1回だけ実行する（重くならない工夫）
let ticking = false;

window.addEventListener("scroll", () => {
  startWalking();
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(() => {
      updateHeader();
      updateWalker();
      ticking = false;
    });
  }
});

window.addEventListener("resize", updateWalker);

// ページを開いたときにも1回実行しておく
updateHeader();
updateWalker();
