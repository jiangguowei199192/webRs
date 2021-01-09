export const battleApi = {
  getBattleReviewList: 'fms-one-map/combatAssessment/selectList',
  getBattleReviewDetail: 'fms-one-map/combatAssessment/selectDetail',
  addNewBattleReview: 'fms-one-map/combatAssessment/add',
  updateBattleReview: 'fms-one-map/combatAssessment/update',
  deleteBattleReview: 'fms-one-map/combatAssessment/del',
  getFireCaseList: 'fms-one-map/alertController/findAlerts',
  getEnterprise3dInfoList: 'fms-one-map/planEnterpriseInfo3d/selectList',
  combatEventUpload: 'fms-one-map/combatEvent/upload', // 战评事件文件上传
  combatEventAdd: 'fms-one-map/combatEvent/batchAdd', // 批量新增战评事件
  combatEventUpdate: '/fms-one-map/combatEvent/batchUpdate', // 批量修改战评事件
  delCombatEvent: '/fms-one-map/combatAssessment/delCombatEvent', // 清除战评信息的所有事件
  readPathByAlertId: 'fms-one-map/path/readPathByAlertId', // 获取回放订阅事件的id
  stopReadPath: 'fms-one-map/path/stopReadPath', // 停止战评回放
  pauseWorker: 'fms-one-map/path/pauseWorker', // 暂停战评回放
  resumeWorker: 'fms-one-map/path/resumeWorker', // 恢复战评回放
  getWorkerStatus: 'fms-one-map/path/getWorkerStatus', // 查询战评回放状态
  setProgress: 'fms-one-map/path/setProgress' // 跳转战评回放进度
}
