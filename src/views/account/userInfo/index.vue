<template>
  <div ref="containerRef" class="custom-table-container">
    <div class="user-info-container">
      <ms-search-box>
        <ms-search-box-left-panel :span="6">
          <el-button v-permissions="{ permission: ['/manage/account/userInfo/add'] }" :icon="Plus" type="primary" @click="handleEdit">
            {{ t('添加') }}
          </el-button>
          <el-button :icon="FolderAdd" type="success" @click="importEdit">
            {{ t('导入') }}
          </el-button>
          <el-button :icon="Printer" type="success" @click="exportCsv">
            {{ t('导出') }}
          </el-button>
          <el-button v-if="hasSelected" type="second" @click="handleAddTags">
            {{ t('批量设置标签') }}
          </el-button>
          <el-button v-if="hasSelected" type="second" @click="handleAddVouchers">
            {{ t('批量发放优惠券') }}
          </el-button>
        </ms-search-box-left-panel>

        <ms-search-box-right-panel :span="18">
          <el-form :inline="true" :model="queryForm" @submit.prevent>
            <el-form-item>
              <el-select
                v-model="queryForm.user_is_authentication"
                clearable
                :placeholder="t('请选择会员状态')"
                :style="{width:'160px'}"
              >
                <el-option
                  v-for="(item, index) in authOptions"
                  :key="index"
                  :label="item.auth_name"
                  :value="item.auth_id"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-tree-select
                v-model="tag_id_list"
                clearable
                :data="tagGroupTreeList"
                :default-expand-all="isExpandTreeSelect"
                filterable
                highlight-current
                multiple
                node-key="tag_id"
                :placeholder="t('请选择用户标签')"
                :props="{ value: 'tag_id', label: 'tag_title'}"
                style="width: 160px"
                value-key="tag_title"
              />
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="queryForm.user_level_id"
                clearable
                :placeholder="t('请选择会员等级')"
                :style="{width:'160px'}"
              >
                <el-option
                  v-for="(item, index) in levelOptions"
                  :key="index"
                  :label="item.user_level_name"
                  :value="item.user_level_id"
                />
              </el-select>
            </el-form-item>
            <el-form-item >
              <el-select v-model="queryForm.search_type" :placeholder="t('请选择')" :style="{width:'100px'}">
                <el-option :label="t('用户账号')" value="user_account"/>
                <el-option :label="t('用户昵称')" value="user_nickname"/>
                <el-option :label="t('手机号码')" value="user_mobile"/>
              </el-select>
              <el-input
                v-if="queryForm.search_type == 'user_account'"
                v-model.trim="queryForm.user_account"
                clearable
                :placeholder="t('请输入用户账号')"
                :style="{width:'140px'}"
              />
              <el-input
                v-else-if="queryForm.search_type == 'user_mobile'"
                v-model.trim="queryForm.user_mobile"
                clearable
                :placeholder="t('请输入手机号码')"
                :style="{width:'140px'}"
              />
              <el-select
                v-else-if="queryForm.search_type == 'user_nickname'"
                v-model="queryForm.user_id"
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
              <el-button v-permissions="{ permission: ['/manage/account/userInfo/list'] }" :icon="Search" type="primary" @click="queryData">
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
        >
          <template #default="{ row }">
            <el-link style="color: #1890ff" @click="showInfo(row)">
              {{ row.user_id }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('用户账号')"
          prop="user_account"
          show-overflow-tooltip
          width="200"
        />
        <el-table-column
          align="center"
          :label="t('用户昵称')"
          prop="user_nickname"
          show-overflow-tooltip
          width="150"
        />
        <el-table-column
          align="center"
          :label="t('用户头像')"
          prop="user_avatar"
          show-overflow-tooltip
          width="100"
        >
          <template #default="{ row }">
            <el-image
              :preview-src-list="[row.user_avatar]"
              preview-teleported
              :src="row.user_avatar"
              style="width: 35px; height: 35px"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('状态')"
          prop="user_state"
          show-overflow-tooltip
          width="100"
        >
          <template #default="{ row }">
            <el-tag :type='(["","success","warning"])[row.user_state]'>
              {{ ([t('锁定'),t('已激活'),t('未激活')])[row.user_state] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('手机号码')"
          prop="user_mobile"
          show-overflow-tooltip
          width="200"
        />
        <el-table-column
          align="center"
          :label="t('国家编码')"
          prop="user_intl"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          align="center"
          :label="t('性别')"
          prop="user_gender"
          show-overflow-tooltip
          width="100"
        >
          <template #default="{ row }">
            <el-tag :type='(["0","1","2"])[row.user_gender]'>
              {{ ([t('保密'),t('男'),t('女')])[row.user_gender] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :formatter="formatDate"
          :label="t('生日')"
          prop="user_birthday"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          align="center"
          :label="t('用户邮箱')"
          prop="user_email"
          show-overflow-tooltip
          width="200"
        />
        <el-table-column
          align="center"
          :label="t('会员等级')"
          prop="user_level_id"
          show-overflow-tooltip
          width="100"
        >
          <template #default="{ row }">
            <block v-if="levelOptions">
              <div v-for="(item, index) in levelOptions" :key="index">
                <el-tag v-if="item.user_level_id == row.user_level_id">
                  {{ item.user_level_name }}
                </el-tag>
              </div>
            </block>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('认证状态')"
          prop="user_is_authentication"
          show-overflow-tooltip
          width="100"
        >
          <template #default="{ row }">
            <el-tag :type='({"0":"warning","0":"info","0":"success","0":"danger"})[row.user_is_authentication]'>
              {{ ({"0":t('未认证'),"1":t('待审核'),"2":t('认证通过'),"3":t('认证失败')})[row.user_is_authentication] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="t('来源编号')"
          prop="user_parent_id"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column align="center" fixed="right" :label="t('操作')" width="240">
          <template #default="{ row }">
            <el-button text @click="showInfo(row)">{{ t('详情') }}</el-button>
            <el-button v-permissions="{ permission: ['/manage/account/userInfo/edit'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
            <el-button text @click="passWordEdit(row)">{{ t('密码') }}</el-button>
            <el-button v-if="row.user_is_authentication == 1" text @click="showInfo(row)">{{ t('认证') }}</el-button>
            <el-button v-permissions="{ permission: ['/manage/account/userInfo/remove'] }" text @click="handleDelete(row)">{{ t('删除') }}</el-button>
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
      <info ref="infoRef" @fetch-data="fetchData"/>
      <passWord ref="passWordRef" @fetch-data="fetchData"/>
      <addTags ref="addTagsRef" @fetch-data="fetchData"/>
      <addVouchers ref="addVouchersRef" @fetch-data="fetchData"/>
      <import ref="importRef" @fetch-data="fetchData"/>
    </div>
  </div>
</template>

<script>
import { translate as t } from '@/i18n'
import {doRemove, doRemoveBatch, getList as getUserList, getList, exportFile} from '@/api/account/userInfo'
import Edit from './components/UserInfoEdit'
import Info from './components/UserInfo'
import PassWord from './components/PassWordEdit'
import AddTags from './components/AddTags'
import AddVouchers from './components/AddVouchers'
import Import from './components/UserInfoImport'
import {Delete, Plus, Search, Printer, FolderAdd} from '@element-plus/icons-vue'
import {formatDate} from "@/utils/format";
import {tree} from "@/api/account/userTagGroup";
import {getList as levelGetList} from "@/api/account/userLevel";

export default defineComponent({
  name: 'UserInfo',
  components: {Edit, Info, PassWord, AddTags, AddVouchers, Import},
  emits: [],
  setup() {
    const $confirm = inject('$confirm')
    const $message = inject('$message')
    const $tableHeight = inject('$tableHeight')

    const state = reactive({
      editRef: null,
      infoRef: null,
      passWordRef: null,
      addTagsRef: null,
      addVouchersRef: null,
      importRef: null,
      height: $tableHeight(),
      items: [],
      levelOptions:[],
      authOptions: [
        {
          auth_name: t('未认证'),
          auth_id: 0,
        },
        {
          auth_name: t('待审核'),
          auth_id: 1,
        },
        {
          auth_name: t('认证通过'),
          auth_id: 2,
        },
        {
          auth_name: t('认证失败'),
          auth_id: 3,
        },
      ],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
      tagGroupTreeList: [],
      isExpandTreeSelect: true,
      queryForm: {
        page: 1,
        size: 10,
        search_type: "user_account",
        user_account: '',
        user_mobile: '',
        user_id: '',
        tag_ids: [],
      },
      tag_id_list: [],
      hasSelected:false,
      loading:false,
      userList: [],
    })

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

    const setSelectRows = (val) => {
      if (val.length > 0) {
        state.hasSelected = true
      }
      else {
        state.hasSelected = false
      }

      state.selectRows = val
    }
    const handleEdit = (row) => {
      if (row && row.user_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit()
      }
    }

    const importEdit = (row) => {
      state.importRef.showEdit(row)
    }

    const handleAddTags = () => {
        if (state.selectRows.length > 0) {
          const user_ids = state.selectRows.map((item) => item.user_id).join()
          state.addTagsRef.showAddTags(user_ids)
        } else {
          state.addTagsRef.showAddTags()
        }
    }

    const handleAddVouchers = () => {
      if (state.selectRows.length > 0) {
        const user_ids = state.selectRows.map((item) => item.user_id).join()
        state.addVouchersRef.showAddVouchers(user_ids)
      } else {
        state.addVouchersRef.showAddVouchers()
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
      }

      const {msg, status} = await editState(param)

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

    const exportCsv = () => {
      if (state.selectRows.length <= 0) {
        $message('没有选中的数据！', 'error')
        return
      }
      const user_ids = state.selectRows.map((item) => item.user_id).join()
      exportFile({ user_ids: user_ids }).then((data) => {
        const blob = new Blob([data])
        const downloadElement = document.createElement('a')
        const href = window.URL.createObjectURL(blob) //创建下载的链接
        downloadElement.href = href
        downloadElement.download = decodeURIComponent('用户信息列表.csv') //下载后文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() //点击下载
        document.body.removeChild(downloadElement) //下载完成移除元素
        window.URL.revokeObjectURL(href) //释放掉blob对象
      })
      fetchData()
    }

    const fetchData = async () => {
      if (state.queryForm.search_type == 'user_account') {
        state.queryForm.user_mobile = ''
        state.queryForm.user_id = ''
      } else if (state.queryForm.search_type == 'user_mobile') {
        state.queryForm.user_account = ''
        state.queryForm.user_id = ''
      } else if (state.queryForm.search_type == 'user_nickname') {
        state.queryForm.user_account = ''
        state.queryForm.user_mobile = ''
      }

      state.listLoading = true
      if (state.tag_id_list) {
        state.queryForm.tag_ids = state.tag_id_list.join()
      }

      const {
        data: {items, records},
      } = await getList(state.queryForm)
      state.items = items
      state.total = records
      state.listLoading = false
    }

    const initLevel = async () => {
      const { data } = await levelGetList({size:500,})
      state.levelOptions = data.items
    }

    const getTree = async () => {
      const { data } = await tree({size:500,})
      state.tagGroupTreeList = data
    }

    onMounted(() => {
      initLevel()
      getTree()
      fetchData()
    })


    const showInfo = (row) => {
      state.infoRef.showInfo(row)
    }

    const passWordEdit = (row) => {
      state.passWordRef.showPassWordEdit(row)
    }

    return {
      t,
      ...toRefs(state),
      setSelectRows,
      showInfo,
      passWordEdit,
      getTree,
      handleEdit,
      handleAddTags,
      handleAddVouchers,
      initLevel,
      handleDelete,
      handleState,
      exportCsv,
      handleSizeChange,
      findRemoteUserList,
      handleCurrentChange,
      importEdit,
      queryData,
      fetchData,
      Delete,
      Plus,
      Search,
      Printer,
      FolderAdd,
      formatDate,
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.user-info';
#{$base}-container {
  padding: 0 !important;

  .ml10 {
    margin-left: 10px;
  }

  :deep(.el-table) {
    .el-button.is-text{
      width: 40px;
    }
  }
}
</style>
