import { useState, useEffect } from "react"
import ApiCalendar from "react-google-calendar-api"
import "./Calendar.css"
import { CSVLink } from "react-csv"
// import Colors from "./colors.json"
import Colors from "../Components/Colors/Colors.js"
import "react-datepicker/dist/react-datepicker.css"
import { TailSpin } from "react-loader-spinner"

import Dates from "../Helpers/Dates"
import Helper from "../Helpers/Helpers"
import Exportdata from "../CSV/Exportdata"
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css"
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker"
import ResultTable from "./ResultTable"
import { Gapi } from "../APIs/gapi"
import Colorlogo from "../Imgs/color-circle.png"

const CalendarComponent = () => {
	// state management
	const [data, setData] = useState({})
	const [csvData, setCSVData] = useState([])
	const [startDate, setStartDate] = useState(new Date())
	const [endDate, setEndDate] = useState(null)
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(false)
	const [showColor, setShowColor] = useState(false)

	const [colorData, setColorData] = useState([
		{
			background: "#039be5",
			name: "Marketing",
		},
		{
			background: "#7986cb",
			name: "Finance",
		},
		{
			background: "#33b679",
			name: "R&D",
		},
		{
			background: "#e67c73",
			name: "Sales",
		},
		{
			background: "#f6c026",
			name: "Operations",
		},
		{
			background: "#f5511d",
			name: "Management",
		},
		{
			background: "#039be5",
			name: "Customer Service",
		},
		{
			background: "#616161",
			name: "Human Resources",
		},
		{
			background: "#3f51b5",
			name: "Technical Support",
		},
		{
			background: "#0b8043",
			name: "Legal",
		},
		{
			background: "#d60000",
			name: "Supply Chain",
		},
	])

	const [selectedDayRange, setSelectedDayRange] = useState({
		from: null,
		to: null,
	})

	const config = {
		clientId: process.env.REACT_APP_CLIENT_ID,
		apiKey: process.env.REACT_APP_API_KEY,
		scope: "https://www.googleapis.com/auth/calendar",
		discoveryDocs: [
			"https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
		],
	}
	const apiCalendar = new ApiCalendar(config)

	function getData() {
		setCSVData([])
		console.log("getting data!")
		apiCalendar
			.listEvents({
				timeMin: startDate.toISOString(),
				timeMax: endDate.toISOString(),
				singleEvents: true,
				showDeleted: true,
				maxResults: 10000,
			})
			.then(({ result }) => {
				console.log(result)
				setData(result.items)
				setLoading(false)
			})
	}

	useEffect(() => {
		if (selectedDayRange.to != null) {
			setEndDate(
				new Date(
					selectedDayRange.to.year,
					selectedDayRange.to.month - 1,
					selectedDayRange.to.day
				)
			)
			setStartDate(
				new Date(
					selectedDayRange.from.year,
					selectedDayRange.from.month - 1,
					selectedDayRange.from.day
				)
			)
		}
	}, [selectedDayRange])

	useEffect(() => {
		console.log("checking loading and it = " + JSON.stringify(loading))
		if (endDate !== null) {
			setLoading(true)
			getData()
		}
	}, [endDate])

	useEffect(() => {
		if (data.length > 1) {
			data.map((item) => {
				console.log(item.colorId)
				setCSVData((csvData) => [
					...csvData,
					{
						client: Helper.clientParser(item.summary),
						title: item.summary,
						duration: Dates.dateConverterMinutes(
							item.start.dateTime,
							item.end.dateTime
						),
						hours: Dates.dateConverterHour(
							item.start.dateTime,
							item.end.dateTime
						),
						group:
							typeof item.colorId != "undefined"
								? colorData[item.colorId - 1].name
								: "",
						date: Dates.getDay(item.start.dateTime),
					},
				])
			})
		}
	}, [data, colorData])

	return (
		<>
			{user != null ? (
				<h3> Welcome {user.name}</h3>
			) : (
				<h3>Authenticate with Google to allow access to your calendar</h3>
			)}
			<Gapi user={user} setUser={setUser} />

			{user != null ? (
				<div>
					<h3>Enter the day range and generate your report</h3>
					<DatePicker
						value={selectedDayRange}
						onChange={setSelectedDayRange}
						inputPlaceholder='Select a day range'
						inputClassName='datepicker_input'
					/>
					<button
						className='colorButton'
						onClick={(e) => setShowColor(!showColor)}
					>
						<img src={Colorlogo} alt='color-button'></img>
					</button>
					{showColor ? (
						<Colors
							colorData={colorData}
							setColorData={setColorData}
							close={() => setShowColor(false)}
						></Colors>
					) : (
						<></>
					)}
					<br />
					{csvData.length > 1 ? (
						<CSVLink
							data={csvData}
							headers={Exportdata.headers}
							className='btn'
						>
							Download Data
						</CSVLink>
					) : (
						<></>
					)}
					{loading ? (
						<div id='spinner'>
							<TailSpin id='spinner' color='#0ECA2D' height={80} width={80} />
						</div>
					) : (
						<ResultTable data={data} colorData={colorData} />
					)}
				</div>
			) : (
				<></>
			)}
		</>
	)
}
export default CalendarComponent
