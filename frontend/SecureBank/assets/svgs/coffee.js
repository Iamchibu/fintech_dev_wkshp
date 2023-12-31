import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Coffee(props) {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M.264.96l-.104.103.009 6.363.013 6.363.095.234c.2.486.529.82.997 1.01l.251.1 4.378.013c3.155.009 4.452 0 4.638-.035a1.77 1.77 0 001.248-.95l.139-.285.013-1.44.013-1.438.247-.026c1.47-.17 2.622-.993 3.264-2.332.706-1.478.394-3.299-.763-4.473-.694-.702-1.508-1.097-2.501-1.214l-.252-.026v-.945c0-.927 0-.945-.1-1.036L11.75.851H4.191v4.096l.308.074c.169.043.372.126.455.186.277.213.277.213.277 1.799v1.43l-1.309-.008-1.313-.013-.013-1.422c-.009-1.2 0-1.439.056-1.547.143-.278.399-.43.802-.473l.239-.026.013-2.05.008-2.046H.372L.264.96zm12.591 2.626c1.894.611 2.896 2.679 2.211 4.564a3.477 3.477 0 01-2.865 2.258l-.252.03V6.955c0-1.92.01-3.498.022-3.511.04-.039.607.052.884.143z"
        fill="#92CDE7"
      />
    </Svg>
  )
}

export default Coffee
