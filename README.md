# 图床[GitHub-image-hosting](https://github.com/2091k/GitHub-image-hosting)
### 2024.8.31号更新

> 添加暗夜模式，修复网页刷新变回白天模式，修改上传图片名称改为时间格式YYYYMMDDHHMMSS_10位随机字母

<img src="https://img.oo.me.eu.org/2091k/image/main/001/20240831190329.png" style="width: 50%;"/><img src="https://img.oo.me.eu.org/2091k/image/main/001/20240831190411.png" style="width: 50%;"/> 

####  这是一个[CloudFlare workers](https://github.com/2091k/GitHub-image-hosting)图床项目
用于网页端直接上传图片到GitHub的项目仓库中

初衷是看到Telegraph-Image项目，他是把图片上传到TG了，上传到哪不知道，这样就没有安全感

搜遍全网关于GitHub图床的都是需要电脑下载软件，填写token，我觉得很不方便，所以就有了这个项目

关于html代码部分是借用别人的，上传部分为ChatGPT反复修改而成，结合token，实现网页上传

URL链接采用 CF workers CDN 加速，方便国内访问 图床请勿滥用

`CF workers加速CDN代码在dm/workers.js,也是部署CF workers方法，绑定自己的域名，使用方法https://xxx.wokers.dev/替换https://raw.githubusercontent.com  代码544行`

关于界面问题，有能力的大佬可以优化更加美观一些，我这能力有限

### 1.获取GitHub的token [https://github.com/settings/tokens/new](https://github.com/settings/tokens/new)
  
`注意:token只在新建时能看到，自己保存好，给token仓库的读写权限`

### 2.在GitHub新建一个仓库（设为公开），比如新建一个img仓库,再在仓库里新建一个文件夹001用于存放上传的图片
  
  `在项目设置里Pages选main /root保存`
  
  ![image](https://img.oo.me.eu.org/2091k/image/main/001/微信截图_20240830132440.png)

### 3.去CloudFlare新建一个workers，名称自己随便，先设置环境变量

  
<b>变量名称</b> | <b>值</b>
-------- | -----
BRANCH    |  main
FILE_PATH  |  存放图片的文件夹
GITHUB_TOKEN  | 你得GitHub token
REPO          |  你得GitHub名称和仓库名称

![image](https://img.oo.me.eu.org/2091k/image/main/001/20240830113523.png)
  
### 4.填好变量后把Github-workers里的代码复制到CloudFlare workers里，在代码544行把https://raw.githubusercontent.com  替换成你自己的加速域名，就完成了

![image](https://img.oo.me.eu.org/2091k/image/main/001/20240830113133.png)

  
### 5.绑定好自己的域名就好了[https://imges.oo.me.eu.org/](https://imges.oo.me.eu.org/)

## 示例:
https://img.oo.me.eu.org/2091k/image/main/001/1921550UIjR.jpg

![image](https://img.oo.me.eu.org/2091k/image/main/001/1921550UIjR.jpg)

https://img.oo.me.eu.org/2091k/image/main/001/003141Q4m3j.jpg

![image](https://img.oo.me.eu.org/2091k/image/main/001/003141Q4m3j.jpg)

https://img.oo.me.eu.org/2091k/image/main/001/232736kbzxa.jpg

![image](https://img.oo.me.eu.org/2091k/image/main/001/232736kbzxa.jpg)



### 感谢支持
<img src="https://img.oo.me.eu.org/2091k/image/main/001/20240830141210.png" width="80%" />
