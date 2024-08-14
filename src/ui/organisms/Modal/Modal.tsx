import React, { forwardRef, type ReactNode } from "react";

// Typy dla propsów komponentu Modal
interface ModalProps {
	children: ReactNode;
}

const Modal = forwardRef<HTMLDialogElement, ModalProps>(({ children }, ref) => {
	return (
		<dialog ref={ref} className="modal">
			<div className="modal-box w-11/12 max-w-5xl">{children}</div>
			<form method="dialog" className="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
	);
});

Modal.displayName = "Modal";

export default Modal;
