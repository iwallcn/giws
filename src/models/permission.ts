import { request } from "ice";

interface IState {
  btnPermissions: string[];
}

export default {
  state: {
    btnPermissions: []
  } as IState,

  effects: (dispatch) => ({
    async fetchUserPermission() {     
      const res = await request.get('/auth/getInfo');
      if (res.stringPermissions) {
        dispatch.permission.update({ btnPermissions: res.stringPermissions });
      }
    },
  }),

  reducers: {
    update(prevState: IState, payload: IState) {
      return { ...prevState, ...payload };
    },
  },
};
