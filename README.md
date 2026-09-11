# 海上垂钓入口页

这是一个无需构建工具、可直接部署的静态网页。主场景由内联 SVG 绘制，鼠标移动时鱼钩会跟随，点击或键盘选中海里的鱼即可前往对应网站。

## 本地预览

直接用浏览器打开 `index.html` 即可。也可以在当前目录运行任意静态服务器，例如：

```powershell
python -m http.server 8080
```

然后访问 `http://localhost:8080/`。

## 新增一个跳转入口

编辑 `site-links.js`，在 `window.SITE_LINKS` 数组中增加一个对象：

```js
{
  id: "new-site",
  name: "新网站",
  url: "https://example.com/",
  target: "_self",
  colors: {
    body: "#79b8ff",
    light: "#d8ecff",
    accent: "#356ca8",
    glow: "rgba(121, 184, 255, 0.55)"
  },
  desktopPosition: [1120, 780],
  mobilePosition: [620, 790],
  scale: 0.9
}
```

字段说明：

- `id`：唯一名称，用于生成 `fish--<id>` 类名。
- `name`：鼠标悬停、键盘聚焦和页面底部快捷链接中显示的名称。
- `url`：跳转地址。
- `target`：`_blank` 在新标签页打开，`_self` 在当前页面打开。
- `colors`：鱼的鱼身、亮部、鱼鳍和光晕颜色。
- `desktopPosition`：桌面坐标，对应 `1600 × 900` 的场景。
- `mobilePosition`：窄屏坐标，对应 `1200 × 900` 的场景。
- `scale`：鱼的相对大小。

新增更多鱼时，尽量把坐标分散开，避免相互遮挡。
