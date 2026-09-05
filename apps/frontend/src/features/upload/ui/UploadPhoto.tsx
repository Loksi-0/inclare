'use client'

import Photo from '@/shared/ui/Photo'
import Button from '@/shared/ui/Button'
import Retry from '@/shared/icons/Retry'
import { useUploadPhoto, type UploadPhotoProps } from '../model/useUploadPhoto'
import styles from './UploadPhoto.module.scss'

const UploadingPhoto = (props: UploadPhotoProps) => {
  const { isError, createPhoto, createFormData, src } = useUploadPhoto(props)

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
