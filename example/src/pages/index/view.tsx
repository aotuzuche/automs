import { Button, Layout } from 'auto-ui'
import * as React from 'react'
import Controller from './controller'
import './style'

export default class View extends Controller {
  render() {
    return (
      <Layout className="page-index">
        <Layout.Header title="标题" borderType="border" onBackClick={true} />

        <Layout.Body>
          <Button>123</Button>
        </Layout.Body>
      </Layout>
    )
  }
}
