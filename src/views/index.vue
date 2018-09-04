<template>
    <div class="wrapper">
        <group>
            <cell-box :isLink=true>{{ title }}</cell-box>
        </group>
        <button @click="$store.commit('add')">+</button>
        <span>{{ $store.state.count }}</span>
        <button @click="$store.commit('reduce')">-</button>
    </div>
</template>
<script>
    import {getPersonInfo} from '../axios/api'
    import loading from '../components/loading'

    export default {
        // created: async function () {
        //     const params = {
        //         card_no: '111'
        //     };
        //     let res = await getPersonInfo(params);
        // },
        created: async function () {  //vuex测试
            const params = {
                card_no: '111'
            };
            await this.$store.dispatch('getPersonInfoData', params);
        },
        data() {
            return {
                title: '学生儿童缴费',
                value: ''
            }
        },
        methods: {},
        props: [],
        components: {
            loading
        }
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>
</style>
