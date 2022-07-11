import { Table } from "react-bootstrap"
import Dates from "../../Helpers/Dates"
import Helper from "../../Helpers/Helpers"

const ResultTable = (props) => {
	return (
		<div>
			{props.data.length >= 1 ? (
				<div className='table-container animate'>
					<Table responsive striped bordered className='customtable'>
						<thead>
							<tr>
								<th>#</th>
								<th>Client</th>
								<th>Title</th>
								<th>Duration (mins)</th>
								<th>Duration (hours)</th>
								<th>Department</th>
								<th>Date</th>
							</tr>
						</thead>
						<tbody>
							{props.data[0].id !== null ? (
								props.data.map((item, index) => (
									<tr key={item.id}>
										<td className='align-middle'>{index + 1}</td>
										<td className='align-middle'>
											{Helper.clientParser(item.title)}
										</td>
										<td className='align-middle'>{item.title}</td>
										<td className='align-middle'>
											{Dates.dateConverterMinutes(item.startDate, item.endDate)}
										</td>
										<td className='align-middle'>
											{Dates.dateConverterHour(item.startDate, item.endDate)}
										</td>
										<td className='align-middle'>
											{item.colorId ? (
												<div
													style={{
														backgroundColor:
															props.colorData[item.colorId - 1].background,
														color: "#fff",
														padding: "10px",
														borderRadius: "5px",
													}}
												>
													{props.colorData[item.colorId - 1].name}
												</div>
											) : (
												<></>
											)}
										</td>

										{item.startDate !== undefined ? (
											<td className='align-middle'>
												{item.startDate.substring(0, 10)}
											</td>
										) : (
											<td className='align-middle'></td>
										)}
									</tr>
								))
							) : (
								<></>
							)}
						</tbody>
					</Table>
				</div>
			) : (
				<></>
			)}
		</div>
	)
}

export default ResultTable
