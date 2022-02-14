import cookies from 'js-cookie';


// set in cookie
export const setCookie = (key, value) => {
    if(window !== 'undefined') {
        cookies.set(key, value, {
            expires: 1,
            path: '/'
        });
    }
};

// remove from cookie
export const removeCookie = (key) => {
    if(window !== 'undefined') {
        cookies.remove(key, {
            expires: 1
        });
    }
}

// get from cookie such as stored token
// will be useful when we need to make a request to the server with token
export const getCookie = key => {
    if(window !== 'undefined') {
        return cookies.get(key)
    }
}

// set in local storage
export const setLocalStorage = (key, value) => {
    if(window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

// remove from local storage
export const removeLocalStorage = (key) => {
    if(window !== 'undefined') {
        localStorage.removeItem(key);
    }
}

// authenticate user by passing data to cookie and local storage during signin
export const authenticate = (response, next) => {
    console.log('Authenticating... on signin');
    setCookie('token', response.data.token);
    setLocalStorage('user', response.data.user);
    next();
}

// access user info from local storage
export const isAuth = () => {
    if(window !== 'undefined') {
        const cookieChecked = getCookie('token');
        if(cookieChecked) {
            if(localStorage.getItem('user')) {
                return JSON.parse(localStorage.getItem('user'))
            } else {
                return false;
            }
        }
    }
}

export const signout = next => {
    removeCookie('token')
    removeLocalStorage('user')
    next()
}

// update user
export const updateUser = (response, next) => {
    // console.log('Updating user... in local storage', reponse);
    if(typeof window !== 'undefined') {
        let auth = JSON.parse(localStorage.getItem('user'));
        auth = response.data;
        localStorage.setItem('user', JSON.stringify(auth));
    }
    next();
}