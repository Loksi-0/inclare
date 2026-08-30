'use client'

import Photo from '@/components/Photo'
import Button from '@/components/Button'
import Retry from '@/icons/Retry'
import {
  useUploadingPhoto,
  type UploadingPhotoProps
} from './useUploadingPhoto'
import styles from './UploadingPhoto.module.scss'

const UploadingPhoto = (props: UploadingPhotoProps) => {
  const { isError, createPhoto, createFormData, src } = useUploadingPhoto(props)

  return (
    <div className={styles.photo}>
      {isError && (
        <Button
          className={styles.photo__retry}
          color='icon'
          onClick={() => {
            createPhoto(createFormData())
          }}
        >
          <Retry />
        </Button>
      )}
      <Photo
        className={styles.photo__photo}
        src={src}
        isError={isError}
        mini
      />
    </div>
  )
}

export default UploadingPhoto
