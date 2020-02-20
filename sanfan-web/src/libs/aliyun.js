import OSS from 'ali-oss'
import { dataURItoBlob } from './util'
import { getOssRole } from '@/api/common'

let setting = {}
let signatureUrls = {}
let oss = null

function isOutdated () {
  if (!oss) {
    return true
  }
  let expiration = (setting && setting.expiration) || ''
  return !expiration || (Date.parse(expiration) < (Date.now()))
}
async function refresh () {
  // oss is still valid
  try {
    if (!isOutdated()) {
      return true
    }

    console.info('refreshing oss setting...')

    // clean up everything
    setting = {}
    signatureUrls = {}
    oss = null

    // reload role credentials
    let res = await getOssRole()

    if (!res.data || !res.data.accessKeyId || !res.data.securityToken) {
      throw new Error('invalid oss settings')
    } else {
      setting = res.data
      oss = new OSS({
        accessKeyId: setting.accessKeyId,
        accessKeySecret: setting.accessKeySecret,
        bucket: setting.bucketName,
        endpoint: setting.endpoint,
        expiration: setting.expiration,
        stsToken: setting.securityToken
      })
    }
  } catch (err) {
    console.error(err)
    setting = {}
    oss = null
  }
} // refresh()

function getSignUrl (f, cb) {
  if (!f) {
    return f
  }

  // return cached url
  if (!isOutdated() && signatureUrls[f]) {
    cb(signatureUrls[f])
    return
  }

  // fetch new signature url
  refresh().then(() => {
    try {
      if (!oss) {
        throw new Error('invalid oss connection detected')
      }
      let signUrl = oss.signatureUrl(f, { expires: 3600 * 24 * 30 }) // 一个月
      signatureUrls[f] = signUrl
      cb(signUrl)
    } catch (err) {
      console.error(err)
      cb(err)
    }
  })
} // getSignUrl()

function upload (dataUrl, cb, remoteFileName) {
  refresh().then(() => {
    if (!oss) {
      cb(new Error('Invalid oss connection detected'))
      return
    }
    let fileBlob = dataURItoBlob(dataUrl)
    console.log(remoteFileName, oss)

    oss.put(remoteFileName, fileBlob).then((ret) => {
      console.debug('successfully upload file', remoteFileName)
      cb(remoteFileName)
    }).catch((err) => {
      console.error('upload', err)
      cb(err)
    })
  })
} // upload()

function selectAndUpload (onSelected, onUploaded, type, fileKey) {
  // 模拟input点击事件
  var evt = new MouseEvent('click', { bubbles: false, cancelable: true, view: window })
  var inputNode = document.createElement('input')
  inputNode.type = 'file'
  if (type)inputNode.accept = type
  inputNode.style.display = 'none'
  document.body.insertBefore(inputNode, document.body.firstElementChild)
  inputNode.addEventListener('change', change)
  inputNode.dispatchEvent(evt)

  function change () {
    let filename = (this.files && this.files[0] && this.files[0].name) || ''
    if (!filename) return
    let file = this.files[0]
    onSelected(file)
    // 不允许上传大于10M文件
    if (file.size >= (1024 * 1024 * 100)) {
      onUploaded(new Error('不允许上传大于100M文件'))
      return
    }
    let fr = new FileReader()
    fr.onload = function (event) {
      upload(event.target.result, onUploaded, (fileKey || '') + filename)
    }
    fr.onerror = function (error) {
      console.error(error)
      onUploaded(error)
    }
    fr.readAsDataURL(this.files[0])

    var parentNode = inputNode.parentNode
    if (parentNode) parentNode.removeChild(inputNode)
  }

  // let html = '<input type="file" style="display: none">';
  // $(html).change(change).click();
}

function getPreviewUrl (target, cb) {
  refresh().then(() => {
    // expected target format: "oss://hawkbet/converttask/browser_1548840153278_docx"
    let url = 'http://sanfanerp-public.oss-cn-shenzhen.aliyuncs.com/avatar/' + target.split('/').pop()
    let accessKeyId = setting.credentials.AccessKeyId
    let accessKeySecret = setting.credentials.AccessKeySecret
    let stsToken = setting.securityToken.replace(/\+/g, '%2B')
    let bucket = setting.bucket
    let region = setting.region
    if (cb) {
      const previewUrl = `https://preview.imm.aliyun.com/index.html?url=${url}&accessKeyId=${accessKeyId}&accessKeySecret=${accessKeySecret}&stsToken=${stsToken}&bucket=${bucket}&region=${region}`
      cb(previewUrl)
    }
  })
}

function loadAvatar (avatar, cb) {
  if (!avatar) {
    cb(null)
    return
  }
  getSignUrl(avatar, (urlOrErr) => {
    if (urlOrErr instanceof Error) {
      cb(null)
    } else {
      cb(urlOrErr)
    }
  })
}
export {
  getSignUrl,
  upload,
  selectAndUpload,
  refresh,
  getPreviewUrl,
  loadAvatar
}
