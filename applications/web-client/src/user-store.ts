import * as uuid from 'uuid';
import { PlayerModel } from './contracts/player.model';

const STORAGE_KEY = 'user';

let user: PlayerModel = loadUser();

export function getUserId(): string {
  return user.id;
}

export function getUser(): PlayerModel {
  return user;
}

function loadUser(): PlayerModel {
  const serializedUser = localStorage.getItem(STORAGE_KEY);
  if (serializedUser == null) {
    return {
      id: uuid.v4(),
      name: null,
    };
  }
  return JSON.parse(serializedUser);
}

export function storeUser(player: PlayerModel) {
  user = player;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}
