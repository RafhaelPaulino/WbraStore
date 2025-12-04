import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { auth } from '@/lib/auth'

const f = createUploadthing()

export const ourFileRouter = {
  productImage: f({ image: { maxFileSize: '4MB', maxFileCount: 5 } })
    .middleware(async () => {
      const session = await auth()

      if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SELLER')) {
        throw new Error('Unauthorized')
      }

      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId)
      console.log('file url', file.url)

      return { url: file.url }
    }),

  categoryImage: f({ image: { maxFileSize: '2MB', maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth()

      if (!session || session.user.role !== 'ADMIN') {
        throw new Error('Unauthorized')
      }

      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId)
      console.log('file url', file.url)

      return { url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
