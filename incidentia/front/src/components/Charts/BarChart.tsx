import React, { useRef, useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

//Se define el contedor de la gráfica
const BarChartComponent = ({ data }) => {
  const chartContainerRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(1000);
  const [chartHeight, setChartHeight] = useState(500);

  //responsive, sacado con ChatGPT
  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current) {
        const containerWidth = chartContainerRef.current.offsetWidth;
        const containerHeight = chartContainerRef.current.offsetHeight;

        // Puedes ajustar estos valores según tus necesidades
        const newWidth = containerWidth - 40; // Por ejemplo, resta 40 píxeles para dejar espacio para los ejes
        const newHeight = containerHeight - 100; // Lo mismo aquí

        // Actualiza el tamaño de la gráfica
        setChartWidth(newWidth);
        setChartHeight(newHeight);
      }
    };

    // Escucha los cambios en el tamaño de la ventana
    window.addEventListener('resize', handleResize);

    // Actualiza el tamaño inicial de la gráfica
    handleResize();

    // Limpia el event listener al desmontar el componente
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

//Termina código de ChatGPT	

//devuelve la gráfica
  return (
    <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }}>
      <BarChart width={chartWidth} height={chartHeight} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Bar dataKey="pendientes" fill="#8884d8" name="Pendientes" barSize={50} />
        <Bar dataKey="activos" fill="#82ca9d" name="Activos" barSize={50} />
      </BarChart>
    </div>
  );
};

export default BarChartComponent;
