// 全域變數
let objs = [];
let colors = ['#f71735', '#f7d002', '#1A53C0', '#232323'];
let cnv;
let menuDiv;

// 淡江大學文字動畫相關變數
let textAnimDuration = 150; // 動畫持續時間 (以幀數計，約 2.5 秒)
let textAnimElapsed = 0;    // 已逝時間
let textTargetY;            // 目標 Y 座標 (中央)
let textStartY;             // 起始 Y 座標 (螢幕下方)
let currentTextY;           // 目前 Y 座標

// --------------------- Easing Function ---------------------
// 利用 easeOutElastic 函式實現彈出效果
function easeOutElastic(x) {
  const c4 = (2 * Math.PI) / 3;
  
  if (x === 0) return 0;
  if (x === 1) return 1;
  
  // easeOutElastic 公式
  return Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}
// -----------------------------------------------------------


function setup() {
  // --------------------- 1. 動態載入 Google Fonts CSS ---------------------
  // 載入 Zen Maru Gothic (用於選單) 和 Rampart One (用於主標題)
  const link1 = document.createElement('link');
  link1.rel = 'preconnect';
  link1.href = 'https://fonts.googleapis.com';
  document.head.appendChild(link1);

  const link2 = document.createElement('link');
  link2.rel = 'preconnect';
  link2.href = 'https://fonts.gstatic.com';
  link2.crossOrigin = '';
  document.head.appendChild(link2);

  const link3 = document.createElement('link');
  link3.href = 'https://fonts.googleapis.com/css2?family=Rampart+One&family=Zen+Maru+Gothic&display=swap';
  link3.rel = 'stylesheet';
  document.head.appendChild(link3);

  // --------------------- 2. 建立畫布與設定 ---------------------
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.position((windowWidth - width) / 2, (windowHeight - height) / 2);

  document.body.style.backgroundColor = '#000';
  document.body.style.fontFamily = '"Zen Maru Gothic", sans-serif'; // 選單字體

  // --------------------- 3. 選單 CSS/HTML 設定 ---------------------
  const css = `
    #hoverZone {
      position: fixed;
      left: 0;
      top: 0;
      height: 100vh;
      width: 50px;
      z-index: 10002;
    }

    #leftMenu {
      position: fixed;
      left: 0;
      top: 0;
      height: 100vh;
      width: 320px;
      background: rgba(10,10,10,0.95);
      color: #fff;
      padding: 40px 24px;
      box-sizing: border-box;
      font-size: 32px;
      line-height: 1.6;
      z-index: 10001;
      box-shadow: 4px 0 12px rgba(0,0,0,0.7);
      /* 選單字型：Zen Maru Gothic */
      font-family: "Zen Maru Gothic", sans-serif;
      
      transform: translateX(-300px); 
      transition: transform 0.3s ease-out;
    }
    
    #hoverZone:hover + #leftMenu,
    #leftMenu:hover {
      transform: translateX(0);
    }

    #leftMenu a {
      color: #fff;
      text-decoration: none;
      display: block;
      cursor: pointer;
      margin: 14px 0;
      transition: opacity 0.2s;
    }
    #leftMenu a:hover { opacity: 0.9; }
    
    #menu7Wrapper {
      margin: 14px 0;
      position: relative;
    }

    #subMenuTKU {
      max-height: 0; 
      overflow: hidden;
      transition: max-height 0.4s ease-out, padding 0.3s ease-out;
    }

    #menu7Wrapper:hover #subMenuTKU {
      max-height: 200px;
      padding-top: 5px;
    }

    #subMenuTKU a {
      font-size: 24px;
      line-height: 1.4;
      margin: 8px 0;
      padding-left: 30px;
    }
  `;
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
  
  const hoverZone = document.createElement('div');
  hoverZone.id = 'hoverZone';
  document.body.appendChild(hoverZone);

  menuDiv = document.createElement('div');
  menuDiv.id = 'leftMenu';
  menuDiv.innerHTML = `
    <a id="menu1">第一單元作品</a>
    <a id="menu2">第一單元講義</a>
    <a id="menu3">測驗系統</a>
    <a id="menu5">測驗卷筆記</a>
    <a id="menu6">作品筆記</a>
    <div id="menu7Wrapper">
      <a id="menu7">淡江大學</a> 
      <div id="subMenuTKU">
        <a id="subMenuET">教育科技學系</a>
      </div>
    </div>
    <a id="menu4">回到首頁</a>
  `;
  document.body.appendChild(menuDiv);

  // ----------------------------------------------------
  // 選單點擊事件
  // ----------------------------------------------------

  // 第一單元作品 (menu1)
  document.getElementById('menu1').addEventListener('click', ()=> {
    const existing = document.getElementById('iframeOverlayUnit1');
    if (existing) {
      existing.remove();
      return;
    }
    const overlay = document.createElement('div');
    overlay.id = 'iframeOverlayUnit1';
    overlay.style.position = 'fixed';
    overlay.style.left = '50%';
    overlay.style.top = '50%';
    overlay.style.transform = 'translate(-50%, -50%)';
    overlay.style.width = '70vw';
    overlay.style.height = '85vh';
    overlay.style.background = '#111';
    overlay.style.zIndex = 10003; 
    overlay.style.borderRadius = '6px';
    overlay.style.boxShadow = '0 8px 30px rgba(0,0,0,0.6)';
    overlay.style.overflow = 'hidden';

    overlay.innerHTML = `
      <button id="closeIframeUnit1" style="
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 10004;
        font-size: 18px;
        padding: 6px 10px;
        cursor: pointer;
        border: none;
        border-radius: 4px;
        background: rgba(255,255,255,0.12);
        color: #fff;
      ">關閉</button>
      <iframe src="https://s110476-cmd.github.io/2025-1020/" style="width:100%;height:100%;border:0;" allowfullscreen></iframe>
    `;
    document.body.appendChild(overlay);
    document.getElementById('closeIframeUnit1').addEventListener('click', ()=> overlay.remove());
  });

  // 第一單元講義 (menu2)
  document.getElementById('menu2').addEventListener('click', ()=> {
    const existing = document.getElementById('iframeOverlay');
    if (existing) {
      existing.remove();
      return;
    }
    const overlay = document.createElement('div');
    overlay.id = 'iframeOverlay';
    overlay.style.position = 'fixed';
    overlay.style.left = '50%';
    overlay.style.top = '50%';
    overlay.style.transform = 'translate(-50%, -50%)';
    overlay.style.width = '70vw';
    overlay.style.height = '85vh';
    overlay.style.background = '#111';
    overlay.style.zIndex = 10003;
    overlay.style.borderRadius = '6px';
    overlay.style.boxShadow = '0 8px 30px rgba(0,0,0,0.6)';
    overlay.style.overflow = 'hidden';

    overlay.innerHTML = `
      <button id="closeIframe" style="
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 10004;
        font-size: 18px;
        padding: 6px 10px;
        cursor: pointer;
        border: none;
        border-radius: 4px;
        background: rgba(255,255,255,0.12);
        color: #fff;
      ">關閉</button>
      <iframe src="https://hackmd.io/@RXcou08ERlul7o47xjnHCg/H1KxP7Cilx" style="width:100%;height:100%;border:0;" allowfullscreen></iframe>
    `;
    document.body.appendChild(overlay);
    document.getElementById('closeIframe').addEventListener('click', ()=> overlay.remove());
  });
  
  // 「測驗系統」點擊事件 (menu3)
  document.getElementById('menu3').addEventListener('click', ()=> {
    const existing = document.getElementById('iframeOverlayQuiz');
    if (existing) {
      existing.remove();
      return;
    }
    const overlay = document.createElement('div');
    overlay.id = 'iframeOverlayQuiz';
    overlay.style.position = 'fixed';
    overlay.style.left = '50%';
    overlay.style.top = '50%';
    overlay.style.transform = 'translate(-50%, -50%)';
    overlay.style.width = '70vw';
    overlay.style.height = '85vh';
    overlay.style.background = '#111';
    overlay.style.zIndex = 10003; 
    overlay.style.borderRadius = '6px';
    overlay.style.boxShadow = '0 8px 30px rgba(0,0,0,0.6)';
    overlay.style.overflow = 'hidden';

    overlay.innerHTML = `
      <button id="closeIframeQuiz" style="
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 10004;
        font-size: 18px;
        padding: 6px 10px;
        cursor: pointer;
        border: none;
        border-radius: 4px;
        background: rgba(255,255,255,0.12);
        color: #fff;
      ">關閉</button>
      <iframe src="https://s110476-cmd.github.io/2025-11-03/" style="width:100%;height:100%;border:0;" allowfullscreen></iframe>
    `;
    document.body.appendChild(overlay);
    document.getElementById('closeIframeQuiz').addEventListener('click', ()=> overlay.remove());
  });
  
  // 「測驗卷筆記」點擊事件 (menu5)
  document.getElementById('menu5').addEventListener('click', ()=> {
    const existing = document.getElementById('iframeOverlayQuizNotes');
    if (existing) {
      existing.remove();
      return;
    }
    const overlay = document.createElement('div');
    overlay.id = 'iframeOverlayQuizNotes';
    overlay.style.position = 'fixed';
    overlay.style.left = '50%';
    overlay.style.top = '50%';
    overlay.style.transform = 'translate(-50%, -50%)';
    overlay.style.width = '70vw';
    overlay.style.height = '85vh';
    overlay.style.background = '#111';
    overlay.style.zIndex = 10003; 
    overlay.style.borderRadius = '6px';
    overlay.style.boxShadow = '0 8px 30px rgba(0,0,0,0.6)';
    overlay.style.overflow = 'hidden';

    overlay.innerHTML = `
      <button id="closeIframeQuizNotes" style="
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 10004;
        font-size: 18px;
        padding: 6px 10px;
        cursor: pointer;
        border: none;
        border-radius: 4px;
        background: rgba(255,255,255,0.12);
        color: #fff;
      ">關閉</button>
      <iframe src="https://hackmd.io/@RXcou08ERlul7o47xjnHCg/HkvNLsrkZl" style="width:100%;height:100%;border:0;" allowfullscreen></iframe>
    `;
    document.body.appendChild(overlay);
    document.getElementById('closeIframeQuizNotes').addEventListener('click', ()=> overlay.remove());
  });

  // **作品筆記 (menu6) - 新增連結功能**
  document.getElementById('menu6').addEventListener('click', ()=> { 
    const existing = document.getElementById('iframeOverlayWorkNotes');
    if (existing) {
      existing.remove();
      return;
    }
    const overlay = document.createElement('div');
    overlay.id = 'iframeOverlayWorkNotes';
    overlay.style.position = 'fixed';
    overlay.style.left = '50%';
    overlay.style.top = '50%';
    overlay.style.transform = 'translate(-50%, -50%)';
    overlay.style.width = '70vw';
    overlay.style.height = '85vh';
    overlay.style.background = '#111';
    overlay.style.zIndex = 10003; 
    overlay.style.borderRadius = '6px';
    overlay.style.boxShadow = '0 8px 30px rgba(0,0,0,0.6)';
    overlay.style.overflow = 'hidden';

    overlay.innerHTML = `
      <button id="closeIframeWorkNotes" style="
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 10004;
        font-size: 18px;
        padding: 6px 10px;
        cursor: pointer;
        border: none;
        border-radius: 4px;
        background: rgba(255,255,255,0.12);
        color: #fff;
      ">關閉</button>
      <iframe src="https://hackmd.io/@RXcou08ERlul7o47xjnHCg/Hk3Wn6AJ-l" style="width:100%;height:100%;border:0;" allowfullscreen></iframe>
    `;
    document.body.appendChild(overlay);
    document.getElementById('closeIframeWorkNotes').addEventListener('click', ()=> overlay.remove());
  });


  // 淡江大學點擊事件 (menu7) - 點擊主連結
  document.getElementById('menu7').addEventListener('click', ()=> {
    const existing = document.getElementById('iframeOverlayTKU');
    if (existing) {
      existing.remove();
      return;
    }
    const overlay = document.createElement('div');
    overlay.id = 'iframeOverlayTKU';
    overlay.style.position = 'fixed';
    overlay.style.left = '50%';
    overlay.style.top = '50%';
    overlay.style.transform = 'translate(-50%, -50%)';
    overlay.style.width = '70vw';
    overlay.style.height = '85vh';
    overlay.style.background = '#111';
    overlay.style.zIndex = 10003; 
    overlay.style.borderRadius = '6px';
    overlay.style.boxShadow = '0 8px 30px rgba(0,0,0,0.6)';
    overlay.style.overflow = 'hidden';

    overlay.innerHTML = `
      <button id="closeIframeTKU" style="
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 10004;
        font-size: 18px;
        padding: 6px 10px;
        cursor: pointer;
        border: none;
        border-radius: 4px;
        background: rgba(255,255,255,0.12);
        color: #fff;
      ">關閉</button>
      <iframe src="https://www.tku.edu.tw/" style="width:100%;height:100%;border:0;" allowfullscreen></iframe>
    `;
    document.body.appendChild(overlay);
    document.getElementById('closeIframeTKU').addEventListener('click', ()=> overlay.remove());
  });
  
  // 「教育科技學系」點擊事件 (subMenuET)
  document.getElementById('subMenuET').addEventListener('click', ()=> {
    const existing = document.getElementById('iframeOverlayET');
    if (existing) {
      existing.remove();
      return;
    }
    const overlay = document.createElement('div');
    overlay.id = 'iframeOverlayET';
    overlay.style.position = 'fixed';
    overlay.style.left = '50%';
    overlay.style.top = '50%';
    overlay.style.transform = 'translate(-50%, -50%)';
    overlay.style.width = '70vw';
    overlay.style.height = '85vh';
    overlay.style.background = '#111';
    overlay.style.zIndex = 10003; 
    overlay.style.borderRadius = '6px';
    overlay.style.boxShadow = '0 8px 30px rgba(0,0,0,0.6)';
    overlay.style.overflow = 'hidden';

    overlay.innerHTML = `
      <button id="closeIframeET" style="
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 10004;
        font-size: 18px;
        padding: 6px 10px;
        cursor: pointer;
        border: none;
        border-radius: 4px;
        background: rgba(255,255,255,0.12);
        color: #fff;
      ">關閉</button>
      <iframe src="https://hackmd.io/@RXcou08ERlul7o47xjnHCg/HkvNLsrkZl" style="width:100%;height:100%;border:0;" allowfullscreen></iframe>
    `;
    document.body.appendChild(overlay);
    document.getElementById('closeIframeET').addEventListener('click', ()=> overlay.remove());
  });

  document.getElementById('menu4').addEventListener('click', ()=>{ /* TODO */ });

  // 設定繪圖參數
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  objs.push(new DynamicShape());
  
  // 初始化文字動畫參數
  textTargetY = height / 2;
  textStartY = height + 100; // 從視窗最下方往上移動
  currentTextY = textStartY;
}

