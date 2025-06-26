"use client"

import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useReducer
} from "react"

export enum ModalId {
  WAITING_TRANSACTION = "waiting_transaction",
  CONFIRM_FARM = "confirm_farm",
  FARM = "farm",
  TOKEN_PICKER = "token_picker",
  CANCEL_FARM_CONFIRM = "cancel_farm_confirm",
  CANCEL_FARM_PROCESSING = "cancel_farm_processing",
  CANCEL_FARM_SUCCESS = "cancel_farm_success",
  SUCCESS_FARM_TOAST = "success_farm_toast",
  FARM_APPROVE_PROCESSING = "farm_approve_processing",
  FARM_CREATION_PROCESSING = "farm_creation_processing"
}

enum ActionType {
  ADD = "add",
  REMOVE = "remove"
}

export interface ModalContextProps {
  closeModal: (id: ModalId) => void
  openModal: (id: ModalId) => void
  isModalOpen: (id: ModalId) => boolean
}

export const ModalContext = createContext<ModalContextProps>({
  closeModal: (id: ModalId) => {},
  openModal: (id: ModalId) => {},
  isModalOpen: (id: ModalId) => false
})

export interface ModalContextProviderProps {
  children: ReactNode
}

type Action = { id: ModalId; type: ActionType }

function ModalReducer(openModals: ModalId[], action: Action) {
  switch (action.type) {
    case ActionType.ADD: {
      return [...openModals, action.id]
    }
    case ActionType.REMOVE: {
      return openModals.filter((modal: string) => modal !== action.id)
    }
    default: {
      console.error("Unknown modal action: " + action.type)
      return openModals
    }
  }
}

export const ModalContextProvider = ({
  children
}: ModalContextProviderProps) => {
  const [openModals, dispatch] = useReducer(ModalReducer, [])

  const openModal = (modalId: ModalId) => {
    dispatch({
      type: ActionType.ADD,
      id: modalId
    })
  }

  const closeModal = (modalId: ModalId) => {
    dispatch({
      type: ActionType.REMOVE,
      id: modalId
    })
  }

  const modalContext = useMemo(() => {
    const isModalOpen = (modalId: ModalId) => openModals.includes(modalId)

    return {
      closeModal,
      openModal,
      isModalOpen
    }
  }, [openModals])

  return (
    <ModalContext.Provider value={modalContext}>
      {children}
    </ModalContext.Provider>
  )
}

export const useModalContext = () => useContext(ModalContext)
