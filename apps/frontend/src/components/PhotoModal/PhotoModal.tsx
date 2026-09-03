'use client'

import { observer } from 'mobx-react-lite'
import { photoModalStore } from '@/stores/photoModal.store'
import gsap from 'gsap'
import Button from '../Button'
import Cross from '@/icons/Cross'
import Image from '@/components/Image'
import ArrowLeft from '@/icons/ArrowLeft'
import ArrowRight from '@/icons/ArrowRight'
import Preloader from '../Preloader'
import { usePhotoModal } from './usePhotoModal'
import OptionsButton from '../OptionsButton'
import Download from '@/icons/Download'
import { downloadFile } from '@/shared/functions/downloadFile'
import cx from 'clsx'
import styles from './PhotoModal.module.scss'

const PhotoModal = observer(() => {
  const {
    data,
    imgRef,
    modalRef,
    isImgLoaded,
    setIsImgLoaded,
    minOrder,
    maxOrder,
    rawExt,
    optimizedExt
  } = usePhotoModal()

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
          {data && (
            <OptionsButton
              className={styles.modal__download}
              color='icon'
              data={[
                {
                  title: `скачать сжатый${optimizedExt ? ` (.${optimizedExt})` : ''}`,
                  onClick: () => {
                    downloadFile(data.optimizedUrl)
                  }
                },
                {
                  title: `скачать оригинал${rawExt ? ` (.${rawExt})` : ''}`,
                  onClick: () => {
                    downloadFile(data.rawUrl)
                  },
                  color: 'outlined'
                }
              ]}
            >
              <Download />
            </OptionsButton>
          )}
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
              <div
                className={cx(styles.modal__overlay, styles.left)}
                onClick={photoModalStore.prevCurrent}
              ></div>
              <div
                className={cx(styles.modal__overlay, styles.right)}
                onClick={photoModalStore.nextCurrent}
              ></div>
              <Image
                ref={imgRef}
                className={styles.modal__photo}
                width={2000}
                height={1500}
                src={data.optimizedUrl}
                onLoad={() => {
                  setIsImgLoaded(true)
                  gsap.to(imgRef.current, { opacity: 1, duration: 0.2 })
                }}
              />
              {!isImgLoaded && (
                <Preloader className={styles.modal__preloader} />
              )}
            </div>
            <aside className={styles.modal__aside}>
              <ul className={styles.modal__list}>
                {data.iso && (
                  <li className={styles.modal__item}>
                    <p className={styles.modal__subtitle}>iso</p>
                    <p className={styles.modal__data}>{data.iso}</p>
                  </li>
                )}
                {data.shutterSpeed && (
                  <li className={styles.modal__item}>
                    <p className={styles.modal__subtitle}>shutter_speed</p>
                    <p className={styles.modal__data}>{data.shutterSpeed}</p>
                  </li>
                )}
                {data.aperture && (
                  <li className={styles.modal__item}>
                    <p className={styles.modal__subtitle}>aperture</p>
                    <p className={styles.modal__data}>{data.aperture}</p>
                  </li>
                )}
                {data.cameraModel && (
                  <li className={styles.modal__item}>
                    <p className={styles.modal__subtitle}>camera</p>
                    <p className={styles.modal__data}>{data.cameraModel}</p>
                  </li>
                )}
                {data.focalLength && (
                  <li className={styles.modal__item}>
                    <p className={styles.modal__subtitle}>focal_length</p>
                    <p className={styles.modal__data}>{data.focalLength}</p>
                  </li>
                )}
              </ul>
              <div className={styles.modal__buttons}>
                <Button
                  className={styles.modal__arrow}
                  color='icon'
                  onClick={photoModalStore.prevCurrent}
                  disabled={minOrder === data.order}
                >
                  <ArrowLeft />
                </Button>
                <Button
                  className={styles.modal__arrow}
                  color='icon'
                  onClick={photoModalStore.nextCurrent}
                  disabled={maxOrder === data.order}
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
