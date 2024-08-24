<script lang="ts" setup>
  import { isExternal } from '@/utils/validate'

  const props = defineProps({
    to: {
      type: String,
      required: true,
    },
  })

  const type = computed(() => (isExternal(props.to) ? 'a' : 'router-link'))

  const linkProps = () =>
    isExternal(props.to)
      ? {
          href: props.to,
          target: '_blank',
          rel: 'noopener',
        }
      : { to: props.to }
</script>

<template>
  <component :is="type" v-bind="linkProps()">
    <slot />
  </component>
</template>
