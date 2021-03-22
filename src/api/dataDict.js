export const dataDictApi = {
  addDict: '/cloud-fms/dict/add', // 新增字典
  queryDictTypeList: '/cloud-fms/dict/queryDictTypeList', // 查询父级对应子级字典列表
  queryDictById: '/cloud-fms/dict/selectById', // 根据id查询字典
  queryDictByTypeCode: '/cloud-fms/dict/queryByTypeCode', // 根据typeCode查询字典
  queryParentDict: '/cloud-fms/dict/selectParentType', // 查询父级字典
  queryChildDict: '/cloud-fms/dict/selectPageChildType', // 分页查询子级字典
  editDict: '/cloud-fms/dict/update', // 修改字典
  deleteDict: '/cloud-fms/dict/del' // 删除字典
}
