import {useState, useEffect } from 'react';
import ApiCalendar from 'react-google-calendar-api';
import "./Calendar.css"
import { CSVLink } from "react-csv";

// state management


const Calendar = () => {
  const [data, setData ] = useState({})
  const [csvData, setCSVData] = useState([])
  const moment = require('moment');


  
const headers = [
  { label: "Client", key: "client" },
  { label: "Meeting Title", key: "title" },
  { label: "Duration", key: "duration" },
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
    console.log(apiCalendar.handleAuthClick())
    } else if (name === 'sign-out') {
      apiCalendar.handleSignoutClick();
    }
    else if (name === 'load-data'){
      apiCalendar.listEvents({
        showDeleted: true,
        maxResults: 10000,
        orderBy: 'updated'
    }).then(({ result }) => {
     setData(result.items)
    });
    }

    else if (name === 'download-data'){
      
    }
  }

  useEffect(()=> {

    if(data.length > 1 ){
      data.map((item)=> 
        setCSVData(csvData => [...csvData, {client: clientParser(item.summary), title: item.summary, duration: dateConverter(item.start.dateTime,item.end.dateTime) , date: getDay(item.start.dateTime)}])
      ) 
  }
 },[data])



  const getDay = (dateFormat) =>{
    const newDateFormat = new Date(dateFormat); 
    return newDateFormat.toDateString();
  }

  
  const dateConverter = (startDate, timeEnd) => {
    const newStartDate= new Date(startDate);
    const newEndDate=new Date(timeEnd);
    let result=moment(newStartDate).diff(newEndDate,'minutes')
    if(result < 0){
      return result *-1
    }
    if(result > 0 ){
      return result
    }
    else{
      if(isNaN(result)){
        return "unable to compute duration of meeting in minutes" 
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

  
  console.log(csvData)
  
  return (<>
  <button className ='btn'
    onClick={(e) => handleItemClick(e, 'sign-in')}
  >
    Connect Google Calendar
</button>

    
    <button className ='btn'
    onClick={(e) => handleItemClick(e, 'load-data')}
  >
    View Data
    </button>  
        {csvData.length > 1 ?     <CSVLink data={csvData} headers={headers} className ='btn'>
          Download Data
        </CSVLink>: <></>}
    <ul className ='data-container'>
    {data.length > 1 ? data.map((item, index) => <li className ='data-row' key={item.id} ><div className='under-line'>{index+1}</div><div>{clientParser(item.summary)} </div><div>Title: {item.summary}</div> <div> Duration:  {dateConverter(item.start.dateTime,item.end.dateTime)} mins</div><div>Date: {getDay(item.start.dateTime)}</div> </li>): <></>}
    </ul>
  </>
    );

}

export default Calendar