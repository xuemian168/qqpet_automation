#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
修改 QQ 宠物配置文件中的元宝 (yb) 数值
"""

import json
import os

def main():
    # 配置文件路径
    file_path = r"C:\Users\Administrator\AppData\Roaming\qq-pet-macos\config-macos.json"

    # 检查文件是否存在
    if not os.path.exists(file_path):
        print(f"错误：文件 '{file_path}' 不存在。")
        return

    # 请求用户输入新的元宝数
    gold_input = input("请输入要修改的元宝数: ")

    try:
        new_yb_value = int(gold_input)
    except ValueError:
        print("输入无效，请输入一个整数。")
        return

    # 读取 JSON 文件
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"读取文件时出错: {e}")
        return

    # 修改 yb 值（路径: data -> pet -> info -> yb）
    try:
        old_yb_value = data["pet"]["info"]["yb"]
        data["pet"]["info"]["yb"] = new_yb_value
    except KeyError as e:
        print(f"错误：未找到字段 {e}。")
        return

    # 写回文件（保留原始格式，缩进为制表符）
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent='\t', ensure_ascii=False)
            f.write('\n')
        print(f"成功！元宝数已从 {old_yb_value} 修改为 {new_yb_value}")
    except Exception as e:
        print(f"写入文件时出错: {e}")

if __name__ == "__main__":
    main()
