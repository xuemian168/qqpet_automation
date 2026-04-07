"""QQ 宠物管家 CLI 入口

用法:
    python -m src.qq_pet.cli status       查询宠物状态
    python -m src.qq_pet.cli info         查看详细信息
    python -m src.qq_pet.cli diagnose     健康诊断
    python -m src.qq_pet.cli feed         喂食
    python -m src.qq_pet.cli bath         洗澡
    python -m src.qq_pet.cli play         逗玩
    python -m src.qq_pet.cli heal         治病
    python -m src.qq_pet.cli auto         一键养护
    python -m src.qq_pet.cli inventory    查看背包
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import yaml

from . import actions
from .pet_client import PetClient


def load_config() -> dict:
    """加载配置文件"""
    config_paths = [
        Path.cwd() / "config.yaml",
        Path(__file__).parent.parent.parent / "config.yaml",
    ]
    for p in config_paths:
        if p.exists():
            with open(p) as f:
                return yaml.safe_load(f) or {}
    return {}


def create_client(config: dict) -> PetClient:
    """根据配置创建 PetClient"""
    return PetClient(
        store_path=config.get("store_path", ""),
        encryption_key=config.get("encryption_key", "aes-256-cbc"),
    )


def output_json(data: dict) -> None:
    """输出 JSON 到 stdout"""
    print(json.dumps(data, ensure_ascii=False, indent=2))


def cmd_status(client: PetClient, _args: argparse.Namespace) -> dict:
    status = client.get_status()
    return status.to_status_dict()


def cmd_info(client: PetClient, _args: argparse.Namespace) -> dict:
    status = client.get_status()
    return {
        "name": status.info.name,
        "host": status.info.host,
        "sex": status.info.sex,
        "level": status.max_info.level,
        "growth": status.info.growth,
        "growth_rate": status.max_info.growth_rate,
        "up_growth": status.max_info.up_growth,
        "next_growth": status.max_info.next_growth,
        "birthday": status.info.birth_day,
        "online_time": status.info.online_time,
        "yb": status.info.yb,
        "intel": status.info.intel,
        "charm": status.info.charm,
        "strong": status.info.strong,
        "hunger": f"{status.info.hunger}/{status.max_info.hunger}",
        "clean": f"{status.info.clean}/{status.max_info.clean}",
        "mood": f"{status.info.mood}/{status.max_info.mood}",
        "health": status.info.health,
        "stop_growth": status.max_info.stop_growth,
    }


def cmd_diagnose(client: PetClient, _args: argparse.Namespace) -> dict:
    return actions.diagnose(client)


def cmd_feed(client: PetClient, args: argparse.Namespace) -> dict:
    amount = getattr(args, "amount", None)
    return actions.feed(client, amount=amount or 1000)


def cmd_bath(client: PetClient, args: argparse.Namespace) -> dict:
    amount = getattr(args, "amount", None)
    return actions.bath(client, amount=amount or 1000)


def cmd_play(client: PetClient, args: argparse.Namespace) -> dict:
    boost = getattr(args, "amount", None)
    return actions.play(client, mood_boost=boost or 100)


def cmd_heal(client: PetClient, _args: argparse.Namespace) -> dict:
    return actions.heal(client)


def cmd_auto(client: PetClient, _args: argparse.Namespace) -> dict:
    config = load_config()
    return actions.auto_care(client, config)


def cmd_inventory(client: PetClient, _args: argparse.Namespace) -> dict:
    return actions.get_inventory(client)


def cmd_backup(client: PetClient, _args: argparse.Namespace) -> dict:
    backup_path = client.backup()
    return {"success": True, "backup_path": str(backup_path)}


def cmd_raw(client: PetClient, _args: argparse.Namespace) -> dict:
    return client.get_raw_data()


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="qq-pet",
        description="QQ 宠物（怀旧服）管家 CLI",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("status", help="查询宠物状态")
    sub.add_parser("info", help="查看详细信息")
    sub.add_parser("diagnose", help="健康诊断")

    feed_p = sub.add_parser("feed", help="喂食")
    feed_p.add_argument("--amount", type=int, default=1000, help="增加的饥饿值")

    bath_p = sub.add_parser("bath", help="洗澡")
    bath_p.add_argument("--amount", type=int, default=1000, help="增加的清洁值")

    play_p = sub.add_parser("play", help="逗玩")
    play_p.add_argument("--amount", type=int, default=100, help="增加的心情值")

    sub.add_parser("heal", help="治病")
    sub.add_parser("auto", help="一键养护")
    sub.add_parser("inventory", help="查看背包")
    sub.add_parser("backup", help="备份数据文件")
    sub.add_parser("raw", help="查看原始数据（调试用）")

    return parser


COMMANDS = {
    "status": cmd_status,
    "info": cmd_info,
    "diagnose": cmd_diagnose,
    "feed": cmd_feed,
    "bath": cmd_bath,
    "play": cmd_play,
    "heal": cmd_heal,
    "auto": cmd_auto,
    "inventory": cmd_inventory,
    "backup": cmd_backup,
    "raw": cmd_raw,
}


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    try:
        config = load_config()
        client = create_client(config)
        handler = COMMANDS[args.command]
        result = handler(client, args)
        output_json(result)
    except FileNotFoundError as e:
        output_json({"error": "store_not_found", "message": str(e)})
        sys.exit(1)
    except Exception as e:
        output_json({"error": "unexpected", "message": str(e)})
        sys.exit(1)


if __name__ == "__main__":
    main()
