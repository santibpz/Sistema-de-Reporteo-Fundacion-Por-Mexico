import axios from 'axios';

const authProvider = {
    login: async ({ matricula, password }: { matricula: string; password: string }) => {
        try {
            return await axios.post('http://localhost:8081/login', { matricula, password })
            .then(response => {
                alert(JSON.stringify(response.data.matricula))
                localStorage.setItem('username', JSON.stringify(response.data.matricula));
                localStorage.setItem('auth', JSON.stringify(response.data.token));
                localStorage.setItem('nombreC', JSON.stringify(response.data.nombreC));
                localStorage.setItem('rol', JSON.stringify(response.data.rol));
               // localStorage.setItem('identity', JSON.stringify({"id": auth.id, "fullName": auth.fullName}));
                return Promise.resolve();
            })
            .catch(error => {
                return Promise.reject();    
            });
        } catch (error) {
            return Promise.reject();
        }
    },

    logout: () => {
        localStorage.removeItem('username');
        localStorage.removeItem('auth');
        localStorage.removeItem('nombreC');
        localStorage.removeItem('rol');
        return Promise.resolve();
    },
    checkAuth: ()=>{
        const currentPath = window.location.pathname;
    if (currentPath === '/registrarse') {
        return Promise.resolve();
    }else{
        return localStorage.getItem("auth")? Promise.resolve(): Promise.reject();
    }
    },
    checkError: (error: any) =>{
        const status=error.status;
        if(status===401|| status===403){
            localStorage.removeItem("auth");
            localStorage.removeItem("username");
            localStorage.removeItem('nombreC');
            localStorage.removeItem('rol');
            return Promise.reject();
        }
        return Promise.resolve();
    },
    getIdentity: () =>
        Promise.resolve({
            id: localStorage.getItem('username'),
            fullName: localStorage.getItem('nombreC'),
            rol: localStorage.getItem('rol')
        }),
    getPermissions: ()=>{return Promise.resolve()},
};
export default authProvider;