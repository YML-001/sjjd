#!/usr/bin/env python3
"""
原型构建脚本：把 _build/src 下的页面片段与公共布局、公共样式合并，
输出为「每个文件独立、CSS 内联」的 HTML 页面，目录结构与 src 保持一致。
用法：python3 _build/build.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(__file__).resolve().parent / "src"

# ---------------- 外部资源 ----------------
CDN_ICON = '<script src="https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js"></script>'
CDN_ECHARTS = '<script src="https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js"></script>'
CDN_CHINA = '<script src="https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/js/china.js"></script>'

# Unsplash 图片素材（键名 → 图片 ID）
IMGS = {
    "greatwall": "1508804185872-d7badad00f7d", "greatwall2": "1547150492-da7ff1742941",
    "palace": "1547981609-4b6bfe67ca0b", "gate": "1529921879218-f99546d03a9d",
    "shanghai": "1474181487882-5abf3f0ba6c2", "citynight": "1536599018102-9f803c140fc1",
    "field": "1500382017468-9049fed747ef", "veg": "1464226184884-fa280b87c399",
    "terrace": "1537531383496-f4749b8032cf", "valley": "1469474968028-56623f02e42e",
    "mountain": "1506905925346-21bda4d32df4", "mountain2": "1470071459604-3b5ec3a7fe05",
    "river": "1527489377706-5bf97e608852", "forestair": "1497436072909-60f360e1d4b1",
    "forest": "1441974231531-c6227db76b6e", "solar": "1509391366360-2e959784a276",
    "wind": "1466611653911-95081537e5b7", "power": "1473341304170-971dccb5ac1e",
    "earth": "1446776811953-b23d57bd21aa", "rocket": "1516849841032-87cbac4d88f7",
    "factory": "1581091226825-a6a2a5aee158", "engineer": "1581092160562-40aa08e78837",
    "lab": "1532094349884-543bc11b234d", "doctor": "1576091160399-112ba8d25d1d",
    "justice": "1589829545856-d10d557cf95f", "volunteer": "1559027615-cd4628902d4a",
    "kids": "1488521787991-ed7bbaae773c", "classroom": "1577896851231-70ef18881754",
    "lecture": "1524178232363-1fb2b075b655", "library": "1427504494785-3a9ca7044f45",
    "students": "1522202176988-66273c2fd55f", "students2": "1531545514256-b1400bc00f31",
    "team": "1523240795612-9a054b0db644", "youth": "1529156069898-49953e39b3ac",
    "hands": "1582213782179-e0d53f98f2ca", "plant": "1542601906990-b4d3fb778b09",
    "campus": "1562774053-701939374585", "graduation": "1541339907198-e08756dedf3f",
    "meeting": "1517048676732-d65bc937f952", "dumpling": "1563245372-f21724e3856d",
    "data": "1551288049-bebda4e38f71", "building": "1486406146926-c627a92ad1ab",
}


def img_url(key, size=None):
    url = f"https://images.unsplash.com/photo-{IMGS[key]}?auto=format&fit=crop&q=80"
    if size:
        w, _, h = size.partition("x")
        url += f"&w={w}" + (f"&h={h}" if h else "")
    else:
        url += "&w=1200"
    return url


# ---------------- 模拟数据（按需注入页面） ----------------
MOCK_DATA = (Path(__file__).resolve().parent / "mock-data.js").read_text(encoding="utf-8")

# ---------------- 公共样式（学工系统风格） ----------------
BASE_CSS = (Path(__file__).resolve().parent / "base.css").read_text(encoding="utf-8")

# ---------------- 公共脚本 ----------------
BASE_JS = """
// 公共脚本：图标渲染、轻提示、弹窗、筛选标签切换
function refreshIcons(){ window.lucide && lucide.createIcons(); }
function toast(msg, icon){
  var t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = '<i data-lucide="' + (icon || 'check-circle-2') + '"></i>' + msg;
  document.body.appendChild(t); refreshIcons();
  requestAnimationFrame(function(){ t.classList.add('show'); });
  setTimeout(function(){ t.classList.remove('show'); setTimeout(function(){ t.remove(); }, 300); }, 2000);
}
function openModal(id){ document.getElementById(id).classList.add('show'); }
function closeModal(id){ document.getElementById(id).classList.remove('show'); }
document.addEventListener('click', function(e){
  var chip = e.target.closest('[data-chips] .chip');
  if (chip) {
    var group = chip.parentElement;
    if (group.dataset.chips === 'single') group.querySelectorAll('.chip').forEach(function(c){ c.classList.remove('on'); });
    chip.classList.toggle('on');
  }
  if (e.target.classList.contains('modal-mask')) e.target.classList.remove('show');
});
document.addEventListener('DOMContentLoaded', refreshIcons);
"""

# 管理端角色：校级 school / 院级 college，存在 localStorage，URL 参数 ?role= 可直接指定
ROLE_JS = """
(function(){
  var p = new URLSearchParams(location.search).get('role');
  if (p) localStorage.setItem('sjjd-role', p);
  document.documentElement.dataset.role = localStorage.getItem('sjjd-role') || 'school';
  document.addEventListener('DOMContentLoaded', function(){
    var role = document.documentElement.dataset.role;
    document.querySelectorAll('a[href*="from=admin"]').forEach(function(a){
      var href = a.getAttribute('href');
      if (href.indexOf('role=') === -1) a.setAttribute('href', href + '&role=' + encodeURIComponent(role));
    });
  });
})();
function switchRole(r){ localStorage.setItem('sjjd-role', r); location.href = location.pathname; }
"""

# ---------------- 导航配置 ----------------
STUDENT_NAV = [
    ("map", "数字地图", "map.html"), ("base-list", "基地检索", "base-list.html"),
    ("ranking", "资源榜单", "ranking.html"), ("cases", "优秀案例", "cases.html"),
    ("ai-match", "AI 智能匹配", "ai-match.html"),
    ("project-draft", "第二课堂申报", "project-draft.html"),
    ("favorites", "我的收藏", "favorites.html"),
]
# 学生后台左侧菜单沿用原门户入口；图标走现有 side 组件，不另写样式
STUDENT_MENU_ICON = {
    "map": "map", "base-list": "search", "ranking": "trophy",
    "cases": "award", "ai-match": "sparkles", "project-draft": "file-plus-2",
    "favorites": "star",
}
STUDENT_MENU = [
    (None, [
        (key, label, STUDENT_MENU_ICON[key], href, False)
        for key, label, href in STUDENT_NAV
    ]),
]

# (分组名, [(菜单键, 名称, 图标, 链接, 是否仅校级)])
ADMIN_MENU = [
    (None, [("dashboard", "工作台", "layout-dashboard", "dashboard.html", False)]),
    ("基地管理", [
        ("map", "数字地图", "map", "../student/map.html?from=admin", False),
        ("bases", "实践基地管理", "map-pinned", "bases.html", False),
        ("base-reports", "基地上报审核", "file-check-2", "base-reports.html", False),
    ]),
    ("资源配置", [
        ("tags", "专题标签库", "tags", "tags.html", True),
        ("ranking-config", "榜单配置", "trophy", "ranking-config.html", True),
    ]),
    ("优秀案例", [
        ("case-pool", "案例候选池", "inbox", "case-pool.html", False),
        ("case-library", "优秀案例库", "award", "case-library.html", False),
    ]),
    ("数据分析", [
        ("data-board", "数据可视化看板", "bar-chart-3", "data-board.html", False),
        ("ai-insight", "AI 数据洞察", "sparkles", "ai-insight.html", True),
    ]),
    ("AI 智能匹配", [
        ("ai-weights", "因子权重配置", "sliders-horizontal", "ai-weights.html", True),
        ("ai-effect", "推荐效果数据", "activity", "ai-effect.html", True),
        ("ai-blacklist", "推荐黑名单", "ban", "ai-blacklist.html", True),
    ]),
    ("系统", [
        ("operation-logs", "操作日志", "scroll-text", "operation-logs.html", False),
        ("second-classroom", "第二课堂联动", "external-link", "second-classroom.html", False),
    ]),
]

TEACHER_MENU = [
    (None, [("home", "工作台", "layout-dashboard", "home.html", False)]),
    ("资源浏览", [
        ("map", "数字地图", "map", "../student/map.html?from=teacher", False),
        ("bases", "实践基地", "map-pinned", "bases.html", False),
        ("cases", "榜单与案例", "award", "cases.html", False),
    ]),
    ("我的指导", [
        ("guided-projects", "我指导的项目", "folder-kanban", "guided-projects.html", False),
    ]),
]

PROTO_BACK = '<a class="proto-back" href="../index.html" title="返回原型导航页"><i data-lucide="layout-grid"></i>原型导航</a>'


def render_crumb(crumb):
    if not crumb:
        return ""
    parts = [p.strip() for p in crumb.split("/")]
    html = "".join(f"<span>{p}</span><i data-lucide=\"chevron-right\"></i>" for p in parts[:-1])
    return f'<div class="crumb">{html}<b>{parts[-1]}</b></div>'


def render_side(menu, active):
    out = []
    for group, items in menu:
        if group:
            out.append(f'<div class="side-group">{group}</div>')
        for key, label, icon, href, lock in items:
            cls = ' class="on"' if key == active else ""
            lock_html = '<em class="lock-tag">仅校级</em>' if lock else ""
            data_lock = " data-lock" if lock else ""
            out.append(f'<a href="{href}"{cls}{data_lock}><i data-lucide="{icon}"></i><span>{label}</span>{lock_html}</a>')
    return "\n".join(out)


def layout_portal(meta, body):
    active = meta.get("menu", "")
    on = ' class="on"'
    nav = "".join(
        f'<a href="{href}"{on if key == active else ""}>{label}</a>' for key, label, href in STUDENT_NAV
    )
    return f"""
