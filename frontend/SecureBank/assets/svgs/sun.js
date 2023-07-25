import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Sun(props) {
  return (
    <Svg
      width={12}
      height={12}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M6.625.995L6 2.83 5.375.995a.66.66 0 111.25 0zM.995 5.375L2.83 6l-1.836.625a.66.66 0 110-1.25zM5.375 11.005L6 9.17l.625 1.836a.66.66 0 11-1.25 0zM11.005 6.624L9.17 5.999l1.836-.625a.66.66 0 110 1.25zM2.903 2.018l.856 1.74-1.74-.855a.661.661 0 11.884-.885zM2.019 9.096l1.74-.856-.856 1.74a.66.66 0 11-.884-.884zM9.096 9.982l-.856-1.74 1.74.855a.66.66 0 11-.884.885zM9.98 2.902l-1.74.855.856-1.74a.66.66 0 11.884.885zM6 8.815A2.819 2.819 0 013.185 6 2.819 2.819 0 016 3.185 2.819 2.819 0 018.815 6 2.819 2.819 0 016 8.815zm0-4.38a1.566 1.566 0 000 3.13 1.566 1.566 0 000-3.13z"
        fill="#F1F50E"
      />
    </Svg>
  )
}

export default Sun