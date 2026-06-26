import { EventData } from "../data/event"
import { UserInfo } from "../data/user"

export interface StoreInterface {
  user: null | UserInfo
  token: string
  lastSync: number | undefined
  currentEvent: null | EventData
  mustSync: boolean
  headerColor: string
  cameraFacing: "front" | "back"
  feedbackDuration: number
  screenLockTimeout: number
  User: {
    storeInfo: (userInfo: UserInfo) => void
    storeSyncInfo: (syncInfo: any) => void
    cleanInfo: () => void
  }
  Token: {
    storeToken: (token: string) => void
    deleteToken: () => void
  }
  Common: {
    registerEvent: (event: EventData) => void
    clearEvent: () => void
    setHeaderColor: (color: "neutral" | "green" | "red") => void
    setSyncObligation: (should: boolean) => void
    setLastSync: (stored?: string | number) => void
    setCameraFacing: (facing: "front" | "back") => void
    setFeedbackDuration: (value: number) => void
    setScreenLockTimeout: (value: number) => void
  }
}

export type Setter = (
  partial:
    | StoreInterface
    | Partial<StoreInterface>
    | ((state: StoreInterface) => StoreInterface | Partial<StoreInterface>),
  replace?: boolean | undefined
) => void
