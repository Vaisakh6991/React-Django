import * as actionTypes from './actionTypes.js';
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = token => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const logOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('expirationDate');
    //'expirationDate' in 'authLogin' function below..
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const authLogin = (username, password) => {
    return dispatch => {
        dispatch(authStart());
        const payload = { username: username, password: password }
        axios.post('http://localhost:8000/rest-auth/login/', payload)
            .then(res => {
                const token = res.data.key
                const expirationDate = new Date(new Date().getTime() + 3600)
                console.log(expirationDate);
                localStorage.setItem('token', token);
<<<<<<< HEAD
                localStorage.setItem('expiration', expirationDate);
=======
                console.log(localStorage.setItem('token', token));
>>>>>>> c5539721de0569859d54088a480ed13d5675e649

                dispatch(authSuccess(token))
                //token is a parameter of authSuccess..
                dispatch(checkAuthTimeOut(3600));
            })
            .catch(error => {
                dispatch(authFail(error));
            })
    }

}

export const checkAuthTimeOut = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logOut());
        }, expirationTime * 1000)
    }
}


export const authSignup = (username, email, Password1, Password2) => {
    return dispatch => {
        dispatch(authStart());

        axios.post('http://127.0.0.1:8000/rest-auth/registration/', {
            username: username,
            email: email,
            Password1: Password1,
            Password2: Password2
        })
            .then(res => {
                const token = res.data.key
                const expirationDate = new Date(new Date().getTime() + 3600)
                localStorage.setItem('token', token);
                localStorage.setItem('expiration', expirationDate)

                dispatch(authSuccess(token))
                //token is a parameter of authSuccess..
                dispatch(checkAuthTimeOut(3600));
            })
            .catch(error => {
                dispatch(authFail(error));
            })
    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (token === undefined) {
            dispatch(logOut());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'))
            if (expirationDate <= new Date()) {
                dispatch(logOut());
            }
            else {
                dispatch(authSuccess(token));
                dispatch(checkAuthTimeOut((expirationDate.getTime() - new Date().getTime()) / 1000));

            }
        }
    }
}