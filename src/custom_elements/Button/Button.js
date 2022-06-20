import { useEffect, useRef } from 'react';

const Button = ({ action, customStyles, children }) => {
	const buttonRef = useRef(undefined);
	const styles = {
		backgroundColor: '#00aeff',
		fontSize: '24px',
		border: 'unset',
		padding: '10px 32px 10px 32px',
		fontWeight: '400',
		borderRadius: '1000px',
		cursor: 'pointer',
		lineHeight: '1.2',
		transition: '250ms',
	};

	const addCustomStyls = () => {
		Object.keys(customStyles).forEach((key) => {
			buttonRef.current.style[key] = customStyles[key];
		});
	};

	useEffect(() => {
		if (customStyles !== undefined) {
			addCustomStyls();
		}
	}, [customStyles]);

	return (
		<button
			ref={buttonRef}
			style={styles}
			onClick={(event) => action && action(event)}
			onMouseEnter={(event) => {
				event.target.style.backgroundColor = '#4dc6ff';
			}}
			onMouseLeave={(event) => {
				event.target.style.backgroundColor = '#00aeff';
			}}
		>
			{children}
		</button>
	);
};

export default Button;
