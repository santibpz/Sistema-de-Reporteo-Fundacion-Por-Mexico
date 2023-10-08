import React, { useRef, useEffect, useState } from 'react';
import BarChartComponent from '../components/Charts/BarChart';
import { useDataProvider } from "react-admin"


//DummyData para la gráfica
const chartData1 = [
  { name: 'Trabajadores de Aula', pendientes: 10, activos: 20 },
  { name: 'Inmobiliario', pendientes: 15, activos: 25 },
  { name: 'Equipo Tecnológico', pendientes: 12, activos: 18 },
  { name: 'Infraestructura', pendientes: 30, activos: 52 },
  { name: 'Material Académico', pendientes: 20, activos: 40 },
  { name: 'Beneficiarios', pendientes: 18, activos: 37 },
  { name: 'Otros', pendientes: 9, activos: 2 }
];
let chartData = [{}]

//Solicitar datos a la API
//const data = dataProvider.getInfoForChart();

//Se define el contedor de la gráfica
const ChartPage = (props: any) => {

  // CSFM 04/10/23 - integracion de datos por get - start
  const dataProvider = useDataProvider();
  const [flag, setFlag] = useState(true);
  
  useEffect(() => {
    if (flag) {
      dataProvider
        .getChart("ChartPage")
        .then(({ data }) => {
          console.log(data);
          chartData = data
          setFlag(false);
        })
        .catch((error: any) => console.log(error));
    }
  }, [flag]);
  
  const refetchChart = () => setFlag(true);
  

  // CSFM 04/10/23 - integracion de datos por get - end

  const chartContainerRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(600);
  const [chartHeight, setChartHeight] = useState(300);

  //responsive, sacado con ChatGPT
  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current) {
        const containerWidth = chartContainerRef.current.offsetWidth;
        const containerHeight = chartContainerRef.current.offsetHeight;

        // Puedes ajustar estos valores según tus necesidades
        const newWidth = containerWidth - 40; // Por ejemplo, resta 40 píxeles para dejar espacio para los ejes
        const newHeight = containerHeight - 40; // Lo mismo aquí

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

//devuelve la gráfica dentro del contenedor
  return (
    <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }}>
      <BarChartComponent data={chartData} width={chartWidth} height={chartHeight} />
    </div>
  );
};

export default ChartPage;