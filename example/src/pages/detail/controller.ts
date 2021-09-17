import * as React from 'react'
import { RouteComponentProps } from 'react-router'

interface IProps extends RouteComponentProps {
  dispatch: <T>(action: { type: string; payload?: any }) => Promise<T>
}

interface IState {
  visible: boolean
}

export default class Controller extends React.PureComponent<IProps, IState> {
  state = {
    visible: false,
  }

  fetchData = async () => {
    try {
      await this.props.dispatch({
        type: '',
        payload: {},
      })
    } catch (err) {}
  }
}