function draw() {
  // 畫布背景為黑色
  background(0);

  // 繪製粒子特效
  for (let i of objs) {
    i.run();
  }

  // --------------------- 文本動畫邏輯 ---------------------
  if (textAnimElapsed < textAnimDuration) {
    textAnimElapsed++;
    let n = textAnimElapsed / textAnimDuration; // 計算動畫進度 0 到 1
    let easingValue = easeOutElastic(n);       // 應用彈出緩動函式
    
    // 使用 lerp (線性插值) 將 Y 座標從 StartY 移到 TargetY，但進度由 easingValue 決定
    currentTextY = lerp(textStartY, textTargetY, easingValue);
  }

  // --------------------- 繪製置中文字：淡江大學 (使用 Rampart One) ---------------------
  fill(255); 
  textSize(width * 0.06);
  // 核心：設定為 Rampart One 字體
  textFont('Rampart One'); 
  
  // 使用動畫計算出的 Y 座標
  text("淡江大學", width / 2, currentTextY); 
  // -----------------------------------------------------------

  if (frameCount % int(random([15, 30])) == 0) {
    let addNum = int(random(1, 30));
    for (let i = 0; i < addNum; i++) {
      objs.push(new DynamicShape());
    }
  }
  for (let i = objs.length - 1; i >= 0; i--) {
    if (objs[i].isDead) {
      objs.splice(i, 1);
    }
  }
}

