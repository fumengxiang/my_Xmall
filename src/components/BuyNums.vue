<template>
  <div class="buyNums">
    <el-input-number v-model="num" @change="handleChange" :min="1" :max="100" label="描述文字"></el-input-number>
  </div>
</template>

<script>
export default {
  name: 'buyNums',
  data () {
    return {
      num: 1
    }
  },
  props: {
  },
  methods: {
    // 输入框的值
    handleChange(value) {
      // console.log(value);
      this.$emit('handleValue', value)
    }
  },
  components: {
  },
  computed: {
  },
  created () {},
  mounted () {}
}
</script>

<style scoped lang="scss">

</style>