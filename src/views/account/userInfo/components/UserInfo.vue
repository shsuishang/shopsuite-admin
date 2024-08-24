<template>
  <el-drawer
    v-model="dialogFormVisible"
    size="1200"
    :title="topTitle"
    top="3%"
    :with-header="true"
    @close="close"
  >

    <div style="width: 1150px;color: black">
      <el-divider/>
      <div style="display: flex">
        <div>
          <el-image
            :preview-src-list="[data.user_avatar]"
            preview-teleported
            :src="data.user_avatar"
            style="width: 80px; height: 80px;border-radius: 50%;"
          />
        </div>
        <div style="margin-left: 20px;width: 1200px">
          <el-row>
            <el-col :span="20">
              <div>
                {{ data.user_nickname }}
              </div>
            </el-col>
            <el-col :span="2">
              <el-button
v-permissions="{ permission: ['/manage/account/userInfo/edit'] }" type="primary"
                         @click="handleEdit(data)">{{ t('编辑') }}
              </el-button>
            </el-col>
            <el-col :span="2">
              <el-button
v-permissions="{ permission: ['/manage/account/userInfo/remove'] }" type="danger"
                         @click="handleDelete(data)">{{ t('删除') }}
              </el-button>
            </el-col>
          </el-row>
          <div style="margin-top: 20px">
            <el-row>
              <el-col :span="6">
                <div>{{ t('余额') }}：{{ data.user_money }}</div>
              </el-col>
              <el-col :span="6">
                <div>{{ t('总计订单') }}：{{ data.total_order }}</div>
              </el-col>
              <el-col :span="6">
                <div>{{ t('总消费金额') }}：{{ data.total_trade }}</div>
              </el-col>
              <el-col :span="6">
                <div>{{ t('累计佣金') }}：{{ data.user_commission_now }}</div>
              </el-col>
            </el-row>
          </div>
          <div style="margin-top: 10px">
            <el-row>
              <el-col :span="6">
                <div>{{ t('积分') }}：{{ data.user_points }}</div>
              </el-col>
              <el-col :span="6">
                <div>{{ t('本月订单') }}：{{ data.month_order }}</div>
              </el-col>
              <el-col :span="6">
                <div>{{ t('本月消费金额') }}：{{ data.month_trade }}</div>
              </el-col>
              <el-col :span="6">
                <div>{{ t('本月佣金') }}：{{ data.month_commission_buy }}</div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div style="margin-top: 20px">
        <el-tabs v-model="activeName" style="margin-right: 10px" @tab-click="handleClick">
          <el-tab-pane label="用户信息" name="1">
            <div style="margin-top: 20px;margin-bottom: 30px">
              <div class="left-line"></div>
              <span style="font-size: 16px">{{ t('基本信息') }}</span>
              <div style="margin-top: 20px">
                <el-row>
                  <el-col :span="8">
                    <div>{{ t('用户账号') }}：{{ data.user_account }}</div>
                  </el-col>
                  <el-col :span="8">
                    <div>{{ t('手机号码') }}：{{ data.user_intl }} {{ data.user_mobile }}</div>
                  </el-col>
                  <el-col :span="8">
                    <div>{{ t('用户邮箱') }}：{{ data.user_email }}</div>
                  </el-col>
                </el-row>
              </div>
              <div style="margin-top: 20px">
                <el-row>
                  <el-col :span="8">
                    <div>{{ t('生日') }}：{{ data.user_birthday }}</div>
                  </el-col>
                  <el-col :span="8">
                    <div>{{ t('性别') }}：
                      <span :type='(["0","1","2"])[data.user_gender]'>
                        {{ ([t('保密'), t('男'), t('女')])[data.user_gender] }}
                      </span>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div>{{ t('用户地址') }}：{{ data.ud_address }}</div>
                  </el-col>
                </el-row>
              </div>
            </div>
            <el-divider/>
            <div style="margin-top: 20px;margin-bottom: 30px">
              <div class="left-line"></div>
              <span style="font-size: 16px">{{ t('实名信息') }}</span>
              <div v-if="data.user_is_authentication == 1" style="float: right">
                <el-button
size="small" type="success"
                           @click="authenticationState({user_id: data.user_id, user_is_authentication: 2})">{{
                    t('认证通过')
                  }}
                </el-button>
                <el-button