<header class="portal-hd">
  <div class="wrap portal-hd-in">
    <a class="logo" href="map.html"><span class="logo-ic"><i data-lucide="graduation-cap"></i></span><span><b>中南大学学工系统</b><small>社会实践基地资源库</small></span></a>
    <nav class="portal-nav">{nav}</nav>
    <div class="portal-user">
      <a href="messages.html" class="hd-ic" title="消息中心"><i data-lucide="bell"></i><em>2</em></a>
      <a href="profile.html" class="hd-me{' on' if active == 'profile' else ''}"><img src="{img_url('students2', '80x80')}" alt="头像"><span>张一鸣<small>计算机学院 · 学生</small></span></a>
    </div>
  </div>
</header>
<main class="wrap portal-main">
{render_crumb(meta.get('crumb'))}
{body}
</main>
<footer class="portal-ft">中南大学学生工作部（处） · 校团委　|　社会实践基地资源库 · 数据来源：第二课堂社会实践库</footer>
"""


def layout_student(meta, body):
    """学生后台：复用管理端顶栏 + 白底左侧栏，不带角色切换和只读徽章。"""
    active = meta.get("menu", "")
    msg_on = " on" if active == "messages" else ""
    me_on = " on" if active == "profile" else ""
    return f"""
<header class="admin-hd">
  <a class="logo" href="map.html"><span class="logo-ic"><i data-lucide="graduation-cap"></i></span><span><b>中南大学学工系统</b><small>社会实践基地资源库</small></span></a>
  <div class="admin-hd-r">
    <a class="hd-ic{msg_on}" href="messages.html" title="消息中心"><i data-lucide="bell"></i><em>2</em></a>
    <a class="hd-me{me_on}" href="profile.html"><img src="{img_url('students2', '80x80')}" alt="头像"><span>张一鸣<small>计算机学院 · 学生</small></span></a>
  </div>
