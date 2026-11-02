// ========== 模拟数据：专题标签 / 学院 / 实践基地 / 优秀案例 ==========
function img(key, w, h){
  return 'https://images.unsplash.com/photo-' + IMG_IDS[key] + '?auto=format&fit=crop&q=80&w=' + (w || 800) + (h ? '&h=' + h : '');
}

// 20 类专题标签（名称、色值），地图图例、筛选、标签库统一使用
const CATS = [
  { name: '五史教育', color: '#E11D48' },
  { name: '国家安全教育', color: '#B91C1C' },
  { name: '大中小学思政一体化', color: '#8B5CF6' },
  { name: '铸牢中华民族共同体意识', color: '#C2410C' },
  { name: '中华优秀传统文化', color: '#D97706' },
  { name: '革命文化', color: '#EF4444' },
  { name: '社会主义先进文化', color: '#F43F5E' },
  { name: '脱贫攻坚乡村振兴', color: '#16A34A' },
  { name: '绿色发展', color: '#10B981' },
  { name: '攀高攻坚', color: '#0891B2' },
  { name: '大国重器', color: '#2563EB' },
  { name: '弘扬科学家精神', color: '#6366F1' },
  { name: '工业文化', color: '#64748B' },
  { name: '健康中国', color: '#14B8A6' },
  { name: '行业认知', color: '#0EA5E9' },
  { name: '普法与法治建设', color: '#7C3AED' },
  { name: '基层治理', color: '#CA8A04' },
  { name: '社区服务', color: '#F97316' },
  { name: '廉政教育', color: '#BE123C' },
  { name: '爱国主义教育', color: '#DC2626' }
];

const COLLEGES = ['计算机学院', '机械工程学院', '马克思主义学院', '经济管理学院', '法学院', '医学院', '公共管理学院', '文学院', '环境学院', '外国语学院'];

// 牵头单位：实践基地表单接口为 xjXyxxFindAll（学院表，源码无静态名单）。
// 此处用上面的 COLLEGES，并加上校级单位「校团委」（活动主办单位固定机构注释写明校团委；现有原型归属单位里也有这一项）。
const LEAD_UNITS = COLLEGES.concat(['校团委']);

// 基地类型：实践申报配置「基地类型」锁定子项
// znzhxgpt-yw/src/views/dext/sjsbpz/components/AddEditDialog.vue  JDLX_ZX_NAMES
const BASE_TYPES = [
  '校企培优实践基地',
  '社区实践基地',
  '企业名师实践育人工作室',
  '驻校青年驿站',
  '校地/区校共建实践基地',
  '大中小学思想政治教育一体化建设基地'
];

// 实践主题：实践申报配置「基地实践主题」锁定子项
// znzhxgpt-yw/src/views/dext/sjsbpz/components/AddEditDialog.vue  JDSJZT_ZX_NAMES
const PRACTICE_THEMES = [
  '五史教育',
  '国家安全教育',
  '大中小学思想政治教育一体化建设',
  '铸牢中华民族共同体意识',
  '中华优秀传统文化',
  '革命文化',
  '社会主义先进文化',
  '脱贫攻坚乡村振兴',
  '绿色发展',
  '攀高攻坚',
  '大国重器',
  '工业文化',
  '健康中国',
  '行业认知',
  '普法与法治建设',
  '基层治理',
  '社区服务',
  '廉政教育',
  '爱国主义教育',
  '弘扬科学家精神'
];

// 授牌情况：sjjdgl/components/AddEditDialog.vue 写死的 el-option
const AWARD_OPTIONS = ['授牌并签订协议', '仅授牌', '仅签订协议', '未授牌且无协议'];

// 基地状态：同文件 el-option，value 1/0
const BASE_RUN_STATUS = ['正常', '停用'];

// 单位类型：字典编码 dekt_dwlx，源码只有编码、没有条目。
// 下列三项是实践基地列表截图里出现过的示例，不是完整字典。
const UNIT_TYPES = ['基层群众性自治组织', '企业单位', '社会组织'];