function windowResized() {
  // 讓畫布尺寸隨視窗調整
  resizeCanvas(windowWidth, windowHeight);
  cnv.position((windowWidth - width) / 2, (windowHeight - height) / 2);

  // 更新文字動畫目標位置
  textTargetY = height / 2;
  
  // 如果動畫已經完成，則將文字位置設為新的中央位置
  if (textAnimElapsed >= textAnimDuration) {
    currentTextY = textTargetY;
  }
}

function easeInOutExpo(x) {
  return x === 0 ? 0 :
    x === 1 ?
    1 :
    x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 :
    (2 - Math.pow(2, -20 * x + 10)) / 2;
}

class DynamicShape {
  constructor() {
    this.x = random(0.3, 0.7) * width;
    this.y = random(0.3, 0.7) * height;
    this.reductionRatio = 1;
    this.shapeType = int(random(4));
    this.animationType = 0;
    this.maxActionPoints = int(random(2, 5));
    this.actionPoints = this.maxActionPoints;
    this.elapsedT = 0;
    this.size = 0;
    // 粒子的最大尺寸也會隨著畫布寬度調整
    this.sizeMax = width * random(0.01, 0.05); 
    this.fromSize = 0;
    this.init();
    this.isDead = false;
    this.clr = random(colors);
    this.changeShape = true;
    this.ang = int(random(2)) * PI * 0.25;
    this.lineSW = 0;
  }

