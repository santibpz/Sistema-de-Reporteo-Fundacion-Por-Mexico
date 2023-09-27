import axios from 'axios';

const authProvider = {
    login: async ({ matricula, password }: { matricula: string; password: string }) => {
        try {
            return await axios.post('http://localhost:8081/login', { matricula, password })
            .then(response => {
                alert(JSON.stringify(response.data.matricula))
                localStorage.setItem('username', JSON.stringify(response.data.matricula));
                localStorage.setItem('auth', JSON.stringify(response.data.token));
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
    checkError: (error) =>{
        const status=error.status;
        if(status===401|| status===403){
            localStorage.removeItem("auth");
            localStorage.removeItem("username");
            return Promise.reject();
        }
        return Promise.resolve();
    },
    getIdentity: () =>
        Promise.resolve({
            id: localStorage.getItem('username'),
            fullName: localStorage.getItem('username'),
        }),
    getPermissions: ()=>{return Promise.resolve()},
};
export default authProvider;