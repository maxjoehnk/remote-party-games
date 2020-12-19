export interface Action<TAction> {
  actionType: TAction;
}
export type ActionHandler<TAction> = (
  action?: Action<TAction>,
  playerId?: string
) => Promise<void> | void;

export class GameHandler<TAction> {
  private handlers = new Map<TAction, ActionHandler<TAction>>();

  add(action: TAction, handler: ActionHandler<TAction>) {
    this.handlers.set(action, handler);
  }

  async execute(action: Action<TAction>, playerId: string): Promise<void> {
    const handler = this.handlers.get(action.actionType);
    if (handler == null) {
      console.warn(`[Game] No action handler for ${action.actionType}`);
      return;
    }
    return handler(action, playerId);
  }
}
