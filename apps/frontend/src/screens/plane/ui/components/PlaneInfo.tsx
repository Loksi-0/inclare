import { observer } from 'mobx-react-lite'
import cx from 'clsx'
import { planeStore } from '../../model/plane.store'
import styles from '../Plane.module.scss'

const PlaneInfo = observer(() => {
  return (
    <p className={cx(styles.plane__zoom, 'mono')}>
      {`[${planeStore.currentChunkX}; ${planeStore.currentChunkY}]`}{' '}
      {Math.round(planeStore.scale * 100)}%
    </p>
  )
})

export default PlaneInfo
