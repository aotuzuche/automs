import { DvaInstance } from 'dva'

interface ICreateApp {
  basename: string
  defaultRoute: string
  complete: (app: DvaInstance) => void
}

export default function createApp(opts: ICreateApp): void
