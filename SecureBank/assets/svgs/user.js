import * as React from "react"
import Svg, { Path } from "react-native-svg"

function User(props) {
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
        d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm7.753 18.305c-.261-.586-.789-.991-1.871-1.241-2.293-.529-4.428-.993-3.393-2.945C17.634 8.177 15.322 5 12 5c-3.388 0-5.644 3.299-2.489 9.119 1.066 1.964-1.148 2.427-3.393 2.945-1.084.25-1.608.658-1.867 1.246A9.954 9.954 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10a9.956 9.956 0 01-2.247 6.305z"
        fill="#959595"
      />
    </Svg>
  )
}

export default User
