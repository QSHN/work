<template>
  <Modal
    v-model="modal"
    :title="`${type}商品`"
    :mask-closable="false"
    :styles="{top: '20px'}"
    width="1082"
    @on-cancel="cancel">
    <Form ref="formData" :model="formData" :rules="formDataRule" :label-width="130">
      <FormItem label="商品条码">
        <Input v-model="formData.barcode" style="width: 200px" />
      </FormItem>

      <Row type="flex">
        <FormItem label="商品编码" prop="code">
          <Input v-model="formData.code" style="width: 200px" />
        </FormItem>

        <FormItem label="商品名称" prop="name">
          <Input v-model="formData.name" style="width: 200px" />
        </FormItem>

        <FormItem label="简称">
          <Input v-model="formData.abbreviation" style="width: 200px" />
        </FormItem>
      </Row>

      <Row type="flex">
        <FormItem label="商品类型" prop="goodsType">
          <Select v-model="formData.goodsType" filterable style="width: 200px;">
            <Option v-for="(item, index) in goodsTypeList" :value="item" :key="index">{{ item }}</Option>
          </Select>
        </FormItem>

        <FormItem label="商品类别" prop="groupId">
          <Select v-model="formData.groupId" style="width: 200px;">
            <Option v-for="(item, index) in groupList" :value="item._id" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>

        <FormItem label="计量单位组" prop="unitGroup">
          <Select v-model="formData.unitGroup" style="width: 200px;">
            <Option v-for="(item, index) in measureUnitGroupList" :value="item._id" :key="index">
              {{ item.name }}
            </Option>
          </Select>
        </FormItem>
      </Row>

      <Row type="flex">
        <FormItem label="基本单位" prop="unitId">
          <Select v-model="formData.unitId" style="width: 200px;">
            <Option v-for="(item, index) in getUnitList" :value="item._id" :key="index">
              {{ item.name }}
            </Option>
          </Select>
        </FormItem>
      </Row>
    </Form>

    <Tabs>
      <TabPane label="基本信息">
        <Form :label-width="130" v-if="formData.basicInfo"  style="margin: 20px 0">
          <Row type="flex">
            <FormItem label="商品品牌" >
              <Select v-model="formData.basicInfo.brand" style="width: 200px;">
                <Option v-for="(item, index) in brandList" :value="item._id" :key="index">
                  {{ item.name }}
                </Option>
              </Select>
            </FormItem>

            <FormItem label="规格型号" >
              <Input v-model="formData.basicInfo.specifications" style="width: 200px" />
            </FormItem>

            <FormItem label="批发价" >
              <InputNumber :min="0" :step="0.1" v-model="formData.basicInfo.wholesalePrice" style="width: 200px" />
            </FormItem>
          </Row>

          <Row type="flex">
            <FormItem label="零售价" >
              <InputNumber :min="0" :step="0.1" v-model="formData.basicInfo.retailPrice" style="width: 200px" />
            </FormItem>

            <FormItem label="产地" >
              <Input v-model="formData.basicInfo.placeOrigin" style="width: 200px" />
            </FormItem>

            <FormItem label="来源" >
              <Select v-model="formData.basicInfo.source" style="width: 200px;">
                <Option v-for="(item, index) in supplierList" :value="item._id" :key="index">
                  {{ item.name }}
                </Option>
              </Select>
            </FormItem>
          </Row>

          <Row type="flex">
            <FormItem label="税收分类编码" >
              <Input v-model="formData.basicInfo.classificationCode" style="width: 200px" />
            </FormItem>

            <FormItem label="税率%" >
              <InputNumber :min="0" :step="0.1" v-model="formData.basicInfo.rate" style="width: 200px" />
            </FormItem>
          </Row>

          <Row type="flex">
            <FormItem label="注册证号" >
              <Input v-model="formData.basicInfo.registration" style="width: 200px" />
            </FormItem>

            <FormItem label="生产许可证" >
              <Input v-model="formData.basicInfo.production" style="width: 200px" />
            </FormItem>
          </Row>

          <Row type="flex" v-for="(v, i) in  Math.ceil(formData.basicInfo.custom.length / 3)" :key="i">
            <template v-for="(v1, i1) in 3">
              <FormItem v-if="formData.basicInfo.custom[i * 3 + i1]" :key="i + '_' + i1"
                        :label="formData.basicInfo.custom[i * 3 + i1].title" >
                <template v-if="formData.basicInfo.custom[i * 3 + i1].type === '文本框'">
                  <Input v-model="formData.basicInfo.custom[i * 3 + i1].val" style="width: 130px" />
                </template>
                <template v-else-if="formData.basicInfo.custom[i * 3 + i1].type === '下拉框'">
                  <Select v-model="formData.basicInfo.custom[i * 3 + i1].val" style="width: 130px;">
                    <Option v-for="(item, index) in formData.basicInfo.custom[i * 3 + i1].list" :value="item" :key="index">
                      {{ item }}
                    </Option>
                  </Select>
                </template>
                <template v-else>
                  <DatePicker type="date" v-model="formData.basicInfo.custom[i * 3 + i1].val" style="width: 130px" />
                </template>
                <span style="margin: 0 10px; padding: 5px 0;" @click="setCustom(formData.basicInfo.custom[i * 3 + i1], i * 3 + i1)">修改</span>
                <span style="padding: 5px 0;" @click="formData.basicInfo.custom.splice(i * 3 + i1, 1)">删除</span>
              </FormItem>
            </template>
          </Row>

          <Row type="flex" v-if="isCustomShow !== null">
            <FormItem label="" >
              <span style="margin-right: 10px;">字段名称</span>
              <Input v-model="customForm.title" style="width: 100px" :maxlength="6" />
              <span style="margin: 0 10px 0 20px;">字段值来源</span>
              <Select v-model="customForm.type" style="width: 100px;">
                <Option v-for="(item, index) in ['文本框', '下拉框', '日期']" :value="item" :key="index">
                  {{ item }}
                </Option>
              </Select>
              <template v-if="customForm.type === '下拉框'">
                <span style="margin: 0 10px 0 20px;">选项值</span>
                <div class="ivu-select  ivu-select-visible ivu-select-single ivu-select-default" style="width: 200px; position: relative;">
                  <div tabindex="0" class="ivu-select-selection">
                    <input type="hidden">
                    <div class="">
                      <span class="ivu-select-placeholder">请选择</span>
                      <i class="ivu-icon ivu-icon-ios-arrow-down ivu-select-arrow"></i>
                    </div>
                  </div>
                  <div class="ivu-select-dropdown" style="display: block;
                 min-width: 200px; position: absolute; will-change: top, left; transform-origin: center top; top: 30px; left: 0;" x-placement="bottom-start">
                    <ul class="vu-select-dropdown-list">
                      <li class="ivu-select-item" v-for="(item, index) in customForm.list" :value="item" :key="index">
                        <div style="display: flex; align-items: center">
                          <Input v-model="customForm.list[index]" style="width: 100px" />
                          <span style="margin-left: 20px; padding: 5px;" @click="customForm.list.splice(index, 1)">删除</span>
                        </div>
                      </li>
                    </ul>
                    <ul class="ivu-select-dropdown-list">
                      <li class="ivu-select-item">
                        <div style="display: flex; align-items: center">
                          <Input v-model="addCustom" style="width: 100px" />
                          <span style="margin-left: 20px; padding: 5px;" @click="addCustomFun">添加</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </template>
            </FormItem>
          </Row>

          <Row type="flex">
            <FormItem label="" >
              <template v-if="isCustomShow !== null">
                <Button size="small" style="width: 95px; height: 36px; margin: 0 10px 0 0;" @click="saveCustom">保存</Button>
                <Button size="small" style="width: 95px; height: 36px;" @click="cancelCustom">取消</Button>
              </template>
              <Button v-else size="small" style="width: 200px; height: 36px;" @click="setCustom(false)">添加自定义字段</Button>
            </FormItem>
          </Row>

          <Row type="flex">
            <FormItem label="描述" >
              <Input type="textarea" v-model="formData.basicInfo.describe" style="width: 854px" />
            </FormItem>
          </Row>

          <Row type="flex">
            <FormItem label="备注" >
              <Input type="textarea" v-model="formData.basicInfo.des" style="width: 854px" />
            </FormItem>
          </Row>
        </Form>
      </TabPane>

      <TabPane label="商品特性">
        <Form :label-width="130"  v-if="formData.character">
          <Row type="flex">
            <div style="width: 330px; padding-left: 20px;">
              <Checkbox v-model="formData.character.batch">批次管理</Checkbox>
            </div>
            <div style="width: 330px; padding-left: 20px;">
              <Checkbox v-model="formData.character.serialNumber">序列号管理</Checkbox>
            </div>
            <div style="width: 330px; padding-left: 20px;">
              <Checkbox v-model="formData.character.enable">启用称重</Checkbox>
            </div>
          </Row>

          <Row type="flex">
            <div style="width: 330px; padding-left: 20px; margin: 10px 0;">
              <Checkbox v-model="formData.character.shelfLife">保质期管理</Checkbox>
            </div>
            <div style="width: 330px; padding-left: 20px; margin: 10px 0;">
              <Checkbox v-model="formData.character.subComponent">可为子件</Checkbox>
            </div>
            <div style="width: 330px; padding-left: 20px; margin: 10px 0;">
              <Checkbox v-model="formData.character.component">可为组件</Checkbox>
            </div>
          </Row>

          <Row type="flex" v-if="formData.character.shelfLife">
            <FormItem label="保质期天数" style="margin-bottom: 10px;">
              <InputNumber :min="1" :step="1" :precision="0" v-model.number="formData.character.shelfLifeData.shelfLifeDays" style="width: 200px" />
            </FormItem>

            <FormItem label="预警天数" style="margin-bottom: 10px;">
              <InputNumber :min="1" :step="1" :precision="0" v-model.number="formData.character.shelfLifeData.warningDays" style="width: 200px" />
            </FormItem>
          </Row>

          <div style="width: 330px; padding-left: 20px;">
            <Checkbox v-model="formData.character.auxiliary">辅助属性管理</Checkbox>
          </div>

          <div v-if="formData.character.auxiliary">
            <Row type="flex">
              <Button type="primary" @click="selectAuxiliary" style="margin: 10px 0 5px 20px;">选择属性</Button>
              <Button @click="createAuxiliary" style="margin: 10px 0 5px 10px;">快速生产属性组合</Button>
            </Row>
            <List item-layout="vertical" style="padding-left: 20px;">
              <ListItem v-for="(item, index) in formData.character.auxiliaryData.select" :key="index">
                <div style="font-weight: bold">{{item.name}}</div>
                <Checkbox v-for="(v, i) in item.child" :key="i" v-model="v.selected">{{ v.name }}</Checkbox>
              </ListItem>
            </List>

            <Button @click="deleteAuxiliary" style="margin: 0 0 5px 20px;">批量删除</Button>

            <div style="padding: 0 20px">
              <Table :height="400"
                     :width="1000"
                     border
                     :columns="auxiliaryColumns"
                     :data="formData.character.auxiliaryData.content"
                     @on-selection-change="selectAuxiliaryTable"
                     @on-row-click="rowClick"
                     :row-class-name="rowClassName"
                     class="input_table">
                <template slot-scope="{ row }" slot="pic">
                  <div style="padding-top: 5px;">
                    <upload-pic v-model="formData.character.auxiliaryData.content[row._index].pic" :multiple="1"/>
                  </div>
                </template>

                <template slot-scope="{ row }" slot="sku">
                  <div class="text">{{ row.sku }}</div>
                  <div class="hover_layer">
                    <Input v-model="formData.character.auxiliaryData.content[row._index].sku" />
                  </div>
                </template>
              </Table>
            </div>
          </div>
        </Form>
      </TabPane>

      <TabPane label="计量单位">
        <Form :label-width="130" v-if="formData.measureUnit">
          <div style="color: #2d8cf0; margin-bottom: 10px;">默认单位</div>
          <Row type="flex">
            <FormItem label="销售单位" >
              <Select v-model="formData.measureUnit.sales" style="width: 200px;">
                <Option v-for="(item, index) in formData.measureUnit.conversion" :value="item._id" :key="index">
                  {{ item.name }}
                </Option>
              </Select>
            </FormItem>

            <FormItem label="采购单位" >
              <Select v-model="formData.measureUnit.purchasing" style="width: 200px;">
                <Option v-for="(item, index) in formData.measureUnit.conversion" :value="item._id" :key="index">
                  {{ item.name }}
                </Option>
              </Select>
            </FormItem>

            <FormItem label="库存单位" >
              <Select v-model="formData.measureUnit.inventory" style="width: 200px;">
                <Option v-for="(item, index) in formData.measureUnit.conversion" :value="item._id" :key="index">
                  {{ item.name }}
                </Option>
              </Select>
            </FormItem>
          </Row>
          <Row type="flex">
            <FormItem label="报表辅助单位" >
              <Select v-model="formData.measureUnit.auxiliary" style="width: 200px;">
                <Option v-for="(item, index) in formData.measureUnit.conversion" :value="item._id" :key="index">
                  {{ item.name }}
                </Option>
              </Select>
            </FormItem>
          </Row>

          <div style="color: #2d8cf0; margin-bottom: 10px;">其他单位</div>
          <Row type="flex">
            <FormItem label="条码标签单位" >
              <Select v-model="formData.measureUnit.barcode" style="width: 200px;">
                <Option v-for="(item, index) in formData.measureUnit.conversion" :value="item._id" :key="index">
                  {{ item.name }}
                </Option>
              </Select>
            </FormItem>
          </Row>

          <div style="color: #2d8cf0; margin-bottom: 10px;">固定换算单位</div>
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <span style="margin-right: 10px;">单位</span>
            <Select v-model="conversionForm._id" style="width: 200px;" @on-change="selectMU">
              <Option v-for="(item, index) in getUnitList"
                      :value="item._id"
                      :key="index"
                      :disabled="!!formData.measureUnit.conversion.find(f => f._id === item._id)">
                {{ item.name }}
              </Option>
            </Select>
            <span style="margin: 0 10px 0 20px;">换算率</span>
            <InputNumber :min="0" :step="0.1" v-model="conversionForm.equation" style="width: 112px" />
            <Button size="small" @click="addMeasureUnitTable" style="margin: 0 0 0 10px; height: 32px; width: 60px;">确定</Button>
            <Button size="small" @click="conversionForm = {_id: null, equation: null}" style="margin: 0 0 0 10px; height: 32px; width: 60px;">清空</Button>
          </div>

          <Table :width="552"
                 border
                 :columns="measureUnitColumns"
                 :data="formData.measureUnit.conversion">
            <template slot-scope="{ row }" slot="action">
              <template v-if="row._index > 0">
                <Button size="small" @click="editMeasureUnitTable(row)" style="margin-right: 5px;">修改</Button>
                <Button size="small" @click="deleteMeasureUnitTable(row._index)">删除</Button>
              </template>
            </template>
          </Table>
        </Form>
      </TabPane>

      <TabPane label="库存资料">
        <Form :label-width="75" v-if="formData.holdings">
          <Row type="flex">
            <FormItem label="默认仓库" style="margin-bottom: 20px;">
              <Select v-model="formData.holdings.defaultWarehouse" style="width: 200px;">
                <Option v-for="(item, index) in warehouseList" :value="item._id" :key="index">
                  {{ item.name }}
                </Option>
              </Select>
            </FormItem>

            <div style="margin-left: 60px; height: 32px; line-height: 32px;">
              <Checkbox v-model="formData.holdings.negativeInventory">允许负库存</Checkbox>
            </div>
          </Row>

          <div style="width: 330px; padding-left: 15px;">
            <Checkbox v-model="formData.holdings.inventoryManage">库存管理</Checkbox>
          </div>

          <template v-if="formData.holdings.inventoryManage">
            <div style="padding-left: 15px; display: flex; align-items: center; margin: 20px 0;">
              <RadioGroup v-model="formData.holdings.which">
                <Radio label="unified">统一管理库存</Radio>
                <Radio label="points" style="margin-left: 10px;">分仓管理库存</Radio>
              </RadioGroup>
              <Checkbox v-model="formData.holdings.auxiliarySetting" style="margin-left: 20px;" :disabled="formData.holdings.which === 'unified'">根据辅助属性设置</Checkbox>
            </div>

            <div v-if="formData.holdings.which === 'unified'" style="padding-left: 15px; display: flex; align-items: center; margin: 0 0 10px 0;">
              <span style="margin-right: 10px;">最低库存数量</span>
              <InputNumber :min="0" :step="0.1"  v-model="formData.holdings.unified.minimum" style="width: 150px"/>
              <span style="margin-right: 10px; margin-left: 20px;">最高库存数量</span>
              <InputNumber :min="0" :step="0.1"  v-model="formData.holdings.unified.maximum" style="width: 150px"/>
              <span style="margin-right: 10px; margin-left: 20px;">安全库存数量</span>
              <InputNumber :min="0" :step="0.1"  v-model="formData.holdings.unified.safety" style="width: 150px"/>
            </div>
            <div v-else>
