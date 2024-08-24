<template>
  <div class="material-base-container">
    <ms-search-box>
      <ms-search-box-left-panel :span="8">
        <el-button v-permissions="{ permission: ['/manage/sys/material/add'] }" :disabled="queryForm.gallery_id==0" :icon="Plus" type="primary" @click="handleEdit">
          {{ t('添加') }}
        </el-button>
        <el-button v-permissions="{ permission: ['/manage/sys/material/removeBatch'] }" :icon="Delete" type="danger" @click="handleDelete">
          {{ t('批量删除') }}
        </el-button>
      </ms-search-box-left-panel>
      <ms-search-box-right-panel v-permissions="{ permission: ['/manage/sys/material/list'] }" :span="16">
        <el-form :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.material_name"
              clearable
              :placeholder="t('请输入素材标题')"
            />
          </el-form-item>
          <el-form-item>

            <el-button
              :type="queryForm.material_type === 'image' ? 'primary' : ''"
              @click="queryGalleryData('image')"
            >
              {{ t('图片') }}
            </el-button>
            <el-button
              :type="queryForm.material_type === 'video' ? 'primary' : ''"
              @click="queryGalleryData('video')"
            >
              {{ t('视频') }}
            </el-button>
            <el-button
              v-if="false"
              :type="queryForm.material_type === 'audio' ? 'primary' : ''"
              @click="queryGalleryData('audio')"
            >
              {{ t('音频') }}
            </el-button>
            <el-button
              v-if="false"
              :type="queryForm.material_type === 'document' ? 'primary' : ''"
              @click="queryGalleryData('document')"
            >
              {{ t('文档') }}
            </el-button>

            <el-button :icon="Search" :type="queryForm.material_type === '' ? 'primary' : ''" @click="queryGalleryData('')">
              {{ t('查询') }}
            </el-button>
          </el-form-item>
        </el-form>
      </ms-search-box-right-panel>
    </ms-search-box>

    <el-table
      ref="materialRef"
      v-loading="listLoading"
      border
      :data="items"
      :height="height"
      @row-click="handleClickRow"
      @select="onTableSelect"
      @selection-change="setSelectRows"
    >
      <el-table-column align="center" show-overflow-tooltip type="selection"/>
      <el-table-column
        align="center"
        fixed="left"
        :label="t('素材编号')"
        prop="material_id"
        show-overflow-tooltip
        width="90"
      />
      <el-table-column
        align="center"
        fixed="left"
        :label="t('素材标题')"
        prop="material_name"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="false"
        align="center"
        :label="t('店铺编号')"
        prop="store_id"
        show-overflow-tooltip
        width="90"
      />
      <el-table-column
        align="center"
        :label="t('文件预览')"
        prop="topic_id"
        show-overflow-tooltip
        width="90"
      >
        <template #default="{ row }">
          <el-image
            v-if="row.material_url && row.material_type === 'image'"
            :preview-src-list="[row.material_url]"
            preview-teleported
            :src="row.material_url"
            style="width: 35px; height: 35px"
          />
          <ms-icon
            v-else
            icon="video-fill"
            style="font-size: xx-large"
            @click="showPlayer(row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="t('素材类型')"
        prop="material_type"
        show-overflow-tooltip
        width="90"
      />
      <el-table-column
        align="center"
        :label="t('素材描述')"
        prop="material_desc"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        align="center"
        :formatter="formatDateTime"
        :label="t('素材日期')"
        prop="material_time"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column align="center" fixed="right" :label="t('操作')" width="180">
        <template #default="{ row }">
          <el-button v-permissions="{ permission: ['/manage/sys/material/edit'] }" text @click="handleEdit(row)">{{ t('编辑') }}</el-button>
          <el-button v-permissions="{ permission: ['/manage/sys/material/remove'] }" text @click="handleDelete(row)">{{ t('删除') }}</el-button>
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
    <upload-base ref="upRef" @fetch-data="fetchData" />
    <player ref="playerRef" />
  </div>
</template>

