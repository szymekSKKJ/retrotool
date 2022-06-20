import './CreateOrJoinRoom.css';
import Button from '../../../custom_elements/Button/Button';
import CreateModal, { closeModal } from '../../CreateModal/CreateModal';
import { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebaseInitialize';

const CreateOrJoinRoom = () => {
	const [isModalOpenForCreatingRoom, setIsModalOpenForCreatingRoom] = useState(false);

	const copyRoomLink = (paragraphElement) => {
		const selection = window.getSelection();
		const range = document.createRange();
		range.selectNodeContents(paragraphElement);
		selection.removeAllRanges();
		selection.addRange(range);
		navigator.clipboard.writeText(paragraphElement.innerHTML);
		setTimeout(() => {
			selection.removeAllRanges();
		}, 200);
	};

	const isEmpty = (str) => !str.trim().length;

	const guidGenerator = () => {
		const S4 = function () {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		};
		return S4() + S4() + S4() + S4();
	};

	const createRoom = async () => {
		const username = document.querySelector('.create-or-join-room #username-in-CreateOrJoinRoom').value;
		const generatedLinkElement = document.querySelector('.create-or-join-room .creating-room .generated-link');
		const roomId = guidGenerator();
		generatedLinkElement.innerHTML = `https://retrotool.netlify.app/?room=${roomId}`;
		await setDoc(doc(db, 'rooms', roomId), {
			admin: username,
		});
	};

	useEffect(() => {
		if (isModalOpenForCreatingRoom === true) {
			createRoom();
		}
	}, [isModalOpenForCreatingRoom]);

	return (
		<div className="create-or-join-room">
			{isModalOpenForCreatingRoom && (
				<CreateModal title="Pokój został utworzony!" stateForModal={setIsModalOpenForCreatingRoom}>
					<div className="creating-room">
						<p>O to link do Twojego pokoju:</p>
						<p className="generated-link" onClick={(event) => copyRoomLink(event.target)}></p>
						<p>Zachowaj go i dziel się z innymi użytkownikami, aby mogli dołączyć do pokoju!</p>
						<Button
							action={(event) =>
								closeModal(
									setIsModalOpenForCreatingRoom,
									event.target.parentElement.parentElement.parentElement
								)
							}
							customStyles={{ marginTop: '25px' }}
						>
							Gotowe!
						</Button>
					</div>
				</CreateModal>
			)}
			<input type="text" id="username-in-CreateOrJoinRoom" placeholder="Podaj swoją nazwę"></input>
			<p>
				Wybrana przez Ciebie nazwa użytkownika będzie założycielem pokoju i będzie miała najwyższe uprawnienia
			</p>
			<Button
				action={(event) => {
					const username = event.target.parentElement.querySelector(
						'.create-or-join-room #username-in-CreateOrJoinRoom'
					).value;

					if (!isEmpty(username)) {
						setIsModalOpenForCreatingRoom(true);
					}
				}}
				customStyles={{ width: '300px' }}
			>
				Utwórz nowy pokój
			</Button>
		</div>
	);
};

export default CreateOrJoinRoom;
