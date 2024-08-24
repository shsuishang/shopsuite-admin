<!--
    /**
     * 树形下拉选择组件，下拉框展示树形结构，提供选择某节点功能，方便其他模块调用
     * @author ljn
     * @date 2019-04-02
     * 调用示例：
     * <tree-select :height="400" // 下拉框中树形高度
     *              :width="200" // 下拉框中树形宽度
     *              size="small"  // 输入框的尺寸: medium/small/mini
     *              :data="data" // 树结构的数据
     *              :defaultProps="defaultProps" // 树结构的props
     *              multiple   // 多选
     *              clearable   // 可清空选择
     *              collapseTags   // 多选时将选中值按文字的形式展示
     *              checkStrictly // 多选时，严格遵循父子不互相关联
     *              :nodeKey="nodeKey"   // 绑定nodeKey，默认绑定'id'
     *              :checkedKeys="defaultCheckedKeys"  // 传递默认选中的节点key组成的数组
     *              @popoverHide="popoverHide"> // 事件有两个参数：第一个是所有选中的节点ID，第二个是所有选中的节点数据
     *              </tree-select>
     */
-->
<template>
  <div>
    <div
      v-show="isShowSelect"
      class="mask"
      @click="isShowSelect = !isShowSelect"
    ></div>
    <el-popover
      v-model="isShowSelect"
      placement="bottom-start"
      trigger="manual"
      :width="width"
      @hide="popoverHide"
    >
      <el-tree
        ref="treeRef"
        :check-on-click-node="multiple"
        :check-strictly="checkStrictly"
        class="common-tree"
        :data="data"
        default-expand-all
        :expand-on-click-node="false"
        :highlight-current="true"
        :node-key="nodeKey"
        :props="defaultProps"
        :show-checkbox="multiple"
        :style="style"
        @check-change="handleCheckChange"
        @node-click="handleNodeClick"
      />
      <el-select
        ref="select"
        v-model="selectedData"
        class="tree-select"
        :clearable="clearable"
        :collapse-tags="collapseTags"
        :multiple="multiple"
        :size="size"
        @change="changeSelectedNodes"
        @clear="removeSelectedNode"
        @keydown.enter="isShowSelect = !isShowSelect"
        @remove-tag="removeSelectedNodes"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-popover>
  </div>
</template>

<script>
import {translate as t} from '@/i18n'

