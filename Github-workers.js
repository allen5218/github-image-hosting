// 获取环境变量
const githubToken = GITHUB_TOKEN;
const repo = REPO;
const branch = BRANCH;
const filePath = FILE_PATH;

// 监听 fetch 事件
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

// 处理请求的函数
async function handleRequest(request) {
  const { pathname } = new URL(request.url);

  if (pathname === '/') {
    return handleRootRequest(); // 返回 HTML 页面
  } else if (pathname === '/upload' && request.method === 'POST') {
    return handleUploadRequest(request); // 处理文件上传请求
  } else {
    return new Response('Not Found', { status: 404 });
  }
}

// 处理根路径请求的函数，返回 HTML 页面
function handleRootRequest() {
  const html = `
  <!DOCTYPE html>
  <html lang="zh-CN"
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover">
  <meta name="description" content="GitHub图床-基于Cloudflare Workers">
  <meta name="keywords" content="GitHub图床,Workers图床, Cloudflare, Workers,GitHub, 图床">
  <title>GitHub图床</title>
  <link rel="icon" href="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iNDguMDAwMDAwcHQiIGhlaWdodD0iNDguMDAwMDAwcHQiIHZpZXdCb3g9IjAgMCA0OC4wMDAwMDAgNDguMDAwMDAwIgogcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCI+Cgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCw0OC4wMDAwMDApIHNjYWxlKDAuMTAwMDAwLC0wLjEwMDAwMCkiCmZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSI+CjxwYXRoIGQ9Ik04MCA0MDUgbDAgLTM1IDY1IDAgNjUgMCAwIC0xNzUgMCAtMTc1IDM1IDAgMzUgMCAwIDE3NSAwIDE3NSA2NSAwCjY1IDAgMCAzNSAwIDM1IC0xNjUgMCAtMTY1IDAgMCAtMzV6Ii8+CjwvZz4KPC9zdmc+Cg==" type="image/x-icon">
  <!-- Twitter Bootstrap CSS（替换为BootCDN） -->
  <link href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/4.6.1/css/bootstrap.min.css" type="text/css" rel="stylesheet" />
  <!-- Bootstrap FileInput CSS（替换为jsDelivr） -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-fileinput@5.2.7/css/fileinput.min.css" type="text/css" rel="stylesheet" />
  <!-- Toastr CSS（替换为BootCDN） -->
  <link href="https://cdn.bootcdn.net/ajax/libs/toastr.js/2.1.4/toastr.min.css" type="text/css" rel="stylesheet" />
  <!-- jQuery（替换为BootCDN） -->
  <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js" type="application/javascript"></script>
  <!-- Bootstrap FileInput JS（替换为jsDelivr） -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap-fileinput@5.2.7/js/fileinput.min.js" type="application/javascript"></script>
  <!-- Bootstrap FileInput Chinese Locale JS（替换为jsDelivr） -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap-fileinput@5.2.7/js/locales/zh.min.js" type="application/javascript"></script>
  <!-- Toastr JS（替换为BootCDN） -->
  <script src="https://cdn.bootcdn.net/ajax/libs/toastr.js/2.1.4/toastr.min.js" type="application/javascript"></script> 
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Long+Cang&display=swap');
      
      .title {
          font-family: "Long Cang", cursive;
          font-weight: 400;
          font-style: normal;
          font-size: 2em; /* 调整字体大小 */
          text-align: center;
          margin-top: 20px; /* 调整距离顶部的距离 */
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* 添加阴影效果 */
      }
      
      /* 日间模式和夜间模式的样式 */
      .day-mode {
          background-color: #ffffff;
          color: #000000;
      }
  
      .night-mode {
          background-color: #2c2c2c;
          color: #f5f5f5;
      }
  
      /* 按钮样式 */
      .mode-toggle {
          position: fixed;
          top: 10px;
          right: 10px;
          background-color: transparent;
          border: none;
          font-size: 1.5em;
          cursor: pointer;
          z-index: 1000;
      }
  
      /* 应用到整个页面的背景和文字颜色 */
      body.night-mode {
          background-color: #2c2c2c;
          color: #f5f5f5;
      }
  
      body.day-mode {
          background-color: #ffffff;
          color: #000000;
      }
  
      /* 强制覆盖默认样式，确保在两种模式下都能应用 */
      .card,
      .card-body,
      .form-group,
      textarea,
      select,
      input[type="file"],
      button {
          background-color: inherit;
          color: inherit;
          border-color: inherit;
      }
  
      .card {
          box-shadow: none;
          border: none;
      }
      /* 为其他元素定义样式 */
.card, .card-body, .form-group, textarea, select, input[type="file"], button {
    /* 默认样式 */
    background-color: inherit;
    color: inherit;
    border-color: inherit;
}

/* 特定元素在夜间模式下的样式 */
body.night-mode .card,
body.night-mode .card-body,
body.night-mode .form-group,
body.night-mode textarea,
body.night-mode select,
body.night-mode input[type="file"],
body.night-mode button {
    background-color: #333333;
    color: #ffffff;
    border-color: #555555;
}
:root {
  --background-color: #ffffff;
  --text-color: #000000;
  --border-color: #cccccc;
}

body.day-mode {
  --background-color: #ffffff;
  --text-color: #000000;
  --border-color: #cccccc;
}

body.night-mode {
  --background-color: #2c2c2c;
  --text-color: #f5f5f5;
  --border-color: #555555;
}

.card, .card-body, .form-group, textarea, select, input[type="file"], button {
  background-color: var(--background-color);
  color: var(--text-color);
  border-color: var(--border-color);
}

#fileLink {
  background-color: var(--background-color);
  color: var(--text-color);
  border-color: var(--border-color);
}

      </style>
  </head>
  <body class="day-mode">
      <!-- 模式切换按钮 -->
      <button class="mode-toggle" id="modeToggle">🌙</button>
      <div class="card">
          <div class="title">Hello GitHub图床</div>
          <div class="card-body">
              <!-- 表单 -->
              <form id="uploadForm" action="/upload" method="post" enctype="multipart/form-data">
                  <!-- 接口选择下拉菜单 -->
                  <div class="form-group mb-3">
                      <select class="custom-select" id="interfaceSelector" name="interface">
                          <option value="tg">GitHub</option>
                      </select>
                  </div>
                  <!-- 文件选择 -->
                  <div class="form-group mb-3">
                      <input id="fileInput" name="file" type="file" class="form-control-file" data-browse-on-zone-click="true">
                  </div>            
                  <!-- 添加按钮组 -->
                  <div class="form-group mb-3" style="display: none;"> <!-- 初始隐藏 -->
                      <button type="button" class="btn btn-light mr-2" id="urlBtn">URL</button>
                      <button type="button" class="btn btn-light mr-2" id="bbcodeBtn">BBCode</button>
                      <button type="button" class="btn btn-light" id="markdownBtn">Markdown</button>
                  </div>
                  <!-- 文件链接文本框 -->
                  <div class="form-group mb-3" style="display: none;"> <!-- 初始隐藏 -->
                      <textarea class="form-control" id="fileLink" readonly></textarea>
                  </div>
                  <!-- 上传中的提示 -->
                  <div id="uploadingText" style="display: none; text-align: center;">文件上传中...</div>
                  <!-- 压缩中的提示 -->
                  <div id="compressingText" style="display: none; text-align: center;">图片压缩中...</div>
              </form>
          </div>
          <p style="font-size: 14px; text-align: center; position: fixed; bottom: 0; width: 100%; padding: 10px 0; solid #ccc;">
              一叶知秋-魏无羡 GitHub - <a href="https://github.com/2091k/GitHub-image-hosting" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: none;">2091k/GitHub-image-hosting</a>
          </p>
      </div> 
<script>
$(document).ready(function() {
  // 检查本地存储中是否有模式选择
  if (localStorage.getItem('mode') === 'night') {
      $('body').addClass('night-mode').removeClass('day-mode');
      $('#modeToggle').text('🌙');
  } else {
      $('body').addClass('day-mode').removeClass('night-mode');
      $('#modeToggle').text('🌞');
  }
  // 模式切换逻辑
  $('#modeToggle').on('click', function() {
      $('body').toggleClass('night-mode day-mode');

      // 切换按钮图标
      if ($('body').hasClass('night-mode')) {
          $(this).text('🌙');
          localStorage.setItem('mode', 'night');
      } else {
          $(this).text('🌞');
          localStorage.setItem('mode', 'day');
      }

      // 强制更新所有相关元素的样式
      $('.card, .card-body, .form-group, textarea, select, input[type="file"], button').css({
          'background-color': $('body').css('background-color'),
          'color': $('body').css('color'),
          'border-color': $('body').css('border-color')
        });
  });

  // 初始化文件上传 
  initFileInput();
  
  // 文件上传初始化函数
  function initFileInput() {
    $("#fileInput").fileinput({
      theme: 'fa',
      language: 'zh',
      dropZoneEnabled: true,
      browseOnZoneClick: true,
      dropZoneTitle: "拖拽或粘贴文件到这里...",
      dropZoneClickTitle: "",
      browseClass: "btn btn-light",
      uploadClass: "btn btn-light",
      removeClass: "btn btn-light",
      showUpload: false,
      layoutTemplates: {
        actionZoom: '',
      },
    }).on('filebatchselected', handleFileSelection)
      .on('fileclear', handleFileClear);
  }

  // 配置接口信息
  const interfaceConfig = {
    tg: {
      acceptTypes: 'image/gif,image/jpeg,image/jpg,image/png,video/mp4',
      gifAndVideoMaxSize: 5 * 1024 * 1024, // GIF 和视频文件的最大大小为 5MB
      otherMaxSize: 5 * 1024 * 1024, // 非 GIF 和视频文件的最大大小为 5MB
      compressImage: false //默认开启压缩
    },
    // 添加其他接口的配置信息
  };
  
  // 处理接口选择器变更事件  
  $('#interfaceSelector').change(function() {
    const selectedInterface = $(this).val();
    const interfaceInfo = interfaceConfig[selectedInterface];
    
    if (interfaceInfo) {
      $('#fileInput').attr('accept', interfaceInfo.acceptTypes);
    }
  }).trigger('change');
  
  // 处理文件选择事件  
  async function handleFileSelection() {
      const file = $('#fileInput')[0].files[0];
  
      if (file) {
          await uploadFile(file);
      }
  }

  // 处理上传文件函数
  async function uploadFile(file) {
      try {
          const selectedInterface = $('#interfaceSelector').val();
          const interfaceInfo = interfaceConfig[selectedInterface];
          
          if (!interfaceInfo) {
            console.error('未找到接口配置信息');
            return;
          }
  
          if (['image/gif', 'video/mp4'].includes(file.type)) {
              if (file.size > interfaceInfo.gifAndVideoMaxSize) {
                  toastr.error('文件必须≤' + interfaceInfo.gifAndVideoMaxSize / (1024 * 1024) + 'MB');
                  return;
              }
              // 不压缩，直接上传原文件
          } else {
              if (interfaceInfo.compressImage === true) {
                  const compressedFile = await compressImage(file);
                  file = compressedFile;
              } else if (interfaceInfo.compressImage === false) {
                  if (file.size > interfaceInfo.otherMaxSize) {
                      toastr.error('文件必须≤' + interfaceInfo.otherMaxSize / (1024 * 1024) + 'MB');
                      return;
                  }
                  // 不压缩，直接上传原文件
              }
          }
  
          $('#uploadingText').show();
          const formData = new FormData($('#uploadForm')[0]);
          formData.set('file', file, file.name);
          const uploadResponse = await fetch('/upload', { method: 'POST', body: formData });
          originalImageURL = await handleUploadResponse(uploadResponse);
          $('#fileLink').val(originalImageURL);
          $('.form-group').show();
          adjustTextareaHeight($('#fileLink')[0]);
      } catch (error) {
          console.error('上传文件时出现错误:', error);
          $('#fileLink').val('文件上传失败！');
      } finally {
          $('#uploadingText').hide();
      }
  }

  // 处理上传响应函数
  async function handleUploadResponse(response) {
    if (response.ok) {
      const result = await response.json();
      return result.data;
    } else {
      return '文件上传失败！';
    }
  }

  // 监听粘贴事件
  $(document).on('paste', function(event) {
      // 获取粘贴板中的内容
      const clipboardData = event.originalEvent.clipboardData;
      if (clipboardData && clipboardData.items) {
          // 遍历粘贴板中的项
          for (let i = 0; i < clipboardData.items.length; i++) {
              const item = clipboardData.items[i];
              // 如果是文件类型
              if (item.kind === 'file') {
                  const pasteFile = item.getAsFile();
                  // 上传粘贴的文件
                  uploadFile(pasteFile);
                  break; // 处理完第一个文件即可
              }
          }
      }
  });

  //处理图片压缩事件
  async function compressImage(file, quality = 0.5, maxResolution = 20000000) {
    $('#compressingText').show();
  
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        const width = image.width;
        const height = image.height;  
        const resolution = width * height;  
        let scale = 1;
        if (resolution > maxResolution) {
          scale = Math.sqrt(maxResolution / resolution);
        }  
        const targetWidth = Math.round(width * scale);
        const targetHeight = Math.round(height * scale);  
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');  
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        ctx.drawImage(image, 0, 0, targetWidth, targetHeight); 
        canvas.toBlob((blob) => {
          const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
          $('#compressingText').hide();
          resolve(compressedFile);
        }, 'image/jpeg', quality);
      };  
      const reader = new FileReader();
      reader.onload = (event) => {
        image.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
  
  // 处理按钮点击事件 
  $('#urlBtn, #bbcodeBtn, #markdownBtn').on('click', function() {
    const fileLink = originalImageURL.trim();
    if (fileLink !== '') {
      let formattedLink;
      switch ($(this).attr('id')) {
        case 'urlBtn':
          formattedLink = fileLink;
          break;
        case 'bbcodeBtn':
          formattedLink = '[img]' + fileLink + '[/img]';
          break;
        case 'markdownBtn':
          formattedLink = '![image](' + fileLink + ')';
          break;
        default:
          formattedLink = fileLink;
      }
      $('#fileLink').val(formattedLink);
      adjustTextareaHeight($('#fileLink')[0]);
      copyToClipboardWithToastr(formattedLink);
    }
  });
  
  // 处理移除按钮点击事件 
  function handleFileClear(event) {
    $('#fileLink').val('');
    adjustTextareaHeight($('#fileLink')[0]);
    hideButtonsAndTextarea();
  }
  
  // 自动调整文本框高度函数
  function adjustTextareaHeight(textarea) {
    textarea.style.height = '1px';
    textarea.style.height = (textarea.scrollHeight) + 'px';
  }
  
  // 复制文本到剪贴板，并显示 toastr 提示框 
  function copyToClipboardWithToastr(text) {
    const input = document.createElement('input');
    input.setAttribute('value', text);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    toastr.success('已复制到剪贴板', '', { timeOut: 300 });
  }
  
  // 隐藏按钮和文本框
  function hideButtonsAndTextarea() {
    $('#urlBtn, #bbcodeBtn, #markdownBtn, #fileLink').parent('.form-group').hide();
  }
  
});

</script>

</body>
</html>
    `;
    return new Response(html, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
  }
  
// 处理上传请求的函数
async function handleUploadRequest(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      throw new Error('Missing file');
    }

    const originalFileName = file.name;
    const fileExtension = originalFileName.split('.').pop();

    // 获取当前时间并转换为北京时间 (UTC+8)
    const now = new Date();
    const utcOffset = 8 * 60; // 北京时间为 UTC+8
    now.setMinutes(now.getMinutes() + utcOffset);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}`;

    // 生成10位随机小写字母
    const randomString = Math.random().toString(36).substring(2, 12);

    const fileName = `${formattedDate}_${randomString}.${fileExtension}`;

    // 1. 检查文件是否已经存在
    const checkUrl = `https://api.github.com/repos/${repo}/contents/${filePath}${fileName}?ref=${branch}`;
    const checkResponse = await fetch(checkUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Cloudflare Worker'
      }
    });

    // 2. 准备上传文件
    const fileStream = file.stream();
    const reader = fileStream.getReader();
    let fileContent = '';
    let done = false;

    // Convert file content to base64 in chunks
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        fileContent += String.fromCharCode(...new Uint8Array(value));
      }
    }

    const base64Content = btoa(fileContent);
    const uploadUrl = `https://api.github.com/repos/${repo}/contents/${filePath}${fileName}`;

    const uploadData = {
      message: `上传图片: ${fileName}`,
      content: base64Content,
      branch: branch
    };

    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Cloudflare Worker'
      },
      body: JSON.stringify(uploadData)
    });

    const responseText = await uploadResponse.text();
    const jsonResponse = JSON.parse(responseText);

    if (uploadResponse.ok) {
      // 下面链接替换成你自己的加速域名https://raw.githubusercontent.com/
      const imageUrl = `https://raw.githubusercontent.com/${repo}/${branch}/${filePath}${fileName}`;
      return new Response(JSON.stringify({ data: imageUrl }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      console.error('GitHub upload failed:', responseText);
      return new Response(JSON.stringify({ error: 'GitHub upload failed', details: responseText }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Internal Server Error:', error.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error', message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
