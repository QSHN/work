export default {
  state: {
    purchaseOrder: [],
    purchaseWarehouse: [],
    purchaseReturn: [],
    salesOrder: [],
    salesWarehouse: [],
    salesReturn: [],
    warehouseDiskDeficient: [],
    warehouseDiskSurplus: [],
    warehouseDiskPoint: [],
    warehouseIn: [],
    warehouseOut: [],
    warehouseReceipt: [],
    warehouseAllocatingIn: [],
    warehouseAllocatingOut: [],
    receivableCollection: [],
    receivablePayments: [],
    receivableRefund: [],
    receivableOther: [],
    receivableVerification: [],
    payableCollection: [],
    payablePayments: [],
    payableRefund: [],
    payableOther: []
  },
  getters: {
    purchaseOrder: state => state.purchaseOrder,
    purchaseWarehouse: state => state.purchaseWarehouse,
    purchaseReturn: state => state.purchaseReturn,
    salesOrder: state => state.salesOrder,
    salesWarehouse: state => state.salesWarehouse,
    salesReturn: state => state.salesReturn,
    warehouseDiskDeficient: state => state.warehouseDiskDeficient,
    warehouseDiskSurplus: state => state.warehouseDiskSurplus,
    warehouseDiskPoint: state => state.warehouseDiskPoint,
    warehouseIn: state => state.warehouseIn,
    warehouseOut: state => state.warehouseOut,
    warehouseReceipt: state => state.warehouseReceipt,
    warehouseAllocatingIn: state => state.warehouseAllocatingIn,
    warehouseAllocatingOut: state => state.warehouseAllocatingOut,
    receivableCollection: state => state.receivableCollection,
    receivablePayments: state => state.receivablePayments,
    receivableRefund: state => state.receivableRefund,
    receivableOther: state => state.receivableOther,
    receivableVerification: state => state.receivableVerification,
    payableCollection: state => state.payableCollection,
    payablePayments: state => state.payablePayments,
    payableRefund: state => state.payableRefund,
    payableOther: state => state.payableOther
  },
  mutations: {
    setListNav (state, { type, list }) {
      state[type] = list
      localStorage.setItem(type, JSON.stringify(list))
    }
  }
}
