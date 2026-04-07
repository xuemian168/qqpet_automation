"""QQ 宠物高层动作封装"""

from __future__ import annotations

from .game_data import (
    CLEAN_THRESHOLD,
    HUNGER_THRESHOLD,
    MOOD_THRESHOLD,
    get_cure_for_illness,
)
from .pet_client import PetClient


def feed(client: PetClient, amount: int = 1000) -> dict:
    """喂食：增加饥饿值"""
    status = client.get_status()
    result = client.add_info({"hunger": amount})
    hunger_info = result.get("hunger", {})
    return {
        "success": True,
        "action": "feed",
        "hunger_before": hunger_info.get("before", status.info.hunger),
        "hunger_after": hunger_info.get("after", status.info.hunger + amount),
    }


def bath(client: PetClient, amount: int = 1000) -> dict:
    """洗澡：增加清洁值"""
    status = client.get_status()
    result = client.add_info({"clean": amount})
    clean_info = result.get("clean", {})
    return {
        "success": True,
        "action": "bath",
        "clean_before": clean_info.get("before", status.info.clean),
        "clean_after": clean_info.get("after", status.info.clean + amount),
    }


def play(client: PetClient, mood_boost: int = 100) -> dict:
    """逗玩：增加心情值"""
    status = client.get_status()
    result = client.add_info({"mood": mood_boost})
    mood_info = result.get("mood", {})
    return {
        "success": True,
        "action": "play",
        "mood_before": mood_info.get("before", status.info.mood),
        "mood_after": mood_info.get("after", status.info.mood + mood_boost),
    }


def heal(client: PetClient) -> dict:
    """治病：根据当前疾病自动选择药物

    1. 诊断当前疾病
    2. 在背包中查找对应药物
    3. 使用药物治疗
    4. 恢复健康值
    """
    diagnosis = diagnose(client)

    if not diagnosis["is_sick"]:
        return {
            "success": True,
            "action": "heal",
            "message": "宠物很健康，不需要治疗",
        }

    illness_name = diagnosis["illness"]
    cure = diagnosis.get("cure")

    if not cure:
        return {
            "success": False,
            "action": "heal",
            "error": "unknown_illness",
            "message": f"未知的疾病: {illness_name}",
        }

    # 在背包中查找药物
    medicine_key = client.find_medicine_for_illness(illness_name)
    if not medicine_key:
        return {
            "success": False,
            "action": "heal",
            "error": "no_medicine",
            "illness": illness_name,
            "cure_needed": cure["name"],
            "message": f"背包中没有 {cure['name']}，需要先购买",
        }

    # 使用药物
    used = client.use_item("medicine", medicine_key)
    if not used:
        return {
            "success": False,
            "action": "heal",
            "error": "use_failed",
            "message": f"使用 {cure['name']} 失败",
        }

    # 恢复健康
    client.update_info({"health": 5})
    client.set_active_option({"ill": None})

    return {
        "success": True,
        "action": "heal",
        "illness": illness_name,
        "medicine": cure["name"],
        "health_before": diagnosis["health"],
        "health_after": 5,
    }


def diagnose(client: PetClient) -> dict:
    """诊断宠物健康状态"""
    status = client.get_status()
    health = status.info.health

    if health == 0:
        return {
            "health": 0,
            "is_sick": True,
            "is_dead": True,
            "illness": "死亡",
            "severity": "致命",
            "cure": {"icon": "60001", "name": "还魂丹"},
            "message": "宠物已死亡，需要还魂丹复活",
        }

    ill_data = status.active_option.ill
    if ill_data and health < 5:
        illness_name = ill_data.get("name", "未知")
        cure = ill_data.get("cure", {})
        severity_map = {4: "轻微", 3: "中等", 2: "严重", 1: "危急"}
        return {
            "health": health,
            "is_sick": True,
            "is_dead": False,
            "illness": illness_name,
            "severity": severity_map.get(health, "未知"),
            "cure": cure,
            "message": f"宠物患了{illness_name}（{severity_map.get(health, '')}），需要{cure.get('name', '治疗')}",
        }

    if health < 5:
        return {
            "health": health,
            "is_sick": True,
            "is_dead": False,
            "illness": "未知疾病",
            "severity": "未知",
            "cure": None,
            "message": f"宠物健康值异常: {health}",
        }

    return {
        "health": 5,
        "is_sick": False,
        "is_dead": False,
        "illness": None,
        "severity": "健康",
        "cure": None,
        "message": "宠物很健康",
    }


def auto_care(client: PetClient, config: dict | None = None) -> dict:
    """一键养护：按优先级检查并处理所有问题

    优先级: 治病 > 喂食 > 洗澡 > 逗玩
    """
    cfg = config or {}
    feed_amount = cfg.get("feed_amount", 1000)
    bath_amount = cfg.get("bath_amount", 1000)
    mood_boost = cfg.get("play_mood_boost", 100)

    actions_taken = []

    # 1. 治病（最高优先级）
    status = client.get_status()
    if status.is_dead or status.is_sick:
        result = heal(client)
        actions_taken.append({"action": "heal", "result": result})

    # 2. 喂食
    status = client.get_status()
    if status.is_hungry:
        result = feed(client, feed_amount)
        actions_taken.append({"action": "feed", "result": result})

    # 3. 洗澡
    status = client.get_status()
    if status.is_dirty:
        result = bath(client, bath_amount)
        actions_taken.append({"action": "bath", "result": result})

    # 4. 逗玩
    status = client.get_status()
    if status.is_sad:
        result = play(client, mood_boost)
        actions_taken.append({"action": "play", "result": result})

    # 获取最终状态
    final_status = client.get_status()

    return {
        "success": True,
        "action": "auto",
        "actions_taken": [a["action"] for a in actions_taken],
        "details": actions_taken,
        "status_after": final_status.to_status_dict(),
    }


def get_inventory(client: PetClient) -> dict:
    """查看背包物品"""
    inv = client.get_inventory()
    return {
        "food": inv.food,
        "commodity": inv.commodity,
        "medicine": inv.medicine,
        "food_count": len(inv.food),
        "commodity_count": len(inv.commodity),
        "medicine_count": len(inv.medicine),
    }
