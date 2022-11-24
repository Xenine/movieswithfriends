import { client } from '../client/client'
// import store from '../../store/index';
// import { userActions } from '../../store/user/index';

//отправляем на бек хэш
export const sendHash = async (user) => {
  const userToString = {
    ...user,
    auth_date: user.auth_date.toString(),
    id: user.id.toString()
  }
  await client.post('/api/login', userToString);
};

// export const logout = async () => {
//   client.post('/api/logout');
//   window.localStorage.removeItem('user');
//   store.dispatch(userActions.setUser(''));
// };

// //подгружаем все ТГ чаты из бд
// export const fetchChats = async () => {
//   const chats = await client.get('/api/chats/');
//   store.dispatch(userActions.setChats(chats));
// }
