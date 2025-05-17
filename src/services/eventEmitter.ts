// Implementación simple de EventEmitter para React Native
export class EventEmitter {
  private listeners: Record<string, Function[]> = {}

  on(event: string, listener: Function): void {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(listener)
  }

  off(event: string, listener: Function): void {
    if (!this.listeners[event]) return
    this.listeners[event] = this.listeners[event].filter((l) => l !== listener)
  }

  emit(event: string, ...args: any[]): void {
    if (!this.listeners[event]) return
    this.listeners[event].forEach((listener) => {
      try {
        listener(...args)
      } catch (error) {
        console.error(`Error en listener de evento ${event}:`, error)
      }
    })
  }
}