<script>
import { translate as t } from '@/i18n'
import {formatDateTime} from "@/utils/format";
import {doRemove, doRemoveBatch, getList as getList} from '@/api/sys/material'
import Edit from './MaterialBaseEdit'
import Player from './Player'
import UploadBase from '@/plugins/MsUpload'
import {Delete, Plus, Search} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'MaterialBase',
  components: {Edit, UploadBase, Player},
  props:{
    url: {
      type: Array,
      default() {
        return []
      },
    },
  },
  emits: ['get-files'],
  setup(props, {emit}) {
    const $confirm = inject('$confirm')
    const $message = inject('$message')
    const $tableHeight = inject('$tableHeight')

    const state = reactive({
      editRef: null,
      upRef: null,
      materialRef: null,
      playerRef: null,
      height: $tableHeight() - 26,
      items: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: [],
      checkedPageList: [],
      queryForm: {
        page: 1,
        size: 10,
        material_name: '',
        gallery_id: 0,
        material_type: '',
      },
    })

    const result = getCurrentInstance();

    const handleClickRow = () => {
    }

    const onTableSelect = (rows, row) => {
      const selected = rows.length && rows.indexOf(row) !== -1
      const targetRow = JSON.parse(JSON.stringify(row))

      // true就是选中，0或者false是取消选中
      if (selected)
      {
        //存在
        const index = result.data.checkedAllList.indexOf(targetRow.material_url)
        if (index == -1) {
          if(!result.data.checkedAllList) result.data.checkedAllList = [];
          result.data.checkedAllList.push(targetRow.material_url)
        }
      }
      else
      {
        //不存在，取消了
        const index = result.data.checkedAllList.indexOf(targetRow.material_url)
        if (index > -1) {
          result.data.checkedAllList.splice(index, 1)
        }
      }

      emit('get-files', result.data.checkedAllList)
    }

    const setSelectRows = (val) => {
      state.selectRows = val
      //const targetList = JSON.parse(JSON.stringify(val))
      //emit('get-files', targetList.map((item) => item.material_url))
    }
    const handleEdit = (row) => {
      if (row && row.material_id) {
        state.editRef.showEdit(row)
      } else {
        state.upRef.showEdit(state.queryForm.gallery_id)
      }
    }
    const handleDelete = (row) => {
      if (row.material_id) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemove({material_id: row.material_id})

          if (200 == status) {
            //清掉选中
            result.data.checkedAllList = []
            emit('get-files', result.data.checkedAllList)

            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await fetchData()
        })
      } else {
        if (state.selectRows.length > 0) {
          const material_id = state.selectRows.map((item) => item.material_id).join()
          $confirm(t('你确定要删除选中项吗'), null, async () => {
            const {msg, status} = await doRemoveBatch({material_id})
            if (200 == status) {
              //清掉选中
              result.data.checkedAllList = []
              emit('get-files', result.data.checkedAllList)

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
    const fetchData = async (gallery_id) => {
      if (typeof gallery_id != "undefined") {
        state.queryForm.gallery_id = gallery_id
      }

      state.listLoading = true
      const {
        data: {items, records},
      } = await getList(state.queryForm)

      state.items = items
      state.total = records
      state.listLoading = false


      nextTick(() => {
        state.items.forEach((row) => {
          if (props.url.indexOf(row.material_url) >= 0)
          {
            state.materialRef.toggleRowSelection(row, true)
          }
        })
      })

    }

    const queryGalleryData = async (gallery_type) => {
      state.queryForm.material_type = gallery_type

      queryData()
    }

    const showPlayer = (row) => {
      state.playerRef.showEdit(row)
    }

    onMounted(() => {
      //fetchData()
    })

    return {
      t,
      ...toRefs(state),
      handleClickRow,
      onTableSelect,
      setSelectRows,
      handleEdit,
      handleDelete,
      handleState,
      handleSizeChange,
      handleCurrentChange,
      queryData,
      fetchData,
      formatDateTime,
      queryGalleryData,
      Delete,
      Plus,
      Search,
      showPlayer,
    }
  },
  data: function () {
    return {
      checkedAllList: [],
    };
  },
  watch: {
    url: {
      immediate: true,
      handler: function () {
        this.checkedAllList = JSON.parse(JSON.stringify(this.url))
        this.items.forEach((row) => {
          if (this.url.indexOf(row.material_url) >= 0)
          {
            this.materialRef.toggleRowSelection(row, true)
          }
          else
          {
            this.materialRef.toggleRowSelection(row, false)
          }
        })
      },
    },
  },
})
</script>
