import { getSignUrl, getPreviewUrl } from '../../../libs/aliyun'

function getSignUrlPromise (avatar) {
  return new Promise((resolve, reject) => {
    if (!avatar) return resolve(null)

    getSignUrl(avatar, urlOrErr => {
      if (urlOrErr instanceof Error) {
        reject(urlOrErr)
      } else {
        resolve(urlOrErr)
      }
    })
  })
}

function getPreviewUrlPromise (previewID) {
  return new Promise((resolve, reject) => {
    if (!previewID) return resolve(null)

    getPreviewUrl(previewID, urlOrErr => {
      if (urlOrErr instanceof Error) {
        reject(urlOrErr)
      } else {
        resolve(urlOrErr)
      }
    })
  })
}

const CONVERSTION_TYPES = [
  { key: 'PRIVATE', value: 1 },
  { key: 'DISCUSSION', value: 2 },
  { key: 'GROUP', value: 3 },
  { key: 'CHATROOM', value: 4 },
  { key: 'CUSTOMER_SERVICE', value: 5 },
  { key: 'SYSTEM', value: 6 },
  { key: 'APP_PUBLIC_SERVICE', value: 7 },
  { key: 'PUBLIC_SERVICE', value: 8 }
]

function getConversationKey (type) {
  let tp = typeof type
  if (tp === 'string') {
    // String 类型直接返回
    return tp
  } else {
    return CONVERSTION_TYPES.find(t => t.value === type).key || 'PRIVATE'
  }
}

function fileType (fileName) {
  if (!fileName || typeof fileName !== 'string') return ''
  let parts = fileName.split('.')
  if (parts.length > 1) return parts.pop()
  return ''
}

const FILE_TYPES_IMAGES = [
  {
    types: ['doc', 'dot', 'wps', 'wpt', 'docx', 'dotx', 'docm', 'dotm'],
    img: require('../../../assets/images/files/icon_document_word_blue@2x.png')
  },
  {
    types: [
      'xls',
      'xlt',
      'et',
      'ett',
      'xlsx',
      'xltx',
      'csv',
      'xlsm',
      'xlsm',
      'xltm'
    ],
    img: require('../../../assets/images/files/icon_document_excel_green@2x.png')
  },
  {
    types: ['pdf'],
    img: require('../../../assets/images/files/icon_document_pdf_pink@2x.png')
  },
  {
    types: ['gif', 'png', 'jpg', 'jpeg'],
    img: require('../../../assets/images/files/icon_document_picture_orange@2x.png')
  },
  {
    types: [
      'pptx',
      'ppt',
      'pot',
      'potx',
      'pps',
      'ppsx',
      'dps',
      'dpt',
      'pptm',
      'potm',
      'ppsm'
    ],
    img: require('../../../assets/images/files/icon_document_ppt_red@2x.png')
  },
  {
    types: ['txt', 'log', 'lrc', 'rtf', 'xml', 'htm', 'html'],
    img: require('../../../assets/images/files/icon_document_txt_purple@2x.png')
  },
  {
    types: ['zip', '7z', 'rar'],
    img: require('../../../assets/images/files/icon_document_zip_multicolor@2x.png')
  }
]

const UNKONWN_FILE_TYPE_IMAGE = require('../../../assets/images/files/icon_document_unknown_gray@2x.png')

function fileIcon (ext) {
  for (let i = 0; i < FILE_TYPES_IMAGES.length; i++) {
    if (FILE_TYPES_IMAGES[i].types.includes(ext)) {
      return FILE_TYPES_IMAGES[i].img
    }
  }
  // return compressed file icon by default
  return UNKONWN_FILE_TYPE_IMAGE
}

function fileSize (fileByte) {
  var fileSizeByte = parseInt(fileByte)
  var fileSizeMsg = ''

  if (fileSizeByte < 1048576) {
    fileSizeMsg = (fileSizeByte / 1024).toFixed(2) + 'KB'
  } else if (fileSizeByte === 1048576) {
    fileSizeMsg = '1MB'
  } else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824) {
    fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(2) + 'MB'
  } else if (fileSizeByte > 1048576 && fileSizeByte === 1073741824) {
    fileSizeMsg = '1GB'
  } else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776) {
    fileSizeMsg = (fileSizeByte / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
  } else {
    fileSizeMsg = '文件超过1TB'
  }
  return fileSizeMsg
}

const PREVIEW_FILE_TYPE = [
  'pptx',
  'ppt',
  'pot',
  'potx',
  'pps',
  'ppsx',
  'dps',
  'dpt',
  'pptm',
  'potm',
  'ppsm',
  'xls',
  'xlt',
  'et',
  'ett',
  'xlsx',
  'xltx',
  'csv',
  'xlsb',
  'xlsm',
  'xltm',
  'doc',
  'dot',
  'wps',
  'wpt',
  'docx',
  'dotx',
  'docm',
  'dotm',
  'pdf',
  'lrc',
  'c',
  'cpp',
  'h',
  'asm',
  's',
  'java',
  'asp',
  'bat',
  'bas',
  'prg',
  'cmd',
  'rtf',
  'txt',
  'log',
  'xml',
  'htm',
  'html'
]

const IMAGE_FILE_TYPE = ['gif', 'png', 'jpg', 'jpeg']

function canPreview (fileType) {
  return PREVIEW_FILE_TYPE.includes(fileType)
}

function isImage (fileType) {
  return IMAGE_FILE_TYPE.includes(fileType)
}

export {
  getSignUrlPromise,
  getPreviewUrlPromise,
  fileType,
  fileIcon,
  fileSize,
  canPreview,
  isImage,
  getConversationKey
}
