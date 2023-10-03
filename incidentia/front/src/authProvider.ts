import axios from 'axios';
//import { useNotify } from 'react-admin';

const authProvider = {
    // Login de authProvider
    login: async ({ matricula, password }: { matricula: string; password: string }) => {
        //const notify = useNotify()
        try {
            // Solicitud http post de ruta login
            return await axios.post('http://localhost:8081/login', { matricula, password })
            .then(response => {
                // Se guarda response en almacenamiento de navegador cuando status positivo
                localStorage.setItem('username', response.data.matricula);
                localStorage.setItem('auth', response.data.token);
                localStorage.setItem('nombreCompleto', response.data.nombreCompleto);
                localStorage.setItem('rol', response.data.rol);
               // localStorage.setItem('identity', JSON.stringify({"id": auth.id, "fullName": auth.fullName}));
               alert(JSON.stringify(response.data.message)) 
               return Promise.resolve();
            })
            .catch(error => {
                // Notificación de error cuando status negativo
                alert(JSON.stringify(error.response.data.message))
                return Promise.reject();    
            });
        } catch (error) {
            alert("Error en login")
            return Promise.reject();
        }
    },

    logout: () => {
        // Se elimina almacenamiento de nagevador al hacer logout
        localStorage.removeItem('username');
        localStorage.removeItem('auth');
        localStorage.removeItem('nombreCompleto');
        localStorage.removeItem('rol');
        return Promise.resolve();
    },
    checkAuth: ()=>{
        // Se exceptua autorización en la ruta de registrarse, fuera de eso es requisito
        // tener almacenado el token "auth"
        const currentPath = window.location.pathname;
    if (currentPath === '/registrarse') {
        return Promise.resolve();
    }else{
        return localStorage.getItem("auth")? Promise.resolve(): Promise.reject();
    }
    },
    checkError: (error: any) =>{
        // Bajo status negativos se elimina el almacenamiento de navegador
        const status=error.status;
        if(status===401|| status===403){
            localStorage.removeItem("auth");
            localStorage.removeItem("username");
            localStorage.removeItem('nombreCompleto');
            localStorage.removeItem('rol');
            return Promise.reject();
        }
        return Promise.resolve();
    },
    getIdentity: () =>
    // Obtiención de identidad con almacenamiento de navegador
        Promise.resolve({
            id: localStorage.getItem('username'),
            fullName: localStorage.getItem('nombreCompleto'),
            rol: localStorage.getItem('rol')
        }),
    getPermissions: ()=>{return Promise.resolve()},
};
export default authProvider;