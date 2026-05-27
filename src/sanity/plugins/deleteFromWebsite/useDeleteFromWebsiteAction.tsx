import {TrashIcon} from '@sanity/icons'
import {useCallback, useState} from 'react'
import {type DocumentActionComponent, useDocumentOperation} from 'sanity'
import {useToast} from '@sanity/ui'
import {buildPathsForDocument} from './config'

const isInternalDeleteWebhook = (url: string) => {
  try {
    const parsed = new URL(url, window.location.origin)
    return parsed.origin === window.location.origin && parsed.pathname === '/api/sanity/delete'
  } catch {
    return false
  }
}

const makeSignatureBody = ({id, type, paths}: {id: string; type: string; paths: string[]}) => ({
  id,
  type,
  paths,
})

const isValidDocResponse = (doc: unknown): doc is Record<string, unknown> => typeof doc === 'object' && doc !== null

export const useDeleteFromWebsiteAction: DocumentActionComponent = ({id, type}) => {
  const {delete: deleteOp} = useDocumentOperation(id, type)
  const toast = useToast()
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = useCallback(async () => {
    setIsDeleting(true)
    setConfirmDialogOpen(false)

    try {
      const webhook = process.env.NEXT_PUBLIC_SITE_DELETE_WEBHOOK || '/api/sanity/delete'
      let doc: Record<string, unknown> | undefined

      try {
        const clientUrl = `/api/sanity/doc?id=${encodeURIComponent(id)}&type=${encodeURIComponent(type)}`
        const docRes = await fetch(clientUrl, {cache: 'no-store'})
        if (docRes.ok) {
          const payload = await docRes.json()
          if (isValidDocResponse(payload)) doc = payload
        }
      } catch (err) {
        console.warn('Could not fetch document preview for delete path mapping', err)
      }

      const paths = buildPathsForDocument(type, doc ?? {_id: id})
      const payload = makeSignatureBody({id, type, paths})

      const shouldHandshake = isInternalDeleteWebhook(webhook)
      if (shouldHandshake) {
        const signRes = await fetch('/api/sanity/delete/signature', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (signRes.ok) {
          const signaturePayload = await signRes.json()
          Object.assign(payload, {
            signature: signaturePayload.signature,
            expiresAt: signaturePayload.expiresAt,
          })
        } else if (signRes.status !== 500) {
          const text = await signRes.text()
          console.error('Delete handshake failed', signRes.status, text)
          toast.push({
            status: 'error',
            title: 'Delete handshake failed',
            description: text || 'Could not sign the delete request.',
          })
          return
        }
      }

      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text()
        console.error('Site webhook error', res.status, text)
        toast.push({
          status: 'error',
          title: 'Website delete request failed',
          description: text || 'The external cleanup endpoint responded with an error.',
        })
        return
      }

      deleteOp.execute()
      toast.push({
        status: 'success',
        title: 'Deleted from Sanity',
        description: 'The document was deleted and the site cleanup webhook was triggered.',
      })
    } catch (err) {
      console.error('Delete-from-website error', err)
      toast.push({
        status: 'error',
        title: 'Delete failed',
        description: 'Something went wrong while deleting the document.',
      })
    } finally {
      setIsDeleting(false)
    }
  }, [deleteOp, id, type, toast])

  return {
    tone: 'critical',
    icon: TrashIcon,
    label: 'Delete from website',
    disabled: isDeleting,
    onHandle: () => setConfirmDialogOpen(true),
    dialog: isConfirmDialogOpen
      ? {
          type: 'confirm',
          tone: 'critical',
          message: 'Permanently delete this document from Sanity and remove it from the website?',
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          onConfirm: handleConfirm,
          onCancel: () => setConfirmDialogOpen(false),
        }
      : undefined,
  }
}

useDeleteFromWebsiteAction.displayName = 'DeleteFromWebsiteAction'
