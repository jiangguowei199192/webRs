/* 2017-9-26 17:24:33 | 修改 木遥（微信:  http://marsgis.cn/weixin.html ） */
//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "divwindow",
            url: "view.html",
            windowOptions: {
                width: 400,
                height: 110
            }
        }
    },
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        var that = this;

        var lasturl = haoutil.storage.get("plot_ws");
        if (lasturl) {
            $("#txtWSUrl").val(lasturl);
            that.connectionWS(lasturl);
        }

        $("#txtCoonWS").click(function () {
            var url = $("#txtWSUrl").val();
            haoutil.storage.add("plot_ws", url);

            that.connectionWS(url);
        });

        $("#txtColseWS").click(function () {
            that.closeSocket();
        });

    },
    //激活插件
    activate: function () {


    },
    //释放插件
    disable: function () {
        this.viewWindow = null;


    },
    showMsg: function (msg) {
        $("#lblMsg").html(msg);
    },
    webSocket: null,
    /**
     * WebSocket客户端 
     * 使用说明：
     * 1、WebSocket客户端通过回调函数来接收服务端消息。例如：webSocket.onmessage
     * 2、WebSocket客户端通过send方法来发送消息给服务端。例如：webSocket.send();
     */
    connectionWS: function (webSocketUrl) {
        var that = this;

        this.closeSocket();

        /**  WebSocket客户端 PS：URL开头表示WebSocket协议 中间是域名端口 结尾是服务端映射地址 */
        var webSocket = new WebSocket(webSocketUrl);

        /** 当服务端打开连接 */
        webSocket.onopen = function (event) {
            console.log('WebSocket打开连接');
            that.showMsg('已连接'); 
        };
        /** 通信失败   */
        webSocket.onerror = function (event) {
            console.log('WebSocket发生异常');
            that.showMsg('连接发生异常');
        };
        /** 关闭连接 */
        webSocket.onclose = function (event) {
            console.log('WebSocket关闭连接');
            that.showMsg('连接已关闭');

        };
        /** 当服务端发来消息：1.广播消息 2.更新在线人数  */
        webSocket.onmessage = function (event) {
            console.log('WebSocket接收到消息');
            console.log(event.data);

            var data = JSON.parse(event.data);   
            that.config.updateAttr(data);
        };
        this.webSocket = webSocket;
  
        return webSocket;
    },
    closeSocket: function () {
        if (this.webSocket) {
            this.webSocket.close();
            delete this.webSocket;
        }
    },
    sendSocket:function(json){
        if (!this.webSocket) return;
 
        console.log('发送了WebSocket消息');
        console.log(json);

        this.webSocket.send(JSON.stringify(json));
    }



}));
