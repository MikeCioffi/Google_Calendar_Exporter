import { useState } from "react"
import { Table } from "react-bootstrap"
import "./colors.css"

const Colors = (props) => {
	const [targetId, setTargetId] = useState(null)

	function handleChange(event) {
		let updatedData = props.colorData.map((item) => {
			if (item.key - 1 === targetId) {
				return { ...item, name: event.target.value }
			}
			return item
		})

		// update the state
		props.setColorData(updatedData)
	}
	const listDate = props.colorData.map((item, index) => (
		<tr key={index} onClick={() => setTargetId(index)}>
			<td className='align-middle'>
				<div style={{ backgroundColor: item.background, borderRadius: "5px" }}>
					<input
						className='department-input'
						placeholder={item.name}
						key={index}
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
			<button className='btn color-save-button' onClick={props.close}>
				Save
			</button>
		</div>
	)
}
export default Colors
