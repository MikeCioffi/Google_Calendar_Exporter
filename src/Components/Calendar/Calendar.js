import { useState, useEffect } from "react"
import ApiCalendar from "react-google-calendar-api"
import "./Calendar.css"
import { CSVLink } from "react-csv"
// import Colors from "./colors.json"
import Colors from "../Colors/Colors.js"
import "react-datepicker/dist/react-datepicker.css"
import { TailSpin } from "react-loader-spinner"

import Dates from "../../Helpers/Dates"
import Helper from "../../Helpers/Helpers"
import Exportdata from "../CSV/Exportdata"
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css"
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker"
import ResultTable from "../ResultTable/ResultTable"
import { Gapi } from "../../APIs/gapi"
import Colorlogo from "../../Imgs/color-circle.png"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDownload } from "@fortawesome/free-solid-svg-icons"
import Alert from "../Alert/Alert"

const CalendarComponent = () => {
	const current = new Date()

	// state management
	// const [desiredData, setDesiredData] = useState({
	// 	id: "item.id",
	// 	title: "item.summary",
	// 	startDate: "either item.start.date or item.start.dateTime.substring(0, 10)",
	// 	endDate: "either item.end.date or item.end.dateTime.substring(0, 10)",
	// 	colorId: "item.colorId",
	// })
	const [data, setData] = useState([])
	const [startDate, setStartDate] = useState(new Date())
	const [endDate, setEndDate] = useState(null)
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(false)
	const [showColor, setShowColor] = useState(false)
	const [touched, setTouched] = useState(false)
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
		{
			background: "",
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
		setTouched(false)

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
				let tempData = []
				console.log(result.items)
				result.items.map((item) => {
					tempData.push({
						id: item.id,
						title: item.summary,
						startDate: item.start.dateTime
							? item.start.dateTime
							: item.start.date,
						endDate: item.end.dateTime ? item.end.dateTime : item.end.date,
						colorId: item.colorId ? item.colorId : null,
					})
				})
				console.log(tempData)
				tempData.sort(
					(d1, d2) =>
						new Date(d1.startDate).getTime() - new Date(d2.startDate).getTime()
				)
				setTouched(true)
				setData(tempData)
				setLoading(false)
				setSelectedDayRange({
					from: null,
					to: null,
				})
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
		if (endDate !== null) {
			setLoading(true)
			getData()
		}
	}, [endDate])

	const generateDownloadData = () => {
		let tempData = []
		if (data.length > 1) {
			data.map((item) =>
				tempData.push({
					client: Helper.clientParser(item.summary),
					title: item.summary,
					duration: Dates.dateConverterMinutes(item.startDate, item.endDate),
					hours: Dates.dateConverterHour(item.startDate, item.endDate),
					group: item.colorId != null ? colorData[item.colorId - 1].name : "",
					date: Dates.getDay(item.startDate),
				})
			)
		}

		return tempData.sort((objA, objB) => Number(objA.date) - Number(objB.date))
	}
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
					{data.length > 1 ? (
						<button
							className='colorButton'
							onClick={(e) => setShowColor(!showColor)}
						>
							<img src={Colorlogo} alt='color-button'></img>
						</button>
					) : (
						<></>
					)}

					{showColor ? (
						<Colors
							colorData={colorData}
							setColorData={setColorData}
							close={() => setShowColor(false)}
						></Colors>
					) : (
						<></>
					)}

					{data.length > 1 ? (
						<CSVLink
							data={generateDownloadData()}
							headers={Exportdata.headers}
							className='btn'
							filename={`google_cal_export_${current}.csv`}
						>
							<FontAwesomeIcon icon={faDownload} />
						</CSVLink>
					) : (
						<></>
					)}
					{data.length > 1 ? (
						<div>
							{" "}
							{`${startDate}`.substring(0, 15)}
							<span> to </span>
							{`${endDate}`.substring(0, 15)}{" "}
						</div>
					) : (
						<></>
					)}
					{loading ? (
						<div id='spinner'>
							<TailSpin id='spinner' color='#0ECA2D' height={80} width={80} />
						</div>
					) : (
						<div>
							<ResultTable data={data} colorData={colorData} />
						</div>
					)}
					{touched && data.length === 0 ? (
						<Alert
							className='alert error'
							alertTitle='No results found please select new dates and try again.'
						/>
					) : (
						<></>
					)}
				</div>
			) : (
				<></>
			)}
		</>
	)
}
export default CalendarComponent
