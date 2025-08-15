# GitHub + Cloudflare Worker 免費圖床
這是一個基於 Cloudflare Workers 和 GitHub API 打造的免費、高速、穩定的個人圖床解決方案。您可以透過簡單的設定，將您的 GitHub 公開倉庫變成一個擁有 CDN 加速的無限容量圖床。

##  ✨ 功能特性
- 完全免費：利用 Cloudflare Workers 和 GitHub 的免費額度，無需任何伺服器費用。

- 高速 CDN 加速：整合 jsDelivr 全球 CDN，無論使用者在哪裡都能秒速載入圖片。

- 無限容量：基於 GitHub 倉庫儲存，只要您的倉庫容量沒滿，就能一直上傳。

- 簡易操作：提供現代化的網頁介面，支援拖曳、貼上、點擊上傳。

- 自訂網域：可輕鬆綁定您自己的網域，讓圖床連結更具專業性。

- 多種連結格式：一鍵生成 URL、BBCode、Markdown 格式的圖片連結，方便在各種論壇和部落格中使用。

- 主題切換：內建日間/夜間模式，保護您的眼睛。

- 安全可靠：程式碼完全由您掌控，圖片儲存在您自己的倉庫，不用擔心第三方圖床跑路。

##  🚀 部署指南
部署過程非常簡單，只需要幾個步驟即可完成。

###  前置準備
- 一個 GitHub 帳號。

- 一個 Cloudflare 帳號。

###  步驟一：建立 GitHub Personal Access Token

您需要一個 GitHub Token 來讓 Worker 有權限上傳檔案到您的倉庫。

前往 GitHub 的 Personal access tokens (classic) 頁面。

點擊 Generate new token，選擇 Generate new token (classic)。

Note 欄位填寫一個方便您辨識的名稱，例如 Cloudflare-Worker-Uploader。

Expiration 選擇 No expiration (無期限)，或您偏好的效期。

Select scopes 中，務必勾選 repo 這個權限。

點擊頁面最下方的 Generate token。

請務必立即複製並妥善保存產生的 Token，因為這個頁面關閉後就再也看不到了。

###  步驟二：建立一個用於儲存圖片的 GitHub 倉庫

在 GitHub 上建立一個新的公開 (Public) 倉庫。倉庫名稱可以自訂，例如 image-hosting 或 my-images。

倉庫建立後，記下您的「使用者名稱/倉庫名稱」，例如 xxxx/img。

###  步驟三：部署到 Cloudflare Workers

登入 Cloudflare 儀表板，進入 Workers & Pages。

點擊 Create Worker > Start with Hello World!

為您的 Worker 自訂一個名稱，然後點擊 Deploy。

部署成功後，點擊 Edit code。

將本專案提供的 worker.js 程式碼完整複製並貼到左側的程式碼編輯區，取代原有的內容。

點擊右上角的 Save and deploy。

###  步驟四：設定環境變數

這是最關鍵的一步，讓 Worker 知道要把圖片上傳到哪裡。

回到 Worker 的管理頁面，點擊 Settings > Variables。

在 Environment Variables 區塊，點擊 Add variable，並依序新增以下四個變數：
<b>變量名稱</b> | <b>值</b>
-------- | -----
BRANCH    |  main
FILE_PATH  |  存放圖片的文件夾
GITHUB_TOKEN  | 你得GitHub token
REPO          |  你得GitHub名稱和倉庫名稱

圖片儲存在倉庫中的資料夾路徑。建議以 / 結尾。如果想存放在根目錄，此欄位可留空。

設定完成後，點擊 Save and deploy。

###  步驟五 (可選)：綁定自訂網域

在 Worker 管理頁面，點擊 Triggers。

在 Custom Domains 區塊，點擊 Add Custom Domain。

輸入您想使用的子網域名稱 (例如 img.yourdomain.com) 並新增。Cloudflare 會自動幫您處理 DNS 設定。

恭喜！ 現在您可以透過 Worker 的網址或您的自訂網域來訪問您的專屬圖床了。

##🛠️ 使用方式

上傳：直接將圖片檔案拖曳到上傳區域，或點擊「瀏覽」按鈕選擇檔案，也可以直接從剪貼簿貼上圖片。

複製連結：上傳成功後，會自動顯示圖片的 CDN 連結。您可以點擊 URL、BBCode、Markdown 按鈕來切換格式並自動複製到剪貼簿。

##🙏 致謝
本專案基於 2091k/GitHub-image-hosting 進行修改與優化。
