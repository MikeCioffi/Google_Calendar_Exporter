import "./alert.css"

const Alert = (props) => {
	return (
		<div className={props.className}>
			<span>{props.alertTitle}</span>
		</div>
	)
}

export default Alert
