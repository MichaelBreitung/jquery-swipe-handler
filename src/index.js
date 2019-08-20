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
 * @param target css id or class name  
 * @param handlers array with containing selection of SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN
 * @param callback (direction: string) => void
 */
export function handleSwipe(target, handlers, callback) {
  new SwipeCreator(target, handlers, callback);
}