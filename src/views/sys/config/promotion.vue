<template>
  <div>
    <el-card class="box-card">
      <el-form ref="formRef" :model="form">
        <div class="clearfix">
          <span>
            <h3>{{ t("分销参数设置") }}</h3>
          </span>
        </div>
        <el-table border :data="list" height="350" @cell-click="tabClick">
          <el-table-column
            align="center"
            :label="t('等级名称')"
            prop="user_level_id">
            <template #default="scope">
              <span
                v-if="
                  scope.row.user_level_id === tabClickIndex &&
                  scope.column.id === columnId
                "
              >
                <el-input
                  ref="editInputRef"
                  v-model="scope.row.user_level_name"
                  @blur.stop="inputBlur(scope.row)"
                />
              </span>
              <span v-else>{{ scope.row.user_level_name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="t('一级消费')"
            prop="plantform_fx_cps_rate_1"
          >
              <template #default="scope">
                <span
                  v-if="
                    scope.row.user_level_id === tabClickIndex &&
                    scope.column.id === columnId
                  "
                >
                  <el-input
                    ref="editInputRef"
                    v-model="scope.row.plantform_fx_cps_rate_1"
                    @blur.stop="inputBlur(scope.row)"
                  />
                </span>
                <span v-else>{{ scope.row.plantform_fx_cps_rate_1 }}</span>
              </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="t('二级消费')"
            prop="plantform_fx_cps_rate_2"
          >
              <template #default="scope">
                <span
                  v-if="
                    scope.row.user_level_id === tabClickIndex &&
                    scope.column.id === columnId
                  "
                >
                  <el-input
                    ref="editInputRef"
                    v-model="scope.row.plantform_fx_cps_rate_2"
                    @blur.stop="inputBlur(scope.row)"
                  />
                </span>
                <span v-else>{{ scope.row.plantform_fx_cps_rate_2 }}</span>
              </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="t('三级消费')"
            prop="plantform_fx_cps_rate_3"
          >
              <template #default="scope">
                <span
                  v-if="
                    scope.row.user_level_id === tabClickIndex &&
                    scope.column.id === columnId
                  "
                >
                  <el-input
                    ref="editInputRef"
                    v-model="scope.row.plantform_fx_cps_rate_3"
                    @blur.stop="inputBlur(scope.row)"
                  />
                </span>
                <span v-else>{{ scope.row.plantform_fx_cps_rate_3 }}</span>
              </template>
          </el-table-column>
        </el-table>
        <el-button
          :icon="Tools"
          style="
            width: 100%;
            height: 35px;
            margin-top: 30px;
            background-color: #0f2027;
          "
          type="info"
          @click="handleEdit"
        >
          {{ t('修改') }}
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>


<script>
  import { translate as t } from '@/i18n'
  import {Tools} from '@element-plus/icons-vue'
  import {getList as getLevelList} from '@/api/account/userLevel'
  import {getConfigBase, doEdit} from '@/api/sys/config'
  import { isJson } from 'vue-plugin-utils'

  export default defineComponent({
    name: 'Promotion',
    components: {},
    setup() {
      const $tableHeight = inject('$tableHeight')
      const $message = inject('$message')

      const state = reactive({
        formRef: null,
        editInputRef: null,
        list: [],
        columnId: null,
        tabClickIndex: null, // 点击的行
        form: {
          config_key: "fx_level_config",
          config_value: '',
        },
        height: $tableHeight(),
      })

      const fetchData = async () => {
        const {data : configBase} = await getConfigBase({config_key: "fx_level_config"})
        const data = Object.assign({}, configBase)

        const config_obj = {}

        try {
          if (isJson(data.config_value)) {
            const level_list = JSON.parse(data.config_value)
            console.info(level_list)

            for (let i = 0; i < level_list.length; i++) {
              config_obj[level_list[i].user_level_id] = level_list[i]
            }
          } else {
            //初始化数据
          }
        } catch (e) {
          //数据从未初始化过
        }

        //需要读取平台等级，平台等级会被更改，根据平台等级修正数。
        //形成最终 state.list
        state.list = []
        const {
          data: {items},
        } = await getLevelList({})
        const level_itmes = items

        for (let i = 0; i < level_itmes.length; i++) {
          if (typeof config_obj[level_itmes[i].user_level_id] !== 'undefined') {
            state.list.push(config_obj[level_itmes[i].user_level_id])
          } else {
            state.list.push(level_itmes[i])
          }
        }

        await inputBlur()
      }

      const inputBlur = async () => {
          state.tabClickIndex = null
          state.columnId = null
          // 保存数据
          state.form.config_value = JSON.stringify(state.list)
      }

      const tabClick = (row, column) => {
        state.tabClickIndex = row.user_level_id
        state.columnId = column.id
        // inout 获取焦点
        nextTick(() => {
          if (!state.editInputRef) return
          state.editInputRef.focus()
        })
      }

      const handleEdit = () => {
        state['formRef'].validate(async (valid) => {
          if (valid) {
            const { msg, status } = await doEdit(state.form)
            if (200 == status) {
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }
          }
        })
      }


      onMounted(() => {
        fetchData()
      })

      return {
        t,
        Tools,
        tabClick,
        inputBlur,
        handleEdit,
        isJson,
        ...toRefs(state),
      }
    },
  })
</script>

<style lang="scss" scoped>
  .box-card {
    width: 100%;
  }

</style>
