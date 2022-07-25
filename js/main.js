document.addEventListener('DOMContentLoaded', function (e) {
  const section = document.querySelector('.section'); //高さを画面いっぱいに持つsection
  const layer = document.querySelector('.layer');
  const btn = document.querySelector('.tiltbtn'); //ボタン自体を取得
  const btnLink = btn.querySelector('.tiltbtn__link'); //子要素
  const btnTextSp = 'Touch Me!'; //スマホ・タブレットのとき
  const btnTextPc = 'Hover Me!'; //PCのとき
  const btnW = btn.clientWidth; //ボタンの横幅
  const btnH = btn.clientHeight; //ボタンの高さ
  const btnStyle = getComputedStyle(btn);
  const btnDefaultBgColor = btnStyle.backgroundColor; //background-colorの初期状態
  const btnDefaultBoxShadow = btnStyle.boxShadow; //box-shadowの初期状態
  const btnDefaultTransform = btnStyle.transform; //transformの初期状態
  const btnLinkStyle = getComputedStyle(btnLink);
  const btnLinkDefaultColor = btnLinkStyle.color; //colorの初期状態
  const btnLinkDefaultTransform = btnLinkStyle.transform; //transformの初期状態
  const btnMarginTop = parseInt(btnStyle.marginTop); //btnのmargin-top
  const btnMarginLeft = parseInt(btnStyle.marginLeft); //btnのmargin-left
  const maxShadowSize = 20; //影のサイズ最大値
  const shadowBlurSize = 25; //影のぼかしサイズ
  const lightColor = '#ffffff'; //明かり
  const darkColor = '#cccccc'; //影
  const touchBgColor = '#fafafa'; //タッチしたときの背景色
  const touchTextColor = '#d7d7d7'; //タッチしたときの文字色
  const translateZ = 40; //文字を浮かび上がらせる度合い
  const transformDeg = 30; //歪みの角度
  const transformScale = 1.08; //スケールさせる割合
  const scale3d = `${transformScale}, ${transformScale}, ${transformScale}`;
  const sp = navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i); //スマホ・タブレットの判定

  // スマホ・タブレット or PC でボタンの文字列を変更
  if (sp) {
    btnLink.textContent = btnTextSp;
  } else {
    btnLink.textContent = btnTextPc;
  }
  class Tilt {
    constructor(e) {
      this.h = window.innerHeight; //画面の高さ(アドレスバーを除く)
      this.mouseX = e.offsetX; //0 <= mouseX <= width
      this.mouseY = e.offsetY; //0 <= mouseY <= height
      this.touchX = e.changedTouches
        ? e.changedTouches[0].pageX - btnMarginLeft
        : '';
      this.touchY = e.changedTouches
        ? e.changedTouches[0].pageY - btnMarginTop
        : '';
      this.rateX = sp
        ? (this.touchX / btnW - 0.5) * 2
        : (this.mouseX / btnW - 0.5) * 2; //-1 <= rateX <= 1
      this.rateY = sp
        ? (this.touchY / btnH - 0.5) * 2
        : (this.mouseY / btnH - 0.5) * 2; //-1 <= rateY <= 1
    }
    noScroll() {
      section.style.height = `${this.h}px`;
    }
    btnDefaultStyle() {
      btn.style.boxShadow = btnDefaultBoxShadow;
      btn.style.transform = btnDefaultTransform;
    }
    btnDefaultStyleSp() {
      btn.style.backgroundColor = btnDefaultBgColor;
      btnLink.style.color = btnLinkDefaultColor;
      btnLink.style.transform = btnLinkDefaultTransform;
    }
    btnDefaultStyleSpGroup() {
      this.btnDefaultStyle();
      this.btnDefaultStyleSp();
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
      btn.style.transform = `scale3d(${scale3d}) rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg)`;
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
    changeStyle() {
      this.rotate();
      this.shadow();
    }
    touchStyle() {
      btn.style.backgroundColor = touchBgColor;
      btnLink.style.color = touchTextColor;
      btnLink.style.transform = `translateZ(${translateZ}px)`;
    }
    touchStyleGroup() {
      this.changeStyle();
      this.touchStyle();
    }
  }

  // スクロールしないようにする
  const tiltbtn = new Tilt(e);
  tiltbtn.noScroll();

  // マウスが入ってきたら傾ける
  btn.addEventListener('mouseover', function (e) {
    const tiltbtn = new Tilt(e);
    tiltbtn.changeStyle();
  });

  // マウスが動いているとき傾ける
  btn.addEventListener('mousemove', function (e) {
    const tiltbtn = new Tilt(e);
    tiltbtn.changeStyle();
  });

  // マウスが外れたら元に戻す
  btn.addEventListener('mouseout', function (e) {
    const tiltbtn = new Tilt(e);
    tiltbtn.btnDefaultStyle();
  });

  // マウスが余白に入ったら元に戻す
  layer.addEventListener('mouseover', function (e) {
    const tiltbtn = new Tilt(e);
    tiltbtn.btnDefaultStyle();
  });

  // タッチしたとき傾ける
  btn.addEventListener('touchstart', function (e) {
    e.preventDefault();
    const tiltbtn = new Tilt(e);
    tiltbtn.touchStyleGroup();
  });

  // 指が動いているとき傾ける
  btn.addEventListener('touchmove', function (e) {
    e.preventDefault();
    const tiltbtn = new Tilt(e);
    tiltbtn.touchStyleGroup();
  });

  // タッチがキャンセルされたら元に戻す
  btn.addEventListener('touchcancel', function (e) {
    e.preventDefault();
    const tiltbtn = new Tilt(e);
    tiltbtn.btnDefaultStyleSpGroup();
  });

  // タッチが外れたら元に戻す
  btn.addEventListener('touchend', function (e) {
    e.preventDefault();
    const tiltbtn = new Tilt(e);
    tiltbtn.btnDefaultStyleSpGroup();
  });

  // 余白にタッチしたら元に戻す
  layer.addEventListener('touchstart', function (e) {
    e.preventDefault();
    const tiltbtn = new Tilt(e);
    tiltbtn.btnDefaultStyleSpGroup();
  });

  // 画面のリサイズ時
  window.addEventListener('resize', function () {
    const tiltbtn = new Tilt(e);
    tiltbtn.noScroll();
  });
});
