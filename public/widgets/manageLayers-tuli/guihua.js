//模块：图例模块
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "append",
            url: "view.html"
        },
    },
    //初始化[仅执行1次]
    create: function () {


    },
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        //此处可以绑定页面dom事件 

        // var layerId =this.config.layerItem.id  

        //土壤_含盐量
        opt._dom.children().attr('src', this.path + 'img/guihua.jpg');
    },
    //打开激活
    activate: function () {



    },
    //关闭释放
    disable: function () {



    },



}));

