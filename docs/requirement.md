# 1 背景
做一个随机分组程序， 支持2v2 的比赛。

# 2 功能介绍：
- 包含 4 个 tab， 分别是匹配、排名、明细、我的；

## 2.1 匹配
首先列出所有玩家， 玩家前有一个 checkbox, 如果玩家在场， 用户可以进行勾选。
然后是“开始匹配”的按钮， 点击后进行分组。
最下面增加一个录入新玩家的功能， 需要输入玩家名字和玩家类型（全能、前锋、后卫）

## 2.2 排名
分为赛季排行和组合排名：
以自然月为赛季，用户可以切换具体的赛季。
赛季排行的表格里， 需要包含的字段：
- 排名
- 玩家名称
- 胜率
- 胜场
- 总场数

组合排名的表格里， 需要包含的字段：
- 排名
- 组合的两位玩家名称
- 胜率
- 胜场
- 总场数

## 2.3 明细
可以跨赛季查询流水， 展示比赛的记录，需要包含信息：
- 获胜队的两位玩家名称和得分
- 失败队的两位玩家名称和得分
- 记录的具体时间， 格式应该是yyyy-mm-dd 周几 24 小时格式的时间

## 2.4 我的
编辑资料功能： 可以修改用户头像，绑定玩家名称。
并在下方用表格展示以下信息：
- “当前赛季排名信息”。
- “最佳队友”
- “难缠对手”
- “历史赛季排名信息”

# 3 需求答疑
<!-- 我已经调整了“需求答疑”里的“需求方答复”， 如果需求理解里还有其他疑问， 继续列在“需求答疑”的表格里， 如果没有疑问了， 直接回复：“可以进入下一步的粗略设计” -->
| # | 问题描述 | 需求方答复 |
|---|---|---|
| 1 | 当现场人数不足 4 人时能否开启匹配？ | 不能，“开始匹配”按钮置灰并提示“至少需要 4 名在场玩家”。 |
| 2 | 是否允许比赛出现平局？ | 不允许平局；获胜队的得分应该更高 |
| 3 | 胜率相同时如何排序？ | 依次比较：①胜场数高者在前；②若仍相同，总场数少者在前；③再相同，按最近一场比赛时间由早到晚排序。 |
| 4 | 赛季截止时间点如何定义？ | 每月最后一天 24:00 截止；之后 5 分钟为结算期，期间禁止开启新比赛。 |
| 5 | 已录入的比赛结果能否修改？如何修改？ | 仅管理员可在“明细”页面撤回或编辑；普通玩家需向管理员提交申诉。 |
| 6 | 头像上传的技术要求？ | 支持 JPG/PNG，文件 ≤ 2 MB，比例 1:1，系统将自动压缩至 400 × 400 像素。 |
| 7 | “最佳队友”与“难缠对手”的计算规则？ | 按照赛季进行统计， 其中最佳队友：与该玩家同队且共同胜场数最高；难缠对手：将所有击败过我的对手都列出来， 按胜率排序展示。 |
| 8 | 玩家类型（全能/前锋/后卫）能否修改？ | 可在“我的”页面随时修改，马上生效，不影响历史数据。 |
| 9 | 数据存储与多端同步方案？ | 前端 IndexedDB 做本地离线缓存，后端使用 Firebase Firestore 做实时同步。 |
|10 | 是否支持暗黑模式？ | 初版暂不支持；二期迭代将加入系统主题跟随功能。 |