// 实践基地：c=专题标签下标，lv=级别，col=上报学院（院级基地），cap=单批接待人数
const BASES = [
  { id: 1, name: '韶山毛泽东同志纪念馆', c: 5, lv: '校级', prov: '湖南', city: '湘潭', lng: 112.53, lat: 27.92, cap: 60, img: 'mountain2', unit: '韶山毛泽东同志纪念馆', persons: 1260 },
  { id: 2, name: '岳麓山·橘子洲旅游区', c: 4, lv: '校级', prov: '湖南', city: '长沙', lng: 112.95, lat: 28.18, cap: 80, img: 'mountain', unit: '岳麓山风景名胜区管理局', persons: 980 },
  { id: 3, name: '十八洞村乡村振兴示范点', c: 7, lv: '校级', prov: '湖南', city: '湘西', lng: 109.48, lat: 28.42, cap: 40, img: 'terrace', unit: '花垣县双龙镇十八洞村村委会', persons: 860 },
  { id: 4, name: '航天科技集团总装测试基地', c: 10, lv: '校级', prov: '北京', city: '北京', lng: 116.30, lat: 39.80, cap: 30, img: 'rocket', unit: '中国航天科技集团某研究院', persons: 420 },
  { id: 5, name: '中联重科智能制造产业园', c: 12, lv: '院级', col: '机械工程学院', prov: '湖南', city: '长沙', lng: 113.00, lat: 28.10, cap: 50, img: 'factory', unit: '中联重科股份有限公司', persons: 610 },
  { id: 6, name: '三一重工“灯塔工厂”', c: 10, lv: '院级', col: '机械工程学院', prov: '湖南', city: '长沙', lng: 113.08, lat: 28.24, cap: 40, img: 'engineer', unit: '三一重工股份有限公司', persons: 540 },
  { id: 7, name: '井冈山革命烈士陵园', c: 5, lv: '校级', prov: '江西', city: '吉安', lng: 114.17, lat: 26.57, cap: 100, img: 'mountain', unit: '井冈山革命博物馆', persons: 1120 },
  { id: 8, name: '延安革命纪念馆', c: 0, lv: '校级', prov: '陕西', city: '延安', lng: 109.49, lat: 36.60, cap: 80, img: 'valley', unit: '延安革命纪念馆', persons: 760 },
  { id: 9, name: '嘉兴南湖革命纪念馆', c: 0, lv: '校级', prov: '浙江', city: '嘉兴', lng: 120.75, lat: 30.75, cap: 80, img: 'river', unit: '南湖革命纪念馆', persons: 690 },
  { id: 10, name: '安吉余村“两山”实践基地', c: 8, lv: '校级', prov: '浙江', city: '湖州', lng: 119.60, lat: 30.60, cap: 60, img: 'forestair', unit: '安吉县天荒坪镇余村', persons: 720 },
  { id: 11, name: '塞罕坝机械林场', c: 8, lv: '校级', prov: '河北', city: '承德', lng: 117.30, lat: 42.40, cap: 40, img: 'forest', unit: '河北省塞罕坝机械林场', persons: 380 },
  { id: 12, name: '袁隆平杂交水稻研究中心', c: 11, lv: '校级', prov: '湖南', city: '长沙', lng: 113.07, lat: 28.20, cap: 40, img: 'field', unit: '湖南杂交水稻研究中心', persons: 880 },
  { id: 13, name: '国家超级计算长沙中心', c: 9, lv: '院级', col: '计算机学院', prov: '湖南', city: '长沙', lng: 112.94, lat: 28.17, cap: 30, img: 'data', unit: '国家超级计算长沙中心', persons: 460 },
  { id: 14, name: '湘西州民族团结进步教育基地', c: 3, lv: '院级', col: '马克思主义学院', prov: '湖南', city: '湘西', lng: 109.73, lat: 28.31, cap: 50, img: 'hands', unit: '湘西州民族宗教事务委员会', persons: 350 },
  { id: 15, name: '湖南省国家安全教育馆', c: 1, lv: '校级', prov: '湖南', city: '长沙', lng: 112.98, lat: 28.20, cap: 60, img: 'building', unit: '湖南省国家安全教育馆', persons: 520 },
  { id: 16, name: '湘雅社区健康服务中心', c: 13, lv: '院级', col: '医学院', prov: '湖南', city: '长沙', lng: 112.99, lat: 28.21, cap: 20, img: 'doctor', unit: '湘雅医院社区卫生服务中心', persons: 300 },
  { id: 17, name: '岳麓区青少年法治教育基地', c: 15, lv: '院级', col: '法学院', prov: '湖南', city: '长沙', lng: 112.93, lat: 28.23, cap: 40, img: 'justice', unit: '长沙市岳麓区人民法院', persons: 280 },
  { id: 18, name: '梅溪湖街道社区治理示范点', c: 16, lv: '院级', col: '公共管理学院', prov: '湖南', city: '长沙', lng: 112.89, lat: 28.19, cap: 30, img: 'meeting', unit: '岳麓区梅溪湖街道办事处', persons: 240 },
  { id: 19, name: '雨花区青年志愿者之家', c: 17, lv: '院级', col: '外国语学院', prov: '湖南', city: '长沙', lng: 113.03, lat: 28.13, cap: 50, img: 'volunteer', unit: '雨花区团委', persons: 410 },
  { id: 20, name: '湖南省廉政教育馆', c: 18, lv: '校级', prov: '湖南', city: '长沙', lng: 112.96, lat: 28.25, cap: 60, img: 'library', unit: '湖南省纪委监委', persons: 330 },
  { id: 21, name: '中国国家博物馆', c: 19, lv: '校级', prov: '北京', city: '北京', lng: 116.40, lat: 39.90, cap: 100, img: 'palace', unit: '中国国家博物馆', persons: 640 },
  { id: 22, name: '长沙市第一中学思政一体化基地', c: 2, lv: '院级', col: '马克思主义学院', prov: '湖南', city: '长沙', lng: 112.99, lat: 28.20, cap: 30, img: 'classroom', unit: '长沙市第一中学', persons: 260 },
  { id: 23, name: '华为松山湖研发基地', c: 14, lv: '院级', col: '计算机学院', prov: '广东', city: '东莞', lng: 113.90, lat: 22.90, cap: 30, img: 'students', unit: '华为技术有限公司', persons: 380 },
  { id: 24, name: '雷锋纪念馆', c: 6, lv: '校级', prov: '湖南', city: '长沙', lng: 112.82, lat: 28.36, cap: 80, img: 'youth', unit: '雷锋纪念馆', persons: 900 },
  { id: 25, name: '“中国天眼”FAST 科普基地', c: 11, lv: '校级', prov: '贵州', city: '黔南', lng: 106.86, lat: 25.65, cap: 40, img: 'earth', unit: '中国科学院国家天文台', persons: 450 },
  { id: 26, name: '大庆油田铁人王进喜纪念馆', c: 12, lv: '校级', prov: '黑龙江', city: '大庆', lng: 125.00, lat: 46.60, cap: 60, img: 'power', unit: '大庆油田有限责任公司', persons: 310 },
  { id: 27, name: '港珠澳大桥建设展示中心', c: 10, lv: '校级', prov: '广东', city: '珠海', lng: 113.58, lat: 22.20, cap: 50, img: 'citynight', unit: '港珠澳大桥管理局', persons: 470 },
  { id: 28, name: '西柏坡纪念馆', c: 0, lv: '校级', prov: '河北', city: '石家庄', lng: 114.00, lat: 38.35, cap: 80, img: 'greatwall2', unit: '西柏坡纪念馆', persons: 530 },
  { id: 29, name: '遵义会议纪念馆', c: 5, lv: '校级', prov: '贵州', city: '遵义', lng: 106.93, lat: 27.70, cap: 80, img: 'greatwall', unit: '遵义会议纪念馆', persons: 600 },
  { id: 30, name: '浏阳大围山镇乡村振兴点', c: 7, lv: '院级', col: '经济管理学院', prov: '湖南', city: '浏阳', lng: 114.10, lat: 28.30, cap: 40, img: 'veg', unit: '浏阳市大围山镇人民政府', persons: 290 },
  { id: 31, name: '上海洋山深水港', c: 14, lv: '院级', col: '经济管理学院', prov: '上海', city: '上海', lng: 122.05, lat: 30.62, cap: 30, img: 'shanghai', unit: '上港集团', persons: 220 },
  { id: 32, name: '敦煌研究院', c: 4, lv: '校级', prov: '甘肃', city: '酒泉', lng: 94.66, lat: 40.14, cap: 40, img: 'valley', unit: '敦煌研究院', persons: 340 },
  { id: 33, name: '兵团军垦博物馆', c: 3, lv: '校级', prov: '新疆', city: '石河子', lng: 86.04, lat: 44.30, cap: 60, img: 'mountain', unit: '新疆生产建设兵团军垦博物馆', persons: 260 },
  { id: 34, name: '林芝援藏乡村振兴实践点', c: 7, lv: '院级', col: '环境学院', prov: '西藏', city: '林芝', lng: 94.36, lat: 29.65, cap: 20, img: 'mountain2', unit: '林芝市巴宜区人民政府', persons: 120 },
  { id: 35, name: '酒泉卫星发射中心', c: 10, lv: '校级', prov: '甘肃', city: '酒泉', lng: 100.30, lat: 40.96, cap: 30, img: 'rocket', unit: '酒泉卫星发射中心', persons: 200 },
  { id: 36, name: '湖南省博物馆', c: 4, lv: '校级', prov: '湖南', city: '长沙', lng: 112.99, lat: 28.21, cap: 100, img: 'dumpling', unit: '湖南省博物馆', persons: 1050 }
];

