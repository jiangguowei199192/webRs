/* 2017-11-16 14:40:45 | 修改 木遥（微信:  http://marsgis.cn/weixin.html ） */
//模块：
var streetscapeWidget = mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        resources: [
            'view.css',
        ],
        //直接添加到index
        view: {
            type: "append",
            url: 'view.html',
            parent: 'body'
        },
    },
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        var that = this;

        $("#btn_streetscapeBar_close").click(function () {
            that.disableBase();
        });
    },
    markerXY: null,
    handler: null,
    //激活插件
    activate: function () {
        // var point = mars3d.point.getCenter(this.viewer, true);
        var point = this.config.point || { y: 31.833789, x: 117.183995 };
        
        this.centerAt(point);
        var point = this.getBaiduPoint(point);


        var inhtml = `<div id="streetscapeView" style="position:absolute;right:0px;top:0px;border:1px solid #ccc;top: 0px;bottom: 0px;width:50%;overflow: hidden;">     
                        <iframe id="streetscape" name="streetscape" style="width:100%;height:100%;overflow:hidden;margin:0;"
                            scrolling="no" frameborder="0" src="${this.path}streetscape.html?x=${point.x}&y=${point.y}"></iframe>
                      </div>`;
        $("body").append(inhtml);

        $("#centerDiv").css({
            position: "absolute",
            height: "100%",
            width: "50%"
        });
        $(".no-print-view").hide();


        var streetscapeFrame = document.getElementById('streetscape');

        var that = this;
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.handler.setInputAction(function (movement) {
            var cartesian = mars3d.point.getCurrentMousePosition(that.viewer.scene, movement.position);
            if (cartesian) {
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian);

                var jd = Number(Cesium.Math.toDegrees(cartographic.longitude).toFixed(6));
                var wd = Number(Cesium.Math.toDegrees(cartographic.latitude).toFixed(6));
                //var height = Number(cartographic.height.toFixed(1));

                var wgsPoint = that.viewer.mars.point2wgs({ x: jd, y: wd }); //坐标转换为wgs
                jd = wgsPoint.x;
                wd = wgsPoint.y;

                that.centerAt(wgsPoint);

                //点击地图的事件,触发街景改变 
                var point = that.getBaiduPoint({ x: jd, y: wd });
                if (streetscapeFrame.contentWindow.setPosition) {
                    streetscapeFrame.contentWindow.setPosition(point); //根据经纬度坐标展示全景图
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        $('.cesium-viewer').css('cursor', 'crosshair');
    },
    //释放插件
    disable: function () {
        if (this.handler) {
            this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            this.handler.destroy();
            this.handler = null;
        }

        $('.cesium-viewer').css('cursor', '');

        if (this.markerXY) {
            this.viewer.entities.remove(this.markerXY);
            this.markerXY = null;
        }
        $("#streetscapeView").remove();

        $("#centerDiv").css({
            position: "",
            height: "100%",
            width: "100%"
        });
        $(".no-print-view").show();
    },
    getBaiduPoint: function (point) {
        var jd = point.x;
        var wd = point.y;

        point = mars3d.pointconvert.wgs2bd([jd, wd]);
        jd = point[0];
        wd = point[1];

        return { x: jd, y: wd };
    },
    centerAt: function (_latlng) {
        var val = this.viewer.mars.point2map(_latlng); //坐标转换为map一致的坐标系 

        var position = Cesium.Cartesian3.fromDegrees(val.x, val.y);

        if (this.markerXY == null) {
            this.markerXY = this.viewer.entities.add({
                position: position,
                billboard: {
                    image: this.path + "img/streetimg.png",
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // default: CENTER ,
                    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND   //CLAMP_TO_GROUND RELATIVE_TO_GROUND
                }
            });
        }
        else {
            this.markerXY.position = position;
        }

        this.viewer.mars.centerAt({ x: val.x, y: val.y });
    },




}));