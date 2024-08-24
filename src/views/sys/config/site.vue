<template>
  <div class="ele-body">
    <el-card v-loading="listLoading" body-style="padding-top: 5px;" shadow="never">
      <el-tabs v-model="active" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item,index) in configList" :key="index" :label="item.config_type_name" :name="'tab_'+index"
          style="margin: 20px auto;">
          <el-form v-for="(subItem,val) in item.items" :key="val" ref="formRef" label-width="150px" :model="form">
            <!-- 只读文本框 -->
            <el-form-item v-if="subItem.config_datatype=='readonly'" :label="subItem.config_title+''" :prop="subItem.config_key">
              <el-input v-model="form[subItem.config_key]" disabled :placeholder="'请输入'+subItem.config_title"/>
              <p v-if="subItem.config_note" class="help-block" v-html="subItem.config_note"></p>
            </el-form-item>
            <!-- 单行文本框 -->
            <el-form-item v-if="subItem.config_datatype=='text'" :label="subItem.config_title+''" :prop="subItem.config_key">
              <el-input v-model="form[subItem.config_key]" clearable :placeholder="'请输入'+subItem.config_title"/>
              <p v-if="subItem.config_note" class="help-block" v-html="subItem.config_note"></p>
            </el-form-item>
            <!-- 多行文本框 -->
            <el-form-item v-if="subItem.config_datatype=='textarea'" :label="subItem.config_title+''" :prop="subItem.config_key">
              <el-input v-model="form[subItem.config_key]" :placeholder="'请输入'+subItem.config_title" :rows="3" type="textarea"/>
              <p v-if="subItem.config_note" class="help-block" v-html="subItem.config_note"></p>
            </el-form-item>
            <!-- 单图上传 -->
            <el-form-item v-if="subItem.config_datatype=='image'" :label="subItem.config_title+''">
              <div>
                <img-upload
                  v-model="form[subItem.config_key]"
                  file-ext="gif|jpg|jpeg|png|GIF|JPG|PNG"
                  :height="getConfigHeight(subItem)"
                  :limit="1"
                  :width="getConfigWidth(subItem)"
                />
                <p v-if="subItem.config_note" class="help-block" v-html="subItem.config_note"></p>
              </div>
            </el-form-item>
            <!-- 多图上传 -->
            <el-form-item v-if="subItem.config_datatype=='images'" :label="subItem.config_title+''">
              <div>
                <pic-upload
                  ref="picUpRef"
                  v-model="form[subItem.config_key]"
                  :height="getConfigHeight(subItem)"
                  :width="getConfigWidth(subItem)"
                  @get-files="testUp"
                />
                <p v-if="subItem.config_note" class="help-block" v-html="subItem.config_note"></p>
              </div>
            </el-form-item>
            <!-- 单文件上传 -->
            <el-form-item v-if="subItem.config_datatype=='file'" :label="subItem.config_title+''">
              <div>
                <file-upload
                  v-model="form[subItem.config_key]"
                  file-ext="rar|zip|tar|gz|7z|bz2|cab|iso|doc|docx|xls|xlsx|ppt|pptx|pdf|txt|md|xml|csv|pem"
                  :file-name="subItem.config_key"
                  :limit="1"
                />
                <p v-if="subItem.config_note" class="help-block" v-html="subItem.config_note"></p>
              </div>
            </el-form-item>
            <!-- 多文件上传 -->
            <el-form-item v-if="subItem.config_datatype=='files'" :label="subItem.config_title+''">
              <div>
                <pic-upload
                  ref="picUpRef"
                  v-model="form[subItem.config_key]"
                  @get-files="testUp"
                />
                <p v-if="subItem.config_note" class="help-block" v-html="subItem.config_note"></p>
              </div>
            </el-form-item>
            <!-- 日期选择 -->
            <el-form-item v-if="subItem.config_datatype=='date'" :label="subItem.config_title+''" :prop="subItem.config_key">
              <el-date-picker
                v-model="form[subItem.config_key]"
                format="yyyy-MM-dd"
                :placeholder="'请选择'+subItem.config_title"
                size="small"
                type="date"
                value-format="yyyy-MM-dd"/>
              <p v-if="subItem.config_note" class="help-block" v-html="subItem.config_note"></p>
            </el-form-item>
            <!-- 日期时间选择 -->
            <el-form-item v-if="subItem.config_datatype=='datetime'" :label="subItem.config_title+''" :prop="subItem.config_key">
              <el-date-picker
                v-model="form[subItem.config_key]"
                format="yyyy-MM-dd HH:mm:ss"
                :placeholder="'请选择'+subItem.config_title"
                size="small"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"/>
              <p v-if="subItem.config_note" class="help-block" v-html="subItem.config_note"></p>
            </el-form-item>
            <!-- 单选按钮 -->
            <el-form-item v-if="subItem.config_datatype=='radio'" :label="subItem.config_title+''">
              <el-radio-group v-model="form[subItem.config_key]">
                <el-radio v-for="(iv,key) in subItem.optionsList" :key="iv" :label="key">{{ iv }}</el-radio>
              </el-radio-group>
              <p v-if="subItem.config_note" class="help-block" v-html="subItem.config_note"></p>
            </el-form-item>
            <!-- 数字输入框 -->
            <el-form-item v-if="subItem.config_datatype=='number'" :label="subItem.config_title+''" :prop="subItem.config_key">
              <div>
                <el-input-number
                  v-model="form[subItem.config_key]" class="ele-fluid ele-text-left" controls-position="right"
                  :min="0" :placeholder="'请输入'+subItem.config_title" :style="{ width: '160px' }"/>
                <p v-if="subItem.config_note" class="help-block" v-html="subItem.config_note"></p>
              </div>
            </el-form-item>
            <!-- 密码输入框 -->
            <el-form-item v-if="subItem.config_datatype=='password'" :label="subItem.config_title+''" :prop="subItem.config_key">
              <el-input v-model="form[subItem.config_key]" :placeholder="'请输入'+subItem.config_title" show-password/>
              <p v-if="subItem.config_note" class="help-block" v-html="subItem.config_note"></p>
            </el-form-item>
            <!-- 复选框 -->
            <el-form-item v-if="subItem.config_datatype=='checkbox'" :label="subItem.config_title+''" :prop="subItem.config_key">
              <el-checkbox-group v-model="form[subItem.config_key]">
                <el-checkbox v-for="(iv,key) in subItem.optionsList" :key="iv" :label="key">{{ iv }}</el-checkbox>
              </el-checkbox-group>
              <p v-if="subItem.config_note" class="help-block" v-html="subItem.config_note"></p>
            </el-form-item>
            <!-- 下拉单选框 -->
            <el-form-item v-if="subItem.config_datatype=='select'" :label="subItem.config_title+''" :prop="subItem.config_key">
              <el-select v-model="form[subItem.config_key]" class="ele-block" clearable :placeholder="'请选择'+subItem.config_title">
                <el-option v-for="(iv,key) in subItem.optionsList" :key="key" :label="iv" :value="key"/>
              </el-select>
              <p v-if="subItem.config_note" class="help-block" v-html="subItem.config_note"></p>
            </el-form-item>
            <!-- 富文本编辑器 -->
            <el-form-item v-if="subItem.config_datatype=='ueditor'" :label="subItem.config_title+''">
              <ms-rich-editor
                ref="msRichEditorRef"
                v-model="form[subItem.config_key]"
                default-height="300px"
              />
              <p v-if="subItem.config_note" class="help-block" v-html="subItem.config_note"></p>
            </el-form-item>
            <!-- 图标 -->
            <el-form-item v-if="subItem.config_datatype=='icon'" :label="subItem.config_title+''">
              <ele-icon-picker v-model="form[subItem.config_key]" :placeholder="'请选择'+subItem.config_title"/>
              <p v-if="subItem.config_note" class="help-block" v-html="subItem.config_note"></p>
            </el-form-item>
            <!-- 地区 -->
            <el-form-item v-if="subItem.config_datatype=='area'" :label="subItem.config_title+''">
              <div>
                <el-cascader
                  v-model="form[subItem.config_key]"
                  clearable
                  filterable
                  :options="areaOptions"
                  :placeholder="'请选择'+subItem.config_title"
                  :props="{ label: 'district_name', value: 'district_id' }"
                />
                <p v-if="subItem.config_note" class="help-block" v-html="subItem.config_note"></p>
              </div>
            </el-form-item>
            <!-- 地区 -->
            <el-form-item v-if="subItem.config_datatype=='array'" :label="subItem.config_title+''">
              <el-tag
                v-for="tag in form[subItem.config_key]"
                :key="tag"
                closable
                :disable-transitions="false"
                size="large"
                @close="handleClose(form[subItem.config_key], tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-if="subItem.inputVisible || false"
                ref="inputRef"
                v-model="subItem.inputValue"
                class="input-new-tag"

                @blur="handleInputConfirm(form[subItem.config_key], subItem)"
                @keyup.enter="handleInputConfirm(form[subItem.config_key], subItem)"
              />
              <el-button
                v-else
                class="button-new-tag"
                @click="showInput(subItem, index)"
              >
                + {{$t("添加")}}
              </el-button>
            </el-form-item>
            <el-form-item v-if="subItem.config_key == 'sms_type' && form[subItem.config_key] == 0">
              <el-button type="info" @click="querySmsData">
                {{ t('查看记录') }}
              </el-button>
            </el-form-item>
          </el-form>
          <div style="margin-left: 150px;">
            <el-button :loading="loading" type="primary" @click="save">保存更改</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>

    </el-card>
    <record ref="recordRef"/>
  </div>
