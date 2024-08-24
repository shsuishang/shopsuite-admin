<template>
  <div class="page-base-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="12">
        <el-button v-permissions="{ permission: ['/manage/sys/diy/index'] }" :icon="Plus" type="primary" @click="handleEdit">
          {{ t('添加') }}
        </el-button>
      </ms-search-box-left-panel>
      <ms-search-box-right-panel :span="12">
        <el-form v-permissions="{ permission: ['/manage/sys/diy/index'] }" :inline="true" :model="queryForm" @submit.prevent>
<!--          <el-form-item>-->
<!--            <el-select-->
<!--              v-model="queryForm.user_id"-->
<!--              class="ml10"-->
<!--              clearable-->
<!--              filterable-->
<!--              :loading="loading"-->
<!--              :placeholder="t('请输入用户昵称')"-->
<!--              remote-->
<!--              :remote-method="findRemoteUserList"-->
<!--              reserve-keyword-->
<!--              :style="{width:'140px'}"-->
<!--            >-->
<!--              <el-option-->
<!--                v-for="item in userList"-->
<!--                :key="item.user_id"-->
<!--                :label="item.user_nickname"-->
<!--                :value="item.user_id"-->
<!--              />-->
<!--            </el-select>-->
<!--          </el-form-item>-->
          <el-form-item>
            <el-input
              v-model.trim="queryForm.page_name"
              clearable
              :placeholder="t('请输入页面名称')"
              style="margin-left: 10px"
            />
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
      <el-table-column
        align="center"
        fixed="left"
        :label="t('页面编号')"
        prop="page_id"
        show-overflow-tooltip
        width="150"
      />
      <el-table-column
        align="center"
        :label="t('页面名称')"
        prop="page_name"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('所属店铺')"
        prop="store_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('所属用户')"
        prop="user_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('所属分站')"
        prop="subsite_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('类型')"
        prop="page_type"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type='({"1":"info","2":"success","3":"success"})[row.page_type]'>
            {{ ({"1":t('WAP'),"2":t('PC'),"3":t('APP')})[row.page_type] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('布局模板')"
        prop="page_tpl"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('所属APP')"
        prop="app_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('是否首页')"
        prop="page_index"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.page_index === 0 ? t('点击') + t('首页') :  t('点击')  + t('非首页')"
            :enterable="false"
            placement="top"
          >
            <el-switch
                       v-model="row.page_index"
                       active-color="#13ce66"
                       :active-value=true
                       :before-change="beforeSwitchChange"
                       inactive-color="#ff4949"
                       :inactive-value=false
                       @change="handleState(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('拼团首页')"
        prop="page_gb"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.page_gb === 0 ? t('点击') + t('首页') :  t('点击')  + t('非首页')"
            :enterable="false"
            placement="top"
          >
            <el-switch
              v-model="row.page_gb"
              active-color="#13ce66"
              :active-value=true
              :before-change="beforeSwitchChange"
              inactive-color="#ff4949"
              :inactive-value=false
              @change="handleState(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('活动首页')"
        prop="page_activity"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.page_activity === 0 ? t('点击') + t('首页') :  t('点击')  + t('非首页')"
            :enterable="false"
            placement="top"
          >
            <el-switch
              v-model="row.page_activity"
              active-color="#13ce66"
              :active-value=true
              :before-change="beforeSwitchChange"
              inactive-color="#ff4949"
              :inactive-value=false
              @change="handleState(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('积分首页')"
        prop="page_point"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.page_point === 0 ? t('点击') + t('首页') :  t('点击')  + t('非首页')"
            :enterable="false"
            placement="top"
          >
            <el-switch
              v-model="row.page_point"
              active-color="#13ce66"
              :active-value=true
              :before-change="beforeSwitchChange"
              inactive-color="#ff4949"
              :inactive-value=false
              @change="handleState(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('团购首页')"
        prop="page_gbs"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.page_gbs === 0 ? t('点击') + t('首页') :  t('点击')  + t('非首页')"
            :enterable="false"
            placement="top"
          >
            <el-switch
              v-model="row.page_gbs"
              active-color="#13ce66"
              :active-value=true
              :before-change="beforeSwitchChange"
              inactive-color="#ff4949"
              :inactive-value=false
              @change="handleState(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('组合套餐')"
        prop="page_package"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.page_package === 0 ? t('点击') + t('首页') :  t('点击')  + t('非首页')"
            :enterable="false"
            placement="top"
          >
            <el-switch
              v-model="row.page_package"
              active-color="#13ce66"
              :active-value=true
              :before-change="beforeSwitchChange"
              inactive-color="#ff4949"
              :inactive-value=false
              @change="handleState(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('批发团购首页')"
        prop="page_pfgb"
        show-overflow-tooltip
        width="120"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.page_pfgb === 0 ? t('点击') + t('首页') :  t('点击')  + t('非首页')"
            :enterable="false"
            placement="top"
          >
            <el-switch
              v-model="row.page_pfgb"
              active-color="#13ce66"
              :active-value=true
              :before-change="beforeSwitchChange"
              inactive-color="#ff4949"
              :inactive-value=false
              @change="handleState(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('社区')"
        prop="page_sns"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.page_sns === 0 ? t('点击') + t('首页') :  t('点击')  + t('非首页')"
            :enterable="false"
            placement="top"
          >
            <el-switch
              v-model="row.page_sns"
              active-color="#13ce66"
              :active-value=true
              :before-change="beforeSwitchChange"
              inactive-color="#ff4949"
              :inactive-value=false
              @change="handleState(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('资讯')"
        prop="page_article"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.page_article === 0 ? t('点击') + t('首页') :  t('点击')  + t('非首页')"
            :enterable="false"
            placement="top"
          >
            <el-switch
              v-model="row.page_article"
              active-color="#13ce66"
              :active-value=true
              :before-change="beforeSwitchChange"
              inactive-color="#ff4949"
              :inactive-value=false
              @change="handleState(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('零元购区')"
        prop="page_zerobuy"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.page_zerobuy === 0 ? t('点击') + t('是') :  t('点击')  + t('否')"
            :enterable="false"
            placement="top"
          >
            <el-switch
              v-model="row.page_zerobuy"
              active-color="#13ce66"
              :active-value=true
              :before-change="beforeSwitchChange"
              inactive-color="#ff4949"
              :inactive-value=false
              @change="handleState(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('高额返区')"
        prop="page_higharea"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.page_higharea === 0 ? t('点击') + t('是') :  t('点击')  + t('否')"
            :enterable="false"
            placement="top"
          >
            <el-switch
              v-model="row.page_higharea"
              active-color="#13ce66"
              :active-value=true
              :before-change="beforeSwitchChange"
              inactive-color="#ff4949"
              :inactive-value=false
              @change="handleState(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('今日爆款')"
        prop="page_taday"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.page_taday === 0 ? t('点击') + t('是') :  t('点击')  + t('否')"
            :enterable="false"
            placement="top"
          >
            <el-switch
              v-model="row.page_taday"
              active-color="#13ce66"
              :active-value=true
              :before-change="beforeSwitchChange"
              inactive-color="#ff4949"
              :inactive-value=false
              @change="handleState(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('每日好店')"
        prop="page_everyday"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.page_everyday === 0 ? t('点击') + t('是') :  t('点击')  + t('否')"
            :enterable="false"
            placement="top"
          >
            <el-switch
              v-model="row.page_everyday"
              active-color="#13ce66"
              :active-value=true
              :before-change="beforeSwitchChange"
              inactive-color="#ff4949"
              :inactive-value=false
              @change="handleState(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('整点秒杀')"
        prop="page_secondkill"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.page_secondkill === 0 ? t('点击') + t('是') :  t('点击')  + t('否')"
            :enterable="false"
            placement="top"
          >
            <el-switch
              v-model="row.page_secondkill"
              active-color="#13ce66"
              :active-value=true
              :before-change="beforeSwitchChange"
              inactive-color="#ff4949"
              :inactive-value=false
              @change="handleState(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('天天秒淘')"
        prop="page_secondday"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.page_secondday === 0 ? t('点击') + t('是') :  t('点击')  + t('否')"
            :enterable="false"
            placement="top"
          >
            <el-switch
              v-model="row.page_secondday"
              active-color="#13ce66"
              :active-value=true
              :before-change="beforeSwitchChange"
              inactive-color="#ff4949"
              :inactive-value=false
              @change="handleState(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('设置土特产')"
        prop="page_rura"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.page_rura === 0 ? t('点击') + t('是') :  t('点击')  + t('否')"
            :enterable="false"
            placement="top"
          >
            <el-switch
              v-model="row.page_rura"
              active-color="#13ce66"
              :active-value=true
              :before-change="beforeSwitchChange"
              inactive-color="#ff4949"
              :inactive-value=false
              @change="handleState(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('banner')"
        prop="page_likeyou"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.page_likeyou === 0 ? t('点击') + t('是') :  t('点击')  + t('否')"
            :enterable="false"
            placement="top"
          >
            <el-switch
              v-model="row.page_likeyou"
              active-color="#13ce66"
              :active-value=true
              :before-change="beforeSwitchChange"
              inactive-color="#ff4949"
              :inactive-value=false
              @change="handleState(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('兑换专区')"
        prop="page_exchange"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.page_exchange === 0 ? t('点击') + t('是') :  t('点击')  + t('否')"
            :enterable="false"
            placement="top"
          >
            <el-switch
              v-model="row.page_exchange"
              active-color="#13ce66"
              :active-value=true
              :before-change="beforeSwitchChange"
              inactive-color="#ff4949"
              :inactive-value=false
              @change="handleState(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('新品首发')"
        prop="page_new"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.page_new === 0 ? t('点击') + t('是') :  t('点击')  + t('否')"
            :enterable="false"
            placement="top"
          >
            <el-switch
              v-model="row.page_new"
              active-color="#13ce66"
              :active-value=true
              :before-change="beforeSwitchChange"
              inactive-color="#ff4949"
              :inactive-value=false
              @change="handleState(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('新人优惠')"
        prop="page_newperson"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.page_newperson === 0 ? t('点击') + t('是') :  t('点击')  + t('否')"
            :enterable="false"
            placement="top"
          >
            <el-switch
              v-model="row.page_newperson"
              active-color="#13ce66"
              :active-value=true
              :before-change="beforeSwitchChange"
              inactive-color="#ff4949"
              :inactive-value=false
              @change="handleState(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('升级VIP')"
        prop="page_upgrade"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.page_upgrade === 0 ? t('点击') + t('是') :  t('点击')  + t('否')"
            :enterable="false"
            placement="top"
          >
            <el-switch
              v-model="row.page_upgrade"
              active-color="#13ce66"
              :active-value=true
              :before-change="beforeSwitchChange"
              inactive-color="#ff4949"
              :inactive-value=false
              @change="handleState(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('信息发布')"
        prop="page_message"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.page_message === 0 ? t('点击') + t('是') :  t('点击')  + t('否')"
            :enterable="false"
            placement="top"
          >
            <el-switch
              v-model="row.page_message"
              active-color="#13ce66"
              :active-value=true
              :before-change="beforeSwitchChange"
              inactive-color="#ff4949"
              :inactive-value=false
              @change="handleState(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('是否发布')"
        prop="page_release"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.page_release === 0 ? t('点击') + t('是') :  t('点击')  + t('否')"
            :enterable="false"
            placement="top"
          >
            <el-switch
              v-model="row.page_release"
              active-color="#13ce66"
              :active-value=true
              :before-change="beforeSwitchChange"
              inactive-color="#ff4949"
              :inactive-value=false
              @change="handleState(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" :label="t('操作')" width="160">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: ['/manage/sys/diy/index'] }" text @click="handleDiy(row)">{{ t('装修') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/sys/diy/index'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/sys/diy/index'] }" text @click="handleDelete(row)">{{ t('删除') }}</el-button>
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
    <diy ref="diyRef" @fetch-data="fetchData"/>
  </div>
</template>

<script>
  import { translate as t } from '@/i18n'
  import {doRemove, getList, editState} from '@/api/sys/pageBase'
  import Edit from './components/PcEdit'
  import Diy from './components/PcDiy'
  import {Delete, Plus, Search} from '@element-plus/icons-vue'
  import {getList as getUserList} from "@/api/account/userInfo";

  export default defineComponent({
    name: 'PageBasePc',
    components: {Edit, Diy},
    emits: [],
    setup() {
      const $confirm = inject('$confirm')
      const $message = inject('$message')
      const $tableHeight = inject('$tableHeight')

      const state = reactive({
        editRef: null,
        diyRef: null,
        height: $tableHeight(),
        items: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          page: 1,
          size: 10,
          page_name: '',
          page_type: 2,
        },
        loading: false,
        userList: [],
        switchStatus: false,
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
        state.selectRows = val
      }
      const handleEdit = (row) => {
        if (row && row.page_id) {
          state.editRef.showEdit(row)
        } else {
          state.editRef.showEdit()
        }
      }

      const handleDiy = (row) => {
        if (row && row.page_id) {
          state.diyRef.showDiy(row)
        } else {
          state.diyRef.showDiy()
        }
      }

      const handleDelete = (row) => {
        if (row.page_id) {
          $confirm(t('你确定要删除当前项吗'), null, async () => {
            const {msg, status} = await doRemove({page_id: row.page_id})

            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }

            await fetchData()
          })
        } else {
          if (state.selectRows.length > 0) {
            const page_id = state.selectRows.map((item) => item.page_id).join()
            $confirm(t('你确定要删除选中项吗'), null, async () => {
              const {msg, status} = await doRemoveBatch({page_id})
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

      const beforeSwitchChange = () => {
        state.switchStatus = true;
        return state.switchStatus;
      }

      const handleState = async (row) => {
        console.info(row)
          if (state.switchStatus) {
            const param = {
              page_id : row.page_id,
              page_index : row.page_index,
              page_gb : row.page_gb,
              page_activity : row.page_activity,
              page_point : row.page_point,
              page_gbs : row.page_gbs,
              page_package : row.page_package,
              page_pfgb : row.page_pfgb,
              page_sns : row.page_sns,
              page_article : row.page_article,
              page_zerobuy : row.page_zerobuy,
              page_higharea : row.page_higharea,
              page_taday : row.page_taday,
              page_everyday : row.page_everyday,
              page_secondkill : row.page_secondkill,
              page_secondday : row.page_secondday,
              page_rura : row.page_rura,
              page_likeyou : row.page_likeyou,
              page_exchange : row.page_exchange,
              page_new : row.page_new,
              page_newperson : row.page_newperson,
              page_upgrade : row.page_upgrade,
              page_message : row.page_message,
              page_release : row.page_release,
            }

            const {msg, status} = await editState(param)

            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }

            await fetchData()
          }
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
      onMounted(() => {
        fetchData()
      })

      return {
        t,
        ...toRefs(state),
        setSelectRows,
        findRemoteUserList,
        handleEdit,
        handleDiy,
        handleDelete,
        handleState,
        handleSizeChange,
        beforeSwitchChange,
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
  $base: '.page-base';
  #{$base}-container {

    :deep(.el-table) {
      .el-button.is-text{
        width: 36px;
      }
    }
  }
</style>
