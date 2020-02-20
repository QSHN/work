<template>
    <div class="barcodesearch">
        <div class="searchbar searchbar-inline">
            <div class="searchbar-input-wrap">
                <input type="search" v-model="search" :placeholder="title">
                <i class="searchbar-icon"></i>
            </div>
            <barcode-btn @change="changeSearch" />
        </div>
    </div>
</template>

<script>
import barcodeBtn from './barcodeBtn'
export default {
    name: "barcodesearch",
    props: {
        title: {
            type: String,
            default: '编码/条形码'
        }
    },
    components: {
        barcodeBtn
    },
    data () {
        return {
            search: ''
        }
    },
    methods: {
        changeSearch (val) {
            this.search = val
        }
    }
}
</script>

<style lang="scss">
.barcodesearch {
    .ios .searchbar {
        overflow: hidden;
    }
    .searchbar-input-wrap {
        position: relative;
        width: calc(100% - 54px);
        margin: 5px 10px;
        float: left;

        input {
            font-size: 14px !important;
        }
    }
}
</style>