size="small" type="danger"
                           @click="authenticationState({user_id: data.user_id, user_is_authentication: 3})">{{
                    t('认证失败')
                  }}
                </el-button>
              </div>
              <div style="margin-top: 20px">
                <el-row>
                  <el-col :span="8">
                    <div>{{ t('真实姓名') }}：{{ data.user_realname }}</div>
                  </el-col>
                  <el-col :span="8">
                    <div>{{ t('认证状态') }}：
                      <span :type='(["0","1","2","3"])[data.user_is_authentication]'>
                        {{ ([t('未认证'), t('待审核'), t('认证通过'), t('认证失败')])[data.user_is_authentication] }}
                      </span>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <el-image
                      v-for="(image, index) in data.user_idcard_image_list"
                      :key="index"
                      :preview-src-list="data.user_idcard_image_list"
                      preview-teleported
                      :src="image"
                      style="width: 100px; height: 70px;margin-right: 10px"
                    />
                    <div style="font-size: 12px">{{ t('注：身份证正反面图片，点击预览。') }}</div>
                  </el-col>
                </el-row>
              </div>
            </div>
            <el-divider/>
            <div style="margin-top: 20px;margin-bottom: 30px">
              <div class="left-line"></div>
              <span style="font-size: 16px">{{ t('密码') }}</span>
              <div style="margin-top: 20px">
                {{ t('登录密码') }}：******
              </div>
            </div>
            <el-divider/>
            <div style="margin-top: 20px;margin-bottom: 30px">
              <div class="left-line"></div>
              <span style="font-size: 16px">{{ t('用户概况') }}</span>
              <div style="margin-top: 20px">
                <el-row>
                  <el-col :span="8">
                    <div>{{ t('用户状态') }}：
                      <span :type='(["0","1","2"])[data.user_state]'>
                        {{ ([t('锁定'), t('已激活'), t('未激活')])[data.user_state] }}
                      </span>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div>{{ t('用户等级') }}：{{ data.user_level_name }}</div>
                  </el-col>
                  <el-col :span="8">
                    <div>{{ t('推广资格') }}：</div>
                  </el-col>
                </el-row>
              </div>
              <div style="margin-top: 20px">
                <el-row>
                  <el-col :span="8">
                    <div>{{ t('用户标签') }}：{{ data.tag_titles }}</div>
                  </el-col>
                  <el-col :span="8">
                    <div>{{ t('用户分组') }}：{{ data.tag_group_names }}</div>
                  </el-col>
                  <el-col :span="8">
                    <div>{{ t('推广人编号') }}：{{ data.user_parent_id }}</div>
                  </el-col>
                </el-row>
              </div>
              <div style="margin-top: 20px">
                <el-row>
                  <el-col :span="8">
                    <div>{{ t('注册时间') }}：{{ data.user_reg_time }}</div>
                  </el-col>
                  <el-col :span="8">
                    <div>{{ t('登录时间') }}：{{ data.user_login_time }}</div>
                  </el-col>
                </el-row>
              </div>
            </div>
            <el-divider/>
            <div style="margin-top: 20px;margin-bottom: 30px">
              <div class="left-line"></div>
              <span style="font-size: 16px">{{ t('用户备注') }}</span>
              <div style="margin-top: 20px">
                {{ t('备注') }}：
              </div>
            </div>
            <el-divider/>

          </el-tab-pane>
          <el-tab-pane v-if="getPermission.includes('/manage/pay/consumeTrade/list')" label="交易订单" name="2">
            <el-table
              v-loading="consumeTradeLoading"
              border
              :data="consumeTradeData"
              :height="height"
            >
              <el-table-column
                align="center"
                fixed="left"
                :label="t('交易订单')"
                prop="consume_trade_id"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('标题')"
                prop="trade_title"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('商户订单')"
                prop="order_id"
                show-overflow-tooltip
                width="140"
              />
              <el-table-column
                v-if="false"
                align="center"
                :label="t('买家编号')"
                prop="buyer_id"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                v-if="false"
                align="center"
                :label="t('买家店铺')"
                prop="buyer_store_id"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                v-if="false"
                align="center"
                :label="t('店铺编号')"
                prop="store_id"
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
                :label="t('卖家编号')"
                prop="seller_id"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                v-if="false"
                align="center"
                :label="t('门店编号')"
                prop="chain_id"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('支付状态')"
                prop="trade_is_paid"
                show-overflow-tooltip
                width="100"
              >
                <template #default="{ row }">
                  <el-tag
                    :type='({"3013":"success","3012":"warning","3011":"info","3010":"danger"})[row.trade_is_paid]'>
                    {{
                      ({"3013": t('已付款'), "3012": t('部分付款'), "3011": t('待付款审核'), "3010": t('未付款')})[row.trade_is_paid]
                    }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="t('交易类型')"
                prop="trade_type_id"
                show-overflow-tooltip
                width="100"
              >
                <template #default="{ row }">
                  <el-tag
                    :type='({"1201":"","1202":"success","1203":"warning","1204":"info","1205":"danger","1206":null})[row.trade_type_id]'>
                    {{
                      ({
                        "1201": t('购物'),
                        "1202": t('转账'),
                        "1203": t('充值'),
                        "1204": t('提现'),
                        "1205": t('销售'),
                        "1206": t('佣金')
                      })[row.trade_type_id]
                    }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="t('支付渠道')"
                prop="payment_channel_id"
                show-overflow-tooltip
                width="100"
              >
                <template #default="{ row }">
                  <div v-for="(item, index) in paymentChannelList" :key="index">
                    <el-tag v-if="item.value == row.payment_channel_id">
                      {{ item.label }}
                    </el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="t('交易模式')"
                prop="trade_mode_id"
                show-overflow-tooltip
                width="100"
              >
                <template #default="{ row }">
                  <el-tag :type='({"1":"","2":"success"})[row.trade_mode_id]'>
                    {{ ({"1": t('担保交易'), "2": t('直接交易')})[row.trade_mode_id] }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="t('充值编号')"
                prop="recharge_level_id"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                v-if="false"
                align="center"
                :label="t('货币编号')"
                prop="currency_id"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                v-if="false"
                align="center"
                :label="t('左符号')"
                prop="currency_symbol_left"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('总付款额度')"
                prop="order_payment_amount"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('平台交易佣金')"
                prop="order_commission_fee"
                show-overflow-tooltip
                width="120"
              />
              <el-table-column
                align="center"
                :label="t('实付金额')"
                prop="trade_payment_amount"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('余额支付')"
                prop="trade_payment_money"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('充值卡余额')"
                prop="trade_payment_recharge_card"
                show-overflow-tooltip
                width="120"
              />
              <el-table-column
                align="center"
                :label="t('积分支付')"
                prop="trade_payment_points"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                v-if="false"
                align="center"
                :label="t('众宝支付')"
                prop="trade_payment_sp"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                v-if="false"
                align="center"
                :label="t('信用支付')"
                prop="trade_payment_credit"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                v-if="false"
                align="center"
                :label="t('红包支付')"
                prop="trade_payment_redpack"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('折扣优惠')"
                prop="trade_discount"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                v-if="false"
                align="center"
                :label="t('总额虚拟')"
                prop="trade_amount"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('描述')"
                prop="trade_desc"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('备注')"
                prop="trade_remark"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :formatter="formatDateTime"
                :label="t('创建时间')"
                prop="trade_create_time"
                show-overflow-tooltip
                width="160"
              />
              <el-table-column
                align="center"
                :formatter="formatDateTime"
                :label="t('付款时间')"
                prop="trade_paid_time"
                show-overflow-tooltip
                width="160"
              />
              <el-table-column
                align="center"
                :label="t('是否删除')"
                prop="trade_delete"
                show-overflow-tooltip
                width="100"
              >
                <template #default="{ row }">
                  <el-tag :type='(["info","success"])[row.trade_delete ? 1 : 0]'>
                    {{ ([t('否'), t('是')])[row.trade_delete ? 1 : 0] }}
                  </el-tag>
                </template>
              </el-table-column>
              <template #empty>
                <el-empty class="ms-data-empty" :description="t('暂无数据')"/>
              </template>
            </el-table>
            <el-pagination
              background
              :current-page="consumeTradeForm.page"
              :layout="layout"
              :page-size="consumeTradeForm.size"
              :total="consumeTradeTotal"
              @current-change="consumeTradeChange"
              @size-change="consumeTradeSize"
            />

          </el-tab-pane>
          <el-tab-pane v-if="getPermission.includes('/manage/pay/userPointsHistory/list')" label="积分明细" name="3">
            <el-table
              v-loading="pointLoading"
              border
              :data="pointHistoryData"
              :height="height"
            >
              <el-table-column
                align="center"
                :label="t('类型')"
                prop="points_kind_id"
                show-overflow-tooltip
                width="100"
              >
                <template #default="{ row }">
                  <el-tag :type='({"1":"","2":"success"})[row.points_kind_id]'>
                    {{ ({"1": t('获取积分'), "2": t('消费积分')})[row.points_kind_id] }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="t('积分类型')"
                prop="points_type_id"
                show-overflow-tooltip
                width="100"
              >
                <template #default="{ row }">
                  <el-tag :type='({"1":"danger","2":"success","3":"warning","4":"info","5":"danger","6":"danger","7":"success","8":"warning","9":"warning","10":"warning","11":"warning","12":"info","14":"info","15":"info","21":"info"})[row.points_type_id]'>
                    {{
                    ({
                    "1":t('会员注册'),
                    "2":t('会员登录'),
                    "3":t('商品评论'),
                    "4":t('购买商品'),
                    "5":t('管理员操作'),
                    "6":t('店铺评论'),
                    "7":t('积分换购商品'),
                    "8":t('积分兑换代金券'),
                    "9":t('积分兑换'),
                    "10":t('积分转出'),
                    "11":t('积分转入'),
                    "12":t('积分退还'),
                    "14":t('升级商家'),
                    "15":t('发展粉丝赠送'),
                    "21":t('购买商品抵扣')
                    })[row.points_type_id] }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="t('会员编号')"
                prop="user_id"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('积分变动值')"
                prop="points_log_points"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('当前积分')"
                prop="user_points"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :formatter="formatDateTime"
                :label="t('创建时间')"
                prop="points_log_time"
                show-overflow-tooltip
                width="160"
              />
              <el-table-column
                align="center"
                :label="t('描述')"
                prop="points_log_desc"
                show-overflow-tooltip
                width="100"
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
                align="center"
                :formatter="formatDate"
                :label="t('积分日期')"
                prop="points_log_date"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('交互会员')"
                prop="user_id_other"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('领取状态')"
                prop="points_log_state"
                show-overflow-tooltip
                width="100"
              >
                <template #default="{ row }">
                  <el-tag :type='(["info","success"])[row.points_log_state ? 1 : 0]'>
                    {{ ([t('未领取'), t('已领取')])[row.points_log_state ? 1 : 0] }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="t('关联单号')"
                prop="ext_id"
                show-overflow-tooltip
                width="100"
              />
              <template #empty>
                <el-empty class="ms-data-empty" :description="t('暂无数据')"/>
              </template>
            </el-table>
            <el-pagination
              background
              :current-page="pointForm.page"
              :layout="layout"
              :page-size="pointForm.size"
              :total="pointHistoryTotal"
              @current-change="pointHistoryChange"
              @size-change="pointHistorySize"
            />

          </el-tab-pane>
          <el-tab-pane v-if="getPermission.includes('/manage/pay/userPointsHistory/list')" label="签到记录" name="4">
            <el-table
              v-loading="signInfoLoading"
              border
              :data="signInfoData"
              :height="height"
            >
              <el-table-column
                align="center"
                :label="t('类型')"
                prop="points_kind_id"
                show-overflow-tooltip
                width="100"
              >
                <template #default="{ row }">
                  <el-tag :type='({"1":"","2":"success"})[row.points_kind_id]'>
                    {{ ({"1": t('获取积分'), "2": t('消费积分')})[row.points_kind_id] }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="t('会员编号')"
                prop="user_id"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('积分变动值')"
                prop="points_log_points"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('当前积分')"
                prop="user_points"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :formatter="formatDateTime"
                :label="t('签到时间')"
                prop="points_log_time"
                show-overflow-tooltip
                width="160"
              />
              <el-table-column
                align="center"
                :label="t('描述')"
                prop="points_log_desc"
                show-overflow-tooltip
                width="380"
              />
              <el-table-column
                align="center"
                :formatter="formatDate"
                :label="t('积分日期')"
                prop="points_log_date"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('领取状态')"
                prop="points_log_state"
                show-overflow-tooltip
                width="100"
              >
                <template #default="{ row }">
                  <el-tag :type='(["info","success"])[row.points_log_state ? 1 : 0]'>
                    {{ ([t('未领取'), t('已领取')])[row.points_log_state ? 1 : 0] }}
                  </el-tag>
                </template>
              </el-table-column>
              <template #empty>
                <el-empty class="ms-data-empty" :description="t('暂无数据')"/>
              </template>
            </el-table>
            <el-pagination
              background
              :current-page="signInfoForm.page"
              :layout="layout"
              :page-size="signInfoForm.size"
              :total="signInfoTotal"
              @current-change="signInfoChange"
              @size-change="signInfoSize"
            />
          </el-tab-pane>
          <el-tab-pane v-if="getPermission.includes('/manage/shop/userVoucher/list')" label="持有优惠券" name="5">
            <el-table
              v-loading="voucherLoading"
              border
              :data="voucherData"
              :height="height"
            >
              <el-table-column
                align="center"
                :label="t('代金券名称')"
                prop="activity_name"
                show-overflow-tooltip
                width="110"
              />
              <el-table-column
                align="center"
                :label="t('代金券状态')"
                prop="voucher_state_id"
                show-overflow-tooltip
                width="110"
              >
                <template #default="{ row }">
                  <el-tag :type='({"1501":"","1502":"success","1503":"warning","1504":"info"})[row.voucher_state_id]'>
                    {{ ({"1501": t('未用'), "1502": t('已用'), "1503": t('过期'), "1504": t('收回')})[row.voucher_state_id] }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :formatter="formatDateTime"
                :label="t('代金券发放日期')"
                prop="user_voucher_time"
                show-overflow-tooltip
                width="160"
              />
              <el-table-column
                align="center"
                :label="t('可抵扣价格')"
                prop="voucher_price"
                show-overflow-tooltip
                width="110"
              />
              <el-table-column
                align="center"
                :label="t('可使用优惠券的订单金额')"
                prop="voucher_subtotal"
                show-overflow-tooltip
                width="180"
              />
              <el-table-column
                align="center"
                :formatter="formatDateTime"
                :label="t('生效时间')"
                prop="voucher_start_date"
                show-overflow-tooltip
                width="160"
              />
              <el-table-column
                align="center"
                :formatter="formatDateTime"
                :label="t('失效时间')"
                prop="voucher_end_date"
                show-overflow-tooltip
                width="160"
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
                align="center"
                :label="t('优惠券类型')"
                prop="voucher_type"
                show-overflow-tooltip
                width="110"
              >
                <template #default="{ row }">
                  <el-tag :type='(["success","success"])[row.voucher_type]'>
                    {{ ([t('普通优惠券'), t('免拼券')])[row.voucher_type] }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="t('订单编号')"
                prop="order_id"
                show-overflow-tooltip
                width="130"
              />
              <template #empty>
                <el-empty class="ms-data-empty" :description="t('暂无数据')"/>
              </template>
            </el-table>
            <el-pagination
              background
              :current-page="voucherForm.page"
              :layout="layout"
              :page-size="voucherForm.size"
              :total="voucherTotal"
              @current-change="voucherChange"
              @size-change="voucherSize"
            />

          </el-tab-pane>
          <el-tab-pane v-if="getPermission.includes('/manage/pay/consumeRecord/list')" label="余额变动" name="6">
            <el-table
              v-loading="consumeRecordLoading"
              border
              :data="consumeRecordData"
              :height="height"
            >
              <el-table-column
                align="center"
                fixed="left"
                :label="t('支付流水号')"
                prop="consume_record_id"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('商户订单编号')"
                prop="order_id"
                show-overflow-tooltip
                width="140"
              />
              <el-table-column
                align="center"
                :label="t('用户编号')"
                prop="user_id"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('昵称')"
                prop="user_nickname"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                v-if="false"
                align="center"
                :label="t('货币编号')"
                prop="currency_id"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                v-if="false"
                align="center"
                :label="t('左符号')"
                prop="currency_symbol_left"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('总额')"
                prop="record_total"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('金额')"
                prop="record_money"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('佣金')"
                prop="record_commission_fee"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('分销佣金')"
                prop="record_distribution_commission_fee"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :formatter="formatDate"
                :label="t('日期')"
                prop="record_date"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('标题')"
                prop="record_title"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('描述')"
                prop="record_desc"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :formatter="formatDateTime "
                :label="t('支付时间')"
                prop="record_time"
                show-overflow-tooltip
                width="160"
              />
              <el-table-column
                align="center"
                :label="t('交易类型')"
                prop="trade_type_id"
                show-overflow-tooltip
                width="100"
              >
                <template #default="{ row }">
                  <el-tag
                    :type='({"1201":"","1202":"success","1203":"warning","1204":"info","1205":"danger","1206":"","1207":"","1208":"","1209":""})[row.trade_type_id]'>
                    {{
                      ({
                        "1201": t('购物'),
                        "1202": t('转账'),
                        "1203": t('充值'),
                        "1204": t('提现'),
                        "1205": t('销售'),
                        "1206": t('佣金'),
                        "1207": t('退货付款'),
                        "1208": t('退货收款'),
                        "1209": t('转账收款')
                      })[row.trade_type_id]
                    }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="t('支付方式')"
                prop="payment_type_id"
                show-overflow-tooltip
                width="100"
              >
                <template #default="{ row }">
                  <el-tag
                    :type='({"1301":"info","1302":"success","1303":"success","1304":"success","1305":"success"})[row.payment_type_id]'>
                    {{
                      ({
                        "1301": t('货到付款'),
                        "1302": t('在线支付'),
                        "1303": t('白条支付'),
                        "1304": t('现金支付'),
                        "1305": t('线下支付')
                      })[row.payment_type_id]
                    }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="t('支付渠道')"
                prop="payment_channel_id"
                show-overflow-tooltip
                width="100"
              >
                <template #default="{ row }">
                  <div v-for="(item, index) in paymentChannelList" :key="index">
                    <el-tag v-if="item.value == row.payment_channel_id">
                      {{ item.label }}
                    </el-tag>
                  </div>
                </template>
              </el-table-column>
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
                :label="t('所属门店')"
                prop="chain_id"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('消费类型')"
                prop="payment_met_id"
                show-overflow-tooltip
                width="100"
              >
                <template #default="{ row }">
                  <el-tag
                    :type='({"1":"success","2":"success","3":"success","4":"success","5":"success"})[row.payment_met_id]'>
                    {{
                      ({
                        "1": t('余额支付'),
                        "2": t('充值卡支付'),
                        "3": t('积分支付'),
                        "4": t('信用支付'),
                        "5": t('红包支付')
                      })[row.payment_met_id]
                    }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="t('状态')"
                prop="record_enable"
                show-overflow-tooltip
                width="100"
              >
                <template #default="{ row }">
                  <el-tag :type='({"1":"success","0":"info"})[row.record_enable ? 1 : 0]'>
                    {{ ({"1": t('已收款'), "0": t('作废')})[row.record_enable ? 1 : 0] }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                v-if="false"
                align="center"
                :label="t('所属分站')"
                prop="subsite_id"
                show-overflow-tooltip
                width="100"
              />
              <template #empty>
                <el-empty class="ms-data-empty" :description="t('暂无数据')"/>
              </template>
            </el-table>
            <el-pagination
              background
              :current-page="consumeRecordForm.page"
              :layout="layout"
              :page-size="consumeRecordForm.size"
              :total="consumeRecordTotal"
              @current-change="consumeRecordChange"
              @size-change="consumeRecordSize"
            />
          </el-tab-pane>
          <el-tab-pane label="用户绑定" name="7">
            <el-table
              v-loading="bindConnectLoading"
              border
              :data="bindConnectData"
              :height="height"
            >
              <el-table-column
                align="center"
                fixed="left"
                :label="t('绑定标记')"
                prop="bind_id"
                show-overflow-tooltip
                width="200"
              />
              <el-table-column
                align="center"
                :label="t('绑定类型')"
                prop="bind_type"
                show-overflow-tooltip
                width="100"
              >
                <template #default="{ row }">
                  <el-tag :type='({"1":"info","2":"info","13":"info"})[row.bind_type]'>
                    {{ ({"1": t('手机号'), "2": t('邮箱'), "3": t('账号注册'), "13": t('公众号'), "15": t('小程序')})[row.bind_type] }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :formatter="formatDateTime"
                :label="t('绑定时间')"
                prop="bind_time"
                show-overflow-tooltip
                width="160"
              />
              <el-table-column
                align="center"
                :label="t('用户名称')"
                prop="bind_nickname"
                show-overflow-tooltip
                width="100"
              />
              <el-table-column
                align="center"
                :label="t('用户图标')"
                prop="bind_icon"
                show-overflow-tooltip
                width="100"
              >
                <template #default="{ row }">
                  <el-image
                    v-if="row.bind_icon"
                    :preview-src-list="[row.bind_icon]"
                    preview-teleported
                    :src="row.bind_icon"
                    style="width: 50px; height: 50px"
                  />
                  <span v-else>{{ t('暂无数据') }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="t('是否激活')"
                prop="bind_active"
                show-overflow-tooltip
                width="100"
              >
                <template #default="{ row }">
                  <el-tag :type='(["info","success"])[row.bind_active ? 1 : 0]'>
                    {{ ([t('未激活'), t('激活')])[row.bind_active ? 1 : 0] }}
                  </el-tag>
                </template>
              </el-table-column>
              <template #empty>
                <el-empty class="ms-data-empty" :description="t('暂无数据')"/>
              </template>
            </el-table>
            <el-pagination
              background
              :current-page="bindConnectForm.page"
              :layout="layout"
              :page-size="bindConnectForm.size"
              :total="bindConnectTotal"
              @current-change="consumeRecordChange"
              @size-change="consumeRecordSize"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <edit ref="editRef" @fetch-info="close"/>
  </el-drawer>
</template>

<script>
import {translate as t} from '@/i18n'
import {doRemove, getUserData, editState} from '@/api/account/userInfo'
import {getList as getBindConnectList} from '@/api/account/userBindConnect'
import Edit from './UserInfoEdit'
import {formatDateOneTime, formatDateOne, formatDateTime, formatDate} from "@/utils/format";
import {getList as getPointHistoryList} from '@/api/pay/userPointsHistory'
import {getList as getConsumeRecordList} from "@/api/pay/consumeRecord";
import {getList as getConsumeTradeList} from "@/api/pay/consumeTrade";
import {getList as getVoucherList} from '@/api/shop/userVoucher';
import {useSettingsStore} from "@/store/modules/settings";
import {useAclStore} from "@/store/modules/acl";

export default defineComponent({
  name: 'UserInfo',
  components: {Edit},
  props: {},
  emits: ['fetch-data'],
  setup(props, {emit}) {
    const $confirm = inject('$confirm')
    const $message = inject('$message')
    const settingsStore = useSettingsStore()
    const {getPermission} = useAclStore()

    const state = reactive({
      data: '',
      editRef: null,
      activeName: '1',
      topTitle: '用户详情',
      dialogFormVisible: false,
      user_id: '',
      layout: 'total, sizes, prev, pager, next, jumper',
      paymentChannelList: settingsStore.getConfigs.payment_channel_list,

      pointLoading: false,
      pointHistoryData: [],
      pointForm: {
        page: 1,
        size: 10,
        user_id: '',
      },
      pointHistoryTotal: 0,

      signInfoLoading: false,
      signInfoData: [],
      signInfoForm: {
        page: 1,
        size: 10,
        user_id: '',
        points_type_id: 2,
      },
      signInfoTotal: 0,

      consumeRecordLoading: false,
      consumeRecordData: [],
      consumeRecordForm: {
        page: 1,
        size: 10,
        user_id: '',
      },
      consumeRecordTotal: 0,

      bindConnectLoading: false,
      bindConnectData: [],
      bindConnectForm: {
        page: 1,
        size: 10,
        user_id: '',
      },
      bindConnectTotal: 0,

      consumeTradeLoading: false,
      consumeTradeData: [],
      consumeTradeForm: {
        page: 1,
        size: 10,
        buyer_id: '',
      },
      consumeTradeTotal: 0,

      voucherLoading: false,
      voucherData: [],
      voucherForm: {
        page: 1,
        size: 10,
        user_id: '',
      },
      voucherTotal: 0,


    })

    const showInfo = async (row) => {

      const {data} = await getUserData({user_id: row.user_id})
      state.data = Object.assign({}, data)
      if (state.data.user_birthday) {
        state.data.user_birthday = formatDateOne(new Date(state.data.user_birthday))
      }
      if (state.data.user_reg_time) {
        state.data.user_reg_time = formatDateOneTime(new Date(state.data.user_reg_time))
      }
      if (state.data.user_lastlogin_time) {
        state.data.user_lastlogin_time = formatDateOneTime(new Date(state.data.user_lastlogin_time))
      }
      if (state.data.user_login_time) {
        state.data.user_login_time = formatDateOneTime(new Date(state.data.user_login_time))
      }
      if (state.data.user_commission_now) {
        state.data.user_commission_now = state.data.user_commission_now.toFixed(2)
      }

      if (state.data.month_commission_buy) {
        state.data.month_commission_buy = state.data.month_commission_buy.toFixed(2)
      }
      state.user_id = row.user_id
      state.dialogFormVisible = true
    }

    const handleEdit = (row) => {
      if (row && row.user_id) {
        state.editRef.showEdit(row)
      } else {
        state.editRef.showEdit()
      }
    }

    const handleDelete = (row) => {
      if (row.user_id) {
        $confirm(t('你确定要删除吗'), null, async () => {
          const {msg, status} = await doRemove({user_id: row.user_id})

          if (200 == status) {
            $message(msg, 'success')
          } else {
            $message(msg, 'error')
          }

          await close()
        })
      }
    }

    const close = () => {
      state.dialogFormVisible = false
      emit('fetch-data')
    }

    const authenticationState = async (row) => {
      console.info(row)
      const {msg, status} = await editState(row)

      if (200 == status) {
        $message(msg, 'success')
      } else {
        $message(msg, 'error')
      }

      close()
    }

    // tab 切换事件
    const handleClick = async () => {
      // switch (state.activeName) {
      //   case '3':
      //     await pointHistoryList()
      //     break
      //   case '1':
      //     //await getOrderStock()
      //     break
      //   case '2':
      //     //await orderRecord()
      //     break
      // }
    }

    //积分明细
    const pointHistoryList = async () => {
      state.pointForm.user_id = state.user_id
      state.pointLoading = true
      const {
        data: {items, records},
      } = await getPointHistoryList(state.pointForm)
      state.pointHistoryData = items
      state.pointHistoryTotal = records
      state.pointLoading = false
    }

    const pointHistoryChange = (val) => {
      state.pointForm.page = val
      pointHistoryList()
    }

    const pointHistorySize = (val) => {
      state.pointForm.size = val
      pointHistoryList()
    }

    //签到记录
    const signInfoList = async () => {
      state.signInfoForm.user_id = state.user_id
      state.signInfoLoading = true
      const {
        data: {items, records},
      } = await getPointHistoryList(state.signInfoForm)
      state.signInfoData = items
      state.signInfoTotal = records
      state.signInfoLoading = false
    }

    const signInfoChange = (val) => {
      state.signInfoForm.page = val
      signInfoList()
    }

    const signInfoSize = (val) => {
      state.signInfoForm.size = val
      signInfoList()
    }

    //余额变动
    const consumeRecordList = async () => {
      state.consumeRecordForm.user_id = state.user_id
      state.consumeRecordLoading = true

      const {
        data: {items, records},
      } = await getConsumeRecordList(state.consumeRecordForm)
      state.consumeRecordData = items
      state.consumeRecordTotal = records
      state.consumeRecordLoading = false
    }

    const consumeRecordChange = (val) => {
      state.consumeRecordForm.page = val
      consumeRecordList()
    }

    const consumeRecordSize = (val) => {
      state.consumeRecordForm.size = val
      consumeRecordList()
    }

    //用户绑定
    const bindConnectChange = (val) => {
      state.bindConnectForm.page = val
      bindConnectList()
    }

    const bindConnectSize = (val) => {
      state.bindConnectForm.size = val
      bindConnectList()
    }

    const bindConnectList = async () => {
      state.bindConnectForm.user_id = state.user_id
      state.bindConnectLoading = true

      const {
        data: {items, records},
      } = await getBindConnectList(state.bindConnectForm)
      state.bindConnectData = items
      state.bindConnectTotal = records
      state.bindConnectLoading = false
    }

    //交易订单
    const consumeTradeList = async () => {
      state.consumeTradeForm.buyer_id = state.user_id
      state.consumeTradeLoading = true

      const {
        data: {items, records},
      } = await getConsumeTradeList(state.consumeTradeForm)
      state.consumeTradeData = items
      state.consumeTradeTotal = records
      state.consumeTradeLoading = false
    }

    const consumeTradeChange = (val) => {
      state.consumeTradeForm.page = val
      consumeTradeList()
    }

    const consumeTradeSize = (val) => {
      state.consumeTradeForm.size = val
      consumeTradeList()
    }

    //优惠券
    const voucherList = async () => {
      state.voucherForm.user_id = state.user_id
      state.voucherLoading = true

      const {
        data: {items, records},
      } = await getVoucherList(state.voucherForm)
      state.voucherData = items
      state.voucherTotal = records
      state.voucherLoading = false
    }

    const voucherChange = (val) => {
      state.voucherForm.page = val
      voucherList()
    }

    const voucherSize = (val) => {
      state.voucherForm.size = val
      voucherList()
    }

    onBeforeUpdate(() => {
      if (getPermission.includes("/manage/shop/userVoucher/list")) {
        voucherList()
      }

      if (getPermission.includes("/manage/pay/consumeTrade/list")) {
        consumeTradeList()
      }

      if (getPermission.includes("/manage/pay/consumeRecord/list")) {
        consumeRecordList()
      }

      if (getPermission.includes("/manage/pay/userPointsHistory/list")) {
        pointHistoryList()
        signInfoList()
      }

      bindConnectList()
    })


    return {
      t: t,
      ...toRefs(state),
      showInfo,
      handleClick,
      handleEdit,
      voucherChange,
      voucherSize,
      authenticationState,
      consumeRecordSize,
      consumeTradeSize,
      consumeTradeChange,
      pointHistoryList,
      signInfoList,
      signInfoChange,
      signInfoSize,
      pointHistoryChange,
      pointHistorySize,
      formatDateTime,
      consumeRecordChange,
      bindConnectChange,
      bindConnectSize,
      handleDelete,
      formatDate,
      close,
      getPermission,
    }
  },
})
</script>
<style lang="scss">
.el-input__wrapper {
  width: 100%;
}

.left-line {
  width: 3px;
  height: 20px;
  background: #21adea;
  border-radius: 0px 3px 3px 0px;
  float: left;
  margin-right: 11px;
}

.el-tabs__item {
  font-size: 16px;
}
</style>