<!--              points-->
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <span style="margin-right: 10px; margin-left: 25px;">仓库名称</span>
                <Select v-model="pointsForm._id" style="width: 150px;">
                  <Option v-for="(item, index) in warehouseList"
                          :value="item._id"
                          :key="index">
                    {{ item.name }}
                  </Option>
                </Select>
                <template v-if="formData.holdings.auxiliarySetting">
                  <span style="margin-right: 10px; margin-left: 42px;">辅助资料</span>
                  <Select v-model="pointsForm.auxiliary" style="width: 150px;">
                    <Option v-for="(item, index) in formData.character.auxiliaryData.content"
                            :value="item.auxiliary"
                            :key="index">
                      {{ item.auxiliary }}
                    </Option>
                  </Select>
                </template>
              </div>

              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <span style="margin-right: 10px;">最低库存数量</span>
                <InputNumber :min="0" :step="0.1"  v-model="pointsForm.minimum" style="width: 150px"/>
                <span style="margin-right: 10px; margin-left: 20px;">最高库存数量</span>
                <InputNumber :min="0" :step="0.1"  v-model="pointsForm.maximum" style="width: 150px"/>
                <span style="margin-right: 10px; margin-left: 20px;">安全库存数量</span>
                <InputNumber :min="0" :step="0.1"  v-model="pointsForm.safety" style="width: 150px"/>
                <Button size="small" @click="addPoints" style="margin: 0 0 0 10px; height: 32px; width: 60px;">确定</Button>
                <Button size="small"
                        @click="pointsForm = {_id: null, maximum: null, minimum: null, safety: null, auxiliary: null}"
                        style="margin: 0 0 0 10px; height: 32px; width: 60px;">清空</Button>
              </div>

              <Table :width="formData.holdings.auxiliarySetting ? 1002 : 802"
                     border
                     :columns="pointsColumns"
                     :data="formData.holdings.points">
                <template slot-scope="{ row }" slot="action">
                  <Button size="small" @click="editPoints(row)" style="margin-right: 5px;">修改</Button>
                  <Button size="small" @click="deletePoints(row._index)">删除</Button>
                </template>
                <template slot-scope="{ row }" slot="warehouse">
                  {{warehouseList.find(f => f._id === row._id).name}}
                </template>
              </Table>
            </div>
          </template>
        </Form>
      </TabPane>

      <TabPane label="采购资料">
        <Form :label-width="130" v-if="formData.purchase">
          <Row type="flex">
            <FormItem label="默认供应商" >
              <Select v-model="formData.purchase.supplier" style="width: 200px;">
                <Option v-for="(item, index) in supplierList" :value="item._id" :key="index">
                  {{ item.name }}
                </Option>
              </Select>
            </FormItem>

            <FormItem label="采购负责人" >
              <Select v-model="formData.purchase.clerk" style="width: 200px;">
                <Option v-for="(item, index) in clerkList" :value="item._id" :key="index">
                  {{ item.name }}
                </Option>
              </Select>
            </FormItem>

            <FormItem label="采购单价">
              <InputNumber :min="0" :step="0.1" v-model="formData.purchase.purchasing" style="width: 200px" />
            </FormItem>
          </Row>
        </Form>
      </TabPane>

      <TabPane label="图片附件">
        <div v-if="formData.picFiles" style="margin-left: 20px;">
          <div style="color: #2d8cf0; margin-bottom: 10px;">主图片</div>
          <upload-pic v-model="formData.picFiles.mainImage" :multiple="1"/>
          <div style="color: #2d8cf0; margin-bottom: 10px;">其他单位</div>
          <upload-pic v-model="formData.picFiles.otherPictures" :multiple="5"/>
          <div style="color: #2d8cf0; margin-bottom: 10px;">附件</div>
          <upload-file v-model="formData.picFiles.files" :multiple="5"/>
        </div>
      </TabPane>
    </Tabs>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">确定</Button>
    </div>

    <Modal
      v-model="selectModal"
      title="选择辅助属性"
      :mask-closable="false"
      :styles="{top: '20px'}"
      width="500"
      @on-cancel="selectModal = false">
      <Checkbox v-for="(v, i) in selectAGroupList"
                :key="i"
                v-model="v.selected"
                style="margin: 0 10px 10px 0;">
        {{ v.name }}
      </Checkbox>
      <div slot="footer">
        <Button type="text" @click="selectModal = false">取消</Button>
        <Button type="success" @click="saveSelectAuxiliary">确定</Button>
      </div>
    </Modal>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateCommodityInfo } from '../../api/commodityInfo'
