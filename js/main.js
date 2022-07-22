document.addEventListener('DOMContentLoaded', function () {
  const btn = document.querySelector('.tiltbtn'); //ボタン自体を取得
  const btnW = btn.clientWidth; //ボタンの横幅
  const btnH = btn.clientHeight; //ボタンの高さ
  const transformDeg = 30; //歪みの角度
  const transformScale = 1.08;
  const maxShadowSize = 20; //影のサイズ最大値
  const shadowBlurSize = 25; //影のぼかしサイズ
  const btnStyle = getComputedStyle(btn);
  const btnDefaultBoxShadow = btnStyle.boxShadow; //box-shadowの初期状態
  const btnDefaultTransform = btnStyle.transform; //transformの初期状態
  const lightColor = '#ffffff';
  const darkColor = '#cccccc';

  // マウスが乗ったら傾ける
  btn.addEventListener('mousemove', function (e) {
    let mouseX = e.offsetX; //0 <= mouseX <= width
    let mouseY = e.offsetY; //0 <= mouseY <= height
    let rateX = (mouseX / btnW - 0.5) * 2; //-1 <= rateX <= 1
    let rateY = (mouseY / btnH - 0.5) * 2; //-1 <= rateY <= 1
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
    const scale3d = `${transformScale}, ${transformScale}, ${transformScale}`;
    const rotateX = rotate(rateX, rateY, transformDeg)[0];
    const rotateY = rotate(rateX, rateY, transformDeg)[1];
    btn.style.transform = `scale3d(${scale3d}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    const shadow = (x, y, size) => {
      let result = [maxShadowSize, maxShadowSize]; // 初期値
      if ((x <= 0 && y <= 0) || (x <= 0 && y >= 0)) {
        result[0] = -x * size; //darkのx座標のオフセット
        result[1] = -y * size; //darkのy座標のオフセット
        result[2] = size - result[0]; // lightのx,y座標のオフセット
        return result;
      }
      if ((x >= 0 && y <= 0) || (x >= 0 && y >= 0)) {
        result[0] = -x * size;
        result[1] = -y * size;
        result[2] = size + result[0];
        return result;
      }
    };
    const shadowDarkX = shadow(rateX, rateY, maxShadowSize)[0];
    const shadowDarkY = shadow(rateX, rateY, maxShadowSize)[1];
    const shadowLightXY = shadow(rateX, rateY, maxShadowSize)[2];
    btn.style.boxShadow = `${shadowDarkX}px ${shadowDarkY}px ${shadowBlurSize}px ${darkColor}, -${shadowLightXY}px -${shadowLightXY}px ${shadowBlurSize}px ${lightColor}`;
  });

  // タッチしたとき
  btn.addEventListener('touchstart', function (e) {});

  // 指が動いているとき
  btn.addEventListener('touchmove', function (e) {});

  // ボタンをデフォルトのスタイルに戻す関数
  const changeBtnDefaultStyle = function () {
    btn.style.boxShadow = btnDefaultBoxShadow;
    btn.style.transform = btnDefaultTransform;
  };
  // マウスが外れたら元に戻す
  btn.addEventListener('mouseout', function () {
    changeBtnDefaultStyle();
  });
  // タッチが外れたら元に戻す
  btn.addEventListener('touchend', function () {
    changeBtnDefaultStyle();
  });
});
