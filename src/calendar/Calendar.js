import {useState, useEffect } from 'react';
import ApiCalendar from 'react-google-calendar-api';
import "./Calendar.css"
import { CSVLink } from "react-csv";
import Colors from "./colors.json"
import "react-datepicker/dist/react-datepicker.css";
import { TailSpin } from  'react-loader-spinner'

import Dates from "../Helpers/Dates"
import Helper from "../Helpers/Helpers"
import Exportdata from "../CSV/Exportdata"
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker from '@hassanmojab/react-modern-calendar-datepicker';
import ResultTable from './ResultTable';
import { Gapi } from '../APIs/gapi';


const CalendarComponent = () => {
// state management
  const [data, setData ] = useState({})
  const [csvData, setCSVData] = useState([])
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false)

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

  function  getData() {
    console.log('getting data!')
      apiCalendar.listEvents({
        timeMin: startDate.toISOString(), 
        timeMax: endDate.toISOString(), 
        singleEvents: true,
        showDeleted: true,
        maxResults: 10000,
    }).then(({ result }) => {
      console.log(result)
      setData(result.items)
      setLoading(false)
    });
    
  }

  useEffect(()=>{
    if(selectedDayRange.to != null ){
      setEndDate(new Date(selectedDayRange.to.year, selectedDayRange.to.month-1, selectedDayRange.to.day))
      setStartDate(new Date(selectedDayRange.from.year, selectedDayRange.from.month-1, selectedDayRange.from.day))
   
    }
  },[selectedDayRange])

  useEffect (()=> {
    console.log('checking loading and it = ' + JSON.stringify(loading))
    if(endDate !== null) {
      setLoading(true)
      getData(); 
    }
  },[endDate])

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

    {user != null ?  <h3> Welcome {user.name}</h3> : <h3>Authenticate with Google to allow access to your calendar</h3> }
    <Gapi user = {user} setUser = {setUser}/>
    {/* <Google  user = {user} setUser = {setUser} />  */}
 
    {user != null ? <div>
    <h3>Enter the day range and generate your report</h3> 
    <DatePicker      
      value={selectedDayRange}
      onChange={setSelectedDayRange}
      inputPlaceholder="Select a day range"
      inputClassName='datepicker_input'
    />
    <br/>
       {csvData.length > 1 ?     <CSVLink data={csvData} headers={Exportdata.headers} className ='btn'>
          Download Data
        </CSVLink>: <></>}
        {loading ?   <div id='spinner'>
          <TailSpin id='spinner' color="#0ECA2D" height={80} width={80} />    
          </div>
          : 
        
        <ResultTable data = {data} />
        }
    </div>:
    <></>
    }
  </>
    );
}
export default CalendarComponent

