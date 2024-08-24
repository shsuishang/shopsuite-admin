<template>
  <el-dialog
    v-model="dialogFormVisible"
    :fullscreen="true"
    :title="title"
    width="70%"
    @close="close"
  >
    <el-scrollbar v-loading="loading" style="height: 1000px">
      <el-row>
        <div class="tit_font">{{ t('基本信息') }}</div>
        <el-divider/>
        <el-form label-width="80px">
          <el-form-item :label="t('商品分类')" prop="category_id">
            <el-tree-select
              v-model="productForm.category_id"
              :data="categoryList"
              :default-expand-all="isExpandCategory"
              disabled
              highlight-current
              node-key="category_id"
              :placeholder="t('请选择商品分类')"
              :props="{ value: 'category_id', label: 'category_name'}"
              style="width: 100%"
              value-key="category_name"
            />
          </el-form-item>
          <el-form-item :label="t('商品类型')">
            <el-radio-group v-model="productForm.kind_id" :disabled="isUpdate" @change="onChangeKind">
              <el-radio :label="1201">
                {{ t('实体商品') }}
              </el-radio>
              <el-radio :label="1202">
                {{ t('虚拟商品（服务类商品）') }}
              </el-radio>
              <el-radio :label="1203">
                {{ t('电子卡券') }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <div class="tit_font">{{ t('辅助属性') }}</div>
        <el-divider/>
        <el-form label-width="100px">
          <el-form-item v-if="brands && brands.length > 0" :label="t('品牌')">
            <el-radio-group v-model="checkBrand">
              <el-radio
                v-for="brand in brands"
                :key="brand.brand_id"
                :label="brand.brand_id"
              >
                {{ brand.brand_name }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-for="assist in assists"
            :key="assist.assist_id"
            :label="assist.assist_name"
          >
            <el-checkbox-group
              v-if="assist.assist_format === 'checkbox'"
              v-model="assistArr[assist.assist_id]"
            >
              <el-checkbox
                v-for="item in assist.items"
                :key="item.assist_item_id"
                :label="item.assist_item_id"
              >
                {{ item.assist_item_name }}
              </el-checkbox>
            </el-checkbox-group>
            <el-select
              v-if="assist.assist_format === 'select'"
              v-model="assistArr[assist.assist_id]"
              clearable
              :placeholder="'请选择' + assist.assist_name"
              :style="{ width: '50%' }"
            >
              <el-option
                v-for="item in assist.items"
                :key="item.assist_item_id"
                :label="item.assist_item_name"
                :value="item.assist_item_id"
              />
            </el-select>
            <el-radio-group
              v-if="assist.assist_format === 'radio'"
              v-model="assistArr[assist.assist_id]"
            >
              <el-radio
                v-for="item in assist.items"
                :key="item.assist_item_id"
                :label="item.assist_item_id"
              >
                {{ item.assist_item_name }}
              </el-radio>
            </el-radio-group>
            <el-input
              v-if="assist.assist_format === 'text'"
              v-model="assistArr[assist.assist_id]"
              clearable
              :placeholder="'请输入内容' + assist.assist_name"
              :style="{ width: '50%' }"
            />
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <div class="tit_font">{{ t('商品规格') }}</div>
        <el-divider/>
        <el-form label-width="100px" style="width: 100%">
          <el-form-item
            v-for="spec in specs"
            :key="spec.spec_id"
            :label="spec.spec_name"
          >
            <el-checkbox-group v-model="checkSpec[spec.spec_id]" class="spec-btn">
              <el-checkbox
                v-for="item in spec.items"
                :key="item.spec_item_id"
                :disabled="(!configs.product_spec_edit && false) && (newSpecItemIdRow.indexOf(item.spec_item_id)>-1&&checkSpec[spec.spec_id].indexOf(item)>-1 || !(allowCheckSpecRow.indexOf(spec.spec_id)>-1))"
                :label="item"
              >
                {{ item.spec_item_name }}
              </el-checkbox>
              <el-button
                :icon="CirclePlus"
                style="padding-left: 10px;padding-top: 0px"
                type="text"
                @click="showEditSpecItem(spec.spec_id)"
              />
              <el-button
                :icon="Fold"
                style="padding-top: 0px"
                type="text"
                @click="showTable(spec.spec_id)"
              />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item v-if="false">
            <ms-search-box>
              <ms-search-box-left-panel>
                <el-form :inline="true" label-width="100px">
                  <el-row type="flex">
                    <el-col :span="4">
                      <el-form-item>
                        <el-input
                          v-model="batchObj.item_market_price"
                          clearable
                          :placeholder="t('市场价')"
                          @blur="(e) => batchInput(e, 'item_market_price')"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item>
                        <el-input
                          v-model="batchObj.item_unit_price"
                          clearable
                          :placeholder="t('零售价')"
                          @blur="(e) => batchInput(e, 'item_unit_price')"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item>
                        <el-input
                          v-model="batchObj.item_unit_points"
                          clearable
                          :placeholder="t('所需积分')"
                          @blur="(e) => batchInput(e, 'item_unit_points')"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item>
                        <el-input
                          v-model="batchObj.item_quantity"
                          clearable
                          :placeholder="t('库存')"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item :label="t('上下架')">
                        <el-switch
                          v-model="batchObj.item_enable"
                          active-color="#13ce66"
                          :active-value="1001"
                          inactive-color="#ff4949"
                          :inactive-value="1002"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-button size="default" type="primary" @click="batchHandle">
                        {{ t('批量操作') }}
                      </el-button>
                    </el-col>
                  </el-row>
                </el-form>
              </ms-search-box-left-panel>
            </ms-search-box>
          </el-form-item>
          <el-form-item>
            <el-table
              border
              :data="specData"
              :span-method="spanMethod"
              style="width: 100%"
            >
              <el-table-column align="center" type="index" width="50"/>
              <el-table-column
                v-for="item in specHead"
                :key="item.spec_item_id"
                align="center"
                :label="item.label"
                :prop="item.property"
                :property="item.property"
                :width="getItemWidth(item.property)"
              >
                <template v-if="item.property === 'item_market_price' || item.property === 'item_unit_price' || item.property === 'item_unit_points' || item.property === 'item_quantity' || item.property === 'item_weight'" #header="scope" >
                  <div v-if="scope.column.property === 'item_market_price'">
                    <span>{{scope.column.label}}</span>
                    <ms-icon data-key="item_market_price" icon="more-2-line" style="cursor:pointer;" :title="t('批量设置市场价')"  @click="batOper"/>
                  </div>
                  <div v-if="scope.column.property === 'item_unit_price'">
                    <span>{{scope.column.label}}</span>
                    <ms-icon data-key="item_unit_price" icon="more-2-line" style="cursor:pointer;" :title="t('批量设置价格')"  @click="batOper"/>
                  </div>
                  <div v-if="scope.column.property === 'item_unit_points'">
                    <span>{{scope.column.label}}</span>
                    <ms-icon data-key="item_unit_points" icon="more-2-line" style="cursor:pointer;" :title="t('批量设置积分')"  @click="batOper"/>
                  </div>
                  <div v-if="scope.column.property === 'item_quantity'">
                    <span>{{scope.column.label}}</span>
                    <ms-icon data-key="item_quantity" icon="more-2-line" style="cursor:pointer;" :title="t('批量设置库存')"  @click="batOper"/>
                  </div>
                  <div v-if="scope.column.property === 'item_weight'">
                    <span>{{scope.column.label}}</span>
                    <ms-icon data-key="item_weight" icon="more-2-line" style="cursor:pointer;" :title="t('批量设置重量')"  @click="batOper" />
                  </div>
                </template>
                <template #default="scope">
                  <picUpload
                    v-if="scope.column.property === 'main_color_img'"
                    v-model="specData[scope.$index]['main_color_img']"
                    :file-list="[scope.row.main_color_img]"
                    :height="40"
                    :limit="1"
                    :show-file-list="false"
                    :width="40"
                  />
                  <picUpload
                    v-else-if="scope.column.property === 'color_img'"
                    v-model="specData[scope.$index]['color_img']"
                    :file-list="scope.row.color_img"
                    :height="40"
                    :limit="10"
                    :show-file-list="true"
                    :width="40"
                  />
                  <el-switch
                    v-else-if="scope.column.property === 'item_enable'"
                    v-model="scope.row.item_enable"
                    active-color="#13ce66"
                    :active-value="1001"
                    inactive-color="#ff4949"
                    :inactive-value="1002"
                  />
                  <el-switch
                    v-else-if="scope.column.property === 'item_is_default'"
                    v-model="scope.row.item_is_default"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                  />
                  <el-input
                    v-else-if="scope.column.property === 'item_market_price'"
                    v-model="scope.row[scope.column.property]"
                    @blur="(e) => handleInput(e, scope)"
                  />
                  <el-input
                    v-else-if="scope.column.property === 'item_unit_price'"
                    v-model="scope.row[scope.column.property]"
                    @blur="(e) => handleInput(e, scope)"
                  />
                  <el-input
                    v-else-if="scope.column.property === 'item_unit_points'"
                    v-model="scope.row[scope.column.property]"
                    @blur="(e) => handleInput(e, scope)"
                  />
                  <el-input
                    v-else-if="scope.column.property === 'item_quantity'"
                    v-model="scope.row[scope.column.property]"
                    @blur="(e) => handleInput(e, scope)"
                  />
                  <el-input
                    v-else-if="showProperty(scope.column.property)"
                    v-model="scope.row[scope.column.property]"
                  />
                  <span v-else>{{scope.row[scope.column.property]}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <div class="tit_font">{{ t('商品信息') }}</div>
        <el-divider/>
        <el-form
          ref="productFormRef"
          label-width="100px"
          :model="productForm"
          :rules="productRules"
          size="default"
          style="width: 100%"
        >
          <el-row type="flex">
            <el-col :span="12">
              <el-form-item :label="t('商品名称')" prop="product_name">
                <el-input
                  v-model="productForm.product_name"
                  clearable
                  :placeholder="t('请输入商品名称')"
                  :style="{ width: '90%' }"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="t('商品货号')" prop="product_number">
                <el-input
                  v-model="productForm.product_number"
                  clearable
                  :placeholder="t('请输入商品货号')"
                  :style="{ width: '90%' }"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="t('商品卖点')" prop="product_tips">
                <el-input
                  v-model="productForm.product_tips"
                  clearable
                  :placeholder="t('请输入商品卖点')"
                  :style="{ width: '90%' }"
                />
              </el-form-item>
              <el-form-item :label="t('商品标签')" prop="product_tags">
                <el-select
                  v-model="productForm.product_tags"
                  multiple
                  :placeholder="t('请选择商品标签')"
                  :style="{ width: '90%' }"
                >
                  <el-option
                    v-for="item in productTags"
                    :key="item.product_tag_id"
                    :label="item.product_tag_name"
                    :value="item.product_tag_id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="t('视频地址')" prop="product_video">
                <el-input
                  v-model="productForm.product_video"
                  clearable
                  :placeholder="t('可以添加一个视频播放地址，将会在商品主图上展示出来[仅移动端起作用]')"
                  :style="{ width: '90%' }"
                >
                  <template #append>
                    <el-button :icon="Plus" @click="galleryRef.show()" />
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <el-row v-show="productForm.kind_id === 1202">
        <div class="tit_font">{{ t('预约服务属性') }}</div>
        <el-divider/>
        <el-form
          ref="validFormRef"
          label-width="100px"
          :model="validForm"
          size="default"
          style="width: 100%"
        >
          <el-row type="flex">
            <el-col :span="12">
              <el-form-item :label="t('服务类型')" prop="product_valid_type">
                <el-radio-group
                  v-model="validForm.product_valid_type"
                  size="default"
                  :style="{ width: '90%' }"
                >
                  <el-radio
                    v-for="(item, index) in product_valid_typeOptions"
                    :key="index"
                    :disabled="item.disabled"
                    :label="item.value"
                  >
                    {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="t('填写预约日期')" prop="product_service_date_flag">
                <el-radio-group
                  v-model="validForm.product_service_date_flag"
                  size="default"
                  :style="{ width: '90%' }"
                >
                  <el-radio
                    v-for="(item, index) in product_service_date_flagOptions"
                    :key="index"
                    :disabled="item.disabled"
                    :label="item.value"
                  >
                    {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="t('有效期')" prop="product_valid_period">
                <el-radio-group
                  v-model="validForm.product_valid_period"
                  size="default"
                  :style="{ width: '90%' }"
                >
                  <el-radio
                    v-for="(item, index) in product_valid_periodOptions"
                    :key="index"
                    :disabled="item.disabled"
                    :label="item.value"
                  >
                    {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="t('填写联系人')"
                prop="product_service_contactor_flag"
              >
                <el-radio-group
                  v-model="validForm.product_service_contactor_flag"
                  size="default"
                  :style="{ width: '90%' }"
                >
                  <el-radio
                    v-for="(item, index) in product_service_contactor_flagOptions"
                    :key="index"
                    :disabled="item.disabled"
                    :label="item.value"
                  >
                    {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col v-show="validForm.product_valid_period === 1002" :span="12">
              <el-form-item :label="t('商品有效期至')" prop="product_validity_end">
                <el-date-picker
                  v-model="validForm.product_validity_end"
                  :placeholder="t('商品有效期至')"
                  :style="{ width: '90%' }"
                  type="datetime"
                />
              </el-form-item>
            </el-col>
            <el-col v-show="validForm.product_valid_period === 1003" :span="12">
              <el-form-item :label="t('商品有效时长')" prop="product_validity_duration">
                <el-input
                  v-model="validForm.product_validity_duration"
                  :placeholder="t('请输入有效时长')"
                  :style="{ width: '90%' }"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <el-row v-show="productForm.kind_id === 1203">
        <div class="tit_font">{{ t('电子卡券') }}</div>
        <el-divider/>
        <el-form
          ref="productFormRef"
          label-width="100px"
          :model="productForm"
          size="default"
          style="width:100%"
        >
          <el-row type="flex">
            <el-col :span="12">
              <el-form-item :label="t('次卡售卖')" prop="card_type_id">
                <el-select
                  v-model="productForm.card_type_id"
                  clearable
                  filterable
                  :placeholder="t('请选择')"
                  :style="{ width: '90%' }"
                  @change="onChangeKinds(productForm.card_type_id)"
                >
                  <el-option
                    v-for="item in paycardTypes"
                    :key="item.card_type_id"
                    :label="item.card_type_name"
                    :value="item.card_type_id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="t('优惠券售卖')" prop="voucher_activity_id">
                <el-select
                  v-model="productForm.voucher_activity_id"
                  clearable
                  :placeholder="t('请选择')"
                  :style="{ width: '90%' }"
                  @change="onChangeKindsTypeId(productForm.voucher_activity_id)"
                >
                  <el-option
                    v-for="item in activityArr"
                    :key="item.activity_id"
                    :label="item.activity_name"
                    :value="item.activity_id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="t('券码售卖')" prop="coupon_type_id">
                <el-select
                  v-model="productForm.coupon_type_id"
                  clearable
                  :placeholder="t('请选择')"
                  :style="{ width: '90%' }"
                  @change="onChangeKindsVAId(productForm.coupon_type_id)"
                >
                  <el-option
                    v-for="item in couponCardTypes"
                    :key="item.card_type_id"
                    :label="item.card_type_name"
                    :value="item.card_type_id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <el-row>
        <div class="tit_font">{{ t('物流/其它') }}</div>
        <el-divider/>
        <el-form
          ref="productFormRef"
          label-width="100px"
          :model="productForm"
          size="default"
          style="width:100%"
        >
          <el-row type="flex">
            <el-col :span="12">
              <el-form-item :label="t('运费设置')" prop="transport_type_id">
                <el-select
                  v-model="productForm.transport_type_id"
                  filterable
                  :placeholder="t('请选择')"
                  :style="{ width: '90%' }"
                >
                  <el-option
                    v-for="item in transports"
                    :key="item.transport_type_id"
                    :label="item.transport_type_name"
                    :value="item.transport_type_id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="false" :span="12">
              <el-form-item :label="t('购买上限')" prop="product_buy_limit">
                <el-input
                  v-model="productForm.product_buy_limit"
                  clearable
                  :placeholder="t('请输入购买上限')"
                  :style="{ width: '90%' }"
                />
              </el-form-item>
            </el-col>
            <!--          <el-col :span="12">-->
            <!--            <el-form-item :label="t('七天无理由')" prop="contract_type_id">-->
            <!--              <el-radio-group-->
            <!--                v-model="productForm.contract_type_id"-->

            <!--                size="default"-->
            <!--                :style="{ width: '90%' }"-->
            <!--              >-->
            <!--                <el-radio-->
            <!--                  v-for="(item, index) in contract_type"-->

            <!--                  :key="index"-->
            <!--                  :disabled="item.disabled"-->
            <!--                  :label="item.value"-->
            <!--                >-->
            <!--                  {{ item.label }}-->
            <!--                </el-radio>-->
            <!--              </el-radio-group>-->
            <!--            </el-form-item>-->
            <!--          </el-col>-->

            <!--<el-col :span="24">-->
            <!--<el-form-item label="消费者权益保障" label-width="130px" prop="contract_type_ids">-->
            <!--<el-checkbox-group-->
            <!--v-model="productForm.contract_type_ids"-->
            <!--&gt;-->
            <!--<el-checkbox v-for="(item,index) in roleList" :label="item.contract_type_id" :key="index">-->
            <!--{{item.contract_type_name}}-->
            <!--</el-checkbox>-->
            <!--</el-checkbox-group>-->
            <!--</el-form-item>-->
            <!--</el-col>-->

            <!--<el-col :span="12">-->
            <!--<el-form-item label="配送方式" label-width="130px" prop="product_transport_id">-->
            <!--<el-checkbox-group-->
            <!--v-model="productForm.product_transport_id"-->
            <!--&gt;-->
            <!--<el-checkbox v-for="(item,index) in roleLists" :label="item.value" :key="index">{{item.label}}-->
            <!--</el-checkbox>-->
            <!--</el-checkbox-group>-->
            <!--</el-form-item>-->
            <!--</el-col>-->
            <el-col v-if="false" :span="12">
              <el-form-item :label="t('支付方式')" prop="payment_type_id">
                <el-radio-group
                  v-model="productForm.payment_type_id"
                  size="default"
                  :style="{ width: '90%' }"
                >
                  <el-radio
                    v-for="(item, index) in payment_type_idOptions"
                    :key="index"
                    :label="item.value"
                  >
                    {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="t('开售时间')" prop="product_state_id">
                <el-radio-group
                  v-model="productForm.product_state_id"
                  size="default"
                  :style="{ width: '90%' }"
                >
                  <el-radio
                    v-for="(item, index) in product_state_idOptions"
                    :key="index"
                    :disabled="item.disabled"
                    :label="item.value"
                  >
                    {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item :label="t('库存锁定')" prop="product_inventory_lock">
                <el-radio-group
                  v-model="productForm.product_inventory_lock"
                  size="default"
                  :style="{ width: '90%' }"
                >
                  <el-radio
                    v-for="(item, index) in product_inventory_lockOptions"
                    :key="index"
                    :disabled="item.disabled"
                    :label="item.value"
                  >
                    {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col v-if="productForm.product_state_id === 1002" :span="12">
              <el-form-item label="" prop="product_state_id">
                <el-date-picker
                  v-model="productForm.product_sale_time"
                  :placeholder="t('预计上架时间，可以动态修正状态')"
                  :style="{ width: '90%' }"
                  type="datetime"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>

      <el-row type="flex">
        <div class="tit_font">{{ t('详细介绍') }}</div>
        <el-divider/>
        <el-col :span="1">{{ t('商品描述') }}</el-col>
        <el-col :span="21">
          <MsRichEditor
            v-if="showRichEditor"
            ref="msRichEditorRef"
            v-model="productForm.product_detail"
            style="height: 400px;"
          />
        </el-col>
        <!--        <el-row class="quill">-->
        <!--          <el-col :span="2">{{ t('规格参数')}}</el-col>-->
        <!--          <el-col :span="21">-->
        <!--            <ms-richeditor-->
        <!--              ref="msRichEditorRef"-->
        <!--              v-model="productForm.product_param"-->
        <!--              style="width: 90%"-->
        <!--            />-->
        <!--          </el-col>-->
        <!--        </el-row>-->
        <!--        <el-row class="quill">-->
        <!--          <el-col :span="2">{{ t('售后服务')}}</el-col>-->
        <!--          <el-col :span="21">-->
        <!--            <ms-richeditor-->
        <!--              ref="msRichEditorRef"-->
        <!--              v-model="productForm.product_service"-->
        <!--              style="width: 90%"-->
        <!--            />-->
        <!--          </el-col>-->
        <!--        </el-row>-->
      </el-row>
      <el-row style="padding-top: 10px">
        <el-col :offset="12" :span="12">
          <el-button @click="close">{{ t('取消') }}</el-button>
          <el-button type="primary" @click="save">{{ t('保存') }}</el-button>
        </el-col>
      </el-row>
    </el-scrollbar>
    <el-dialog
      v-model="tableVisible"
      append-to-body
      :title="t('管理规格值')"
      width="700px"
    >
      <el-row align="right">
        <el-col :offset="21" :span="3" style="padding-bottom: 10px">
          <el-button @click="editSpecItem()">
            {{ t('新增') }}
          </el-button>
        </el-col>
      </el-row>
      <el-row :span="24">
        <el-table
          border
          :data="specTableData"
          height="400px"
        >
          <el-table-column align="center" :label="t('操作')" prop="date" width="150">
            <template #default="scope">
              <el-button type="text" @click="editSpecItem(scope.row)">
                {{ t('编辑') }}
              </el-button>
              <el-button
                type="text"
                @click="detSpecItem(scope.row)"
              >
                {{ t('删除') }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="t('商品规格值编号')" prop="spec_item_id" width="150" />
          <el-table-column align="center" :label="t('规格值名称')" prop="spec_item_name" width="260" />
          <el-table-column align="center" :label="t('排序')" prop="spec_item_sort" width="100" />
        </el-table>
      </el-row>
      <template #footer>
        <el-button @click="closeTableVisible">{{ t('关闭') }}</el-button>
      </template>
<!--      <el-dialog-->
<!--        ref="itemRef"-->
<!--        append-to-body-->
<!--        :title="specTitle"-->
<!--        width="30%"-->
<!--      >-->
<!--        <el-form-->
<!--          ref="specItemFormRef"-->
<!--          label-width="100px"-->
<!--          :model="specItemForm"-->
<!--          size="default"-->
<!--        >-->
<!--          <el-form-item :label="t('规格值名称')" prop="spec_item_name">-->
<!--            <el-input-->
<!--              v-model="specItemForm.spec_item_name"-->
<!--              clearable-->
<!--              :placeholder="t('请输入规格值名称')"-->
<!--              :style="{ width: '100%' }"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item :label="t('排序')" prop="spec_item_sort">-->
<!--            <el-input-->
<!--              v-model="specItemForm.spec_item_sort"-->
<!--              clearable-->
<!--              :placeholder="t('请输入排序')"-->
<!--              :style="{ width: '100%' }"-->
<!--            />-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--        <template #footer>-->
<!--          <el-button @click="saveSpecItem">{{ t('确认') }}</el-button>-->
<!--          <el-button @click="closeEditSpecItem">{{ t('取消') }}</el-button>-->
<!--        </template>-->
<!--      </el-dialog>-->
    </el-dialog>
    <el-dialog
      v-model="editVisible"
      append-to-body
      :title="specTitle"
      width="30%"
    >
      <el-form
        ref="itemRef"
        label-width="100px"
        :model="specItemForm"
        :rules="itemRefRules"
        size="default"
      >
        <el-form-item :label="t('规格值名称')" prop="spec_item_name">
          <el-input
            v-model="specItemForm.spec_item_name"
            clearable
            :placeholder="t('请输入规格值名称')"
            :style="{ width: '100%' }"
          />
        </el-form-item>
        <el-form-item :label="t('排序')" prop="spec_item_sort">
          <el-input
            v-model="specItemForm.spec_item_sort"
            clearable
            :placeholder="t('请输入排序')"
            :style="{ width: '100%' }"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="saveSpecItem">{{ t('确认') }}</el-button>
        <el-button @click="closeEditSpecItem">{{ t('取消') }}</el-button>
      </template>
    </el-dialog>
  </el-dialog>
  <material-gallery-dialog ref="galleryRef" :append-to-body="true" :url="productForm.product_video ? [productForm.product_video] : []"  @get-files="getVideoUrl"/>
</template>

<script>
import {translate as t} from '@/i18n'
import {doSave, getProductDate, listItem} from '@/api/pt/productBase'
import {doEdit as doEditSpecItem, getList as getSpecItems, doAdd as doAddSpecItem, doRemove as doRemoveSpecItem} from '@/api/pt/productSpecItem'
import {getList as getTags} from '@/api/pt/productTag'
import {getInfo as getTypeInfo} from '@/api/pt/productType'
import PicUpload from '@/plugins/MsUpload/PicUpload'
import MsRichEditor from '~/src/plugins/MsRichEditor'
import {getTree} from "@/api/pt/productCategory";
import {useSettingsStore} from "@/store/modules/settings";
import { maxListNum } from '@/config'
import MaterialGalleryDialog from '@/views/sys/gallery/dialog'
import {getList as transportsList} from '@/api/shop/storeTransportType'
import { CirclePlus, Fold, Plus } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'ProductBaseEdit',
  components: {PicUpload, MsRichEditor, MaterialGalleryDialog},
  props: {},
  emits: ['fetch-data'],
  setup(props, {emit}) {
    const $message = inject('$message')
    const $confirm = inject('$confirm')
    const settingsStore = useSettingsStore()
    const {ctx:that} = getCurrentInstance()

    const state = reactive({
      isExpandCategory: true,
      categoryList: [],
      formRef: null,
      galleryRef: null,
      itemRef: null,
      rules: {
        title: [{required: true, trigger: 'blur', message: t('请输入标题')}],
      },
      title: '',
      dialogFormVisible: false,
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 是否是修改商品规格值表
      isItemUpdate: false,

      //默认主图
      defaultImage: settingsStore.getConfigs.default_image,

      batchObj: {
        item_is_default: false,
        item_enable: 1001,
        item_market_price: undefined,
        item_unit_price: undefined,
        item_unit_points: undefined,
        item_quantity: undefined,
      }, // 批量操作对象
      shop_product_assist_index: [],
      shop_product_index: {},
      shop_product_item: {},
      shop_product_image: [],
      shop_product_info: {},
      shop_product_base: {},
      shop_product_valid_period: {},
      row: {}, // 类型对象数据
      spanArr: {},
      specImageIdList: [], // 选中的spec 是image类型 spec_id 集合
      productTags: [], // 产品标签
      roleList: [],
      storeCategoryTree: [], // 店铺分类树数据
      transports: [], // 运费
      paycardTypes: [], // 次卡
      activityArr: [],  // 优惠券售卖
      couponCardTypes: [], // 券码售卖
      categoryProps: {
        value: 'store_product_cat_id',
        label: 'store_product_cat_name',
        children: 'nodes',
        multiple: true,
      },
      specId: undefined,
      specItemForm: {},
      specTableData: [],
      product_state_idOptions: [
        {
          label: t('立即开售'),
          value: 1001,
        },
        {
          label: t('定时开售'),
          value: 1002,
        },
      ],
      roleLists: [
        {
          label: t('物流配送'),
          value: 10,
        },
        {
          label: t('门店自提'),
          value: 5,
        },
        {
          label: t('到店服务'),
          value: 5,
        },
      ],
      payment_type_idOptions: [
        {
          label: t('先预约后支付'),
          value: 1,
        },
        {
          label: t('先支付后预约'),
          value: 0,
        },
      ],
      product_inventory_lockOptions: [
        {
          label: t('下单锁定'),
          value: 1001,
        },
        {
          label: t('支付锁定'),
          value: 1002,
        },
      ],
      product_valid_periodOptions: [
        {
          label: t('长期有效'),
          value: 1001,
        },
        {
          label: t('自定义有效期'),
          value: 1002,
        },
        {
          label: t('有效时长'),
          value: 1003,
        },
      ],
      product_valid_typeOptions: [
        {
          label: t('到店服务'),
          value: 1001,
        },
        {
          label: t('上门服务'),
          value: 1002,
        }
      ],
      product_service_date_flagOptions: [
        {
          label: t('否'),
          value: false,
        },
        {
          label: t('是'),
          value: true,
        },
      ],
      product_service_contactor_flagOptions: [
        {
          label: t('否'),
          value: false,
        },
        {
          label: t('是'),
          value: true,
        },
      ],
      validForm: {
        product_valid_period: 1001,
        product_valid_type: 1001,
        product_service_date_flag: false,
        product_service_contactor_flag: true,

        product_validity_start: 0,
        product_validity_end: 0,
        product_validity_duration: "",
        product_valid_refund_flag: false,
      },
      productFormRef: null,
      showRichEditor:false,
      productForm: {
        category_id: 0,
        kind_id: 1201,

        product_sale_time: '',
        product_video: '',
        product_buy_limit: undefined,
        product_number: '',
        product_name: '',
        product_inventory_lock: 1001,
        payment_type_id: 0,
        product_state_id: 1001,
        contract_type_ids: [],
        product_transport_id: [],
        transport_type_id: undefined,
        store_category_ids: [],
        voucher_activity_id: [],
        coupon_type_id: [],
        product_service: '',
        product_param: '',
        product_detail: '',
        product_id: undefined,
        product_tips: '',
      },
      productRules: {
        product_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur',
          },
        ],
      },
      action: URL.action,
      virtualHead: [
        {
          label: t('主图'),
          property: 'main_color_img',
        },
        {
          label: t('图片'),
          property: 'color_img',
        },
        {
          label: t('市场价'),
          property: 'item_market_price',
        },
        {
          label: t('零售价'),
          property: 'item_unit_price',
        },
        {
          label: t('需要积分'),
          property: 'item_unit_points',
        },
        {
          label: t('库存'),
          property: 'item_quantity',
        },
        {
          label: t('上下架'),
          property: 'item_enable',
        },
        {
          label: t('是否默认'),
          property: 'item_is_default',
        },
      ],
      expHead: [
        {
          label: t('主图'),
          property: 'main_color_img',
        },
        {
          label: t('图片'),
          property: 'color_img',
        },
        // {
        //   label: t('属性编号'),
        //   property: 'item_number',
        // },
        // {
        //   label: t('条形码'),
        //   property: 'item_barcode',
        // },
        // {
        //   label: t('重量[kg]'),
        //   property: 'item_weight',
        // },
        {
          label: t('市场价'),
          property: 'item_market_price',
        },
        {
          label: t('零售价'),
          property: 'item_unit_price',
        },
        {
          label: t('需要积分'),
          property: 'item_unit_points',
        },
        {
          label: t('库存'),
          property: 'item_quantity',
        },
        {
          label: t('上下架'),
          property: 'item_enable',
        },
        {
          label: t('是否默认'),
          property: 'item_is_default',
        },
      ],
      specHead: [],
      specData: [],
      allSpecData: [],
      newSpecItemIdRow: [],
      assistArr: {},
      checkBrand: undefined, // 选中的品牌列表
      checkSpec: {}, // 选中的spec 列表
      brands: [], // 品牌数据
      assists: [], // 辅助属性数据
      specs: [], // 规格参数数据
      allowCheckSpecRow: [],
      tableVisible: false,
      editVisible: false,
      specTitle: '',
    })

    // 读取分类树形
    const getCategoryData = async () => {
      const {data: list} = await getTree({})

      state.categoryList = list
    }

    const onChangeKinds = (row) => {
      if (row) {
        state.productForm.voucher_activity_id = ''
        state.productForm.coupon_type_id = ''
      }
    }

    // 清空 voucher_activity_id
    const onChangeKindsTypeId = (row) => {
      if (row) {
        state.productForm.card_type_id = ''
        state.productForm.coupon_type_id = ''
      }
      that.$forceUpdate()
    }
    // 清空 coupon_type_id
    const onChangeKindsVAId = (row) => {
      if (row) {
        state.productForm.card_type_id = ''
        state.productForm.voucher_activity_id = ''
      }
      that.$forceUpdate()
    }
    const batchHandle = () => {
      for (const key in state.batchObj) {
        if ('item_is_default' == key || 'item_enable' == key )
        {
          continue
        }
        else
        {
          state.specData.forEach((item, index) => {
            state.specData[index][key] = Number(state.batchObj[key]) || ''
          })
        }
      }
    }

    const batchInput = (e, key) => {
      let value = e.target.value
      value = Math.round(value * Math.pow(10, 4)) / Math.pow(10, 4) //四舍五入
      value = Number(value).toFixed(2) //补足位数
      e.target.value = Number(value)
      state.batchObj[key] = Number(value)
    }

    // 计算合并列的下标和数量
    const initRowspan = () => {
      const image = getFirstImageSpec()
      if (!image) return
      const data = state.specData
      let index = 1
      let currIndex = 0
      state.spanArr[image] = {}
      for (let i = 0; i <= data.length - 1; i++) {
        if (i === data.length - 1) {
          state.spanArr[image][currIndex] = index
          return
        }
        if (data[i][image] === data[i + 1][image]) {
          index++
        } else {
          state.spanArr[image][currIndex] = index
          currIndex = i + 1
          index = 1
        }
      }
    }

    const getFirstImageSpec = () => {
      const specs = state.specs
      const checkSpec = state.checkSpec
      const sp = specs.find((spec) => {
        const spec_id = spec.spec_id
        if (typeof checkSpec[spec_id] == "undefined") {
          return false
        } else {
          const checkSpecElement = checkSpec[spec_id]

          return checkSpecElement.length > 0 && spec.spec_format === 'image'
        }
      })
      return sp ? sp.spec_id : null
    }

    // 四舍五入返回四位有效数字
    const handleInput = (e, scope) => {
      let value = e.target.value
      const index = scope.$index
      console.log(index)
      value = Math.round(value * Math.pow(10, 4)) / Math.pow(10, 4) //四舍五入
      value = Number(value).toFixed(2) //补足位数
      state.specData[index][scope.column.property] = Number(value)
    }

    // 维护选中的类型image的spec
    const initSpecImageList = () => {
      state.specImageIdList = []
      state.specs.forEach((spec) => {
        if (spec.spec_format === 'image')
          state.specImageIdList.push(spec.spec_id)
      })
    }

    const saveSpecItem = () => {
      state['itemRef'].validate(async (valid) => {
        if (valid) {
          if (state.isItemUpdate) {
            const {msg, status} = await doEditSpecItem(state.specItemForm)
            if (200 == status) {
              // // 修改规格编辑后数据
              // if (that.specItemForm.spec_item_id) {
              //   for (let i = 0; i < that.specData.length; i++) {
              //     for (let j = 0; j < that.specs.length; j++) {
              //       for (let k = 0; k < that.specs[j].items.length; k++) {
              //         if (that.specs[j].items[k].spec_item_id === that.specItemForm.spec_item_id) {
              //           that.specs[j].items[k].spec_item_name = that.specItemForm.spec_item_name
              //         }
              //       }
              //     }
              //   }
              // }
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }
          } else {
            const {msg, status} = await doAddSpecItem(state.specItemForm)
            if (200 == status) {
              // 修改规格编辑后数据
              // if (that.specItemForm.spec_item_id) {
              //   for (let i = 0; i < that.specData.length; i++) {
              //     for (let j = 0; j < that.specs.length; j++) {
              //       for (let k = 0; k < that.specs[j].items.length; k++) {
              //         if (that.specs[j].items[k].spec_item_id === that.specItemForm.spec_item_id) {
              //           that.specs[j].items[k].spec_item_name = that.specItemForm.spec_item_name
              //         }
              //       }
              //     }
              //   }
              // }
              $message(msg, 'success')
            } else {
              $message(msg, 'error')
            }
          }

          await upDateSpecItem()
          closeEditSpecItem()
        } else {
          return false
        }
      })
    }

    const upDateSpecItem = async () => {
      // 更新
      const specItemList = await getSpecItemList(state.specId)
      state.specTableData = specItemList
      const spec = state.specs.find((item) => item.spec_id === state.specId)

      const checkSpecItems = state.checkSpec[state.specId];

      //如下实现spec.items = specItemList

      //spec.items未被删除的spec_item_id
      const exists_sii = [];

      //新增数据-已经存在的编号
      const exists_new_sii = [];

      //新增
      for (let j = 0; j <= specItemList.length - 1; j++) {
        if (spec.items == null) {
          spec.items = []
        }

        for (let i = 0; i <= spec.items.length - 1; i++) {
          if (spec.items[i].spec_item_id == specItemList[j].spec_item_id) {
            exists_new_sii.push(specItemList[j].spec_item_id);
            break;
          }
        }
      }

      //修改更改后的值
      for (let i = 0; i <= spec.items.length - 1; i++) {
        for (let j = 0; j <= specItemList.length - 1; j++) {
          //更改最新值
          if (spec.items[i].spec_item_id == specItemList[j].spec_item_id) {
            spec.items[i] = Object.assign(spec.items[i], specItemList[j])
            exists_sii.push(spec.items[i].spec_item_id);
            break;
          } else if (spec.items.length - 1 > j) {
            //查找被删除的元素index
          } else {
            //新增
            //spec.items.push(specItemList[j]);
            //exists_sii.push(specItemList[j].spec_item_id);
          }
        }
      }

      let add_flag = false; //为新增操作

      //新增
      for (let j = 0; j <= specItemList.length - 1; j++) {
        if (!(exists_new_sii.indexOf(specItemList[j].spec_item_id) > -1)) {
          //新增
          spec.items.push(specItemList[j]);
          add_flag = true;
        }
      }

      if (!add_flag) {
        //删除
        for (let i = 0; i <= spec.items.length - 1; i++) {
          if (!(exists_sii.indexOf(spec.items[i].spec_item_id) > -1)) {
            spec.items.splice(i, 1);
          }
        }

        //删除
        for (let i = 0; i <= checkSpecItems.length - 1; i++) {
          if (!(exists_sii.indexOf(checkSpecItems[i].spec_item_id) > -1)) {
            checkSpecItems.splice(i, 1);
          }
        }
      }

      that.$forceUpdate();
    }

    const detSpecItem = (row) => {
      if (row.spec_item_id) {
        $confirm(t('你确定要删除当前项吗'), null, async () => {
          const {msg, status} = await doRemoveSpecItem({
            spec_item_id: row.spec_item_id,
          })
          if (200 == status) {

            // for (let i = 0; i < that.specData.length; i++) {
            //   const index = row.spec_id + "_" + row.spec_item_id
            //   if (that.specData[i][index] === row.spec_item_id) {
            //     that.specData.splice(i, 1)
            //   }
            // }
            // 移除勾选
            // for (let i = 0; i < that.checkSpec[row.spec_id].length; i++) {
            //   if (that.checkSpec[row.spec_id][i].spec_item_id == row.spec_item_id) {
            //     that.checkSpec[row.spec_id].splice(i, 1)
            //   }
            // }


            $message(msg, 'success')
            //await state.upDateSpecItem()
          } else {
            $message(msg, 'error')
          }
          await upDateSpecItem()
        })
      }
    }

    const closeEditSpecItem = () => {
      state.specItemForm = {}
      state.editVisible = false
    }
    const showEditSpecItem = (spec_id) => {
      state.specId = spec_id
      editSpecItem()
    }
    const editSpecItem = (row) => {
      if (row) {
        state.specTitle = '编辑'
        state.isItemUpdate = true
        state.specItemForm = Object.assign({}, row)
        state.editVisible = true
        return
      }
      state.specTitle = '新增'
      state.isItemUpdate = false
      state.specItemForm = {
        spec_id: state.specId,
      }
      state.editVisible = true
    }

    const showTable = async (spec_id) => {
      state.specId = spec_id
      await getSpecItemList(spec_id)
      state.tableVisible = true
    }
    const getSpecItemList = async (spec_id) => {
      const query = {
        spec_id: spec_id,
        page: 1,
        size: 500,
      }
      const {data} = await getSpecItems(query)
      if (data) {
        state.specTableData = data.items
        return data.items
      }
      return null
    }
    // 合并列
    const spanMethod = ({column, rowIndex}) => {

      if (
        column.property === 'main_color_img' ||
        column.property === 'color_img'
      ) {
        // if (state.specImageIdList.length === 0) {
        const image = getFirstImageSpec()
        if (!image) {
          if (rowIndex === 0) {
            return {
              rowspan: state.specData.length,
              colspan: 1,
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0,
            }
          }
        } else {
          const _row = state.spanArr[image][rowIndex]
          const _col = _row > 0 ? 1 : 0
          return {
            rowspan: _row,
            colspan: _col,
          }
        }
      }
    }

    const onChangeKind = (val) => {
      // 清空选中的规格参数
      for (const key in state.checkSpec) {
        state.checkSpec[key] = []
      }
      if (val) {
        state.specHead = Array.from(state.expHead)
      } else {
        state.specHead = Array.from(state.virtualHead)
      }
    }
    const showProperty = (property) => {
      const obj = state.expHead.find((item) => item.property === property)
      return obj ? true : false
    }
    const handleAvatarSuccess = (name, image, scop) => {
      state.specData[scop.$index][name] = image
    }
    const handleSuccess = (name, images, scop) => {
      images.forEach((image) => {
        state.specData[scop.$index][name].push(image)
      })
    }

    // 构建表头数据
    const creSpecHead = (arr) => {
      state.specHead = []
      const sp = state.specs
      arr.forEach((specs) => {
        const spec = sp.find((item) => item.spec_id === specs[0].spec_id)
        if (spec) {
          const obj = {
            label: spec.spec_name,
            property: spec.spec_id.toString(),
          }
          state.specHead.push(obj)
        }
      })
      const head = state.productForm.kind_id === 1201 ? state.expHead : state.virtualHead
      state.specHead = state.specHead.concat(head)
    }

    const getProductAssistsIndex = () => {
      const assists = state.assists
      const assistArr = state.assistArr
      if (!assists || !assistArr) return []

      const assistsIndexs = []
      for (const assist_id in assistArr) {
        const assist = assists.find(
          (item) => item.assist_id === Number(assist_id)
        )
        if (assist) {
          const obj = {
            assist_id: Number(assist_id),
          }
          const format = assist.assist_format
          if (format === 'text' || format === 'radio') {
            obj.assist_item_id = assistArr[assist_id]
          } else {
            obj.assist_item_id = assistArr[assist_id].toString()
          }
          assistsIndexs.push(obj)
        }
      }
      return assistsIndexs
    }

    // 构建表数据
    const creSpecData = (descartes) => {
      //存入参考数据
      //存在的ssid
      const ssid_row = [];
      for (let i = 0; i < state.specData.length; i++) {
        if (state.allSpecData.length == 0) {
          state.allSpecData.push(Object.assign({}, state.specData[i]));
          break;
        }

        for (let j = 0; j < state.allSpecData.length; j++) {
          if (typeof state.allSpecData[j]['siid'] !== 'undefined' && typeof state.specData[i]['siid'] !== 'undefined' && state.allSpecData[j]['siid'] == state.specData[i]['siid']) {
            state.allSpecData[j] = Object.assign({}, state.specData[i]);
            ssid_row.push(state.allSpecData[j]['siid'])
            break;
          }
        }
      }
      for (let i = 0; i < state.specData.length; i++) {
        if (!(ssid_row.indexOf(state.specData[i]['ssid']) > -1)) {
          state.allSpecData.push(Object.assign({}, state.specData[i]));
        }
      }

      state.specData = []
      // 当specs 为空时

      for (let i = 0; i < descartes.length; i++) {
        const obj = {
          category_id: state.row.category_id,
          main_color_img: state.defaultImage,
          color_img: [],
          item_enable: 1001,
          item_is_default: false,
          item_weight: undefined,
          item_market_price: undefined,
          item_unit_price: undefined,
          item_unit_points: undefined,
          item_quantity: undefined,
        }

        const spec_item_ids = [];
        let id = ''

        if (Array.isArray(descartes[i])) {
          descartes[i].forEach((spec) => {
            const spec_id = spec.spec_id
            const spec_item_id = spec.spec_item_id
            id = spec_id + '_' + spec_item_id
            obj[spec.spec_id] = spec.spec_item_name
            obj[id] = spec.spec_item_id

            spec_item_ids.push(spec_item_id);
          })
        } else {
          const spec_id = descartes[i].spec_id
          const spec_item_id = descartes[i].spec_item_id
          id = spec_id + '_' + spec_item_id
          obj[spec_id] = descartes[i].spec_item_name
          obj[id] = spec_item_id

          spec_item_ids.push(spec_item_id);
        }

        spec_item_ids.sort(function (a, b) {
          return a - b;
        });
        const spec_item_ids_str = spec_item_ids.join('-');

        obj['siid'] = spec_item_ids_str

        //判断目前填充的数据
        for (let j = 0; j < state.allSpecData.length; j++) {
          if (typeof state.allSpecData[j]['siid'] !== 'undefined' && state.allSpecData[j]['siid'] == spec_item_ids_str) {
            obj.category_id = Number(state.allSpecData[j].category_id);
            obj.colorImg = state.allSpecData[j].colorImg;
            obj.color_img = state.allSpecData[j].color_img;
            obj.item_barcode = state.allSpecData[j].item_barcode;
            obj.item_enable = state.allSpecData[j].item_enable;
            obj.item_id = state.allSpecData[j].item_id;
            obj.item_is_default = state.allSpecData[j].item_is_default ? true : false;
            obj.item_market_price = Number(state.allSpecData[j].item_market_price) || '';
            obj.item_number = state.allSpecData[j].item_number;
            obj.item_quantity = Number(state.allSpecData[j].item_quantity) || '';
            obj.item_unit_points = Number(state.allSpecData[j].item_unit_points) || '';
            obj.item_unit_price = Number(state.allSpecData[j].item_unit_price) || '';
            obj.item_weight = Number(state.allSpecData[j].item_weight) || '';
            obj.main_color_img = state.allSpecData[j].main_color_img;
          }
        }
        state.specData.push(obj)
      }
    }

    // 生成笛卡尔积
    const descartes = (array) => {
      if (!array || array.length === 0) return [[]]

      return [].reduce.call(array, function (col, set) {
        const res = []
        col.forEach(function (c) {
          set.forEach(function (s) {
            const t = [].concat(Array.isArray(c) ? c : [c])
            t.push(s)
            res.push(t)
          })
        })
        return res
      })
    }

    const resetData = () => {
      state.checkSpec = {}
      state.specs = []
      state.specData = []

      reset()
    }

    const showEdit = async (row) => {
      state.showRichEditor = true

      resetData()

      state.dialogFormVisible = true
      state.loading = true

      // 获取商品标签
      getProductTags()

      //判断新增 还是 修改
      if (row && row.product_id) {
        state.isUpdate = true

        const productId = Number(row.product_id)
        state.productForm.product_id = productId

        await getProductInfo(productId)
        //await getProductItem(productId)

        state.productForm.category_id = state.shop_product_index.category_id
        state.productForm.kind_id = state.shop_product_index.kind_id

        await getType(state.shop_product_index.type_id)

        //设置选中辅助属性
        state.assistArr = JSON.parse(state.shop_product_info.product_assist)

        initData()
      } else {
        state.isUpdate = false

        state.productForm.category_id = row.category_id
        await getType(row.type_id)


        // 运费设置id
        const transports = state.transports
        if (transports && transports.length > 0) {
          state.productForm.transport_type_id = transports[0].transport_type_id
        }
      }

      // // 初始化表头数据
      state.specHead = Array.from(state.expHead)
      // state.shop_product_base = Object.assign({}, row)

      state.loading = false
    }

    const initData = () => {
      // 初始化数据
      //initAssists()

      // initDetail()
      initDetail()

      // initProduct()
      initProduct()

      if (state.shop_product_index.kind_id === 1202) {
        initValid()
      }
      // initSpec()
      initSpec()
      // initItems()
      initItems()
      // initTableHead()
      initTableHead()
      // 计算合并列
      initRowspan()
    }

    // 初始化 辅助属性
    const initAssists = () => {
      const assists = state.assists
      state.shop_product_assist_index.forEach((assist) => {
        const assistId = assist.assist_id

        const _assist = assists.find(
          (item) => item.assist_id === Number(assistId)
        )

        const format = _assist.assist_format
        if (format === 'text') {
          state.assistArr[assistId] = assist.assist_item_id
        } else if (format === 'radio' || format === 'select') {
          state.assistArr[assistId] = Number(assist.assist_item_id)
        } else {
          const assist_item_id = assist.assist_item_id.split(',').map(Number)
          state.assistArr[assistId] = assist_item_id
        }
      })
    }

    // 初始化虚拟产品数据
    const initValid = () => {
      const shopProductValidPeriod = state.shop_product_valid_period
      if (!shopProductValidPeriod) return

      state.validForm = {
        product_valid_period: shopProductValidPeriod.product_valid_period,
        product_valid_type: shopProductValidPeriod.product_valid_type,
        product_service_date_flag:
        shopProductValidPeriod.product_service_date_flag,
        product_service_contactor_flag: shopProductValidPeriod.product_service_contactor_flag,

        product_validity_start: shopProductValidPeriod.product_validity_start,
        product_validity_end: shopProductValidPeriod.product_validity_end,
        product_validity_duration: shopProductValidPeriod.product_validity_duration,
        product_valid_refund_flag: shopProductValidPeriod.product_valid_refund_flag,
      }
    }
    // 初始化 规格属性
    const initSpec = () => {
      const strSpecs = state.shop_product_info
        ? state.shop_product_info.product_spec
        : ''

      console.info('product_spec')
      console.info(strSpecs)

      if (strSpecs) {
        const specs = JSON.parse(strSpecs)
        specs.forEach((spec) => {
          const spec_id = Number(spec.id)

          //设置允许点选的规格信息
          state.allowCheckSpecRow.push(spec_id);
          const idsArr = spec.item.map((obj) => Number(obj.id))
          const items = getSpecItemByIds(spec_id, idsArr)
          // 设置spec 勾选数据
          state.checkSpec[spec_id] = items
          console.info(items)
          items.forEach((item) => {
            state.newSpecItemIdRow.push(item.spec_item_id);
          })
        })
      }
    }

    const initTableHead = () => {
      const checkSpec = state.checkSpec
      const arr = []
      for (const key in checkSpec) {
        const element = checkSpec[key]
        if (element.length > 0) arr.push(element)
      }
      const descartesData = descartes(arr)
      // 构造表头数据
      creSpecHead(arr)
      // 构造表数据
      creSpecData(descartesData)
    }

    const initItems = () => {
      const productItems = state.shop_product_item
      const shop_product_image = state.shop_product_image

      const tmpSpecData = []
      state.specData = []

      if (productItems) {
        Object.entries(productItems).forEach(([key, productItem]) => {
          console.info(key);

          const obj = {
            main_color_img: '',
            color_img: [],
            item_id: productItem.item_id,
            item_barcode: productItem.item_barcode,
            item_number: productItem.item_number,
            item_weight: productItem.item_weight,
            item_market_price: productItem.item_market_price,
            item_unit_price: productItem.item_unit_price,
            item_unit_points: productItem.item_unit_points,
            item_quantity: productItem.item_quantity,
            item_enable: productItem.item_enable,
            item_is_default: productItem.item_is_default == 1 ? true : false,
            item_purchase_price: productItem.item_purchase_price,
            item_purchase_rate: productItem.item_purchase_rate,
            item_sales_rate: productItem.item_sales_rate,
          }

          const strSpec = productItem.item_spec
          const itemSpecs = JSON.parse(strSpec ? strSpec : '[]')
          const spec_item_ids = []

          if (itemSpecs.length > 0) {
            itemSpecs.forEach((spec) => {
              const spec_id = Number(spec.id)
              const spec_item_id = Number(spec.item.id)
              const id = spec_id + '_' + spec_item_id
              obj[spec_id] = spec.item.name
              obj[id] = spec_item_id

              spec_item_ids.push(spec_item_id)
            })
          }

          //有图片规格
          const image_id = getFirstImageSpec()
          if (image_id && itemSpecs.length > 0 && itemSpecs[0].spec_format) {
            itemSpecs.forEach((spec) => {
              if (image_id && image_id === Number(spec.id)) {
                const item_id = Number(spec.item.id)
                obj.main_color_img = getMainImage(item_id)
                obj.color_img = getOtherImage(item_id)
                // 控件图片回显属性（固定格式[{url:''}]）
                obj.colorImg = obj.color_img.map((item) => {
                  return {
                    url: item,
                  }
                })
              }
            })
          } else {
            if (shop_product_image) {
              const image = shop_product_image[0]
              obj.main_color_img = image.item_image_default
              const other = image.item_image_other
              if (other) {
                obj.color_img = other.split(',')
              } else {
                obj.color_img = []
              }
              // 控件图片回显属性（固定格式[{url:''}]）
              obj.colorImg = obj.color_img.map((item) => {
                return {
                  url: item,
                }
              })
            }
          }

          spec_item_ids.sort(function (a, b) {
            return a - b;
          });
          const spec_item_ids_str = spec_item_ids.join('-');

          obj['siid'] = spec_item_ids_str

          tmpSpecData.push(obj)
          //state.specData.push(obj)
        })
      }

      console.info('===================================================')
      console.info(JSON.stringify(tmpSpecData))

      state.specData = Object.assign([], tmpSpecData)
      state.allSpecData = Object.assign([], state.specData)
    }

    const initDetail = () => {
      const productDetail = state.shop_product_info
      // 售后服务
      state.productForm.product_service = productDetail.product_service
      // 规格参数
      state.productForm.product_param = productDetail.product_param
      // 商品描述
      state.productForm.product_detail = productDetail.product_detail
    }
    const initProduct = () => {
      const productBase = state.shop_product_base
      const productIndex = state.shop_product_index
      const shopProductInfo = state.shop_product_info
      // 商品卖点
      state.productForm.product_tips = productBase.product_tips
      // 视频地址
      state.productForm.product_video = productBase.product_video
      // 运费设置id
      const transportTypeId = productBase.transport_type_id
      const transports = state.transports
      if (!transportTypeId && transports && transports.length > 0) {
        state.productForm.transport_type_id = transports[0].transport_type_id
      } else {
        state.productForm.transport_type_id = transportTypeId
      }

      // 商品状态
      state.productForm.product_state_id = productIndex.product_state_id

      // 发售日期
      state.productForm.product_sale_time = productIndex.product_sale_time

      //
      state.productForm.product_inventory_lock =
        productIndex.product_inventory_lock
      state.productForm.product_name = productIndex.product_name
      state.productForm.product_number = productIndex.product_number

      state.productForm.kind_id = productIndex.kind_id

      state.productForm.payment_type_id = productIndex.payment_type_id

      // 商品标签
      const productTags = productIndex.product_tags
      if (productTags !== 'null' && productTags) {
        state.productForm.product_tags = productTags.split(',').map(Number)
      }

      state.productForm.product_buy_limit = shopProductInfo.product_buy_limit
      // 初始化商品的品牌
      state.checkBrand = state.shop_product_index.brand_id
    }

    // 获取其它图片集合
    const getOtherImage = (color_id) => {
      const productImage = getProductImage(color_id)
      if (!productImage) return []
      const strImageOther = productImage.item_image_other
      if (strImageOther) {
        return strImageOther.split(',')
      }
      return []
    }
    // 获取主图
    const getMainImage = (color_id) => {
      const productImage = getProductImage(color_id)
      if (!productImage) return ''
      return productImage.item_image_default
    }
    // 获取图片对象
    const getProductImage = (color_id) => {
      const productImages = state.shop_product_image
      for (let i = 0; i < productImages.length; i++) {
        const colorId = productImages[i].color_id
        if (color_id === colorId) {
          return productImages[i]
        }
      }
      return null
    }
    // 根据 spec_id 和 spec_item_id 获取items
    const getSpecItemByIds = (spec_id, idsArr) => {
      const specs = state.specs
      const itemArr = []
      let items = []
      for (let i = 0; i < specs.length; i++) {
        if (specs[i].spec_id === spec_id) {
          items = specs[i].items
          break
        }
      }
      for (let i = 0; i < idsArr.length; i++) {
        for (let j = 0; j < items.length; j++) {
          const item = items[j]
          if (item.spec_item_id === idsArr[i]) {
            itemArr.push(item)
            break
          }
        }
      }
      return itemArr
    }

    const close = () => {
      state.showRichEditor = false;

      reset()

      state.dialogFormVisible = false
    }
    const reset = () => {
      state.batchObj = {
        item_is_default: false,
        item_enable: 1001,
        item_weight: undefined,
        item_market_price: undefined,
        item_unit_price: undefined,
        item_unit_points: undefined,
        item_quantity: undefined,
        item_purchase_price: undefined,
        item_purchase_rate: undefined,
        item_sales_rate: undefined,
      }
      state.productForm = {
        product_sale_time: '',
        product_video: '',
        product_buy_limit: undefined,
        product_number: '',
        kind_id: 1201,
        product_name: '',
        product_inventory_lock: 1001,
        product_state_id: 1001,
        contract_type_ids: [],
        product_transport_id: [],

        transport_type_id: undefined,
        store_category_ids: [],
        product_service: '',
        product_param: '',
        product_detail: '',
        product_id: undefined,
        product_tips: '',

        product_tags: [],
      }
      state.validForm = {
        product_valid_period: 1001,
        product_valid_type: 1001,
        product_service_date_flag: false,
        product_service_contactor_flag: true,

        product_validity_start: 0,
        product_validity_end: 0,
        product_validity_duration: "",
        product_valid_refund_flag: false,
      }
      state.specData = []
      state.checkBrand = undefined
    }

    const save = () => {
      // 校验字段
      if (!state.productForm.product_name) {
        $message('请输入商品名称！', 'error')
        return
      }

      creProductSpec()
      parColorImg()

      const assistArr = state.assistArr
      const checkBrand = state.checkBrand
      const productForm = state.productForm
      const validForm = state.validForm

      const productObj = {
        brand_id: checkBrand ? checkBrand : 0,
        assists: assistArr ? assistArr : '',
        ...productForm,
        product_spec: getProductSpec(),
        ...validForm
      }
      const specData = state.specData;
      for (let i = 0; i < specData.length; i++) {
        /*
        if (specData[i].item_market_price <= 0 || specData[i].item_unit_price <= 0 || specData[i].item_quantity <= 0) {
          $message('商品市场价、零售价或库存不能有负值或为0存在', 'warning');
          return;
        }
        */
        if (specData[i].item_unit_price == 0 ||  !specData[i].item_unit_price) {
          $message('商品零售价不能有负值或为0存在', 'warning');
          return;
        }
      }

      saveProduct(
        productObj,
        state.specData
      )
    }

    // 将colorImg 数组格式保存为color_img json格式
    const parColorImg = () => {
      // 处理列合并导致后面 color_img 数据为空
      const spData = state.specData
      if (spData.length > 2) {
        let img = spData[0].color_img
        // 有image 类型的spec时，并且被选中了
        const element = getFirstImageSpec()
        if (element) {
          // image 类型spec id
          for (let i = 1; i <= spData.length - 1; i++) {
            if (spData[i - 1][element] === spData[i][element]) {
              spData[i].color_img = img
              continue
            }
            img = spData[i].color_img
          }
        } else {
          // 没有image 类型的spec被选中
          spData.forEach((item) => {
            item.color_img = img
          })
        }
      }
    }

    const closeTableVisible = () => {
      state.specId = undefined
      state.tableVisible = false
    }

    //读取类型信息
    const getType = async (type_id) => {
      const {data} = await getTypeInfo({type_id: type_id})
      state.brands = data.brands
      state.assists = data.assists
      state.specs = data.specs

      // 维护image类型的spec
      // state.initSpecImageList()
      // // 动态添加vue 属性
      initAssistArr(state.assists)

      initCheckSpecArr(state.specs)
    }

    // 初始化vue属性 assistArr
    const initAssistArr = (assists) => {
      if (!assists) return
      assists.forEach((assist) => {
        const assist_id = assist.assist_id
        const assist_format = assist.assist_format
        if (assist_format === 'text' || assist_format === 'radio') {
          state.assistArr[assist_id] = ''
        } else {
          state.assistArr[assist_id] = []
        }
      })
    }

    // 初始化vue属性 checkSpec
    const initCheckSpecArr = (specs) => {
      // if (!specs) {
      //   // 当specs为null 时初始化specData数据（specs为null 不能触发watch 监控事件）
      //   state.creSpecData([])
      //   return
      // }
      specs.forEach((spec) => {
        const spec_id = spec.spec_id
        state.checkSpec[spec_id] = []
      })
    }
    // 获取 shop_product_index，shop_product_item，shop_product_detail，shop_product_image
    const getProductInfo = async (product_id) => {
      const {data} = await getProductDate({
        product_id: product_id,
      })

      if (data) {
        state.shop_product_base = data.product_base
        state.shop_product_index = data.product_index
        handleShopProductIndex(state.shop_product_index)
        state.shop_product_info = data.product_info

        state.shop_product_image = data.product_image

        //state.shop_product_assist_index = data.product_assist_index

        if (state.shop_product_index.kind_id === 1202) {
          state.shop_product_valid_period = data.product_valid_period
        }

        state.shop_product_item = data.product_item
      }
    }

    // 获取 shop_product_item
    const getProductItem = async (product_id) => {
      const {data} = await listItem({
        product_id: product_id,
      })

      state.shop_product_item = data
    }

    const getPayCardTypes = () => {
      // const that = this;
      // const params = {
      //   pay_type: 2
      // }
      // const {data} = getPayCardTypes(params)
      // state.paycardTypes = data
    }
    const getCouponCardTypes = () => {
      // const that = this;
      // const params = {
      //   pay_type: 3
      // }
      // const {data} = getPayCardTypes(params)
      // state.couponCardTypes = data
    }
    const getCouponsFun = () => {
      // const that = this;
      // const params = {
      //   activity_type_id: 1105,
      //   activity_type: 3
      // }
      // const {data} = getCouponsList(params);
      // state.activityArr = data
    }

    const getTransports = async () => {
      const { data } = await transportsList({size:500})
      state.transports = data.items
    }

    const getProductTags = async () => {
      const {data} = await getTags({page:1, size: maxListNum})
      state.productTags = data.items;
    }

    const saveProduct = (productObj, productItems) => {
      state['productFormRef'].validate(async (valid) => {
        if (valid) {
          state.loading = true

          //处理product_image数据
          const product_images_map = {}
          const product_images = []

          for (let i = 0; i < productItems.length; i++) {
            if (productItems[i].item_weight == '') {
              productItems[i].item_weight = 0
            }

            if (productItems[i].item_unit_points == '') {
              productItems[i].item_unit_points = 0
            }

            if (productItems[i].item_market_price == '') {
              productItems[i].item_market_price = 0
            }

            if (productItems[i].item_quantity == '') {
              productItems[i].item_quantity = 0
            }

            if (typeof product_images_map[productItems[i].color_id] == 'undefined') {
              const tmp = {
                color_id:productItems[i].color_id,
                color_name:productItems[i].color_name,
                item_image_default:productItems[i].main_color_img || '',
                item_image_other:productItems[i].color_img.join() || '',
              };

              const productImage = getProductImage(productItems[i].color_id)
              if (productImage != null && (typeof productImage.product_image_id != "undefined") ) {
                tmp["product_image_id"] = productImage.product_image_id
              }

              product_images_map[productItems[i].color_id] = productItems[i].color_id
              product_images.push(tmp)
            }
          }

          // 格式化日期
          if (productObj.product_sale_time && (typeof productObj.product_sale_time=='object')) {
            productObj.product_sale_time = productObj.product_sale_time.getTime()
          }

          if (productObj.product_validity_end && (typeof productObj.product_validity_end=='object')) {
            productObj.product_validity_end = productObj.product_validity_end.getTime()
          }

          const params = {
            ...productObj,
            product_items: JSON.stringify(productItems),
            product_images: JSON.stringify(product_images)
          }

          //params.assistsIndex = JSON.stringify(params.assistsIndex)
          //delete  params.assistsIndex

          params.product_assist = JSON.stringify(params.assists)
          delete  params.assists

          params.product_tags = params.product_tags.join()
          params.product_spec = JSON.stringify(params.product_spec)

          const {msg, status} = await doSave(params)
          state.loading = false
          if (200 == status) {
            state.dialogFormVisible = false;

            /*state.productForm.product_id = data.product_id

            //重新初始化数据
            const row = {product_id:data.product_id}
            showEdit(row);*/

            $message(msg, 'success')
            emit('fetch-data')
          } else {
            $message(msg, 'error')
          }

          //state.close()
        }
      })
    }

    const handleShopProductIndex = (shop_product_index) => {
      const storeCategoryIds = shop_product_index.store_category_ids
      if (storeCategoryIds) {
        state.productForm.store_category_ids = storeCategoryIds
          .split(',')
          .map(Number)
        console.log(state.productForm.store_category_ids)
      }

      const contractTypeIds = state.shop_product_index.contract_type_ids;
      if (contractTypeIds) {
        state.productForm.contract_type_ids = contractTypeIds
          .split(',')
          .map(Number)
      }

      const productTransportId = state.shop_product_index.product_transport_id;
      if (productTransportId) {
        state.productForm.product_transport_id = productTransportId.split(',').map((item) => Number(item))
      }

      const voucherActivityId = shop_product_index.voucher_activity_id;
      if (voucherActivityId) {
        state.productForm.voucher_activity_id = Number(voucherActivityId);
      } else {
        state.productForm.voucher_activity_id = '';
      }

      const couponTypeId = shop_product_index.coupon_type_id;
      if (couponTypeId) {
        state.productForm.coupon_type_id = couponTypeId
      } else {
        state.productForm.coupon_type_id = '';
      }

      if (shop_product_index.card_type_id != 0) {
        state.productForm.card_type_id = shop_product_index.card_type_id
      }

      state.productForm.store_id = shop_product_index.store_id
    }

    // 获取product_spec
    const getProductSpec = () => {
      const specs = Object.values(state.checkSpec).filter(
        (item) => item.length > 0
      )
      const specsArr = []
      specs.forEach((spec) => {
        const specId = spec[0].spec_id
        const sp = state.specs.find((item) => item.spec_id === specId)
        const obj = {
          id: sp.spec_id,
          name: sp.spec_name,
          item: [],
          spec_format: sp.spec_format,
        }
        spec.forEach((item) => {
          const itemObj = {
            id: item.spec_item_id,
            name: item.spec_item_name,
          }
          obj.item.push(itemObj)
        })
        specsArr.push(obj)
      })

      //重新排序
      const arr = []
      state.specs.forEach((spec) => {
        const spec_id = spec.spec_id

        specsArr.forEach((sa) => {
          const id = sa.id
          if (spec_id == id) {
            arr.push(sa);
          }
        })
      })

      return arr ? arr : ''
    }
    // 获取 item_spec
    const creProductSpec = () => {
      const head = getSpecHead()
      state.specData.forEach((row) => {
        const objs = []
        let color_id = 0
        let color_name = ''

        head.forEach((spec) => {
          const spec_id = spec.spec_id
          const specItems = spec.items
          const spec_item = specItems.find((item) => {
            const spec_item_id = item.spec_item_id
            const id = spec_id + '_' + spec_item_id
            return spec_item_id === row[id]
          })
          if (spec_item) {
            const obj = {
              id: spec_id,
              name: spec.spec_name,
              spec_format: spec.spec_format,
              item: {
                id: spec_item.spec_item_id,
                name: row[spec.spec_id],
              },
            }
            objs.push(obj)
          }

          if ("image" == spec.spec_format)
          {
            color_id = spec_item.spec_item_id
            color_name = row[spec.spec_id]
          }
        })

        const objStr = JSON.stringify(objs)
        row.item_spec = objStr

        //处理color_id 及 color_name
        row.color_id = color_id
        row.color_name = color_name
      })
    }
    // 获取选中的表头字段集合（选中的spec对象）
    const getSpecHead = () => {
      const head = Object.values(state.checkSpec)
        .filter((item) => item.length > 0)
        .map((item) => item[0].spec_id)
      const headObj = []
      state.specs.forEach((spec) => {
        head.forEach((item) => {
          if (spec.spec_id === item) {
            headObj.push(spec)
          }
        })
      })
      return headObj
    }

    /*
    watch(state, (newVal, oldVal) => {
      console.log('newVal', newVal);
      console.log('oldVal', newVal)
    })
     */

    // 分类变化
    watch(
      () => state.productForm.category_id,
      (newVal, oldVal) => {
        console.log('newVal', newVal);
        console.log('oldVal', oldVal)
      },
      {deep: true, immediate: true}
    )

    // 监控spec 勾选事件
    watch(
      () => state.checkSpec,
      (newVal, oldVal) => {
        console.log('newVal', newVal);
        console.log('oldVal', oldVal)

        const arr = []

        //重新排序
        state.specs.forEach((spec) => {
          const spec_id = spec.spec_id
          const element = newVal[spec_id]
          if (element.length > 0) arr.push(element)
        })

        /*
        for (let spec_id in newVal) {
          const element = newVal[spec_id]
          if (element.length > 0) arr.push(element)
        }
        */

        const ds = descartes(arr)
        // 构造表头数据
        creSpecHead(arr)
        // 构造表数据
        creSpecData(ds)

        // 计算合并列
        initRowspan()
      },
      {deep: true, immediate: true}
    )

    /*
    watch(
      () => state.specData,
      (newVal, oldVal) => {
        console.info("state.specData");
        console.info(state.specData);
      },
      {deep: true, immediate: true}
    )
     */

    // 获取选中的表头宽度
    const getItemWidth = (property) => {
      let width = null

      switch (property) {
        case 'main_color_img':
          width = 70
          break
        case 'color_img':
          width = null
          break
        case 'item_barcode':
          width = 120
          break
        case 'item_weight':
        case 'item_market_price':
        case 'item_unit_price':
        case 'item_unit_points':
        case 'item_quantity':
          width = 100
          break
        case 'item_enable':
        case 'item_is_default':
          width = 90
          break
        default:
          width = 120
          break
      }

      return width
    }

    const batOper = (e) => {
      const key = e.target.dataset.key;
      let title = "";
      if (key == "item_market_price") {
        title =  t('批量设置市场价');
      } else if (key == "item_unit_price") {
        title =  t('批量设置价格');
      } else if (key == "item_unit_points") {
        title =  t('批量设置积分');
      } else if (key == "item_quantity") {
        title =  t('批量设置库存');
      } else if (key == "item_weight") {
        title =  t('批量设置重量');
      }

      ElMessageBox.prompt(title, {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
      })
        .then(({ value }) => {
          if (value) {
            state.specData.forEach((item, index) => {
              state.specData[index][key] = Number(value) || ''
            })
          }
        })
        .catch(() => {})
    }

    const getVideoUrl = (files) => {
      state.productForm.product_video = files[files.length-1]
    }

    const itemRefRules = reactive({
      spec_item_name: [{required: true, trigger: 'blur', message: t('请填写规格值名称')}],
    })

    onMounted(() => {
      // 读取分类数据
      getCategoryData()

      // 获取商品标签
      getProductTags()

      // 获取物流
      getTransports()
    })

    return {
      t: t,
      configs: settingsStore.getConfigs,
      ...toRefs(state),
      showEdit,
      close,
      itemRefRules,
      reset,
      onChangeKinds,
      onChangeKindsTypeId,
      onChangeKindsVAId,
      batchHandle,
      batchInput,
      initRowspan,
      getFirstImageSpec,
      handleInput,
      initSpecImageList,
      saveSpecItem,
      upDateSpecItem,
      detSpecItem,
      closeEditSpecItem,
      showEditSpecItem,
      editSpecItem,
      showTable,
      getSpecItemList,
      spanMethod,
      onChangeKind,
      showProperty,
      handleAvatarSuccess,
      handleSuccess,
      creSpecHead,
      getProductAssistsIndex,
      creSpecData,
      resetData,
      descartes,
      initData,
      initAssists,
      initSpec,
      initTableHead,
      initItems,
      initDetail,
      initProduct,
      getOtherImage,
      getMainImage,
      getProductImage,
      getSpecItemByIds,
      save,
      parColorImg,
      closeTableVisible,
      getType,
      initAssistArr,
      initCheckSpecArr,
      getProductInfo,
      getProductItem,
      getPayCardTypes,
      getCouponCardTypes,
      getCouponsFun,
      getTransports,
      getProductTags,
      saveProduct,
      handleShopProductIndex,
      getProductSpec,
      creProductSpec,
      getSpecHead,
      getItemWidth,
      batOper,
      getVideoUrl,
      CirclePlus, Fold, Plus
    }
  },

  watch: {},
  created() {
    // 获取快递类型
    //this.getTransports()
    // 获取次卡数据
    //this.getPayCardTypes()
    // 获取代金券数据
    //this.getCouponsFun()
    // 获取券码数据
    //this.getCouponCardTypes()
  },
})
</script>
<style lang="scss">
.el-input__wrapper {
  width: 100%;
}

.tit_font {
  font-size: 21px;
  line-height: inherit;
  color: #333;
}

.add-product-upload .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.add-product-upload .el-upload:hover {
  border-color: #409eff;
}

#main-uploader-icon {
  font-size: 14px;
  color: #8c939d;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}

#add-product-color-upload .el-upload--picture-card {
  font-size: 14px;
  color: #8c939d;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}

#add-product-color-upload .el-upload-list--picture-card .el-upload-list__item,
#add-product-color-upload .el-upload-list__item-actions {
  width: 50px;
  height: 50px;
}

#img-avatar {
  font-size: 14px;
  color: #8c939d;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}

#main-avatar {
  width: 50px;
  height: 50px;
  display: block;
}

.quill {
  padding-bottom: 50px;
}
.spec-btn .el-button .el-icon{font-size: 16px !important;margin-top: -5px;}
</style>
