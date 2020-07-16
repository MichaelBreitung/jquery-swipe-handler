export const SWIPE_LEFT = "SWIPE_LEFT";
export const SWIPE_RIGHT = "SWIPE_RIGHT";
export const SWIPE_UP = "SWIPE_UP";
export const SWIPE_DOWN = "SWIPE_DOWN";
export const CLICK = "CLICK";

const TRESHHOLD = 50;
const MAXTIME = 700;
const LEFT_MOUSE_KEY = 1;

/**
 * @param target css id or class name
 * @param handlers array with containing selection of SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN, CLICK
 * @param callback (direction: string, posX: ?number, posY: ?number) => void - posX and posY are only supplied on CLICK
 */
export function handleSwipe(target, handlers, callback) {
  let touchStartTime = undefined;
  let touchStartPosition = undefined;
  let isWindowScroll = false;

  const swipeStart = (event) => {
    touchStartTime = Date.now();
    touchStartPosition = getTouchPosition(event);

    if (
      event.type === "touchstart" &&
      (handlers.includes(SWIPE_UP) || handlers.includes(SWIPE_DOWN))
    ) {
      // In this case the default could initiate a scroll event on the page, which
      // would interfere with the swipe
      event.preventDefault();
    }

    // detect scroll
    isWindowScroll = false;
    $(window).bind("scroll", windowScrollInProgress);
  };

  const swipeEnd = (event) => {
    if (
      (event.type !== "mouseup" || event.which === LEFT_MOUSE_KEY) &&
      touchStartTime &&
      Date.now() - touchStartTime < MAXTIME
    ) {
      // only events that started within target are interesting here -> that's why
      // I check touchStartTime and set it to undefined at end of method
      const touchEndPosition = getTouchPosition(event);
      const directions = detectSwipeDirections(touchStartPosition, touchEndPosition);

      let swipe = false;
      let click = false;

      for (let direction of directions) {
        if (handlers.includes(direction)) {
          callback(direction);
          swipe = true;
        }
      }

      if (!directions.length && !isWindowScroll) {
        // since we listen to event on html object here, we have to subtract offset
        callback(
          CLICK,
          touchEndPosition.x - $(target).offset().left,
          touchEndPosition.y - $(target).offset().top
        );
        click = true;
      }

      if (swipe || click) {
        if (event.cancelable && event.type === "touchend") {
          // prevents mouseup in mobile case, which is sometimes executed in addition to touchend
          event.preventDefault();
        }

        // also stop propagation
        event.stopPropagation();
      }

      touchStartTime = undefined;
    }

    // unbind scroll detection
    $(window).unbind("scroll", windowScrollInProgress);
  };

  const windowScrollInProgress = () => {
    isWindowScroll = true;
  };

  $(target).bind("mousedown touchstart", swipeStart);
  $(target).bind("mouseup touchend", swipeEnd);

  // private methods
  function getTouchPosition(event) {
    if (event.touches && event.touches[0]) {
      return {
        x: event.touches[0].pageX,
        y: event.touches[0].pageY,
      };
    } else if (event.changedTouches && event.changedTouches[0]) {
      return {
        x: event.changedTouches[0].pageX,
        y: event.changedTouches[0].pageY,
      };
    } else {
      return {
        x: event.pageX,
        y: event.pageY,
      };
    }
  }

  function detectSwipeDirections(touchStartPosition, touchEndPosition) {
    const difX = touchEndPosition.x - touchStartPosition.x;
    const difY = touchEndPosition.y - touchStartPosition.y;
    const directions = [];
    if (difX > TRESHHOLD) {
      directions.push(SWIPE_RIGHT);
    } else if (difX < -TRESHHOLD) {
      directions.push(SWIPE_LEFT);
    }
    // we can get both a horizontal and a vertical swipe
    if (difY > TRESHHOLD) {
      directions.push(SWIPE_DOWN);
    } else if (difY < -TRESHHOLD) {
      directions.push(SWIPE_UP);
    }

    return directions;
  }
}