// 优秀案例（第二课堂已结项评优项目 + 管理员遴选）
const CASES = [
  { id: 1, title: '青春践行“两山”理念：余村绿色发展调研', col: '环境学院', c: 8, place: '浙江湖州', year: '2025-2026', views: 3260, img: 'forestair' },
  { id: 2, title: '十八洞村精准扶贫十年回访与产业振兴调研', col: '经济管理学院', c: 7, place: '湖南湘西', year: '2025-2026', views: 2980, img: 'terrace' },
  { id: 3, title: '走进“灯塔工厂”：智能制造人才需求调研', col: '机械工程学院', c: 10, place: '湖南长沙', year: '2025-2026', views: 2410, img: 'engineer' },
  { id: 4, title: '红色足迹·韶山：青年讲解员宣讲实践', col: '马克思主义学院', c: 5, place: '湖南湘潭', year: '2025-2026', views: 2350, img: 'mountain2' },
  { id: 5, title: '算力强国：超算中心科普进中小学', col: '计算机学院', c: 9, place: '湖南长沙', year: '2024-2025', views: 2120, img: 'data' },
  { id: 6, title: '禾下乘凉梦：杂交水稻科学家精神寻访', col: '文学院', c: 11, place: '湖南长沙', year: '2024-2025', views: 1980, img: 'field' },
  { id: 7, title: '社区“银龄”健康守护志愿服务', col: '医学院', c: 13, place: '湖南长沙', year: '2024-2025', views: 1760, img: 'doctor' },
  { id: 8, title: '法治进校园：青少年模拟法庭巡讲', col: '法学院', c: 15, place: '湖南长沙', year: '2024-2025', views: 1650, img: 'justice' },
  { id: 9, title: '石榴籽一家亲：湘西民族文化影像志', col: '马克思主义学院', c: 3, place: '湖南湘西', year: '2024-2025', views: 1520, img: 'hands' },
  { id: 10, title: '大国工程港珠澳大桥建设者口述史', col: '外国语学院', c: 10, place: '广东珠海', year: '2023-2024', views: 1430, img: 'citynight' },
  { id: 11, title: '湖湘非遗数字化保护与传播实践', col: '文学院', c: 4, place: '湖南长沙', year: '2023-2024', views: 1380, img: 'dumpling' },
  { id: 12, title: '基层治理“微网格”运行机制调研', col: '公共管理学院', c: 16, place: '湖南长沙', year: '2023-2024', views: 1210, img: 'meeting' }
];

