import type { ButtonOptions, CoreOptions } from 'medium-editor'
import type { LongreadElement } from './lib/types'

export interface LongreadResponse {
  longread: {
    id: number
    title: string
    description: string
    approximate_progress_time: number
    reusable: boolean
    is_google_link_updated: boolean
    content: {
      version: number
      elements: LongreadElement[]
    }
  }
  images: {
    id: number
    original_filename: string
    file_url: string
  }[]
  errors?: unknown
}

export interface LongreadFormValues {
  title: string
  version: number
  internalDescription: string
  approximateProgressTime: number | null
  reusableContentEnabled: boolean
  isGoogleLinkUpdated: boolean
  longreadElements: LongreadElement[]
}

export interface MediumEditorButtonOptions extends ButtonOptions {
  name: string
  contentDefault: string
}

export interface MediumEditorOptions extends CoreOptions {
  toolbar: {
    buttons: MediumEditorButtonOptions[]
  }
}

export interface LongreadFormErrors {
  title: boolean
  approximateProgressTime: boolean
  isError: boolean
}
