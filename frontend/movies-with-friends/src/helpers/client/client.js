import axios from 'axios';
// import Cookies from 'js-cookie';
// import store from '../../store/index';
// import { userActions } from '../../store/user/index';

const headers = {
  'accept': 'application/json',
  'content-type': 'application/json',
};

export const client = axios.create({
  headers,
});

client.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // const errorStatusCode = error.response.status;
    // if ( [401, 403].includes(errorStatusCode) ) {
    //   window.localStorage.removeItem('user');
    //   store.dispatch(userActions.setUser(''));
    // }
    return Promise.reject(error);
    // return (<div>Bad Move</div>)
  }
);

// client.interceptors.request.use((config) => {
//   const csrfToken = Cookies.get('csrftoken');

//   if (csrfToken) {
//     config.headers.common['X-CSRFToken'] = csrfToken;
//   }

//   return config;
// });
