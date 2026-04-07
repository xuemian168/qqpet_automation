const works = {
    '_100010105': {
        // key: '001',
        // keyName: '_001',
        intel: 5,
        clean: -10,
        starve: -10,
        level: 6,
        yb: 20,
        // icon: `../assets/img_res/food/_100010105.gif`,
        // valueList: {
        //     yb: {
        //         label: '元宝：',
        //         value: 20
        //     },
        //     need: {
        //         label: '要求：',
        //         value: '需要大于6级~'
        //     },
        //     consume: {
        //         label: '消耗：',
        //         value: '饥饿值：'
        //     }
        // }
    }
}


const getConsumablesPage = (opt) => { //获取分页数据
    let { pageSize = 4, current = 1, type, getWhere, value, useType = null } = opt
    let source = null
    if (getWhere == 'store') {
        //如果是礼物
        if (value == 'task' && useType) {
            source = this.getGiftData(useType, useType == 'online' ? 8 : 12)
        } else {
            source = this.storeGoods
        }
    } else if (getWhere == 'shop') {
        source = shop
    }
    if (!source?.[type] && !useType) return { opt, msg: '获取失败', state: 'err' }
    if (getWhere == 'store') {
        if (useType) {
        } else {
            source = source[type]
        }
    } else if (getWhere == 'shop') {
        //转成数组
        source = this.getOurGoods(type)
    }
    let res = {
        total: countMaxPageSize(source.length, pageSize)
        , pageSize: pageSize
        , current: current,
        result: []
    }
    let nowList = []
    // console.log('source :>> ', source);
    let getResult = (current) => {
        nowList = source.slice(pageSize * (current - 1), pageSize * current)
        //是否当前页面没有数据
        if (nowList.length == 0 && current > 1) {
            res.current -= 1
            getResult(res.current)
        }
    }
    getResult(res.current)
    if (nowList.length > 0) {
        //获取信息
        if (getWhere == 'store') {
            if (useType) {
                // type_Key
            } else {
                //仓库的需要拼类型
                for (let k in nowList) {
                    nowList[k] = `${type}*${nowList[k]}`
                }
            }
        }
        res.result = this.getGoodsInfo({ goodNames: nowList })
    }
    // console.log(' res :>> ',  res);
    return res
}