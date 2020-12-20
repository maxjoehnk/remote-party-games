import axios from 'axios';

const url = process.env.MATCHMAKING_URL;

export async function announceImage(userId) {
  // TODO: handle with message bus
  await axios.put(`${url}/api/player/${userId}/image`);
}
