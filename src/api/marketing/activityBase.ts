import request from '@/utils/request'
import { URL } from '@/config'

export function getList(params: any) {
  return request({
    url: URL.marketing.activityBase.list,
    method: 'get',
    params,
  })
}

export function doAdd(data: any) {
  return request({
    url: URL.marketing.activityBase.add,
    method: 'post',
    data,
  })
}

export function doRemove(data: any) {
  return request({
    url: URL.marketing.activityBase.remove,
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: URL.marketing.activityBase.edit,
    method: 'post',
    data,
  })
}

export function doEditState(data: any) {
  return request({
    url: URL.marketing.activityBase.editState,
    method: 'post',
    data,
  })
}

export function get(params: any) {
  return request({
    url: URL.marketing.activityBase.get,
    method: 'get',
    params,
  })
}

export function getActivityBuyItems(params: any) {
  return request({
    url: URL.marketing.activityBase.getActivityBuyItems,
    method: 'get',
    params,
  })
}

export function addActivityBuyItems(data: any) {
  return request({
    url: URL.marketing.activityBase.addActivityBuyItems,
    method: 'post',
    data,
  })
}

export function removeActivityBuyItems(data: any) {
  return request({
    url: URL.marketing.activityBase.removeActivityBuyItems,
    method: 'post',
    data,
  })
}

export function editActivityItem(data: any) {
  return request({
    url: URL.marketing.activityBase.editActivityItem,
    method: 'post',
    data,
  })
}

export function editBatchPrice(data: any) {
  return request({
    url: URL.marketing.activityBase.editBatchPrice,
    method: 'post',
    data,
  })
}

export function getGroupbookingList(params: any) {
  return request({
    url: URL.marketing.activityBase.getGroupbookingList,
    method: 'get',
    params,
  })
}

export function getGroupbookingHistoryList(params: any) {
  return request({
    url: URL.marketing.activityBase.getGroupbookingHistoryList,
    method: 'get',
    params,
  })
}

export function getCutpriceList(params: any) {
  return request({
    url: URL.marketing.activityBase.getCutpriceList,
    method: 'get',
    params,
  })
}

export function getCutpriceHistoryList(params: any) {
  return request({
    url: URL.marketing.activityBase.getCutpriceHistoryList,
    method: 'get',
    params,
  })
}
