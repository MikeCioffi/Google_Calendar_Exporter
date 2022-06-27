class Dates  {

    static dateConverterHour = (startDate, timeEnd) => {
      const moment = require('moment');

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
    

    static dateConverterMinutes = (startDate, timeEnd) => {
      const moment = require('moment');

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

  static   getDay = (dateFormat) =>{
    const newDateFormat = new Date(dateFormat); 
    return newDateFormat.toDateString();
  }
         
}
export default Dates;
