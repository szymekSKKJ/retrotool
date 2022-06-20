import { useEffect, useState } from 'react';
import './App.css';
import CreateOrJoinRoom from './CreateOrJoinRoom/CreateOrJoinRoom';
import CreateModal, { closeModal } from '../CreateModal/CreateModal';
import firebaseInitialize from '../../firebaseInitialize';
import { doc, getDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseInitialize';
import Room from './Room/Room';
import Button from '../../custom_elements/Button/Button';

const App = () => {
	const [roomId, setRoomId] = useState(null);
	const [isJoinedToRoom, setIsJoinedToRoom] = useState(false);
	const [currentUser, setCurrentUser] = useState(undefined);
	const [givenUsername, setGivenUsername] = useState(null);

	const isEmpty = (str) => !str.trim().length;

	const checkURL = () => {
		const url = new URL(window.location.href);
		const roomIdFromUrl = url.searchParams.get('room');
		if (roomIdFromUrl === null) {
			return false;
		} else {
			setRoomId(roomIdFromUrl);
			return true;
		}
	};

	const isRoomIdInUrl = roomId === null ? checkURL() : true;

	const [isModalOpenForLoginToRoom, setIsModalOpenForLoginToRoom] = useState(isRoomIdInUrl); //If roomId exist, set modal open to true
	const [isModalOpenFromInsertPassword, setIsModalOpenFromInsertPassword] = useState(false);
	const [isModalOpenForIfRoomExist, setIsModalOpenForIfRoomExist] = useState(false);

	//If room by given id exist, return if current user is admin, otherwise, display modal ifRoomExist

	const checkIfRoomExist = async (usernameInput = null) => {
		const docRef = doc(db, 'rooms', roomId);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			const { admin } = docSnap.data();
			if (usernameInput === null) {
				return true;
			} else if (usernameInput.value === admin) {
				return true;
			} else {
				return false;
			}
		} else {
			setIsModalOpenForIfRoomExist(true);
			setIsModalOpenFromInsertPassword(false);
			setIsModalOpenForLoginToRoom(false);
			return;
		}
	};

	useEffect(() => {
		if (roomId !== null) {
			checkIfRoomExist();
		}
	}, []);

	//If user exist let him loggin, otherwise create user

	const checkIfUserExist = async (usernameInput) => {
		setCurrentUser(null);
		setGivenUsername(usernameInput.value);

		const isAdmin = await checkIfRoomExist(usernameInput);

		const querySnapshot = await getDocs(
			query(collection(db, 'rooms', roomId, 'users'), where('username', '==', usernameInput.value.trim()))
		);
		querySnapshot.forEach(async (doc) => {
			const { username, password } = doc.data();
			setCurrentUser({
				username: username,
				password: password,
				isAdmin: isAdmin,
			});
		});
		setIsModalOpenFromInsertPassword(true);
	};

	const createOrLoginUser = async (usernameInput, passwordInput) => {
		if (currentUser === null) {
			const isAdmin = await checkIfRoomExist(usernameInput);
			const docRef = await addDoc(collection(db, 'rooms', roomId, 'users'), {
				username: usernameInput.value.trim(),
				password: passwordInput.value,
			});
			setCurrentUser({
				username: usernameInput.value,
				isAdmin: isAdmin,
			});
			setIsJoinedToRoom(true);
			return true;
		} else {
			if (passwordInput.value === currentUser.password) {
				setIsJoinedToRoom(true);

				delete currentUser.password;

				setCurrentUser(currentUser);
				return true;
			} else {
				return false;
			}
		}
	};

	return (
		<div className="App">
			{isModalOpenForIfRoomExist && (
				<CreateModal title="Upsss..." stateForModal={setIsModalOpenForIfRoomExist}>
					<div className="room-doesnt-exist">
						<p>Wygląda na to, że podany pokój nie istnieje</p>
						<Button
							action={(event) => {
								closeModal(
									setIsModalOpenForIfRoomExist,
									event.target.parentElement.parentElement.parentElement
								);
							}}
							customStyles={{ marginTop: '25px' }}
						>
							Zamknij
						</Button>
					</div>
				</CreateModal>
			)}
			{isModalOpenForLoginToRoom && (
				<CreateModal title="Podaj swoją nazwę" stateForModal={setIsModalOpenForLoginToRoom}>
					<div className="login-to-room">
						<input type="text" placeholder="Nazwa użytkownika"></input>
						<Button
							action={async (event) => {
								if (!isEmpty(event.target.previousSibling.value)) {
									await checkIfUserExist(event.target.previousSibling);
									closeModal(
										setIsModalOpenForLoginToRoom,
										event.target.parentElement.parentElement.parentElement
									);
								}
							}}
							customStyles={{ marginTop: '25px' }}
						>
							Zaloguj się
						</Button>
					</div>
				</CreateModal>
			)}
			{isModalOpenFromInsertPassword && (
				<CreateModal
					title={currentUser === null ? 'Utwórz konto' : 'Zaloguj się'}
					stateForModal={setIsModalOpenFromInsertPassword}
				>
					<div className="inset-password-to-room">
						<input type="text" placeholder="Nazwa użytkownika" value={givenUsername} disabled></input>
						<input type="password" placeholder="Hasło"></input>
						<Button
							action={async (event) => {
								const readyToClose = await createOrLoginUser(
									event.target.previousSibling.previousSibling,
									event.target.previousSibling
								);
								readyToClose &&
									closeModal(
										setIsModalOpenFromInsertPassword,
										event.target.parentElement.parentElement.parentElement
									);
							}}
							customStyles={{ marginTop: '25px' }}
						>
							Zaloguj się
						</Button>
					</div>
				</CreateModal>
			)}

			{isJoinedToRoom === false ? (
				<CreateOrJoinRoom></CreateOrJoinRoom>
			) : (
				<Room currentUser={currentUser} roomId={roomId}></Room>
			)}
		</div>
	);
};

export default App;
