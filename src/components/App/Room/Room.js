import './Room.css';
import Boards from './Boards/Boards';
import { useState } from 'react';
import CurrentBoard from './CurrentBoard/CurrentBoard';

const Room = ({ currentUser, roomId }) => {
	const [curentBoardActive, setCurentBoardActive] = useState(null);

	return (
		<div className="room">
			{curentBoardActive === null ? (
				<Boards currentUser={currentUser} roomId={roomId} setCurentBoardActive={setCurentBoardActive}></Boards>
			) : (
				<CurrentBoard
					curentBoardActive={curentBoardActive}
					currentUser={currentUser}
					roomId={roomId}
					setCurentBoardActive={setCurentBoardActive}
				></CurrentBoard>
			)}
		</div>
	);
};

export default Room;