  show() {
    push();
    translate(this.x, this.y);
    if (this.animationType == 1) scale(1, this.reductionRatio);
    if (this.animationType == 2) scale(this.reductionRatio, 1);
    fill(this.clr);
    stroke(this.clr);
    strokeWeight(this.size * 0.05);
    if (this.shapeType == 0) {
      noStroke();
      circle(0, 0, this.size);
    } else if (this.shapeType == 1) {
      noFill();
      circle(0, 0, this.size);
    } else if (this.shapeType == 2) {
      noStroke();
      rect(0, 0, this.size, this.size);
    } else if (this.shapeType == 3) {
      noFill();
      rect(0, 0, this.size * 0.9, this.size * 0.9);
    } else if (this.shapeType == 4) {
      line(0, -this.size * 0.45, 0, this.size * 0.45);
      line(-this.size * 0.45, 0, this.size * 0.45, 0);
    }
    pop();
    strokeWeight(this.lineSW);
    stroke(this.clr);
    line(this.x, this.y, this.fromX, this.fromY);
  }

  move() {
    let n = easeInOutExpo(norm(this.elapsedT, 0, this.duration));
    if (0 < this.elapsedT && this.elapsedT < this.duration) {
      if (this.actionPoints == this.maxActionPoints) {
        this.size = lerp(0, this.sizeMax, n);
      } else if (this.actionPoints > 0) {
        if (this.animationType == 0) {
          this.size = lerp(this.fromSize, this.toSize, n);
        } else if (this.animationType == 1) {
          this.x = lerp(this.fromX, this.toX, n);
          this.lineSW = lerp(0, this.size / 5, sin(n * PI));
        } else if (this.animationType == 2) {
          this.y = lerp(this.fromY, this.toY, n);
          this.lineSW = lerp(0, this.size / 5, sin(n * PI));
        } else if (this.animationType == 3) {
          if (this.changeShape == true) {
            this.shapeType = int(random(5));
            this.changeShape = false;
          }
        }
        this.reductionRatio = lerp(1, 0.3, sin(n * PI));
      } else {
        this.size = lerp(this.fromSize, 0, n);
      }
    }

    this.elapsedT++;
    if (this.elapsedT > this.duration) {
      this.actionPoints--;
      this.init();
    }
    if (this.actionPoints < 0) {
      this.isDead = true;
    }
  }

  run() {
    this.show();
    this.move();
  }

  init() {
    this.elapsedT = 0;
    this.fromSize = this.size;
    this.toSize = this.sizeMax * random(0.5, 1.5);
    this.fromX = this.x;
    this.toX = this.fromX + (width / 10) * random([-1, 1]) * int(random(1, 4));
    this.fromY = this.y;
    this.toY = this.fromY + (height / 10) * random([-1, 1]) * int(random(1, 4));
    this.animationType = int(random(3));
    this.duration = random(20, 50);
  }
}