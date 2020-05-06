# EHD 项目框架

EHD 项目是基于 cordova 框架开发的跨平台 App，可编译至 android, ios, web 等平台。cordova 是一个跨平台开发框架，通过插件来提供原生能力，ui 和逻辑部分通过 typescript 实现。

# 环境安装

以下以 mac 电脑为例，介绍本项目的环境安装过程。如果是其他系统，请上网查询相关软件的安装方式

1. node。请直接前往[Node 官网](https://nodejs.org/en/download/)下载对应的安装包来安装。
   安装完成以后，可在终端运行

```
	node -v
	npm -v
```

来测试是否安装成功。

2. ionic, cordova 的安装

```
    npm install -g ionic@latest
    npm install -g cordova@latest
```

3. ethereumjs-tx 2.0可能会有bug，需要安装1.3.7版本

```
    npm install ethereumjs-tx@1.3.7
```

安装成功后，

```
    ionic -v
    cordova -v
```

应当可以正确显示版本号。

3. Android Studio 的安装。请前往[Android Studio 官网](https://developer.android.com/studio/?&gclid=EAIaIQobChMI4Zegt8nj5QIVjamWCh38FQLjEAAYASAAEgL6Q_D_BwE)下载并安装，打开后，点击菜单 Tools => SDK Manager，下载并安装 Android-28 的 SDK。

4. Xcode 的安装，直接在应用商店搜索 xcode 即可。

# 工程调试

工程调试包括 web, android, ios。

## 基于 web 的调试

运行 ionic serve，会自动在浏览器中打开链接，并且所有改动会热更新到浏览器上，无需手动刷新。

> 由于目前后端接口未配置跨域，因此前端访问需关闭 chrome 的安全设置。具体方式为先彻底退出 chrome，然后用 **_ open -a "Google Chrome" --args --disable-web-security --user-data-dir _** 的命令行方式启动

## 基于 Android Studio 的调试

如果需要调试插件，则要使用原生调试。工程添加和编译的命令如下：

```
    添加工程 ionic cordova platform add android@latest
    删除工程 ionic cordova platform rm android
    查看工程 ionic cordova platform ls
    编译工程 ionic cordova build android --prod --release
    运行到设备 ionic cordova run android
```

> 一般来说，发布工程的 release 版本需要自动签名，目前已经包含了自动签名的信息，如果删除了工程后重新添加，务必把主工程目录下的 release-signing.properties 和 gmobbi.keystore 拷贝到 platforms/android 下

> 目前最新发布，谷歌要求 Android-28 以上，所以这里用 latest，或者直接指定 android@8.0.0 也可以

然后用 Android studio 打开项目目录下的工程目录，即 platforms/android 目录，即可进行 android 调试

## 基于 xcode 的调试

如果需要调试插件，则要使用原生调试。工程添加和编译的命令如下：

```
    添加工程 ionic cordova platform add ios@latest
    删除工程 ionic cordova platform rm ios
    查看工程 ionic cordova platform ls
    编译工程 ionic cordova prepare ios --prod
```

ios 的发布需要用到 xcode, 包括几种版本：

1. dev
   如果只是在本地调试，则直接用 xcode 打开工程，然后 run 到手机上即可。
2. 发布 ad-hoc。这时需要点击 xcode 的菜单 product->archieve，打包以后选择发布到 ad-hoc
3. 发布 appstore。2 生成的 archieve 在发布的时候选择 appstore 即可。
