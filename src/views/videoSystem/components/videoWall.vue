<template>
  <div class="playerStyle">
    <LivePlayer
      ref="playerCtrl"
      :videoUrl="videoInfo.streamUrl"
      :show-custom-button="false"
      :muted="false"
      :controls="false"
      :autoplay="true"
      oncontextmenu="return false"
      fluent
      :stretch="true"
      :live="videoInfo.isLive !==false"
      aspect="fullscreen"
      :poster="poster"
    >
      <div ref="playerArea" class="pointLayer" @dblclick="fullScreen">
        <div
          v-show="videoInfo.deviceTypeCode==='GDJK'&&videoInfo.isShowOperate||false"
          ref="drawBox"
          :class="{bg:showAR}"
        >
          <!-- canvas绘图 -->
          <canvas-area
            :canDraw="showCurindex===4"
            @canvasEnd="getPosition"
            :showMarkForm="showMarkForm"
            :tagType="ruleForm.tagType"
            :pointsArray="videoInfo.pointsArray"
            :showAR="showAR"
            @closeMarkForm="closeMarkForm"
            ref="drawArea"
          ></canvas-area>
          <template v-if="showAR">
            <div class="header" @dblclick.stop="stopEvent">AR实景地图指挥</div>
          </template>
          <div class="footer" @dblclick.stop="stopEvent">
            <a @mouseenter="showActive(1)" @mouseleave="showActive(0)" title="AR" @click="changeAR">
              <img :src="arPic" alt title="AR" />
              <img v-show="active === 1" class="hide_tab" :src="arSelectedPic" />
            </a>
            <a
              @mouseenter="showActive(2)"
              @mouseleave="showActive(0)"
              @click.stop="getTodayFire"
              title="火情报警"
            >
              <img :src="alarmPic" alt />
              <img v-show="active === 2" class="hide_tab" :src="alarmSelectedPic" />
            </a>
            <a
              @mouseenter="showActive(3)"
              @mouseleave="showActive(0)"
              title="抓取"
              @click.stop="showImg"
            >
              <img :src="capturePic" alt />
              <img v-show="active === 3" class="hide_tab" :src="captureSelectedPic" />
              <!-- 用于显示截取的图片 -->
              <img
                :src="`${picUrl}${cutImgUrl}`"
                class="cutImg"
                id="pic"
                v-show="showCutImg"
                @click.stop="cutDialogVisible=true;isAdd=true"
              />
            </a>
            <a
              @mouseenter="showActive(4)"
              @mouseleave="showActive(0)"
              title="图库"
              @click="getPicStorage"
            >
              <img :src="photoPic" alt />
              <img v-show="active === 4" class="hide_tab" :src="photoSelectedPic" />
            </a>
            <template v-if="showAR">
              <a
                @mouseenter="showActive(5)"
                @mouseleave="showActive(0)"
                title="标签管理"
                @click="showTagType"
              >
                <img :src="tagPic" alt />
                <img v-show="active === 5" class="hide_tab" :src="tagSelectedPic" />
              </a>
              <!-- <a @mouseenter="showActive(6)" @mouseleave="showActive(0)" title="搜索">
                <img :src="searchPic" alt />
                <img v-show="active === 6" class="hide_tab" :src="searchSelectedPic" />
              </a>
              <a
                @mouseenter="showActive(7)"
                @mouseleave="showActive(0)"
                title="设置"
                @click="showCurindex=6"
              >
                <img :src="settingPic" title="设置" alt />
                <img v-show="active === 7" class="hide_tab" :src="settingSelectedPic" />
              </a>-->
              <!-- 新增 -->
              <a
                @mouseenter="showActive(8)"
                @mouseleave="showActive(0)"
                title="退出全屏"
                @click="arExitFullScreen"
              >
                <img :src="fScreen" />
                <img v-show="active === 8" class="hide_tab" :src="fScreenSelected" />
              </a>
            </template>
          </div>
          <!-- 实时警情弹框 -->
          <div class="realPoliceInfo" v-show="showCurindex==1" @dblclick.stop="stopEvent">
            <div class="title">实时警情</div>
            <div class="content webFsScroll">
              <div class="item" v-for="(item,index) in todayFireArray" :key="index">
                <div class="pic">
                  <img :src="`${picUrl}${item.alarmPic}`" alt />
                </div>
                <div class="detail">
                  <p>时间：{{item.alarmTime}}</p>
                  <p>
                    地点：
                    <span
                      :title="item.alarmAddress"
                    >{{item.alarmAddress&&item.alarmAddress.length>9?item.alarmAddress.slice(0,9)+'.':'-'}}</span>
                  </p>
                  <p>坐标：{{item.alarmLongitude}},{{item.alarmLatitude}}</p>
                  <p>
                    类型：
                    <span
                      class="type"
                    >{{item.alarmTypeCode==='HUO'?'火点报警':item.alarmTypeCode==='YANWU'?'烟雾报警':'-'}}</span>
                  </p>
                </div>
              </div>
            </div>
            <img src="../../../assets/images/AR/X.png" @click="showCurindex=1000" />
          </div>
          <!-- 标签弹框 -->
          <div class="tagInfo" @dblclick.stop="stopEvent" v-show="showCurindex==4">
            <!-- <p>常用标签</p> -->
            <div>
              <div :class="{'active':ruleForm.tagType==='0'}" class="mar11">
                <img src="../../../assets/images/AR/high2.png" @click="changeType('0')" alt />
              </div>
              <p>高点监控</p>
            </div>
            <div>
              <div :class="{'active':ruleForm.tagType==='1'}" class="mar13">
                <img src="../../../assets/images/AR/build_icon.png" @click="changeType('1')" alt />
              </div>

              <p>建筑</p>
            </div>
            <div>
              <div :class="{'active':ruleForm.tagType==='2'}" class="mar13">
                <img src="../../../assets/images/AR/fire_icon.png" @click="changeType('2')" alt />
              </div>
              <p>消防力量</p>
            </div>
            <div>
              <div :class="{'active':ruleForm.tagType==='3'}" class="mar13">
                <img src="../../../assets/images/AR/forest_icon.png" @click="changeType('3')" alt />
              </div>

              <p>森林</p>
            </div>
            <div>
              <div :class="{'active':ruleForm.tagType==='4'}" class="mar13">
                <img src="../../../assets/images/AR/palace_icon.png" @click="changeType('4')" alt />
              </div>

              <p>重点场所</p>
            </div>
            <!-- <p>自定义标签</p> -->
            <div>
              <div :class="{'active':ruleForm.tagType==='11'}" class="mar12">
                <img src="../../../assets/images/AR/line.png" @click="changeType('11')" alt />
              </div>
              <p>线段</p>
            </div>
            <div>
              <div :class="{'active':ruleForm.tagType==='22'}" class="mar12">
                <img src="../../../assets/images/AR/line_close.png" @click="changeType('22')" alt />
              </div>

              <p>区域</p>
            </div>
            <img src="../../../assets/images/AR/X.png" alt @click="closeTagType" />
          </div>
          <!-- 图库弹框 -->
          <div class="picStorage" @dblclick.stop="stopEvent" v-show="showCurindex==3">
            <!-- 关闭按钮 -->
            <img src="../../../assets/images/AR/X.png" alt @click="showCurindex=1000" />
            <div>
              <span>起止时间：</span>
              <el-date-picker
                type="datetimerange"
                v-model="dateRange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :append-to-body="false"
                @change="getTimeRange"
                value-format="timestamp"
              ></el-date-picker>
            </div>
            <div class="box">
              <div class="item" v-for="(item,index) in picStorageArray" :key="index">
                <div class="container">
                  <img :src="`${picUrl}${item.filePath}`" />
                  <div class="mask">
                    <i class="el-icon-edit" @click.stop="editCurPic(item)"></i>
                    <i class="el-icon-delete" @click.stop="deleteCurPic(item)"></i>
                  </div>
                </div>
                <p>{{item.createTime|timeFormat}}</p>
                <p
                  :title="item.remark"
                >{{item.remark&&item.remark.length>9?item.remark.slice(0,9)+'.':item.remark}}</p>
              </div>
              <div class="empty" v-if="picStorageArray&&picStorageArray.length==0">暂无数据</div>
            </div>
            <el-pagination
              v-if="picStorageArray&&picStorageArray.length>0"
              background
              layout="total,prev, pager, next"
              :total="pageInfo.total"
              class="tablePagination"
              style="position:absolute;bottom: 25px;width: 774px;"
              popper-class="pageSelect"
              :page-size="pageInfo.pageSize"
              @current-change="handleCurrentChange"
              :current-page.sync="pageInfo.currentPage"
            ></el-pagination>
          </div>
          <!-- 设置弹框 -->
          <div class="settingInfo" v-show="showCurindex==6" @dblclick.stop="stopEvent">
            <div class="settingTitle">标签设置</div>
            <img src="../../../assets/images/AR/X.png" alt @click="showCurindex=1000" />
            <div class="operateBox">
              <div>
                <span>标签名称：</span>
                <el-input style="width:140px;" v-model.trim="tagName" placeholder="请输入标签名称"></el-input>
              </div>
              <div style="margin-left:44px;">
                <span>标签类型：</span>
                <el-select
                  style="width:140px"
                  v-model="tagType"
                  placeholder="请选择标签类型"
                  :popper-append-to-body="false"
                  popper-class="selectStyle"
                >
                  <el-option
                    v-for="item in tagArray"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <br />
              <div style="margin-top:14px;">
                <span>设备名称：</span>
                <el-input style="width:140px;" v-model.trim="deviceName" placeholder="请输入设备名称"></el-input>
              </div>
              <div style="margin-left:44px; margin-top:14px;">
                <span>启用状态：</span>
                <el-select
                  style="width:140px"
                  v-model="status"
                  placeholder="请选择"
                  :popper-append-to-body="false"
                  popper-class="selectStyle"
                >
                  <el-option label="启用" value="1"></el-option>
                  <el-option label="禁用" value="0"></el-option>
                </el-select>
              </div>
              <div class="icon">
                <img src="../../../assets/images/AR/search_icon.png" alt />
                <img src="../../../assets/images/AR/refresh.png" alt />
                <img src="../../../assets/images/AR/down.png" alt />
                <!-- <img src="../../../assets/images/AR/more.png" alt /> -->
              </div>
            </div>
            <el-table :data="tableData" style="width: 100%;margin-top:17px;" :stripe="true">
              <el-table-column prop="date" label="日期" width="180" align="center"></el-table-column>
              <el-table-column prop="name" label="姓名" width="180" align="center"></el-table-column>
              <el-table-column prop="address" label="地址" align="center"></el-table-column>
            </el-table>
            <el-pagination
              class="tablePagination"
              background
              layout="total, prev, pager, next"
              popper-class="pageSelect"
              :page-size="5"
              :total="1000"
            >></el-pagination>
          </div>
        </div>
      </div>
      <template v-if="showNotification">
        <!-- 警告 -->
        <div role="alert" class="el-notification right" style="top: 16px; z-index: 2000;">
          <i
            class="el-notification__icon"
            :class="{'el-icon-warning':infoObj.isWarning,'el-icon-success':infoObj.isSuccess,'el-icon-error':infoObj.isError}"
          ></i>
          <div class="el-notification__group is-with-icon">
            <h2 class="el-notification__title">{{infoObj.title}}</h2>
            <div class="el-notification__content">
              <p>{{infoObj.msg}}</p>
            </div>
            <div
              class="el-notification__closeBtn el-icon-close"
              @click.stop="showNotification=false"
            ></div>
          </div>
        </div>
      </template>
      <!-- 视频图标及标签 -->
      <div class="info">
        <span></span>
        <span>{{videoInfo.parentLabel}}</span>
      </div>
      <!-- 人员识别 -->
      <div class="fullScreenFace" v-show="videoInfo.positionList&&videoInfo.positionList.length>0">
        <span
          v-for="(item,index) in videoInfo.positionList"
          :key="index"
          :style="{left:item.left/1280*(videoInfo.isShowOperate?1920:playerWidth)+'px',top:item.top/720*(videoInfo.isShowOperate?1080:playerHeight)+'px',width:item.width/1280*(videoInfo.isShowOperate?1920:playerWidth)+'px',height:item.height/720*(videoInfo.isShowOperate?1080:playerHeight)+'px'}"
          :class="{ship:item.label==1}"
        ></span>
      </div>
      <!-- 刻度尺 -->
      <div class="rule" v-show="showAR">
        <!-- x轴箭头 -->
        <div class="horizontal">
          <span>0</span>
          <div :style="{left:(horizontalValue/360*800-7)+'px'}">
            <img :src="upPic" />
            <div>{{horizontalValue}}</div>
          </div>
          <span>360</span>
        </div>
        <!-- y轴箭头 -->
        <div class="vertical">
          <span>180</span>
          <div
            :style="{top:verticalValue< 0 ? 73 + String(verticalValue).slice(1) / 180 * 80 +'px': (73 - verticalValue / 180 * 80)+'px'}"
          >
            <div>{{verticalValue>0?verticalValue:String(verticalValue).slice(1)}}</div>
            <img :src="rightPic" />
          </div>
          <span>180</span>
        </div>
      </div>
      <!-- 自动巡航 -->
      <div
        class="cruise"
        v-show="videoInfo.deviceTypeCode==='GDJK'&&videoInfo.isShowOperate||false"
      >
        <template v-if="!showAR">
          <img
            :src="cruiseOpen?cruiseClosePic:cruiseOpenPic"
            @click.stop="changeCruise"
            :title="cruiseOpen?'关闭巡航':'开启巡航'"
          />
        </template>
        <template v-else>
          <img
            class="disabled"
            src="../../../assets/images/AR/cruise_disabled.png"
            title="
