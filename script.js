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