// 详情展示字段：按基地序号生成，不另造合作模式选项（字典 dekt_hzms 无条目）
(function () {
  var PROV_FULL = {
    北京: '北京市', 上海: '上海市', 天津: '天津市', 重庆: '重庆市',
    湖南: '湖南省', 江西: '江西省', 陕西: '陕西省', 浙江: '浙江省', 河北: '河北省',
    广东: '广东省', 贵州: '贵州省', 黑龙江: '黑龙江省', 甘肃: '甘肃省',
    新疆: '新疆维吾尔自治区', 西藏: '西藏自治区'
  };
  var CITY_FULL = {
    湘潭: '湘潭市', 长沙: '长沙市', 湘西: '湘西土家族苗族自治州', 北京: '北京市',
    吉安: '吉安市', 延安: '延安市', 嘉兴: '嘉兴市', 湖州: '湖州市', 承德: '承德市',
    东莞: '东莞市', 黔南: '黔南布依族苗族自治州', 大庆: '大庆市', 珠海: '珠海市',
    石家庄: '石家庄市', 遵义: '遵义市', 上海: '上海市', 酒泉: '酒泉市',
    石河子: '石河子市', 林芝: '林芝市', 浏阳: '浏阳市'
  };
  var CAT_THEME = {
    0: '五史教育', 1: '国家安全教育', 2: '大中小学思想政治教育一体化建设',
    3: '铸牢中华民族共同体意识', 4: '中华优秀传统文化', 5: '革命文化',
    6: '社会主义先进文化', 7: '脱贫攻坚乡村振兴', 8: '绿色发展', 9: '攀高攻坚',
    10: '大国重器', 11: '弘扬科学家精神', 12: '工业文化', 13: '健康中国',
    14: '行业认知', 15: '普法与法治建设', 16: '基层治理', 17: '社区服务',
    18: '廉政教育', 19: '爱国主义教育'
  };
  var DIR = {
    0: '党史学习、红色宣讲、口述史采集',
    1: '国家安全教育参观、形势政策宣讲',
    2: '大中小学思政课一体化研学、联合备课观摩',
    3: '民族团结进步教育、文化交流实践',
    4: '传统文化研学、非遗传承体验',
    5: '红色研学、青年讲解、革命精神宣讲',
    6: '先进文化宣讲、典型事迹寻访',
    7: '乡村振兴调研、产业观察、驻村实践',
    8: '生态调研、绿色发展观察、环保实践',
    9: '科研机构参观、技术攻关访谈',
    10: '大国工程参观、技术研学、工匠访谈',
    11: '科学家精神寻访、科普实践',
    12: '工业文化调研、企业见习、智能制造参观',
    13: '健康服务、社区义诊、公共卫生宣教',
    14: '行业认知、企业见习、职业体验',
    15: '法治教育、模拟法庭、普法宣传',
    16: '基层治理调研、社区走访、网格观察',
    17: '志愿服务、社区服务、公益劳动',
    18: '廉政教育参观、警示教育',
    19: '爱国主义教育、讲解服务、主题研学'
  };
  var DIR_EXTRA = ['可结合专业开展调研访谈', '支持志愿服务与公益劳动', '可安排见习或岗位体验', '适合国情考察与社会调查'];
  var INTRO_TAIL = [
    '可承接专题调研、实地研学与志愿服务，配有专人对接和安全保障。',
    '实践期间由共建单位安排讲解与岗位带教，适合团队集中开展。',
    '场地可开展参观、访谈与小型研讨，接待规模见岗位数量。',
    '已形成多项实践成果，可按开放时间与基地联系人对接。'
  ];
  var HOURS = [
    '周一至周五 9:00 至 16:00',
    '周一至周五 8:30 至 17:00',
    '周二至周日 9:00 至 16:30',
    '周一至周六 9:00 至 17:00',
    '周三至周日 8:30 至 16:30',
    '周一至周五 9:00 至 16:30'
  ];
  var ENDS = ['2026-12-31', '2027-03-31', '2027-06-30', '2027-08-31', '2027-09-30', '2027-12-15', '2028-02-28', '2028-05-31', '2027-04-30', '2028-06-30'];
  var BASE_CONTACTS = ['刘老师', '周工', '陈主任', '吴经理', '张馆长', '何书记', '马站长', '孙老师', '赵主任', '钱工', '郑馆员', '冯老师'];
  var SCHOOL_CONTACTS = ['王老师', '陈老师', '李老师', '赵老师', '刘老师', '周老师', '吴老师', '郑老师'];
  var AREA = {
    湖南: '0731', 北京: '010', 江西: '0796', 陕西: '0911', 浙江: '0571', 河北: '0314',
    广东: '0769', 贵州: '0854', 黑龙江: '0459', 上海: '021', 甘肃: '0937', 新疆: '0993', 西藏: '0894'
  };
  var ROADS = ['文化路', '建设大道', '人民路', '学府路', '工业大道', '滨江路', '解放路', '中山路', '青年路', '车站路'];
  var KNOWN_ADDR = {
    1: '湖南省湘潭市韶山市韶山乡韶山村铜钟路 16 号',
    2: '湖南省长沙市岳麓区橘子洲头',
    3: '湖南省湘西土家族苗族自治州花垣县双龙镇十八洞村',
    6: '湖南省长沙市长沙县经济技术开发区三一路 1 号',
    7: '江西省吉安市井冈山市茨坪红军北路 1 号',
    10: '浙江省湖州市安吉县天荒坪镇余村',
    12: '湖南省长沙市芙蓉区远大二路 736 号',
    21: '北京市东城区东长安街 16 号',
    25: '贵州省黔南布依族苗族自治州平塘县克度镇',
    27: '广东省珠海市香洲区港珠澳大桥口岸',
    35: '甘肃省酒泉市金塔县航天镇',
    36: '湖南省长沙市开福区东风路 50 号'
  };
  var PHOTO_POOL = ['students', 'team', 'lecture', 'library', 'campus', 'building', 'meeting', 'youth', 'classroom', 'hands'];

  function regionOf(b) {
    var prov = PROV_FULL[b.prov] || b.prov;
    var city = CITY_FULL[b.city] || b.city;
    return prov === city ? prov : prov + city;
  }
  function tel(area, n) {
    var left = 2000 + ((n * 173) % 7000);
    var right = 1000 + ((n * 91) % 9000);
    return area + '-' + left + ' ' + right;
  }
  function pickCases(b, n) {
    var list = CASES.filter(function (c) { return c.c === b.c; });
    var i;
    for (i = 0; i < CASES.length && list.length < 2; i++) {
      var c = CASES[i];
      var seen = list.some(function (x) { return x.id === c.id; });
      if (!seen && c.place && c.place.indexOf(b.city) >= 0) list.push(c);
    }
    if (!list.length) list.push(CASES[n % CASES.length]);
    if (list.length < 2 && b.id % 5 !== 0) {
      var extra = CASES[(n + 3) % CASES.length];
      if (extra.id !== list[0].id) list.push(extra);
    }
    var count = b.id % 5 === 0 ? 1 : Math.min(2, list.length);
    return list.slice(0, count).map(function (c) { return c.id; });
  }

  BASES.forEach(function (b) {
    var n = b.id - 1;
    var primary = CAT_THEME[b.c] || (CATS[b.c] && CATS[b.c].name) || '爱国主义教育';
    var themes = [primary];
    if (b.id % 4 === 0) {
      var more = PRACTICE_THEMES[(b.c + 3) % PRACTICE_THEMES.length];
      if (more !== primary) themes.push(more);
    }
    var dirs = DIR[b.c] || '专题调研、志愿服务、实践教学';
    if (b.id % 2 === 0) dirs += '，' + DIR_EXTRA[b.id % DIR_EXTRA.length];
    var photos = [b.img];
    var p = 0;
    while (photos.length < 4 && p < PHOTO_POOL.length + 2) {
      var key = PHOTO_POOL[(n + p) % PHOTO_POOL.length];
      if (photos.indexOf(key) < 0) photos.push(key);
      p++;
    }
    var award = AWARD_OPTIONS[n % AWARD_OPTIONS.length];
    var awarded = award === '授牌并签订协议' || award === '仅授牌';
    b.code = 'SJJD-' + String(200 + b.id).padStart(3, '0');
    b.lead = b.col || '校团委';
    b.unitType = UNIT_TYPES[n % UNIT_TYPES.length];
    b.baseType = BASE_TYPES[n % BASE_TYPES.length];
    b.themes = themes;
    b.hzms = '';
    b.region = regionOf(b);
    b.addr = KNOWN_ADDR[b.id] || (b.region + ROADS[n % ROADS.length] + ' ' + (8 + (n * 13) % 160) + ' 号');
    b.dirs = dirs;
    b.intro = b.name + '由' + b.lead + '牵头、' + b.unit + '共建，围绕「' + primary + '」开展社会实践。' + INTRO_TAIL[n % INTRO_TAIL.length] + '累计接待我校学生 ' + b.persons + ' 人次。';
    b.contact = BASE_CONTACTS[n % BASE_CONTACTS.length];
    b.phone = tel(AREA[b.prov] || '0731', 80 + b.id);
    b.openTime = HOURS[n % HOURS.length];
    b.caseIds = pickCases(b, n);
    b.photos = photos;
    b.status = b.id % 11 === 0 ? '停用' : '正常';
    b.score = (35 + (b.id * 3) % 16) / 10;
    b.award = award;
    b.awarded = awarded;
    b.plaqueCount = awarded ? (b.id % 3) + 1 : 0;
    b.until = ENDS[n % ENDS.length];
    b.schoolContact = SCHOOL_CONTACTS[(n + 3) % SCHOOL_CONTACTS.length];
    b.schoolPhone = tel('0731', 400 + b.id);
    b.agreeFile = '共建协议-' + b.code + '.pdf';
    b.plaqueFile = '牌匾扫描件-' + b.code + '.jpg';
  });
})();

