/**
 * Modal/Dialog System - Barrel Export
 *
 * Re-exports all modal components and types
 *
 * @module components/ui/modal-dialog
 * @example
 * ```tsx
 * import { Modal, ModalHeader, ModalBody, ModalFooter, ModalCloseButton } from "@/components/ui/modal-dialog"
 *
 * <Modal isOpen={isOpen} onClose={handleClose} title="My Modal">
 *   <ModalBody>Content here</ModalBody>
 *   <ModalFooter>
 *     <button onClick={handleClose}>Close</button>
 *   </ModalFooter>
 * </Modal>
 * ```
 */

export { Modal, ModalHeader, ModalBody, ModalFooter, ModalCloseButton } from "./Modal"
export type {
  ModalProps,
  ModalSize,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
  ModalCloseButtonProps,
} from "./types"
