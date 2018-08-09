<template>
    <div class="wrapper">
        <group>
            <cell-box :isLink=true>{{ title }}</cell-box>
        </group>
    </div>
</template>
<script>
    import { getPersonInfo } from '../axios/api.js'

    export default {
        created() {
            const params = {
                card_no: '111'
            };
            getPersonInfo(params).then(res => {
                console.log(res)
            })
        },
        data() {
            return {
                title: '学生儿童缴费',
                value: ''
            }
        },
        methods: {},
        props: [],
        components: {}
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>
</style>
