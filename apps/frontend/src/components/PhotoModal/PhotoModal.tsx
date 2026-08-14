import { observer } from 'mobx-react-lite'
import styles from './PhotoModal.module.scss'
import { useEffect, useMemo, useRef, type MouseEventHandler } from 'react'
import { photoModalStore } from '@/stores/photoModal.store'
import gsap from 'gsap'
import { useBlur } from '@/shared/hooks/useBlur'
import Button from '../Button'
import Cross from '@/icons/Cross'
import Image from 'next/image'
import ArrowLeft from '@/icons/ArrowLeft'
import ArrowRight from '@/icons/ArrowRight'

const PhotoModal = observer(() => {
  const modalRef = useRef<HTMLDivElement | null>(null)
  const blurIn = useBlur({ from: 0, to: 10 })
  const blurOut = useBlur({ from: 10, to: 0 })

  const data = useMemo(() => {
    return photoModalStore.photos.find(
      (p) => p.order === photoModalStore.current
    )
  }, [photoModalStore.photos, photoModalStore.current])

  useEffect(() => {
    if (photoModalStore.isOpen) {
      blurOut(modalRef.current)
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, display: 'flex' },
        { opacity: 1, duration: 0.2 }
      )
    } else {
      blurIn(modalRef.current)
      gsap.fromTo(
        modalRef.current,
        { opacity: 1 },
        { opacity: 0, display: 'none', duration: 0.2 }
      )
    }
  }, [photoModalStore.isOpen])

  return (
    <div
      ref={modalRef}
      className={styles.modal}
      onClick={(e) => {
        if (e.target === modalRef.current) {
          photoModalStore.close()
        }
      }}
    >
      <div className={styles.modal__inner}>
        <header className={styles.modal__header}>
          <Button
            className={styles.modal__close}
            onClick={() => {
              photoModalStore.close()
            }}
            color='icon'
          >
            <Cross />
          </Button>
        </header>
        {data && (
          <div className={styles.modal__body}>
            <div className={styles.modal__photoWrapper}>
              <div className={styles.modal__photo}>
                <Image
                  className={styles.modal__photoInner}
                  width={2000}
                  height={1500}
                  src={data.optimizedUrl}
                  alt=''
                  draggable={false}
                />
              </div>
            </div>
            <aside className={styles.modal__aside}>
              <ul className={styles.modal__list}>
                {data.iso && (
                  <li className={styles.modal__item}>
                    <p className={styles.modal__subtitle}>iso</p>
                    <p>{data.iso}</p>
                  </li>
                )}
                {data.shutterSpeed && (
                  <li className={styles.modal__item}>
                    <p className={styles.modal__subtitle}>shutter_speed</p>
                    <p>{data.shutterSpeed}</p>
                  </li>
                )}
                {data.aperture && (
                  <li className={styles.modal__item}>
                    <p className={styles.modal__subtitle}>aperture</p>
                    <p>{data.aperture}</p>
                  </li>
                )}
                {data.cameraModel && (
                  <li className={styles.modal__item}>
                    <p className={styles.modal__subtitle}>camera</p>
                    <p>{data.cameraModel}</p>
                  </li>
                )}
                {data.focalLength && (
                  <li className={styles.modal__item}>
                    <p className={styles.modal__subtitle}>focal_length</p>
                    <p>{data.focalLength}</p>
                  </li>
                )}
              </ul>
              <div className={styles.modal__buttons}>
                <Button
                  className={styles.modal__arrow}
                  color='icon'
                  onClick={photoModalStore.prevCurrent}
                  disabled={photoModalStore.photos.some(
                    (p) => !(p.order <= data.order)
                  )}
                >
                  <ArrowLeft />
                </Button>
                <Button
                  className={styles.modal__arrow}
                  color='icon'
                  onClick={photoModalStore.nextCurrent}
                  disabled={photoModalStore.photos.some(
                    (p) => !(p.order >= data.order)
                  )}
                >
                  <ArrowRight />
                </Button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
})

export default PhotoModal