AR功能开启中，巡航操作暂不可用。"
          />
        </template>
      </div>
      <!-- 显示AR标签 -->
      <div
        class="fullScreenAr"
        v-show="showAR&&videoInfo.onePointArray&&videoInfo.onePointArray.length>0"
      >
        <div
          v-for="(item,index) in videoInfo.onePointArray"
          :class="{high:item.label==0,build:item.label==1,fire:item.label==2,forest:item.label==3,palace:item.label==4}"
          :key="index"
          :style="{
          left:item.label=='0'?(Number(item.left)/1280*1920-51.5)+'px':Number(item.left)/1280*1920+'px',
         top:item.label==0?((item.top/720)*1080-102)+'px':((item.top/720)*1080-58)+'px'}"
          :title="item.label==0?item.labelName:''"
        >
          <div v-show="item.label!=0">{{item.labelName}}</div>
        </div>
      </div>
      <!-- 新版云台操作 -->
      <div
        class="operate"
        v-show="videoInfo.deviceTypeCode==='GDJK'&&videoInfo.isShowOperate||false"
      >
        <div class="circle">
          <div
            v-for="(item,index) in 8"
            :key="index"
            @mousedown="startChange(index)"
            @mouseup="stopChange(index)"
          ></div>
        </div>
        <div class="extra">
          <div title="变倍" :class="{selected:curSelectedIcon==0}" @click="curSelectedIcon=0"></div>
          <div title="变焦" :class="{selected:curSelectedIcon==1}" @click="curSelectedIcon=1"></div>
          <div @mousedown="startChange(999)" @mouseup="stopChange(999)"></div>
          <div @click.stop="addStep" title="步速">
            <span>X{{step}}</span>
          </div>
          <div @mousedown="startChange(9999)" @mouseup="stopChange(9999)"></div>
          <span id="zoomValue">X{{zoomValue}}</span>
        </div>
      </div>
      <!-- 无人机指挥 -->
      <div
        class="droneControl"
        v-show="videoInfo.deviceTypeCode==='WRJ'&&videoInfo.isShowOperate&&bIsFullScreenVideo===true"
      >
        <div class="header stretchIMG">
          <div class="exitFullScreen" @click="exitFullScreen">
            <span></span>
            <span>退出全屏</span>
          </div>
        </div>
        <div class="bottom stretchIMG"></div>
        <div class="menu stretchIMG">
          <div
            class="itemBtn"
            :class="{detectBtn:!bDetectStatus,detectBtnActive:bDetectStatus}"
            @click.stop="switchDetectStatus"
          ></div>
          <div class="itemBtn puzzleBtn" @click.stop="switchPuzzlingStatus">
            <div class="scanningStyle" v-show="bPuzzlingStatus"></div>
          </div>
          <div
            class="itemBtn"
            :class="{pointBtn:!bSetPointStatus,pointBtnActive:bSetPointStatus}"
            @click.stop="switchSetPointStatus"
          ></div>
          <div
            class="itemBtn"
            :class="{routeBtn:!bShowRouteStatus,routeBtnActive:bShowRouteStatus}"
            @click.stop="switchShowRouteStatus"
          ></div>
        </div>
        <div class="realInfo leftInfo" v-show="di_height !== ''">
          <span class="leftMargin">高度:</span>
          <span>{{di_height}}m</span>
          <span class="leftMargin">H.S:</span>
          <span>{{di_hSpeed}}m/s</span>
          <span class="leftMargin">V.S:</span>
          <span>{{di_vSpeed}}m/s</span>
        </div>
        <div class="realInfo rightInfo" v-show="di_battery !== ''">
          <span>电量:</span>
          <span class="rightMargin">{{di_battery}}%</span>
          <span>经度:</span>
          <span class="rightMargin">{{di_longitude}}</span>
          <span>纬度:</span>
          <span class="rightMargin">{{di_latitude}}</span>
        </div>
        <div class="mapOuterBox" :class="{mapOuterBoxFullScreen:bIsFullscreenMap}">
          <div class="mapArea" :class="{mapAreaFullScreen:bIsFullscreenMap}">
            <gMap
              ref="gduMap"
              handleType="devMap"
              :baseMapIndex="0"
              :bShowSimpleSearchTools="false"
              :bShowBasic="bIsFullscreenMap"
              :bShowSelLayer="false"
              :bShowMeasure="false"
              :bShowLonLat="false"
              :bAutoLocate="true"
              :bDbClickStyle="true"
              @mapDbClickEvent="mapDbClickEventCB"
            ></gMap>
            <div class="sizeChange" v-show="!bIsFullscreenMap" @click="changeVideoAndMap" />
          </div>
        </div>
        <div class="smallVideoStyle" v-if="bIsFullscreenMap===true&&bIsFullScreenVideo===true">
          <div class="smallVideoArea">
            <div class="smallVideoBox" @dblclick="changeVideoAndMap">
              <LivePlayer
                ref="smallPlayerCtrl"
                :videoUrl="videoInfo.streamUrl"
                :show-custom-button="false"
                :muted="false"
                :controls="false"
                :autoplay="true"
                oncontextmenu="return false"
                fluent
                :stretch="true"
                :live="videoInfo.isLive !==false"
                aspect="fullscreen"
              />
              <div class="sizeChange" @click="changeVideoAndMap" />
            </div>
          </div>
        </div>
        <div class="puzzlingBox" v-if="bShowPuzzlingBox">
          <div class="pbTitle">
            <div class="titleImg"></div>
            <div class="titleText">正射拼图</div>
            <el-date-picker
              v-model="puzzleDate"
              type="date"
              class="titleDate"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              :append-to-body="false"
              @change="puzzleDateChange"
              value-format="timestamp"
            ></el-date-picker>
            <div class="titleClose" @click="bShowPuzzlingBox=false"></div>
          </div>
          <div class="puzzlingItems webFsScroll">
            <div
              class="pItem"
              v-for="(item,index) in puzzleDataArray"
              :key="index"
              :class="{pItemBottom:index != puzzleDataArray.length-1}"
            >
              <img class="itemImg" :src="item.imgUrl" />
              <div class="itemTime commonText">{{item.time}}</div>
              <div class="itemAddr commonText">{{item.addr}}</div>
              <div
                class="itemStatus commonText"
                :class="{isPuzzling:item.status === 0,puzzleDone:item.status === 1}"
              >
                <span v-show="item.status === 0">拼图中...</span>
                <span v-show="item.status === 1">已完成</span>
              </div>
              <div class="itemDetail commonText">查看</div>
            </div>
            <div
              class="noPuzzleText"
              v-if="puzzleDataArray&&puzzleDataArray.length==0"
            >今日无正射拼图任务，可切换其他日期查看</div>
          </div>
          <div class="puzzlingPages">
            <el-pagination
              background
              layout="total, prev, pager, next"
              :total="puzzlePageInfo.total"
              class="tablePagination"
              :page-size="puzzlePageInfo.pageSize"
              @current-change="puzzleCurrentPageChange"
              :current-page.sync="puzzlePageInfo.currentPage"
            ></el-pagination>
          </div>
        </div>
      </div>
      <!-- 添加标签的弹框 -->
      <div class="fullScreenMark" v-show="showMarkForm">
        <img src="../../../assets/images/AR/close.png" @click="resetForm('ruleForm')" />
        <h3>标签属性</h3>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="90px"
          class="demo-ruleForm"
          label-position="left"
        >
          <el-form-item
            label="标签类型:"
            prop="tagType"
            class="selectBg"
            :style="{marginBottom:ruleForm.tagType==='11'||ruleForm.tagType==='22'?'6px':'16px'}"
          >
            <template
              v-if="ruleForm.tagType==='0'||ruleForm.tagType==='1'||ruleForm.tagType==='2'||ruleForm.tagType==='3'||ruleForm.tagType==='4'"
            >
              <el-select
                style="width:168px;"
                v-model="ruleForm.tagType"
                placeholder="请选择标签类型"
                :popper-append-to-body="false"
                popper-class="selectStyle"
              >
                <el-option
                  v-for="item in tageTypeArray"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
            <span v-else>{{ruleForm.tagType==='11'?'自定义线段':ruleForm.tagType==='22'?'自定义区域':'-'}}</span>
          </el-form-item>
          <el-form-item label="标签名称:" prop="tagName" class="tagName">
            <el-input
              v-model.trim="ruleForm.tagName"
              placeholder="请输入标签名称"
              style="width: 168px;color:#fff"
            ></el-input>
          </el-form-item>
          <template v-if="ruleForm.tagType==='11'||ruleForm.tagType==='22'">
            <el-form-item label="线段类型:" class="selectBg" style="margin-top:16px" prop="lineType">
              <el-select
                style="width:168px;"
                placeholder="请选择"
                :popper-append-to-body="false"
                popper-class="selectStyle"
                @change="changeSelection"
                v-model="ruleForm.lineType"
                ref="lineSelect"
              >
                <el-option
                  v-for="item in lineOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <img :src="item.label" width="128px" />
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="线宽:" style="margin-top:12px" prop="lineWidth">
              <el-input-number
                v-model="ruleForm.lineWidth"
                :min="1"
                :max="10000"
                style="width:96px;"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="线段颜色:" style="margin-top:8px;" prop="lineColor" class="labelColor">
              <!-- <el-color-picker  size="small" show-alpha  :picker-append-to-body="false" popper-class="selectStyle"></el-color-picker> -->
              <input
                :default-value="ruleForm.lineColor"
                v-model="ruleForm.lineColor"
                type="color"
                @input="updateData"
                style="width:168px;"
              />
            </el-form-item>
          </template>
          <template v-if="ruleForm.tagType==='22'">
            <el-form-item
              label="区域颜色:"
              style="margin-top:10px;"
              prop="fillColor"
              class="labelColor"
            >
              <input
                :default-value="ruleForm.fillColor"
                v-model="ruleForm.fillColor"
                type="color"
                style="width:168px;"
              />
              <!-- <el-color-picker v-model="ruleForm.fillColor" size="small" show-alpha  :append-to-body="false"  popper-class="selectStyle"></el-color-picker> -->
            </el-form-item>
            <el-form-item label="不透明度:" prop="opacity">
              <el-slider v-model="ruleForm.opacity"></el-slider>
              <span>{{ruleForm.opacity}}%</span>
            </el-form-item>
          </template>
          <el-form-item class="btns">
            <el-button
              type="primary"
              @click="resetForm('ruleForm')"
              style="background:#18223A;color:#209CDF;border: 1px solid #209CDF;width:64px!important"
            >取消</el-button>
            <el-button
              type="primary"
              @click="submitForm('ruleForm')"
              style="width:64px!important"
            >确定</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-dialog
        :visible.sync="cutDialogVisible"
        class="cutDialog"
        :close-on-click-modal="false"
        :show-close="false"
        :before-close="clearRemark"
        :append-to-body="false"
      >
        <img :src="`${picUrl}${cutImgUrl}`" width="743px" height="428px" alt />
        <span slot="footer" class="dialog-footer">
          <div class="remark">
            <div class="replain">
              <span>说明：</span>
              <el-input v-model.trim="remark" placeholder="请输入" :maxlength="27"></el-input>
            </div>
            <div>
              <el-button @click="clearRemark" style="width:87px;">取 消</el-button>
              <el-button type="primary" @click.stop="confirm" style="width:87px;">确 定</el-button>
            </div>
          </div>
        </span>
      </el-dialog>
    </LivePlayer>
  </div>
