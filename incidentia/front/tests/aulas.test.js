import { AdminContext } from 'react-admin';
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import { AulaCard } from '../../front/src/components/Aulas/Aulas'

// test('Verifica que el componente AulaCard despliega la información que se le pasa como props', () => {

//     const aula = {
//         id:'1',
//         nombre: 'aula 1',
//         direccion: 'av de las fuentes Tecamachalco'
//     }
    // const { container } = render(
    // <AdminContext>
    //     <AulaCard {...aula} />
    // </AdminContext>
    // );
  
//     const div = container.querySelector('.aulaCard')
//     expect(div).toHaveTextContent('1')
//     expect(div).toHaveTextContent('aula 1')
//     expect(div).toHaveTextContent('av de las fuentes Tecamachalco')
//   });


test('Verifica que hay dos botones presentes en el componente AulaCard', () => {

    const aula = {
        id:'1',
        nombre: 'aula 1',
        direccion: 'av de las fuentes Tecamachalco'
    }
    
    const { container } = render(
        <AdminContext>
            <AulaCard {...aula} />
        </AdminContext>
        );
  
    // Usa querySelectorAll para seleccionar todos los botones dentro del componente
    const buttons = container.querySelectorAll('.btns');
  
    // Verifica que hay exactamente dos botones
    expect(buttons.length).toBe(2);
  });