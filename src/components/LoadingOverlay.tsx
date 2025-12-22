import React, { useEffect, useRef, useState } from "react"
import {
  ActivityIndicator,
  Animated,
  BackHandler,
  TouchableWithoutFeedback,
} from "react-native"
import { BlurView } from "expo-blur"
import { THEME } from "src/theme"

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView)

type Props = {
  visible: boolean
}

export const LoadingOverlay = ({ visible }: Props) => {
  const [showing, setShowing] = useState(false)
  const opacity = useRef(new Animated.Value(0)).current
  const blur = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const animationDuration = 300
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(blur, {
        toValue: visible ? 40 : 0,
        duration: animationDuration,
        useNativeDriver: false,
      }),
    ]).start()

    if (visible) setShowing(true)
    else {
      setTimeout(() => {
        setShowing(false)
      }, animationDuration + 100)
    }
  }, [visible])

  useEffect(() => {
    if (!visible) return

    const handler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    )
    return () => handler.remove()
  }, [visible])

  if (!showing) return null

  return (
    <Animated.View
      style={{
        position: "absolute",
        zIndex: 999,
        width: "100%",
        height: "100%",
        opacity,
        justifyContent: "center",
        alignItems: "center",
      }}
      pointerEvents="auto"
    >
      <TouchableWithoutFeedback onPress={() => {}}>
        <AnimatedBlurView
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
          tint="dark"
          intensity={blur}
          experimentalBlurMethod={"dimezisBlurView"}
          blurReductionFactor={14}
        />
      </TouchableWithoutFeedback>

      <ActivityIndicator size={40} color={THEME.colors.blue[400]} />
    </Animated.View>
  )
}
