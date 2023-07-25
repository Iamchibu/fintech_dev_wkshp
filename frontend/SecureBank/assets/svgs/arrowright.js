import * as React from "react"
import Svg, { Path } from "react-native-svg"

function ArrowRight(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 3.566L16.78 12 6 20.414l.464.586L18 12 6.457 3 6 3.566z"
        fill="#3B82A0"
      />
    </Svg>
  )
}

export default ArrowRight
