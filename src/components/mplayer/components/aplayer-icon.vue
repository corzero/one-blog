<template>
  <svg-icon :icon-class="svg" :style="style" />
</template>
<script>
export default {
  props: ['type'],
  computed: {
    svg () {
      let icon = this.type
      if (this.type === 'prev' || this.type === 'next') {
        icon = 'skip'
      }
      return icon
    },
    style () {
      if (this.type === 'next') {
        return {
          transform: 'rotate(180deg)'
        }
      }
      return {}
    }
  }
}
</script>
