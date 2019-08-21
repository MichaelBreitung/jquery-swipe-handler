export const SWIPE_LEFT = "SWIPE_LEFT";
export const SWIPE_RIGHT = "SWIPE_RIGHT";
export const SWIPE_UP = "SWIPE_UP";
export const SWIPE_DOWN = "SWIPE_DOWN";
export const CLICK = "CLICK";

const TRESHHOLD = 30;
const MAXTIME = 1000;

/**
 * @param target css id or class name
 * @param handlers array with containing selection of SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN, CLICK
 * @param callback (direction: string, posX: ?number, posY: ?number) => void - posX and posY are only supplied on CLICK
 */
export function handleSwipe(target, handlers, callback) {
  touchStartTime = undefined;
  touchStartPosition = undefined;
  targetPosition = $(target).offset();

  const swipeStart = event => {
    touchStartTime = Date.now();

    touchStartPosition = getTouchPosition(event);
  };

  const swipeEnd = event => {
    if (touchStartTime) {
      const touchEndPosition = getTouchPosition(event);

      // only events that started within target are interesting here
      let isSwipe = false;
      if (Date.now() - touchStartTime < MAXTIME) {
        const difX = touchEndPosition.x - touchStartPosition.x;
        const difY = touchEndPosition.y - touchStartPosition.y;

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
          touchEndPosition.x - targetPosition.left,
          touchEndPosition.y - targetPosition.top
        );
      }
    }

    touchStartTime = undefined;
  };

  $(target).bind("mousedown touchstart", swipeStart);
  $("html").bind("mouseup touchend", swipeEnd);
}

function getTouchPosition(event) {
  if (event.touches && event.touches[0]) {
    return { x: event.touches[0].pageX, y: event.touches[0].pageY };
  } else if (event.changedTouches && event.changedTouches[0]) {
    return {
      x: event.changedTouches[0].pageX,
      y: event.changedTouches[0].pageY
    };
  } else {
    return { x: event.pageX, y: event.pageY };
  }
}
