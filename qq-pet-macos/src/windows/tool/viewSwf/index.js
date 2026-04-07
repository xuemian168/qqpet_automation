// 主程序控制台
var setSay = (msg) => {
    window.electronAPI.viewSwf_setSay(msg)
}
var setEvent = (event) => {
    window.electronAPI.viewSwf_ToMain(event)
}
const App = {
    data() {
        return {
            swfDom: null,
            router: [],
            fileList: [],
            files: [],
            chooseFiles: [],
            isSee: false,
            //分页参数
            current: 1,
            pageSize: 24,
            paging: 0,
            pageSizeOptions: ['24', '35'],
            spinningUpFile: false,
            lodingTime: null,
            readFile: false,

            seeChoose: false,
            //全选参数
            checkAll: false,
            indeterminate: false,
            checkAllPage: false,
            indeterminatePage: false,

            //弹窗分页参数
            saveChooseFiles: [],
            chooseFilesPopup: [],
            deleteChoose: [],
            currentPopop: 1,
            pageSizePopop: 24,
            pagingPopop: 0,
            pageSizeOptions: ['24', '35'],

            //目标
            type: '',
            toPath: '',
            state: false,
            toNum: 0,
            failNum: 0,
            failArr: [],
            dataSource: [],
            otherFoldersTime: null,
            otherFolders: [
            ],
            historyFolders: [
            ],

            editFile: {},

            fullWindowState: false
        };
    },
    computed: {

    },
    created() {

    },
    watch: {
        toPath: {
            handler(val) {
                if (val) {
                    this.otherFoldersTime && clearTimeout(this.otherFoldersTime)
                    this.otherFoldersTime = setTimeout(() => {
                        this.getOtherRouter(val)
                    }, 200);
                }
            },
            immediate: true,
            deep: true
        }
    },
    mounted() {
        this.swfDom = document.getElementById('swf')
        this.$refs.getFiles.value = ''
        // 监听main传入的信息
        window.electronAPI.viewSwf_ToHtml((e, msg) => {
            //传入token  因为没有登录也会有机器码token 
            if (msg.type == 'load') {
                //结束等待 进入对应页面  必要
                seeApp()
            }
        })
        // 监听 查找到的文件夹
        window.electronAPI.viewSwf_busFolder((e, msg) => {
            //传入token  因为没有登录也会有机器码token 
            // console.log(msg)
            if (msg.type == 'folders') {
                this.otherFolders = []
                for (let k in msg.data) {
                    this.otherFolders.push({ path: this.addOnceFolder(this.toPath, msg.data[k]) })
                }
            }
        })
        // 监听 操作文件返回
        window.electronAPI.viewSwf_busState((e, msg) => {
            //传入token  因为没有登录也会有机器码token 
            console.log(msg)
            if (msg.type == "backState") {
                if (msg.data.event == 'success') {
                    if (this.type == 'move') {
                        let kn = this.fileList.length - 1
                        for (let k = kn; k >= 0; k--) {
                            if (this.fileList[k].id == msg.data.val.id) {
                                this.fileList.splice(k, 1)
                            }
                        }
                    }
                    this.toNum++
                }
                if (msg.data.event == 'err' || msg.data.event == 'error') {
                    antd.message.warning(msg.data.val.name + ':' + msg.data.msg);
                    this.failNum++
                    this.failArr.push(msg.data.val)
                }
                if (this.toNum + this.failNum == this.chooseFiles.length) {
                    this.toOncePage()
                    if (this.failNum) {
                        // antd.message.warning(this.failNum + '个文件操作失败');
                        this.toNum && antd.message.success(this.toNum + '个文件操作成功');
                        this.failNum = 0
                        if (this.type == 'move') {
                            let leng = this.chooseFiles.length - 1;
                            for (let k = leng; k >= 0; k--) {
                                let isDelete = true
                                for (let kfail in this.failArr) {
                                    if (this.chooseFiles[k].id == this.failArr[kfail].id) {
                                        isDelete = false;
                                        break;
                                    }
                                }
                                if (isDelete) {
                                    this.chooseFiles.splice(k, 1)
                                }
                            }
                        }
                        this.failArr = []
                    } else {
                        antd.message.success(this.toNum + '个文件操作成功');
                        if (this.type == 'move') {
                            this.chooseFiles = []
                        }
                    }
                    this.toNum = 0;
                    this.toPath = ''
                    this.state = false
                }
            } else if (msg.type == "reName") {
                if (msg.data.msg == 'success') {
                    antd.message.success(msg.data.val.name + ' 成功改名为 ' + msg.data.val.newNameIs);
                    //修改当前页以及总文件
                    this.files[msg.data.val.oldFileIndex].path = msg.data.val.newPathIs
                    this.files[msg.data.val.oldFileIndex].name = msg.data.val.newNameIs
                    for (let k in this.fileList) {
                        if (this.fileList[k].id == msg.data.val.id) {
                            this.fileList[k].path = msg.data.val.newPathIs
                            this.fileList[k].name = msg.data.val.newNameIs
                            break
                        }
                    }
                    for (let k in this.chooseFiles) {
                        if (this.chooseFiles[k].id == msg.data.val.id) {
                            this.chooseFiles[k].path = msg.data.val.newPathIs
                            this.chooseFiles[k].name = msg.data.val.newNameIs
                            break
                        }
                    }
                    this.editFile = {}
                } else {
                    antd.message.warning(msg.data.name + msg.data.msg);
                }
            }
        })
        setEvent({ event: 'mounted' })
    },
    methods: {
        closeWindow() {
            setEvent({ event: 'close' })
        },
        getStyle() {
            let s;
            if (this.pageSize == 35) {
                s = 80
            } else if (this.pageSize == 24) {
                s = 97
            }
            return {
                width: s + 'px',
                height: s + 'px'
            }
        },
        changePageSize(p) {
            if (this.pageSize == p) return
            this.pageSize = p
            this.current = 1
            this.changePage()
        }
        , backUp() {
            this.isSee = false
        }
        , backSee() {
            this.isSee = true
        }
        , openFile(event) {
            console.log(this.readFile)
            event && (this.readFile = event)
            this.$refs[this.readFile || event || 'getFiles'].click()
            this.spinningUpFile = true
            this.timesOver && clearTimeout(this.timesOver)
            this.timesOver = setTimeout(() => {
                this.spinningUpFile = false
            }, 6000);
        }
        , toRouter(i) {
            if (this.router.length - 1 == i) return
            this.router.splice(i + 1, this.router.length - 1)
            // console.log(this.router.join('/'))
        }
        , chooseRouter(router, cantDelete, cantCheck) {
            let i = this.chooseFiles.indexOf(router)
            if (i !== -1) {
                if (cantDelete) return
                this.chooseFiles.splice(i, 1)
            } else {
                this.chooseFiles.push(router)
            }
            if (cantCheck) return
            this.isCheckAll()
        },
        clearChooseRoutre(router, cantCheck) {
            let i = this.chooseFiles.indexOf(router)
            if (i !== -1) {
                this.chooseFiles.splice(i, 1)
            }
            if (cantCheck) return
            this.isCheckAll()
        },
        upLoadFile(e) {
            console.log(e.target.files)
            if (this.toPath) {
                this.getPath(e)
                return
            }
            let arr = e.target.files;
            this.files = []
            this.fileList = []
            this.chooseFiles = []
            let i = 0
            for (let k in arr) {
                if (!arr[k].path || arr[k].path.indexOf('.swf') == -1) continue;
                this.fileList.push({ id: ++i, path: arr[k].path, name: arr[k].name, size: arr[k].size })
                if (i == 1) {
                    this.router = arr[k].path.replace(('\\' + arr[k].name), '').split('\\')
                }
            }
            if (this.fileList.length > 0) {
                this.isSee = true
                //切换到第一页
                // console.log(this.router)
                this.changePage(1)
            } else {
                this.isSee = false
                antd.message.warning('该文件夹没有.swf文件 ,请重新选择');
                this.$refs.getFiles.value = ''
            }
            this.spinningUpFile = false
        },
        changePage() {
            if (this.fileList.length == 0) {
                this.files = [];
                this.isSee = false
                return
            }
            let len = this.fileList.length / this.pageSize
            this.paging = (Math.trunc(len) + (this.fileList.length % this.pageSize == 0 ? 0 : 1)) * 10
            this.files = this.fileList.slice((this.current - 1) * this.pageSize, this.current * this.pageSize)
            this.isCheckAll()
        },
        toOncePage() {
            this.current = 1;
            this.changePage()
        },
        //全选
        onCheckAllChange() {
            if (!this.checkAll) {
                this.chooseFiles = []
            } else {
                this.chooseFiles = []
                for (let k in this.fileList) {
                    this.chooseFiles.push(this.fileList[k])
                }
            }
            this.isCheckAll()
        },
        // 全选单页
        onCheckAllChangePage() {
            if (!this.checkAllPage) {
                for (let k in this.files) {
                    this.clearChooseRoutre(this.files[k], true)
                }
            } else {
                for (let k in this.files) {
                    this.chooseRouter(this.files[k], true, true)
                }
            }
            this.isCheckAll()
        },
        // 判断是否全选
        isCheckAll() {
            this.checkAll = this.chooseFiles.length == this.fileList.length;
            this.indeterminate = !!this.chooseFiles.length && this.chooseFiles.length < this.fileList.length;
            // 当前页判断
            let chooseNum = 0;
            if (this.chooseFiles.length > this.files.length) {
                for (let c in this.chooseFiles) {
                    for (let k in this.files) {
                        if (this.chooseFiles[c] == this.files[k])
                            chooseNum++
                    }
                }
            } else {
                for (let k in this.files) {
                    for (let c in this.chooseFiles) {
                        if (this.chooseFiles[c] == this.files[k])
                            chooseNum++
                    }
                }
            }
            this.checkAllPage = chooseNum == this.files.length;
            this.indeterminatePage = !!chooseNum && chooseNum < this.files.length;
        },
        toJSON(obj) {
            return JSON.parse(JSON.stringify(obj))
        },
        //弹窗 分页
        seeChooseFn() {
            this.seeChoose = true;
            this.currentPopop = 1
            this.saveChooseFiles = []
            this.deleteChoose = []
            for (let k in this.chooseFiles) {
                this.saveChooseFiles.push(this.chooseFiles[k])
            }
            this.changePagePopop()
        },
        changePagePopop() {
            let len = this.saveChooseFiles.length / this.pageSizePopop
            this.pagingPopop = (Math.trunc(len) + (this.saveChooseFiles.length % this.pageSizePopop == 0 ? 0 : 1)) * 10
            this.chooseFilesPopup = this.saveChooseFiles.slice((this.currentPopop - 1) * this.pageSizePopop, this.currentPopop * this.pageSizePopop)
        },
        clearChooseRoutrePopup(router) {
            let i = this.chooseFilesPopup.indexOf(router), det = []
            if (i !== -1) {
                det = this.chooseFilesPopup.splice(i, 1)
            }
            this.deleteChoose.push(det[0])
            let si = this.saveChooseFiles.indexOf(router)
            if (si !== -1) {
                this.saveChooseFiles.splice(i, 1)
            }
        },
        submitPopup() {
            if (this.deleteChoose.length == 0) return
            for (let k in this.deleteChoose) {
                let i = this.chooseFiles.indexOf(this.deleteChoose[k])
                if (i !== -1) {
                    this.chooseFiles.splice(i, 1)
                }
            }
            this.isCheckAll()
            this.seeChoose = false;
        },
        getPath(e) {
            console.log(e)
        },
        doFile(val) {
            this.type = val
            this.toPath = this.router.join('/')
            this.state = 0
        },
        move() {
            if (!this.toPath) {
                antd.message.warning('请选择目标文件夹');
            }
            this.state = 1
            //移动文件
            window.electronAPI.viewSwf_setFileNames({
                event: this.type,
                files: JSON.stringify(this.chooseFiles),
                toPath: this.toPath
            })

        },
        getOtherRouter(path) {
            //获取附近路径
            window.electronAPI.viewSwf_getFolder({
                event: 'getFolder',
                path: path
            })
        },
        addOnceFolder(path, end) {
            path = path.replace(/\\/, '/')
            let arr = path.split('/')
            if (arr[arr.length - 1]) {
                arr.splice(arr.length - 1, 1)
                path = arr.join('/')
                return path + '/' + end + '/'
            } else {
                return path + end + '/'
            }
        },
        chooseFolder(val) {
            this.toPath = val.path
            let i = this.haveIn(val.path, this.historyFolders)
            if (i == -1) {
                this.historyFolders.unshift(val)
            } else {
                [this.historyFolders[0], this.historyFolders[i]] =
                    [this.historyFolders[i], this.historyFolders[0]]
            }
        },
        haveIn(path, arr) {
            let pass = -1
            for (let k in arr) {
                if (arr[k].path == path) {
                    pass = k;
                    break
                }
            }
            return pass
        },
        reNameFn(item, i) {
            this.editFile = this.toJSON(item)
            let newName = this.editFile.name.split('.')
            newName.splice(newName.length - 1, 1)
            newName = newName.join('.')
            this.editFile['newName'] = newName
            this.editFile['oldName'] = newName
            this.editFile['oldFileIndex'] = i
        },
        edit() {
            window.electronAPI.viewSwf_setFileNames({
                event: 'reName',
                files: JSON.stringify([this.editFile])
            })
        },
        fullWindow() {
            // 全屏
            this.fullWindowState = !this.fullWindowState
        }
    },
};
const app = Vue.createApp(App);
console.log('antd',antd)
app.use(antd)
app.mount('#app');

