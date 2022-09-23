import axios from "axios"
const apiUrl = "http://localhost:3001/"

axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';

export default async function getHello(){
    return await axios.get(apiUrl)
        .then(res => {
            return res.data
        }).then( data => {
            console.log(data)
            return data
        }).catch(err =>{
            console.error(err)
            return err
        })
    
}