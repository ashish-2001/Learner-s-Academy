import React from 'react'
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, plugins } from 'chart.js';
import { data } from 'react-router-dom';


ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardChart = ({ details, currentChart }) => {

    const randomColor = (num) => {
        return Array.from({ length: num }, () => 
            `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`
        );
    };

    const chartLabels = details?.map(course => course?.courseName) || [];
    const studentData = details?.map(course => course?.totalStudents) || [];
    const revenueData = details?.map(course => course?.totalRevenue) || [];
    const colors = randomColor(chartLabels.length);

    const chartData = {
        labels: chartLabels,
        datasets: [
            {
                label: currentChart === 'revenue' ? 'Revenue (₹)' : 'Number of students',
                data : currentChart === 'revenue' ? revenueData : studentData,
                backgroundColor: colors,
                borderColor: colors.map(c => c.replace('0.7', '1')),
                borderWidth: 1
            }
        ]
    };

    const chartOptions = {
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 15,
                    boxHeight: 15,
                    padding: 20,
                    font: {
                        size: 12
                    },
                },
            },
        },
        aspectRatio: 2
    };


    return (
        <div className='mt-8'>
            <Pie data={chartData} options={chartOptions}/>
        </div>
    );
};

export {
    DashboardChart
};