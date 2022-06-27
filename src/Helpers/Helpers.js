class Helpers  {

    static clientParser = (client) => {
        if(typeof client === 'string'){
        if (client.includes("-")){
          return client.substring(0, client.indexOf('-')); 
        }
        }
          
        return 
        
       }
    
         
}
export default Helpers;
