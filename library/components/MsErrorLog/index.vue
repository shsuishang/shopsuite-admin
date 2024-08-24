<script lang="ts" setup>
  import { useErrorLogStore } from '@/store/modules/errorLog'

  const errorLogStore = useErrorLogStore()
  const { errorLogs } = storeToRefs(errorLogStore)
  const { clearErrorLog } = errorLogStore

  const state = reactive({
    dialogVisible: false,
  })
  const searchList = [
    {
      title: '百度搜索',
      url: 'https://www.baidu.com/baidu?wd=',
      icon: 'baidu-line',
    },
    {
      title: '谷歌搜索',
      url: 'https://www.google.com/search?q=',
      icon: 'google-line',
    },
  ]

  const clearAll = () => {
    state.dialogVisible = false
    clearErrorLog()
  }
</script>

<template>
  <div v-if="errorLogs.length > 0">
    <el-badge
      type="danger"
      :value="errorLogs.length"
      @click="state.dialogVisible = true"
    >
      <ms-icon icon="bug-line" />
    </el-badge>

    <el-dialog
      v-model="state.dialogVisible"
      append-to-body
      title="mall-suite异常捕获(温馨提示：错误必须解决)"
      width="70%"
    >
      <el-table border :data="errorLogs">
        <el-table-column label="报错路由">
          <template #default="{ row }">
            <a :href="row.url" target="_blank">
              <el-tag type="success">{{ row.url }}</el-tag>
            </a>
          </template>
        </el-table-column>
        <el-table-column label="错误信息">
          <template #default="{ row }">
            <el-tag type="danger">{{ row.err.message }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="错误详情" width="120">
          <template #default="{ row }">
            <el-popover placement="top-start" trigger="hover">
              {{ row.err.stack }}
              <template #reference>
                <el-button>查看</el-button>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="380">
          <template #default="{ row }">
            <a
              v-for="(item, index) in searchList"
              :key="index"
              :href="item.url + row.err.message"
              target="_blank"
            >
              <el-button>
                <ms-icon :icon="item.icon" />
                {{ item.title }}
              </el-button>
            </a>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="state.dialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="clearAll">暂不显示</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
  :deep(.el-badge) {
    .el-button {
      display: flex;
      align-items: center;
      justify-items: center;
      height: 28px;
    }
  }
</style>
