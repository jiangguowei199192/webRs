/* 2017-9-28 16:04:33 | 修改 木遥（微信:  http://marsgis.cn/weixin.html ） */
//此方式：弹窗非iframe模式
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        resources: [],
        //弹窗
        view: {
            type: "divwindow",
            url: "view.html",
            windowOptions: {
                width: 230,
                height: 120
            }
        },
    },
    //初始化[仅执行1次]
    create: function () {

    },
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        //此处可以绑定页面dom事件
        var viewer = this.viewer;

        //大气渲染
        $("#chk_skyAtmosphere").prop('checked', viewer.scene.skyAtmosphere.show);
        $("#chk_skyAtmosphere").change(function () {
            var visible = $(this).is(':checked');
          
            
            viewer.scene.skyAtmosphere.show = visible;
            viewer.scene.globe.showGroundAtmosphere = visible;
        });

        //光照渲染
        $("#chk_lightRender").prop('checked', viewer.scene.globe.enableLighting);
        $("#chk_lightRender").change(function () {
            var visible = $(this).is(':checked');

            viewer.scene.globe.enableLighting = visible;
            viewer.shadows = visible;
            viewer.terrainShadows = visible ? Cesium.ShadowMode.ENABLED : Cesium.ShadowMode.RECEIVE_ONLY;
        });

        //深度监测
        $("#chk_testTerrain").prop('checked', viewer.scene.globe.depthTestAgainstTerrain);
        $("#chk_testTerrain").change(function () {
            var visible = $(this).is(':checked');

            viewer.scene.globe.depthTestAgainstTerrain = visible;
            if (visible) {
                toastr.info("深度监测打开后，您将无法看到地下或被地形遮挡的对象。");
            }
        });
 

        //键盘控制
        $("#chk_firstPerson").change(function () {
            var visible = $(this).is(':checked');
            
            if (visible) {
                toastr.info("您可以键盘按A S D W Q E和上下左右键控制方向。<br/>并在漫游中滚轮滚动可以加速减速。");
                viewer.mars.keyboardRoam.bind({
                    moveStep: 10,    //平移步长 (米)。
                    dirStep: 25,        //相机原地旋转步长，值越大步长越小。
                    rotateStep: 1.0,    //相机围绕目标点旋转速率，0.3-2.0
                    minPitch: 0.1,      //最小仰角  0-1
                    maxPitch: 0.95,     //最大仰角  0-1
                });
            }
            else{
                viewer.mars.keyboardRoam.unbind()
            }
        });
    },
    //激活插件
    activate: function () {

         

    },
    //释放插件
    disable: function () {
         

    },




}));
