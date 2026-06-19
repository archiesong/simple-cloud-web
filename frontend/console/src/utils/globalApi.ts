import { Modal, message } from 'antdv-next'

type MessageInstance = ReturnType<typeof message.useMessage>[0]

type ModelInstance = ReturnType<typeof Modal.useModal>[0]

let globalModal: ModelInstance | null = null
let globalMessage: MessageInstance | null = null

export const setGlobalApi = (options: { modal: ModelInstance; message: MessageInstance }) => {
  globalMessage = options.message
  globalModal = options.modal
}

export const getGlobalApi = () => {
  return {
    Modal: globalModal,
    Message: globalMessage,
  }
}