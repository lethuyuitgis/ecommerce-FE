type ChatMessageEvent = {
  conversationId?: string
  notificationId?: string
  message?: string
  senderId?: string
  linkUrl?: string
  raw?: unknown
}

const eventTarget = typeof window !== "undefined" ? new EventTarget() : undefined
const EVENT_NAME = "chat-message"

export function emitChatMessage(event: ChatMessageEvent) {
  if (!eventTarget) return
  eventTarget.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: event }))
}

export function subscribeChatMessages(handler: (event: ChatMessageEvent) => void) {
  if (!eventTarget) return () => {}
  const listener = (evt: Event) => {
    const custom = evt as CustomEvent<ChatMessageEvent>
    handler(custom.detail)
  }
  eventTarget.addEventListener(EVENT_NAME, listener)
  return () => {
    eventTarget.removeEventListener(EVENT_NAME, listener)
  }
}