</header>
<aside class="side">{render_side(STUDENT_MENU, active)}</aside>
<main class="admin-main">
{render_crumb(meta.get('crumb'))}
{body}
</main>
"""


def layout_admin(meta, body, teacher=False):
    menu = TEACHER_MENU if teacher else ADMIN_MENU
    if meta.get("only") == "school":
        body = f"""<div data-only="school">{body}</div>
<div data-only="college" class="no-perm card">
  <div class="no-perm-ic"><i data-lucide="shield-off"></i></div>
  <h3>暂无访问权限</h3>
  <p>「{meta.get('title')}」仅对校级管理员开放，院级管理员可在工作台接收相关推送。</p>
  <div class="flex gap-12" style="justify-content:center"><a class="btn" href="dashboard.html">返回工作台</a><button class="btn btn-primary" onclick="switchRole('school')">切换为校级管理员演示</button></div>
</div>"""
    if teacher:
        role_box = '<span class="ro-badge"><i data-lucide="eye"></i>只读模式</span>'
        user = f'<img src="{img_url("meeting", "80x80")}" alt="头像"><span>陈思远<small>指导教师 · 马克思主义学院</small></span>'
        home = "home.html"
        sys_name = "指导教师端"
    else:
        role_box = """<label class="role-switch"><i data-lucide="repeat"></i>演示角色
  <select onchange="switchRole(this.value)">
    <option value="school">校级管理员</option><option value="college">院级管理员</option>
  </select></label>"""
        user = (f'<img src="{img_url("team", "80x80")}" alt="头像">'
                '<span data-only="school">王建国<small>校级管理员 · 校团委</small></span>'
                '<span data-only="college">李敏<small>院级管理员 · 计算机学院</small></span>')
        home = "dashboard.html"
        sys_name = "管理后台"
    return f"""
