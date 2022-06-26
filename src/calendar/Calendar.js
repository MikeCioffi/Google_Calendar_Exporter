import {useState, useEffect } from 'react';
import ApiCalendar from 'react-google-calendar-api';
import "./Calendar.css"
import { CSVLink } from "react-csv";
import { Table } from 'react-bootstrap';
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

  console.log(apiCalendar)
  
  const  handleItemClick = (event, name) => {
    if (name === 'sign-in') {
      console.log('trying to sign in')
    apiCalendar.handleAuthClick(); 
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
       { data.length > 1 ?<div className='table-container'>
    <Table responsive striped bordered className='customtable' >
    <thead>
    <tr>
      <th>#</th>
      <th>Client</th>
      <th>Title</th>
      <th>Duration (mins)</th>
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
        {dateConverter(item.start.dateTime,item.end.dateTime)} 
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

export default Calendar