export default defineComponent({
  name: 'TreeSelect',
  directives: {
    focus: {
      // 指令的定义
      inserted: function (el) {
        el.focus()
      },
    },
  },
  props: {
    // 树结构数据
    data: {
      type: Array,
      default() {
        return []
      },
    },
    defaultProps: {
      type: Object,
      default() {
        return {}
      },
    },
    // 配置是否可多选
    multiple: {
      type: Boolean,
      default() {
        return false
      },
    },
    // 配置是否可清空选择
    clearable: {
      type: Boolean,
      default() {
        return false
      },
    },
    // 配置多选时是否将选中值按文字的形式展示
    collapseTags: {
      type: Boolean,
      default() {
        return false
      },
    },
    nodeKey: {
      type: String,
      default() {
        return 'id'
      },
    },
    // 显示复选框情况下，是否严格遵循父子不互相关联
    checkStrictly: {
      type: Boolean,
      default() {
        return false
      },
    },
    // 默认选中的节点key数组
    checkedKeys: {
      type: Array,
      default() {
        return []
      },
    },
    size: {
      type: String,
      default() {
        return 'small'
      },
    },
    width: {
      type: Number,
      default() {
        return 250
      },
    },
    height: {
      type: Number,
      default() {
        return 300
      },
    },
  },
  setup() {
    const $message = inject('$message')

    const state = reactive({
      treeRef: null,
      isShowSelect: false, // 是否显示树状选择器
      options: [],
      selectedData: [], // 选中的节点
      style: 'height:' + 300 + 'px;',
      // selectStyle: 'width:' + (state.width + 24) + 'px;',
      checkedIds: [],
      checkedData: [],
    })

    /*watch: {
      isShowSelect(val) {
        // 隐藏select自带的下拉框
        state.$refs.select.blur()
      },
      checkedKeys(val) {
        if (!val) return
        // eslint-disable-next-line vue/no-mutating-props
        state.checkedKeys = val
        state.initCheckedData()
      },
    },*/

    // 单选时点击tree节点，设置select选项
    const setSelectOption = (node) => {
      const tmpMap = {}
      tmpMap.value = node.key
      tmpMap.label = node.label
      state.options = []
      state.options.push(tmpMap)
      state.selectedData = node.key
    }

    // 单选，选中传进来的节点
    const checkSelectedNode = (checkedKeys) => {
      const item = checkedKeys[0]
      state.treeRef.setCurrentKey(item)
      const node = state.$refs.treeRef.getNode(item)
      setSelectOption(node)
    }

    // 多选，勾选上传进来的节点
    const checkSelectedNodes = (checkedKeys) => {
      state.$refs.treeRef.setCheckedKeys(checkedKeys)
    }

    // 单选，清空选中
    const clearSelectedNode = () => {
      state.selectedData = ''
      state.treeRef.setCurrentKey(null)
    }

    // 多选，清空所有勾选
    const clearSelectedNodes = () => {
      const checkedKeys = state.$refs.treeRef.getCheckedKeys() // 所有被选中的节点的 key 所组成的数组数据
      for (let i = 0; i < checkedKeys.length; i++) {
        state.$refs.treeRef.setChecked(checkedKeys[i], false)
      }
    }

    const initCheckedData = () => {
      if (state.multiple) {
        // 多选
        if (state.checkedKeys && state.checkedKeys.length > 0) {
          checkSelectedNodes(state.checkedKeys)
        } else {
          clearSelectedNodes()
        }
      } else {
        // 单选
        if (state.checkedKeys && state.checkedKeys.length > 0) {
          checkSelectedNode(state.checkedKeys)
        } else {
          clearSelectedNode()
        }
      }
    }

    const popoverHide = () => {
      if (state.multiple) {
        state.checkedIds = state.$refs.treeRef.getCheckedKeys() // 所有被选中的节点的 key 所组成的数组数据
        state.checkedData = state.$refs.treeRef.getCheckedNodes() // 所有被选中的节点所组成的数组数据
      } else {
        state.checkedIds = state.$refs.treeRef.getCurrentKey()
        state.checkedData = state.$refs.treeRef.getCurrentNode()
      }
      $emit('popoverHide', state.checkedIds, state.checkedData)
    }

    // 单选，节点被点击时的回调,返回被点击的节点数据
    const handleNodeClick = (data, node) => {
      if (!state.multiple) {
        if (node.childNodes.length > 0) {
          $message(
            '只能选择最后一级分类！',
            'error',
            false,
            'ms-hey-message-success'
          )
          return
        }
        setSelectOption(node)
        state.isShowSelect = !state.isShowSelect
        $emit('change', state.selectedData)
      }
    }

    // 多选，节点勾选状态发生变化时的回调
    const handleCheckChange = () => {
      const checkedKeys = state.$refs.treeRef.getCheckedKeys() // 所有被选中的节点的 key 所组成的数组数据
      state.options = checkedKeys.map((item) => {
        const node = state.$refs.treeRef.getNode(item) // 所有被选中的节点对应的node
        const tmpMap = {}
        tmpMap.value = node.key
        tmpMap.label = node.label
        return tmpMap
      })
      state.selectedData = state.options.map((item) => {
        return item.value
      })
      $emit('change', state.selectedData)
    }

    // 多选,删除任一select选项的回调
    const removeSelectedNodes = (val) => {
      state.$refs.treeRef.setChecked(val, false)
      const node = state.$refs.treeRef.getNode(val)
      if (!state.checkStrictly && node.childNodes.length > 0) {
        state.treeToList(node).map((item) => {
          if (item.childNodes.length <= 0) {
            state.$refs.treeRef.setChecked(item, false)
          }
        })
        handleCheckChange()
      }
      $emit('change', state.selectedData)
    }

    const treeToList = (tree) => {
      let queen = []
      const out = []
      queen = queen.concat(tree)
      while (queen.length) {
        const first = queen.shift()
        if (first.childNodes) {
          queen = queen.concat(first.childNodes)
        }
        out.push(first)
      }
      return out
    }

    // 单选,清空select输入框的回调
    const removeSelectedNode = () => {
      clearSelectedNode()
      $emit('change', state.selectedData)
    }

    // 选中的select选项改变的回调
    const changeSelectedNodes = (selectedData) => {
      // 多选,清空select输入框时，清除树勾选
      if (state.multiple && selectedData.length <= 0) {
        clearSelectedNodes()
      }
      $emit('change', state.selectedData)
    }

    onMounted(() => {
      initCheckedData()
    })

    return {
      t,
      ...toRefs(state),
      setSelectOption,
      checkSelectedNode,
      checkSelectedNodes,
      clearSelectedNode,
      clearSelectedNodes,
      initCheckedData,
      popoverHide,
      handleNodeClick,
      handleCheckChange,
      removeSelectedNodes,
      treeToList,
      removeSelectedNode,
      changeSelectedNodes
    }
  },
})
</script>


<style scoped>
  .mask {
    /*width: 100%;*/
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: 11;
  }
  .common-tree {
    overflow: auto;
  }
  .tree-select {
    z-index: 111;
  }
</style>
