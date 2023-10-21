import { AdminContext } from 'react-admin';
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';

import { ModalWindow, ReporteCard } from '../src/components/Reportes/Reportes'


const reporte = {
    titulo: 'nuevo reporte',
    categoria: 'Servicios',
    subcategoria: 'agua',
    prioridad: 'alta',
    estatus: 'pendiente'
}


// test('El componente ReporteCard despliega la información del reporte', async () => {

//     const {container} = render(
//         <AdminContext>
//             <ReporteCard 
//              titulo = {reporte.titulo}
//              categoria={reporte.categoria}
//              subcategoria={reporte.subcategoria}
//              prioridad = {reporte.prioridad}
//              estatus = {reporte.estatus}
//              fecha = {reporte.fecha}
//             />
//         </AdminContext>
//     );

//     const div = container.querySelector('.reporte')
//     expect(div).toHaveTextContent('nuevo reporte')
//     expect(div).toHaveTextContent('Servicios')
//     expect(div).toHaveTextContent('agua')
//     expect(div).toHaveTextContent('alta')
//     expect(div).toHaveTextContent('pendiente')  
// })



// test('el botón \'actualizar estatus\' se encuentra definido en el componente ReporteCard', async () => {
  
//     const {container } = render(
//       <AdminContext>
//             <ReporteCard 
//              titulo = {reporte.titulo}
//              categoria={reporte.categoria}
//              subcategoria={reporte.subcategoria}
//              prioridad = {reporte.prioridad}
//              estatus = {reporte.estatus}
//              fecha = {reporte.fecha}
//             />
//       </AdminContext>
//     )

//     const button = container.querySelector('.actualizarBtn')
//     expect(button).toBeDefined()
//   })


// test para verificar que se renderizan todos los componentes ReporteCard
// test('Verificamos que se renderizan todos los reportes en la página', async () => {
//     const reporteArray = [
//       // Arreglo de reportes
//       { titulo: 'Reporte 1', categoria: 'Cat 1', subcategoria: 'Subcat 1' },
//       { titulo: 'Reporte 2', categoria: 'Cat 2', subcategoria: 'Subcat 2' },
//       { titulo: 'Reporte 3', categoria: 'Cat 3', subcategoria: 'Subcat 3' },
//     ];
  
//     const { container } = render(
//       <AdminContext>
//         <>
//         {reporteArray.map((reporte, index) => (
//           <ReporteCard
//             key={index}
//             titulo={reporte.titulo}
//             categoria={reporte.categoria}
//             subcategoria={reporte.subcategoria}
//           />
//         ))}
//         </>
//       </AdminContext>
//     );
  
//     const reporteCards = container.querySelectorAll('.reporte');
//     expect(reporteCards.length).toBe(reporteArray.length);
//   });


  