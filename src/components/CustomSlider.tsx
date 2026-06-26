import React, { useCallback, useEffect, useRef } from "react"
import { Animated, PanResponder, StyleSheet, View } from "react-native"
import { THEME } from "../theme"

const THUMB_R = 14
const DOT_R = 10
const TRACK_H = 4

type Props = {
  min: number
  max: number
  step: number
  value: number
  onChange: (v: number) => void
}

export function CustomSlider({ min, max, step, value, onChange }: Props) {
  const trackWidth = useRef(0)
  const posX = useRef(new Animated.Value(0)).current
  const currentPos = useRef(0)
  const startPos = useRef(0)

  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

  const toPos = (v: number) =>
    trackWidth.current > 0 ? ((v - min) / (max - min)) * trackWidth.current : 0

  const toValue = (pos: number): number => {
    if (trackWidth.current === 0) return min
    const raw = min + (pos / trackWidth.current) * (max - min)
    const stepped = Math.round(raw / step) * step
    return parseFloat(clamp(stepped, min, max).toFixed(4))
  }

  useEffect(() => {
    if (trackWidth.current > 0) {
      const p = toPos(value)
      currentPos.current = p
      posX.setValue(p)
    }
  }, [value])

  const onLayout = useCallback(
    (e: any) => {
      trackWidth.current = e.nativeEvent.layout.width - THUMB_R * 2
      const p = toPos(value)
      currentPos.current = p
      posX.setValue(p)
    },
    [value]
  )

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startPos.current = currentPos.current
      },
      onPanResponderMove: (_, gs) => {
        const w = trackWidth.current
        if (w === 0) return
        const p = clamp(startPos.current + gs.dx, 0, w)
        currentPos.current = p
        posX.setValue(p)
        onChange(toValue(p))
      },
    })
  ).current

  return (
    <View style={styles.container} onLayout={onLayout}>
      <View style={styles.track} />
      <Animated.View style={[styles.fill, { width: posX }]} />
      <View style={styles.leftDot} />
      <Animated.View
        style={[styles.thumb, { transform: [{ translateX: posX }] }]}
        {...panResponder.panHandlers}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: THUMB_R * 2,
    position: "relative",
  },
  track: {
    position: "absolute",
    left: THUMB_R,
    right: THUMB_R,
    height: TRACK_H,
    top: THUMB_R - TRACK_H / 2,
    backgroundColor: THEME.colors.gray[500],
    borderRadius: TRACK_H / 2,
  },
  fill: {
    position: "absolute",
    left: THUMB_R,
    height: TRACK_H,
    top: THUMB_R - TRACK_H / 2,
    backgroundColor: THEME.colors.gray[200],
    borderRadius: TRACK_H / 2,
  },
  leftDot: {
    position: "absolute",
    width: DOT_R * 2,
    height: DOT_R * 2,
    borderRadius: DOT_R,
    backgroundColor: THEME.colors.gray[200],
    left: THUMB_R - DOT_R,
    top: THUMB_R - DOT_R,
  },
  thumb: {
    position: "absolute",
    width: THUMB_R * 2,
    height: THUMB_R * 2,
    borderRadius: THUMB_R,
    backgroundColor: THEME.colors.gray[50],
    top: 0,
    left: 0,
  },
})