import UploadPic from '../../components/upload/upload-pic'
import UploadFile from '../../components/upload/upload-file'
import moment from 'moment'
export default {
  name: 'currency',
  props: {
    groupList: Array,
    customerList: Array,
    clerkList: Array,
    supplierList: Array,
    measureUnitList: Array,
    measureUnitGroupList: Array,
    brandList: Array,
    auxiliaryList: Array,
    auxiliaryGroupList: Array,
    warehouseList: Array
  },
  components: {
    UploadPic,
    UploadFile
  },
  data () {
    return {
      selectModal: false,
      modal: false,
      currentRow: null,
      type: '',
      oldData: {},
      formData: {},
      goodsTypeList: ['普通', '组装', '套装', '服务'],
      formDataRule: {
        code: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('商品编码不能为空'))
              } else if (this.oldData.code !== value && this.customerList.filter(v => v.code.trim() === value.trim()).length) {
                callback(new Error('已存在该商品编码，不能重复'))
              } else {
                callback()
              }
            }
          }
        ],
        name: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('商品名称不能为空'))
              } else if (this.oldData.name !== value && this.customerList.filter(v => v.name.trim() === value.trim()).length) {
                callback(new Error('已存在该商品名称，不能重复'))
              } else {
                callback()
              }
            }
          }
        ],
        goodsType: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('商品类型不能为空'))
              } else {
                callback()
              }
            }
          }
        ],
        groupId: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('商品类别不能为空'))
              } else {
                callback()
              }
            }
          }
        ],
        unitGroup: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('计量单位组不能为空'))
              } else {
                callback()
              }
            }
          }
        ],
        unitId: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('基本单位不能为空'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      isCustomShow: null,
      customForm: {
        title: '',
        type: '文本框',
        list: [],
        val: null
      },
      addCustom: '',
      selectAGroupList: [],
      auxiliaryTableSList: [],
      auxiliaryColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '图片',
          slot: 'pic',
          width: 100,
          align: 'center'
        },
        {
          title: '辅助属性',
          key: 'auxiliary',
          width: 200
        },
        {
          title: 'SKU代码',
          slot: 'sku',
          width: 200
        }
      ],
      measureUnitColumns: [
        {
          title: '操作',
          width: 150,
          slot: 'action',
          align: 'center'
        },
        {
          title: '单位',
          key: 'name',
          width: 200
        },
        {
          title: '换算率',
          key: 'equation',
          width: 200
        }
      ],
      conversionForm: {
        _id: null,
        equation: null
      },
      pointsForm: {
        _id: null,
        maximum: null,
        minimum: null,
        safety: null,
        auxiliary: null
      },
      pointsColumns: [
        {
          title: '操作',
          width: 150,
          slot: 'action',
          align: 'center'
        },
        {
          title: '仓库名称',
          slot: 'warehouse',
          width: 200
        },
        {
          title: '最低库存数量',
          key: 'minimum',
          width: 150
        },
        {
          title: '最高库存数量',
          key: 'maximum',
          width: 150
        },
        {
          title: '安全库存数量',
          key: 'safety',
          width: 150
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'accountSet'
    ]),
    getUnitList () {
      return this.formData.unitGroup ? this.measureUnitList.filter(f => f.groupId === this.formData.unitGroup) : []
    }
  },
  watch: {
    'formData.unitGroup': {
      handler () {
        if (this.formData.unitGroup !== this.oldData.unitGroup) {
          let gData = this.measureUnitGroupList.find(f => f._id === this.formData.unitGroup)
          let uData = this.getUnitList.find(f => gData.defaultValue && gData.defaultValue === f._id)
          if (!uData && this.getUnitList.length) uData = this.getUnitList[0]
          if (uData) {
            this.formData.unitId = uData._id
          }
        }
      },
      deep: true
    },
    'formData.unitId': {
      handler () {
        if (this.formData.unitId !== this.oldData.unitId) {
          let uData = this.measureUnitList.find(f => f._id === this.formData.unitId)
          if (uData) {
            this.formData.unit = uData.name
            this.formData.measureUnit.conversion = [uData]
          }
        }
      },
      immediate: true,
      deep: true
    },
    'formData.character.batch': {
      handler () {
        if (this.formData.character.batch) {
          this.formData.character.serialNumber = false
        }
      },
      deep: true
    },
    'formData.character.serialNumber': {
      handler () {
        if (this.formData.character.serialNumber) {
          this.formData.character.batch = false
          this.formData.character.shelfLife = false
        }
      },
      deep: true
    },
    'formData.character.shelfLife': {
      handler () {
        if (this.formData.character.shelfLife) {
          this.formData.character.batch = true
          this.formData.character.serialNumber = false
        }
      },
      deep: true
    },
    'formData.holdings.which': {
      handler () {
        if (this.formData.holdings.which === 'unified') {
          this.formData.holdings.auxiliarySetting = false
        }
      },
      deep: true
    },
    'formData.holdings.auxiliarySetting': {
      handler (val, oldVal) {
        if (val && this.formData.character.auxiliaryData.content.length === 0) {
          this.$nextTick(() => {
            this.$set(this.formData.holdings, 'auxiliarySetting', false)
          })
          this.$Message.error('请先填写商品特性-辅助属性管理')
        } else {
          this.pointsColumns = [
            {
              title: '操作',
              width: 150,
              slot: 'action',
              align: 'center'
            },
            {
              title: '仓库名称',
              slot: 'warehouse',
              width: 200
            },
            {
              title: '最低库存数量',
              key: 'minimum',
              width: 150
            },
            {
              title: '最高库存数量',
              key: 'maximum',
              width: 150
            },
            {
              title: '安全库存数量',
              key: 'safety',
              width: 150
            }
          ]
          if (val) {
            this.pointsColumns.splice(2, 0, {
              title: '辅助属性',
              key: 'auxiliary',
              width: 200
            })
          }
        }
      },
      deep: true
    },
    auxiliaryGroupList: {
      handler () {
        if (!this.selectAGroupList.length) {
          this.selectAGroupList = JSON.parse(JSON.stringify(this.auxiliaryGroupList))
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    moment,
    show (type, data, addObj) {
      this.modal = true
      this.type = type
      this.formData = data ? Object.assign({}, data) : Object.assign({
        barcode: null,
        code: null,
        name: null,
        abbreviation: null,
        goodsType: '普通',
        unitGroup: null,
        unitId: null,
        unit: null,
        basicInfo: {
          // 基本信息
          brand: null, // 商品品牌
          specifications: null, // 规格型号
          wholesalePrice: null,
          retailPrice: null,
          placeOrigin: null,
          source: null,
          classificationCode: null,
          rate: null,
          registration: null,
          production: null,
          describe: null,
          des: null,
          custom: []
        },
        character: {
          // 商品特性
          batch: false,
          serialNumber: false,
          enable: false,
          shelfLife: false,
          auxiliary: false,
          subComponent: false,
          component: false,
          shelfLifeData: {
            shelfLifeDays: null,
            warningDays: null
          },
          auxiliaryData: {
            select: [],
            content: []
          }
        },
        measureUnit: {
          // 计量单位
          sales: null,
          purchasing: null,
          inventory: null,
          auxiliary: null,
          barcode: null,
          conversion: []
        },
        holdings: {
          // 库存资料
          defaultWarehouse: null,
          negativeInventory: false,
          inventoryManage: false,
          auxiliarySetting: false,
          which: 'unified',
          unified: {
            minimum: null,
            maximum: null,
            safety: null
          },
          points: []
        },
        purchase: {
          // 采购资料
          supplier: null,
          clerk: null,
          purchasing: null
        },
        picFiles: {
          // 图片附件
          mainImage: [],
          otherPictures: [],
          files: []
        },
        status: '启用'
      }, addObj)
      if (data) {
        this.oldData = data
        if (this.formData.basicInfo) {
          this.formData.basicInfo.custom.forEach((v, i) => {
            if (v.type === '日期') {
              this.$set(this.formData.basicInfo.custom[i], val, this.moment(v.val).format('YYYY-MM-DD'))
            }
          })
        }
      }
      this.$forceUpdate()
      this.$refs.formData.resetFields()
    },
    cancel () {
      this.modal = false
      this.type = ''
      this.oldData = {}
      this.$refs.formData.resetFields()
    },
    sure () {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          updateCommodityInfo(this.formData).then(res => {
            this.$Notice.success({
              title: '商品',
              desc: `成功${this.type}商品`
            })
            this.$emit('load')
            this.cancel()
          }).catch(err => {
            this.$Message.error(err.message)
          })
        }
      })
    },
    addCustomFun () {
      if (!this.addCustom) {
        this.$Message.error('请输入增加选项值')
      } else if (this.customForm.list.includes(this.addCustom)) {
        this.$Message.error('已存在该选项值')
      } else {
        this.customForm.list.push(this.addCustom)
        this.addCustom = ''
      }
    },
    saveCustom () {
      if (!this.customForm.title) {
        this.$Message.error('请输入字段名称')
      } else if (this.formData.basicInfo.custom.find(f => f.title === this.customForm.title)) {
        this.$Message.error('已存在该字段名称')
      } else {
        if (this.isCustomShow !== null) {
          if (this.isCustomShow === -1) {
            this.formData.basicInfo.custom.push(this.customForm)
          } else {
            this.formData.basicInfo.custom.splice(this.isCustomShow, 1, this.customForm)
          }
        }
        this.cancelCustom()
      }
    },
    cancelCustom () {
      this.isCustomShow = null
      this.customForm = {
        title: '',
        type: '文本框',
        list: [],
        val: null
      }
      this.addCustom = ''
    },
    setCustom (item, index) {
      this.customForm = item ? JSON.parse(JSON.stringify(item)) : {
        title: '',
        type: '文本框',
        list: [],
        val: null
      }
      this.isCustomShow = item ? index : -1
      this.addCustom = ''
    },
    selectAuxiliary () {
      if (!this.formData.code) {
        this.$Message.error('请先输入商品编码')
      } else if (this.formData.character.auxiliaryData.content.length) {
        this.$Message.error('要修改辅助属性大类，请先删除所有明细项')
      } else {
        this.selectModal = true
      }
    },
    createAuxiliary () {
      let select = this.formData.character.auxiliaryData.select
      let total = 0
      let isDo = true
      select.forEach(f => {
        let t = f.child.filter(c => c.selected).length
        if (t === 0) {
          isDo = false
          this.$Message.error(`辅助属性${f.name}不能为空,请选择`)
        } else {
          total += f.child.filter(c => c.selected).length
        }
      })
      if (total >= 100) {
        this.$Message.error('明细辅助属性已超过100')
      } else if (isDo) {
        let list = []
        let num = 1
        let doFun = (i, obj) => {
          select[i].child.forEach(f => {
            if (f.selected) {
              if (i < select.length - 1) {
                let addObj = {
                  auxiliaryList: []
                }
                addObj['val' + i] = f.name
                addObj.auxiliaryList[i] = f.name
                addObj = Object.assign(addObj, obj)
                doFun(i + 1, JSON.parse(JSON.stringify(addObj)))
              } else {
                let addObj = JSON.parse(JSON.stringify(obj))
                addObj.sku = this.formData.code + '_' + (num > 10 ? '00' + num : '0' + num)
                addObj['val' + i] = f.name
                addObj.auxiliaryList.push(f.name)
                addObj.auxiliary = addObj.auxiliaryList.join('/')
                addObj._index = num - 1
                list.push(addObj)
                num++
              }
            }
          })
        }
        doFun(0, {
          pic: [],
          auxiliary: '',
          sku: ''
        })
        this.formData.character.auxiliaryData.content = list
      }
    },
    deleteAuxiliary () {
      this.formData.character.auxiliaryData.content = this.formData.character.auxiliaryData.content.filter(item => !this.auxiliaryTableSList.includes(item._index))
    },
    selectAuxiliaryTable (list) {
      this.auxiliaryTableSList = list.map(v => v._index)
    },
    saveSelectAuxiliary () {
      let list = this.selectAGroupList.filter(f => f.selected)
      if (list.length > 5) {
        this.$Message.error('最多选5个辅助属性')
      } else {
        this.formData.character.auxiliaryData.select = list.map(m => {
          return {
            _id: m._id,
            name: m.name,
            child: this.auxiliaryList.filter(f => {
              if (f.groupId === m._id) {
                return {
                  _id: f._id,
                  name: f.name,
                  selected: false
                }
              }
            })
          }
        })
        this.auxiliaryColumns = [].concat([
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '图片',
            slot: 'pic',
            width: 100,
            align: 'center'
          }
        ], list.map((m, i) => {
          return {
            title: m.name,
            key: 'val' + i,
            width: 150,
            align: 'center'
          }
        }), [
          {
            title: '辅助属性',
            key: 'auxiliary',
            width: 200
          },
          {
            title: 'SKU代码',
            slot: 'sku',
            width: 200
          }
        ])
        this.selectModal = false
      }
    },
    addMeasureUnitTable () {
      if (!this.conversionForm._id || !this.conversionForm.equation) {
        this.$Message.error('请输入完整信息')
      } else {
        if (this.conversionForm._index >= 0) {
          this.formData.measureUnit.conversion.splice(this.conversionForm._index, 1, this.conversionForm)
        } else {
          this.formData.measureUnit.conversion.push(this.conversionForm)
        }
        this.conversionForm = {
          _id: null,
          equation: null
        }
      }
    },
    editMeasureUnitTable (row) {
      this.conversionForm = JSON.parse(JSON.stringify(row))
    },
    deleteMeasureUnitTable (index) {
      this.formData.measureUnit.conversion.splice(index, 1)
    },
    selectMU (id) {
      if (id) this.conversionForm = this.getUnitList.find(f => f._id === id)
      console.log(this.conversionForm)
    },
    addPoints () {
      console.log(this.formData.holdings.points)
      if (
        !this.pointsForm._id ||
        !this.pointsForm.maximum ||
        !this.pointsForm.minimum ||
        !this.pointsForm.safety ||
        (this.formData.holdings.auxiliarySetting && !this.pointsForm.auxiliary)) {
        this.$Message.error('请输入完整信息')
      } else if (this.formData.holdings.points.find(f => (
        f._id === this.pointsForm._id &&
        f.auxiliary === this.pointsForm.auxiliary &&
        (
          f._index !== this.pointsForm._index ||
          this.pointsForm._index === undefined
        )
      ))) {
        this.$Message.error('已存在该数据')
      } else {
        if (this.pointsForm._index >= 0) {
          this.formData.holdings.points.splice(this.pointsForm._index, 1, this.pointsForm)
        } else {
          this.pointsForm._index = this.formData.holdings.points.length
          this.formData.holdings.points.push(this.pointsForm)
        }
        this.pointsForm = {
          _id: null,
          maximum: null,
          minimum: null,
          safety: null,
          auxiliary: null
        }
      }
    },
    editPoints (row) {
      this.pointsForm = JSON.parse(JSON.stringify(row))
    },
    deletePoints (index) {
      this.formData.holdings.points.splice(index, 1)
    },
    rowClassName (row, index) {
      return index === this.currentRow ? 'active' : ''
    },
    rowClick (row, index) {
      this.currentRow = index
    }
  }
}
</script>

<style lang="less">
  .input_table {
    .text {
      padding-left: 8px;
    }
    .hover_layer {
      display: none;
    }

    .ivu-table-row:hover,
    .ivu-table-row.active {
      .text {
        display: none;
      }
      .hover_layer {
        display: block;
      }
    }
  }
</style>
