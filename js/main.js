document.addEventListener('DOMContentLoaded', function () {
  const btn = document.querySelector('.tiltbtn'); //ボタン自体を取得
  const btnW = btn.clientWidth; //ボタンの横幅
  const btnH = btn.clientHeight; //ボタンの高さ
  const transformDeg = 30;
  btn.addEventListener('mousemove', function (e) {
    let mouseX = e.offsetX;
    let mouseY = e.offsetY;
    let rateX = (mouseX / btnW - 0.5) * 2; //  -1 <= rateX <= 1
    let rateY = (mouseY / btnH - 0.5) * 2; //  -1 <= rateY <= 1
    const rotate = (x, y, deg) => {
      let result = [];
      if ((x <= 0 && y <= 0) || (x >= 0 && y >= 0)) {
        result[0] = x * deg;
        result[1] = -y * deg;
        return result;
      }
      if ((x >= 0 && y <= 0) || (x <= 0 && y >= 0)) {
        result[0] = -x * deg;
        result[1] = y * deg;
        return result;
      }
    };
    btn.style.transform = `scale3d(1.1, 1.1, 1.1) rotateX(${
      rotate(rateX, rateY, transformDeg)[0]
    }deg) rotateY(${rotate(rateX, rateY, transformDeg)[1]}deg)`;
  });
});