</template>
<script>
import LivePlayer from '@liveqing/liveplayer'
import droneInfoMixin from '../../../utils/droneInfoMixin'
import canvasArea from './canvasArea'
import { throttle, replaceStreamUrl } from '../../../utils/public.js'
import globalApi from '../../../utils/globalApi'
import { api } from '@/api/videoSystem/realVideo'
import { timeFormat } from '@/utils/date'
import MqttService from '@/utils/mqttService'
import { EventBus } from '@/utils/eventBus.js'
export default {
  data () {
    return {
      timer: null, // 保存计时器
      picUrl: globalApi.baseUrl + '/video-service2', // 图片前缀
      todayFireArray: [], // 保存火情火点数据
      showCutImg: false, // 是否显示抓拍的图片 默认不显示
      cutImgUrl: '', // 显示抓取的图片
      cutDialogVisible: false, // 抓取弹窗
      isAdd: true, // 默认是添加说明
      imgId: '', // 保存抓取图片id
      remark: '', // 说明文字
      active: '', // 动态显示悬停相关图标
      showAR: false, // 显示AR
      showCurindex: 1000, // 显示弹框
      // 新增巡航图标
      cruiseOpen: true,
      cruiseOpenPic: require('@/assets/images/AR/cruise_on.png'),
      cruiseClosePic: require('@/assets/images/AR/cruise_off.png'),
      upPic: require('@/assets/images/AR/up.png'),
      rightPic: require('@/assets/images/AR/right.png'),
      horizontalValue: 0, // 水平角度
      verticalValue: 0, // 垂直角度
      zoomValue: 0, // 变倍值
      arPic: require('@/assets/images/AR/ar.png'),
      arSelectedPic: require('@/assets/images/AR/ar_selected.png'),

      alarmPic: require('@/assets/images/AR/alarm.png'),
      alarmSelectedPic: require('@/assets/images/AR/alarm_selected.png'),

      capturePic: require('@/assets/images/AR/capature.png'),
      captureSelectedPic: require('@/assets/images/AR/capature_selected.png'),

      photoPic: require('@/assets/images/AR/photo.png'),
      photoSelectedPic: require('@/assets/images/AR/photo_selected.png'),

      tagPic: require('@/assets/images/AR/tag.png'),
      tagSelectedPic: require('@/assets/images/AR/tag_selected.png'),

      searchPic: require('@/assets/images/AR/search.png'),
      searchSelectedPic: require('@/assets/images/AR/search_selected.png'),

      settingPic: require('@/assets/images/AR/setting.png'),
      settingSelectedPic: require('@/assets/images/AR/setting_selected.png'),

      fScreen: require('../../../assets/images/AR/exitFull.png'),
      fScreenSelected: require('../../../assets/images/AR/exitFull_selected.png'),

      curSelectedIcon: 0, // 云台变倍或变焦 默认选中 0变倍 1变焦
      showMarkForm: false,
      curPositionObj: {}, // 保存当前位置相关坐标
      // showTagInfo: false, // 标签弹框 默认不显示
      // showPicStorage: false, // 图库弹框 默认不显示
      // showSetting: false, // 设置弹框
      tagName: '', // 标签名称
      deviceName: '', // 设备名称
      tagType: '', // 标签类型
      tagArray: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      status: '0', // 启用类型
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      curPositionArray: [], // 保存当前位置相关坐标
      // showTagInfo: false, // 标签弹框 默认不显示
      // showPicStorage: false, // 图库弹框 默认不显示
      // showSetting: false, // 设置弹框
      // 图库的分页信息
      pageInfo: {
        total: 1000,
        currentPage: 1,
        pageSize: 15
      },
      dateRange: [], // 保存图库日期的数组
      picStorageArray: [], // 保存图库数据
      // 拼图的分页信息
      puzzlePageInfo: {
        total: 9,
        currentPage: 1,
        pageSize: 5
      },
      puzzleDataArray: [], // 拼图列表数据
      puzzleDate: '',
      // 标签属性
      ruleForm: {
        tagName: '',
        tagType: '0',
        lineType: '0',
        lineWidth: 3,
        lineColor: '#ffde00',
        fillColor: '#00ff48',
        opacity: 60
      },
      rules: {
        tagName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8个字符', trigger: 'blur' }
        ],
        tagType: [
          { required: true, message: '请选择标签类型', trigger: 'change,blur' }
        ],
        lineType: [
          { required: true, message: '请选择线段类型', trigger: 'change,blur' }
        ],
        lineWidth: [
          { required: true, message: '请选择线宽', trigger: 'change,blur' }
        ],
        lineColor: [
          { required: true, message: '请选择线段颜色', trigger: 'change,blur' }
        ],
        fillColor: [
          { required: true, message: '请选择区域颜色', trigger: 'change,blur' }
        ],
        opacity: [
          { required: true, message: '请选择不透明度', trigger: 'change,blur' }
        ]
      },
      // 线段类型
      lineOption: [
        {
          label: require('../../../assets/images/AR/line_1.png'),
          value: '0'
        },
        {
          label: require('../../../assets/images/AR/line_2.png'),
          value: '1'
        },
        {
          label: require('../../../assets/images/AR/line_3.png'),
          value: '2'
        },
        {
          label: require('../../../assets/images/AR/line_4.png'),
          value: '3'
        },
        {
          label: require('../../../assets/images/AR/line_5.png'),
          value: '4'
        },
        {
          label: require('../../../assets/images/AR/line_6.png'),
          value: '5'
        }
      ],
      tageTypeArray: [
        {
          id: '0',
          name: '高点监控'
        },
        {
          id: '1',
          name: '建筑'
        },
        {
          id: '2',
          name: '消防力量'
        },
        {
          id: '3',
          name: '森林'
        },
        {
          id: '4',
          name: '重点场所'
        }
      ],
      showNotification: false,
      infoObj: {
        title: '',
        isWarning: false,
        isSuccess: false,
        isError: false,
        msg: ''
      }, // 提示信息
      isSub: false, // 是否监听播放进度改变
      isUpdateTime: true,
      curTime: 0,
      curUrl: '',
      activeCurIcon: '', // 默认选中云台的图标
      zoomSpeed: 0, // 变倍
      focusSpeed: 0, // 变焦
      lrisSpeed: 0, // 光圈
      step: 4, // 步速值
      bIsFullScreenVideo: false, // 播放器是否全屏
      bIsFullscreenMap: false, // 小地图是否全屏
      recordNums: {
        leftUp: 0,
        up: 0,
        rightUp: 0,
        left: 0,
        right: 0,
        leftDown: 0,
        down: 0,
        rightDown: 0,
        zoomAdd: 0,
        zoomMinus: 0,
        focusAdd: 0,
        focusMinus: 0,
        lrisAdd: 0,
        lrisMinus: 0
      },
      lastState: '',
      poster: require('../../../assets/images/loading.gif')
    }
  },

  mixins: [droneInfoMixin],

  components: {
    LivePlayer,
    canvasArea
  },

  props: {
    videoInfo: {
      default: () => {}
    },
    playerWidth: [Number, String],
    playerHeight: [Number, String]
  },

  computed: {
    deviceCode () {
      return this.videoInfo.deviceCode
    }
  },

  watch: {
    curTime (val) {
      var r = this.videoInfo.records.find(x => x.url === this.curUrl)
      if (r !== undefined && this.isUpdateTime) {
        this.$emit('timeupdateEvent', this.curTime + r.start * 60)
      }
    },
    deviceCode (val) {
      this.setDroneDevCode(val)
    },
    'videoInfo.isShowOperate' (nv, ov) {
      if (nv) {
        if (this.videoInfo.deviceTypeCode === 'GDJK') {
          // 开启人员识别
          new MqttService().client.send(
            'video/start/algorithm',
            JSON.stringify({
              deviceCode: this.videoInfo.deviceCode,
              channelId: this.videoInfo.streamType,
              streamUrl: this.videoInfo.streamUrl,
              isOpen: 1
            })
          )
          console.log('开启人员识别')
        }
      } else {
        if (this.videoInfo.deviceTypeCode === 'GDJK') {
          // 关闭人员识别
          new MqttService().client.send(
            'video/stop/algorithm',
            JSON.stringify({
              deviceCode: this.videoInfo.deviceCode,
              channelId: this.videoInfo.streamType,
              streamUrl: this.videoInfo.streamUrl,
              isOpen: 0
            })
          )
          console.log('关闭人员识别')
        }
      }
    }
  },

  destroyed () {
    if (this.videoInfo.isLive !== false) {
      document.removeEventListener('visibilitychange', this.reloadVideo)
      EventBus.$off('streamHadNotData')
    }
  },

  mounted () {
    this.bShowPuzzleInMap = true
    // 如果是回放
    if (this.videoInfo.isLive === false) {
      this.subEnded()
      this.subTimeupdate(this.videoInfo.timeupdate)
      this.curUrl = this.videoInfo.streamUrl
    }
    this.setDroneDevCode(this.videoInfo.deviceCode)

    var elementResizeDetectorMaker = require('element-resize-detector')
    // this.erd = elementResizeDetectorMaker()
    this.erd = elementResizeDetectorMaker({
      strategy: 'scroll', // <- For ultra performance.
      callOnAdd: true
      // debug: false
    })
    this.setPlayerSizeListener()

    this.puzzleDataArray = [
      {
        imgUrl: '',
        time: '2020.08.22 19:32:55',
        addr: '江夏中队无人机',
        status: 0
      },
      {
        imgUrl: '',
        time: '2020.08.22 19:32:55',
        addr: '江夏中队无人机',
        status: 1
      },
      {
        imgUrl: '',
        time: '2020.08.22 19:32:55',
        addr: '江夏中队无人机',
        status: 1
      }
    ]
    this.puzzlePageInfo.total = this.puzzleDataArray.length
    if (this.videoInfo.isLive !== false) {
      document.addEventListener('visibilitychange', this.reloadVideo)
      EventBus.$on('streamHadNotData', info => {
        info.url = replaceStreamUrl(info.url, globalApi.baseUrl)
        if (info.url === this.videoInfo.streamUrl) {
          console.log(
            new Date().format('yyyy-MM-dd hh:mm:ss.S') +
              '  receive streamHadNotData and reloadVideo'
          )
          this.videoInfo.streamUrl = ''
          this.$nextTick(() => {
            this.videoInfo.streamUrl = info.url
          })
        }
      })
    }
    const me = this
    this.$refs.playerCtrl.player.on('error', function (error) {
      if (me.videoInfo.isLive === false) {
        console.log(me.curUrl + 'error: ' + JSON.stringify(error))
      } else console.log(me.videoInfo.streamUrl + 'error: ' + JSON.stringify(error))
    })
  },

  methods: {
    /**
     * 重新加载视频（最小化还原，或者浏览器tab页切换)
     */
    reloadVideo () {
      if (
        document.visibilityState === 'visible' &&
        this.lastState === 'hidden'
      ) {
        const url = this.videoInfo.streamUrl
        this.videoInfo.streamUrl = ''
        this.$nextTick(() => {
          this.videoInfo.streamUrl = url
        })
      }
      this.lastState = document.visibilityState
    },
    // 点击步速
    addStep () {
      ++this.step
      this.step = this.step > 8 ? 1 : this.step
    },
    // 鼠标悬停显示的图片
    showActive (index) {
      this.active = index
    },
    // 获取云台信息
    getPtzInfo () {
      const params = {
        deviceCode: this.videoInfo.deviceCode,
        channelId: this.videoInfo.streamType
      }
      this.$axios.post(api.getPtzInfo, params).then(res => {
        if (res && res.data && res.data.code === 0) {
          const data = res.data.data
          this.horizontalValue = data.nPTZPan
          this.verticalValue = data.nPTZTilt
          this.zoomValue = data.nZoomValue
          document.querySelector('.extra #zoomValue').style.opacity = 1
          setTimeout(() => {
            document.querySelector('.extra #zoomValue').style.opacity = 0
          }, 2000)
        }
      })
    },
    // 显示与隐藏AR
    changeAR () {
      this.showAR = !this.showAR
      if (this.showAR) {
        this.getPtzInfo()
        // 开启AR
        new MqttService().client.send(
          'video/start/arAlgorithm',
          JSON.stringify({
            deviceCode: this.videoInfo.deviceCode,
            channelId: this.videoInfo.streamType,
            streamUrl: this.videoInfo.streamUrl,
            isOpen: 1
          })
        )
      } else {
        this.resetForm('ruleForm')
        this.showCurindex = 1000

        // 关闭AR
        new MqttService().client.send(
          'video/stop/arAlgorithm',
          JSON.stringify({
            deviceCode: this.videoInfo.deviceCode,
            channelId: this.videoInfo.streamType,
            streamUrl: this.videoInfo.streamUrl,
            isOpen: 0
          })
        )
      }
    },
    // 显示标签弹框
    showTagType () {
      this.showCurindex = 4
      // 开启ar标记
      new MqttService().client.send(
        'video/webStartArMark',
        JSON.stringify({
          deviceCode: this.videoInfo.deviceCode,
          channelId: this.videoInfo.streamType
        })
      )
      // 关闭AR
      new MqttService().client.send(
        'video/stop/arAlgorithm',
        JSON.stringify({
          deviceCode: this.videoInfo.deviceCode,
          channelId: this.videoInfo.streamType,
          streamUrl: this.videoInfo.streamUrl,
          isOpen: 0
        })
      )
    },
    // add 切换标签类型
    changeType (type) {
      // 先重置 再设置类型
      this.resetForm('ruleForm')
      this.ruleForm.tagType = type
      EventBus.$emit('typeChange')
    },
    // add 关闭标签类型弹框
    closeTagType () {
      // 防止绘制不双击结束，直接点关闭按钮 先重置，再隐藏弹框
      this.resetForm('ruleForm')
      this.showCurindex = 1000
      // 开启AR
      new MqttService().client.send(
        'video/start/arAlgorithm',
        JSON.stringify({
          deviceCode: this.videoInfo.deviceCode,
          channelId: this.videoInfo.streamType,
          streamUrl: this.videoInfo.streamUrl,
          isOpen: 1
        })
      )
    },
    // 鼠标单击若标签弹框此时已打开
    closeMarkForm () {
      this.resetForm('ruleForm')
    },
    // 退出全屏
    arExitFullScreen () {
      if (this.showCurindex === 4) {
        this.resetForm('ruleForm')
      }
      this.showCurindex = 1000
      this.exitFullScreen()
    },
    // 获取今日警情
    getTodayFire () {
      this.showCurindex = 1
      const params = {
        deviceCode: this.videoInfo.deviceCode,
        streamCode: this.videoInfo.streamType,
        pageSize: 1000000,
        timeBegin: new Date(new Date().toLocaleDateString()).getTime()
      }
      this.$axios.get(api.todayAlarm, { params }).then(res => {
        if (res && res.data && res.data.code === 0) {
          const data = res.data.data.data
          data.forEach(element => {
            element.alarmTime = timeFormat(element.alarmTime)
            if (element.alarmPicList && element.alarmPicList.length > 0) {
              element.alarmPic = element.alarmPicList[0].picPath
            }
          })
          this.todayFireArray = data
        }
      })
    },
    // 点击抓取，显示抓拍图片
    showImg: throttle(function () {
      // 防止抓拍时，有显示其它弹框
      this.showCurindex = 1000
      // 显示抓取的图片
      const params = {
        deviceCode: this.videoInfo.deviceCode,
        channleId: this.videoInfo.streamType
      }
      this.$axios.post(api.deviceSnap, params).then(res => {
        if (res && res.data && res.data.code === 0) {
          this.showNotification = true
          this.infoObj.isWarning = false
          this.infoObj.isError = false
          this.infoObj.isSuccess = true
          this.infoObj.title = '成功'
          this.infoObj.msg = '抓取成功！'
          setTimeout(() => {
            this.showNotification = false
          }, 3000)
          this.showCutImg = true
          this.imgId = res.data.data.id
          this.cutImgUrl = res.data.data.filePath
          setTimeout(() => {
            this.showCutImg = false
          }, 4000)
        }
      })
    }, 5000),
    // 点击确定按钮
    confirm () {
      // 防止此时设备下线
      if (Object.keys(this.videoInfo).length === 0) {
        this.showNotification = true
        this.infoObj.isWarning = true
        this.infoObj.isError = false
        this.infoObj.isSuccess = false
        this.infoObj.title = '警告'
        this.infoObj.msg = '请先选择设备！'
        setTimeout(() => {
          this.showNotification = false
        }, 3000)
        return
      }
      const params = {
        id: this.imgId,
        deviceCode: this.videoInfo.deviceCode,
        filePath: this.cutImgUrl,
        channelId: this.videoInfo.streamType,
        remark: this.remark
      }
      this.$axios.post(api.deviceUpdate, params).then(res => {
        if (res && res.data && res.data.code === 0) {
          if (!this.isAdd) {
            this.pageInfo.currentPage = 1
            this.getSnapList()
          }
          this.showNotification = true
          this.infoObj.isWarning = false
          this.infoObj.isError = false
          this.infoObj.isSuccess = true
          this.infoObj.title = '成功'
          this.infoObj.msg = this.isAdd ? '添加说明成功！' : '修改说明成功'
          setTimeout(() => {
            this.showNotification = false
          }, 3000)
          this.clearRemark()
        }
      })
    },
    // 重置抓拍弹框
    clearRemark () {
      this.cutDialogVisible = false
      this.isAdd = true
      this.remark = ''
    },
    // 点击图库 显示图库弹框 获取图库数据
    getPicStorage () {
      this.showCurindex = 3
      this.pageInfo.currentPage = 1
      this.getSnapList()
    },
    // 获取图库列表
    getSnapList () {
      console.log(this.dateRange)
      const params = {
        deviceCode: this.videoInfo.deviceCode,
        channelId: this.videoInfo.streamType,
        currentPage: this.pageInfo.currentPage,
        pageSize: this.pageInfo.pageSize,
        dates: this.dateRange
      }
      this.$axios.get(api.getSnapList, { params }).then(res => {
        if (res && res.data && res.data.code === 0) {
          this.picStorageArray = res.data.data.data
          this.pageInfo.total = res.data.data.paginator.totalCount
        } else {
          this.picStorageArray = []
          this.pageInfo.total = 0
        }
      })
    },
    // 选择图库时间
    getTimeRange () {
      console.log(this.dateRange)
      this.pageInfo.currentPage = 1
      this.getSnapList()
    },
    // 获取当前页
    handleCurrentChange (val) {
      this.pageInfo.currentPage = val
      console.log(`当前页: ${val}`)
      this.getSnapList()
    },
    // 拼图列表改变当前页
    puzzleCurrentPageChange (val) {
      this.puzzlePageInfo.currentPage = val
      console.log(`puzzleCurrentPageChange当前页: ${val}`)
      // this.getPuzzleList()
    },
    // 改变拼图时间
    puzzleDateChange () {
      console.log('puzzleDateChange:', this.puzzleDate)
      // this.getPuzzleList()
    },
    // 编辑当前图片
    editCurPic (item) {
      this.isAdd = false
      this.cutDialogVisible = true
      const curData = JSON.parse(JSON.stringify(item))
      this.cutImgUrl = curData.filePath
      this.remark = curData.remark || ''
      this.imgId = curData.id
    },
    // 删除当前图片
    deleteCurPic (item) {
      this.$axios
        .get(api.deleteSnapList, { params: { id: item.id } })
        .then(res => {
          if (res && res.data && res.data.code === 0) {
            this.showNotification = true
            this.infoObj.isWarning = false
            this.infoObj.isError = false
            this.infoObj.isSuccess = true
            this.infoObj.title = '成功'
            this.infoObj.msg = '删除成功'
            setTimeout(() => {
              this.showNotification = false
            }, 3000)
            this.pageInfo.currentPage = 1
            this.getSnapList()
          }
        })
    },
    setPlayerSizeListener () {
      var me = this
      this.erd.listenTo(this.$refs.playerArea, function (element) {
        var width = element.offsetWidth
        // var height = element.offsetHeight
        // console.log(width, element.clientWidth, element.clientWidth, element.style.width)
        // if (width === window.screen.width && height === window.screen.height) {
        if (width === window.screen.width) {
          me.bIsFullScreenVideo = true
          me.$emit('fullscreenvideo', { info: me.videoInfo, bfull: true })
        } else {
          me.bIsFullScreenVideo = false
          me.$refs.gduMap.closeAllPopover()

          // 都不显示
          me.showCurindex = 1000
          me.clearRemark()
          me.$emit('fullscreenvideo', { info: me.videoInfo, bfull: false })
          me.resetForm('ruleForm')
          // 关闭AR
          if (me.showAR) {
            new MqttService().client.send(
              'video/stop/arAlgorithm',
              JSON.stringify({
                deviceCode: me.videoInfo.deviceCode,
                channelId: me.videoInfo.streamType,
                streamUrl: me.videoInfo.streamUrl,
                isOpen: 0
              })
            )
            console.log('关闭AR')
          }
          me.showAR && (me.showAR = false)
        }
      })
    },
    // 获取位置信息
    getPosition (curPosition) {
      console.log('转换之前-前端绘制的坐标', curPosition)
      // if (curPosition.width > 0) {
      const positionArray = JSON.parse(JSON.stringify(curPosition))
      const totalPosition = []
      positionArray.forEach(item => {
        totalPosition.push({
          x: Math.round((item.x / 1920) * 1280 * 100) / 100,
          y: Math.round((item.y / 1080) * 720 * 100) / 100
          // width: Math.round((item.width / 1920) * 1280 * 100) / 100,
          // height: Math.round((item.height / 1080) * 720 * 100) / 100
        })
      })
      console.log('转换之后-前端绘制的坐标', totalPosition)
      this.curPositionArray = totalPosition
      this.showMarkForm = true
      if (this.ruleForm.tagType === '11' || this.ruleForm.tagType === '22') {
        // 设置默认线段类型
        this.changeSelection()
      }
    },
    // 线段类型下拉框改变事件
    changeSelection () {
      const mark = this.ruleForm.lineType
      for (const index in this.lineOption) {
        const item = this.lineOption[index]
        const value = item.value
        if (mark === value) {
          this.$nextTick(() => {
            this.$refs.lineSelect.$el.children[0].children[0].setAttribute(
              'style',
              'background:url(' +
                item.label +
                ') no-repeat;color:#fff;text-indent: -9999px;background-position: center center'
            )
          })
        }
      }
    },
    updateData (val) {
      console.log(this.ruleForm.lineColor)
    },
    // 表单提交
    submitForm (formName) {
      console.log(this.ruleForm.tagType)
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log('成功')
          // this.createImgDom(this.ruleForm.tagType)
          // 成功之后调用该方法获取坐标信息
          // this.$refs.drawArea.clearReact()
          // 标签名称和标签类型校验成功之后 调接口  获取数据  无需手动创建dom结构
          // this.showNotification = true
          // this.infoObj.isSuccess = true
          // this.infoObj.isError = false
          // this.infoObj.msg = 'SDFSDFSDF'
          // setTimeout(() => {
          //   this.showNotification = false
          // }, 3000)

          // this.createTag(this.ruleForm, this.curPositionObj)
          const params = {
            deviceCode: this.videoInfo.deviceCode,
            channelId: this.videoInfo.streamType,
            streamUrl: this.videoInfo.streamUrl,
            pointsArray: this.curPositionArray,
            label: this.ruleForm.tagType,
            labelName: this.ruleForm.tagName,
            // x: this.curPositionObj.x,
            // y: this.curPositionObj.y,
            // width: this.curPositionObj.width,
            // height: this.curPositionObj.height,
            isOpen: 1
          }
          if (
            this.ruleForm.tagType === '11' ||
            this.ruleForm.tagType === '22'
          ) {
            params.lineType = this.ruleForm.lineType
            params.lineWidth = this.ruleForm.lineWidth
            params.lineColor = this.ruleForm.lineColor
          }
          if (this.ruleForm.tagType === '22') {
            params.fillColor = this.ruleForm.fillColor
            params.opacity = this.ruleForm.opacity
          }
          new MqttService().client.send(
            'video/add/arAlgorithm',
            JSON.stringify(params)
          )
          console.log('添加时传给后台的数据', params)
          console.log('添加时传给后台的坐标', this.curPositionArray)
          this.resetForm('ruleForm')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单
    resetForm (formName) {
      // 防止第一次全屏时，找不到canvas对象
      if (this.showCurindex === 4) {
        this.$refs.drawArea.clearReact()
      }
      this.showMarkForm = false
      this.$refs[formName].resetFields()
    },
    // 显示表单
    showMarkDialog (e) {
      if (this.bIsFullScreenVideo === true) {
        // console.log(e.pageX, e.pageY)
        // this.videoInfo.streamUrl = 'ws://111.47.13.103:40007/live/34020000001310000005.flv'
        // setTimeout(() => {
        //   this.$refs.playerCtrl.player.requestFullscreen()
        // }, 500)
        if (this.showMarkForm) {
          return
        }
        this.showMarkForm = true
      }
    },
    // 阻止冒泡
    stopEvent (event) {
      event.stopPropagation()
      return false
    },
    play () {
      this.$refs.playerCtrl.player.play()
    },
    stopAll () {
      var videoInfo = { srcUrl: '', isLive: true }
      this.$emit('update:videoInfo', videoInfo)
    },

    /**
     * 跳转回放记录
     * @param {String} url 跳转记录的url
     * @param {Boolean} jump 是否需要快进
     * @param {jumpSeconds} url 快进的秒数
     */
    jumpRecord (url, jump, jumpSeconds) {
      // 获取暂停状态
      var isPause = this.$refs.playerCtrl.player.paused()
      if (this.curUrl === url) {
        jumpSeconds = jump === true ? jumpSeconds : 1
        // 防止当前视频播放完后，livePlayer变成暂停状态
        if (isPause) {
          this.play()
        }
        this.jumpToSeconds(jumpSeconds)
      } else {
        // 如果需要跳转url,且需要快进，则暂停更新进度
        if (jump === true) {
          this.isUpdateTime = false
        }
        if (!isPause) {
          this.pause()
        }
        this.changeVideoUrl(url)
        if (jump === true) {
          setTimeout(() => {
            // 恢复更新进度
            this.isUpdateTime = true
            this.jumpToSeconds(jumpSeconds)
          }, 500)
        }
      }
    },

    /**
     * 全屏
     */
    fullScreen () {
      // 防止弹出全屏视频对话框后，player为null
      var player = this.$refs.playerCtrl.player
      if (player.isFullscreen()) {
        player.exitFullscreen()
      } else {
        player.requestFullscreen()
      }

      if (this.videoInfo.deviceTypeCode === 'WRJ') {
        const tmpMap = this.$refs.gduMap.map2D
        setTimeout(() => {
          tmpMap._map.updateSize()
        }, 200)
      }
    },

    // 退出全屏
    exitFullScreen () {
      this.$refs.playerCtrl.player.exitFullscreen()
    },

    /**
     * 响应地图双击样式改变事件
     */
    mapDbClickEventCB (bFullscreenMap) {
      this.changeVideoAndMap()
    },

    /**
     * 地图与视频全屏切换
     */
    changeVideoAndMap () {
      this.bIsFullscreenMap = !this.bIsFullscreenMap
      this._changeVideoAndMap(this.bIsFullscreenMap)
    },
    _changeVideoAndMap (bFullscreenMap) {
      this.bIsFullscreenMap = bFullscreenMap
      if (this.bIsFullscreenMap === false) {
        try {
          this.bSetPointStatus = false
          this.$refs.gduMap.map2D.droneDestinationManager.setDestEnable(
            this.bSetPointStatus
          )
        } catch (error) {}
      }
      this.$refs.gduMap.setBasicHighBottom(this.bIsFullscreenMap)
      this.$refs.gduMap.setPopoverAppendStyle(!this.bIsFullscreenMap)
      const tmpMap = this.$refs.gduMap.map2D
      setTimeout(() => {
        tmpMap._map.updateSize()
      }, 10)
    },

    /**
     * 跳转到XX秒开始播放
     * @param {Number} time xx秒
     */
    jumpToSeconds (time) {
      this.$refs.playerCtrl.player.currentTime(time)
    },

    /**
     * 暂停播放
     */
    pause () {
      this.$refs.playerCtrl.player.pause()
    },

    /**
     * 播放结束
     */
    ended: function () {
      if (this.videoInfo.isLive === false) {
        // 播放完成后，自动播放回放记录中的下一个mp4
        var r = this.videoInfo.records.find(x => x.url === this.curUrl)
        if (r !== undefined) {
          var index = this.videoInfo.records.indexOf(r)
          // 如果不是最后一个回放记录，就继续播放下一个记录
          if (index !== -1 && index < this.videoInfo.records.length - 1) {
            var url = this.videoInfo.records[index + 1].url
            console.log('继续播放下一个记录:' + url)
            this.changeVideoUrl(url)
          } else {
            console.log(this.curUrl + '----最后一个回放记录播放完毕')
            // 将时间轴跳到24点
            if (this.isSub) {
              this.$emit('timeupdateEvent', 24 * 60 * 60)
            }
          }
        }
      }
    },

    /**
     * 改变播放地址
     * @param {String} url 播放地址
     */
    changeVideoUrl (url) {
      this.$refs.playerCtrl.player.src([{ src: url }])
      this.curUrl = url
    },

    /**
     * 更新进度
     */
    timeupdate: function () {
      if (this.videoInfo.isLive === false) {
        this.curTime = Math.floor(this.$refs.playerCtrl.player.currentTime())
      }
    },

    /**
     * 订阅更新进度事件
     */
    subTimeupdate (isSub) {
      this.isSub = isSub
      if (isSub === true) {
        // 防止回放视频已经播放完毕，没有触发timeupdate事件，而导致时间没有更新
        this.curTime = Math.floor(this.$refs.playerCtrl.player.currentTime())
        this.$refs.playerCtrl.player.on('timeupdate', this.timeupdate)
      } else {
        this.$refs.playerCtrl.player.off('timeupdate', this.timeupdate)
      }
    },

    /**
     * 订阅播放结束事件
     */
    subEnded () {
      this.$refs.playerCtrl.player.on('ended', this.ended)
    },
    // 检查全屏
    checkFull () {
      let isFull =
        window.fullScreen ||
        document.webkitIsFullScreen ||
        document.msFullscreenEnabled
      if (isFull === undefined) isFull = false
      return isFull
    },
    // 清除其它按钮的记录次数
    clearRecord (curKey) {
      for (const key in this.recordNums) {
        if (key !== curKey) {
          this.recordNums[key] = 0
        }
      }
    },
    // 鼠标按下
    startChange (index) {
      if (this.showCurindex === 4) {
        this.resetForm('ruleForm')
      }
      // 鼠标按下每隔一秒通知后台获取云台信息
      if (this.showAR) {
        this.timer = setInterval(() => {
          if (this.showCurindex !== 4) {
            // 按住期间执行的代码
            new MqttService().client.send(
              'video/webControlPzt',
              JSON.stringify({
                deviceCode: this.videoInfo.deviceCode,
                channelId: this.videoInfo.streamType
              })
            )
          }
          // 更新坐标角度
          this.getPtzInfo()
        }, 1500)
      }
      const params = {
        device_id: this.videoInfo.deviceCode,
        channel_id: this.videoInfo.streamType
      }
      switch (index) {
        case 0:
          // 上移
          params.cmd_type = 0
          params.step = this.showAR ? 1 : this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        case 1:
          // 右上
          params.cmd_type = 33
          params.step = this.showAR ? 1 : this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        case 2:
          // 右移
          params.cmd_type = 3
          params.step = this.showAR ? 1 : this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        case 3:
          // 右下
          params.cmd_type = 35
          params.step = this.showAR ? 1 : this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        case 4:
          // 下
          params.cmd_type = 1
          params.step = this.showAR ? 1 : this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        case 5:
          // 左下
          params.cmd_type = 34
          params.step = this.showAR ? 1 : this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        case 6:
          // 左
          params.cmd_type = 2
          params.step = this.showAR ? 1 : this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        case 7:
          // 左上
          params.cmd_type = 32
          params.step = this.showAR ? 1 : this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        // 加号
        case 999:
          if (this.curSelectedIcon === 0) {
            // 变倍+
            params.cmd_type = 4
          } else {
            // 变焦+
            params.cmd_type = 6
          }
          params.step = this.showAR ? 1 : this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        // 减号
        case 9999:
          if (this.curSelectedIcon === 0) {
            // 变倍-
            params.cmd_type = 5
          } else {
            // 变焦-
            params.cmd_type = 7
          }
          params.step = this.showAR ? 1 : this.step
          params.stop = 0
          console.dir(params)
          this.changeViewVideo(params)
          break
        // case 1004:
        //   // 光圈+
        //   params.cmd_type = 8
        //   params.step = this.step
        //   params.stop = 0
        //   console.dir(params)
        //   this.changeViewVideo(params)
        //   break
        // case 1005:
        //   // 光圈-
        //   params.cmd_type = 9
        //   params.step = this.step
        //   params.stop = 0
        //   console.dir(params)
        //   this.changeViewVideo(params)
        //   break
        default:
          break
      }
    },
    // 鼠标松开
    stopChange (index) {
      if (this.showAR) {
        // 停止定时器
        clearInterval(this.timer)
        this.timer = null
        setTimeout(() => {
          // 显示角度
          this.getPtzInfo()
          if (this.showCurindex !== 4) {
            // 通知后台获取云台信息
            new MqttService().client.send(
              'video/webControlPzt',
              JSON.stringify({
                deviceCode: this.videoInfo.deviceCode,
                channelId: this.videoInfo.streamType
              })
            )
          }
        }, 1000)
      }

      const params = {
        device_id: this.videoInfo.deviceCode,
        channel_id: this.videoInfo.streamType,
        stop: 1,
        step: 0,
        cmd_type: ''
      }
      switch (index) {
        case 0:
          // 上
          params.cmd_type = 0
          break
        case 1:
          // 右上
          params.cmd_type = 33
          break
        case 2:
          // 右
          params.cmd_type = 3
          break
        case 3:
          // 右下
          params.cmd_type = 35
          break
        case 4:
          // 下
          params.cmd_type = 1
          break
        case 5:
          // 左下
          params.cmd_type = 34
          break
        case 6:
          // 左
          params.cmd_type = 2
          break
        case 7:
          // 左上
          params.cmd_type = 32
          break
        // 加号
        case 999:
          if (this.curSelectedIcon === 0) {
            // 变倍+
            params.cmd_type = 4
          } else {
            // 变焦+
            params.cmd_type = 6
          }
          break
        // 减号
        case 9999:
          if (this.curSelectedIcon === 0) {
            // 变倍-
            params.cmd_type = 5
          } else {
            // 变焦-
            params.cmd_type = 7
          }
          break
        // case 1004:
        //   // 光圈+
        //   params.cmd_type = 8
        //   break
        // case 1005:
        //   // 光圈-
        //   params.cmd_type = 9
        //   break
      }

      console.log(params)
      this.changeViewVideo(params)
    },
    // 云台操作
    changeViewVideo (params) {
      this.$axios
        .post('/video-service2/index/api/ptzConrol', params)
        .then(res => {
          if (res && res.data && res.data.code === 0) {
            console.log('成功！')
          }
        })
    }
  },
  filters: {
    timeFormat
  },
  created () {
    // 监听火情报警
    EventBus.$on('fullScrFireAlarm', info => {
      if (
        this.videoInfo.deviceCode === info.deviceCode &&
        this.videoInfo.isShowOperate
      ) {
        // 如果此时火情弹框打开了
        if (this.showCurindex === 1) {
          this.getTodayFire()
        }
        this.showNotification = true
        this.infoObj.isWarning = true
        this.infoObj.isError = false
        this.infoObj.isSuccess = false
        this.infoObj.title = '警告'
        this.infoObj.msg = '发现火情火点！'
        setTimeout(() => {
          this.showNotification = false
        }, 3000)
      }
      // if (info.alarmStatus !== 'mistaken') {
      //   info.bConfirmed = false
      //   info.alarmTime = timeFormat(info.alarmTime)
      //   this.handlingAlarmImgUrl(info)
      //   this.fireWarningArray.push(info)
      //   this.fireTotalNum = this.fireWarningArray.length
      //   if (this.bShowMarkersInMap) {
      //     this.addNewFireWarning(info)
      //   }
      // }
    })
  },
  beforeDestroy () {
    EventBus.$off('fullScrFireAlarm')
  }
}
</script>
<style lang="less" >
.playerStyle {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  ::selection {
    background: transparent;
  }
  position: relative;
  width: 100%;
  height: 100%;
  input[type="color"] {
    border: none;
  }
  input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  input[type="color"]::-webkit-color-swatch {
    border: 0;
  }
  :focus {
    outline: none;
  }
  select:invalid {
    color: #a3afb7;
  }
  .is-error select {
    border-color: #f56c6c;
  }
  .selectStyle {
    position: absolute !important;
    top: 30px !important;
    left: 0 !important;
  }
  .tagName .el-form-item__content .el-input input {
    border: 1px solid #209cdf;
    background: #102035;
    color: #fff;
  }
  .selectBg .el-form-item__content .el-input input {
    border: 1px solid #209cdf;
    background: #102035;
    // background: rgba(0, 57, 87, 0.9);
    color: #fff;
  }
  .selectBg .el-select-dropdown {
    background: #313c4f;
    border: 1px solid #2293d1;
    .el-select-dropdown__item {
      color: #fff;
    }
    .el-select-dropdown__item.hover,
    .el-select-dropdown__item:hover {
      background: #102035;
    }
    .popper__arrow {
      display: none;
    }
  }
  .cutDialog {
    background: rgba(0, 0, 0, 0.6);
    /deep/.el-dialog {
      width: 803px;
      height: 549px;
      background: url(../../../assets/images/dialog-bg.png) no-repeat;
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        padding: 26px 30px;
      }
      .el-dialog__footer {
        padding: 0 30px;
        .remark {
          display: flex;
          justify-content: space-between;
          .replain {
            text-align: left;
            span {
              color: #fff;
            }
            .el-input {
              width: 410px;
              .el-input__inner {
                color: #fff;
                border: none;
                border-bottom: 1px solid rgb(153, 153, 153);
                background: transparent;
              }
              input::-webkit-input-placeholder {
                color: #999;
              }
            }
          }
          .el-button--default {
            background: transparent;
            color: rgba(30, 176, 252, 1);
            border: 1px solid #dcdfe6;
          }
          .el-button--primary {
            background: #1eb0fc;
          }
        }
      }
    }
  }
  .pointLayer {
    position: absolute;
    height: 100%;
    width: 100%;
    > div {
      height: 100%;
      > div.header {
        position: absolute;
        left: 50%;
        width: 1205px;
        height: 69px;
        line-height: 69px;
        text-align: center;
        transform: translateX(-50%);
        background: url(../../../assets/images/AR/ar_header.png) no-repeat;
        font-size: 36px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #ffffff;
      }
      ::selection {
        background: transparent;
      }
      div.footer {
        position: absolute;
        z-index: 20;
        left: 0;
        bottom: 0;
        width: 1920px;
        height: 73px;
        background: url(../../../assets/images/AR/ar_footer.png) no-repeat;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: text;
        a {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 40px;
          margin-right: 32px;
          cursor: pointer;
          .hide_tab {
            position: absolute;
            bottom: 0;
            left: 0;
          }
          img.cutImg {
            position: absolute;
            top: -210px;
            left: 20px;
            width: 200px;
            height: 200px;
          }
        }
      }
      .realPoliceInfo {
        position: absolute;
        top: 125px;
        right: 40px;
        width: 306px;
        height: 568px;
        cursor: text;
        background: url(../../../assets/images/AR/police_info.png) no-repeat;
        div.title {
          padding: 18px;
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #ffffff;
        }
        div.content {
          padding: 0 14px 0 18px;
          max-height: 500px;
          overflow-y: auto;
          .item {
            display: flex;
            font-size: 12px;
            padding: 10px 8px;
            margin-bottom: 10px;
            background: linear-gradient(
              -90deg,
              rgba(30, 176, 252, 0.1) 0%,
              rgba(30, 176, 252, 0.1) 100%
            );
            // opacity: 0.22;
            div.pic {
              width: 80px;
              height: 80px;
              margin-right: 8px;
              border: 1px solid #eee;
              > img {
                width: 100%;
                height: 100%;
              }
            }
            div.detail {
              flex: 1;
              p {
                line-height: 20px;
              }
            }

            div p {
              line-height: 18px;
              span.type {
                color: #1eb0fc;
              }
            }
          }
        }
        > img {
          position: absolute;
          right: 18px;
          top: 18px;
          cursor: pointer;
        }
      }
      .tagInfo {
        position: absolute;
        bottom: 90px;
        left: 818px;
        width: 472px;
        height: 128px;
        background: url(../../../assets/images/AR/tag_bg.png) no-repeat;
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        cursor: text;
        > div {
          text-align: center;
        }
        > div p {
          font-size: 12px;
        }
        > div img {
          cursor: pointer;
        }
        > div div.mar11 {
          margin: 11px 0;
        }
        > div div.mar13 {
          margin: 13px 0;
        }
        > div div.mar12 {
          margin: 12px 0;
        }
        > div div {
          box-sizing: border-box;
          border: 1px solid transparent;
        }
        > div:first-child div {
          width: 57px;
          height: 54px;
        }
        > div div img {
          cursor: pointer;
        }
        > div:not(:first-child) div {
          width: 48px;
          height: 48px;
          padding-top: 7px;
        }
        > div div.active {
          border: 1px solid rgb(30, 176, 252);
          background: rgba(30, 176, 252, 0.6);
        }
        // div {
        //   margin: 0 20px;
        // }
        // div:nth-child(2),
        // div:nth-child(3) {
        //   img {
        //     margin: 5px 0;
        //   }
        // }
        > img {
          position: absolute;
          top: 15px;
          right: 14px;
          cursor: pointer;
        }
      }
      .picStorage {
        position: absolute;
        z-index: 20;
        top: 94px;
        left: 50%;
        transform: translateX(-50%);
        width: 800px;
        height: 676px;
        background: url(../../../assets/images/AR/pic_storage.png) no-repeat;
        box-sizing: border-box;
        padding: 26px 0px 24px 26px;
        cursor: text;
        > img {
          position: absolute;
          top: 18px;
          right: 25px;
          cursor: pointer;
        }
        .el-date-editor {
          .el-input__icon,
          .el-range-separator {
            line-height: 26px;
          }
        }
        .el-picker-panel {
          position: absolute !important;
          width: 576px;
          .el-picker-panel__icon-btn {
            margin-top: 0;
          }
          button {
            font-size: 14px;
          }
        }
        .box {
          margin-top: 24px;
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          justify-content: left;
          height: 495px;
          .item {
            width: 123px;
            margin-right: 31px;
            padding-bottom: 10px;
            // height:173px;
            text-align: center;
            font-size: 12px;
            .container {
              width: 123px;
              height: 123px;
              position: relative;
              > img {
                width: 100%;
                height: 100%;
              }
              .mask {
                position: absolute;
                bottom: -23px;
                width: 100%;
                padding: 0 10px;
                height: 23px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 14px;
                background: #000;
                opacity: 0;
                transition: all 1s ease-in-out;
                i {
                  color: #fff;
                  cursor: pointer;
                }
              }
            }
            .container:hover .mask {
              bottom: 0px;
              opacity: 0.7;
            }
            > p {
              margin-top: 8px;
            }
          }
          .empty {
            width: 100%;
            height: 100%;
            line-height: 495px;
            text-align: center;
          }
        }
        .tablePagination {
          margin-top: 5px;
          text-align: end;
          padding-right: 18px;
          position: absolute;
          bottom: 0px;
          button.btn-next,
          button.btn-prev {
            background: transparent !important;
          }
          button.btn-prev {
            margin-right: 0px;
          }
        }
      }
      .settingInfo {
        position: absolute;
        top: 170px;
        left: 50%;
        transform: translateX(-50%);
        width: 690px;
        height: 440px;
        cursor: text;
        background: url(../../../assets/images/AR/setting_bg.png) no-repeat;
        box-sizing: border-box;
        padding: 16px 20px;
        .settingTitle {
          width: 202px;
          height: 45px;
          background: url(../../../assets/images/device/info-title.png)
            no-repeat;
          padding-left: 26px;
          line-height: 36px;
          font-size: 16px;
        }
        > img {
          position: absolute;
          top: 18px;
          right: 25px;
          cursor: pointer;
        }
        .operateBox {
          font-size: 14px;
          font-weight: 400;
          // color: #1eb0fc;
          position: relative;
          > div {
            display: inline-block;
          }
          div.icon {
            position: relative;
            top: 10px;
            left: 35px;
            > img {
              margin-right: 15px;
              cursor: pointer;
            }
          }
        }
        .el-table thead tr th {
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #ffffff;
          background: #3688b1;
          padding: 1px 0 !important;
        }
        .el-table__row {
          height: 38px;
          background: #326680;
          td div.cell {
            color: #fff;
          }
          td {
            padding: 7px 0 !important;
          }
        }
        .el-table__row.el-table__row--striped td {
          background: #3688b1;
        }
        .el-table--enable-row-hover .el-table__body tr:hover > td {
          background-color: #27354d !important;
          opacity: 0.5;
        }
        .tablePagination {
          text-align: right;
          button.btn-next,
          button.btn-prev {
            background: transparent !important;
          }
          .btn-prev {
            margin-right: 0;
          }
        }
      }
      //   div.pic {
      //     display: inline-block;
      //     position: absolute;
      //   }
      //   span {
      //     position: absolute;
      //     right: 0;
      //     top: -10px;
      //     cursor: pointer;
      //     display: none;
      //   }
      //   div.pic:hover span {
      //     display: inline;
      //   }
      //   div.pic img {
      //     vertical-align: middle;
      //     /* border-radius: 50%; */
      //   }
      //   div.pic input {
      //     //  background:#00a9ff;
      //     opacity: 0.6;
      //   }
    }
    div.bg {
      background: url(../../../assets/images/AR/ar_bg.png) no-repeat;
    }
  }
  .info {
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 5;
    :nth-child(1) {
      position: relative;
      top: -2px;
      display: inline-block;
      width: 17px;
      height: 10px;
      background: url(../../../assets/images/videowall-play.png) no-repeat;
    }

    :nth-child(2) {
      font-size: 16px;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      margin-left: 8px;
      text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.5);
    }
  }
  .fullScreenFace {
    span {
      position: absolute;
      z-index: 10;
      // background: url(../../../assets/images/person.png) no-repeat center center;
      // background-size:100% 100%;
      border: 2px solid #00ff00;
      background: rgba(0, 255, 0, 0.3);
    }
    span.ship {
      border: 2px solid #00e4ff;
      background: rgba(0, 228, 255, 0.3);
    }
  }
  .fullScreenAr {
    > div {
      position: absolute;
      box-sizing: border-box;
      height: 103px;
      width: 102px;
      div {
        font-size: 12px;
        text-align: center;
        line-height: 44px;
      }
    }
    > div.fire,
    div.build,
    div.forest,
    div.palace {
      width: 145px;
      height: 59px;
      padding-left: 48px;
    }
    div.fire {
      background: url(../../../assets/images/AR/fire.png) no-repeat;
    }
    div.build {
      background: url(../../../assets/images/AR/build.png) no-repeat;
    }
    div.forest {
      background: url(../../../assets/images/AR/build.png) no-repeat;
    }
    div.palace {
      background: url(../../../assets/images/AR/palace.png) no-repeat;
    }
    div.high {
      background: url(../../../assets/images/AR/high.png) no-repeat;
    }
  }
  div.rule {
    position: fixed;
    top: 90px;
    left: 50%;
    transform: translateX(-50%);
    width: 802px;
    height: 162px;
    background: url(../../../assets/images/AR/rule.png) no-repeat;
    .horizontal,
    .vertical {
      position: absolute;
      div {
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #fff;
      }
    }
    .horizontal {
      top: 81px;
      > div {
        position: absolute;
        div {
          margin-left: -7px;
        }
      }
      span {
        position: absolute;
        color: #fff;
      }
      span:nth-child(1) {
        left: -13px;
        top: -5px;
      }
      span:nth-child(3) {
        left: 804px;
        top: -8px;
      }
    }
    .vertical {
      left: 360px;
      > div {
        position: absolute;
        display: flex;
        width: 42px;
        justify-content: space-between;
        // div {
        //   margin-right: 2px;
        // }
      }
      span {
        position: absolute;
        color: #fff;
      }
      span:nth-child(1) {
        left: 25px;
        top: -16px;
      }
      span:nth-child(3) {
        left: 25px;
        top: 164px;
      }
    }
  }
  div.cruise {
    position: absolute;
    z-index: 20;
    bottom: 51px;
    right: 225px;
    img.disabled {
      cursor: text;
    }
  }
  // .fullScreenAr {
  //   > div {
  //     position: absolute;
  //     box-sizing: border-box;
  //     height: 103px;
  //     width: 102px;
  //     div {
  //       font-size: 12px;
  //       text-align: center;
  //       line-height: 44px;
  //     }
  //   }
  //   > div.river,
  //   div.build {
  //     width: 145px;
  //     height: 59px;
  //     padding-left: 48px;
  //   }
  //   div.river {
  //     background: url(../../../assets/images/AR/river.png) no-repeat;
  //   }
  //   div.build {
  //     background: url(../../../assets/images/AR/build.png) no-repeat;
  //   }
  //   div.high {
  //     background: url(../../../assets/images/AR/high.png) no-repeat;
  //   }
  // }
  // div.rule {
  //   position: fixed;
  //   top: 90px;
  //   left: 50%;
  //   transform: translateX(-50%);
  //   width: 802px;
  //   height: 162px;
  //   background: url(../../../assets/images/AR/rule.png) no-repeat;
  //   .horizontal,
  //   .vertical {
  //     position: absolute;
  //     div {
  //       font-size: 14px;
  //       font-family: Source Han Sans CN;
  //       font-weight: 400;
  //       color: #f8b652;
  //     }
  //   }
  //   .horizontal {
  //     top: 81px;
  //     > div {
  //       position: absolute;
  //       div {
  //         margin-left: -7px;
  //       }
  //     }
  //     span {
  //       position: absolute;
  //       color: #00c4e0;
  //     }
  //     span:nth-child(1) {
  //       left: -13px;
  //       top: -5px;
  //     }
  //     span:nth-child(3) {
  //       left: 804px;
  //       top: -8px;
  //     }
  //   }
  //   .vertical {
  //     left: 360px;
  //     > div {
  //       position: absolute;
  //       display: flex;
  //       width: 42px;
  //       justify-content: space-between;
  //       // div {
  //       //   margin-right: 2px;
  //       // }
  //     }
  //     span {
  //       position: absolute;
  //       color: #00c4e0;
  //     }
  //     span:nth-child(1) {
  //       left: 25px;
  //       top: -16px;
  //     }
  //     span:nth-child(3) {
  //       left: 25px;
  //       top: 164px;
  //     }
  //   }
  // }
  .fullScreenOperate {
    position: absolute;
    z-index: 20;
    right: 30px;
    top: 50%;
    transform: translateY(-50%);
    width: 293px;
    height: 509px;
    background: url(../../../assets/images/full-screen-operate.png) no-repeat;
    cursor: text;
    .deviceInfo {
      padding-top: 18px;
      .deviceTitle {
        box-sizing: border-box;
        width: 202px;
        height: 34px;
        background: url(../../../assets/images/device/info-title.png) no-repeat;
        line-height: 34px;
        padding-left: 37px;
        margin-left: 20px;
      }
      .operate {
        margin-top: 20px;
        .icons {
          display: flex;
          flex-wrap: wrap;
          padding-left: 45px;
          div {
            width: 48px;
            height: 48px;
            margin-right: 19px;
            margin-bottom: 19px;
            cursor: pointer;
          }
          div:nth-child(1) {
            background: url(../../../assets/images/device/7.png) no-repeat;
          }
          div:nth-child(1):hover {
            background: url(../../../assets/images/device/7_selected.png)
              no-repeat;
          }
          div:nth-child(2) {
            background: url(../../../assets/images/device/8.png) no-repeat;
          }
          div:nth-child(2):hover {
            background: url(../../../assets/images/device/8_selected.png)
              no-repeat;
          }
          div:nth-child(3) {
            background: url(../../../assets/images/device/9.png) no-repeat;
          }
          div:nth-child(3):hover {
            background: url(../../../assets/images/device/9_selected.png)
              no-repeat;
          }
          div:nth-child(4) {
            margin-right: 10px;
            background: url(../../../assets/images/device/4.png) no-repeat;
          }
          div:nth-child(4):hover {
            background: url(../../../assets/images/device/4_selected.png)
              no-repeat;
          }
          div:nth-child(5) {
            width: 64px;
            height: 64px;
            position: relative;
            margin-left: 2px;
            top: -7px;
            // left: -5px;
            margin-right: 10px;
            background: url(../../../assets/images/device/5.png) no-repeat;
            cursor: text;
            margin-bottom: 5px;
          }
          // div:nth-child(5):hover {
          //   background: url(../../../assets/images/device/5_selected.png)
          //     no-repeat;
          // }
          div:nth-child(6) {
            background: url(../../../assets/images/device/6.png) no-repeat;
          }
          div:nth-child(6):hover {
            background: url(../../../assets/images/device/6_selected.png)
              no-repeat;
          }
          div:nth-child(7) {
            background: url(../../../assets/images/device/1.png) no-repeat;
          }
          div:nth-child(7):hover {
            background: url(../../../assets/images/device/1_selected.png)
              no-repeat;
          }
          div:nth-child(8) {
            background: url(../../../assets/images/device/2.png) no-repeat;
          }
          div:nth-child(8):hover {
            background: url(../../../assets/images/device/2_selected.png)
              no-repeat;
          }
          div:nth-child(9) {
            background: url(../../../assets/images/device/3.png) no-repeat;
          }
          div:nth-child(9):hover {
            background: url(../../../assets/images/device/3_selected.png)
              no-repeat;
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
            line-height: 35px;
            text-align: center;
            margin-left: 37px;
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
              position: relative;
            }
            span:nth-child(1):after {
              content: "|";
              position: absolute;
              left: 45px;
              color: #1ca1dc;
              top: -3px;
            }
            span:nth-child(3):before {
              content: "|";
              position: absolute;
              left: -1px;
              color: #1ca1dc;
              top: -3px;
            }
            span:hover {
              background: linear-gradient(
                90deg,
                rgb(32, 72, 105) 0%,
                rgb(32, 72, 105) 100%
              );
            }
            span:nth-child(1):hover:after {
              display: none;
            }
            span:nth-child(3):hover:before {
              display: none;
            }
          }
        }
        .slider {
          display: flex;
          padding-left: 37px;

          span {
            line-height: 38px;
          }
          span.demonstration {
            font-weight: bold;
            color: rgba(132, 221, 255, 1);
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
        .sliderTip {
          font-size: 14px;
          margin-top: 2px;
          padding-left: 65px;
          color: #fff;
          opacity: 0.5;
        }
      }
    }
  }
  .droneControl {
    width: 100%;
    height: 100%;
    position: absolute;
    pointer-events: none;
    .stretchIMG {
      background-repeat: no-repeat;
      background-size: 100% 100%;
      -moz-background-size: 100% 100%;
    }
    .header {
      position: absolute;
      top: 0px;
      width: 100%;
      height: 125px;
      background-image: url("../../../assets/images/drone/header-bg.png");
      z-index: 3;
      .exitFullScreen {
        pointer-events: visible;
        position: absolute;
        display: flex;
        height: 33px;
        line-height: 33px;
        right: 20px;
        top: 3px;
        z-index: 5;
        :nth-child(1) {
          margin-top: 3px;
          width: 33px;
          height: 33px;
          background-image: url("../../../assets/images/drone/size-back.png");
        }
        :nth-child(2) {
          height: 33px;
          line-height: 33px;
          font-size: 16px;
          font-weight: bold;
          color: rgba(255, 255, 255, 1);
          margin-left: 8px;
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 0px;
      width: 100%;
      height: 209px;
      background-image: url("../../../assets/images/drone/bottom-bg.png");
      z-index: 3;
    }
    .menu {
      // visibility: hidden;
      position: absolute;
      bottom: 0px;
      width: 100%;
      height: 73px;
      background-image: url("../../../assets/images/AR/ar_footer.png");
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 3;
      .itemBtn {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 40px;
        margin-right: 32px;
        pointer-events: visible;
      }
      .itemBtn:hover {
        opacity: 0.65;
      }
      .detectBtn {
        background-image: url("../../../assets/images/drone/detect.png");
      }
      .detectBtnActive {
        background-image: url("../../../assets/images/drone/detect-active.png");
      }
      .puzzleBtn {
        background-image: url("../../../assets/images/drone/puzzle.png");
      }
      .puzzleBtn:active {
        background-image: url("../../../assets/images/drone/puzzle-active.png");
      }
      .scanningStyle {
        background: url("../../../assets/images/drone/scanning.png") center
          center no-repeat;
        width: 40px;
        height: 40px;
        animation: scanning 4s steps(32) infinite;
      }
      @keyframes scanning {
        0% {
          transform: rotateX(0deg);
          background-position: 0px -10px;
        }
        50% {
          transform: rotateX(0deg);
          background-position: 0px 40px;
        }
        50.0001% {
          transform: rotateX(180deg);
          background-position: 0px -10px;
        }
        100% {
          transform: rotateX(180deg);
          background-position: 0px 40px;
        }
      }
      .pointBtn {
        background-image: url("../../../assets/images/drone/point.png");
      }
      .pointBtnActive {
        background-image: url("../../../assets/images/drone/point-active.png");
      }
      .routeBtn {
        background-image: url("../../../assets/images/drone/route.png");
      }
      .routeBtnActive {
        background-image: url("../../../assets/images/drone/route-active.png");
      }
    }
    .realInfo {
      position: absolute;
      z-index: 3;
      bottom: 5px;
      height: 24px;
      line-height: 24px;
      color: #ffffff;
      font-size: 14px;
      .leftMargin {
        margin-left: 35px;
        margin-right: 3px;
      }
      .rightMargin {
        margin-left: 3px;
        margin-right: 35px;
      }
    }
    .leftInfo {
      right: 68.75%;
    }
    .rightInfo {
      left: 68.75%;
    }
    .mapOuterBox,
    .smallVideoStyle {
      z-index: 3;
      position: absolute;
      left: 60px;
      bottom: 60px;
      width: 283px;
      height: 183px;
      background-image: url("../../../assets/images/drone/map-box.png");
      pointer-events: visible;
      .mapArea,
      .smallVideoArea {
        position: relative;
        margin-left: 18px;
        margin-top: 21px;
        width: 246px;
        height: 143px;
        .smallVideoBox {
          width: 100%;
          height: 100%;
        }
        .sizeChange {
          position: absolute;
          top: 0px;
          right: 0px;
          height: 41px;
          width: 41px;
          background-image: url("../../../assets/images/drone/size-change.png");
        }
        .sizeChange:hover {
          opacity: 0.8;
        }
        .sizeChange:active {
          opacity: 0.9;
        }
      }
    }
    .mapOuterBoxFullScreen {
      z-index: 2;
      position: relative;
      left: 0px;
      top: 0px;
      right: 0px;
      bottom: 0px;
      width: 100%;
      height: 100%;
      background-image: none;
      .mapAreaFullScreen {
        margin-left: 0px;
        margin-top: 0px;
        width: 100%;
        height: 100%;
        background-color: whitesmoke;
      }
    }
    .puzzlingBox {
      position: absolute;
      pointer-events: visible;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #121e3ad8;
      border: 1px solid #1eb0fc;
      z-index: 5;
      width: 522px;
      height: 330px;
      padding: 0px 17px;
      cursor: default;
      .pbTitle {
        position: relative;
        width: 100%;
        height: 45px;
        line-height: 45px;
        border-bottom: 1px solid #1eb0fc;
        .titleImg {
          position: absolute;
          width: 21px;
          height: 16px;
          top: 14px;
          background-image: url("../../../assets/images/drone/popupTitleImg.png");
        }
        .titleText {
          position: absolute;
          top: 1px;
          left: 32px;
          font-size: 14px;
        }
        .titleDate {
          position: absolute;
          right: 40px;
          width: 150px;
          height: 30px;
        }
        .el-input__inner {
          height: 26px;
          border: 1px solid #1eb0fc;
        }
        .el-picker-panel {
          position: absolute !important;
          .el-picker-panel__icon-btn {
            margin-top: 0;
          }
        }
        .titleClose {
          position: absolute;
          height: 14px;
          width: 14px;
          background-image: url("../../../assets/images/AR/X.png");
          cursor: pointer;
          right: 0px;
          top: 14px;
        }
      }
      .puzzlingItems {
        height: 235px;
        overflow-x: hidden;
        overflow-y: auto;
        .pItem {
          position: relative;
          height: 64px;
          .itemImg {
            margin-top: 9px;
            width: 80px;
            height: 46px;
          }
          .commonText {
            position: absolute;
            height: 20px;
            line-height: 20px;
            font-size: 14px;
          }
          .itemTime {
            top: 9px;
            left: 90px;
          }
          .itemAddr {
            bottom: 9px;
            left: 90px;
          }
          .itemStatus {
            width: 60px;
            text-align: center;
            top: 9px;
            right: 2px;
          }
          .isPuzzling {
            color: #1eb0fc;
          }
          .puzzleDone {
            color: #5bff00;
          }
          .itemDetail {
            width: 60px;
            text-align: center;
            background-color: #1eb0fc;
            color: #ffffff;
            bottom: 9px;
            right: 2px;
            cursor: pointer;
          }
        }
        .pItemBottom {
          border-bottom: 1px solid #3e92c2;
        }
        .noPuzzleText {
          height: 235px;
          line-height: 235px;
          text-align: center;
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: 500;
          color: #1eb0fc;
        }
      }
      .puzzlingPages {
        position: relative;
        width: 100%;
        height: 48px;
        .tablePagination {
          right: 0px;
          position: absolute;
          button.btn-next,
          button.btn-prev {
            background: transparent !important;
          }
          button.btn-prev {
            margin-right: 0px;
          }
        }
      }
    }
  }
  .fullScreenMark {
    position: absolute;
    z-index: 20;
    // left: 50%;
    right: 20px;
    top: 158px;
    // transform: translateY(-50%);
    width: 300px;
    height: 528px;
    background: rgba(16, 32, 53, 0.85);
    border: 1px solid #209cdf;
    // padding:0 px;
    // opacity: 0.85;
    cursor: text;
    // background: url(../../../assets/images/AR/tag_add.png) no-repeat;
    // background-size: 100% 100%;
    > h3 {
      font-size: 16px;
      font-weight: 500;
      color: #f5fafd;
      padding: 12px 11px;
      font-size: 14px;
    }
    > img {
      position: absolute;
      top: 8px;
      right: 8px;
      cursor: pointer;
    }
    form {
      // margin-top: 20px;
      padding-left: 18px;
      .el-form-item {
        margin-bottom: 0px;
        .el-form-item__label {
          color: #fff;
        }
      }
      .btns {
        position: absolute;
        bottom: 30px;
        right: 30px;
      }
      .labelColor .el-form-item__content {
        margin-top: 6px;
      }
      .el-slider {
        width: 130px !important;
        margin-right: 10px !important;
        display: inline-block;
        vertical-align: middle;
        .el-slider__runway,
        .el-slider__bar {
          height: 2px;
        }
        .el-slider__button-wrapper {
          height: 33px;
          .el-slider__button {
            width: 14px;
            height: 14px;
            background: #209cdf;
            border-color: #fff;
          }
        }
      }
      .el-slider + span {
        display: inline-block;
        font-size: 14px;
        color: #209cdf;
        width: 36px;
        text-align: right;
      }
      div.el-input-number {
        line-height: 24px;
        > span {
          height: 24px;
          width: 24px;
          background: #00a0e9;
          color: #ffffff;
          border: none;
        }
        > span.el-input-number__decrease {
          top: 0;
          left: 0;
        }
        > span.el-input-number__increase {
          right: 0;
          top: 0;
        }
        > div.el-input {
          input {
            line-height: 24px;
            height: 24px;
            background: transparent;
            border: 1px solid #00a0e9;
            padding-left: 24px;
            padding-right: 24px;
            color: #fff;
          }
        }
      }
    }
    // .el-form-item__content,
    // .el-form-item__label,
    // .el-input__inner,
    // .el-input__icon {
    //   height: 22px;
    //   line-height: 22px !important;
    // }

    .el-select-dropdown__item {
      height: 28px !important;
      line-height: 28px !important;
    }
    .el-button.el-button--primary {
      padding: 0;
      width: 68px !important;
      height: 36px !important;
      line-height: 36px !important;
      background: #409eff;
    }
  }
  div.operate {
    position: absolute;
    z-index: 20;
    right: 90px;
    bottom: 85px;
    cursor: text;
    .circle {
      width: 165px;
      height: 164px;
      background: url(../../../assets/images/operate/circle.png) no-repeat;
      position: relative;
      div {
        width: 36px;
        height: 36px;
        position: absolute;
        cursor: pointer;
        z-index: 10000;
      }
      div:nth-child(1) {
        left: 50%;
        top: 5px;
        transform: translateX(-50%);
        background: url(../../../assets/images/operate/up.png) no-repeat center;
      }
      div:nth-child(1):hover {
        background: url(../../../assets/images/operate/up_selected.png)
          no-repeat center;
      }
      div:nth-child(2) {
        left: 74%;
        top: 24px;
        transform: translateX(-50%);
        background: url(../../../assets/images/operate/right_up.png) no-repeat
          center;
      }
      div:nth-child(2):hover {
        background: url(../../../assets/images/operate/right_up_selected.png)
          no-repeat center;
      }
      div:nth-child(3) {
        left: 88%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: url(../../../assets/images/operate/right.png) no-repeat
          center;
      }
      div:nth-child(3):hover {
        background: url(../../../assets/images/operate/right_selected.png)
          no-repeat center;
      }
      div:nth-child(4) {
        left: 78%;
        top: 62%;
        transform: translateX(-50%);
        background: url(../../../assets/images/operate/right_bottom.png)
          no-repeat center;
      }
      div:nth-child(4):hover {
        background: url(../../../assets/images/operate/right_bottom_selected.png)
          no-repeat center;
      }
      div:nth-child(5) {
        left: 52%;
        top: 78%;
        transform: translateX(-50%);
        background: url(../../../assets/images/operate/down.png) no-repeat
          center;
      }
      div:nth-child(5):hover {
        background: url(../../../assets/images/operate/down_selected.png)
          no-repeat center;
      }
      div:nth-child(6) {
        left: 26%;
        top: 62%;
        transform: translateX(-50%);
        background: url(../../../assets/images/operate/left_down.png) no-repeat
          center;
      }
      div:nth-child(6):hover {
        background: url(../../../assets/images/operate/left_down_selected.png)
          no-repeat center;
      }
      div:nth-child(7) {
        left: 14%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: url(../../../assets/images/operate/left.png) no-repeat
          center;
      }
      div:nth-child(7):hover {
        background: url(../../../assets/images/operate/left_selected.png)
          no-repeat center;
      }
      div:nth-child(8) {
        left: 25%;
        top: 16%;
        transform: translateX(-50%);
        background: url(../../../assets/images/operate/left_up.png) no-repeat
          center;
      }
      div:nth-child(8):hover {
        background: url(../../../assets/images/operate/left_up_selected.png)
          no-repeat center;
      }
    }
    .extra {
      position: absolute;
      top: 0;
      right: 0;
      div {
        width: 36px;
        height: 36px;
        position: relative;
        cursor: pointer;
      }
      div:nth-child(1) {
        left: -34px;
        top: -42px;
        background: url(../../../assets/images/operate/zoom.png) no-repeat
          center;
      }
      div:nth-child(1).selected {
        background: url(../../../assets/images/operate/zoom_selected.png)
          no-repeat center;
      }
      div:nth-child(2) {
        left: 22px;
        top: -60px;
        background: url(../../../assets/images/operate/focus.png) no-repeat
          center;
      }
      div:nth-child(2).selected {
        background: url(../../../assets/images/operate/focus_selected.png)
          no-repeat center;
      }
      div:nth-child(3) {
        width: 51px;
        height: 63px;
        left: 54px;
        top: -54px;
        background: url(../../../assets/images/operate/add.png) no-repeat center;
      }
      div:nth-child(3):hover {
        background: url(../../../assets/images/operate/add_selected.png)
          no-repeat center;
      }
      div:nth-child(4) {
        left: 64px;
        top: -44px;
        background: #1477ab;
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        border-radius: 50%;
        border: 2px solid #2eccee;
      }
      div:nth-child(4):hover {
        background: #004469;
      }
      div:nth-child(5) {
        width: 59px;
        height: 48px;
        left: 20px;
        top: -42px;
        background: url(../../../assets/images/operate/minus.png) no-repeat
          center;
      }
      div:nth-child(5):hover {
        background: url(../../../assets/images/operate/minus_selected.png)
          no-repeat center;
      }
    }
  }
}
</style>
