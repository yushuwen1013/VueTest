<template>
   <vue-json-editor
        v-model="resultInfo"
        :showBtns="false"    
        :mode="'code'"   
        lang="zh" 
        />
</template>

<script>
  import vueJsonEditor from 'vue-json-editor'
  export default {
    name:'Response',
    components: {
      vueJsonEditor
    },
    data () {
      return {
        resultInfo: '',
      }
    },
    mounted(){
      this.$bus.$on('response',(data)=>{
        console.log('Pesponse，收到了数据',data)
        this.resultInfo = data
			})
    },
    beforeDestroy() {
			this.$bus.$off('response')
		},
  }
    

</script>

<style>

</style>