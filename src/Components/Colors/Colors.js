import { Table } from "react-bootstrap"
import "./colors.css"

const Colors = (props) => {
	function handleChange(event) {
		let updatedData = props.colorData.map((item) => {
			if (item.name === event.target.placeholder) {
				return { ...item, name: event.target.value }
			}
			return item
		})

		// update the state
		props.setColorData(updatedData)
	}
	const listDate = props.colorData.map((item, index) => (
		<tr key={index}>
			<td className='align-middle'>
				<div style={{ backgroundColor: item.background, borderRadius: "5px" }}>
					<input
						className='department-input'
						placeholder={item.name}
						value={item.name}
						onChange={handleChange}
						style={{
							backgroundColor: item.background,
							color: "white",
							width: "100%",
							textAlign: "center",
						}}
					></input>
				</div>
			</td>
		</tr>
	))

	return (
		<div className='color-container'>
			<p> Edit the Deparments and save to view changes </p>
			<Table>
				<tbody>{listDate}</tbody>
			</Table>
			<button class='btn color-save-button' onClick={props.close}>
				Save
			</button>
		</div>
	)
}
export default Colors
