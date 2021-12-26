import 'antd/dist/antd.css'
import '../styles/vars.css'
import '../styles/global.css'
import Frame from '../components/Frame'

export default function MyApp({ Component, pageProps }) {
  return (
    <Frame>
      <Component {...pageProps} />
    </Frame>
  )
}
