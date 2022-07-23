document.addEventListener('DOMContentLoaded', function (e) {
  const btn = document.querySelector('.tiltbtn'); //ボタン自体を取得
  const btnLink = btn.querySelector('.tiltbtn__link'); //子要素
  const btnTextSp = 'Touch Me!'; //スマホ・タブレットのとき
  const btnTextPc = 'Hover Me!'; //PCのとき
  const btnW = btn.clientWidth; //ボタンの横幅
  const btnH = btn.clientHeight; //ボタンの高さ
  const btnStyle = getComputedStyle(btn);
  const btnDefaultBoxShadow = btnStyle.boxShadow; //box-shadowの初期状態
  const btnDefaultTransform = btnStyle.transform; //transformの初期状態
  const btnMarginTop = parseInt(btnStyle.marginTop); //btnのmargin-top
  const btnMarginLeft = parseInt(btnStyle.marginLeft); //btnのmargin-left

  // スマホ・タブレット or PC でボタンの文字列を変更
  if (navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i)) {
    btnLink.textContent = btnTextSp;
  } else {
    btnLink.textContent = btnTextPc;
  }
  class Tilt {
    constructor(e) {
      this.section = document.querySelector('.section'); //高さを画面いっぱいに持つsection
      this.transformDeg = 30; //歪みの角度
      this.transformScale = 1.08;
      this.maxShadowSize = 20; //影のサイズ最大値
      this.shadowBlurSize = 25; //影のぼかしサイズ
      this.lightColor = '#ffffff'; //明かり
      this.darkColor = '#cccccc'; //影
      this.h = window.innerHeight; //画面の高さ(アドレスバーを除く)
      this.mouseX = e.offsetX; //0 <= mouseX <= width
      this.mouseY = e.offsetY; //0 <= mouseY <= height
      this.touchX = e.changedTouches
        ? e.changedTouches[0].pageX - btnMarginLeft
        : '';
      this.touchY = e.changedTouches
        ? e.changedTouches[0].pageY - btnMarginTop
        : '';
      this.rateX = navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i)
        ? (this.touchX / btnW - 0.5) * 2
        : (this.mouseX / btnW - 0.5) * 2; //-1 <= rateX <= 1
      this.rateY = navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i)
        ? (this.touchY / btnH - 0.5) * 2
        : (this.mouseY / btnH - 0.5) * 2; //-1 <= rateY <= 1
      this.scale3d = `${this.transformScale}, ${this.transformScale}, ${this.transformScale}`;
    }
    noScroll() {
      this.section.style.height = `${this.h}px`;
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
      this.rotateX = this.rotate(this.rateX, this.rateY, this.transformDeg)[0];
      this.rotateY = this.rotate(this.rateX, this.rateY, this.transformDeg)[1];
      btn.style.transform = `scale3d(${this.scale3d}) rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg)`;
    }
    shadow(x, y, size) {
      let result = [this.maxShadowSize, this.maxShadowSize]; // 初期値
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
      this.shadowDarkX = this.shadow(
        this.rateX,
        this.rateY,
        this.maxShadowSize
      )[0];
      this.shadowDarkY = this.shadow(
        this.rateX,
        this.rateY,
        this.maxShadowSize
      )[1];
      this.shadowLightXY = this.shadow(
        this.rateX,
        this.rateY,
        this.maxShadowSize
      )[2];
      btn.style.boxShadow = `${this.shadowDarkX}px ${this.shadowDarkY}px ${this.shadowBlurSize}px ${this.darkColor}, -${this.shadowLightXY}px -${this.shadowLightXY}px ${this.shadowBlurSize}px ${this.lightColor}`;
    }
  }

  // スクロールしないようにする
  const tiltbtn = new Tilt(e);
  tiltbtn.noScroll();

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
  btn.addEventListener('touchstart', function (e) {
    e.preventDefault();
    const tiltbtn = new Tilt(e);
    tiltbtn.rotate();
    tiltbtn.shadow();
  });

  // 指が動いているとき
  btn.addEventListener('touchmove', function (e) {
    e.preventDefault();
    const tiltbtn = new Tilt(e);
    tiltbtn.rotate();
    tiltbtn.shadow();
  });

  // タッチがキャンセルされたら元に戻す
  btn.addEventListener('touchcancel', function (e) {
    e.preventDefault();
    const tiltbtn = new Tilt(e);
    tiltbtn.changeBtnDefaultStyle();
  });

  // タッチが外れたら元に戻す
  btn.addEventListener('touchend', function (e) {
    e.preventDefault();
    const tiltbtn = new Tilt(e);
    tiltbtn.changeBtnDefaultStyle();
  });

  // 画面のリサイズ時
  window.addEventListener('resize', function () {
    const tiltbtn = new Tilt(e);
    tiltbtn.noScroll();
  });
});
