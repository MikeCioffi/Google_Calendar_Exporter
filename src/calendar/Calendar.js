import {useState, useEffect } from 'react';
import ApiCalendar from 'react-google-calendar-api';
import "./Calendar.css"
import { CSVLink } from "react-csv";
import { Table } from 'react-bootstrap';
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Colors from "./colors.json"

import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker from '@hassanmojab/react-modern-calendar-datepicker';


const CalendarComponent = () => {
// state management
  const [data, setData ] = useState({})
  const [csvData, setCSVData] = useState([])
  const moment = require('moment');
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
    "clientId": "415504819855-715tr1irgfkjrtte6cp4j55lnecf47jg.apps.googleusercontent.com",
    "apiKey": "AIzaSyCxuZGsu7i8Y7VFi7N4axjfDaQP8mYfma4",
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

  console.log(startDate.toISOString())
  useEffect(()=>{

    if(selectedDayRange.to != null ){
      setEndDate(new Date(selectedDayRange.to.year, selectedDayRange.to.month-1, selectedDayRange.to.day))
      setStartDate(new Date(selectedDayRange.from.year, selectedDayRange.from.month-1, selectedDayRange.from.day))

    }



  },[selectedDayRange])

  useEffect(()=> {

    if(data.length > 1 ){
      data.map((item)=> 
        setCSVData(csvData => [...csvData, {client: clientParser(item.summary), title: item.summary, duration: dateConverterMinutes(item.start.dateTime,item.end.dateTime) , date: getDay(item.start.dateTime)}])
      ) 
  }
 },[data])


  const getDay = (dateFormat) =>{
    const newDateFormat = new Date(dateFormat); 
    return newDateFormat.toDateString();
  }

  
  const dateConverterMinutes = (startDate, timeEnd) => {
    const newStartDate= new Date(startDate);
    const newEndDate=new Date(timeEnd);
    let minuteResult=moment(newStartDate).diff(newEndDate,'minutes')

    if(minuteResult < 0){
      return minuteResult *-1
    }
    if(minuteResult > 0 ){
      return minuteResult

    }
    else{
      if(isNaN(minuteResult)){
        return "" 
      } 
    }
     }


     const dateConverterHour = (startDate, timeEnd) => {
      const newStartDate= new Date(startDate);
      const newEndDate=new Date(timeEnd);
      let hourResult=moment(newStartDate).diff(newEndDate,'hours',true) *2
      hourResult = Math.floor(hourResult) /2
      if(hourResult < 0){
        return hourResult *-1
      }
      if(hourResult > 0 ){
        return  hourResult
  
      }
      else{
        if(isNaN( hourResult)){
          return "" 
        } 
      }
       }

     const clientParser = (client) => {
      if(typeof client === 'string'){
      if (client.includes("-")){
        return client.substring(0, client.indexOf('-')); 
      }
      }
        
      return 
      
     }

  
  
  return (<>
  <button className ='login-with-google-btn'
    onClick={(e) => handleItemClick(e, 'sign-in')}
  >
    Sign in with Google
</button>

    
{/*   
   <p> Start Date <DatePicker className = 'date-picker' selected={startDate} onChange={(date) => setStartDate(date)} />
       
   </p>
   
    <p> End Date
    <DatePicker  portalId="root" className = 'date-picker' selected={endDate} onChange={(date) => setEndDate(date)} />
    </p> */}
    <DatePicker
      value={selectedDayRange}
      onChange={setSelectedDayRange}
      inputPlaceholder="Select a day range"
      
    />

    <button className ='btn'
    onClick={(e) => handleItemClick(e, 'load-data')}
  >
    View Data
    </button> 
        {csvData.length > 1 ?     <CSVLink data={csvData} headers={headers} className ='btn'>
          Download Data
        </CSVLink>: <></>}
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
    <td>{clientParser(item.summary)}</td>
      <td> {item.summary}</td>
      <td> 
        {dateConverterMinutes(item.start.dateTime,item.end.dateTime)} 
      </td>
      <td> 
        {dateConverterHour(item.start.dateTime,item.end.dateTime)} 
      </td>
      <td>
        {typeof item.colorId != "undefined" ? <div style={{backgroundColor:Colors.event[item.colorId].background}} >{Colors.event[item.colorId].name}</div> : <></>}
      </td>
      <td>
        {getDay(item.start.dateTime)}
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

