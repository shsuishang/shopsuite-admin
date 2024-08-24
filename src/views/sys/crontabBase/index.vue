<template>
  <div class="crontab-base-container">
    <ms-search-box>
      <div style="margin-bottom: 12px">
        <p>
          crontab命令常见于Unix和Linux中用于设置周期性被执行的指令.
        </p>
      </div>
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
        :label="t('任务编号')"
        prop="crontab_id"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :label="t('任务名称')"
        prop="crontab_name"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('任务脚本')"
        prop="crontab_file"
        show-overflow-tooltip
        width="200"
      />
      <el-table-column
        align="center"
        :formatter="formatDateTime"
        :label="t('上次执行时间')"
        prop="crontab_last_exe_time"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        v-if="false"
        align="center"
        :formatter="formatDateTime"
        :label="t('下次执行时间')"
        prop="crontab_next_exe_time"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        align="center"
        :label="t('分钟')"
        prop="crontab_minute"
        show-overflow-tooltip
        width="70"
      >
        <template #default="{ row }">
          <el-tag :type='({"*":"","0":"success","1":"warning","2":"info","3":"danger","4":null,"5":null,"6":null,"7":null,"8":null,"9":null,"10":null,"11":null,"12":null,"13":null,"14":null,"15":null,"16":null,"17":null,"18":null,"19":null,"20":null,"21":null,"22":null,"23":null,"24":null,"25":null,"26":null,"27":null,"28":null,"29":null,"30":null,"31":null,"32":null,"33":null,"34":null,"35":null,"36":null,"37":null,"38":null,"39":null,"40":null,"41":null,"42":null,"43":null,"44":null,"45":null,"46":null,"47":null,"48":null,"49":null,"50":null,"51":null,"52":null,"53":null,"54":null,"55":null,"56":null,"57":null,"58":null,"59":null})[row.crontab_minute]'>
            {{ ({"*":t('每分'),"0":t('0'),"1":t('1'),"2":t('2'),"3":t('3'),"4":t('4'),"5":t('5'),"6":t('6'),"7":t('7'),"8":t('8'),"9":t('9'),"10":t('10'),"11":t('11'),"12":t('12'),"13":t('13'),"14":t('14'),"15":t('15'),"16":t('16'),"17":t('17'),"18":t('18'),"19":t('19'),"20":t('20'),"21":t('21'),"22":t('22'),"23":t('23'),"24":t('24'),"25":t('25'),"26":t('26'),"27":t('27'),"28":t('28'),"29":t('29'),"30":t('30'),"31":t('31'),"32":t('32'),"33":t('33'),"34":t('34'),"35":t('35'),"36":t('36'),"37":t('37'),"38":t('38'),"39":t('39'),"40":t('40'),"41":t('41'),"42":t('42'),"43":t('43'),"44":t('44'),"45":t('45'),"46":t('46'),"47":t('47'),"48":t('48'),"49":t('49'),"50":t('50'),"51":t('51'),"52":t('52'),"53":t('53'),"54":t('54'),"55":t('55'),"56":t('56'),"57":t('57'),"58":t('58'),"59":t('59')})[row.crontab_minute] ?? row.crontab_minute }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('小时')"
        prop="crontab_hour"
        show-overflow-tooltip
        width="70"
      >
        <template #default="{ row }">
          <el-tag :type='({"*":"","0":"success","1":"warning","2":"info","3":"danger","4":null,"5":null,"6":null,"7":null,"8":null,"9":null,"10":null,"11":null,"12":null,"13":null,"14":null,"15":null,"16":null,"17":null,"18":null,"19":null,"20":null,"21":null,"22":null,"23":null})[row.crontab_hour]'>
            {{ ({"*":t('任意'),"0":t('0'),"1":t('1'),"2":t('2'),"3":t('3'),"4":t('4'),"5":t('5'),"6":t('6'),"7":t('7'),"8":t('8'),"9":t('9'),"10":t('10'),"11":t('11'),"12":t('12'),"13":t('13'),"14":t('14'),"15":t('15'),"16":t('16'),"17":t('17'),"18":t('18'),"19":t('19'),"20":t('20'),"21":t('21'),"22":t('22'),"23":t('23')})[row.crontab_hour] ??  row.crontab_hour}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('每天')"
        prop="crontab_day"
        show-overflow-tooltip
        width="70"
      >
        <template #default="{ row }">
          <el-tag :type='({"*":"","1":"success","2":"warning","3":"info","4":"danger","5":null,"6":null,"7":null,"8":null,"9":null,"10":null,"11":null,"12":null,"13":null,"14":null,"15":null,"16":null,"17":null,"18":null,"19":null,"20":null,"21":null,"22":null,"23":null,"24":null,"25":null,"26":null,"27":null,"28":null,"29":null,"30":null,"31":null})[row.crontab_day]'>
            {{ ({"*":t('任意'),"1":t('1'),"2":t('2'),"3":t('3'),"4":t('4'),"5":t('5'),"6":t('6'),"7":t('7'),"8":t('8'),"9":t('9'),"10":t('10'),"11":t('11'),"12":t('12'),"13":t('13'),"14":t('14'),"15":t('15'),"16":t('16'),"17":t('17'),"18":t('18'),"19":t('19'),"20":t('20'),"21":t('21'),"22":t('22'),"23":t('23'),"24":t('24'),"25":t('25'),"26":t('26'),"27":t('27'),"28":t('28'),"29":t('29'),"30":t('30'),"31":t('31')})[row.crontab_day] ??  row.crontab_day }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('每月')"
        prop="crontab_month"
        show-overflow-tooltip
        width="70"
      >
        <template #default="{ row }">
          <el-tag :type='({"*":"","1":"success","2":"warning","3":"info","4":"danger","5":null,"6":null,"7":null,"8":null,"9":null,"10":null,"11":null,"12":null})[row.crontab_month]'>
            {{ ({"*":t('任意'),"1":t('1月'),"2":t('2月'),"3":t('3月'),"4":t('4月'),"5":t('5月'),"6":t('6月'),"7":t('7月'),"8":t('8月'),"9":t('9月'),"10":t('10月'),"11":t('11月'),"12":t('12月')})[row.crontab_month] ??  row.crontab_month  }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('每周')"
        prop="crontab_week"
        show-overflow-tooltip
        width="70"
      >
        <template #default="{ row }">
          <el-tag :type='({"*":"","0":"success","1":"warning","2":"info","3":"danger","4":null,"5":null,"6":null})[row.crontab_week]'>
            {{ ({"*":t('每周'),"0":t('周日'),"1":t('周一'),"2":t('周二'),"3":t('周三'),"4":t('周四'),"5":t('周五'),"6":t('周六')})[row.crontab_week] ?? row.crontab_week }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('是否启用')"
        prop="crontab_enable"
        show-overflow-tooltip
        width="100"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.crontab_enable === 0 ? t('点击') + t('是') :  t('点击')  + t('否')"
            :enterable="false"
            placement="top"
          >
            <el-switch v-model="row.crontab_enable"  active-color="#13ce66" :active-value=true :before-change="beforeSwitchChange" inactive-color="#ff4949" :inactive-value=false @change="handleState(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        align="center"
        :label="t('任务备注')"
        prop="crontab_remark"
        show-overflow-tooltip
        width="200"
      />
      <el-table-column align="center" fixed="right" :label="t('操作')" width="100">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: ['/manage/sys/crontabBase/edit'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
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
import {doRemove, getList, editState} from '@/api/sys/crontabBase'
import Edit from './components/CrontabBaseEdit'
import {Delete, Plus, Search} from '@element-plus/icons-vue'
import {formatDateTime} from "@/utils/format";

export default defineComponent({
  name: 'CrontabBase',
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
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
      queryForm: {
        page: 1,
        size: 10,
        title: '',
      },
      switchStatus: false,
    })

    const setSelectRows = (val) => {
      state.selectRows = val
    }
    const handleEdit = (row) => {
      if (row && row.crontab_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit()
      }
    }
    const handleDelete = (row) => {
      if (row.crontab_id) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemove({crontab_id: row.crontab_id})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        })
      } else {
        if (state.selectRows.length > 0) {
          const crontab_id = state.selectRows.map((item) => item.crontab_id).join()
          $confirm(t('你确定要删除选中项吗'), null, async () => {
            const {msg, status} = await doRemoveBatch({crontab_id})
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

        if (state.switchStatus) {
          const param = {
            crontab_id : row.crontab_id,
            crontab_enable : row.crontab_enable
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
      handleEdit,
      handleDelete,
      beforeSwitchChange,
      handleState,
      handleSizeChange,
      handleCurrentChange,
      queryData,
      fetchData,
      formatDateTime,
      Delete,
      Plus,
      Search,
    }
  },
})
</script>

<style lang="scss" scoped>
$base: '.crontab-base';
#{$base}-container {

  :deep(.el-table) {
    .el-button.is-text{
      width: 40px;
    }
  }
}

.page-header {
  transition: none;

  &-tip {
    flex: auto;
    width: calc(100% - 200px);

    &-title {
      margin-bottom: 12px;
      font-size: 20px;
      font-weight: bold;
      color: #3c4a54;
    }

    &-description {
      min-height: 20px;
      font-size: $base-font-size-default;
      color: #808695;
    }
  }
}
</style>
