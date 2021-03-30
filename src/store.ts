import { createStore } from 'ice';
import user from './models/user';
import permission from './models/permission';


const store = createStore({ user, permission });

export default store;
