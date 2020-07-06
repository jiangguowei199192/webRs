<template>
  <div class="videoContainer">
    <VideoMain
      :showLeft="showLeft"
      :showRight="showRight"
      @hideLeftNav="closeLeftNav"
      @hideRightInfo="closeRightInfo"
    >
      <!-- 左侧部分 -->
      <div slot="left">
        <div class="leftContainer">
          <div class="tab">
            <div :class="{active:index==0}" @click.stop="index=0">已选</div>
            <div :class="{active:index==1}" @click.stop="index=1">全部</div>
          </div>
          <div class="search">
            <el-input
              type="text"
              v-model.trim="filterText"
              placeholder="请输入设备名称"
              suffix-icon="el-icon-search"
            ></el-input>
          </div>
          <!-- 默认展示已选部分 -->
          <template v-if="index==0">
            <div
              class="list"
              v-for="(item,index) in listArray"
              :key="index"
              :class="{selected:selectedIndex==index}"
            >
              <p>
                <span class="area">{{item.area}}</span>
                <i></i>
              </p>
              <div class="btns">
                <el-button
                  class="visible"
                  :style="{backgroundColor:item.visibleIsClick?'rgba(14,90,148,1)':''}"
                  @click.stop="changeStatus(1,index)"
                  v-if="item.visibleText"
                >{{item. visibleText}}</el-button>
                <el-button
                  class="infrared"
                  :style="{backgroundColor:item.infraredIsclick?'rgba(0,212,15,1)':''}"
                  @click.stop="changeStatus(2,index)"
                  :class="{isSelected:item.infraredIsclick}"
                  v-if="item.infraredText"
                >{{item.infraredText}}</el-button>
              </div>
            </div>
          </template>
          <!-- 全部部分 -->
          <template v-if="index==1">
            <!-- <div class="tree">
              <el-tree
                :data="data5"
                highlight-current
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
                :props="defaultProps"
                @node-click="handleNodeClick"
              >
                <span class="custom-tree-node" slot-scope="{ node,data }">
                  <span>

                    <span :class="data.class" v-if="data.class"></span>
                    <img src="../../assets/images/onlive.png" v-if="data.isShow" />
                    {{ node.label }}
                  </span>
                </span>
              </el-tree>
            </div>-->
            <tree-data
              :treeData="treeData"
              ref="tree"
              @selectedChange="getSelectedData"
              @videoChange="closeOrOpen"
            ></tree-data>
          </template>
        </div>
      </div>
      <!-- 中间视频部分 -->
      <div slot="center">
        <div class="video">
          <div class="box">
            <div class="title">直播</div>
            <div>当前选中：解放大道高点1</div>
          </div>
          <div class="videoList">
            <div
              v-for="(item,index) in curVideosArray"
              :key="index"
              :style="machineStatusStyle(showVideoPageSize)"
              @click.stop="operateCurVideo(item,index)"
              :class="{active:curVideoIndex===index}"
            >
              <!-- <div > -->
              <VideoWall :videoInfo="item" :key="index" ref="playerCtrl" v-if="item.srcUrl"></VideoWall>
              <!-- </div> -->
            </div>
          </div>
          <!-- 下面按钮部分 -->
          <div class="tools">
            <div class="leftTool">
              <img :src="ninePalace" @click.stop="changeVideosType(9)" />
              <img :src="fourPalace" @click.stop="changeVideosType(4)" />
              <img :src="onePalace" @click.stop="changeVideosType(1)" />
            </div>
            <div class="rightTool">
              <img :src="playAll" @click.stop="playAllVideos" />
              <div class="pagination">
                <el-pagination
                  :page-size="showVideoPageSize"
                  layout="prev,pager, next"
                  :total="totalVideosArray.length"
                  :current-page.sync="currentPage"
                  @prev-click="pre"
                  @next-click="next"
                ></el-pagination>
              </div>

              <img :src="fullScreen" @click.stop="dialogVisible=true" />
            </div>
          </div>
        </div>
      </div>
      <!-- 右侧部分 -->
      <div slot="right">
        <div class="rightContent">
          <div class="baseInfo">
            <div class="info">基本信息</div>
            <div class="detail">
              <ul>
                <li>
                  <span>设备名称：</span>
                  <span>xxx</span>
                </li>
                <li>
                  <span>设备编号：</span>
                  <span>xxx</span>
                </li>
                <li>
                  <span>设备品牌：</span>
                  <span>xxx</span>
                </li>
                <li>
                  <span>设备状态：</span>
                  <span>xxx</span>
                </li>
                <li>
                  <span>所在地点：</span>
                  <span>xxx</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="deviceInfo">
            <div class="info">云台</div>
            <div class="operate">
              <div class="icons">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div class="btns">
                <div>
                  <span>+</span>
                  <b>变倍</b>
                  <span>-</span>
                </div>
                <div>
                  <span>+</span>
                  <b>变焦</b>
                  <span>-</span>
                </div>
                <div>
                  <span>+</span>
                  <b>光圈</b>
                  <span>-</span>
                </div>
              </div>
              <div class="slider">
                <span class="demonstration">步速</span>
                <el-slider
                  v-model="value2"
                  :min="1"
                  :max="8"
                  style="width:91px;margin-left:16px;margin-right:8px;"
                ></el-slider>
                <span>{{value2}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VideoMain>
    <el-dialog :visible.sync="dialogVisible" width="100%"  :fullscreen="true" tabIndex="1" id="d1">
    <!-- <div class="fullContainer" v-if="dialogVisible" id="d1"> -->
      <div
        v-for="(item,index) in curVideosArray"
        :key="index"
        :style="machineStatusStyle(showVideoPageSize)"
      >
        <VideoWall :videoInfo="item" :key="index" ref="playerCtrl" v-if="item.srcUrl"></VideoWall>
      </div>
    <!-- </div> -->

    </el-dialog>
  </div>
</template>
<script>
import VideoMain from './components/main'
import TreeData from './components/tree'
import videoMixin from './mixins/videoMixin'
import VideoWall from './components/videoWall'
import { api } from '@/api/videoSystem/realVideo'
export default {
  name: 'videoContainer',
  components: {
    VideoMain,
    TreeData,
    VideoWall
  },
  mixins: [videoMixin],
  data () {
    return {
      filterText: '', // 节点过滤文字
      dialogVisible: false, // 全屏弹窗
      currentPage: 1, // 默认第1页
      totalVideosArray: [], // 总共的数据
      curVideosArray: [], // 当前展示的数据
      showVideoPageSize: 9, // 每屏显示视频的个数 默认9宫格
      curVideoIndex: 1000,
      treeData: [
        {
          id: 1,
          label: '高点设备',
          class: 'highdevice',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 12,
                  label: '三级 1-1-1'
                  // isShow: false
                },
                {
                  id: 13,
                  label: '三级 1-1-2'
                  // isShow: false
                }
              ]
            },
            {
              id: 9,
              label: '二级 2-1'
            }
          ]
        },
        {
          id: 2,
          label: '无人机',
          class: 'unmanned',
          children: [
            {
              id: 5,
              label: '二级 2-1'
              // isShow: false
            },
            {
              id: 6,
              label: '二级 2-2'
              // isShow: false
            }
          ]
        }
        // {
        //   id: 3,
        //   label: '一级 3',
        //   children: [
        //     {
        //       id: 7,
        //       label: '二级 3-1'
        //       // isShow: false
        //     },
        //     {
        //       id: 8,
        //       label: '二级 3-2'
        //       // isShow: false
        //     }
        //   ]
        // }
      ],
      listArray: [
        {
          area: '发展大道黄浦路1',
          visibleText: '可见光',
          infraredText: '红外光',
          // isSelected: false,
          visibleIsClick: false,
          infraredIsclick: false
        },
        {
          area: '发展大道黄浦路2',
          infraredText: '红外光',
          isSelected: false,
          visibleIsClick: false,
          infraredIsclick: false
        },
        {
          area: '发展大道黄浦路3',
          visibleText: '可见光',
          isSelected: false,
          visibleIsClick: false,
          infraredIsclick: false
        },
        {
          area: '发展大道黄浦路4',
          visibleText: '可见光',
          infraredText: '红外光',
          isSelected: false,
          visibleIsClick: false,
          infraredIsclick: false
        }
      ],
      value2: 4, // 步速值
      isPlayAll: false // 是否播放所有 控制预览全部
    }
  },
  methods: {
    getAllDeptDevices () {
      this.$axios.get(api.getDeptsAndDevicesAxios).then(res => {
        if (res && res.data && res.data.code === 0) {
          const data1 = res.data.data
          console.dir(data1)
          const data = [
            {
              deviceTypeCode: 'GDJK',
              deviceTypeName: '高点监控',
              deviceList: [
                {
                  deptTypeCode: 'district',
                  parentDeptCode: null,
                  deptCode: 'district_113',
                  deptName: '江岸区',
                  orderNum: null,
                  deviceCountTotal: 0,
                  deviceCountOnline: 0,
                  subDept: null,
                  deviceList: []
                },
                {
                  deptTypeCode: 'district',
                  parentDeptCode: null,
                  deptCode: 'district_112',
                  deptName: '东湖高新区',
                  orderNum: null,
                  deviceCountTotal: 2,
                  deviceCountOnline: 2,
                  subDept: null,
                  deviceList: [
                    {
                      deviceTypeCode: 'GDJK',
                      deviceName: '高点监控测试设备1',
                      deviceCode: '5HD10PA4E88F0',
                      deviceBrand: '高德红外',
                      deviceAddress: '武汉市东湖高新区黄龙山路',
                      deviceLatitude: 30.52,
                      deviceLongitude: 114.31,
                      onlineStatus: 'online',
                      onlineTime: '2020-06-22T09:01:24.000+00:00',
                      offlineTime: null,
                      createTime: '2020-06-22T09:01:26.000+00:00',
                      streamCode: null,
                      streamCodeRed: null,
                      onlineVideoUrl: null,
                      onlineVideoUrlRed: null
                    },
                    {
                      deviceTypeCode: 'GDJK',
                      deviceName: '高点监控测试设备2',
                      deviceCode: '5H1H2H3D0D5D',
                      deviceBrand: '高德红外',
                      deviceAddress: '武汉市东湖高新区黄龙山路',
                      deviceLatitude: 30.51,
                      deviceLongitude: 114.32,
                      onlineStatus: 'online',
                      onlineTime: '2020-06-22T11:09:54.000+00:00',
                      offlineTime: null,
                      createTime: '2020-06-22T11:10:01.000+00:00',
                      streamCode: null,
                      streamCodeRed: null,
                      onlineVideoUrl: null,
                      onlineVideoUrlRed: null
                    }
                  ]
                },
                {
                  deptTypeCode: 'district',
                  parentDeptCode: null,
                  deptCode: 'district_116',
                  deptName: '武昌区',
                  orderNum: null,
                  deviceCountTotal: 0,
                  deviceCountOnline: 0,
                  subDept: null,
                  deviceList: []
                },
                {
                  deptTypeCode: 'district',
                  parentDeptCode: null,
                  deptCode: 'district_111',
                  deptName: '江夏区',
                  orderNum: null,
                  deviceCountTotal: 1,
                  deviceCountOnline: 1,
                  subDept: null,
                  deviceList: [
                    {
                      deviceTypeCode: 'GDJK',
                      deviceName: '高点监控测试设备3',
                      deviceCode: '5H1H2H3D0D5F',
                      deviceBrand: '高德红外',
                      deviceAddress: '武汉市江夏区庙山',
                      deviceLatitude: 30.51,
                      deviceLongitude: 114.3,
                      onlineStatus: 'online',
                      onlineTime: '2020-06-22T11:39:23.000+00:00',
                      offlineTime: null,
                      createTime: null,
                      streamCode: null,
                      streamCodeRed: null,
                      onlineVideoUrl: null,
                      onlineVideoUrlRed: null
                    },
                    {
                      deviceTypeCode: 'GDJK',
                      deviceName: '江夏一中测试设备',
                      deviceCode: '5HD10PA4E88F5',
                      deviceBrand: '高德红外',
                      deviceAddress: '武汉市江夏区江夏一中',
                      deviceLatitude: 30.41,
                      deviceLongitude: 114.3,
                      onlineStatus: 'offline',
                      onlineTime: '2020-06-22T02:36:30.000+00:00',
                      offlineTime: '2020-06-23T02:36:41.000+00:00',
                      createTime: '2020-06-22T02:36:44.000+00:00',
                      streamCode: null,
                      streamCodeRed: null,
                      onlineVideoUrl: null,
                      onlineVideoUrlRed: null
                    }
                  ]
                },
                {
                  deptTypeCode: 'district',
                  parentDeptCode: null,
                  deptCode: 'district_115',
                  deptName: '青山区',
                  orderNum: null,
                  deviceCountTotal: 0,
                  deviceCountOnline: 0,
                  subDept: null,
                  deviceList: []
                },
                {
                  deptTypeCode: 'district',
                  parentDeptCode: null,
                  deptCode: 'district_110',
                  deptName: '洪山区',
                  orderNum: null,
                  deviceCountTotal: 0,
                  deviceCountOnline: 0,
                  subDept: null,
                  deviceList: []
                },
                {
                  deptTypeCode: 'district',
                  parentDeptCode: null,
                  deptCode: 'district_114',
                  deptName: '蔡甸区',
                  orderNum: null,
                  deviceCountTotal: 0,
                  deviceCountOnline: 0,
                  subDept: null,
                  deviceList: []
                }
              ]
            },
            {
              deviceTypeCode: 'WRJ',
              deviceTypeName: '无人机',
              deviceList: [
                {
                  deptTypeCode: 'department_fire',
                  parentDeptCode: null,
                  deptCode: 'department_fire_222',
                  deptName: '洪山消防大队',
                  orderNum: null,
                  deviceCountTotal: 0,
                  deviceCountOnline: 0,
                  subDept: [
                    {
                      deptTypeCode: 'department_fire',
                      parentDeptCode: 'department_fire_222',
                      deptCode: 'department_fire_222330',
                      deptName: '徐东路中队',
                      orderNum: null,
                      deviceCountTotal: 1,
                      deviceCountOnline: 1,
                      subDept: null,
                      deviceList: [
                        {
                          deviceTypeCode: 'WRJ',
                          deviceName: 'saga22',
                          deviceCode: '10201010104',
                          deviceBrand: '普宙无人机',
                          deviceAddress: '光谷火车站',
                          deviceLatitude: 30.51,
                          deviceLongitude: 114.332,
                          onlineStatus: 'online',
                          onlineTime: '2020-06-23T08:21:34.000+00:00',
                          offlineTime: null,
                          createTime: null,
                          streamCode: 'app_stream_1589535463087',
                          streamCodeRed: null,
                          onlineVideoUrl:
                            'rtmp://127.0.0.1/live/app_stream_1589535463087',
                          onlineVideoUrlRed: null
                        }
                      ]
                    },
                    {
                      deptTypeCode: 'department_fire',
                      parentDeptCode: 'department_fire_222',
                      deptCode: 'department_fire_222332',
                      deptName: '武汉火车站中队',
                      orderNum: null,
                      deviceCountTotal: 1,
                      deviceCountOnline: 1,
                      subDept: null,
                      deviceList: [
                        {
                          deviceTypeCode: 'WRJ',
                          deviceName: 'suzz',
                          deviceCode: '10201010102',
                          deviceBrand: '普宙无人机',
                          deviceAddress: '武汉火车站',
                          deviceLatitude: 30.511,
                          deviceLongitude: 114.33,
                          onlineStatus: 'offline',
                          onlineTime: '2020-06-24T06:21:43.000+00:00',
                          offlineTime: '2020-06-28T07:02:01.000+00:00',
                          createTime: '2020-06-22T08:12:39.000+00:00',
                          streamCode: 'app_stream_1589534988074',
                          streamCodeRed: null,
                          onlineVideoUrl:
                            'rtmp://127.0.0.1/live/app_stream_1589534988074',
                          onlineVideoUrlRed: null
                        },
                        {
                          deviceTypeCode: 'WRJ',
                          deviceName: 'saga11',
                          deviceCode: '10201010103',
                          deviceBrand: '普宙无人机',
                          deviceAddress: '武汉火车站',
                          deviceLatitude: 30.51,
                          deviceLongitude: 114.331,
                          onlineStatus: 'online',
                          onlineTime: '2020-06-23T08:12:22.000+00:00',
                          offlineTime: null,
                          createTime: '2020-06-22T08:12:42.000+00:00',
                          streamCode: 'pc_stream_1589535416277',
                          streamCodeRed: null,
                          onlineVideoUrl:
                            'rtmp://127.0.0.1/live/pc_stream_1589535416277',
                          onlineVideoUrlRed: null
                        }
                      ]
                    },
                    {
                      deptTypeCode: 'department_fire',
                      parentDeptCode: 'department_fire_222',
                      deptCode: 'department_fire_222331',
                      deptName: '八一路中队',
                      orderNum: null,
                      deviceCountTotal: 0,
                      deviceCountOnline: 0,
                      subDept: null,
                      deviceList: []
                    }
                  ],
                  deviceList: []
                },
                {
                  deptTypeCode: 'department_fire',
                  parentDeptCode: null,
                  deptCode: 'department_fire_220',
                  deptName: '特勤大队',
                  orderNum: null,
                  deviceCountTotal: 0,
                  deviceCountOnline: 0,
                  subDept: [
                    {
                      deptTypeCode: 'department_fire',
                      parentDeptCode: 'department_fire_220',
                      deptCode: 'department_fire_220332',
                      deptName: '特勤三中队',
                      orderNum: null,
                      deviceCountTotal: 0,
                      deviceCountOnline: 0,
                      subDept: null,
                      deviceList: []
                    },
                    {
                      deptTypeCode: 'department_fire',
                      parentDeptCode: 'department_fire_220',
                      deptCode: 'department_fire_220331',
                      deptName: '特勤二中队',
                      orderNum: null,
                      deviceCountTotal: 0,
                      deviceCountOnline: 0,
                      subDept: null,
                      deviceList: []
                    },
                    {
                      deptTypeCode: 'department_fire',
                      parentDeptCode: 'department_fire_220',
                      deptCode: 'department_fire_220330',
                      deptName: '特勤一中队',
                      orderNum: null,
                      deviceCountTotal: 0,
                      deviceCountOnline: 0,
                      subDept: null,
                      deviceList: []
                    }
                  ],
                  deviceList: []
                },
                {
                  deptTypeCode: 'department_fire',
                  parentDeptCode: null,
                  deptCode: 'department_fire_221',
                  deptName: '青山消防大队',
                  orderNum: null,
                  deviceCountTotal: 0,
                  deviceCountOnline: 0,
                  subDept: [
                    {
                      deptTypeCode: 'department_fire',
                      parentDeptCode: 'department_fire_221',
                      deptCode: 'department_fire_221331',
                      deptName: '武丰中队',
                      orderNum: null,
                      deviceCountTotal: 0,
                      deviceCountOnline: 0,
                      subDept: null,
                      deviceList: []
                    },
                    {
                      deptTypeCode: 'department_fire',
                      parentDeptCode: 'department_fire_221',
                      deptCode: 'department_fire_221330',
                      deptName: '青山中队',
                      orderNum: null,
                      deviceCountTotal: 0,
                      deviceCountOnline: 0,
                      subDept: null,
                      deviceList: []
                    }
                  ],
                  deviceList: []
                }
              ]
            }
          ]
          data.forEach((item, index) => {
            item.id = item.deviceTypeCode
            item.label = item.deviceTypeName
            item.children = item.deviceList
            item.children.forEach(child => {
              child.id = child.deptCode
              child.label = child.deptName
              if (index === 0) {
                child.children = child.deviceList
                child.children.forEach(list => {
                  list.id = list.deviceCode
                  list.label = list.deviceName
                })
              } else {
                child.children = child.subDept
                child.children.forEach(list => {
                  list.id = list.deptCode
                  list.label = list.deptName
                  list.children = list.deviceList
                  list.children.forEach(device => {
                    device.id = device.deviceCode
                    device.label = device.deviceName
                  })
                })
              }
            })
          })
          console.log(data)
          this.treeData = data
        }
      })
    },
    // 获取子组件传递过来的数据
    getSelectedData (data) {
      console.log(data)
    },
    // 点击树节点
    closeOrOpen (type, curTreeData) {
      // 1.添加
      if (type === 1) {
        // 1.1默认位置添加
        if (this.curVideoIndex === 1000) {
          const i = this.totalVideosArray.indexOf('')
          // 如果有空元素，则替换
          if (i !== -1) {
            this.totalVideosArray.splice(i, 1, {
              id: curTreeData.id,
              srcUrl:
                'http://116.85.50.50:8888/record/live/yaochen/2020-06-30/11-15-55.mp4'
            })
            this.curVideosArray = this.totalVideosArray.slice(
              0,
              this.showVideoPageSize
            )
          } else {
            // 若没有空元素，则追加
            this.totalVideosArray.push({
              id: curTreeData.id,
              srcUrl:
                'http://116.85.50.50:8888/record/live/yaochen/2020-06-30/11-15-55.mp4'
            })
            this.curVideosArray = this.totalVideosArray.slice(
              0,
              this.showVideoPageSize
            )
          }
        } else {
          // 1.2指定位置添加
          // 若指定位置之前有元素，去掉其激活的样式
          if (this.totalVideosArray[this.curVideoIndex]) {
            document
              .querySelector(
                '#liveVideo' + this.totalVideosArray[this.curVideoIndex].id
              )
              .parentElement.setAttribute('class', '')
            document
              .querySelector(
                '#liveVideo' + this.totalVideosArray[this.curVideoIndex].id
              )
              .parentElement.parentElement.parentElement.parentElement.classList.remove(
                'is-current'
              )
          }
          this.totalVideosArray.splice(this.curVideoIndex, 1, {
            id: curTreeData.id,
            srcUrl:
              'http://116.85.50.50:8888/record/live/yaochen/2020-06-30/11-15-55.mp4'
          })
          this.curVideoIndex = 1000
          this.curVideosArray = this.totalVideosArray.slice(
            0,
            this.showVideoPageSize
          )
        }
      } else {
        // 2.关闭视频
        let i = 0
        this.totalVideosArray.forEach((item, index) => {
          if (item.id === curTreeData.id) {
            i = index
          }
        })
        this.totalVideosArray.splice(i, 1, '')
        this.curVideosArray = this.totalVideosArray.slice(
          0,
          this.showVideoPageSize
        )
      }
    },
    // 点击当前视频
    operateCurVideo (curVideo, index) {
      this.curVideoIndex = index
      // 点击当前视频区域，默认去掉所有激活的样式
      const divs = document.querySelectorAll('.el-tree-node')
      for (let i = 0; i < divs.length; i++) {
        divs[i].classList.remove('is-current')
      }
      // 如果不是空白区域，给对应的数结构添加样式
      if (this.curVideosArray[this.curVideoIndex]) {
        document
          .querySelector(
            '#liveVideo' + this.curVideosArray[this.curVideoIndex].id
          )
          .parentElement.parentElement.parentElement.parentElement.classList.add(
            'is-current'
          )
      }
    },
    // 预览全部
    playAllVideos () {
      const spans = document.querySelectorAll(
        '.el-tree-node__content span.is-leaf +span.custom-tree-node>span'
      )
      for (let i = 0; i < spans.length; i++) {
        if (!this.isPlayAll) {
          spans[i].setAttribute('class', 'liveIcon')
        } else {
          spans[i].setAttribute('class', '')
        }
      }
      this.isPlayAll = !this.isPlayAll
    },
    // 切换每屏显示的个数
    changeVideosType (n) {
      this.currentPage = 1
      this.curVideoIndex = 1000
      this.showVideoPageSize = n
      // 将有数据的视频放到前面
      const newTotalVideosArray = []
      this.totalVideosArray.forEach(item => {
        if (item) {
          newTotalVideosArray.push(item)
        }
      })
      for (
        let i = 0;
        i < this.totalVideosArray.length - newTotalVideosArray.length;
        i++
      ) {
        newTotalVideosArray.push('')
      }
      this.totalVideosArray = newTotalVideosArray
      // 在总数据中获取实际有视频的数据
      const result = this.totalVideosArray.filter(item => item !== '')
      console.log(result)
      // 1.如果有视频小于每屏的展示数据（包含没有的情况）
      if (result.length <= n) {
        // 1.1由大变小
        if (this.totalVideosArray.length >= n) {
          this.curVideosArray = this.totalVideosArray.slice(0, n)
          // 此操作过滤掉不要的空元素
          this.totalVideosArray = this.totalVideosArray.slice(0, n)
        } else {
          // 1.2由小变大
          const j = this.totalVideosArray.length
          for (let i = 0; i < n - j; i++) {
            this.totalVideosArray.push('')
          }
          this.curVideosArray = this.totalVideosArray.slice(0, n)
        }
      } else {
        // 2.如果实际视频并且大于每屏的展示数据
        // 过滤掉本身数据中空元素
        this.totalVideosArray = this.totalVideosArray.filter(
          item => item !== ''
        )
        this.curVideosArray = this.totalVideosArray.slice(0, n)
      }
    },
    // 上一页
    pre (cpage) {
      // 始终截取当前页需要的数据
      this.curVideoIndex = 1000
      const divs = document.querySelectorAll('.el-tree-node')
      for (let i = 0; i < divs.length; i++) {
        divs[i].classList.remove('is-current')
      }
      this.curVideosArray = this.totalVideosArray.slice(
        (cpage - 1) * this.showVideoPageSize,
        cpage * this.showVideoPageSize
      )
    },
    // 下一页
    next (cpage) {
      // 清掉之前的选中状态
      this.curVideoIndex = 1000
      const divs = document.querySelectorAll('.el-tree-node')
      for (let i = 0; i < divs.length; i++) {
        divs[i].classList.remove('is-current')
      }
      if (cpage * this.showVideoPageSize > this.totalVideosArray.length) {
        const j = this.totalVideosArray.length
        // 若不够，数据则补位空格
        for (let i = 0; i < cpage * this.showVideoPageSize - j; i++) {
          this.totalVideosArray.push('')
        }
      }
      console.log(this.totalVideosArray.length)
      this.curVideosArray = this.totalVideosArray.slice(
        (cpage - 1) * this.showVideoPageSize,
        cpage * this.showVideoPageSize
      )
      console.log(cpage, this.curVideosArray.length)
    },
    // 动态渲染9个空元素
    machineStatusStyle (n) {
      if (n === 9) {
        return {
          width: '31%',
          height: '31%'
          // marginLeft: '10px'
        }
      } else if (n === 4) {
        return {
          width: '48%',
          height: '48%'
          // marginLeft: '10px'
        }
      } else if (n === 1) {
        return {
          width: '99%',
          height: '99%'
          // marginLeft: '10px'
        }
      }
    },
    // 检查全屏
    checkFull () {
      let isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled
      if (isFull === undefined) isFull = false
      return isFull
    }
  },
  created () {
    // 初始加载9个空元素
    for (let i = 0; i < 9; i++) {
      // this.totalVideosArray.push({ srcUrl: 'rtmp://120.24.12.64/live/test' })
      this.totalVideosArray.push('')
    }
    // for (let i = 0; i < 3; i++) {
    //   this.totalVideosArray.push('')
    // }
    this.curVideosArray = this.totalVideosArray.slice(
      0,
      this.showVideoPageSize
    )
    this.getAllDeptDevices()
    const me = this
    window.onresize = function () {
      if (me.dialogVisible) {
        if (me.checkFull()) {
          // 要执行的动作
          document.getElementById('d1').focus()
        }
      }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.$refs.tree.filter(val)
    }
  }
}
</script>
<style lang="less" scoped>
.videoContainer {
  box-sizing: border-box;
  .leftContainer {
    box-sizing: border-box;
    padding: 27px 25px 0 28px;
    font-size: 18px;
    font-family: Source Han Sans CN;
    font-weight: bold;

    div.tab {
      display: flex;
      cursor: pointer;
      height: 34px;
      line-height: 34px;
      color: #23cefd;
      background: #1a3e68;
      text-align: center;
      div {
        width: 104px;
      }
      div.active {
        width: 126px !important;
        color: #fff;
      }
      div:nth-child(1).active {
        background: url(../../assets/images/left.png) no-repeat;
      }
      div:nth-child(2).active {
        background: url(../../assets/images/right.png) no-repeat;
      }
    }
    div.search {
      margin-top: 20px;
      background: #10203b;
      /deep/ .el-input__inner {
        background: #10203b;
        border: 1px solid #1eb0fc;
        color: #1eb0fc;
      }

      ::-webkit-input-placeholder {
        /* WebKit, Blink, Edge */
        color: #1eb0fc;
      }
    }
    div.list {
      margin-top: 20px;
      padding-left: 10px;
      padding-top: 10px;
      height: 62px;
      background: url(../../assets/images/list-unselected.png) no-repeat;
      p {
        margin-bottom: 8px;
        color: #1eb0fc;
        i {
          display: inline-block;
          width: 17px;
          height: 10px;
          background: url(../../assets/images/live.png) no-repeat;
          margin-left: 12px;
        }
      }
      div.btns {
        button {
          font-size: 12px;
          font-weight: bold;
          box-sizing: border-box;
          width: 74px;
          height: 22px;
          line-height: 22px;
          border: 1px solid rgba(30, 176, 252, 1);
          padding: 0;
          background: #10243f;
          color: #1eb0fc;
          text-align: right;
          padding-right: 8px;
        }
        button.visible {
          background: url(../../assets/images/visible.png) no-repeat 4px center;
        }
        button.infrared {
          background: url(../../assets/images/infrared.png) no-repeat 4px center;
        }
      }
    }
    div.selected {
      background: url(../../assets/images/list-selected.png) no-repeat;
    }
  }
  .rightContent {
    font-size: 16px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    line-height: 14px;
    padding: 15px 10px;
    .baseInfo,
    .deviceInfo {
      .info {
        box-sizing: border-box;
        width: 202px;
        height: 45px;
        background: url(../../assets/images/device/info-title.png) no-repeat;
        line-height: 45px;
        padding-left: 35px;
      }
    }
    .baseInfo {
      .detail {
        margin-top: 22px;
        ul {
          padding-left: 24px;
          li {
            line-height: 20px;
            text-align: justify;
          }
          li:not(:nth-child(1)) {
            margin-top: 14px;
          }
          li:nth-child(2) {
            margin-top: 17px;
          }
        }
      }
    }
    .deviceInfo {
      margin-top: 130px;
      .info {
        padding-left: 50px;
      }
      .operate {
        margin-top: 20px;
        .icons {
          display: flex;
          flex-wrap: wrap;
          padding-left: 48px;
          div {
            width: 48px;
            height: 48px;
            margin-right: 19px;
            margin-bottom: 19px;
            cursor: pointer;
          }
          div:nth-child(1) {
            background: url(../../assets/images/device/1.png) no-repeat;
          }
          div:nth-child(2) {
            background: url(../../assets/images/device/2.png) no-repeat;
          }
          div:nth-child(3) {
            background: url(../../assets/images/device/3.png) no-repeat;
          }
          div:nth-child(4) {
            margin-right: 10px;
            background: url(../../assets/images/device/4.png) no-repeat;
          }
          div:nth-child(5) {
            width: 64px;
            height: 64px;
            position: relative;
            top: -7px;
            // left: -5px;
            margin-right: 10px;
            background: url(../../assets/images/device/5.png) no-repeat;
          }
          div:nth-child(6) {
            background: url(../../assets/images/device/6.png) no-repeat;
          }
          div:nth-child(7) {
            background: url(../../assets/images/device/7.png) no-repeat;
          }
          div:nth-child(8) {
            background: url(../../assets/images/device/8.png) no-repeat;
          }
          div:nth-child(9) {
            background: url(../../assets/images/device/9.png) no-repeat;
          }
        }
        .btns {
          box-sizing: border-box;
          font-family: Source Han Sans CN;
          font-weight: 400;
          font-size: 18px;
          > div {
            width: 201px;
            height: 37px;
            line-height: 37px;
            text-align: center;
            margin-left: 39px;
            background: rgba(46, 108, 147, 1);
            border: 1px solid rgba(28, 161, 220, 1);
            color: #84ddff;
            display: flex;
            justify-content: space-between;
            margin-bottom: 13px;
            span {
              display: inline-block;
              width: 48px;
              font-size: 24px;
              cursor: pointer;
            }
            span:nth-child(1):after {
              content: "|";
              position: relative;
              left: 15px;
              color: #1ca1dc;
            }
            span:nth-child(3):before {
              content: "|";
              position: relative;
              left: -15px;
              color: #1ca1dc;
            }
          }
        }
        .slider {
          display: flex;
          padding-left: 39px;
          span {
            line-height: 38px;
          }
          span:nth-child(3) {
            display: inline-block;
            width: 38px;
            height: 24px;
            background: rgba(46, 108, 147, 1);
            border: 1px solid rgba(28, 161, 220, 1);
            border-radius: 10px;
            text-align: center;
            position: relative;
            top: 5px;
            line-height: 24px;
          }
          /deep/.el-slider__bar {
            background-color: #84ddff;
          }
          /deep/.el-slider__button {
            background-color: #84ddff;
          }
        }
      }
    }
  }
  .video {
    box-sizing: border-box;
    padding: 21px 0px 21px 21px;
    // position: relative;
    .box {
      display: flex;
      justify-content: space-between;
      margin-right: 64px;
      .title {
        width: 202px;
        height: 45px;
        background: url(../../assets/images/device/info-title.png) no-repeat;
        line-height: 45px;
        padding-left: 30px;
        margin-bottom: 20px;
      }
    }
    .videoList {
      display: flex;
      flex-wrap: wrap;
      height: 710px;
      > div {
        box-sizing: border-box;
        height: 223px;

        margin-right: 19px;
        margin-bottom: 20px;
        background: url(../../assets/images/video.png) no-repeat center center;
        background-color: #00497c;
        cursor: pointer;
      }
      > div.active {
        border: 2px solid rgba(255, 244, 100, 1);
      }
    }
    .tools {
      position: absolute;
      bottom: 25px;
      width: 95%;
      height: 71px;
      background: url(../../assets/images/tool-bar.png) no-repeat;
      background-size: 100% 100%;
      display: flex;
      justify-content: space-between;
      .leftTool,
      .rightTool {
        position: relative;
        top: 22px;
        left: 40px;
        img {
          margin-right: 20px;
          cursor: pointer;
        }
      }
      .rightTool {
        margin-right: 90px;
        .pagination {
          display: inline-block;
          position: relative;
          top: -10px;
          margin-right: 20px;
          /deep/.el-pagination {
            button {
              background-color: transparent !important;
              i {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #23cefd;
                text-align: center;
                line-height: 20px;
              }
            }
          }
        }
      }
    }
  }
  // 全屏弹框
  // .fullContainer {
  //   position: fixed;
  //   top: 0;
  //   right: 0;
  //   left: 0;
  //   bottom: 0;
  //   z-index: 10000;
  //   background: #fff;
  //   display: flex;
  //   flex-wrap: wrap;
  //   overflow: visible;
  //   padding: 20px 30px;
  //   > div {
  //     // cursor: pointer;
  //     margin-right: 19px;
  //     margin-bottom: 20px;
  //     background: url(../../assets/images/video.png) no-repeat center center;
  //     background-color: #00497c;
  //   }
  // }

}
// 修改弹框样式
  .el-dialog__wrapper {
    overflow: visible;
    /deep/.el-dialog {
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        display: flex;
        flex-wrap: wrap;
        height: 100%;
        padding: 0 15px;
        > div {
          // cursor: pointer;
          margin-right: 19px;
          margin-bottom: 20px;
          background: url(../../assets/images/video.png) no-repeat center center;
          background-color: #00497c;
        }
      }
    }
  }
</style>
