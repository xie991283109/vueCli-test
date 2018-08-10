<template>
    <div class="wrapper">
        <!--<group>-->
            <!--<cell-box :isLink=true>{{ title }}</cell-box>-->
        <!--</group>-->
        <div class="container">
            <div class="pic"></div>
            <div class="text">IDE</div>
        </div>

        <div class="container1">
        </div>
    </div>
</template>
<script>
    import {getPersonInfo} from '../axios/api.js'
    import loading from '../components/loading'

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
        components: {
            loading
        }
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>
    .container1 {
        height: 100%;
        width: 100%;
        background: url("https://user-images.githubusercontent.com/8554143/34369102-3ea353ac-eaf4-11e7-9d27-f7d28c6a66f6.jpg"), url('https://user-images.githubusercontent.com/8554143/34369175-c14ae23e-eaf4-11e7-96f1-e146e5e5a96b.jpg');
        background-size: cover;
        background-blend-mode: lighten;
    }

    .container {
        position: relative;
        width: 100%;
        height: 300px;
        margin: auto;
    }

    .pic {
        position: relative;
        width: 100%;
        height: 100%;
        background: url("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1493353832&di=c063b6b9c89082e96ffee0766112ffec&imgtype=jpg&er=1&src=http%3A%2F%2Fpic2016.5442.com%3A82%2F2016%2F0111%2F07%2F3.jpg%21960.jpg");
        background-repeat: no-repeat;
        background-size: cover;
    }

    .text {
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        font-size: 180px;
        line-height: 320px;
        width: 101%;
        height: 100%;
        font-weight: bold;
        text-align: center;
        color: #000;
        mix-blend-mode: lighten;
        z-index: 99;
        background-color: #fff;
        overflow: hidden;
    }
</style>
