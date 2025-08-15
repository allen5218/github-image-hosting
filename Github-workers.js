// =================================================
// GITHUB IMAGE HOSTING - CLOUDFLARE WORKER
// Author: 2091k
// Modified and fixed by Gemini
// =================================================

// --- 環境變數 ---
// 請在 Cloudflare Worker 的設定中配置以下變數
// GITHUB_TOKEN: 你的 GitHub Personal Access Token，需要有 repo 權限
// REPO: 你的 GitHub 倉庫，格式為 '使用者名稱/倉庫名稱'，例如 '2091k/GitHub-image-hosting'
// BRANCH: 你要儲存圖片的分支，例如 'main'
// FILE_PATH: 檔案儲存在倉庫中的路徑，記得以 '/' 結尾，例如 'images/' 或留空 '' 代表根目錄

// 監聽 fetch 事件
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

/**
 * 處理所有傳入的請求
 * @param {Request} request
 */
async function handleRequest(request) {
  const { pathname } = new URL(request.url);

  if (pathname === '/') {
    return handleRootRequest(); // 根路徑，返回 HTML 頁面
  } else if (pathname === '/upload' && request.method === 'POST') {
    return handleUploadRequest(request); // 處理檔案上傳請求
  } else {
    return new Response('Not Found', { status: 404 });
  }
}

/**
 * 處理根路徑請求，返回操作介面的 HTML
 */
