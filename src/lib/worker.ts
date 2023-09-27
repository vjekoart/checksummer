import jsSHA from 'jssha/sha256'

import {
  WorkerAction,
  WorkerMessage
} from '@/data-structures'

class ChecksummerWorker {
  private sha256: jsSHA | null = null
  private bytesReceived = -1

  constructor() {
    self.onmessage = (ev) => {
      const msg = ev.data as WorkerMessage

      switch (msg.action) {
        case WorkerAction.PREPARE_NEW_SESSION:
          this.prepareNewSession()
          break

        case WorkerAction.FEED_SESSION:
          this.feedSession(msg.content as ArrayBuffer)
          break

        case WorkerAction.FINALISE:
          this.finalise()
          break

        default:
          self.postMessage({
            action: WorkerAction.UNKNOWN_ACTION,
            content: null
          })
      }
    }
  }

  prepareNewSession() {
    try {
      this.sha256 = new jsSHA('SHA-256', 'ARRAYBUFFER')
      this.bytesReceived = 0

      self.postMessage({
        action: WorkerAction.PREPARE_SESSION_DONE,
        content: null
      })
    } catch (error) {
      self.postMessage({
        action: WorkerAction.ERROR_NEW_JSSHA,
        content: error
      })
    }
  }

  feedSession(partialArrayBuffer: ArrayBuffer) {
    if (!this.sha256) {
      self.postMessage({
        action: WorkerAction.ERROR_SHA256_UPDATE,
        content: 'Missing SHA256 member!'
      })

      return
    }

    try {
      this.bytesReceived += partialArrayBuffer.byteLength
      this.sha256.update(partialArrayBuffer)

      self.postMessage({
        action: WorkerAction.FEED_SESSION_DONE,
        content: this.bytesReceived
      })
    } catch (error) {
      self.postMessage({
        action: WorkerAction.ERROR_SHA256_UPDATE,
        content: error
      })
    }
  }

  finalise() {
    if (!this.sha256) {
      self.postMessage({
        action: WorkerAction.ERROR_GET_HASH,
        content: 'Missing SHA256 member!'
      })

      return
    }

    try {
      const hexHash = this.sha256.getHash('HEX')

      self.postMessage({
        action: WorkerAction.FINALISE_DONE,
        content: hexHash
      })

      this.sha256 = null
      this.bytesReceived = -1
    } catch (error) {
      self.postMessage({
        action: WorkerAction.ERROR_GET_HASH,
        content: error
      })
    }
  }
}

new ChecksummerWorker()
