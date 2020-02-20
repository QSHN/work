<template>
    <f7-page class="commodity_manage">
        <f7-navbar :title="name + '库存二维码'" back-link></f7-navbar>

        <div class="p_content">
            <canvas id="commodityQRCodeCanvas"></canvas>
        </div>
    </f7-page>
</template>

<script>
import QRCode from 'qrcode'
export default {
    name: "update",
    components: {
        QRCode: QRCode
    },
    props: {
        name: {
            type: String,
            required: true
        }
    },
    data(){
        return {
            codes:''
        }
    },
    methods:{
        useqrcode(){
            var canvas = document.getElementById('commodityQRCodeCanvas')
            QRCode.toCanvas(canvas, this.name, {
                width: 200,
                height: 200,
            }, (error) => {
                if (error) console.error(error)
            })
        }
    },
    mounted(){
        this.useqrcode();
    }
}
</script>

<style lang="scss" scoped>
.p_content {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 50px 0;
}
</style>

