import Button from '@/components/Button'
import styles from './UploadPost.module.scss'
import { postStore } from '@/stores/post.store'
import { useEffect, useMemo, useState } from 'react'
import { dateToMonth } from '@/shared/functions/dateToMonth'
import { useTRPC } from '@/api/tanstack'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import ViewPostLayout from '@/layouts/ViewPostLayout/ViewPostLayout'
import FileInputButton from '@/components/FileInputButton'
import cx from 'clsx'
import UploadingPhoto from './UploadingPhoto/UploadingPhoto'
import { observer } from 'mobx-react-lite'
import { uploadStore } from '@/stores/upload.store'
import Plus from '@/icons/Plus'
import ProgressBar from '../ProgressBar'
import { invalidatePost } from '@/shared/functions/invalidatePost'

const UploadPost = observer(() => {
  const [postId, setPostId] = useState<string | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  const { mutate: createPost, isPending } = useMutation(
    trpc.post.create.mutationOptions({
      onSuccess: (d) => {
        setPostId(d.id)
      }
    })
  )
  const { mutate: toggleIsDrafted, isPending: isPublishPending } = useMutation(
    trpc.post.my.toggleIsDrafted.mutationOptions()
  )

  useEffect(() => {
    uploadStore.setTotal(files.length)
  }, [files])

  const now = useMemo(() => {
    return new Date()
  }, [])

  const uploadPercentage = useMemo(() => {
    return Math.max(
      Math.min(
        Math.ceil((uploadStore.settledPhotos / uploadStore.totalPhotos) * 100),
        100
      ),
      0
    )
  }, [uploadStore.totalPhotos, uploadStore.settledPhotos])

  const addMore = (f: FileList | null) => {
    if (f) {
      setFiles([...files, ...f])
    }
  }

  const closeUpload = async () => {
    await invalidatePost({ queryClient, trpc })
    postStore.close(() => {
      setPostId(null)
      setFiles([])
    })
    uploadStore.reset()
  }

  if (!postStore.postHeight) {
    return
  }

  return (
    <ViewPostLayout
      zIndex={postStore.isUploading ? 2000 : -1000}
      height={postStore.postHeight}
    >
      <div className={styles.upload__top}>
        <header className={styles.upload__header}>
          <div className='mono subtitle'>
            me / {dateToMonth(now)} {now.getDate()}
          </div>
          <Button
            color='underline'
            onClick={() => {
              postStore.close()
            }}
          >
            назад ↑
          </Button>
        </header>
        {postId && files.at(0) && (
          <div className={styles.upload__grid}>
            {files.map((f, i) => (
              <UploadingPhoto
                key={`${f.name}-${i}`}
                file={f}
                order={i}
                postId={postId}
              />
            ))}
            <FileInputButton
              className={styles.upload__add}
              color='icon'
              onInput={addMore}
            >
              <div className={styles.upload__addButton}>
                <Plus />
              </div>
            </FileInputButton>
          </div>
        )}
      </div>
      {!postId && (
        <div className={styles.upload__load}>
          <FileInputButton
            accept='image/*, .cr2, .cr3, .crw, .nef, .nrw, .arw, .srf, .sr2, .raf, .rw2, .raw, .orf, .pef, .dng, .gpr'
            loading={isPending}
            color='solid'
            onInput={(files) => {
              if (!files) {
                return
              }

              createPost({})
              setFiles([...files])
            }}
          >
            добавить фотографии
          </FileInputButton>
          <p className={cx('subtitle', 'mono', styles.upload__subtitle)}>
            png, jpg или любой RAW
          </p>
        </div>
      )}
      <div className={styles.upload__bottom}>
        {postId && files.at(0) && (
          <>
            <ProgressBar percentage={uploadPercentage} />
            <div className={styles.upload__buttons}>
              <Button
                color='solid'
                disabled={uploadStore.settledPhotos !== uploadStore.totalPhotos}
                onClick={closeUpload}
              >
                сохранить в черновики
              </Button>
              <Button
                color='solid'
                disabled={uploadStore.settledPhotos !== uploadStore.totalPhotos}
                loading={isPublishPending}
                onClick={() => {
                  toggleIsDrafted({ id: postId }, { onSuccess: closeUpload })
                }}
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

export default UploadPost
