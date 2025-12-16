import { BottomBar } from "@components/BottomBar"
import { QrCodeStatusView } from "@components/QrCodeStatusView"
import { QrCodeTypingArea } from "@components/QrCodeTypingArea"
import { SaveEnergyArea } from "@components/SaveEnergyArea"
import { Scanner } from "@components/Scanner"
import { FlashMode } from "expo-camera"
import { View, StyleSheet } from "react-native"
import { useCallback, useEffect, useState } from "react"
import { THEME } from "../theme"
import tb from "@utils/toolbox"
import useStore from "../store"
import { EventData } from "@utils/@types/data/event"
import { useFocusEffect } from "@react-navigation/native"
import { BackHandler, Dimensions } from "react-native"
import Netinfo from "@react-native-community/netinfo"
import { setData } from "../store/reducers/persistorReducer"

export function Home() {
  const store = useStore((state) => state)
  const { user, currentEvent, token, Common } = store

  const [mode, setMode] = useState<"camera" | "typing" | "saveEnergy">("camera")
  const [flashMode, setFlashMode] = useState<FlashMode>("off")
  const [showFeedback, setFeedback] = useState(false)
  const [showProds, setShowProds] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [qrCode, setQrCode] = useState("")
  const [qrCodeText, setQrCodeText] = useState("")
  const [lastScanTime, setLastScanTime] = useState(0)
  const [ticketState, setTicketState] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [checkComplete, setCheckComplete] = useState(false)
  const [msg, setMsg] = useState("")

  let waitTime = 60 * 1000
  let timer: undefined | NodeJS.Timeout = undefined

  useEffect(() => {
    if (timer !== undefined) clearTimeout(timer)
    else if (timer === undefined) {
      timer = setTimeout(() => {
        setMode("saveEnergy")
      }, waitTime)
    }
  }, [lastScanTime])

  useEffect(() => {
    if (timer !== undefined) clearTimeout(timer)
    setMode("camera")
    setTimeout(handleOnClose, 200)
  }, [])

  const onCodeScanned = (data: string) => {
    setLastScanTime(new Date().getTime())
    setQrCode(data)
    validateCode(data)
  }

  function handleOnClose() {
    Common.setHeaderColor("neutral")
    setLastScanTime(new Date().getTime())
    if (mode !== "camera") setMode("camera")
    setFeedback(false)
    setScanned(false)
    setIsValidating(false)
    setCheckComplete(false)
    setMsg("")
  }

  function handleConfirm() {
    setQrCode(qrCodeText)
    validateCode(qrCodeText)
    setQrCodeText("")
  }

  function handleModeChange() {
    setMode(mode === "camera" ? "typing" : "camera")
  }

  function handleReturn() {
    if (timer !== undefined) clearTimeout(timer)
    setMode("camera")
    setLastScanTime(new Date().getTime())
  }

  async function validateCode(code: string) {
    try {
      if (!isValidating) {
        setCheckComplete(false)
        setIsValidating(true)
        setFeedback(true)
        if (user) {
          const connection = (await Netinfo.refresh()).isConnected as boolean

          await tb
            .validateQR(
              code,
              user?.db as string,
              currentEvent as EventData,
              user,
              connection,
              token
            )
            .then((isValid) => {
              setTicketState(isValid)
              Common.setHeaderColor("green")
              if (!connection && isValid) {
                Common.setSyncObligation(true)
              }
            })
            .catch((error) => {
              setTicketState(false)
              Common.setHeaderColor("red")
              setMsg(error)
            })

          setScanned(true)
          setCheckComplete(true)
          setIsValidating(false)
        }
      }
    } catch (error) {
      console.log(`Validating Error: `, error)
    }
  }

  const renderBgColor = () => {
    return ticketState ? "rgba(90, 188, 106, .5)" : "rgba(232, 83, 83, .5)"
  }

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (showProds) {
          setShowProds(false)
          return true
        } else return false
      }

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      )

      return () => subscription.remove()
    }, [showProds])
  )

  return (
    <View style={styles.container}>
      {mode === "saveEnergy" ? (
        <SaveEnergyArea handleReturn={handleReturn} />
      ) : (
        <>
          {mode === "camera" && (
            <View style={styles.overlay}>
              <View
                style={[
                  styles.scannerFrame,
                  {
                    borderColor: isValidating
                      ? "rgba(55, 83, 103, .5)"
                      : showFeedback
                      ? renderBgColor()
                      : "rgba(55, 83, 103, .5)",
                  },
                ]}
              >
                <View
                  style={[
                    styles.sideBar,
                    {
                      backgroundColor: isValidating
                        ? "rgba(55, 83, 103, .5)"
                        : showFeedback
                        ? renderBgColor()
                        : "rgba(55, 83, 103, .5)",
                    },
                  ]}
                />
                <View style={styles.centerFrame} />
                <View
                  style={[
                    styles.sideBar,
                    {
                      backgroundColor: isValidating
                        ? "rgba(55, 83, 103, .5)"
                        : showFeedback
                        ? renderBgColor()
                        : "rgba(55, 83, 103, .5)",
                    },
                  ]}
                />
              </View>
              <View
                style={[
                  styles.overlayBackground,
                  {
                    backgroundColor: isValidating
                      ? "rgba(55, 83, 103, .5)"
                      : showFeedback
                      ? renderBgColor()
                      : "rgba(55, 83, 103, .5)",
                  },
                ]}
              />
            </View>
          )}

          <View style={styles.cameraContainer}>
            {mode === "camera" && (
              <Scanner
                flashMode={flashMode}
                scanned={scanned}
                onCodeScanned={onCodeScanned}
              />
            )}
            {mode === "typing" && (
              <QrCodeTypingArea
                qrCode={qrCodeText.toUpperCase()}
                onChange={setQrCodeText}
                onConfirm={handleConfirm}
              />
            )}
          </View>
          <BottomBar
            handleTyping={handleModeChange}
            mode={mode}
            flashMode={flashMode}
            updateFlash={() => {
              setFlashMode(flashMode == "off" ? "on" : "off")
            }}
          />
        </>
      )}
      <QrCodeStatusView
        qrCode={qrCode.replace(`${currentEvent?.id}/`, "")}
        isOpen={showFeedback}
        isSuccess={ticketState}
        isValidating={isValidating}
        isChecked={checkComplete}
        message={msg}
        onClose={handleOnClose}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  scannerFrame: {
    alignItems: "center",
    borderTopWidth: Dimensions.get("screen").width * 0.2,
    borderBottomWidth: Dimensions.get("screen").width * 0.2,
    flexDirection: "row",
  },
  sideBar: {
    width: Dimensions.get("screen").width * 0.1,
    height: Dimensions.get("screen").width * 0.8,
  },
  centerFrame: {
    width: Dimensions.get("screen").width * 0.8,
    height: Dimensions.get("screen").width * 0.8,
    borderWidth: 2,
    borderColor: "white",
  },
  overlayBackground: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: THEME.colors.blue[300],
  },
})
