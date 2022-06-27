import {useState, useEffect } from 'react';
import ApiCalendar from 'react-google-calendar-api';
import "./Calendar.css"
import { CSVLink } from "react-csv";
import { Table } from 'react-bootstrap';
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Colors from "./colors.json"
import Dates from "../Helpers/Dates"
import Helper from "../Helpers/Helpers"

import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker from '@hassanmojab/react-modern-calendar-datepicker';


const CalendarComponent = () => {
// state management
  const [data, setData ] = useState({})
  const [csvData, setCSVData] = useState([])
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [selectedDayRange, setSelectedDayRange] = useState({
    from: null,
    to: null
  });

const headers = [
  { label: "Client", key: "client" },
  { label: "Meeting Title", key: "title" },
  { label: "Minutes", key: "duration" },
  { label: "Hours", key: "hours" },
  { label: "Date", key: "date" }

];
  const config = {
    "clientId": process.env.REACT_APP_CLIENT_ID,
    "apiKey":process.env.REACT_APP_API_KEY,
    "scope": "https://www.googleapis.com/auth/calendar",
    "discoveryDocs": [
      "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
    ]
  }
  
  const apiCalendar = new ApiCalendar(config)

  
  const  handleItemClick = (event, name) => {
    if (name === 'sign-in') {
      console.log('trying to sign in')
    apiCalendar.handleAuthClick(); 
    } else if (name === 'sign-out') {
      apiCalendar.handleSignoutClick();
    }
    else if (name === 'load-data'){
      apiCalendar.listEvents({
        timeMin: startDate.toISOString(), 
        timeMax: endDate.toISOString(), 
        showDeleted: true,
        maxResults: 10000,
        orderBy: 'updated'
    }).then(({ result }) => {
      console.log(result.items)
     setData(result.items)
    });
    }

    else if (name === 'download-data'){
      
    }
  }

  useEffect(()=>{
    if(selectedDayRange.to != null ){
      setEndDate(new Date(selectedDayRange.to.year, selectedDayRange.to.month-1, selectedDayRange.to.day))
      setStartDate(new Date(selectedDayRange.from.year, selectedDayRange.from.month-1, selectedDayRange.from.day))
    }
  },[selectedDayRange])

  useEffect(()=> {

    if(data.length > 1 ){
      data.map((item)=> 
        setCSVData(csvData => [...csvData, {client: Helper.clientParser(item.summary), title: item.summary, duration: Dates.dateConverterMinutes(item.start.dateTime,item.end.dateTime) , date: Dates.getDay(item.start.dateTime)}])
      ) 
  }
 },[data])
 

  return (<>
  <div> 
    <h3>Authenticate with Google to allow access to your calendar</h3> 
    <button className ='login-with-google-btn'
    onClick={(e) => handleItemClick(e, 'sign-in')}>
    Sign in with Google
  </button>
  </div>
  <div> 
    <h3>Enter the day range and generate report</h3> 
    <DatePicker
      value={selectedDayRange}
      onChange={setSelectedDayRange}
      inputPlaceholder="Select a day range"
      inputClassName='datepicker_input'
      
    />
  <br></br>
    <button className ='btn'
    onClick={(e) => handleItemClick(e, 'load-data')}
  >
    Generate Report
    </button> 
    {csvData.length > 1 ?     <CSVLink data={csvData} headers={headers} className ='btn'>
          Download Data
        </CSVLink>: <></>}
    </div> 
    
       { data.length > 1 ?<div className='table-container'>
    <Table responsive striped bordered className='customtable' >
    <thead>
    <tr>
      <th>#</th>
      <th>Client</th>
      <th>Title</th>
      <th>Duration (mins)</th>
      <th>Duration (hours)</th>
      <th>Color</th>
      <th>Date</th>
    </tr>
  </thead>
  <tbody>
    {data.length > 1 ? data.map((item, index) => 
    <tr key={item.id} >
      <td>{index+1}</td>
    <td>{Helper.clientParser(item.summary)}</td>
      <td> {item.summary}</td>
      <td> 
        {Dates.dateConverterMinutes(item.start.dateTime,item.end.dateTime)} 
      </td>
      <td> 
        {Dates.dateConverterHour(item.start.dateTime,item.end.dateTime)} 
      </td>
      <td>
        {typeof item.colorId != "undefined" ? <div style={{backgroundColor:Colors.event[item.colorId].background}} >{Colors.event[item.colorId].name}</div> : <></>}
      </td>
      <td>
        {Dates.getDay(item.start.dateTime)}
      </td>
      </tr>): <></>}
      </tbody>
      </Table>
      </div>
      : <></>}
  </>
    );
}
export default CalendarComponent

