<style scoped>
  .expand-row{
    margin-bottom: 16px;
  }
</style>
<template>
  <div>
    <Row class="expand-row">
      <Col span="8">
        <span class="expand-key">凭证字: </span>
        <span class="expand-value">{{ row.voucherWord }}</span>
      </Col>
      <Col span="8">
        <span class="expand-key">凭证号: </span>
        <span class="expand-value">{{ row.voucherNo }}</span>
      </Col>
      <Col span="8">
        <span class="expand-key">类别: </span>
        <span class="expand-value">{{ row.category }}</span>
      </Col>
    </Row>
    <Row class="expand-row">
      <Col span="8">
        <span class="expand-key">往来业务: </span>
        <span class="expand-value">{{ row.dealing }}</span>
      </Col>
      <Col span="8">
        <span class="expand-key">记账方式: </span>
        <span class="expand-value">{{ row.chargeType }}</span>
      </Col>
      <Col span="8">
        <span class="expand-key">商家: </span>
        <span class="expand-value">{{ row.customer }}</span>
      </Col>
    </Row>
    <Row>
      <Col span="8">
        <span class="expand-key">摘要（用途）: </span>
        <span class="expand-value">{{ row.remark }}</span>
      </Col>
      <Col span="8">
        <span class="expand-key">科目: </span>
        <span class="expand-value">{{ row.subject }}</span>
      </Col>
      <Col span="8">
        <span class="expand-key">关键词: </span>
        <span class="expand-value">{{ row.keyword }}</span>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  props: {
    row: Object
  }
}
</script>
