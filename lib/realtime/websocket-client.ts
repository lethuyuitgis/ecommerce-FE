import { Client, type ClientConfig } from "@stomp/stompjs"

export function buildWebSocketUrl(): string {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_WS_URL || ""
  }

  const explicit = process.env.NEXT_PUBLIC_WS_URL
  if (explicit) {
    return explicit
  }

  const base = (process.env.NEXT_PUBLIC_API_URL || window.location.origin).replace(/\/$/, "")
  const normalized = base.replace(/\/api$/, "")
  const protocol = normalized.startsWith("https") ? "wss" : "ws"
  return normalized.replace(/^https?/, protocol) + "/ws"
}

export function createStompClient(config?: Partial<ClientConfig>) {
  const brokerURL = buildWebSocketUrl()
  if (!brokerURL) {
    return null
  }

  return new Client({
    brokerURL,
    reconnectDelay: 5000,
    debug:
      process.env.NODE_ENV === "development"
        ? (message) => console.debug("[realtime][ws]", message)
        : undefined,
    ...config,
  })
}

