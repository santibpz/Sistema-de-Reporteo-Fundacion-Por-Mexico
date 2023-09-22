import axios from 'axios';

async function hashPasswordWithSalt(password: string, salt: string) {
    const combined = password + salt;
    const encoder = new TextEncoder();
    const data = encoder.encode(combined);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashedPassword;
  }

const authProvider = {
    login: ({ matricula, password }: { matricula: string; password: string }) => {
        
        return hashPasswordWithSalt(password,'Sal' )
        .then(hashedPassword => {
            return axios.post('http://localhost:8081/login', { matricula, hashedPassword })
            .then(response => {
                localStorage.setItem('username', matricula);
                return Promise.resolve();
            })
            .catch(error => {
                return Promise.reject();
            });
        })
        .catch(error => {
          console.error('Error al hashear la contraseña:', error);
        });         
    },

    logout: () => {
        localStorage.removeItem('username');
        return Promise.resolve();
    },
        checkAuth: () =>
        localStorage.getItem('username') ? Promise.resolve() : Promise.reject(),
    checkError:  (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('username');
            return Promise.reject();
        }
        // other error code (404, 500, etc): no need to log out
        return Promise.resolve();
    },
    getIdentity: () =>
        Promise.resolve({
            id: localStorage.getItem('username'),
            fullName: localStorage.getItem('username'),
        }),
    getPermissions: () => Promise.resolve(''),
};
export default authProvider;