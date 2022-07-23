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

  class Tilt {
    constructor(e) {
      this.mouseX = e.offsetX; //0 <= mouseX <= width
      this.mouseY = e.offsetY; //0 <= mouseY <= height
      this.rateX = (this.mouseX / btnW - 0.5) * 2; //-1 <= rateX <= 1
      this.rateY = (this.mouseY / btnH - 0.5) * 2; //-1 <= rateY <= 1
      this.scale3d = `${transformScale}, ${transformScale}, ${transformScale}`;
    }
    changeBtnDefaultStyle() {
      btn.style.boxShadow = btnDefaultBoxShadow;
      btn.style.transform = btnDefaultTransform;
    }
    rotate(x, y, deg) {
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
      this.rotateX = this.rotate(this.rateX, this.rateY, transformDeg)[0];
      this.rotateY = this.rotate(this.rateX, this.rateY, transformDeg)[1];
      btn.style.transform = `scale3d(${this.scale3d}) rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg)`;
    }
    shadow(x, y, size) {
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
      this.shadowDarkX = this.shadow(this.rateX, this.rateY, maxShadowSize)[0];
      this.shadowDarkY = this.shadow(this.rateX, this.rateY, maxShadowSize)[1];
      this.shadowLightXY = this.shadow(
        this.rateX,
        this.rateY,
        maxShadowSize
      )[2];
      btn.style.boxShadow = `${this.shadowDarkX}px ${this.shadowDarkY}px ${shadowBlurSize}px ${darkColor}, -${this.shadowLightXY}px -${this.shadowLightXY}px ${shadowBlurSize}px ${lightColor}`;
    }
  }

  // マウスが乗ったら傾ける
  btn.addEventListener('mousemove', function (e) {
    const tiltbtn = new Tilt(e);
    tiltbtn.rotate();
    tiltbtn.shadow();
  });

  // マウスが外れたら元に戻す
  btn.addEventListener('mouseout', function (e) {
    const tiltbtn = new Tilt(e);
    tiltbtn.changeBtnDefaultStyle();
  });

  // タッチしたとき
  btn.addEventListener('touchstart', function (e) {});

  // 指が動いているとき
  btn.addEventListener('touchmove', function (e) {});

  // タッチが外れたら元に戻す
  btn.addEventListener('touchend', function (e) {
    const tiltbtn = new Tilt(e);
    tiltbtn.changeBtnDefaultStyle();
  });
});
