'use client'

import Button from '@/shared/ui/Button'
import Plus from '@/shared/icons/Plus'
import Minus from '@/shared/icons/Minus'
import PlaneInfo from './components/PlaneInfo'
import PlaneContent from './components/PlaneContent'
import { useCustomContext } from '@/shared/hooks/useCustomContext'
import { PlaneContext } from '../model/PlaneContext'
import DeadPixel from './components/DeadPixel'
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
