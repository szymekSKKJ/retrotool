import './CreateModal.css';
import Button from '../../custom_elements/Button/Button';
import { useEffect } from 'react';

//Exporting closeModal to use it outside component

export const closeModal = (stateForModal, modalElement) => {
	modalElement.style.opacity = '1';
	modalElement.style.animation = 'unset';
	setTimeout(() => {
		modalElement.style.animation = 'apear-modal 250ms forwards reverse';
		setTimeout(() => {
			stateForModal(false);
		}, 250); //Animation time
	}, 1);
};

const CreateModal = ({ title, children, stateForModal }) => {
	useEffect(() => {
		const firstInput = document.querySelectorAll('.create-modal input')[0];
		if (firstInput) {
			firstInput.focus();
		}
	}, []);

	return (
		<div className="create-modal" onClick={(event) => closeModal(stateForModal, event.target)}>
			<div className="content" onClick={(event) => event.stopPropagation()}>
				<h1>{title}</h1>
				{children}
			</div>
		</div>
	);
};

export default CreateModal;
