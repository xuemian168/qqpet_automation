"""读写 electron-store 加密数据文件

electron-store v8.x 加密方式：
- 文件格式: [16字节IV]:[AES-256-CBC加密的JSON]
- 密钥派生: PBKDF2-SHA512(password=encryptionKey, salt=IV.toString(), iterations=10000, keylen=32)
- 加密算法: AES-256-CBC
"""

from __future__ import annotations

import hashlib
import json
import os
import platform
import sys
from pathlib import Path

from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad


def find_store_path(custom_path: str = "") -> Path:
    """定位 electron-store 数据文件

    优先使用自定义路径，否则按平台检测默认位置。
    应用名: "pet"，文件名: "config.json"
    """
    if custom_path:
        p = Path(custom_path)
        if p.exists():
            return p
        raise FileNotFoundError(f"指定的数据文件不存在: {custom_path}")

    system = platform.system()
    if system == "Windows":
        app_data = os.environ.get("APPDATA", "")
        candidates = [
            Path(app_data) / "pet" / "config.json",
            Path(app_data) / "pet" / "configDev.json",
        ]
    elif system == "Darwin":
        home = Path.home()
        candidates = [
            # macOS 移植版（明文，无加密）
            home / "Library" / "Application Support" / "qq-pet-macos" / "config-macos.json",
            # 原版路径
            home / "Library" / "Application Support" / "pet" / "config.json",
            home / "Library" / "Application Support" / "pet" / "configDev.json",
        ]
    else:
        home = Path.home()
        candidates = [
            home / ".config" / "pet" / "config.json",
            home / ".config" / "pet" / "configDev.json",
        ]

    for p in candidates:
        if p.exists():
            return p

    raise FileNotFoundError(
        f"未找到 QQ 宠物数据文件。已搜索: {', '.join(str(c) for c in candidates)}"
    )


def _derive_key(encryption_key: str, iv: bytes) -> bytes:
    """使用 PBKDF2-SHA512 派生 AES 密钥

    与 Node.js crypto.pbkdf2Sync(key, iv.toString(), 10000, 32, 'sha512') 一致。
    注意: salt 是 IV 的 Buffer.toString() 结果，不是原始字节。
    """
    # Node.js 的 Buffer.toString() 对二进制数据使用 latin1 编码
    salt = iv.decode("latin1").encode("utf-8")
    return hashlib.pbkdf2_hmac("sha512", encryption_key.encode("utf-8"), salt, 10000, 32)


def read_store(path: Path, encryption_key: str = "aes-256-cbc") -> dict:
    """读取并解密 electron-store 数据文件"""
    data = path.read_bytes()

    if not data:
        return {}

    # 检查是否为加密格式（第17字节是 ':'）
    if len(data) > 17 and data[16:17] == b":":
        iv = data[:16]
        ciphertext = data[17:]
        key = _derive_key(encryption_key, iv)
        cipher = AES.new(key, AES.MODE_CBC, iv)
        plaintext = unpad(cipher.decrypt(ciphertext), AES.block_size)
        return json.loads(plaintext.decode("utf-8"))

    # 未加密的 JSON（开发模式 configDev.json）
    return json.loads(data.decode("utf-8"))


def write_store(path: Path, data: dict, encryption_key: str = "aes-256-cbc") -> None:
    """加密并写入 electron-store 数据文件（原子写：临时文件 + rename）"""
    json_bytes = json.dumps(data, ensure_ascii=False).encode("utf-8")

    if encryption_key:
        iv = os.urandom(16)
        key = _derive_key(encryption_key, iv)
        cipher = AES.new(key, AES.MODE_CBC, iv)
        ciphertext = cipher.encrypt(pad(json_bytes, AES.block_size))
        payload = iv + b":" + ciphertext
    else:
        payload = json_bytes

    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_bytes(payload)
    os.replace(tmp, path)


def backup_store(path: Path) -> Path:
    """备份数据文件，返回备份路径"""
    backup_path = path.with_suffix(f".json.bak")
    if path.exists():
        backup_path.write_bytes(path.read_bytes())
    return backup_path
