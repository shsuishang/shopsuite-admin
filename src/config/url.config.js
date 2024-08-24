/**
 * @description 导出网络配置
 **/

const api = process.env.VUE_APP_API_URL
const mobile_url = process.env.VUE_APP_H5_URL
const admin_url = process.env.VUE_APP_ADMIN_URL
const pc_url = process.env.VUE_APP_PC_URL

const url = {
  apiUrl: api,
  adminUrl: admin_url,
  pcUrl: pc_url,
  mobileUrl: mobile_url,
  sysInfo: api + '/front/sys/config/info', // 系统配置
  router: api + '/manage/admin/menu/tree', // 获取路由路径

  verifyCode: api + '/front/sys/captcha/index', // 获取登录验证码路径

  login: api + '/front/account/login/login',
  register: api + '/front/account/login/register',
  logout: api + '/front/account/login/logout',

  userInfo: api + '/front/account/user/info',

  upload: api + '/front/sys/upload/index', // 图片 oss 路径
  testEmail: api + '/manage/shop/email/testEmail', // 邮件测试路径

  area: api + '/front/sys/district/tree',

  admin: {
    menu: {
      tree: api + '/manage/admin/menu/tree', // 获取路由路径
      list: api + '/manage/admin/menu/list',
      add: api + '/manage/admin/menu/add',
      edit: api + '/manage/admin/menu/edit',
      remove: api + '/manage/admin/menu/remove',
      editState: api + '/manage/admin/menu/editState',
    },
    userRole: {
      list: api + '/manage/admin/userRole/list',
      add: api + '/manage/admin/userRole/add',
      edit: api + '/manage/admin/userRole/edit',
      remove: api + '/manage/admin/userRole/remove',
    },
    userAdmin: {
      list: api + '/manage/admin/userAdmin/list',
      add: api + '/manage/admin/userAdmin/add',
      edit: api + '/manage/admin/userAdmin/edit',
      remove: api + '/manage/admin/userAdmin/remove',
      removeBatch: api + '/manage/admin/userAdmin/removeBatch',
    },
  },
  sys: {
    config: {
      index: api + '/manage/sys/config/index',
      smsRecord: api + '/manage/sys/config/smsRecord',
      editSite: api + '/manage/sys/config/editSite',

      list: api + '/manage/sys/config/list',
      add: api + '/manage/sys/config/add',
      edit: api + '/manage/sys/config/edit',
      remove: api + '/manage/sys/config/remove',
      getDetail: api + '/manage/sys/config/getDetail',

      listType: api + '/manage/sys/config/listType',
      addType: api + '/manage/sys/config/addType',
      editType: api + '/manage/sys/config/editType',
      removeType: api + '/manage/sys/config/removeType',
      editState: api + '/manage/sys/config/editState',

      savePcHelp: api + '/manage/sys/config/savePcHelp',
      getPcHelp: api + '/front/sys/config/getPcHelp',
      cacheClean: api + '/manage/sys/cache/clean',
    },
    contractType: {
      list: api + '/manage/sys/contractType/list',
      add: api + '/manage/sys/contractType/add',
      edit: api + '/manage/sys/contractType/edit',
      editState: api + '/manage/sys/contractType/editState',
      remove: api + '/manage/sys/contractType/remove',
      removeBatch: api + '/manage/sys/contractType/removeBatch',
    },
    crontabBase: {
      list: api + '/manage/sys/crontabBase/list',
      add: api + '/manage/sys/crontabBase/add',
      edit: api + '/manage/sys/crontabBase/edit',
      remove: api + '/manage/sys/crontabBase/remove',
      editState: api + '/manage/sys/crontabBase/editState',
    },
    dict: {
      tree: api + '/manage/sys/dict/tree',
      list: api + '/manage/sys/dict/list',
      add: api + '/manage/sys/dict/add',
      edit: api + '/manage/sys/dict/edit',
      remove: api + '/manage/sys/dict/remove',

      listItem: api + '/manage/sys/dict/listItem',
      addItem: api + '/manage/sys/dict/addItem',
      editItem: api + '/manage/sys/dict/editItem',
      removeItem: api + '/manage/sys/dict/removeItem',
    },
    material: {
      treeGallery: api + '/manage/sys/material/treeGallery',
      listGallery: api + '/manage/sys/material/listGallery',
      addGallery: api + '/manage/sys/material/addGallery',
      editGallery: api + '/manage/sys/material/editGallery',
      removeGallery: api + '/manage/sys/material/removeGallery',

      list: api + '/manage/sys/material/list',
      add: api + '/manage/sys/material/add',
      edit: api + '/manage/sys/material/edit',
      remove: api + '/manage/sys/material/remove',
      removeBatch: api + '/manage/sys/material/removeBatch',
    },
    log: {
      action: api + '/manage/sys/logAction/list',
      error: api + '/manage/sys/logError/list',
    },
    districtBase:{
      tree: api + '/manage/sys/districtBase/tree',
      list: api + '/manage/sys/districtBase/list',
      add: api + '/manage/sys/districtBase/add',
      edit: api + '/manage/sys/districtBase/edit',
      remove: api + '/manage/sys/districtBase/remove',
      removeBatch: api + '/manage/sys/districtBase/removeBatch',
      editState: api + '/manage/sys/districtBase/editState',},
    expressBase: {
      list: api + '/manage/sys/expressBase/list',
      getExpressList: api + '/manage/sys/expressBase/getExpressList',
      add: api + '/manage/sys/expressBase/add',
      edit: api + '/manage/sys/expressBase/edit',
      remove: api + '/manage/sys/expressBase/remove',
      removeBatch: api + '/manage/sys/expressBase/removeBatch',
      editState: api + '/manage/sys/expressBase/editState',
    },
    messageTemplate: {
      list: api + '/manage/sys/messageTemplate/list',
      add: api + '/manage/sys/messageTemplate/add',
      edit: api + '/manage/sys/messageTemplate/edit',
      editEnable: api + '/manage/sys/messageTemplate/editEnable',
      remove: api + '/manage/sys/messageTemplate/remove',
      editState: api + '/manage/sys/messageTemplate/editState',
    },
    feedbackType: {
      list: api + '/manage/sys/feedbackType/list',
      add: api + '/manage/sys/feedbackType/add',
      edit: api + '/manage/sys/feedbackType/edit',
      remove: api + '/manage/sys/feedbackType/remove',
      editState: api + '/manage/sys/feedbackType/editState',
    },
    feedbackBase: {
      list: api + '/manage/sys/feedbackBase/list',
      add: api + '/manage/sys/feedbackBase/add',
      edit: api + '/manage/sys/feedbackBase/edit',
      editAnswer: api + '/manage/sys/feedbackBase/editAnswer',
      remove: api + '/manage/sys/feedbackBase/remove',
      editState: api + '/manage/sys/feedbackBase/editState',
    },
    feedbackCategory: {
      list: api + '/manage/sys/feedbackCategory/list',
      add: api + '/manage/sys/feedbackCategory/add',
      edit: api + '/manage/sys/feedbackCategory/edit',
      remove: api + '/manage/sys/feedbackCategory/remove',
      editState: api + '/manage/sys/feedbackCategory/editState',
    },
    pageBase: {
      list: api + '/manage/sys/pageBase/list',
      add: api + '/manage/sys/pageBase/add',
      edit: api + '/manage/sys/pageBase/edit',
      editState: api + '/manage/sys/pageBase/editState',
      remove: api + '/manage/sys/pageBase/remove',
      getDataInfo: api + '/manage/sys/pageBase/getDataInfo',
    },
    pageCategoryNav: {
      list: api + '/manage/sys/pageCategoryNav/list',
      add: api + '/manage/sys/pageCategoryNav/add',
      edit: api + '/manage/sys/pageCategoryNav/edit',
      editState: api + '/manage/sys/pageCategoryNav/editState',
      remove: api + '/manage/sys/pageCategoryNav/remove',
    },
    pagePcNav: {
      list: api + '/manage/sys/pagePcNav/list',
      add: api + '/manage/sys/pagePcNav/add',
      edit: api + '/manage/sys/pagePcNav/edit',
      editState: api + '/manage/sys/pagePcNav/editState',
      remove: api + '/manage/sys/pagePcNav/remove',
    },
    release: {
      download: api + '/manage/sys/release/download',
      getLicence: api + '/manage/sys/release/getLicence'
    },
  },
  account: {
    userInfo:{
      list: api + '/manage/account/userInfo/list',
      add: api + '/manage/account/userInfo/add',
      edit: api + '/manage/account/userInfo/edit',
      editState: api + '/manage/account/userInfo/editState',
      remove: api + '/manage/account/userInfo/remove',
      getUserData: api + '/manage/account/userInfo/getUserData',
      passWordEdit: api + '/manage/account/userInfo/passWordEdit',
      addTags: api + '/manage/account/userInfo/addTags',
      addVouchers: api + '/manage/account/userInfo/addVouchers',
      exportFile: api + '/manage/account/userInfo/exportFile',
      exportTemp: api + '/manage/account/userInfo/exportTemp',
      importTemp: api + '/manage/account/userInfo/importTemp',
    },
    userBindConnect:{
      list: api + '/manage/account/userBindConnect/list',
    },
    userCard:{
      list: api + '/manage/account/userCard/list',
      add: api + '/manage/account/userCard/add',
      edit: api + '/manage/account/userCard/edit',
      remove: api + '/manage/account/userCard/remove',
      editState: api + '/manage/account/userCard/editState',
    },
    userLevel:{
      list: api + '/manage/account/userLevel/list',
      add: api + '/manage/account/userLevel/add',
      edit: api + '/manage/account/userLevel/edit',
      remove: api + '/manage/account/userLevel/remove',
    },
    userCompany:{
      list: api + '/manage/account/userCompany/list',
      add: api + '/manage/account/userCompany/add',
      edit: api + '/manage/account/userCompany/edit',
      remove: api + '/manage/account/userCompany/remove',
      editState: api + '/manage/account/userCompany/editState',
    },
    userCompanyType:{
      list: api + '/manage/account/userCompanyType/list',
      add: api + '/manage/account/userCompanyType/add',
      edit: api + '/manage/account/userCompanyType/edit',
      remove: api + '/manage/account/userCompanyType/remove',
      editState: api + '/manage/account/userCompanyType/editState',
    },
    userDeliveryAddress:{
      list: api + '/manage/account/userDeliveryAddress/list',
      add: api + '/manage/account/userDeliveryAddress/add',
      edit: api + '/manage/account/userDeliveryAddress/edit',
      remove: api + '/manage/account/userDeliveryAddress/remove',
    },
    userInvoice:{
      list: api + '/manage/account/userInvoice/list',
      add: api + '/manage/account/userInvoice/add',
      edit: api + '/manage/account/userInvoice/edit',
      remove: api + '/manage/account/userInvoice/remove',
    },
    userMessage:{
      getNotice: api + '/manage/account/userMessage/getNotice',
      clearNotice: api + '/manage/account/userMessage/clearNotice',
      list: api + '/manage/account/userMessage/list',
      add: api + '/manage/account/userMessage/add',
      edit: api + '/manage/account/userMessage/edit',
      editState: api + '/manage/account/userMessage/editState',
      remove: api + '/manage/account/userMessage/remove',
    },
    userTagBase:{
      list: api + '/manage/account/userTagBase/list',
      add: api + '/manage/account/userTagBase/add',
      edit: api + '/manage/account/userTagBase/edit',
      editState: api + '/manage/account/userTagBase/editState',
      remove: api + '/manage/account/userTagBase/remove',
    },
    userTagGroup:{
      list: api + '/manage/account/userTagGroup/list',
      add: api + '/manage/account/userTagGroup/add',
      edit: api + '/manage/account/userTagGroup/edit',
      remove: api + '/manage/account/userTagGroup/remove',
      tree: api + '/manage/account/userTagGroup/tree',

    },
    userDistribution:{
      list: api + '/manage/account/userDistribution/list',
      add: api + '/manage/account/userDistribution/add',
      edit: api + '/manage/account/userDistribution/edit',
      editState: api + '/manage/account/userDistribution/editState',
    },
  },
  pt: {
    productBase:{
      list: api + '/manage/pt/productBase/list',
      save: api + '/manage/pt/productBase/save',
      add: api + '/manage/pt/productBase/add',
      edit: api + '/manage/pt/productBase/edit',
      editState: api + '/manage/pt/productBase/editState',
      editEnable: api + '/manage/pt/productBase/editEnable',
      editCommissionRate: api + '/manage/pt/productBase/editCommissionRate',
      batchEditState: api + '/manage/pt/productBase/batchEditState',
      editSort: api + '/manage/pt/productBase/editSort',
      remove: api + '/manage/pt/productBase/remove',
      getProductDate: api + '/manage/pt/productBase/getProductDate',
      listItem: api + '/manage/pt/productItem/list',
      productItems: api + '/manage/pt/productBase/listItem',
      exportTemp: api + '/manage/pt/productBase/exportTemp',
      importTemp: api + '/manage/pt/productBase/importTemp',
    },
    productItem:{
      list: api + '/manage/pt/productItem/list',
      edit: api + '/manage/pt/productItem/edit',
      editState: api + '/manage/pt/productItem/editState',
      editStock: api + '/manage/pt/productItem/editStock',
      exportTemp: api + '/manage/pt/productItem/exportTemp',
      importTemp: api + '/manage/pt/productItem/importTemp',
      getStockBillItems: api + '/manage/pt/productItem/getStockBillItems',
      getStockWarningItems: api + '/manage/pt/productItem/getStockWarningItems',
    },
    productCategory:{
      tree: api + '/manage/pt/productCategory/tree',
      list: api + '/manage/pt/productCategory/list',
      add: api + '/manage/pt/productCategory/add',
      edit: api + '/manage/pt/productCategory/edit',
      remove: api + '/manage/pt/productCategory/remove',
      editState: api + '/manage/pt/productCategory/editState',
    },
    productType:{
      info: api + '/manage/pt/productType/info',
      list: api + '/manage/pt/productType/list',
      add: api + '/manage/pt/productType/add',
      edit: api + '/manage/pt/productType/edit',
      remove: api + '/manage/pt/productType/remove',
    },
    productBrand:{
      tree: api + '/manage/pt/productBrand/tree',
      list: api + '/manage/pt/productBrand/list',
      add: api + '/manage/pt/productBrand/add',
      edit: api + '/manage/pt/productBrand/edit',
      remove: api + '/manage/pt/productBrand/remove',
      editState: api + '/manage/pt/productBrand/editState',
    },
    productTag:{
      tag: api + '/manage/pt/productTag/tag',
      list: api + '/manage/pt/productTag/list',
      add: api + '/manage/pt/productTag/add',
      edit: api + '/manage/pt/productTag/edit',
      remove: api + '/manage/pt/productTag/remove',
    },
    productAssist:{
      list: api + '/manage/pt/productAssist/list',
      tree: api + '/manage/pt/productAssist/tree',
      add: api + '/manage/pt/productAssist/add',
      edit: api + '/manage/pt/productAssist/edit',
      remove: api + '/manage/pt/productAssist/remove',
    },
    productAssistItem:{
      list: api + '/manage/pt/productAssistItem/list',
      add: api + '/manage/pt/productAssistItem/add',
      edit: api + '/manage/pt/productAssistItem/edit',
      remove: api + '/manage/pt/productAssistItem/remove',
    },
    productSpec:{
      tree: api + '/manage/pt/productSpec/tree',
      list: api + '/manage/pt/productSpec/list',
      add: api + '/manage/pt/productSpec/add',
      edit: api + '/manage/pt/productSpec/edit',
      remove: api + '/manage/pt/productSpec/remove',
    },
    productSpecItem:{
      list: api + '/manage/pt/productSpecItem/list',
      add: api + '/manage/pt/productSpecItem/add',
      edit: api + '/manage/pt/productSpecItem/edit',
      remove: api + '/manage/pt/productSpecItem/remove',
      editState: api + '/manage/pt/productSpecItem/editState',
    },
    productAskBase:{
      list: api + '/manage/pt/productAskBase/list',
      add: api + '/manage/pt/productAskBase/add',
      edit: api + '/manage/pt/productAskBase/edit',
      remove: api + '/manage/pt/productAskBase/remove',
      doRemoveBatch: api + '/manage/pt/productAskBase/removeBatch',
    },
    productComment:{
      list: api + '/manage/pt/productComment/list',
      add: api + '/manage/pt/productComment/add',
      edit: api + '/manage/pt/productComment/edit',
      remove: api + '/manage/pt/productComment/remove',
      editState: api + '/manage/pt/productComment/editState',
    },
    productCommentReply:{
      list: api + '/manage/pt/productCommentReply/list',
      add: api + '/manage/pt/productCommentReply/add',
      remove: api + '/manage/pt/productCommentReply/remove',
      editState: api + '/manage/pt/productCommentReply/editState',
    },
  },
  pay: {
    baseBank: {
      list: api + '/manage/pay/baseBank/list',
      add: api + '/manage/pay/baseBank/add',
      edit: api + '/manage/pay/baseBank/edit',
      remove: api + '/manage/pay/baseBank/remove',
      doRemoveBatch: api + '/manage/pay/baseBank/removeBatch',
    },
    userResource:{
      list: api + '/manage/pay/userResource/list',
      add: api + '/manage/pay/userResource/add',
      edit: api + '/manage/pay/userResource/edit',
      remove: api + '/manage/pay/userResource/remove',
      doRemoveBatch: api + '/manage/pay/userResource/removeBatch',
      updateUserMoney: api + '/manage/pay/userResource/updateUserMoney',
      updatePoints: api + '/manage/pay/userResource/updatePoints',
    },
    userPointsHistory: {
      list: api + '/manage/pay/userPointsHistory/list',
      add: api + '/manage/pay/userPointsHistory/add',
      edit: api + '/manage/pay/userPointsHistory/edit',
      remove: api + '/manage/pay/userPointsHistory/remove',
      doRemoveBatch: api + '/manage/pay/userPointsHistory/removeBatch',
    },
    consumeTrade: {
      list: api + '/manage/pay/consumeTrade/list',
      add: api + '/manage/pay/consumeTrade/add',
      offline: api + '/manage/pay/consumeTrade/offline',
      edit: api + '/manage/pay/consumeTrade/edit',
      remove: api + '/manage/pay/consumeTrade/remove',
    },
    consumeDeposit: {
      list: api + '/manage/pay/consumeDeposit/list',
      offline: api + '/manage/pay/consumeDeposit/offline',
      add: api + '/manage/pay/consumeDeposit/add',
      edit: api + '/manage/pay/consumeDeposit/edit',
      editReview: api + '/manage/pay/consumeDeposit/editReview',
      remove: api + '/manage/pay/consumeDeposit/remove',
      doRemoveBatch: api + '/manage/pay/consumeDeposit/removeBatch',
    },
    consumeRecord: {
      list: api + '/manage/pay/consumeRecord/list',
      add: api + '/manage/pay/consumeRecord/add',
      edit: api + '/manage/pay/consumeRecord/edit',
      remove: api + '/manage/pay/consumeRecord/remove',
      doRemoveBatch: api + '/manage/pay/consumeRecord/removeBatch',
    },
    paymentType: {
      list: api + '/manage/pay/paymentType/list',
      add: api + '/manage/pay/paymentType/add',
      edit: api + '/manage/pay/paymentType/edit',
      remove: api + '/manage/pay/paymentType/remove',
      doRemoveBatch: api + '/manage/pay/paymentType/removeBatch',
    },
    tradeType: {
      list: api + '/manage/pay/tradeType/list',
      add: api + '/manage/pay/tradeType/add',
      edit: api + '/manage/pay/tradeType/edit',
      remove: api + '/manage/pay/tradeType/remove',
      doRemoveBatch: api + '/manage/pay/tradeType/removeBatch',
    },
    consumeWithdraw: {
      list: api + '/manage/pay/consumeWithdraw/list',
      edit: api + '/manage/pay/consumeWithdraw/edit',
    },
    distributionWithdraw: {
      list: api + '/manage/pay/distributionWithdraw/list',
      editState: api + '/manage/pay/distributionWithdraw/editState',
    },
  },
  cms: {
    articleCategory: {
      tree: api + '/manage/cms/articleCategory/tree',
      list: api + '/manage/cms/articleCategory/list',
      add: api + '/manage/cms/articleCategory/add',
      edit: api + '/manage/cms/articleCategory/edit',
      remove: api + '/manage/cms/articleCategory/remove',
      doRemoveBatch: api + '/manage/cms/articleCategory/removeBatch',
    },
    articleBase: {
      list: api + '/manage/cms/articleBase/list',
      add: api + '/manage/cms/articleBase/add',
      edit: api + '/manage/cms/articleBase/edit',
      editState: api + '/manage/cms/articleBase/editState',
      remove: api + '/manage/cms/articleBase/remove',
      doRemoveBatch: api + '/manage/cms/articleBase/removeBatch',
    },
    articleTag: {
      list: api + '/manage/cms/articleTag/list',
      add: api + '/manage/cms/articleTag/add',
      edit: api + '/manage/cms/articleTag/edit',
      remove: api + '/manage/cms/articleTag/remove',
      doRemoveBatch: api + '/manage/cms/articleTag/removeBatch',
    },
    articleComment: {
      list: api + '/manage/cms/articleComment/list',
      add: api + '/manage/cms/articleComment/add',
      edit: api + '/manage/cms/articleComment/edit',
      editState: api + '/manage/cms/articleComment/editState',
      remove: api + '/manage/cms/articleComment/remove',
      doRemoveBatch: api + '/manage/cms/articleComment/removeBatch',
    }
  },
  edu: {
    paperBase: {
      list: api + '/manage/edu/paperBase/list',
      getPaperAndTopics: api + '/manage/edu/paperBase/getPaperAndTopics',
      edit: api + '/manage/edu/paperBase/edit',
      remove: api + '/manage/edu/paperBase/remove',
    },
    courseDetail: {
      saveCourse: api + '/manage/edu/courseDetail/saveCourse',
      getCourseList: api + '/manage/edu/courseDetail/getSourceList',
      remove: api + '/manage/edu/courseDetail/remove',
    },
    courseCategory: {
      getList: api + '/manage/edu/courseCategory/list',
      getTree: api + '/manage/edu/courseCategory/getTree',
      remove: api + '/manage/edu/courseCategory/remove',
      add: api + '/manage/edu/courseCategory/add',
      edit: api + '/manage/edu/courseCategory/edit',
      doRemoveBatch: api + '/manage/edu/courseCategory/removeBatch',
    },
    courseChapter: {
      list: api + '/manage/edu/courseChapter/list',
      saveOrUpdate: api + '/manage/edu/courseChapter/saveOrUpdate',
      remove: api + '/manage/edu/courseChapter/remove',
    },
    examBase: {
      list: api + '/manage/edu/examBase/list',
      add: api + '/manage/edu/examBase/add',
      edit: api + '/manage/edu/examBase/edit',
      remove: api + '/manage/edu/examBase/remove',
    },
    awardBase: {
      list: api + '/manage/edu/examAward/list',
      edit: api + '/manage/edu/examAward/edit',
      remove: api + '/manage/edu/examAward/remove',
    },
    paperCategory: {
      list: api + '/manage/edu/paperCategory/list',
      add: api + '/manage/edu/paperCategory/add',
      edit: api + '/manage/edu/paperCategory/edit',
      remove: api + '/manage/edu/paperCategory/remove',
    },
    topicBase: {
      list: api + '/manage/edu/topicBase/list',
      getTopicListByPaperId: api + '/manage/edu/topicBase/getTopicListByPaperId',
      add: api + '/manage/edu/topicBase/add',
      edit: api + '/manage/edu/topicBase/edit',
      remove: api + '/manage/edu/topicBase/remove',
      getTopicTypeAndNum: api + '/manage/edu/topicBase/getTopicTypeAndNum',
      getTopicListByTypeNum: api + '/manage/edu/topicBase/getTopicListByTypeNum',
      exportTopicTemp: api + '/manage/edu/topicBase/exportTopicTemp',
      importTopicTemp: api + '/manage/edu/topicBase/importTopicTemp',
    },
    topicCategory: {
      list: api + '/manage/edu/topicCategory/list',
      add: api + '/manage/edu/topicCategory/add',
      edit: api + '/manage/edu/topicCategory/edit',
      remove: api + '/manage/edu/topicCategory/remove',
    },
    userPaperInfo: {
      list: api + '/manage/edu/userPaperInfo/list',
      getWorkList: api + '/manage/edu/userPaperInfo/getWorkList',
      getWorkDetail: api + '/manage/edu/userPaperInfo/getWorkDetail',
      edit: api + '/manage/edu/userPaperInfo/edit',
      remove: api + '/manage/edu/userPaperInfo/remove',
    },
    lecturerBase: {
      list: api + '/manage/edu/userLecturer/list',
      saveOrUpdate: api + '/manage/edu/userLecturer/saveOrUpdate',
      remove: api + '/manage/edu/userLecturer/remove',
    },
    lecturerCategory: {
      list: api + '/manage/edu/lecturerCategory/list',
      add: api + '/manage/edu/lecturerCategory/add',
      edit: api + '/manage/edu/lecturerCategory/edit',
      remove: api + '/manage/edu/lecturerCategory/remove',
    },
  },
  live: {
    userApply: {
      list: api + '/manage/live/userApply/list',
      add: api + '/manage/live/userApply/add',
      edit: api + '/manage/live/userApply/edit',
      remove: api + '/manage/live/userApply/remove',
      doRemoveBatch: api + '/manage/live/userApply/removeBatch',
    },
    liveProduct: {
      list: api + '/manage/live/wxLive/getApproved',
      add: api + '/manage/live/wxLive/addGood',
      edit: api + '/manage/live/wxLive/updateGood',
      remove: api + '/manage/live/wxLive/deleteGood',
    },
  },
  marketing: {
    activityBase:{
      list: api + '/manage/marketing/activityBase/list',
      add: api + '/manage/marketing/activityBase/add',
      edit: api + '/manage/marketing/activityBase/edit',
      editState: api + '/manage/marketing/activityBase/editState',
      remove: api + '/manage/marketing/activityBase/remove',
      update: api + '/manage/marketing/activityBase/update',
      get: api + '/manage/marketing/activityBase/get',
      getActivityBuyItems: api + '/manage/marketing/activityBase/getActivityBuyItems',
      addActivityBuyItems: api + '/manage/marketing/activityBase/addActivityBuyItems',
      removeActivityBuyItems: api + '/manage/marketing/activityBase/removeActivityBuyItems',
      editActivityItem: api + '/manage/marketing/activityBase/editActivityItem',
      editBatchPrice: api + '/manage/marketing/activityBase/editBatchPrice',
      getGroupbookingList: api + '/manage/marketing/activityBase/getGroupbookingList',
      getGroupbookingHistoryList: api + '/manage/marketing/activityBase/getGroupbookingHistoryList',
      getCutpriceList: api + '/manage/marketing/activityBase/getCutpriceList',
      getCutpriceHistoryList: api + '/manage/marketing/activityBase/getCutpriceHistoryList',
    },
  },
  page: {
    app: {
      getList: api + '/manage/page/app/list',
      setThemes: api + '/manage/page/app/setThemes',
      editApp: api + '/manage/page/app/editApp',
    },
  },
  analytics: {
    history: {
      getAccessOs: api + '/manage/analytics/history/getAccessOs',
      getAccessBrowser: api + '/manage/analytics/history/getAccessBrowser',
      getAccessCountry: api + '/manage/analytics/history/getAccessCountry',
      getAccessDevice: api + '/manage/analytics/history/getAccessDevice',
      getAccessProvince: api + '/manage/analytics/history/getAccessProvince',

      getAccessItemTimeLine: api + '/manage/analytics/history/getAccessItemTimeLine',
      getAccessItemUserTimeLine: api + '/manage/analytics/history/getAccessItemUserTimeLine',
      getAccessVisitorTimeLine: api + '/manage/analytics/history/getAccessVisitorTimeLine',
      getAccessVisitorNum: api + '/manage/analytics/history/getAccessVisitorNum',
      getAccessNum: api + '/manage/analytics/history/getAccessNum',


      getAccessItemNum: api + '/manage/analytics/history/getAccessItemNum',
      getAccessItemUserNum: api + '/manage/analytics/history/getAccessItemUserNum',
      listAccessItem: api + '/manage/analytics/history/listAccessItem',
    },
    order:{
      getOrderNumToday: api + '/manage/analytics/order/getOrderNumToday',
      getOrderNum: api + '/manage/analytics/order/getOrderNum',
      getSaleOrderAmount: api + '/manage/analytics/order/getSaleOrderAmount',
      getOrderAmount: api + '/manage/analytics/order/getOrderAmount',
      getDashboardTimeLine: api + '/manage/analytics/order/getDashboardTimeLine',
      getOrderNumTimeline: api + '/manage/analytics/order/getOrderNumTimeline',
      getOrderCustomerNumTimeline: api + '/manage/analytics/order/getOrderCustomerNumTimeline',

      getOrderItemNumTimeLine: api + '/manage/analytics/order/getOrderItemNumTimeLine',
      listOrderItemNum: api + '/manage/analytics/order/listOrderItemNum',


      getOrderItemNum: api + '/manage/analytics/order/getOrderItemNum',

    },
    return:{
      getReturnNum: api + '/manage/analytics/return/getReturnNum',
      getReturnAmountTimeline: api + '/manage/analytics/return/getReturnAmountTimeline',
      getReturnAmount: api + '/manage/analytics/return/getReturnAmount',

      getReturnNumTimeline: api + '/manage/analytics/return/getReturnNumTimeline',
      getReturnCustomerNumTimeline: api + '/manage/analytics/return/getReturnCustomerNumTimeline',

      getReturnItemNumTimeLine: api + '/manage/analytics/return/getReturnItemNumTimeLine',
      listReturnItemNum: api + '/manage/analytics/return/listReturnItemNum',


      getReturnItemNum: api + '/manage/analytics/return/getReturnItemNum',
    },
    user:{
      getVisitor: api + '/manage/analytics/user/getVisitor',
      getRegUser: api + '/manage/analytics/user/getRegUser',

      getUserNum: api + '/manage/analytics/user/getUserNum',
      getUserTimeLine: api + '/manage/analytics/user/getUserTimeLine',
    },
    trade: {
      getSalesAmount: api + '/manage/analytics/trade/getSalesAmount',
    },
    product: {
      getProductTimeLine: api + '/manage/analytics/product/getProductTimeLine',
      getProductNum: api + '/manage/analytics/product/getProductNum',
    }
  },

  trade: {
    orderBase:{
      exportFile: api + '/manage/trade/orderBase/exportFile',
      transferToSupplier: api + '/manage/trade/orderBase/transferToSupplier',

      detail: api + '/manage/trade/orderBase/detail',
      list: api + '/manage/trade/orderBase/list',
      add: api + '/manage/trade/orderBase/add',
      edit: api + '/manage/trade/orderBase/edit',
      remove: api + '/manage/trade/orderBase/remove',
      editState: api + '/manage/trade/orderBase/editState',

      cancel: api + '/manage/trade/orderBase/cancel',
      review: api + '/manage/trade/orderBase/review',
      finance: api + '/manage/trade/orderBase/finance',
      picking: api + '/manage/trade/orderBase/picking',
      shipping: api + '/manage/trade/orderBase/shipping',
      receive: api + '/manage/trade/orderBase/receive',

      listStateLog: api + '/manage/trade/orderBase/listStateLog',
      editShoppingFee: api + '/manage/trade/orderBase/editShoppingFee',
    },
    orderInvoice: {
      list: api + '/manage/trade/orderInvoice/list',
      add: api + '/manage/trade/orderInvoice/add',
      edit: api + '/manage/trade/orderInvoice/edit',
      editState: api + '/manage/trade/orderInvoice/editState',
      editStatus: api + '/manage/trade/orderInvoice/editStatus',
      remove: api + '/manage/trade/orderInvoice/remove',
      doRemoveBatch: api + '/manage/trade/orderInvoice/removeBatch',
    },
    orderLogistics: {
      list: api + '/manage/trade/orderLogistics/list',
      add: api + '/manage/trade/orderLogistics/add',
      edit: api + '/manage/trade/orderLogistics/edit',
      remove: api + '/manage/trade/orderLogistics/remove',
    },
    chainCode: {
      list: api + '/manage/trade/chainCode/list',
      add: api + '/manage/trade/chainCode/add',
      edit: api + '/manage/trade/chainCode/edit',
      remove: api + '/manage/trade/chainCode/remove',
    },
    orderReturn: {
      list: api + '/manage/trade/orderReturn/list',
      add: api + '/manage/trade/orderReturn/add',
      edit: api + '/manage/trade/orderReturn/edit',
      remove: api + '/manage/trade/orderReturn/remove',
      doRemoveBatch: api + '/manage/trade/orderReturn/removeBatch',
      getByReturnId: api + '/manage/trade/orderReturn/getByReturnId',
      refused: api + '/manage/trade/orderReturn/refused',
      review: api + '/manage/trade/orderReturn/review',
      receive: api + '/manage/trade/orderReturn/receive',
      refund: api + '/manage/trade/orderReturn/refund',
    },
    distributionOrder: {
      list: api + '/manage/trade/distributionOrder/list',
    },
    orderReturnReason: {
      list: api + '/manage/trade/orderReturnReason/list',
      add: api + '/manage/trade/orderReturnReason/add',
      edit: api + '/manage/trade/orderReturnReason/edit',
      remove: api + '/manage/trade/orderReturnReason/remove',
    },
  },
  shop: {
    storeExpressLogistics:{
      list: api + '/manage/shop/storeExpressLogistics/list',
      add: api + '/manage/shop/storeExpressLogistics/add',
      edit: api + '/manage/shop/storeExpressLogistics/edit',
      editState: api + '/manage/shop/storeExpressLogistics/editState',
      remove: api + '/manage/shop/storeExpressLogistics/remove',
      doRemoveBatch: api + '/manage/shop/storeExpressLogistics/removeBatch',
      returnLogistics: api + '/manage/shop/storeExpressLogistics/returnLogistics',
    },
    storeShippingAddress:{
      list: api + '/manage/shop/storeShippingAddress/list',
      add: api + '/manage/shop/storeShippingAddress/add',
      edit: api + '/manage/shop/storeShippingAddress/edit',
      remove: api + '/manage/shop/storeShippingAddress/remove',
      doRemoveBatch: api + '/manage/shop/storeShippingAddress/removeBatch',
    },
    storeTransportType: {
      list: api + '/manage/shop/storeTransportType/list',
      add: api + '/manage/shop/storeTransportType/add',
      edit: api + '/manage/shop/storeTransportType/edit',
      remove: api + '/manage/shop/storeTransportType/remove',
      doRemoveBatch: api + '/manage/shop/storeTransportType/removeBatch',
      editState: api + '/manage/shop/storeTransportType/editState',
    },
    storeTransportItem: {
      list: api + '/manage/shop/storeTransportItem/list',
      add: api + '/manage/shop/storeTransportItem/add',
      edit: api + '/manage/shop/storeTransportItem/edit',
      remove: api + '/manage/shop/storeTransportItem/remove',
    },
      shopUserVoucher:{
      list: api + '/manage/shop/userVoucher/list',
      add: api + '/manage/shop/userVoucher/add',
      edit: api + '/manage/shop/userVoucher/edit',
      remove: api + '/manage/shop/userVoucher/remove',
      doRemoveBatch: api + '/manage/shop/userVoucher/removeBatch',
    },
  },
  //门店管理
  o2o:{
    chainBase:{
      list: api + '/manage/o2o/chainBase/list',
      add: api + '/manage/o2o/chainBase/add',
      edit: api + '/manage/o2o/chainBase/edit',
      remove: api + '/manage/o2o/chainBase/remove',
      editState: api + '/manage/o2o/chainBase/editState',
    },
    chainItem:{
      list: api + '/manage/o2o/chainItem/list',
      add: api + '/manage/o2o/chainItem/add',
      edit: api + '/manage/o2o/chainItem/edit',
      remove: api + '/manage/o2o/chainItem/remove',
    },
  },
  sns:{
    storyBase:{
      list: api + '/manage/sns/storyBase/list',
      add: api + '/manage/sns/storyBase/add',
      edit: api + '/manage/sns/storyBase/edit',
      remove: api + '/manage/sns/storyBase/remove',
      editState: api + '/manage/sns/storyBase/editState',
    },
    storyCategory:{
      list: api + '/manage/sns/storyCategory/list',
      add: api + '/manage/sns/storyCategory/add',
      edit: api + '/manage/sns/storyCategory/edit',
      remove: api + '/manage/sns/storyCategory/remove',
      editState: api + '/manage/sns/storyCategory/editState',
    },
    storyComment:{
      list: api + '/manage/sns/storyComment/list',
      add: api + '/manage/sns/storyComment/add',
      edit: api + '/manage/sns/storyComment/edit',
      remove: api + '/manage/sns/storyComment/remove',
      editState: api + '/manage/sns/storyComment/editState',
    },
  },

}

module.exports = {
  baseURL: `${process.env.VUE_APP_BASE_URL}`,
  apiUrl: api,
  adminUrl: admin_url,
  pcUrl: pc_url,
  mobileUrl: mobile_url,
  URL: url,
}
