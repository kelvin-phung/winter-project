import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import './style.css';
import useLocalStorage from './useLocalStorage';

export default function FilterForm({open, onClose, setEntries, submitted, filterPage, filterSubmit, setCurrPage, setFilterPage, filterMaxPage, forceRender, forceRender2}) {
    const url = 'http://127.0.0.1:8000/filter-entries/'
    const [data, setData] = useLocalStorage('filterFormData', {
        date: null,
        rating: null,
        description: null,
    })
    
    useEffect(() => {
        console.log(data)
        console.log('before', filterPage)
        Axios.post(url + '?page=' + filterPage, {
            date: data.date,
            rating: data.rating,
            description: data.description,
        })
        .then(response => {
            setEntries(response.data['entries'])
            filterMaxPage(response.data['max_page'])
            console.log('filterPage after', filterPage)
        })
    }, [filterPage, forceRender2])

    if(!open){
        return null
    }

    function submit(e){
        e.preventDefault();
        submitted(true)
        Axios.post(url + '?page=1', {
            date: data.date,
            rating: data.rating,
            description: data.description,
        })
        .then(response => {
            console.log(response.data['entries'])
            filterSubmit(response.data['entries'])
            filterMaxPage(response.data['max_page'])
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
            description: null,
        })
        setCurrPage(1)
        setFilterPage(1)
        submitted(false)
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