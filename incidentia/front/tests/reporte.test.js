import { AdminContext } from 'react-admin';
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';

import { ReporteCard } from '../src/components/Reportes/Reportes'
import LoginPage from '../src/pages/LoginPage'


const reporte = {
    titulo: 'nuevo reporte',
    categoria: 'Servicios',
    subcategoria: 'agua',
    prioridad: 'alta',
    estatus: 'pendiente'
}

test('El componente ReporteCard despliega la información del reporte', async () => {
    
    const {container} = render(
        <AdminContext>
            <ReporteCard 
             titulo = {reporte.titulo}
             categoria={reporte.categoria}
             subcategoria={reporte.subcategoria}
             prioridad = {reporte.prioridad}
             estatus = {reporte.estatus}
             fecha = {reporte.fecha}
            />
        </AdminContext>
    );

    const div = container.querySelector('.reporte')
    expect(div).toHaveTextContent('nuevo reporte')
    expect(div).toHaveTextContent('Servicios')
    expect(div).toHaveTextContent('agua')
    expect(div).toHaveTextContent('alta')
    expect(div).toHaveTextContent('pendiente')  
})



test('el botón \'actualizar estatus\' se encuentra definido en el componente ReporteCard', async () => {
  
    const {container } = render(
      <AdminContext>
            <ReporteCard 
             titulo = {reporte.titulo}
             categoria={reporte.categoria}
             subcategoria={reporte.subcategoria}
             prioridad = {reporte.prioridad}
             estatus = {reporte.estatus}
             fecha = {reporte.fecha}
            />
      </AdminContext>
    )

    const button = container.querySelector('.actualizarBtn')
    expect(button).toBeDefined()
  })





  test('La pagina Login esta definida', async () => {

    const {container } = render(
      <AdminContext>
            <LoginPage />
      </AdminContext>
    )

    screen.debug()
  
    const loginPage = container.querySelector('.login')
  
    expect(loginPage).toBeDefined()
  })