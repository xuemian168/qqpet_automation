"""QQ 宠物数据模型"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class PetInfo:
    """宠物基础信息"""
    name: str = ""
    host: str = ""
    sex: str = ""
    growth: float = 0
    hunger: int = 0
    clean: int = 0
    health: int = 5
    mood: int = 0
    yb: int = 0  # 元宝
    intel: int = 0  # 智力
    charm: int = 0  # 魅力
    strong: int = 0  # 武力
    birth_day: str = ""
    online_time: float = 0
    last_login_time: int = 0
    online_data_time: float = 0


@dataclass
class PetMaxInfo:
    """宠物属性最大值"""
    level: int = 1
    hunger: int = 3100
    clean: int = 3100
    health: int = 5
    mood: int = 1000
    growth_rate: int = 260
    up_growth: int = 0
    next_growth: int = 100
    stop_growth: bool = False


@dataclass
class Illness:
    """疾病信息"""
    name: str
    health: int
    cure_icon: str
    cure_name: str
    type: str = "ill"
    tolk: str = ""
    err_tolk: str = ""
    success_tolk: str = ""
    children: Optional[Illness] = None


@dataclass
class ActiveOption:
    """活动状态"""
    work: Optional[dict] = None
    study: Optional[dict] = None
    trip: Optional[dict] = None
    ill: Optional[dict] = None
    die: Optional[dict] = None


@dataclass
class StoreInventory:
    """背包物品"""
    food: list[str] = field(default_factory=list)
    commodity: list[str] = field(default_factory=list)
    medicine: list[str] = field(default_factory=list)
    background: list[str] = field(default_factory=list)


@dataclass
class PetStatus:
    """宠物完整状态（用于 CLI 输出）"""
    info: PetInfo
    max_info: PetMaxInfo
    active_option: ActiveOption
    inventory: StoreInventory

    @property
    def is_hungry(self) -> bool:
        return self.info.hunger < 720

    @property
    def is_dirty(self) -> bool:
        return self.info.clean < 1080

    @property
    def is_sad(self) -> bool:
        return self.info.mood < 100

    @property
    def is_sick(self) -> bool:
        return self.info.health < 5

    @property
    def is_dead(self) -> bool:
        return self.info.health == 0

    def to_status_dict(self) -> dict:
        """转换为状态查询的 JSON 输出"""
        return {
            "name": self.info.name,
            "host": self.info.host,
            "level": self.max_info.level,
            "growth": self.info.growth,
            "hunger": self.info.hunger,
            "hunger_max": self.max_info.hunger,
            "clean": self.info.clean,
            "clean_max": self.max_info.clean,
            "health": self.info.health,
            "mood": self.info.mood,
            "mood_max": self.max_info.mood,
            "yb": self.info.yb,
            "intel": self.info.intel,
            "charm": self.info.charm,
            "strong": self.info.strong,
            "is_hungry": self.is_hungry,
            "is_dirty": self.is_dirty,
            "is_sad": self.is_sad,
            "is_sick": self.is_sick,
            "is_dead": self.is_dead,
            "ill": self.active_option.ill,
        }
