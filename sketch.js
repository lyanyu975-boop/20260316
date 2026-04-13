let inputElement, sliderElement, btnElement, selectElement, radioElement, iframeElement, colorPicker;
let isJumping = false; // 用來控制是否跳動的變數

function setup() {
  // Create a canvas that fills the window
  createCanvas(windowWidth, windowHeight);
  
  // 1. 建立文字輸入框 (Create text input)
  inputElement = createInput('Hello'); 
  inputElement.position(20, 20); // Position the input box at top-left
  inputElement.size(200, 50); // 設定文字輸入框的寬度為 200px，高度為 50px

  // 加入滑桿可以改變文字大小，範圍為15到80
  sliderElement = createSlider(15, 80, 30);
  sliderElement.position(240, 35);

  // 產生一個按鈕在文字框的右邊
  btnElement = createButton('跳動');
  btnElement.position(380, 35);
  btnElement.mousePressed(toggleJump);

  // 下拉式選單，選單中有三個超連結網站網址
  selectElement = createSelect();
  selectElement.position(440, 35);
  selectElement.option('淡江大學', 'https://www.tku.edu.tw');
  selectElement.option('維基百科', 'https://zh.wikipedia.org');
  selectElement.option('教育部', 'https://www.edu.tw/Default.aspx');
  selectElement.changed(updateIframe);

  // 在下拉式選單右邊加上選鈕
  radioElement = createRadio();
  radioElement.position(550, 35);
  radioElement.option('一般性');
  radioElement.option('旋轉');
  radioElement.option('大小');
  radioElement.selected('一般性'); // 預設選項
  radioElement.style('background-color', 'white'); // 增加背景色確保可見

  // 產生顏色選擇器
  colorPicker = createColorPicker('#000000');
  colorPicker.position(780, 35);

  // 產生一個DIV(iframe)，位於整個視窗的中間，與視窗四周有個200pix的內距
  iframeElement = createElement('iframe');
  iframeElement.position(200, 200);
  iframeElement.size(windowWidth - 400, windowHeight - 400);
  iframeElement.attribute('src', 'https://www.tku.edu.tw');
}

function draw() {
  background(220); // Clear background each frame
  
  // 設定文字顏色
  fill(colorPicker.value());
  
  // 2. 設定文字大小 (Set text size from slider)
  textSize(sliderElement.value());
  
  let content = inputElement.value();
  let w = textWidth(content) + 20; // 文字水平間距
  if (w < 20) w = 20; // 避免文字為空時造成無窮迴圈

  let mode = radioElement.value(); // 取得目前的模式

  // 3. 顯示文字 (從座標y為100開始，產生整個視窗的文字，排與排間間隔為50px)
  for (let y = 100; y < height; y += 50) {
    // 計算跳動的位移量
    let dy = 0;
    if (isJumping) {
      // 使用 sin 函數產生波動，加入 y 讓每一排相位不同
      dy = sin(frameCount * 0.1 + y * 0.05) * 10; 
    }

    for (let x = 0; x < width; x += w) {
      push(); // 儲存當前繪圖狀態
      
      // 移動座標原點到文字位置 (包含跳動位移)
      translate(x, y + dy);

      // 根據選單模式執行不同特效
      if (mode === '旋轉') {
        // 文字以左邊為基準 (0,0)，做-90度轉到90度
        let angle = map(sin(frameCount * 0.05), -1, 1, -HALF_PI, HALF_PI);
        rotate(angle);
      } else if (mode === '大小') {
        // 文字從現有的文字大小變大30%，然後又恢復原本大小
        let s = map(sin(frameCount * 0.1), -1, 1, 1, 1.3);
        scale(s);
      }
      
      // 因為使用了 translate，這裡座標設為 0, 0
      text(content, 0, 0); 
      
      pop(); // 恢復繪圖狀態
    }
  }
}

// 按下按鈕的事件處理函式
function toggleJump() {
  isJumping = !isJumping;
}

// 下拉選單改變時的事件處理函式
function updateIframe() {
  let url = selectElement.value();
  iframeElement.attribute('src', url);
}
