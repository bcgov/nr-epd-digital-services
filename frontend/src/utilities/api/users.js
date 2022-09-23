import axios from "axios"
const apiUrl = "http://localhost:3001/users/"

axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';

export async function getAllUsers(){
    return await axios.get(apiUrl)
        .then(res => {
            console.log(res)
            return res.data
        }).then(data => {
            console.log(data)
            return data
        }).catch( err => {
            console.error(err)
            return err
        })
}

export async function addUser(data){
    return axios.post(apiUrl,data)
        .then(res => {
            console.log(res)
        })
}

export async function deleteUser(id){
    return axios.delete(apiUrl+id)
        .then(res => {
            console.log(res)
            return res;
        })
}

