import { gp } from '@gp'

function clipboardSuccess(text: any) {
  gp.$message(
    `拷贝${text}成功`,
    'success',
    'ms-hey-message-success',
    false
  )
}

function clipboardError(text: any) {
  gp.$message(`拷贝${text}失败`, 'error', 'ms-hey-message-success', false)
}

/**
 * @description 复制数据
 * @param text
 */
export default function handleClipboard(text: string) {
  const { isSupported, copy } = useClipboard()
  if (!isSupported) {
    usePermission('clipboard-write')
  }
  copy(text)
    .then(() => {
      clipboardSuccess(text)
    })
    .catch((err) => {
      console.log(err)
      clipboardError(text)
    })
}
