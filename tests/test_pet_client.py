"""测试 PetClient"""

import json
import tempfile
from pathlib import Path

import pytest

from src.qq_pet.pet_client import PetClient
from src.qq_pet.store_reader import write_store


SAMPLE_DATA = {
    "pet": {
        "info": {
            "name": "小Q",
            "host": "主人",
            "sex": "男",
            "growth": 12500,
            "hunger": 600,   # 低于 720 阈值 → 饥饿
            "clean": 2500,
            "health": 5,
            "mood": 80,      # 低于 100 阈值 → 心情低
            "yb": 300,
            "intel": 50,
            "charm": 30,
            "strong": 20,
            "birthDay": "2026-01-01",
            "onLineTime": 100,
            "lastLoginTime": 0,
            "onlineDataTime": 50,
        },
        "maxInfo": {
            "level": 15,
            "hunger": 4500,
            "clean": 4500,
            "health": 5,
            "mood": 1000,
            "growthRate": 260,
            "stopGrowth": False,
        },
        "activeOption": {
            "work": None,
            "study": None,
            "trip": None,
            "ill": None,
            "die": None,
        },
    },
    "cache": {
        "store": {
            "food": ["_102010001-3", "_102010012-1"],
            "commodity": ["_102020007-2"],
            "medicine": ["_10001-1", "_60001-1"],
            "background": [],
        },
    },
}


@pytest.fixture
def client(tmp_path):
    path = tmp_path / "config.json"
    write_store(path, SAMPLE_DATA, encryption_key="aes-256-cbc")
    return PetClient(store_path=str(path), encryption_key="aes-256-cbc")


def test_get_status(client):
    status = client.get_status()
    assert status.info.name == "小Q"
    assert status.info.hunger == 600
    assert status.is_hungry is True
    assert status.is_dirty is False
    assert status.is_sad is True
    assert status.is_sick is False


def test_get_status_dict(client):
    status = client.get_status()
    d = status.to_status_dict()
    assert d["name"] == "小Q"
    assert d["is_hungry"] is True
    assert d["is_sad"] is True


def test_add_info(client):
    result = client.add_info({"hunger": 1000})
    assert result["hunger"]["before"] == 600
    assert result["hunger"]["after"] == 1600

    # 验证持久化
    status = client.get_status()
    assert status.info.hunger == 1600


def test_add_info_respects_max(client):
    result = client.add_info({"hunger": 999999})
    # add_info 使用存储中的 maxInfo 作为上限（4500）
    assert result["hunger"]["after"] == 4500


def test_get_inventory(client):
    inv = client.get_inventory()
    assert len(inv.food) == 2
    assert len(inv.medicine) == 2


def test_use_item(client):
    # 使用 3 个食物中的 1 个
    used = client.use_item("food", "_102010001")
    assert used is True

    inv = client.get_inventory()
    # 应该从 3 减到 2
    found = [i for i in inv.food if i.startswith("_102010001")]
    assert found[0] == "_102010001-2"


def test_use_last_item(client):
    # 使用只有 1 个的食物
    used = client.use_item("food", "_102010012")
    assert used is True

    inv = client.get_inventory()
    found = [i for i in inv.food if i.startswith("_102010012")]
    assert len(found) == 0


def test_find_medicine(client):
    # 背包有板蓝根(_10001)，能治感冒
    key = client.find_medicine_for_illness("感冒")
    assert key == "_10001"

    # 背包没有退烧药
    key = client.find_medicine_for_illness("发烧")
    assert key is None


def test_backup(client):
    backup_path = client.backup()
    assert backup_path.exists()