// 优秀案例正文：编辑页、学生详情、教师只读弹窗共用这一套字段
(function () {
  var LEVEL = { 2: '国家级立项', 12: '院级优秀' };
  var ADVISORS = ['陈思远', '王敏', '赵磊', '李娜', '孙倩', '周宁', '吴迪', '郑凯', '马琳', '黄蕾', '何俊', '徐阳'];
  var PHOTO_POOL = ['students', 'team', 'lecture', 'library', 'campus', 'building', 'meeting', 'youth', 'classroom', 'hands', 'factory', 'engineer'];
  var BASE_OF = { 1: 10, 2: 3, 3: 6, 4: 1, 5: 13, 6: 12, 7: 16, 8: 17, 9: 14, 10: 27, 11: 36, 12: 18 };

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  CASES.forEach(function (c) {
    var n = c.id;
    var theme = CATS[c.c] ? CATS[c.c].name : '社会实践';
    var endYear = String(c.year || '').split('-')[1] || '2026';
    var startMonth = n % 2 === 0 ? 7 : 8;
    var startDay = 6 + (n % 10);
    var endDay = startDay + 9;
    var endMonth = startMonth;
    if (endDay > 28) {
      endDay -= 28;
      endMonth += 1;
    }
    var photos = [];
    var p = 0;
    while (photos.length < 3 && p < 24) {
      var key = PHOTO_POOL[(n + p) % PHOTO_POOL.length];
      if (key !== c.img && photos.indexOf(key) < 0) photos.push(key);
      p++;
    }
    c.level = LEVEL[n] || '校级优秀';
    c.tags = [c.c];
    c.period = endYear + '.' + pad2(startMonth) + '.' + pad2(startDay) + ' - ' + endYear + '.' + pad2(endMonth) + '.' + pad2(endDay);
    c.team = '团队 ' + (8 + (n * 3) % 13) + ' 人';
    c.advisor = ADVISORS[(n - 1) % ADVISORS.length];
    c.summary = '团队围绕「' + theme + '」在' + c.place + '开展实践，完成调研访谈与成果整理，形成可复用的实践材料，获评' + c.level + '。';
    c.background = '为把「' + theme + '」从课堂延伸到现场，' + c.col + '组织团队前往' + c.place + '，围绕《' + c.title + '》开展实地调研、访谈与服务，探索可复制的实践育人路径。';
    c.insight = '一是行前与接待单位对齐日程和安全事项；二是分组推进调研、记录和宣传，避免成果只停留在现场；三是结项时把做法整理成可交接的材料，供后续团队继续使用。';
    c.achievements = [
      { n: String(10 + n * 3), label: '实地访谈' },
      { n: String(20 + n * 5), label: '服务人次' },
      { n: String(1 + (n % 4)), label: '调研报告' },
      { n: String(1 + (n % 3)), label: '成果转化' }
    ];
    c.photos = photos;
    c.files = [
      { name: '实践成果报告.pdf', meta: '2.4 MB', icon: 'file-text', color: '#DC2626' },
      { name: '实践纪实.mp4', meta: '2 分 10 秒', icon: 'file-video', color: '#7C3AED' },
      { name: '实践照片（12 张）', meta: '已脱敏', icon: 'image', color: '#16A34A' }
    ];
    c.baseId = BASE_OF[n] || null;
    c.projectNo = 'SJ' + endYear + '-' + String(7000 + n);
    c.finished = endYear + '-09';
  });

  var light = null;
  var li;
  for (li = 0; li < CASES.length; li++) if (CASES[li].id === 3) light = CASES[li];
  if (light) {
    light.place = '湖南省长沙市 · 三一重工“灯塔工厂”';
    light.level = '校级优秀';
    light.tags = [10, 12];
    light.period = '2026.08.18 - 2026.08.27';
    light.team = '团队 18 人';
    light.advisor = '刘建华';
    light.summary = '团队深入三一重工“灯塔工厂”开展为期 10 天的驻厂调研，访谈一线工程师 36 人，发放问卷 520 份，形成《智能制造背景下工程技术人才能力需求调研报告》，提出 5 项人才培养改革建议，其中 2 项被学院采纳纳入培养方案修订。';
    light.background = '为服务智能制造人才培养，团队依托学校与三一重工共建的“灯塔工厂”实践基地，把机械设计、智能制造课程与焊接、装配、数字孪生等一线岗位对接。学生以驻厂调研的方式观察产线如何选人、用人，为学院修订培养方案收集第一手依据。';
    light.insight = '一是行前与基地对齐接待岗位和访谈名单，10 天驻厂安排才落得下来；二是问卷与访谈一起做，用工程师的原话核对数据；三是把改革建议写成能直接提交培养方案讨论的条目，其中 2 项已被学院采纳，后续团队可以接着用。';
    light.achievements = [
      { n: '36', label: '访谈工程师' },
      { n: '520', label: '发放问卷' },
      { n: '5', label: '改革建议' },
      { n: '2', label: '纳入培养方案' }
    ];
    light.photos = ['factory', 'students', 'team'];
    light.files = [
      { name: '调研报告终稿.pdf', meta: '4.2 MB', icon: 'file-text', color: '#DC2626' },
      { name: '实践纪实短片.mp4', meta: '3 分 50 秒', icon: 'file-video', color: '#7C3AED' },
      { name: '实践照片（24 张）', meta: '已脱敏', icon: 'image', color: '#16A34A' }
    ];
    light.baseId = 6;
    light.projectNo = 'SJ2026-0712';
    light.finished = '2026-09';
  }
})();

