import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

interface BarChartProps {
    projectData: {
        project: string[];
        volume: number[];
    };
}

const BarChart: React.FC<BarChartProps> = ({ projectData }) => {
    const chartRef = React.useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                const myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: projectData.project,
                        datasets: [
                            {
                                label: 'Volume',
                                data: projectData.volume,
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        scales: {
                            x: {
                                beginAtZero: true,
                            },
                            y: {
                                beginAtZero: true,
                            },
                        },
                    },
                });

                return () => {
                    myChart.destroy();
                };
            }
        }
    }, [projectData]);

    return (
        <div>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default BarChart;
