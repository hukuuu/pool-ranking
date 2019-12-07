import styled from 'styled-components'
import { Paper } from '@material-ui/core'

const ScrollablePaper = styled(Paper)`
  overflow: scroll;
  display: flex;
  flex: 1;
  flex-direction: column;
`

export default ScrollablePaper
