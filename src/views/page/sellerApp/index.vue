<template>
  <div class="page-app-container">
    <el-row>
      <el-card class="box-card">
        <div class="clearfix">
          <span>{{ t('当前使用的模板') }}</span>
        </div>
        <div>
          <div style="width: 100%">
            <div class="usertemplate">
              <img
                :src="usePage.tpl_image"
                style="
                  left: 30px;
                  height: 296px;
                  width: 175px;
                  object-fit: fill;
                "
              />
            </div>
            <div class="usertemplateInfo">
              <span class="fontCls" style="margin-bottom: 35px; display: block">
                {{ t('模板名称') }}：{{ usePage.app_name }}
              </span>
              <el-button type="primary" @click="showEditApp(usePage)">
                {{ t('编辑模版') }}
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
    </el-row>
    <el-row>
      <el-card class="box-card">
        <div class="clearfix">
          <span>{{ t('可选用的模板') }}</span>
        </div>
        <div>
          <ul class="ulCls" style="position: relative">
            <li v-for="(page, i) in list" :key="i" class="liCls">
              <div align="center" class="div_img_cls">
                <img
                  class="imgCls"
                  :src="page.tpl_image"
                  style="object-fit: fill"
                />
                <p class="fontCls">{{ page.app_name }}</p>
              </div>
              <div class="lightBtn">
                <div class="enableExit">
                  <el-button
                    v-if="page.tpl_id !== 107"
                    type="primary"
                    @click="setThemes(page.tpl_id, page.tpl_label)"
                  >
                    {{ t('启用') }}
                  </el-button>
                  <el-button type="primary" @click="showEditApp(page)">
                    {{ t('编辑') }}
                  </el-button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import {translate as t} from '@/i18n'
import { getList, setThemes as saveThemes } from '@/api/page/app'

export default defineComponent({
  name: 'PageApp',
  emits: [],
  setup() {
    const $confirm = inject('$confirm')
    const $message = inject('$message')

    const state = reactive({
      usePage: {},
      list: [],
    })

    const getAppPages = async () => {
      const { data } = await getList()
      state.list = data.items
      state.usePage = data.current_tpl
    }

    const showEditApp = (page) => {
      if (page.tpl_id === 107) {
        state.$router.push({
          path: '/appTemplate',
          query: {
            app_id: page.app_id,
            tpl_id: page.tpl_id,
            app_type: page.app_type,
          }, // 传递参数
        })
      } else {
        // 页面跳转
        state.$router.push({
          path: '/setupshop',
        })
      }
    }

    const getUsePage = (items) => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].app_is_use === 1) {
          state.usePage = items[i]
          break
        }
      }
    }

    const setThemes = (tpl_id, tpl_label) => {
      $confirm(t('确定启用此模板风格？'), null, async () => {
        const { msg, status } = await saveThemes({
          tpl_id: tpl_id,
          store_template: tpl_label,
        })
        if (200 == status) {
          $message(msg, 'success')
        } else {
          $message(msg, 'error')
        }
        getAppPages()
      })
    }

    return {
      t,
      ...toRefs(state),
      close,
      getAppPages,
      showEditApp,
      getUsePage,
      setThemes
    }
  },
})
</script>

<style>
  .clearfix {
    font-size: 18px;
  }

  .usertemplate {
    float: left;
    display: inline-block;
    margin-left: 30px;
    padding: 10px;
    background: #fff;
    width: 195px;
    height: 316px;
  }

  .usertemplateInfo {
    margin-left: 20px;
    float: left;
    display: inline-block;
    width: 195px;
    height: 316px;
  }

  .ulCls {
    list-style: none;
  }

  .ulCls li {
    position: relative;
    float: left;
    width: 195px;
    margin: 0 20px 30px;
    background-color: #fafafa;
  }

  .liCls {
    float: left;
    width: 195px;
  }

  div_img_cls {
    height: 328px;
    border: 1px solid #ccc;
  }

  .imgCls {
    width: 165px;
    height: 328px;
  }

  .fontCls {
    color: #979898;
    font-weight: bold;
  }

  .lightBtn {
    position: absolute;
    opacity: 0;
    top: 0;
    width: 100%;
    height: 328px;
  }

  .lightBtn:hover {
    opacity: 1;
    background-color: rgba(151, 152, 152, 0.5);
    -webkit-transition: all 0.5s;
    transition: all 0.5s;
  }

  .lightBtn:hover .enableExit {
    -webkit-transition: all 0.5s;
    transition: all 0.5s;
    -webkit-transform: translateY(150%);
    transform: translateY(150%);
  }

  .enableExit {
    position: relative;
    top: 30%;
    width: 100%;
    margin-top: -15px;
    text-align: center;
  }
</style>