function handleRootRequest() {
  const html = `
  <!DOCTYPE html>
  <html lang="zh-TW">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover">
    <meta name="description" content="GitHub 圖床 - 基於 Cloudflare Workers">
    <meta name="keywords" content="GitHub 圖床, Workers 圖床, Cloudflare, Workers, GitHub, 圖床">
    <title>GitHub 圖床</title>
    <link rel="icon" href="https://cdn.jsdelivr.net/gh/allen5218/img@main/img/20250815160508_stndghzmqg.ico" type="image/x-icon">
    
    <!-- 使用 cdnjs 和 jsdelivr 替換 CDN -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.1/css/bootstrap.min.css" rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-fileinput/5.5.2/css/fileinput.min.css" rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.css" rel="stylesheet" />
    
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Long+Cang&display=swap');
      
      :root {
        --bg-day: #ffffff;
        --text-day: #000000;
        --border-day: #dee2e6;
        --bg-night: #2c2c2c;
        --text-night: #f5f5f5;
        --border-night: #555555;
        --card-bg-night: #333333;
      }

      body {
        transition: background-color 0.3s, color 0.3s;
      }

      body.day-mode {
        background-color: var(--bg-day);
        color: var(--text-day);
      }
  
      body.night-mode {
        background-color: var(--bg-night);
        color: var(--text-night);
      }

      .title-container {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
      }

      .title-image {
        height: 7.5em; /* 放大三倍 */
        width: auto;
        filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
      }
      
      .card {
        background-color: transparent;
        border: none;
        box-shadow: none;
      }

      .mode-toggle {
        position: fixed;
        top: 15px;
        right: 15px;
        background-color: transparent;
        border: none;
        font-size: 1.8em;
        cursor: pointer;
        z-index: 1000;
        color: inherit;
      }

      /* 日間模式下的元件樣式 */
      body.day-mode .card-body,
      body.day-mode .form-control,
      body.day-mode .custom-select,
      body.day-mode .btn {
        background-color: var(--bg-day);
        color: var(--text-day);
        border-color: var(--border-day);
      }

      /* 夜間模式下的元件樣式 */
      body.night-mode .card-body,
      body.night-mode .form-control,
      body.night-mode .custom-select,
      body.night-mode .btn,
      body.night-mode .file-drop-zone {
        background-color: var(--card-bg-night) !important;
        color: var(--text-night) !important;
        border-color: var(--border-night) !important;
      }
      body.night-mode .file-drop-zone-title {
        color: #aaa !important;
      }
    </style>
  </head>
  <body>
      <!-- 模式切換按鈕 -->
      <button class="mode-toggle" id="modeToggle">🌙</button>
      
      <div class="container mt-4">
        <div class="card">
            <div class="title-container">
                <img src="https://cdn.jsdelivr.net/gh/allen5218/img@main/img/20250815155638_1pcaq6i75d.png" alt="GitHub 圖床標題" class="title-image">
            </div>
            <div class="card-body">
                <form id="uploadForm" action="/upload" method="post" enctype="multipart/form-data">
                    <div class="form-group mb-3">
                        <select class="custom-select" id="interfaceSelector" name="interface">
                            <option value="github">GitHub</option>
                        </select>
                    </div>
                    <div class="form-group mb-3">
                        <input id="fileInput" name="file" type="file" class="form-control-file">
                    </div>
                    <!-- 連結格式按鈕組 -->
                    <div id="formatButtons" class="form-group mb-3" style="display: none;">
                        <button type="button" class="btn btn-light mr-2" id="urlBtn">URL</button>
                        <button type="button" class="btn btn-light mr-2" id="bbcodeBtn">BBCode</button>
                        <button type="button" class="btn btn-light" id="markdownBtn">Markdown</button>
                    </div>
                    <!-- 檔案連結顯示區 -->
                    <div id="linkContainer" class="form-group mb-3" style="display: none;">
                        <textarea class="form-control" id="fileLink" readonly rows="1"></textarea>
                    </div>
                    <!-- 狀態提示 -->
                    <div id="statusText" style="display: none; text-align: center; margin-top: 10px;"></div>
                </form>
            </div>
        </div>
      </div>

    <!-- 使用 cdnjs 和 jsdelivr 替換 CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-fileinput/5.5.2/js/fileinput.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-fileinput/5.5.2/js/locales/zh-TW.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.js"></script>

<script>
$(document).ready(function() {
  let originalImageURL = ''; // 用於儲存原始 URL

  // --- 模式切換 ---
  function applyMode(mode) {
    if (mode === 'night') {
      $('body').addClass('night-mode').removeClass('day-mode');
      $('#modeToggle').text('🌞');
    } else {
      $('body').addClass('day-mode').removeClass('night-mode');
      $('#modeToggle').text('🌙');
    }
  }

  // 檢查本地儲存
  const savedMode = localStorage.getItem('mode') || 'day';
  applyMode(savedMode);

  // 模式切換按鈕點擊事件
  $('#modeToggle').on('click', function() {
    const isNight = $('body').hasClass('night-mode');
    const newMode = isNight ? 'day' : 'night';
    applyMode(newMode);
    localStorage.setItem('mode', newMode);
  });

  // --- FileInput 初始化 ---
  function initFileInput() {
    $("#fileInput").fileinput({
      language: 'zh-TW',
      dropZoneEnabled: true,
      browseOnZoneClick: true,
      dropZoneTitle: "拖曳或貼上檔案到這裡...",
      dropZoneClickTitle: "",
      browseClass: "btn btn-light",
      uploadClass: "btn btn-light",
      removeClass: "btn btn-light",
      showUpload: false,
      showPreview: false, // 隱藏預覽，簡化介面
      showCaption: true,
      layoutTemplates: {
        actionZoom: '',
      },
    }).on('filebatchselected', handleFileSelection)
      .on('fileclear', handleFileClear);
  }
  
  initFileInput();

  // --- 介面設定 ---
  const interfaceConfig = {
    github: {
      acceptTypes: 'image/gif,image/jpeg,image/jpg,image/png,video/mp4',
      maxSize: 10 * 1024 * 1024, // 所有檔案最大 10MB
    },
  };
  
  // 根據選擇的介面更新 fileinput 的設定
  $('#interfaceSelector').change(function() {
    const selectedInterface = $(this).val();
    const config = interfaceConfig[selectedInterface];
    if (config) {
      // 這裡可以根據不同介面更新設定，但目前只有一個，所以先保留
    }
  }).trigger('change');
  
  // --- 核心上傳邏輯 ---
  
  // 處理檔案選擇
  async function handleFileSelection(event, files) {
      if (files && files.length > 0) {
        await uploadFile(files[0]);
      }
  }

  // 處理檔案上傳
  async function uploadFile(file) {
    try {
      const selectedInterface = $('#interfaceSelector').val();
      const config = interfaceConfig[selectedInterface];
      
      if (!config) {
        toastr.error('未找到介面設定資訊');
        return;
      }

      if (file.size > config.maxSize) {
        toastr.error('檔案大小不能超過 ' + config.maxSize / (1024 * 1024) + 'MB');
        $("#fileInput").fileinput('clear');
        return;
      }

      showStatus('檔案上傳中...');
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/upload', { method: 'POST', body: formData });
      
      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || '上傳失敗');
      }

      const result = await response.json();
      originalImageURL = result.data;
      
      handleUploadSuccess(originalImageURL);

    } catch (error) {
      console.error('上傳錯誤:', error);
      handleUploadError(error.message);
    } finally {
      hideStatus();
    }
  }
  
  // 處理貼上事件
  $(document).on('paste', function(event) {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (const item of items) {
      if (item.kind === 'file') {
        const pasteFile = item.getAsFile();
        if (pasteFile) {
          uploadFile(pasteFile);
          // 更新 fileinput 的顯示
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(pasteFile);
          $('#fileInput')[0].files = dataTransfer.files;
          // 觸發 change 事件讓 fileinput 知道檔案已更新
          $('#fileInput').trigger('change');
          break;
        }
      }
    }
  });

  // --- UI 更新函式 ---
  function showStatus(message) {
    $('#statusText').text(message).show();
  }

  function hideStatus() {
    $('#statusText').hide();
  }
  
  function handleUploadSuccess(url) {
    $('#fileLink').val(url);
    $('#formatButtons, #linkContainer').show();
    adjustTextareaHeight($('#fileLink')[0]);
    toastr.success('上傳成功！');
  }

  function handleUploadError(errorMessage) {
    $('#fileLink').val('檔案上傳失敗！ ' + errorMessage);
    $('#formatButtons').hide();
    $('#linkContainer').show();
    adjustTextareaHeight($('#fileLink')[0]);
    toastr.error('上傳失敗: ' + errorMessage);
  }

  // 處理清除按鈕
  function handleFileClear() {
    originalImageURL = '';
    $('#fileLink').val('');
    $('#formatButtons, #linkContainer').hide();
  }
  
  // 處理格式按鈕點擊
  $('#urlBtn, #bbcodeBtn, #markdownBtn').on('click', function() {
    if (originalImageURL) {
      let formattedLink = originalImageURL;
      const id = $(this).attr('id');
      if (id === 'bbcodeBtn') {
        formattedLink = '[img]' + originalImageURL + '[/img]';
      } else if (id === 'markdownBtn') {
        formattedLink = '![image](' + originalImageURL + ')';
      }
      $('#fileLink').val(formattedLink);
      adjustTextareaHeight($('#fileLink')[0]);
      copyToClipboard(formattedLink);
    }
  });
  
  // --- 工具函式 ---
  
  // 自動調整 textarea 高度
  function adjustTextareaHeight(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
  }
  
  // 複製到剪貼簿
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
      toastr.success('已複製到剪貼簿');
    }, function(err) {
      toastr.error('複製失敗');
      console.error('複製失敗: ', err);
    });
  }
});
</script>

</body>
</html>
    `;
    return new Response(html, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
  }
  
/**
 * 處理檔案上傳請求並將其存儲到 GitHub
 * @param {Request} request
 */
async function handleUploadRequest(request) {
  try {
    // 檢查必要的環境變數是否存在
    // 這些變數由 Cloudflare Worker 的設定注入，可以直接使用
    if (typeof GITHUB_TOKEN === 'undefined' || GITHUB_TOKEN === '' || typeof REPO === 'undefined' || REPO === '') {
        throw new Error('缺少 GITHUB_TOKEN 或 REPO 環境變數，請在 Worker 設定中配置');
    }

    // 為非必要的環境變數提供預設值
    const branch = typeof BRANCH !== 'undefined' && BRANCH !== '' ? BRANCH : 'main';
    const filePath = typeof FILE_PATH !== 'undefined' ? FILE_PATH : '';

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      throw new Error('請求中找不到檔案');
    }

    const originalFileName = file.name;
    const fileExtension = originalFileName.split('.').pop();

    // 生成基於時間和隨機數的唯一檔名
    const now = new Date();
    const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
    const randomString = Math.random().toString(36).substring(2, 12);
    const fileName = `${timestamp}_${randomString}.${fileExtension}`;

    // 將檔案內容讀取為 ArrayBuffer，然後轉換為 Base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Content = arrayBufferToBase64(arrayBuffer);

    const uploadUrl = `https://api.github.com/repos/${REPO}/contents/${filePath}${fileName}`;

    const uploadData = {
      message: `feat: upload image ${fileName} by Cloudflare Worker`,
      content: base64Content,
      branch: branch
    };

    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Cloudflare-Worker-GitHub-Uploader'
      },
      body: JSON.stringify(uploadData)
    });

    const responseJson = await uploadResponse.json();

    if (uploadResponse.ok) {
      // 使用 jsDelivr CDN 加速連結
      const imageUrl = `https://cdn.jsdelivr.net/gh/${REPO}@${branch}/${filePath}${fileName}`;
      return new Response(JSON.stringify({ data: imageUrl }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      console.error('GitHub 上傳失敗:', responseJson);
      throw new Error(responseJson.message || 'GitHub API 錯誤');
    }
  } catch (error) {
    console.error('伺服器內部錯誤:', error.stack);
    return new Response(JSON.stringify({ error: '伺服器內部錯誤', message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 將 ArrayBuffer 轉換為 Base64 字串
 * @param {ArrayBuffer} buffer
 * @returns {string}
 */
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