<header class="admin-hd">
  <a class="logo" href="{home}"><span class="logo-ic"><i data-lucide="graduation-cap"></i></span><span><b>中南大学学工管理系统</b><small>社会实践基地资源库 · {sys_name}</small></span></a>
  <div class="admin-hd-r">
    {role_box}
    <a class="hd-ic" href="#" title="消息"><i data-lucide="bell"></i><em>5</em></a>
    <div class="hd-me">{user}</div>
  </div>
</header>
<aside class="side">{render_side(menu, meta.get('menu', ''))}</aside>
<main class="admin-main">
{render_crumb(meta.get('crumb'))}
{body}
</main>
"""


def build_page(src: Path):
    text = src.read_text(encoding="utf-8")
    m = re.match(r"---\n(.*?)\n---\n", text, re.S)
    meta = {}
    if m:
        for line in m.group(1).splitlines():
            k, _, v = line.partition(":")
            meta[k.strip()] = v.strip()
        text = text[m.end():]
    head_mark = re.search(r"<!--@head(?: inject:([^>]*))?-->", text)
    if head_mark and head_mark.group(1):
        meta["inject"] = head_mark.group(1)
    inject = [s.strip() for s in meta.get("inject", "").split(",") if s.strip()]
    layout = meta.get("layout", "raw")

    # 图片占位符 {{img:键名:宽x高}}
    text = re.sub(r"\{\{img:(\w+)(?::(\w+))?\}\}", lambda mm: img_url(mm.group(1), mm.group(2)), text)

    head_js = [CDN_ICON]
    if "echarts" in inject or "chinamap" in inject:
        head_js.append(CDN_ECHARTS)
    if "chinamap" in inject:
        head_js.append(CDN_CHINA)
    data_js = ""
    if "data" in inject:
        img_map = ",".join(f'{k}:"{v}"' for k, v in IMGS.items())
        data_js = f"<script>\nconst IMG_IDS={{{img_map}}};\n{MOCK_DATA}\n</script>"

    if layout == "raw":
        head = "\n".join(head_js) + f"\n<script>{BASE_JS}</script>\n" + data_js
        return text.replace(head_mark.group(0), head) if head_mark else text

    # 页面私有样式移入 <head>
    page_css = "\n".join(re.findall(r"<style>(.*?)</style>", text, re.S))
    body = re.sub(r"<style>.*?</style>\s*", "", text, flags=re.S)

    if layout == "portal":
        content, body_cls = layout_portal(meta, body), "portal"
    elif layout == "teacher":
        content, body_cls = layout_admin(meta, body, teacher=True), "admin teacher"
    elif layout == "student":
        content, body_cls = layout_student(meta, body), "admin student"
    else:
        content, body_cls = layout_admin(meta, body), "admin"
    role_js = f"<script>{ROLE_JS}</script>" if layout == "admin" else ""
    title_suffix = {"portal": "学生端", "admin": "管理后台", "teacher": "指导教师端", "student": "学生端"}[layout]
    select_fix = ("<script>document.querySelectorAll('.role-switch select').forEach(function(s){"
                  "s.value=document.documentElement.dataset.role;});</script>") if layout == "admin" else ""

    return f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{meta.get('title', '')} - 社会实践基地资源库（{title_suffix}）</title>
{role_js}
{chr(10).join(head_js)}
<style>
{BASE_CSS}
/* ---------- 页面私有样式 ---------- */
{page_css}
</style>
<script>{BASE_JS}</script>
{data_js}
</head>
<body class="{body_cls}">
{content}
{PROTO_BACK}
{select_fix}
</body>
</html>
"""


def main():
    count = 0
    for src in sorted(SRC.rglob("*.html")):
        rel = src.relative_to(SRC)
        out = ROOT / rel
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(build_page(src), encoding="utf-8")
        count += 1
    print(f"已生成 {count} 个页面")


if __name__ == "__main__":
    main()
