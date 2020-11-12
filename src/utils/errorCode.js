const error = [
  {
    code: 401, desc: '', str: ''
  },
  {
    code: 1001, desc: 'user_status_forbidden', str: '用户被禁用'
  },
  {
    code: 1002, desc: 'user_status_deleted', str: '用户状态为被删除'
  },
  {
    code: 1003, desc: 'user_account_existed', str: '用户账号已存在'
  },
  {
    code: 1004, desc: 'user_not_login', str: '未登录'
  },
  {
    code: 1005, desc: 'user_wrong_account_or_pwd', str: '用户账号或密码错误'
  },
  {
    code: 1006, desc: 'user_permission_denied', str: '用户不具备对应操作权限'
  },
  {
    code: 1007, desc: 'user_teamid_wanted', str: '必须指定用户所属团队'
  },
  {
    code: 10017, desc: 'user_deptid_wanted', str: '必须指定用户所属组织'
  },
  {
    code: 1008, desc: 'user_role_code_wanted', str: '必须选择用户类型(角色)'
  },
  {
    code: 1009, desc: 'user_empty_account_or_pwd', str: '账号或密码为空'
  },
  {
    code: 1026, desc: 'current_not_user_login', str: '当前会话无用户登陆'
  },
  {
    code: 1027, desc: 'user_add_fail', str: '新增用户失败'
  },
  {
    code: 1025, desc: 'user_info_not_record', str: '未成功记录用户信息，登陆失败'
  },
  {
    code: 1029, desc: 'user_deleted_fail', str: '删除用户失败'
  },
  {
    code: 1030, desc: 'flyer_not_update_user_info', str: '普通飞手不能修改用户信息'
  },
  {
    code: 2030, desc: 'fire_button_not_update_user_info', str: '普通组织成员不能修改用户信息'
  },
  {
    code: 2031, desc: 'fire_button_not_authority_dept_info', str: '普通组织成员无组织权限信息'
  },
  {
    code: 2032, desc: 'dept_name_already_exist', str: '组织名称已存在'
  },
  {
    code: 1031, desc: 'user_not_existed', str: '用户不存在'
  },
  {
    code: 1032, desc: 'user_is_deleted_not_update', str: '用户已被删除，不可修改'
  },
  {
    code: 1033, desc: 'user_update_fail', str: '用户修改失败'
  },
  {
    code: 1034, desc: 'flyer_not_find_user_info', str: '普通飞手不能查询用户信息'
  },
  {
    code: 1035, desc: 'user_sign_key_not_found', str: '未查询到用户授权信息'
  },
  {
    code: 1036, desc: 'user_sign_key_start_time_not_come', str: '用户使用有效期未开始'
  },
  {
    code: 1037, desc: 'user_sign_key_end_time_passed', str: '用户使用有效期已过'
  },
  {
    code: 1038, desc: 'user_sign_key_disabled', str: '用户授权被禁用'
  },
  {
    code: 1039, desc: 'user_update_pwd_empty', str: '用户密码不能修改为空'
  },
  {
    code: 1040, desc: 'user_update_pwd_fail', str: '用户密码修改失败'
  },
  {
    code: 1041, desc: 'flyer_not_update_other_info', str: '普通飞手不能修改他人信息'
  },
  {
    code: 1042, desc: 'user_update_country_fail', str: '用户国籍修改失败'
  },
  {
    code: 1043, desc: 'user_old_pwd_invalid', str: '用户原密码错误'
  },
  {
    code: 1044, desc: 'user_team_deleted', str: '用户所在团队已删除'
  },
  {
    code: 1045, desc: 'user_captain_change_teamid_denied', str: '不能修改队长所属团队'
  },
  {
    code: 1050, desc: 'user_account_only_alphanumeric_valid', str: '用户账号只能包含字母'
  },
  {
    code: 1060, desc: 'user_with_flyTask_change_teamId_denied', str: '不可修改有飞行任务记录的用户所属团队'
  },
  {
    code: 1065, desc: 'user_admin_update_denied', str: '管理员用户不可修改'
  },
  {
    code: 1066, desc: 'user_admin_delete_denied', str: '管理员用户不可删除'
  },
  {
    code: 1070, desc: 'user_flyer_and_captain_can_be_in_team_only', str: '飞手跟队长只能存在团队中'
  },
  {
    code: 1071, desc: 'user_district_head_can_be_in_district_only', str: '区长只能存在区中'
  },
  {
    code: 2010, desc: 'team_name_existed', str: '团队名称已存在'
  },
  {
    code: 2011, desc: 'team_name_empty', str: '团队名称为空'
  },
  {
    code: 2012, desc: 'team_name_invalid', str: '团队名称不符合命名规则'
  },
  {
    code: 2013, desc: 'team_parent_selected_not_exist_or_deleted', str: '团队选择的所属区不存在或已删除'
  },
  {
    code: 2014, desc: 'team_sub_name_invalid', str: '跟账号规则一致'
  },
  {
    code: 2020, desc: 'team_subName_existed', str: '团队缩略名称已存在'
  },
  {
    code: 2040, desc: 'team_add_fail', str: '团队添加失败'
  },
  {
    code: 2041, desc: 'team_deleted_fail', str: '团队删除失败'
  },
  {
    code: 2042, desc: 'team_update_fail', str: '团队修改失败'
  },
  {
    code: 2043, desc: 'team_contains_user_not_deleted', str: '团队内存在未删除用户'
  },
  {
    code: 2044, desc: 'team_target_captain_exist_already', str: '目标团队已经有队长'
  },
  {
    code: 2045, desc: 'team_contains_child_not_deleted', str: '团队内存在未删除子团队'
  },
  {
    code: 2046, desc: 'team_target_district_head_exist_already', str: '目标区已存在区长'
  },
  {
    code: 2049, desc: 'team_selected_deleted_or_not_exist', str: '所选团队不存在'
  },
  {
    code: 2050, desc: 'team_add_imgFile_upload_ftp_fail', str: '添加团队时团队图像上传FTP失败'
  },
  {
    code: 2051, desc: 'team_update_imgFile_upload_fail', str: '修改团队时团队图像上传FTP失败'
  },
  {
    code: 2052, desc: 'team_data_map_fail', str: '团队数据映射失败'
  },
  {
    code: 2053, desc: 'dept_code_have_subset', str: '该组织存在子集，不能删除'
  },
  {
    code: 2054, desc: 'not_find_first_team', str: '未找到第一级团队'
  },
  {
    code: 2055, desc: 'dept_can_not_be_null', str: '组织不能为空'
  },
  {
    code: 3012, desc: 'area_name_existed_in_team', str: '区域名称在团队内已存在'
  },
  {
    code: 3013, desc: 'area_team_selected_status_deleted', str: '区域选择的所属团队,状态为删除'
  },
  {
    code: 3014, desc: 'area_team_selected_not_exist', str: '区域选择的所属团队，不存在'
  },
  {
    code: 3015, desc: 'area_selected_id_not_found', str: '区域未查到'
  },
  {
    code: 3016, desc: 'area_file_md5_invalid', str: '区域文件md5校验失败'
  },
  {
    code: 3037, desc: 'area_update_fail', str: '区域修改失败'
  },
  {
    code: 3038, desc: 'area_deleted_fail', str: '区域删除失败'
  },
  {
    code: 3039, desc: 'area_add_fail', str: '区域添加失败'
  },
  {
    code: 3040, desc: 'area_add_file_upload_ftp_fail', str: '区域文件上传ftp失败'
  },
  {
    code: 3041, desc: 'area_query_ids_empty', str: '区域id参数为空'
  },
  {
    code: 3042, desc: 'area_name_invalid', str: '区域名称不符合命名规则'
  },
  {
    code: 4018, desc: 'task_name_existed_in_team', str: '任务名称在团队内已存在'
  },
  {
    code: 4019, desc: 'task_finished_not_update', str: '任务已完成不能修改'
  },
  {
    code: 4020, desc: 'task_add_fail', str: '任务创建失败'
  },
  {
    code: 4021, desc: 'task_update_fail', str: '任务修改失败'
  },
  {
    code: 4023, desc: 'task_is_old_not_deleted', str: '非新任务不能删除'
  },
  {
    code: 4024, desc: 'flyer_not_add_task', str: '飞手不能发布任务'
  },
  {
    code: 4025, desc: 'task_name_invalid', str: '任务名称不符合命名规则'
  },
  {
    code: 4026, desc: 'task_no_existed', str: '任务不存在'
  },
  {
    code: 5017, desc: 'file_name_in_path_existed', str: '保存路径中该名称文件已存在'
  },
  {
    code: 5043, desc: 'file_add_fail', str: '文件添加失败'
  },
  {
    code: 5044, desc: 'file_deleted_fail', str: '文件删除失败'
  },
  {
    code: 5055, desc: 'file_not_exist_with_the_path', str: '该路径文件不存在'
  },
  {
    code: 5066, desc: 'file_upload_ftp_fail', str: '文件上传到FTP失败'
  },
  {
    code: 6045, desc: 'system_exception', str: '系统异常'
  },
  {
    code: 6046, desc: 'system_exception_unauthorized', str: '系统异常：权限不足'
  },
  {
    code: 6047, desc: 'system_exception_unauthenticated', str: '系统异常：访问认证出错'
  },
  {
    code: 6048, desc: 'system_hosts_file_not_found', str: '未找到系统hosts文件'
  },
  {
    code: 6049, desc: 'system_param_value_invalid', str: '参数取值无效'
  },
  {
    code: 6050, desc: 'system_operation_failure_try_later', str: '操作失败，稍后再试'
  },
  {
    code: 7022, desc: 'miss_parameter', str: '参数不全'
  },
  {
    code: 7028, desc: 'record_to_delete_not_found', str: '待删除的记录未查到'
  },
  {
    code: 7035, desc: 'record_to_update_not_found', str: '待修改的记录未查到'
  },
  {
    code: 7036, desc: 'record_status_deleted_not_update', str: '记录状态为删除，不可修改'
  },
  {
    code: 7040, desc: 'record_selected_not_exists', str: '所选记录不存在'
  },
  {
    code: 8001, desc: 'aircraft_sn_existed', str: '设备sn码已存在'
  },
  {
    code: 8002, desc: 'aircraft_add_fail', str: '设备添加失败'
  },
  {
    code: 8003, desc: 'aircraft_del_fail', str: '设备删除失败'
  },
  {
    code: 8004, desc: 'aircraft_update_fail', str: '设备修改失败'
  },
  {
    code: 9001, desc: 'graph_name_existed_in_team', str: '拼图名称在团队内已存在'
  },
  {
    code: 9002, desc: 'graph_teamId_selected_not_exists', str: '拼图所选飞行任务所属团队id不存在'
  },
  {
    code: 9003, desc: 'graph_flyTasks_teamId_required', str: '拼图需要参数飞行任务所属团队id'
  },
  {
    code: 9004, desc: 'graph_graphName_invalid', str: '拼图名称不符合命名规则'
  },
  {
    code: 9, desc: 'add_fail', str: '添加失败'
  },
  {
    code: 10, desc: 'deleted_fail', str: '删除失败'
  },
  {
    code: 11, desc: 'update_fail', str: '修改失败'
  },
  {
    code: 10001, desc: 'dict_type_name_existed', str: '字典类型已存在'
  },
  {
    code: 10002, desc: 'dict_type_code_existed', str: '字典代码已存在'
  },
  {
    code: 10001, desc: 'SYSTEM_EXCEPTION_OCCURED', str: '系统异常'
  },
  {
    code: 10005, desc: 'SYSTEM_PARAM_INVALID', str: '参数不合法'
  },
  {
    code: 20001, desc: 'RECORD_NOT_EXISTS', str: '记录不存在'
  },
  {
    code: 20002, desc: 'RECORD_ALREADY_EXISTS', str: '记录已经存在'
  },
  {
    code: 20003, desc: 'RECORD_NOT_CHANGEABLE', str: '记录不能更改'
  },
  {
    code: 88501, desc: 'request_timed_out', str: '请求超时'
  },
  {
    code: 88502, desc: 'non_authorized', str: '未授权'
  },
  {
    code: 88503, desc: 'user_token_invalid', str: '用户令牌失效'
  }
]

export default error
