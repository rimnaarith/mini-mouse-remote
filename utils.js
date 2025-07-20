import keyCodeMap from './constant/keyMapp.js';

function keyCodeToKeyEnum(keyCode){
  return keyCodeMap[keyCode] ?? null;
}

export {
  keyCodeToKeyEnum
}