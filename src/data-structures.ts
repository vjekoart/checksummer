export interface ComputationInitiation {
  file: File
  description: string
}

export interface ComputationResultsType {
  fileName: string
  fileSize: number
  hash: string
  description: string
}

export interface StatusUpdateType {
  message: string
  progress: number
}

export interface WorkerMessage {
  action: WorkerAction
  content: string | number | ArrayBuffer | null
}

export interface WorkerBackendEventHandlers {
  progressUpdate: (progress: number) => void
  resultsUpdate: (results: ComputationResultsType) => void
  statusUpdate: (message: string) => void
}

export enum WorkerAction {
  ERROR_GET_HASH,
  ERROR_NEW_JSSHA,
  ERROR_SHA256_UPDATE,
  FEED_SESSION,
  FEED_SESSION_DONE,
  FINALISE,
  FINALISE_DONE,
  PREPARE_NEW_SESSION,
  PREPARE_SESSION_DONE,
  UNKNOWN_ACTION
}
