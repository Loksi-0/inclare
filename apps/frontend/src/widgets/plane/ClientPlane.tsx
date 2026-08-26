'use client'

import Button from '@/components/Button'
import Plus from '@/icons/Plus'
import Minus from '@/icons/Minus'
import PlaneInfo from './PlaneInfo'
import PlaneContent from './PlaneContent'
import { useCustomContext } from '@/shared/hooks/useCustomContext'
import { PlaneContext } from '@/contexts/PlaneContext'
import DeadPixel from '@/widgets/plane/DeadPixel'
import styles from './Plane.module.scss'

const ClientPlane = () => {
  const { gridRef, canvasRef, zoomIn, zoomOut } = useCustomContext(PlaneContext)

  return (
    <div className={styles.plane}>
      <div
        ref={gridRef}
        className={styles.plane__grid}
      />
      <div
        className={styles.plane__content}
        ref={canvasRef}
      >
        <PlaneContent />
        <DeadPixel />
      </div>
      <PlaneInfo />
      <div className={styles.plane__controls}>
        <Button
          color='icon'
          className={styles.plane__button}
          onClick={zoomIn}
        >
          <Plus />
        </Button>
        <Button
          color='icon'
          className={styles.plane__button}
          onClick={zoomOut}
        >
          <Minus />
        </Button>
      </div>
    </div>
  )
}

export default ClientPlane
