import { VNode } from 'vue'

declare interface globalPropertiesType {
  $loading(index?: string | undefined, text?: string): any
  $message(
    message: string | VNode,
    type?: 'success' | 'warning' | 'info' | 'error',
    customClass?: string,
    dangerouslyUseHTMLString?: boolean
  ): any
  $alert(
    content: string | VNode,
    title: string,
    callback: (() => unknown) | undefined
  ): any
  $confirm(
    content: string | VNode,
    title: string,
    callback1: any,
    callback2: any,
    confirmButtonText: string,
    cancelButtonText: string
  ): any
  $notify(
    message: string,
    title: string,
    type?: 'success' | 'warning' | 'info' | 'error',
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left',
    duration?: number
  ): any
  $tableHeight(formType: number | unknown): number
  $pub(...args: any[]): void
  $sub(): void
  $unsub(): void
}
