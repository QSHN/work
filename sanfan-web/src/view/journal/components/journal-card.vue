<template>
  <div @click="detail()"
       class="journal-block">
    <Card class="journal-item">
      <div class="journal-head"
           slot="title">
        <div class="item-name">{{createName}} {{createdAtFormat}} 的 {{typeStr}}</div>
        <div class="item-status"
             :class="statusClass">{{statusTitle}}</div>
      </div>
      <div class="journal-content">
        <div class="item-content">{{content}}</div>
      </div>
    </Card>
  </div>
</template>
<script>
import moment from 'dayjs'

const DAILYTYPES = {
  'DAILY': '日报', 'WEEKLY': '周报', 'MONTHLY': '月报'
}

// 日报状态
const STATUS_TYPES = {
  'READ': { title: '已读', class: 'item-status-g' },
  'UNREAD': { title: '未读', class: 'item-status-r' },
  'PASS': { title: '通过', class: 'item-status-b' },
  'NOPASS': { title: '驳回', class: 'item-status-o' }
}

export default {
  name: 'JouranlCard',
  props: {
    'id': {
      type: String,
      default: () => ''
    },
    'createName': {
      type: String,
      default: () => ''
    },
    'dailyType': {
      type: String,
      default: () => ''
    },
    'createTime': {
      type: String,
      default: () => ''
    },
    'content': {
      type: String,
      default: () => ''
    },
    'comment': {
      type: String,
      default: () => ''
    },
    'dailyStatus': {
      type: String,
      default: () => ''
    }

  },
  methods: {
    detail () {
      console.log('go to journal detail', this.id)
      this.$emit('detail', Object.assign({}, this.$props))
    }
  },
  computed: {
    createdAtFormat () {
      return moment(this.createTime).format('M月D日HH时')
    },
    statusClass () {
      return (STATUS_TYPES[this.dailyStatus] && STATUS_TYPES[this.dailyStatus].class) || ''
    },
    statusTitle () {
      return (STATUS_TYPES[this.dailyStatus] && STATUS_TYPES[this.dailyStatus].title) || ''
    },
    typeStr () {
      return DAILYTYPES[this.dailyType] || ''
    }

  }
}
</script>
<style lang="less">
.journal-item {
  min-width: 250px;
  max-width: 600px;
  width: 300px;
}

.journal-head,
.journal-executor,
.journal-content {
  display: flex;
  justify-content: space-between;
}

.journal-head {
  font-weight: 500;
  color: #666;

  .item-status-l {
    color: #01b38b;
  }

  .item-status-g {
    color: #01b38b;
  }

  .item-status-r {
    color: #ff715a;
  }

  .item-status-o {
    color: #ffab00;
  }

  .item-status-b {
    color: #666666;
  }
}

.journal-content {
  color: rgba(153, 153, 153, 1);

  .item-content {
    width: 100%;
    font-size: 12px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
