"""QQ 宠物游戏数据常量（从 v1.2.4 源码逆向提取）"""

# 属性临界阈值
HUNGER_THRESHOLD = 720    # 低于此值进入饥饿状态
CLEAN_THRESHOLD = 1080    # 低于此值进入脏污状态
MOOD_THRESHOLD = 100      # 低于此值心情低落
HEALTH_NORMAL = 5         # 正常健康值

# 疾病链数据
# 格式: {name, health, cure_icon, cure_name, children}
ILLNESS_CHAIN_COLD = {
    "name": "感冒", "health": 4,
    "cure": {"icon": "10001", "name": "板蓝根"},
    "children": {
        "name": "发烧", "health": 3,
        "cure": {"icon": "30004", "name": "退烧药"},
        "children": {
            "name": "重感冒", "health": 2,
            "cure": {"icon": "20001", "name": "银翘丸"},
            "children": {
                "name": "肺炎", "health": 1,
                "cure": {"icon": "30001", "name": "金色消炎药水"},
                "children": None,
            },
        },
    },
}

ILLNESS_CHAIN_COUGH = {
    "name": "咳嗽", "health": 4,
    "cure": {"icon": "10003", "name": "枇杷糖浆"},
    "children": {
        "name": "支气管炎", "health": 3,
        "cure": {"icon": "20003", "name": "甘草剂"},
        "children": {
            "name": "哮喘", "health": 2,
            "cure": {"icon": "30003", "name": "定喘丸"},
            "children": {
                "name": "肺结核", "health": 1,
                "cure": {"icon": "40003", "name": "通风散"},
                "children": None,
            },
        },
    },
}

ILLNESS_CHAIN_STOMACH = {
    "name": "肚子胀", "health": 4,
    "cure": {"icon": "10002", "name": "消食片"},
    "children": {
        "name": "胃炎", "health": 3,
        "cure": {"icon": "20002", "name": "蓝色消炎药水"},
        "children": {
            "name": "胃溃疡", "health": 2,
            "cure": {"icon": "30002", "name": "龙胆草"},
            "children": {
                "name": "胃癌", "health": 1,
                "cure": {"icon": "40002", "name": "仙人汤"},
                "children": None,
            },
        },
    },
}

# 死亡信息
DEATH_INFO = {
    "name": "死亡", "health": 0,
    "cure": {"icon": "60001", "name": "还魂丹"},
}

# 所有疾病链
ILLNESS_CHAINS = [ILLNESS_CHAIN_COLD, ILLNESS_CHAIN_COUGH, ILLNESS_CHAIN_STOMACH]

# 药品 ID → 治疗的疾病名映射
MEDICINE_CURE_MAP = {
    "10001": "感冒",       # 板蓝根
    "10002": "肚子胀",     # 消食片
    "10003": "咳嗽",       # 枇杷糖浆
    "20001": "重感冒",     # 银翘丸
    "20002": "胃炎",       # 蓝色消炎药水
    "20003": "支气管炎",   # 甘草剂
    "30001": "肺炎",       # 金色消炎药水
    "30002": "胃溃疡",     # 龙胆草
    "30003": "哮喘",       # 定喘丸
    "30004": "发烧",       # 退烧药
    "40002": "胃癌",       # 仙人汤
    "40003": "肺结核",     # 通风散
    "60001": "死亡",       # 还魂丹
}

# 药品名 → ID 映射
MEDICINE_NAME_TO_ID = {v: k for k, v in {
    "10001": "板蓝根",
    "10002": "消食片",
    "10003": "枇杷糖浆",
    "20001": "银翘丸",
    "20002": "蓝色消炎药水",
    "20003": "甘草剂",
    "30001": "金色消炎药水",
    "30002": "龙胆草",
    "30003": "定喘丸",
    "30004": "退烧药",
    "40002": "仙人汤",
    "40003": "通风散",
    "60001": "还魂丹",
}.items()}

# 等级经验值表（400级）
LEVEL_TABLE = [
    0, 100, 300, 600, 1100, 1800, 2800, 4200, 5900, 8000,
    10600, 13700, 17400, 21700, 26700, 32500, 39000, 46300, 54500, 63600,
    73700, 84800, 97000, 110400, 124900, 140600, 157600, 175900, 195600, 216700,
    239300, 263500, 289200, 316500, 345500, 376200, 408700, 443000, 479200, 517400,
    557500, 599600, 643800, 690100, 738600, 789300, 842300, 897700, 955400, 1015500,
    1078100, 1143200, 1210900, 1281200, 1354200, 1430000, 1508500, 1589800, 1674000, 1761100,
    1851200, 1944300, 2040500, 2139900, 2242400, 2348100, 2457100, 2569400, 2685100, 2804200,
    2926800, 3053000, 3182700, 3316000, 3453000, 3593700, 3738200, 3886500, 4038700, 4194900,
    4355000, 4519100, 4687300, 4859600, 5036100, 5216800, 5401800, 5591200, 5784900, 5983000,
    6185600, 6392700, 6604400, 6820700, 7041700, 7267500, 7498000, 7733300, 7973500, 8218600,
]
# 注: 完整 400 级表过长，仅保留前 100 级。可从 GrowUp.js 补全。


def get_level(growth: float) -> dict:
    """根据成长值计算等级"""
    growth = float(growth) if growth else 0
    for i in range(1, len(LEVEL_TABLE)):
        if growth < LEVEL_TABLE[i]:
            return {
                "level": i,
                "up_growth": LEVEL_TABLE[i - 1],
                "next_growth": LEVEL_TABLE[i],
            }
    return {
        "level": len(LEVEL_TABLE),
        "up_growth": LEVEL_TABLE[-1],
        "next_growth": LEVEL_TABLE[-1],
    }


def get_max_hunger_clean(level: int) -> int:
    """计算饥饿/清洁最大值: 3000 + 100 * min(level, 30)"""
    return 3000 + 100 * min(level, 30)


def find_illness_by_name(name: str) -> dict | None:
    """在疾病链中查找疾病信息"""
    for chain in ILLNESS_CHAINS:
        node = chain
        while node:
            if node["name"] == name:
                return node
            node = node.get("children")
    if name == "死亡":
        return DEATH_INFO
    return None


def get_cure_for_illness(illness_name: str) -> dict | None:
    """获取疾病对应的药物"""
    illness = find_illness_by_name(illness_name)
    if illness:
        return illness.get("cure")
    return None
