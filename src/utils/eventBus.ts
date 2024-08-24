import {App, reactive } from 'vue';

type Callback = (...args: any[]) => void;
type EventMap = { [key: string]: Callback[] };

interface EventBus {
  events: Record<string, Callback[]>;
  $on(eventName: string, callback: Callback): void;
  $once(eventName: string, callback: Callback): void;
  $off(eventName: string, callback: Callback): void;
  $emit(eventName: string, ...args: any[]): void;
}

const eventBus: EventBus = {
  events: reactive({} as EventMap),
  $on(eventName: string, callback: Callback): void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  },
  $once(eventName: string, callback: Callback): void {
    const onceCallback = (...args: any[]) => {
      this.$off(eventName, onceCallback);
      callback(...args);
    };
    this.$on(eventName, onceCallback);
  },
  $off(eventName: string, callback: Callback): void {
    if (!this.events[eventName]) {
      return;
    }
    const index = this.events[eventName].indexOf(callback);
    if (index > -1) {
      this.events[eventName].splice(index, 1);
    }
  },
  $emit(eventName: string, ...args: any[]): void {
    if (!this.events[eventName]) {
      return;
    }
    this.events[eventName].forEach(callback => callback(...args));
  }
};

// 将事件总线对象添加到 Vue 应用全局配置中
export function setupEventBus(app: App): void {
  app.provide('$eventBus', eventBus)
  //app.config.globalProperties.$eventBus = eventBus
}

export default eventBus;
