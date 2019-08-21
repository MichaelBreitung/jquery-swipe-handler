export const SWIPE_LEFT = "SWIPE_LEFT";
export const SWIPE_RIGHT = "SWIPE_RIGHT";
export const SWIPE_UP = "SWIPE_UP";
export const SWIPE_DOWN = "SWIPE_DOWN";
export const CLICK = "CLICK";

const TRESHHOLD = 30;
const MAXTIME = 1000;

/**
 * @param target css id or class name
 * @param handlers array with containing selection of SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN
 * @param callback (direction: string, posX: ?number, posY: ?number) => void - posX and posY are only supplied on CLICK
 */
export function handleSwipe(target, handlers, callback) {
  let touchStartTime = undefined;
  let touchStartX = undefined;
  let touchStartY = undefined;
  let targetPosition = $(target).offset();

  const swipeStart = event => {
    touchStartTime = Date.now();
    touchStartX = event.pageX;
    touchStartY = event.pageY;
  };

  const swipeEnd = event => {
    if (touchStartTime) {
      // only events that started within target are interesting here
      let isSwipe = false;
      if (Date.now() - touchStartTime < MAXTIME) {
        const difX = event.pageX - touchStartX;
        const difY = event.pageY - touchStartY;

        if (difX > TRESHHOLD && handlers.includes(SWIPE_RIGHT)) {
          isSwipe = true;
          callback(SWIPE_RIGHT);
        } else if (difX < -TRESHHOLD && handlers.includes(SWIPE_LEFT)) {
          isSwipe = true;
          callback(SWIPE_LEFT);
        }

        // we can get both a horizontal and a vertical swipe
        if (difY > TRESHHOLD && handlers.includes(SWIPE_DOWN)) {
          isSwipe = true;
          callback(SWIPE_DOWN);
        } else if (difY < -TRESHHOLD && handlers.includes(SWIPE_UP)) {
          isSwipe = true;
          callback(SWIPE_UP);
        }
      }
      if (!isSwipe && handlers.includes(CLICK)) {
        // since we listen to event on html object here, we have to subtract offset
        callback(
          CLICK,
          event.pageX - targetPosition.left,
          event.pageY - targetPosition.top
        );
      }
    }

    touchStartTime = undefined;
  };

  $(target).on("mousedown touchstart", swipeStart);
  $("html").on("mouseup touchend", swipeEnd);
}
