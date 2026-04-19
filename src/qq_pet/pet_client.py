"""QQ 宠物数据客户端 — 读写 electron-store 中的宠物状态"""

from __future__ import annotations

from pathlib import Path

from .game_data import get_level, get_max_hunger_clean
from .models import ActiveOption, PetInfo, PetMaxInfo, PetStatus, StoreInventory
from .store_reader import backup_store, find_store_path, read_store, write_store


class PetClient:
    """宠物数据客户端"""

    def __init__(self, store_path: str = "", encryption_key: str = "aes-256-cbc"):
        self._path = find_store_path(store_path)
        self._encryption_key = _detect_encryption(self._path, encryption_key)

    @property
    def store_path(self) -> Path:
        return self._path

    def _read(self) -> dict:
        return read_store(self._path, self._encryption_key)

    def _write(self, data: dict) -> None:
        write_store(self._path, data, self._encryption_key)

    def backup(self) -> Path:
        return backup_store(self._path)

    def get_raw_data(self) -> dict:
        """获取原始存储数据"""
        return self._read()

    def get_status(self) -> PetStatus:
        """获取宠物完整状态"""
        data = self._read()
        pet_data = data.get("pet", {})

        info_raw = pet_data.get("info", {})
        info = PetInfo(
            name=str(info_raw.get("name", "")),
            host=str(info_raw.get("host", "")),
            sex=str(info_raw.get("sex", "")),
            growth=_to_float(info_raw.get("growth", 0)),
            hunger=_to_int(info_raw.get("hunger", 0)),
            clean=_to_int(info_raw.get("clean", 0)),
            health=_to_int(info_raw.get("health", 5)),
            mood=_to_int(info_raw.get("mood", 0)),
            yb=_to_int(info_raw.get("yb", 0)),
            intel=_to_int(info_raw.get("intel", 0)),
            charm=_to_int(info_raw.get("charm", 0)),
            strong=_to_int(info_raw.get("strong", 0)),
            birth_day=str(info_raw.get("birthDay", "")),
            online_time=_to_float(info_raw.get("onLineTime", 0)),
            last_login_time=_to_int(info_raw.get("lastLoginTime", 0)),
            online_data_time=_to_float(info_raw.get("onlineDataTime", 0)),
        )

        # 计算等级和最大值
        level_info = get_level(info.growth)
        max_cap = get_max_hunger_clean(level_info["level"])

        max_info_raw = pet_data.get("maxInfo", {})
        max_info = PetMaxInfo(
            level=level_info["level"],
            hunger=max_cap,
            clean=max_cap,
            health=_to_int(max_info_raw.get("health", 5)),
            mood=_to_int(max_info_raw.get("mood", 1000)),
            growth_rate=_to_int(max_info_raw.get("growthRate", 260)),
            up_growth=level_info["up_growth"],
            next_growth=level_info["next_growth"],
            stop_growth=bool(max_info_raw.get("stopGrowth", False)),
        )

        active_raw = pet_data.get("activeOption", {})
        active_option = ActiveOption(
            work=active_raw.get("work"),
            study=active_raw.get("study"),
            trip=active_raw.get("trip"),
            ill=active_raw.get("ill"),
            die=active_raw.get("die"),
        )

        cache = self._read().get("cache", {})
        store_raw = cache.get("store", {})
        inventory = StoreInventory(
            food=store_raw.get("food", []),
            commodity=store_raw.get("commodity", []),
            medicine=store_raw.get("medicine", []),
            background=store_raw.get("background", []),
        )

        return PetStatus(
            info=info,
            max_info=max_info,
            active_option=active_option,
            inventory=inventory,
        )

    def update_info(self, updates: dict) -> None:
        """更新宠物 info 字段"""
        data = self._read()
        pet = data.setdefault("pet", {})
        info = pet.setdefault("info", {})
        for key, value in updates.items():
            info[key] = value
        self._write(data)

    def add_info(self, increments: dict) -> dict:
        """增量更新宠物属性，返回更新后的值

        例: add_info({"hunger": 1000}) 将 hunger 增加 1000
        会检查不超过 maxInfo 上限。
        """
        data = self._read()
        pet = data.setdefault("pet", {})
        info = pet.setdefault("info", {})
        max_info = pet.get("maxInfo", {})

        result = {}
        allowed = {"hunger", "clean", "mood", "intel", "charm", "strong"}
        for key, amount in increments.items():
            if key not in allowed:
                continue
            current = _to_int(info.get(key, 0))
            max_val = _to_int(max_info.get(key, 999999999))
            new_val = min(current + _to_int(amount), max_val)
            info[key] = new_val
            result[key] = {"before": current, "after": new_val}

        self._write(data)
        return result

    def set_active_option(self, updates: dict) -> None:
        """更新活动状态"""
        data = self._read()
        pet = data.setdefault("pet", {})
        active = pet.setdefault("activeOption", {})
        for key, value in updates.items():
            active[key] = value
        self._write(data)

    def get_inventory(self) -> StoreInventory:
        """获取背包物品"""
        cache = self._read().get("cache", {})
        store = cache.get("store", {})
        return StoreInventory(
            food=store.get("food", []),
            commodity=store.get("commodity", []),
            medicine=store.get("medicine", []),
            background=store.get("background", []),
        )

    def use_item(self, item_type: str, item_key: str) -> bool:
        """使用背包中的物品（减少数量）

        item_key 格式: "_102010001-3" 表示物品ID为_102010001，数量3
        """
        data = self._read()
        cache = data.setdefault("cache", {})
        store = cache.setdefault("store", {})
        items = store.get(item_type, [])

        for i, item_str in enumerate(items):
            parts = item_str.split("-")
            if len(parts) == 2 and parts[0] == item_key:
                count = int(parts[1])
                if count > 1:
                    items[i] = f"{item_key}-{count - 1}"
                else:
                    items.pop(i)
                store[item_type] = items
                self._write(data)
                return True

        return False

    def find_medicine_for_illness(self, illness_name: str) -> str | None:
        """在背包中查找能治疗指定疾病的药品

        返回物品 key（如 "_10001"），未找到返回 None
        """
        from .game_data import MEDICINE_CURE_MAP

        # 死亡需要还魂丹
        target_medicines = set()
        for med_id, cures_name in MEDICINE_CURE_MAP.items():
            if cures_name == illness_name:
                target_medicines.add(f"_{med_id}")

        inventory = self.get_inventory()
        for item_str in inventory.medicine:
            parts = item_str.split("-")
            if parts[0] in target_medicines:
                return parts[0]

        return None


def _detect_encryption(path: Path, default_key: str) -> str:
    """根据现有文件头自动识别加密格式

    macOS 移植版使用明文 JSON；原版是 AES 密文（IV[16] + ":" + 密文）。
    随机 IV 的首字节有 1/256 概率是 `{`，因此用 "能否 JSON 解码" 作为主判据，
    再用 "第 17 字节为 :" 作为加密格式的辅助确认。
    """
    import json as _json

    try:
        data = path.read_bytes()
    except (OSError, FileNotFoundError):
        return default_key

    try:
        _json.loads(data.decode("utf-8"))
        return ""
    except (ValueError, UnicodeDecodeError):
        pass

    if len(data) >= 17 and data[16:17] == b":":
        return default_key or "aes-256-cbc"
    return default_key


def _to_int(val) -> int:
    try:
        return int(float(val)) if val not in (None, "", False) else 0
    except (ValueError, TypeError):
        return 0


def _to_float(val) -> float:
    try:
        return float(val) if val not in (None, "", False) else 0.0
    except (ValueError, TypeError):
        return 0.0
