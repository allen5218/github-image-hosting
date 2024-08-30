# GitHub-image-hosting
####  这是一个CloudFlare workers图床项目
用于网页端直接上传图片到GitHub的项目仓库中

初衷是看到Telegraph-Image项目，他是把图片上传到TG了，上传到哪不知道，这样就没有安全感

搜遍全网关于GitHub图床的都是需要电脑下载软件，填写token，我觉得很不方便，所以就有了这个项目

关于html代码部分是借用别人的，上传部分为ChatGPT反复修改而成，结合token，实现网页上传

### 1.获取GitHub的token [https://github.com/settings/tokens/new](https://github.com/settings/tokens/new)
`注意:token只在新建时能看到，自己保存好，给token仓库的读写权限`

### 2.在GitHub新建一个仓库，比如新建一个IMG出库,再在仓库里新建一个文件夹001用于存放上传的图片

### 3.去CloudFlare新建一个workers，名称自己随便，把项目面里的github-workers代码复制到CloudFlare workers里
