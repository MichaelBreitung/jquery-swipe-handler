export const SWIPE_LEFT = "SWIPE_LEFT";
export const SWIPE_RIGHT = "SWIPE_RIGHT";
export const SWIPE_UP = "SWIPE_UP";
export const SWIPE_DOWN = "SWIPE_DOWN";

const TRESHHOLD = 30;
const MAXTIME = 1000;

/**
 * @param target css id or class name  
 * @param handlers array with containing selection of SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN
 * @param callback (direction: string) => void
 */
export function handleSwipe(target, handlers, callback) {

  let touchStartTime = undefined;
  let touchStartX = undefined;
  let touchStartY = undefined;

  const swipeStart = (event) => {
    touchStartTime = Date.now();
    touchStartX = event.pageX;
    touchStartY = event.pageY;
  }

  const swipeEnd = (event) => {
    if (touchStartTime && Date.now() - touchStartTime < MAXTIME) {
      const difX = event.pageX - touchStartX;
      const difY = event.pageY - touchStartY;
      if (difX > TRESHHOLD && handlers.includes(SWIPE_RIGHT)) {
        callback(SWIPE_RIGHT);
      } else if (difX < -TRESHHOLD && handlers.includes(SWIPE_LEFT)) {
        callback(SWIPE_LEFT);
      }

      // we can get both a horizontal and a vertical swipe
      if (difY > TRESHHOLD && handlers.includes(SWIPE_DOWN)) {
        callback(SWIPE_DOWN);
      } else if (difY < -TRESHHOLD && handlers.includes(SWIPE_UP)) {
        callback(SWIPE_UP);
      }

      touchStartTime = undefined;
    }
  }

  $(target).on('mousedown touchstart', swipeStart);
  $("html").on('mouseup touchend', swipeEnd);
}