</template>


<script>
  import {translate as t} from '@/i18n'
  import {doEditSite, getIndex} from '@/api/sys/config'
  import PicUpload from '@/plugins/MsUpload/PicUpload'
  import ImgUpload from "@/plugins/MsUpload/ImgUpload";
  import FileUpload from "@/plugins/MsUpload/FileUpload";
  import MsRichEditor from "@/plugins/MsRichEditor";
  import {getArea} from '@/api/area'
  import Record from "./components/SmsRecord";

  export default defineComponent({
    name: 'Site',
    components: {ImgUpload, PicUpload, MsRichEditor, FileUpload, Record},
    setup() {
      const $tableHeight = inject('$tableHeight')
      const $message = inject('$message')
      const inputRef = ref("");
      const router = useRouter();

      const state = reactive({
        picUpRef: null,
        recordRef: null,
        height: $tableHeight(),
        active: 'tab_0',  // tab页选中
        index: '0',  // tab页选中
        listLoading: true,  // 保存按钮loading
        loading: false,  // 保存按钮loading
        form: {},  // 表单数据
        configList: [],
        areaOptions:[],
      })

      const getTagModuleByPath = (path) => {
        const pattern = /\/site\/(\d+)/;
        const matches = pattern.exec(path);

        if (matches && matches.length > 1) {
          const value = matches[1];

          return value
        } else {
          return  false
        }
      }

      // 获取配置信息
      const getConfigInfo = async () => {
        state.listLoading = true
        const params = {}

        const path = getTagModuleByPath(router.currentRoute.value.path)

        if (path) {
          params['config_type_module'] = path
        }

        const {
          data
        } = await getIndex(params)

        state.configList = data.items

        if (state.configList.length > 0) {
          const items = state.configList[state.index]['items'];
          const itemArr = {};
          if (items) {
            items.forEach(item => {
              if (item.config_datatype === 'area') {
                itemArr[item.config_key] = item.config_value.split(',').map(Number);
              } else if (item.config_datatype === 'array') {
                itemArr[item.config_key] = item.config_value.split(',');
              } else {
                itemArr[item.config_key] = item.config_value;
              }
            })
          }
          state.form = itemArr;

        } else {
          state.form = {};
        }


        state.listLoading = false
      }

      /* 保存更改 */
      const save = async () => {
        state.loading = true;

        const configs = Object.assign({}, state.form)

        for(const key  in configs){
          if (typeof configs[key] == 'object') {
            configs[key] = configs[key].join(",")
          }
        }

        const {msg, status} = await doEditSite({configs:configs})
        if (200 == status) {
          $message(msg, 'success')

          getConfigInfo();
        } else {
          $message(msg, 'error')
        }

        state.loading = false;
      }
      /**
       * Tab点击事件
       * @param tab
       * @param event
       */
      const handleClick = (tab, event) => {
        console.log(tab, event);
        state.index = tab.index
        state.active = 'tab_' + state.index

        const items = state.configList[tab.index]['items'];
        const itemArr = {};
        if (items) {
          items.forEach(item => {
            if (item.config_datatype === 'area') {
              itemArr[item.config_key] = item.config_value.split(',').map(Number);
            } else if (item.config_datatype === 'array') {
              itemArr[item.config_key] = item.config_value.split(',');
            } else {
              itemArr[item.config_key] = item.config_value;
            }
          })
        }
        state.form = itemArr;
      }

      const handleInputConfirm = (dynamicTags, subItem) => {
        subItem.inputVisible = true
        if (subItem.inputValue && !dynamicTags.includes(subItem.inputValue)) {
          dynamicTags.push(subItem.inputValue)
        }
        subItem.inputValue = ''
        subItem.inputVisible = false
      }

      const handleClose = (dynamicTags, tag) => {
        const index = dynamicTags.indexOf(tag);
        if (index !== -1) {
          dynamicTags.splice(index, 1);
        }
        return dynamicTags;
      }

      const showInput = (subItem, index) => {
        console.info(index);

        subItem.inputVisible = true;
        nextTick(()=>{
          inputRef.value[0].focus();
        })
      }

      const testUp = (val) => {
        console.log("+++++++++ onSubmit  ++++++++++");
        console.log(JSON.parse(JSON.stringify(val)));

        //state.configList[0]["items"][3].config_value = JSON.parse(JSON.stringify(val))
      }

      const getConfigWidth = (item) => {
        switch (item.config_key) {
          case "site_pc_logo":
            return 256;
          case "account_login_bg":
            return 152;
          case "plantform_poster_bg":
          case "product_poster_bg":
          case "advertisement_image":
            return 150;
          default:
            return 148;
        }
      }

      const getConfigHeight = (item) => {
        switch (item.config_key) {
          case "site_pc_logo":
            return 64;
          case "account_login_bg":
            return 232;
          case "plantform_poster_bg":
          case "product_poster_bg":
          case "advertisement_image":
            return 267;
          default:
            return 148;
        }
      }

      const getAreaOpt = async () => {
        const {
          data: data,
        } = await getArea()

        state.areaOptions = data
      }

      const querySmsData = () => {
        state.recordRef.showRecord()
      }

      onMounted(() => {
        getAreaOpt()
        getConfigInfo();
      })

      return {
        t,
        ...toRefs(state),
        save,
        handleClick,
        querySmsData,
        handleInputConfirm,
        handleClose,
        showInput,
        testUp,
        getConfigWidth,
        getConfigHeight,
        inputRef
      }
    },
  })
</script>

<style lang="scss" scoped>

:deep(.el-form-item) {

  .el-form-item__label {
    padding-right: 20px!important;
  }

  .el-radio-group {
    width: 100%;
  }

  .el-input-number, .el-cascader, .pic-upload-source {

  }


  .help-block{
    color: #979898;
    display: block;
    margin-top: 5px;
    margin-bottom: 10px;
  }

  .input-new-tag{
    margin-left: 10px;
    width: 200px;
  }

  .button-new-tag{
    margin-left: 10px;
    width: 100px;
  }
}
</style>
