<template>
    <div class="loading-wrapper">
        <div class="loading">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
</template>
<script>
    export default {}
</script>
<style lang="less" rel="stylesheet/less" scoped>
    .loading-wrapper {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background: rgba(45, 45, 45, .4);
        z-index: 99;
        .loading {
            position: absolute;
            top: 45%;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 40px;
            span {
                display: inline-block;
                width: 8px;
                height: 100%;
                border-radius: 4px;
                background: lightgreen;
                -webkit-animation: load 1s ease infinite;
                &:nth-child(2) {
                    -webkit-animation-delay: 0.2s;
                }

                &:nth-child(3) {
                    -webkit-animation-delay: 0.4s;
                }

                &:nth-child(4) {
                    -webkit-animation-delay: 0.6s;
                }

                &:nth-child(5) {
                    -webkit-animation-delay: 0.8s;
                }
            }
        }
    }

    @-webkit-keyframes load {
        0%, 100% {
            height: 36px;
            background: lightgreen;
        }
        50% {
            height: 70px;
            margin: -15px 0;
            background: lightblue;
        }
    }
</style>
