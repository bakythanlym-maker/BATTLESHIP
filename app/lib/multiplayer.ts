export type MultiplayerMessage = 
  | { type: 'JOIN_REQUEST'; playerName: string }
  | { type: 'JOIN_ACCEPT'; hostName: string }
  | { type: 'PLACE_READY'; ships: any[] }
  | { type: 'SHOT'; x: number; y: number }
  | { type: 'SHOT_RESULT'; x: number; y: number; hit: boolean; sunk?: string }
  | { type: 'EMOTE'; text: string }
  | { type: 'GAME_OVER'; winner: string };

export class MultiplayerManager {
  private channel: BroadcastChannel;
  private onMessage: (msg: MultiplayerMessage) => void;

  constructor(roomCode: string, onMessage: (msg: MultiplayerMessage) => void) {
    this.channel = new BroadcastChannel(`battleship_${roomCode}`);
    this.onMessage = onMessage;
    this.channel.onmessage = (event) => this.onMessage(event.data);
  }

  send(msg: MultiplayerMessage) {
    this.channel.postMessage(msg);
  }

  close() {
    this.channel.close();
  }
}

export const generateRoomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};
