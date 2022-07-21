document.addEventListener('DOMContentLoaded', function () {
  const btn = document.querySelector('.tiltbtn'); //ボタン自体を取得
  const btnW = btn.clientWidth; //ボタンの横幅
  const btnH = btn.clientHeight; //ボタンの高さ
  btn.addEventListener('mousemove', function (e) {
    let mouseX = e.offsetX;
    let mouseY = e.offsetY;
    let rateX = mouseX / btnW;
    let rateY = mouseY / btnH;
  });
});
