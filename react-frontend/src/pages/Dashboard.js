import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import {Chart, defaults} from 'chart.js/auto';
import {Line, Bar} from 'react-chartjs-2';
import './pages.css';

defaults.maintainAspectRatio = false
defaults.responsive = true

export default function Dashboard() {
    const url = 'http://127.0.0.1:8000/dashboard/'
    const [plotData, setPlotData] = useState({
        dates: [],
        ratings: [],
    })
    const [keywords, setKeywords] = useState([])
    const [summary, setSummary] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        Axios.get(url)
        .then(response => {
            setPlotData({
                dates: response.data['dates'],
                ratings: response.data['ratings'],
            })
            setKeywords(response.data['keywords'])
            console.log('keywords', keywords)
            setSummary(response.data['summary'])
            setIsLoading(false)
        })
    }, [])

    if (isLoading){
        return <h1>Loading...</h1>
    }

    return (
        <div className='dashboard-container'>
            <div className='panel plot-container'>
                <Line
                    data={{
                        labels: plotData.dates,
                        datasets: [
                            {
                                label: "Your ratings",
                                data: plotData.ratings
                            }
                        ]
                    }}
                />
            </div>
            
            <div className='panel words-container'>
                <Bar 
                    data={{
                        labels: keywords.map((tuple) => tuple[0]),
                        datasets: [
                            {
                                label: "Frequency",
                                data: keywords.map((tuple) => tuple[1])
                            }
                        ]
                    }}
                />
            </div>

            <div className='panel summary-container'>
                {summary}
            </div>
        </div>
    )
}