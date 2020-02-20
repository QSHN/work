<template>
    <f7-page>
        <f7-navbar title="商品过期通知" back-link></f7-navbar>

        <div class="pc_content">
              <div class="pc_layer">
                  <div class="n_list" v-for="(v, i) in personnel" :key="i">
                      <div class="title">
                          <div>{{ v.name }}</div>
                      </div>
                      <div class="after">
                          <label class="toggle toggle-init color-blue">
                              <input type="checkbox" :checked="selected.includes(v._id)" @change="toggle($event.target.checked, v)">
                              <span class="toggle-icon"></span>
                          </label>
                      </div>
                  </div>
              </div>

            <div class="submit-button" @click="submit">提交</div>
        </div>
    </f7-page>
</template>

<script>
    import {mapGetters} from 'vuex';
    import axios from 'axios'
    export default {
        name: "expense",
        data () {
            return {
                selected: [],
                fromData: null
            }
        },
        computed: {
            ...mapGetters([
                'personnel',
                'superAdmin'
            ])
        },
        methods: {
            toggle (bool, v) {
                let index = this.selected.indexOf(v._id)
                if (bool) {
                    if (index === -1) this.selected.push(v._id)
                } else {
                    if (index > -1) this.selected.splice(index, 1)
                }
            },
            submit () {
                let ajaxData = {
                    notification: this.selected
                }
                if (this.fromData) ajaxData._id = this.fromData._id
                axios[this.fromData ? 'post' : 'put']('api/commodityNotification/', ajaxData).then(res => {
                    $alert('商品过期通知人员列表更新成功')
                    if (cordova.plugins.aMapLocation) {
                        this.$store.dispatch('createMarker', {device: device, aMapLocation: cordova.plugins.aMapLocation, content: `更新商品过期通知人员列表`})
                    }
                }).catch(err => {
                    console.error(err);
                    this.nobusy('商品过期通知人员列表');
                });
            },
            load () {
                axios.post('api/commodityNotification/list').then(res => {
                    console.log(res.data)
                    if (res.data && res.data._id) {
                        this.fromData = res.data
                        this.selected = res.data.notification
                    } else {
                        this.selected.push(this.superAdmin._id)
                    }
                }).catch(err => {
                    console.error(err);
                    this.nobusy('商品过期通知人员列表');
                });
            }
        },
        created() {
            this.load()
        }
    }
</script>

<style lang="scss" scoped>
.pc_content {
    height: 100%;
    display: flex;
    flex-direction: column;

    .pc_layer {
        flex-grow: 1;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
    }

    .n_list {
        display: flex;
        flex-direction: row;
        font-size: 16px;
        background: #fff;
        border-bottom: 1px solid #d8d8d8;
        padding: 10px 15px;
        align-items: center;

        .title {
            flex-grow: 1;
        }
    }

    .submit-button{
        width:100%;
        height:45px;
        line-height: 45px;
        font-size:16px;
        color: #FFFFFF;
        text-align: center;
        background:#3385FF;
        margin-top: 10px;
    }
}
</style>
