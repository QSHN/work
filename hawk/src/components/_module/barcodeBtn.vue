<template>
  <img :src="codeIcon" @click="getCode">
</template>

<script>
const codeIcon = require('assets/images/icon_scanning_gray@2x.png');
export default {
    name: "barcodeBtn",
    data () {
        return {
            codeIcon
        }
    },
    methods: {
      getCode () {
        $preloader.show();
        let self = this
        if (cordova.plugins.barcodeScanner) {
          cordova.plugins.barcodeScanner.scan(
            (result) => {
              $preloader.hide();
              self.$emit('change', result.text)
              // $alert("We got a barcode\n" +
              //         "Result: " + result.text + "\n" +
              //         "Format: " + result.format + "\n" +
              //         "Cancelled: " + result.cancelled);
            },
            (error) => {
              $preloader.hide();
              $alert("扫描条码失败: " + error);
            }, {
              preferFrontCamera : false, // iOS and Android
              showFlipCameraButton : false, // iOS and Android
              showTorchButton : true, // iOS and Android
              torchOn: false, // Android, launch with the torch switched on (if available)
              saveHistory: false, // Android, save scan history (default false)
              prompt : "请将条形码放在扫描框中", // Android
              resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
              formats : "all", // default: all but PDF_417 and RSS_EXPANDED
              orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
              disableAnimations : true, // iOS
              disableSuccessBeep: false // iOS and Android
            }
          );
        }
      }
    }
}
</script>

<style scoped>
img {
    width: 24px;
    height: 24px;
    margin-top: 8px;
    float: left;
}
</style>
