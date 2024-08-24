<template>
  <div class="ms-date-range-picker">
    <el-date-picker
      v-bind="pickerOptions"
      v-model="timedata"
      :end-placeholder="t('结束日期')"
      :range-separator="t('-')"
      :start-placeholder="t('开始日期')"
      type="daterange"
      @change="chooseTimeRange"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import {translate as t} from "@/i18n";
import moment from 'dayjs'
// import timezone from 'dayjs/plugin/timezone';
// moment.extend(timezone);
// moment.tz.setDefault(Intl.DateTimeFormat().resolvedOptions().timeZone);

export default {
  props: {
    time: {
      type: Number,
      default: () => 1
    },
    modelValue: {
      type: [String, Array],
      default() {
        return ["", ""];
      },
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const opts = JSON.parse(JSON.stringify(props));

    const state = reactive({
      timedata: opts.modelValue
    })

    watch(
      () => props.modelValue,
      (newVal, oldVal) => {
        if (newVal !== oldVal) {
          state.timedata = newVal
        }
      },
      { deep: true, immediate: true }
    )

    const pickerOptions = ref({
      shortcuts: []
    });

    const getshortcuts = () => {
      if (props.time === 1) {
        pickerOptions.value.shortcuts = [
          {
            text: t('今天'),
            onClick(picker) {
              const start = new Date(moment(moment().format("YYYY-MM-DD")));
              const end = new Date();
              state.timedata = [start, end]

              picker.emit('pick', state.timedata);
              emit('update:modelValue', state.timedata);
            }
          },

          {
            text: t('昨天'),
            onClick(picker) {
              const start = new Date(moment(moment().subtract(1, "days").format("YYYY-MM-DD")));
              const end = new Date(moment(moment().format("YYYY-MM-DD")).subtract(1, 'millisecond'));

              picker.emit('pick', [start, end]);
              emit('update:modelValue', [start, end]);
            }
          },
          {
            text: t('最近七天'),
            onClick(picker) {
              const start = new Date(moment(moment().subtract(6, "days").format("YYYY-MM-DD")));
              const end = new Date();

              picker.emit('pick', [start, end]);
              emit('update:modelValue', [start, end]);
            }
          },
          {
            text: t('最近一个月'),
            onClick(picker) {
              const start = new Date(moment(moment().subtract(1, "month").add(1, 'day').format("YYYY-MM-DD")));
              const end = new Date();
              picker.emit('pick', [start, end]);
              emit('update:modelValue', [start, end]);
            }
          },
          {
            text: t('最近三个月'),
            onClick(picker) {
              const start = new Date(moment(moment().subtract(3, "months").add(1, 'day').format("YYYY-MM-DD")));
              const end = new Date();
              picker.emit('pick', [start, end]);
              emit('update:modelValue', [start, end]);
            }
          },
          {
            text: t('本月'),
            onClick(picker) {
              const start = new Date(moment(moment().startOf("month").format("YYYY-MM-DD")));
              const end = new Date();
              picker.emit('pick', [start, end]);
              emit('update:modelValue', [start, end]);
            }
          },
          {
            text: t('本年'),
            onClick(picker) {
              const start = new Date(moment(moment().startOf("year").format("YYYY-MM-DD")));
              const end = new Date();
              picker.emit('pick', [start, end]);
              emit('update:modelValue', [start, end]);
            }
          }
        ];
      } else {
        pickerOptions.value.shortcuts = [
          {
            text: '最近一天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1 - 3600 * 1000 * 24 * 1);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.emit('pick', [start, end]);
              emit('update:modelValue', [start, end]);
            }
          },
          {
            text: '最近三天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3 - 3600 * 1000 * 24 * 1);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.emit('pick', [start, end]);
              emit('update:modelValue', [start, end]);
            }
          },
          {
            text: '最近五天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 5 - 3600 * 1000 * 24 * 1);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.emit('pick', [start, end]);
              emit('update:modelValue', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 - 3600 * 1000 * 24 * 1);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.emit('pick', [start, end]);
              emit('update:modelValue', [start, end]);
            }
          }
        ];
      }
    };

    const chooseTimeRange = (t) => {
      console.log(t);

      if (null == t) {
        emit('update:modelValue', []);
      } else {
        t[1] = new Date(moment(moment(t[1]).format("YYYY-MM-DD")).add(1, 'day').subtract(1, 'millisecond'));
        emit('update:modelValue', t);
      }

      console.log(t);//结果为一个数组，如：["2018-08-04", "2018-08-06"]

    }

    onMounted(() => {
      getshortcuts();
    });

    return {
      t,
      ...toRefs(state),
      pickerOptions,
      chooseTimeRange
    };
  }
};
</script>