// 渲染一个带颜色的专题标签
function catTag(i){ return '<span class="tag tag-c" style="--c:' + CATS[i].color + '">' + CATS[i].name + '</span>'; }

function htmlEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

// 案例正文的字段顺序。编辑表单与只读详情按这个顺序展示。
const CASE_BODY_FIELDS = [
  '案例标题', '专题标签', '评优等级', '学年', '所属学院', '实践地点', '实践时间',
  '实践团队', '指导教师', '浏览次数', '封面图片', '成果摘要', '实践背景', '实践成果',
  '实践掠影', '经验与启示', '成果附件'
];

function caseFromQuery(fallbackId) {
  var fb = fallbackId || 3;
  var raw = '';
  try { raw = new URLSearchParams(location.search).get('id') || ''; } catch (err) { raw = ''; }
  var id = raw === '' ? fb : Number(raw);
  var i, found = null, backup = null;
  for (i = 0; i < CASES.length; i++) {
    if (CASES[i].id === id) found = CASES[i];
    if (CASES[i].id === fb) backup = CASES[i];
  }
  return found || backup || CASES[0];
}

function caseFields(c) {
  var idx = (c.tags && c.tags.length) ? c.tags : [c.c];
  var tags = [];
  var i;
  for (i = 0; i < idx.length; i++) {
    var cat = CATS[idx[i]];
    if (cat) tags.push({ i: idx[i], name: cat.name, color: cat.color });
  }
  return {
    id: c.id,
    title: c.title,
    tags: tags,
    level: c.level || '',
    year: c.year,
    col: c.col,
    place: c.place,
    period: c.period || '',
    team: c.team || '',
    advisor: c.advisor || '',
    views: String(c.views).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    img: c.img,
    summary: c.summary || '',
    background: c.background || '',
    achievements: c.achievements || [],
    photos: c.photos || [],
    insight: c.insight || '',
    files: c.files || []
  };
}

