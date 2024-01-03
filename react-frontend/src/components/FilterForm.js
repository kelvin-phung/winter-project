import React, {useState} from 'react';
import Axios from 'axios';
import './style.css';

export default function FilterForm({open, onClose, filterSubmit, forceRender}) {
    const url = 'http://127.0.0.1:8000/filter-entries/'
    const [data, setData] = useState({
        date: null,
        rating: null,
        description: null,
    })
    
    if(!open){
        return null
    }

    function submit(e){
        e.preventDefault();
        Axios.post(url, {
            date: data.date,
            rating: data.rating,
            description: data.description,
        })
        .then(response => {
            console.log(response.data['entries'])
            filterSubmit(response.data['entries'])
        })
    }

    function handle(e){
        const newdata = {...data}
        newdata[e.target.id] = e.target.value
        setData(newdata)
        console.log(newdata)
    }

    function clearField(e){
        const newdata = {...data}
        newdata[e.target.id] = ''
        setData(newdata)
    }

    function clearFilter(){
        onClose()
        setData({
            date: null,
            rating: null,
            description: '',
        })
        forceRender()
    }

    return(
        <div onClick={onClose} className="overlay">
            <div onClick={(e) => {e.stopPropagation()}} className="form_popup">
                <form onSubmit={(e) => submit(e)}>
                    Date: <input onChange={(e)=>handle(e)} id="date" value={data.date} type="date"></input>
                    <button type='button' id='date' onClick={(e) => clearField(e)}>Clear</button>
                    <br></br>
                    Rating: <input onChange={(e)=>handle(e)} id="rating" value={data.rating} type="number" min="1" max="10" step="1"></input>
                    <button type='button' id='rating' onClick={(e) => clearField(e)}>Clear</button>
                    <br></br>
                    Description: <input onChange={(e)=>handle(e)} id="description" value={data.description} type="text"></input>
                    <button type='button' id='description' onClick={(e) => clearField(e)}>Clear</button>
                    <br></br>
                    <button>Submit</button><button type='button' onClick={clearFilter}>Clear filter conditions</button>
                </form>
            </div>
        </div>
    )
}