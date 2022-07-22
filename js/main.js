document.addEventListener('DOMContentLoaded', function () {
  const btn = document.querySelector('.tiltbtn'); //ボタン自体を取得
  const btnW = btn.clientWidth; //ボタンの横幅
  const btnH = btn.clientHeight; //ボタンの高さ
  const transformDeg = 30;
  const maxShadowSize = 20;
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
    btn.style.transform = `scale3d(1.08, 1.08, 1.08) rotateX(${
      rotate(rateX, rateY, transformDeg)[0]
    }deg) rotateY(${rotate(rateX, rateY, transformDeg)[1]}deg)`;

    const shadow = (x, y, size) => {
      let result = [maxShadowSize, maxShadowSize]; // 初期値
      if ((x <= 0 && y <= 0) || (x <= 0 && y >= 0)) {
        result[0] = -x * size; // darkのx座標のオフセット
        result[1] = -y * size; // darkのy座標のオフセット
        result[2] = size - result[0]; // lightのx,y座標値のオフセット
        return result;
      }
      if ((x >= 0 && y <= 0) || (x >= 0 && y >= 0)) {
        result[0] = -x * size;
        result[1] = -y * size;
        result[2] = size + result[0];
        return result;
      }
    };
    btn.style.boxShadow = `${shadow(rateX, rateY, maxShadowSize)[0]}px ${
      shadow(rateX, rateY, maxShadowSize)[1]
    }px 20px #cccccc, -${shadow(rateX, rateY, maxShadowSize)[2]}px -${
      shadow(rateX, rateY, maxShadowSize)[2]
    }px 20px #ffffff`;
  });
  btn.addEventListener('mouseout', function () {
    btn.style.transform = `scale3d(1.0, 1.0, 1.0) rotateX(0) rotateY(0)`;
    btn.style.boxShadow = `10px 10px 10px #cccccc, -10px -10px 10px #ffffff`;
  });
});
