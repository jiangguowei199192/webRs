var Cesium = window.Cesium
var mars3d = window.mars3d
var gltfEdit = {
  // 开始编辑
  activate: function (model, viewer, options) {
    this.viewer = viewer
    this.model = model
    this.options = options || {}

    if (this.axisModel) {
      this.disable()
    }

    // 加载坐标轴模型
    var axisModel = viewer.scene.primitives.add(Cesium.Model.fromGltf({
      id: 'axis',
      url: 'http://172.16.63.57:9000/mapdata/gltf' + '/mars/axis.gltf',
      modelMatrix: new Cesium.Matrix4(),
      colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT
    }))
    axisModel.readyPromise.then(function (axisModel) {
      axisModel.activeAnimations.addAll()
    })

    this.axisModel = axisModel
    this.updateAxisMatrix()

    this.bindEvent()
  },
  updateAxisMatrix: function () {
    // 将坐标轴模型移到与模型相同的角度和位置，并放大到外接球的大小
    var scale = this.model.boundingSphere.radius / 1.5
    if (this.model.attribute && this.model.attribute.scale) {
      scale = scale / this.model.attribute.scale
    }
    this.axisModel.modelMatrix = Cesium.Matrix4.multiplyByUniformScale(this.model.modelMatrix, scale, new Cesium.Matrix4())
  },
  bindEvent: function () {
    var that = this
    // 判断当前是否点击在坐标轴上进行拖动和旋转
    var isAxis = false
    var zhou // 当前拖拽的是哪个轴

    var viewer = this.viewer

    var downHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    downHandler.setInputAction(function (event) {
      var pickedObject = viewer.scene.pick(event.position)
      if (Cesium.defined(pickedObject) && pickedObject.id === that.axisModel.id) {
        zhou = pickedObject.mesh.name
        isAxis = true
        // console.log('单击了:' + zhou);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN)

    downHandler.setInputAction(function (event) {
      var startCartesian3 = viewer.scene.pickPosition(event.startPosition)
      var endCartesian3 = viewer.scene.pickPosition(event.endPosition)

      if (isAxis && startCartesian3 && endCartesian3) {
        that.cameraControl(false) // 禁止球转动和拖动

        switch (zhou) {
          // case 'XArrow_1':
          //     that.axisMove(startCartesian3, endCartesian3, Cesium.Cartesian3.UNIT_X, 'x', 'z');
          //     break;
          // case 'YArrow_1':
          //     that.axisMove(startCartesian3, endCartesian3, Cesium.Cartesian3.UNIT_Z, 'y', 'z');
          //     break;
          // case 'ZArrow_1':
          //     that.axisMove(startCartesian3, endCartesian3, Cesium.Cartesian3.UNIT_Y, 'x', 'y');
          //     break;

          case 'XAxis_1':
            that.axisRotate(startCartesian3, endCartesian3, Cesium.Cartesian3.UNIT_Y, 'z', 'x')
            break
          case 'YAxis_1':
            that.axisRotate(startCartesian3, endCartesian3, Cesium.Cartesian3.UNIT_X, 'y', 'z')
            break
          case 'ZAxis_1':
            that.axisRotate(startCartesian3, endCartesian3, Cesium.Cartesian3.UNIT_Z, 'x', 'y')
            break
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    downHandler.setInputAction(function (event) {
      isAxis = false
      that.cameraControl(true)
    }, Cesium.ScreenSpaceEventType.LEFT_UP)

    this.downHandler = downHandler
  },
  destroyEvent: function () {
    if (this.downHandler) {
      this.downHandler.destroy()
      this.downHandler = null
    }
  },
  // 平移模型 处理
  // axisMove: function (startCartesian3, endCartesian3, surface, zeroAxis1, zeroAxis2) {

  //     var modelMatrix = this.model.modelMatrix;
  //     var point = this.axisTransForm(modelMatrix, startCartesian3, endCartesian3, surface);

  //     // 两点差值
  //     var sub = Cesium.Cartesian3.subtract(point.end, point.start, new Cesium.Cartesian3());
  //     sub[zeroAxis1] = 0;
  //     sub[zeroAxis2] = 0;

  //     var sub2 = Cesium.Matrix4.multiplyByPoint(modelMatrix, sub, new Cesium.Cartesian3());

  //     // 移动模型
  //     this.model.modelMatrix[12] = sub2.x;
  //     this.model.modelMatrix[13] = sub2.y;
  //     this.model.modelMatrix[14] = sub2.z;

  //     //更新 坐标轴模型
  //     this.updateAxisMatrix();
  // },
  // 旋转模型 处理
  axisRotate: function (startCartesian3, endCartesian3, surface, tant1, tant2) {
    var modelMatrix = this.model.modelMatrix
    var point = this.axisTransForm(modelMatrix, startCartesian3, endCartesian3, surface)

    // 两点角度
    var tant = (point.start[tant1] * point.end[tant2] - point.start[tant2] * point.end[tant1]) / (point.start[tant1] * point.end[tant1] + point.start[tant2] * point.end[tant2])

    var quat = Cesium.Quaternion.fromAxisAngle(surface, Math.atan(tant)) // quat为围绕这个surface轴旋转d度的四元数
    var rotMat3 = Cesium.Matrix3.fromQuaternion(quat)
    var m2 = Cesium.Matrix4.multiplyByMatrix3(modelMatrix, rotMat3, new Cesium.Matrix4())

    // 移动模型
    this.model.modelMatrix = m2

    var hpr = mars3d.matrix.getHeadingPitchRollByMatrix(m2)
    var heading = Cesium.Math.toDegrees(hpr.heading)
    var pitch = Cesium.Math.toDegrees(hpr.pitch)
    var roll = Cesium.Math.toDegrees(hpr.roll)

    if (this.options.calback) {
      this.options.calback({
        entity: this.model,
        heading: mars3d.point.formatNum(heading, 1),
        pitch: mars3d.point.formatNum(pitch, 1),
        roll: mars3d.point.formatNum(roll, 1)
      })
    }

    // 更新 坐标轴模型
    this.updateAxisMatrix()
  },

  // 旋转和平移函数得到射线和面交点(基础方法)
  axisTransForm: function (modelMatrix, startCartesian3, endCartesian3, surface) {
    var matrix = Cesium.Matrix4.inverseTransformation(modelMatrix, new Cesium.Matrix4())

    // 获取相机坐标
    var camera1 = this.viewer.camera.position

    // 转 模型坐标
    var camera = Cesium.Matrix4.multiplyByPoint(matrix, camera1, new Cesium.Cartesian3())
    var startM = Cesium.Matrix4.multiplyByPoint(matrix, startCartesian3, new Cesium.Cartesian3())
    var endM = Cesium.Matrix4.multiplyByPoint(matrix, endCartesian3, new Cesium.Cartesian3())

    // 从相机看模型的方向
    var startDirection = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(startM, camera, new Cesium.Cartesian3()), new Cesium.Cartesian3())
    var endDirection = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(endM, camera, new Cesium.Cartesian3()), new Cesium.Cartesian3())

    // 面
    var plane = Cesium.Plane.fromPointNormal(Cesium.Cartesian3.ZERO, surface)

    // 射线
    var startRay = new Cesium.Ray(camera, startDirection)
    var endRay = new Cesium.Ray(camera, endDirection)

    // 射线和面交点
    var start = Cesium.IntersectionTests.rayPlane(startRay, plane)
    var end = Cesium.IntersectionTests.rayPlane(endRay, plane)

    return { start: start, end: end }
  },

  // 球是否可以转动（编辑时停止球的操作）
  cameraControl: function (isCamera) {
    this.viewer.scene.screenSpaceCameraController.enableRotate = isCamera
    this.viewer.scene.screenSpaceCameraController.enableTranslate = isCamera
    this.viewer.scene.screenSpaceCameraController.enableZoom = isCamera
    this.viewer.scene.screenSpaceCameraController.enableTilt = isCamera
    this.viewer.scene.screenSpaceCameraController.enableLook = isCamera
  },
  // 停止编辑
  disable: function () {
    if (!this.axisModel) return

    this.destroyEvent()
    this.viewer.scene.primitives.remove(this.axisModel)
    delete this.axisModel
  }

}
