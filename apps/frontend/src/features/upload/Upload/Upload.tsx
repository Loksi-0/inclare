import Button from '@/shared/ui/Button'
import { dateToMonth } from '@/shared/functions/dateToMonth'
import ViewPostLayout from '@/shared/layouts/ViewPostLayout'
import cx from 'clsx'
import UploadPhoto from '../UploadPhoto/UploadPhoto'
import { observer } from 'mobx-react-lite'
import { uploadStore } from '@/features/upload/upload.store'
import Plus from '@/shared/icons/Plus'
import ProgressBar from '@/shared/ui/ProgressBar'
import Input from '@/shared/ui/Input'
import { useUpload } from './useUpload'
import styles from './Upload.module.scss'
import { useUploadMotion } from './upload.motion'
import { postStore } from '@/features/post'

const Upload = observer(() => {
  const {
    now,
    postId,
    files,
    addMore,
    isPending,
    isPublishPending,
    isDescriptionPending,
    description,
    setDescription,
    uploadPercentage,
    onDraft,
    onPublish,
    onInput
  } = useUpload()

  useUploadMotion()

  if (!uploadStore.height) {
    return
  }

  return (
    <ViewPostLayout
      zIndex={
        (uploadStore.isOpen || uploadStore.isAnimating) &&
        !postStore.isOpen &&
        !postStore.isAnimating
          ? 2000
          : -1000
      }
      height={uploadStore.height}
    >
      <div className={styles.upload__top}>
        <header className={styles.upload__header}>
          <div className='mono subtitle'>
            me / {dateToMonth(now)} {now.getDate()}
          </div>
          <Button
            color='underline'
            onClick={() => {
              uploadStore.close()
            }}
          >
            назад ↑
          </Button>
        </header>
        {postId && files.at(0) && (
          <div className={styles.upload__grid}>
            {files.map((f, i) => (
              <UploadPhoto
                key={`${f.name}-${i}`}
                file={f}
                order={i}
                postId={postId}
              />
            ))}
            <Input.File
              className={styles.upload__add}
              color='icon'
              onInput={addMore}
            >
              <div className={styles.upload__addButton}>
                <Plus />
              </div>
            </Input.File>
          </div>
        )}
      </div>
      {!postId && (
        <div className={styles.upload__load}>
          <Input.File
            accept='image/*, .cr2, .cr3, .crw, .nef, .nrw, .arw, .srf, .sr2, .raf, .rw2, .raw, .orf, .pef, .dng, .gpr'
            loading={isPending}
            color='solid'
            animate
            onInput={onInput}
          >
            добавить фотографии
          </Input.File>
          <p className={cx('subtitle', 'mono', styles.upload__subtitle)}>
            png, jpg или любой RAW
          </p>
        </div>
      )}
      <div className={styles.upload__bottom}>
        {postId && files.at(0) && (
          <>
            <Input.Textarea
              placeholder='описание'
              onChange={(e) => {
                setDescription(e.target.value)
              }}
              value={description}
            />
            <ProgressBar percentage={uploadPercentage} />
            <div className={styles.upload__buttons}>
              <Button
                color='solid'
                disabled={uploadStore.settledPhotos !== uploadStore.totalPhotos}
                loading={isDescriptionPending}
                onClick={onDraft}
                animate
              >
                сохранить в черновики
              </Button>
              <Button
                color='solid'
                disabled={uploadStore.settledPhotos !== uploadStore.totalPhotos}
                loading={isPublishPending || isDescriptionPending}
                onClick={onPublish}
                animate
              >
                опубликовать
              </Button>
            </div>
          </>
        )}
      </div>
    </ViewPostLayout>
  )
})

export default Upload
