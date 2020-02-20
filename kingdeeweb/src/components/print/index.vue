<template>
  <Modal
    v-model="modal"
    title="预览/打印"
    :mask-closable="false"
    :styles="{top: '20px'}"
    width="1320"
    @on-cancel="cancel">

    <div style="background: #F0F0F0;">
      <div :id="'print_' + printType">
        <template v-if="printType === 'credentials'">
          <div v-for="(item, index) in Math.ceil(printData.child.length / 5)" :key="index"  :style="{
              'page-break-after': Math.ceil(printData.child.length / 5) > 1 ? 'always' : 'auto'
            }">
            <credentials :printData="printData" :page="index" :total="Math.ceil(printData.child.length / 5)" :subjectList="subjectList" />
          </div>
        </template>
        <template v-else-if="printType === 'credentialsList'">
          <div v-for="(v, i) in printList" :key="i">
            <div v-for="(item, index) in Math.ceil(v.child.length / 5)" :key="index" :style="{
              height: isPrintMore ? '50%' : '100%',
              'page-break-after': (isPrintMore && getAllLength(i, index)) ? 'always' : 'auto'
            }">
              <credentials :printData="v" :page="index" :total="Math.ceil(v.child.length / 5)" :subjectList="subjectList" />
            </div>
          </div>
        </template>
        <template v-else-if="printType === 'profit'">
          <profit :printList="printList" :period="period" />
        </template>
        <template v-else-if="printType === 'custom'">
          <custom :printList="printList" :period="period" />
        </template>
        <template v-else-if="printType === 'ownerEquity'">
          <ownerEquity :printList="printList" :period="period" />
        </template>
        <template v-else-if="printType === 'balanceSheet'">
          <balanceSheet :printList="printList" :period="period" />
        </template>
        <template v-else-if="printType === 'accountBalance'">
          <accountBalance :printList="printList" :period="period" />
        </template>
        <template v-else-if="printType === 'generalLedger'">
          <div v-for="(v, i) in printList" :key="i" style="page-break-after: always;" >
            <generalLedger :printData="v" :period="period" />
          </div>
        </template>
        <template v-else-if="printType === 'subjectDetail'">
          <subjectDetail :printData="printData" :period="period" />
        </template>
        <template v-else-if="printType === 'purchaseReportDetail'">
          <purchaseReportDetail :printList="printList" :supplierList="supplierList" :departmentList="departmentList" :warehouseList="warehouseList"  :clerkList="clerkList" />
        </template>
        <template v-else-if="printType === 'purchaseReportSummary'">
          <purchaseReportSummary :printList="printList" />
        </template>
        <template v-else-if="printType === 'purchaseReportTracking'">
          <purchaseReportTracking :printList="printList" :supplierList="supplierList" :departmentList="departmentList" :warehouseList="warehouseList"  :clerkList="clerkList" />
        </template>
        <template v-else-if="printType === 'salesReportDetail'">
          <salesReportDetail :printList="printList" :customerList="customerList" :departmentList="departmentList" :warehouseList="warehouseList"  :clerkList="clerkList" />
        </template>
        <template v-else-if="printType === 'salesReportPSummary'">
          <salesReportPSummary :printList="printList" />
        </template>
        <template v-else-if="printType === 'salesReportRanking'">
          <salesReportRanking :printList="printList" />
        </template>
        <template v-else-if="printType === 'salesReportSummary'">
          <salesReportSummary :printList="printList" />
        </template>
        <template v-else-if="printType === 'salesReportTracking'">
          <salesReportTracking :printList="printList" :customerList="customerList" :departmentList="departmentList" :warehouseList="warehouseList"  :clerkList="clerkList" />
        </template>
        <template v-else-if="printType === 'warehouseReportQuery'">
          <warehouseReportQuery :printList="printList" />
        </template>
        <template v-else-if="printType === 'warehouseReportAvailable'">
          <warehouseReportAvailable :printList="printList" />
        </template>
        <template v-else-if="printType === 'warehouseReportDetail'">
          <warehouseReportDetail :printList="printList" />
        </template>
        <template v-else-if="printType === 'warehouseReportSummary'">
          <warehouseReportSummary :printList="printList" />
        </template>
        <template v-else-if="printType === 'receivableReportDetail'">
          <receivableReportDetail :printList="printList" :customerList="customerList" :departmentList="departmentList" :clerkList="clerkList" />
        </template>
        <template v-else-if="printType === 'payableReportDetail'">
          <payableReportDetail :printList="printList" :supplierList="supplierList" :departmentList="departmentList" :clerkList="clerkList" />
        </template>
      </div>
    </div>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">打印</Button>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { querySubject } from '../../api/subject'
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
import credentials from './credentials'
import profit from './profit'
import custom from './custom'
import ownerEquity from './ownerEquity'
import balanceSheet from './balanceSheet'
import accountBalance from './accountBalance'
import generalLedger from './generalLedger'
import subjectDetail from './subjectDetail'
import purchaseReportDetail from './purchaseReportDetail'
import purchaseReportSummary from './purchaseReportSummary'
import purchaseReportTracking from './purchaseReportTracking'
import salesReportDetail from './salesReportDetail'
import salesReportPSummary from './salesReportPSummary'
import salesReportRanking from './salesReportRanking'
import salesReportSummary from './salesReportSummary'
import salesReportTracking from './salesReportTracking'
import warehouseReportQuery from './warehouseReportQuery'
import warehouseReportAvailable from './warehouseReportAvailable'
import warehouseReportDetail from './warehouseReportDetail'
import warehouseReportSummary from './warehouseReportSummary'
import receivableReportDetail from './receivableReportDetail'
import payableReportDetail from './payableReportDetail'
export default {
  name: 'print',
  components: {
    credentials,
    profit,
    ownerEquity,
    balanceSheet,
    accountBalance,
    generalLedger,
    subjectDetail,
    custom,
    purchaseReportDetail,
    purchaseReportSummary,
    purchaseReportTracking,
    salesReportDetail,
    salesReportPSummary,
    salesReportRanking,
    salesReportSummary,
    salesReportTracking,
    warehouseReportQuery,
    warehouseReportAvailable,
    warehouseReportDetail,
    warehouseReportSummary,
    receivableReportDetail,
    payableReportDetail
  },
  props: {
    printData: {
      type: Object
    },
    printType: {
      type: String,
      required: true
    },
    printList: {
      type: Array
    },
    period: {
      type: Object
    },
    isPrintMore: {
      type: Boolean,
      default: false
    },
    paper: {
      type: String,
      default: 'a4'
    },
    supplierList: Array,
    departmentList: Array,
    warehouseList: Array,
    clerkList: Array,
    customerList: Array
  },
  data () {
    return {
      modal: false,
      subjectList: [],
      interval: null
    }
  },
  computed: {
    ...mapGetters([
      'accountSet'
    ])
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.loadSubject()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    show () {
      if (
        this.printType === 'credentials' ||
        this.printType === 'credentialsList' ||
        this.printType === 'generalLedger' ||
        this.printType === 'subjectDetail' ||
        this.printType === 'accountBalance'
      ) {
        if (this.interval) clearInterval(this.interval)
        if (this.subjectList.length) {
          this.sure()
        } else {
          this.interval = setInterval(() => {
            if (this.subjectList.length) {
              this.sure()
              clearInterval(this.interval)
            }
          }, 300)
        }
      } else {
        this.modal = true
      }
    },
    cancel () {
      this.modal = false
    },
    sure () {
      if (
        this.printType === 'credentials' ||
        this.printType === 'credentialsList' ||
        this.printType === 'generalLedger' ||
        this.printType === 'subjectDetail' ||
        this.printType === 'accountBalance'
      ) {
        let id = '#print_' + this.printType
        $(id).printArea()
      } else {
        html2Canvas(document.querySelector('#print_' + this.printType), {
          allowTaint: true
        }).then(async (canvas) => {
          let contentWidth = canvas.width
          let contentHeight = canvas.height
          let pageHeight = contentWidth / 592.28 * 841.89
          let leftHeight = contentHeight
          let position = 0
          let imgWidth = 595.28
          let imgHeight = 592.28 / contentWidth * contentHeight
          let pageData = await canvas.toDataURL('image/jpeg', 1.0)
          let PDF = new JsPDF('', 'pt', this.paper)
          if (leftHeight < pageHeight) {
            PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
          } else {
            while (leftHeight > 0) {
              PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
              leftHeight -= pageHeight
              position -= 841.89
              if (leftHeight > 0) {
                PDF.addPage()
              }
            }
          }
          PDF.setProperties({
            title: 'PDF Title',
            subject: 'Info about PDF',
            author: 'PDFAuthor',
            keywords: 'generated, javascript, web 2.0, ajax',
            creator: 'My Company'
          })
          PDF.output('dataurlnewwindow')
        })
      }
    },
    loadSubject () {
      querySubject({ accountSetId: this.accountSet._id }).then(res => {
        this.subjectList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '科目',
          desc: err.message
        })
      })
    },
    getAllLength (i, index) {
      let total = 0
      this.printList.forEach((v, fIndex) => {
        if (fIndex < i) {
          let fTotal = Math.ceil(v.child.length / 5)
          total = fTotal + total
        } else if (fIndex === i) {
          total += (index + 1)
        }
      })
      return total % 2 === 0
    }
  },
  destroyed () {
    if (this.interval) clearInterval(this.interval)
  }
}
</script>

<style lang="less" scoped>
</style>
