import {
  ComputationInitiation,
  WorkerAction,
  WorkerBackendEventHandlers,
  WorkerMessage
} from '@/data-structures'

export default class WorkerBackend {
  private description: string = ''
  private eventHandlers: WorkerBackendEventHandlers
  private fileName: string = ''
  private readableStream: ReadableStream | null = null
  private reader: ReadableStreamDefaultReader | null = null
  private totalFileSize: number = -1
  private workerInstance: Worker | null = null

  constructor(eventHandlers: WorkerBackendEventHandlers) {
    this.eventHandlers = eventHandlers

    this.workerInstance = new Worker(new URL('./worker.ts', import.meta.url))

    this.workerInstance.onmessage = (ev) => {
      const msg = ev.data as WorkerMessage

      switch (msg.action) {
        case WorkerAction.PREPARE_SESSION_DONE:
          this.sendNextChunk()
          break

        case WorkerAction.FEED_SESSION_DONE:
          this.updateProgress(msg.content as number)
          this.sendNextChunk()
          break

        case WorkerAction.FINALISE_DONE:
          this.finaliseSession(msg.content as string)
          break

        case WorkerAction.ERROR_NEW_JSSHA:
        case WorkerAction.ERROR_SHA256_UPDATE:
        case WorkerAction.ERROR_GET_HASH:
          console.error('Worker error', msg.content)
          this.stopSessionWithError('Internal error! Please try again.')
          break

        default:
          console.warn('UNKNOWN WORKER MESSAGE')
      }
    }
  }

  public startSession(data: ComputationInitiation) {
    this.eventHandlers.statusUpdate('Computation in progress...')
    this.eventHandlers.progressUpdate(0)

    this.description = data.description || ''
    this.fileName = data.file.name
    this.totalFileSize = data.file.size
    this.readableStream = data.file.stream()
    this.reader = this.readableStream?.getReader()

    this.workerInstance?.postMessage({
      action: WorkerAction.PREPARE_NEW_SESSION
    })
  }

  public terminate() {
    this.workerInstance?.terminate()
  }

  private async sendNextChunk() {
    if (!this.reader) {
      return
    }

    const { done, value } = await this.reader.read()

    if (done) {
      this.workerInstance?.postMessage({
        action: WorkerAction.FINALISE,
        content: null
      })
      return
    }

    this.workerInstance?.postMessage({
      action: WorkerAction.FEED_SESSION,
      content: value
    })
  }

  private finaliseSession(hash: string) {
    this.eventHandlers.resultsUpdate({
      description: this.description,
      fileName: this.fileName,
      fileSize: this.totalFileSize,
      hash: hash
    })

    this.eventHandlers.statusUpdate('Computation successful.')
    this.eventHandlers.progressUpdate(100)

    this.clearSession()
  }

  private updateProgress(computedBytes: number) {
    const wildPercentage = (computedBytes / this.totalFileSize) * 100
    const nicePercentage = Math.round((wildPercentage + Number.EPSILON) * 100) / 100

    this.eventHandlers.progressUpdate(nicePercentage)
  }

  private clearSession() {
    this.readableStream = null
    this.reader = null
    this.totalFileSize = -1
    this.fileName = ''
  }

  private stopSessionWithError(errorMessage: string) {
    this.eventHandlers.statusUpdate(errorMessage)
    this.clearSession()
  }
}
