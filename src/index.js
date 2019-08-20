import SwipeCreator
from "./swipeCreator";

export {
  SWIPE_LEFT,
  SWIPE_DOWN,
  SWIPE_RIGHT,
  SWIPE_UP
}
from "./swipeCreator";

/**
 * 
 * @param {css id or class name} target 
 * @param {array with containing selection of SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN} handlers 
 * @param {(direction: string) => void} callback 
 */
export function handleSwipe(target, handlers, callback) {
  new SwipeCreator(target, handlers, callback);
}