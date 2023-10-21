import { AdminContext } from 'react-admin';
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import LoginPage from '../src/pages/LoginPage'


// test('La pagina Login esta definida', async () => {

//     const {container } = render(
//       <AdminContext>
//             <LoginPage />
//       </AdminContext>
//     )

//     screen.debug()
  
//     const loginPage = container.querySelector('.login')
  
//     expect(loginPage).toBeDefined()
//   })