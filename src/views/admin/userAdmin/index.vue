<template>
  <div class="user-admin-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="12">
        <el-button v-permissions="{ permission: ['/manage/admin/userAdmin/add'] }" :icon="Plus" type="primary" @click="handleEdit">
          {{ t('添加') }}
        </el-button>
        <el-button v-permissions="{ permission: ['/manage/admin/userAdmin/removeBatch'] }" :icon="Delete" type="danger" @click="handleDelete">
          {{ t('批量删除') }}
        </el-button>
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="12">
        <el-form v-permissions="{ permission: ['/manage/admin/userAdmin/list'] }" :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-select
              v-model="queryForm.user_role_id"
              clearable
              :placeholder="t('请选择权限角色')"
              :style="{width:'160px'}"
            >
              <el-option
                v-for="(item, index) in roleOptions"
                :key="index"
                :label="item.user_role_name"
                :value="item.user_role_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="queryForm.user_id"
              class="ml10"
              clearable
              filterable
              :loading="loading"
              :placeholder="t('请输入用户昵称')"
              remote
              :remote-method="findRemoteUserList"
              reserve-keyword
              :style="{width:'140px'}"
            >
              <el-option
                v-for="item in userList"
                :key="item.user_id"
                :label="item.user_nickname"
                :value="item.user_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" type="primary" @click="queryData">
              {{ t('查询') }}
            </el-button>
          </el-form-item>
        </el-form>
      </ms-search-box-right-panel>
    </ms-search-box>

    <el-table
      v-loading="listLoading"
      border
      :data="items"
      :height="height"
      @selection-change="setSelectRows"
    >
      <el-table-column align="center" show-overflow-tooltip type="selection"/>
      <el-table-column
        align="center"
        fixed="left"
        :label="t('用户编号')"
        prop="user_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('权限角色')"
        prop="user_role_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('角色名称')"
        prop="user_role_id"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <block v-if="roleOptions">
            <div v-for="(item, index) in roleOptions" :key="index">
              <el-tag v-if="item.user_role_id == row.user_role_id">
                {{ item.user_role_name }}
              </el-tag>
            </div>
          </block>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :formatter="formatDateTime"
        :label="t('创建时间')"
        prop="user_admin_ctime"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        align="center"
        :formatter="formatDateTime"
        :label="t('更新时间')"
        prop="user_admin_utime"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        align="center"
        :label="t('是否超管')"
        prop="user_is_superadmin"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({true:"success",false:"info"})[row.user_is_superadmin]'>
            {{ ({true:t('是'),false:t('否')})[row.user_is_superadmin] }}
          </el-tag>
        </template>
      </el-table-column>

      <!--
      <el-table-column
        align="center"
        :label="t('角色选择')"
        prop="chain_name"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <block v-if="chainOptions">
            <div v-for="(item, index) in chainOptions"  :key="index" >
              <el-tag v-if="item.chain_id == row.chain_id">
                {{ item.chain_name }}
              </el-tag>

            </div>
          </block>
        </template>
      </el-table-column>
      -->
      <el-table-column
        align="center"
        :label="t('角色选择')"
        prop="role_id"
        show-overflow-tooltip
        width="120"
      >
        <template #default="{ row }">
          <el-tag :type='({"9":"","3":"success"})[row.role_id]'>
            {{ ({"9":t('管理员'),"3":t('门店')})[row.role_id]}}
          </el-tag>
        </template>
      </el-table-column>


      <el-table-column align="center" fixed="right" :label="t('操作')" width="160">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: ['/manage/admin/userAdmin/edit'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/admin/userAdmin/remove'] }" text @click="handleDelete(row)">{{ t('删除') }}</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="ms-data-empty" :description="t('暂无数据')" />
      </template>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.page"
      :layout="layout"
      :page-size="queryForm.size"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <edit ref="editRef" @fetch-data="fetchData"/>
  </div>
</template>

<script>
  import { translate as t } from '@/i18n'
  import {doRemove, doRemoveBatch, getList, doEdit} from '@/api/admin/userAdmin'
  import Edit from './components/UserAdminEdit'
  import {Delete, Plus, Search} from '@element-plus/icons-vue'
  import {formatDateTime} from "@/utils/format";
  import {getList as getUserList} from "@/api/account/userInfo";
  import {getList as getRoleList} from '@/api/admin/userRole'

  export default defineComponent({
    name: 'UserAdmin',
    components: {Edit},
    emits: [],
    setup() {
      const $confirm = inject('$confirm')
      const $message = inject('$message')
      const $tableHeight = inject('$tableHeight')

      const state = reactive({
        editRef: null,
        height: $tableHeight(),
        items: [],
        listLoading: true,
        loading: false,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        userList: [],
        roleOptions:[],
        chainOptions:[],
        queryForm: {
          page: 1,
          size: 10,
        },
      })

      const setSelectRows = (val) => {
        state.selectRows = val
      }
      const handleEdit = (row) => {
        if (row && row.user_id) {
          state.editRef.showEdit(row)
        } else {
          state.editRef.showEdit()
        }
      }
      const handleDelete = (row) => {
        if (row.user_id) {
          $confirm(t('你确定要删除当前项吗'), null, async () => {
            const {msg, status} = await doRemove({user_id: row.user_id})

            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }

            await fetchData()
          })
        } else {
          if (state.selectRows.length > 0) {
            const user_id = state.selectRows.map((item) => item.user_id).join()
            $confirm(t('你确定要删除选中项吗'), null, async () => {
              const {msg, status} = await doRemoveBatch({user_id})
              if (200 == status) {
                $message(msg, 'success')
              } else {
                $message(msg, 'error')
              }
              await fetchData()
            })
          } else {
            $message(t('未选中任何行'), 'error')
          }
        }
      }
      const handleState = async (row) => {
        console.info(row)
        const param = {
          user_id: row.user_id,
          user_is_superadmin: row.user_is_superadmin
        }

        const {msg, status} = await doEdit(param)

        if (200 == status) {
          $message(msg, 'success')
        } else {
          $message(msg, 'error')
        }

        await fetchData()
      }
      const handleSizeChange = (val) => {
        state.queryForm.size = val
        fetchData()
      }
      const handleCurrentChange = (val) => {
        state.queryForm.page = val
        fetchData()
      }
      const queryData = () => {
        state.queryForm.page = 1
        fetchData()
      }
      const fetchData = async () => {
        state.listLoading = true
        const {
          data: {items, records},
        } = await getList(state.queryForm)
        state.items = items
        state.total = records
        state.listLoading = false
      }

      const findRemoteUserList = (user_nickname) => {
        if (user_nickname !== '') {
          state.loading = true
          setTimeout(() => {
            state.loading = false
            getUserList({user_nickname: user_nickname}).then((res) => {
              state.userList = res.data.items
            })
          }, 200)
        } else {
          state.userList = []
        }
      }

      const initLevel = async () => {
        const { data } = await getRoleList({size:500,})
        state.roleOptions = data.items
      }

      onMounted(() => {
        fetchData()
        initLevel()
      })


      return {
        t,
        ...toRefs(state),
        setSelectRows,
        handleEdit,
        handleDelete,
        handleState,
        handleSizeChange,
        findRemoteUserList,
        formatDateTime,
        handleCurrentChange,
        queryData,
        fetchData,
        Delete,
        Plus,
        Search,
      }

    },
  })
</script>

<style lang="scss" scoped>
  $base: '.user-admin';
  #{$base}-container {

    :deep(.el-table) {
      .el-button.is-text{
        width: 36px;
      }
    }
  }
</style>
