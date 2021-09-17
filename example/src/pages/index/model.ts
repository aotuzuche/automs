import { Model } from 'dva'

interface IXXXPageState {
  count: number
}

const initialState: IXXXPageState = {
  count: 1,
}

const model: Model = {
  namespace: 'index',
  state: initialState,
  reducers: {
    reducer(state, { payload }) {
      const ns: IXXXPageState = { count: 1 }
      return ns
    },
  },
  effects: {
    *effect(action, { put, call }) {},
  },
}

export default model
