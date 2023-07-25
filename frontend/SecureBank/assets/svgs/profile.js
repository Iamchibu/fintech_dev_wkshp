import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Profile(props) {
  return (
    <Svg
      width={25}
      height={24}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M12.5 0C5.873 0 .5 5.373.5 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7.753 18.305c-.261-.586-.789-.991-1.871-1.241-2.293-.529-4.428-.993-3.393-2.945C18.134 8.177 15.822 5 12.5 5c-3.388 0-5.644 3.299-2.489 9.119 1.066 1.964-1.148 2.427-3.393 2.945-1.084.25-1.608.658-1.867 1.246A9.954 9.954 0 012.5 12c0-5.514 4.486-10 10-10s10 4.486 10 10a9.956 9.956 0 01-2.247 6.305z"
        fill={props.color}
      />
    </Svg>
  )
}

export default Profile
