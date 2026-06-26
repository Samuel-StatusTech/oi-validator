import { EventData } from "@utils/@types/data/event"
import { Setter } from "../../utils/@types/store"
import { THEME } from "src/theme"

const CommonReducer = (set: Setter) => {
  return {
    registerEvent: (eventInfo: EventData) =>
      set((state) => {
        return {
          ...state,
          currentEvent: eventInfo,
        }
      }),
    clearEvent: () =>
      set((state) => {

        return {
          ...state,
          currentEvent: null,
        }
      }),
    setHeaderColor: (color: "neutral" | "green" | "red") => {
      let newColor = THEME.colors.gray[700]
      switch (color) {
        case "green":
          newColor = "#22c55e"
          break
        case "red":
          newColor = "#dc2626"
          break
        case "neutral":
          newColor = THEME.colors.gray[700]
          break
        default:
          newColor = THEME.colors.gray[700]
          break
      }

      return set((state) => ({
        ...state,
        headerColor: newColor,
      }))
    },
    setSyncObligation: (should: boolean) =>
      set((state) => {
        return {
          ...state,
          mustSync: should,
        }
      }),
    setLastSync: (stored?: string | number) =>
      set((state) => {
        const time = new Date().getTime()

        return {
          ...state,
          lastSync: stored
            ? typeof stored === "string"
              ? +stored
              : stored
            : time,
        }
      }),
    setCameraFacing: (facing: "front" | "back") =>
      set((state) => ({ ...state, cameraFacing: facing })),
    setFeedbackDuration: (value: number) =>
      set((state) => ({ ...state, feedbackDuration: value })),
    setScreenLockTimeout: (value: number) =>
      set((state) => ({ ...state, screenLockTimeout: value })),
  }
}

export default CommonReducer
