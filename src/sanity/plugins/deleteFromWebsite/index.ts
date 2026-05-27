import {definePlugin} from 'sanity'
import {useDeleteFromWebsiteAction} from './useDeleteFromWebsiteAction'

export default definePlugin({
  name: 'delete-from-website',
  document: {
    actions: (existingActions) => {
      // Append the action to all document types. It will be available alongside the default actions.
      return [...existingActions, useDeleteFromWebsiteAction]
    },
  },
})
