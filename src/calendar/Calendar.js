import {useState, useEffect } from 'react';
import ApiCalendar from 'react-google-calendar-api';
import "./Calendar.css"
import { CSVLink } from "react-csv";
import Colors from "./colors.json"
import "react-datepicker/dist/react-datepicker.css";

import Dates from "../Helpers/Dates"
import Helper from "../Helpers/Helpers"
import Exportdata from "../CSV/Exportdata"
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker from '@hassanmojab/react-modern-calendar-datepicker';
import ResultTable from '../Calendar/ResultTable';


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
        // orderBy: 'startTime'
    }).then(({ result }) => {
      console.log(result.items)
     setData(result.items)
    });
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
        setCSVData(csvData => 
          [...csvData,
           {
            client: Helper.clientParser(item.summary),
            title: item.summary, 
            duration: Dates.dateConverterMinutes(item.start.dateTime,item.end.dateTime) ,
            hours: Dates.dateConverterHour(item.start.dateTime,item.end.dateTime) ,
            group: typeof item.colorId != "undefined" ? Colors.event[item.colorId].name : "",
            date: Dates.getDay(item.start.dateTime)
           }
          ])
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
  
    <h3>Enter the day range and generate report</h3> 
    <DatePicker
      value={selectedDayRange}
      onChange={setSelectedDayRange}
      inputPlaceholder="Select a day range"
      inputClassName='datepicker_input'
      maximum-scale = "1"
      
    />
  <br></br>
    <button className ='btn'
    onClick={(e) => handleItemClick(e, 'load-data')}
  >
    Generate Report
    </button> 
    {csvData.length > 1 ?     <CSVLink data={csvData} headers={Exportdata.headers} className ='btn'>
          Download Data
        </CSVLink>: <></>}
    <ResultTable data = {data}/>
  </>
    );
}
export default CalendarComponent

