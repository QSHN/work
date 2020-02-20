<template>
  <div style="margin: 30px;">
    <el-button type="info" plain size="small" style="margin-bottom: 10px;" @click="exportFun">导出</el-button>
    <el-table
      id="out-table"
      :data="tableData"
      :span-method="arraySpanMethod"
      :show-header="false"
      border
    >
      <el-table-column
        v-for="(v, i) in 9"
        :key="i"
        width="150"
      >
        <template slot-scope="scope">
          <template v-if="scope.row.column[i]">
            <div v-if="scope.row.column[i].html" :style="scope.row.style" v-html="scope.row.column[i].html" />
            <div v-else :style="scope.row.style">{{ scope.row.column[i].val }}</div>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { queryPurchaseContract } from '../../api/purchase'
import moment from 'moment'
import NP from 'number-precision'
export default {
  name: 'Export',
  data() {
    return {
      tableData: [],
      contract: {},
      spliceIndex: 21
    }
  },
  mounted() {
    this.loadContract()
  },
  methods: {
    loadContract() {
      queryPurchaseContract({ _id: this.$route.query.id }).then(res => {
        const contract = res[0]
        this.contract = contract
        this.tableData = [
          {
            style: {
              fontFamily: '宋体',
              fontSize: '20px',
              fontWeight: 'bolder',
              textAlign: 'center'
            },
            column: [
              { val: '全联集采水产品（广东）股份有限公司' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '20px',
              fontWeight: 'bolder',
              textAlign: 'center'
            },
            column: [
              { val: 'Quanlian Aquatic Products Collection (Guangdong) Co., Ltd.' }
            ]
          },
          {
            style: {
              fontFamily: '宋体',
              fontSize: '16px',
              textAlign: 'center'
            },
            column: [
              { val: '湛江开发区人民大道中34号开发区财政局5楼504房' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px',
              textAlign: 'center'
            },
            column: [
              { val: 'Room 504, 5th floor, Finance Bureau, No. 34 People\'s Avenue, Zhanjiang Development District,Guangdong' }
            ]
          },
          {
            style: {
              fontFamily: '宋体',
              fontSize: '20px',
              fontWeight: 'bolder',
              textAlign: 'center'
            },
            column: [
              { val: '采购合同' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '20px',
              fontWeight: 'bolder',
              textAlign: 'center'
            },
            column: [
              { val: 'PURCHASE CONTRACT' }
            ]
          },
          {
            style: {
              fontFamily: '宋体',
              fontSize: '16px'
            },
            column: [
              { val: '' },
              { val: '' },
              { val: '' },
              { val: '' },
              { val: '' },
              { val: '' },
              { val: '' },
              { val: '合同号CONTRACT NO.:' },
              { val: contract.temp.supplier.contractNumber }
            ]
          },
          {
            style: {
              fontFamily: '宋体',
              fontSize: '16px',
              textAlign: 'left'
            },
            column: [
              { val: '' },
              { val: '' },
              { val: '' },
              { val: '' },
              { val: '' },
              { val: '' },
              { val: '' },
              { val: '日期 DATE : ' },
              { val: moment(contract.temp.supplier.contractDate).format('YYYY-MM-DD') }
            ]
          },
          {
            style: {
              fontFamily: '宋体',
              fontSize: '16px'
            },
            column: [
              { val: '买方 (THE BUYER)：' },
              { html: `<div style="font-family: 'Times New Roman'">Quanlian Aquatic Products Collection (Guangdong) Co., Ltd.</div>` }
            ]
          },
          {
            style: {
              fontFamily: '宋体',
              fontSize: '16px'
            },
            column: [
              { val: `全联集采水产品（广东）股份有限公司` }
            ]
          },
          {
            style: {
              fontFamily: '宋体',
              fontSize: '16px'
            },
            column: [
              { val: `地址 (ADDRESS)：` },
              { html: `<div style="font-family: 'Times New Roman'">Room 504, 5th floor, Finance Bureau, No. 34 People's Avenue, Zhanjiang Development District,Guangdong</div>` }
            ]
          },
          {
            style: {
              fontFamily: '宋体',
              fontSize: '16px'
            },
            column: [
              { val: `湛江开发区人民大道中34号开发区财政局5楼504房` }
            ]
          },
          {
            style: {
              fontFamily: '宋体',
              fontSize: '16px'
            },
            column: [
              { val: '卖方 (THE SELLER)：' },
              { html: `<div style="font-family: 'Times New Roman'">${contract.temp.supplier.eName}</div>` }
            ]
          },
          {
            style: {
              fontFamily: '宋体',
              fontSize: '16px'
            },
            column: [
              { val: contract.temp.supplier.cName }
            ]
          },
          {
            style: {
              fontFamily: '宋体',
              fontSize: '16px'
            },
            column: [
              { val: `地址 (ADDRESS)：` },
              { html: `<div style="font-family: 'Times New Roman'">${contract.temp.supplier.eAddress}</div>` }
            ]
          },
          {
            style: {
              fontFamily: '宋体',
              fontSize: '16px'
            },
            column: [
              { val: contract.temp.supplier.cAddress }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: 'THE SELLER AGREES TO SELL AND THE BUYER AGREES TO BUY THE UNDER MENTIONED COMMODITY ACCORDING' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: 'TO THE TERMS AND CONDITIONS STATED BELOW（双方同意按照下列条款由卖方售出，买方购进下列货物）：' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: 'DESCRIPTIONS OF GOODS' },
              { val: 'SIZE' },
              { val: 'PACKING' },
              { html: 'QUANTITY (CARTONS)' },
              { html: 'NET WEIGHT（KGS）' },
              { html: 'UNIT PRICE（USD/KG）' },
              { html: 'AMOUNT (USD)' }
            ]
          },
          {
            style: {
              fontFamily: '宋体',
              fontSize: '16px'
            },
            column: [
              { val: '品名' },
              { val: '规格' },
              { val: '包装方式' },
              { html: '数量 (箱)' },
              { html: '净重 (公斤)' },
              { html: '单价 (美元/公斤）' },
              { html: '总值（美元）' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px',
              textAlign: 'right'
            },
            column: [
              { val: 'CFR ZHANJIANG PORT,CHINA' }
            ]
          }
        ]
        this.spliceIndex = 21
        let number = 0
        let weight = 0
        let totalAmount = 0
        contract.temp.contractTable.forEach(v => {
          number = NP.plus(number, v.number || 0)
          weight = NP.plus(weight, v.weight || 0)
          totalAmount = NP.plus(totalAmount, v.totalAmount || 0)
          this.tableData.splice(this.spliceIndex, 0, {
            style: {
              fontFamily: '宋体',
              fontSize: '16px'
            },
            column: [
              { val: v.goodsNameC },
              { val: v.specifications },
              { val: v.packingWay },
              { html: v.number },
              { html: v.weight },
              { html: v.dollarPrice },
              { html: v.totalAmount }
            ]
          })
          this.spliceIndex++
        })
        for (let i = contract.temp.contractTable.length; i < 4; i++) {
          this.tableData.splice(this.spliceIndex, 0, {
            style: {
              fontFamily: '宋体',
              fontSize: '16px'
            },
            column: [
              { val: '' },
              { val: '' },
              { val: '' },
              { html: '' },
              { html: '' },
              { html: '' },
              { html: '' }
            ]
          })
          this.spliceIndex++
        }
        this.tableData = this.tableData.concat([
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: 'TOTAL' },
              { val: '' },
              { val: '' },
              { val: '' },
              { val: '' },
              { val: number },
              { val: weight.toFixed(2) },
              { val: '' },
              { val: totalAmount.toFixed(2) }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: '1.数量及总值均有 10% 的增减。 AMOUNT AND QUANTITY  10 %  MORE OR LESS ALLOWED.' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: '2.包装。 PACKING：' + (contract.temp.supplier.packaging || '') }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: '3.货柜尺寸数量。 CONTAINER SIZE/QUANTITIES：*' + (contract.temp.supplier.containerNumber || '') }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: '4.装运期限。 TIME OF SHIPMENT: ' + (contract.temp.supplier.shipmentDate || '') }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: '5.装运港。 PORT OF SHIPMENT：ANY PORT, INDIA: ' + (contract.temp.supplier.sPort || '') }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: '6.目的港。 PORT OF DESTINATION: ' + (contract.temp.supplier.dPort || '') }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: '7.生产国别。 COUNTRY OF ORIGIN: ' + (contract.temp.supplier.productionCountry || '') }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: '8.保险：交货条件为CFR，由买方负责投保。' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: '9.标签。 LABEL' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: 'LABELLING THE ORIGIN COUNTRY, WEIGHT, PRODUCTION DATE, DESTINATION, PRODUCER\'S NAME, ADDRESS ' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: 'AND COUNTRY METHOD, PLANT REGISTER NO., EXPIRY DATE IN BOTH CHINESE AND ENGLISH OUTSIDE BOXES.' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: '10.支付条款：发货后收到扫描文件，TT全额货款。' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: 'TERMS OF PAYMENT:UPON RECEIPT OF THE SCANNING SHIPPING DOCUMENT AFTER SHIPPED,TT 100% ADVANCE PAYMENT.' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: '11.受益人银行信息。THE BANKING INFORMATIONN FOR THE BENEFICIARY.' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: '' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: '' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: '' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: '' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: '' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: '12.商品检验：产品要能通过中华人民共和国湛江出入境检验检疫局的检测。' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: 'INSPECTION: THE CARGOES SHOULD PASS THE INSPECTION CONDUCTED BY ZHANJIANG ENTRY-EXIT INSPECTION AND  ' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: 'QUANTINE BUREAU  OF THE PEOPLE\'S REPUBLIC OF CHINA.' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: '13.备注：如果产品未能通过中华人民共和国湛江出入境检验检疫局的检测,买方将把货物退回给卖方,并请卖方退还买方全部货款。' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: 'REMARKS： IF THE CARGOES ARE REJECTED BY  ZHANJIANG ENTRY-EXIT INSPECTION AND QUANTINE BUREAU OF THE PEOPLE\'S ' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: 'REPUBLIC OF CHINA,THE CARGOES WILL BE RETURNED TO THE SELLER AND THE PAYMENT OF THE CARGOES SHALL BE RETURN' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: 'TO THE BUYER. ' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: '' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: '买方:' },
              { val: '全联集采水产品（广东）股份有限公司' },
              { val: '' },
              { val: '卖方:' },
              { val: '' }
            ]
          },
          {
            style: {
              fontFamily: 'Times New Roman',
              fontSize: '16px'
            },
            column: [
              { val: 'THE BUYER:' },
              { val: 'Quanlian Aquatic Products Collection (Guangdong) Co., Ltd.' },
              { val: '' },
              { val: 'THE SELLER:' },
              { val: '' }
            ]
          }
        ])
      })
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      let result = null
      switch (rowIndex) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 16:
        case 17:
        case 20:
          result = [1, 9]
          break
        case 8:
        case 10:
        case 12:
        case 14:
          switch (columnIndex) {
            case 0:
              result = {
                rowspan: 2,
                colspan: 2
              }
              break
            case 1:
              result = [1, 7]
              break
          }
          break
        case 9:
        case 11:
        case 13:
        case 15:
          result = [1, 7]
          break
        case 18:
        case 19:
          switch (columnIndex) {
            case 0:
              result = [1, 3]
              break
          }
          break
      }
      const length = this.contract.temp.contractTable.length
      if (rowIndex < this.spliceIndex && rowIndex >= this.spliceIndex - (length <= 4 ? 4 : length)) {
        switch (columnIndex) {
          case 0:
            result = [1, 3]
            break
        }
      }
      const final = 53 + (length - 4 > 0 ? length - 4 : 0)
      if (rowIndex > this.spliceIndex && rowIndex < final) {
        switch (columnIndex) {
          case 0:
            result = [1, 9]
            break
        }
      }
      if (rowIndex >= final && rowIndex < final + 2) {
        switch (columnIndex) {
          case 1:
            result = [1, 4]
            break
        }
      }
      if (result) return result
    },
    exportFun() {
      this.$nextTick(() => {
        const base64 = function(s) {
          return window.btoa(unescape(encodeURIComponent(s)))
        }
        // 替换table数据和worksheet名字
        const format = function(s, c) {
          return s.replace(/{(\w+)}/g,
            function(m, p) {
              return c[p]
            })
        }
        const uri = 'data:application/vnd.ms-excel;base64,'
        const template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"' +
          'xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>' +
          '<x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets>' +
          '</x:ExcelWorkbook></xml><![endif]-->' +
          ' <style type="text/css">' +
          'table td {' +
          'width: 150px;' +
          'height: 40px;' +
          ' }' +
          '</style>' +
          '</head><body >{table}</body></html>'
        const ctx = { worksheet: 'sheet', table: document.getElementById('out-table').innerHTML }
        // console.log(format(template, ctx), document.getElementById('out-table').innerHTML)
        const url = uri + base64(format(template, ctx))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute(
          'download',
          `全联集采合同-${this.contract.temp.supplier.contractNumber}`
        )
        document.body.appendChild(link)
        link.click()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
