import { Table } from 'react-bootstrap';
import Dates from "../Helpers/Dates"
import Helper from "../Helpers/Helpers"
import Colors from "./colors.json"

const ResultTable  = (props) => {

    return (<div>
        { props.data.length > 1 ?<div className='table-container'>
        <Table responsive striped bordered className='customtable' >
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
        {props.data.length > 1 ? props.data.map((item, index) => 
        <tr key={item.id} >
          <td className="align-middle">{index+1}</td>
          <td className="align-middle">{Helper.clientParser(item.summary)}</td>
          <td className="align-middle">{item.summary}</td>
          <td className="align-middle"> 
            {Dates.dateConverterMinutes(item.start.dateTime,item.end.dateTime)} 
          </td>
          <td className="align-middle"> 
            {Dates.dateConverterHour(item.start.dateTime,item.end.dateTime)} 
          </td>
          <td className="align-middle">
            {typeof item.colorId != "undefined" ? <div style={{backgroundColor:Colors.event[item.colorId].background,color:"#fff", padding:"10px", borderRadius: "5px"}}>{Colors.event[item.colorId].name}</div> : <></>}
          </td>
          <td className="align-middle">
            {Dates.getDay(item.start.dateTime)}
          </td>
          </tr>): <></>}
          </tbody>
          </Table>
          </div>
          : <></>}
          </div>)
    

}

export default ResultTable 