function caseReadHtml(c) {
  var f = caseFields(c);
  function row(label, html, full) {
    return '<div data-field="' + label + '"' + (full ? ' class="full"' : '') + '><span class="k">' + label + '</span><span>' + html + '</span></div>';
  }
  function block(label, html) {
    return '<div data-field="' + label + '"><h3>' + label + '</h3>' + html + '</div>';
  }
  var tags = f.tags.map(function (t) {
    return '<span class="tag tag-c" style="--c:' + t.color + '">' + htmlEsc(t.name) + '</span>';
  }).join('');
  var ach = f.achievements.map(function (a) {
    return '<div><b class="num">' + htmlEsc(a.n) + '</b><span>' + htmlEsc(a.label) + '</span></div>';
  }).join('');
  var pics = f.photos.map(function (key) {
    return '<img data-shot="实践掠影" src="' + img(key, 500, 300) + '" alt="实践掠影">';
  }).join('');
  var files = f.files.map(function (file) {
    return '<div class="file"><i data-lucide="' + file.icon + '" style="color:' + (file.color || '#64748B') + '"></i><span>' + htmlEsc(file.name) + '</span><span class="muted small">' + htmlEsc(file.meta) + '</span></div>';
  }).join('');
  return '<div data-field="案例标题"><div class="case-k">案例标题</div><h1 class="case-title">' + htmlEsc(f.title) + '</h1></div>'
    + '<div class="desc case-meta">'
    + row('专题标签', '<span class="flex gap-8">' + tags + '</span>', true)
    + row('评优等级', htmlEsc(f.level))
    + row('学年', htmlEsc(f.year))
    + row('所属学院', htmlEsc(f.col))
    + row('实践地点', htmlEsc(f.place))
    + row('实践时间', htmlEsc(f.period))
    + row('实践团队', htmlEsc(f.team))
    + row('指导教师', htmlEsc(f.advisor))
    + row('浏览次数', htmlEsc(f.views))
    + '</div>'
    + block('封面图片', '<img class="cover" data-shot="案例封面" src="' + img(f.img, 1400, 720) + '" alt="案例封面">')
    + block('成果摘要', '<div class="summary">' + htmlEsc(f.summary) + '</div>')
    + block('实践背景', '<p>' + htmlEsc(f.background) + '</p>')
    + block('实践成果', '<div class="achieve">' + ach + '</div>')
    + block('实践掠影', '<div class="pics" data-shots="实践掠影">' + pics + '</div>')
    + block('经验与启示', '<p>' + htmlEsc(f.insight) + '</p>')
    + block('成果附件', '<div class="files">' + files + '</div>');
}
