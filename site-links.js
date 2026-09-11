/**
 * 每条 fish 配置会自动生成一条可点击、可键盘操作的鱼。
 *
 * 新增入口时，复制一个对象并填写：
 * - id: 唯一标识，也会成为 CSS 类名 fish--<id>
 * - name: 悬停或键盘聚焦时显示的名称
 * - url: 跳转地址
 * - target: _blank 表示新标签页打开，_self 表示当前页面打开
 * - colors: 鱼的配色，可按需省略
 * - desktopPosition / mobilePosition: 鱼在场景中的坐标
 * - scale: 鱼的整体大小
 */
window.SITE_LINKS = [
  {
    id: "blog",
    name: "博客",
    url: "https://zhouhuilong.cn/",
    target: "_self",
    colors: {
      body: "#db8a58",
      light: "#ffe1a6",
      accent: "#a94f45",
      glow: "rgba(255, 187, 105, 0.56)"
    },
    desktopPosition: [1045, 563],
    mobilePosition: [642, 500],
    scale: 0.6
  },
  {
    id: "github",
    name: "GitHub",
    url: "https://github.com/HuiLong-Zhou",
    target: "_self",
    colors: {
      body: "#31b8ba",
      light: "#b7f1dd",
      accent: "#147a85",
      glow: "rgba(69, 222, 210, 0.54)"
    },
    desktopPosition: [1284, 679],
    mobilePosition: [625, 655],
    scale: 0.6
  },
  {
    id: "csdn",
    name: "CSDN",
    url: "https://blog.csdn.net/m0_72406127",
    target: "_self",
    colors: {
      body: "#e2b94f",
      light: "#fff0a7",
      accent: "#9c6428",
      glow: "rgba(255, 220, 112, 0.52)"
    },
    desktopPosition: [835, 738],
    mobilePosition: [470, 760],
    scale: 0.56
  }
];
