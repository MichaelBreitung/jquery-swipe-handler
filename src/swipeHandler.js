/**
 * @class SwipeHandler
 * @author Michael Breitung
 * @copyright Michael Breitung Photography (www.mibreit-photo.com)
 */

export const SWIPE_LEFT = "SWIPE_LEFT";
export const SWIPE_RIGHT = "SWIPE_RIGHT";
export const SWIPE_UP = "SWIPE_UP";
export const SWIPE_DOWN = "SWIPE_DOWN";

const TRESHHOLD = 30;
const MAXTIME = 1000;

export default class SwipeHandler {
  constructor(target, handlers, callback) {
    this._target = target;
    this._handlers = handlers;
    this._callback = callback;
    this._touchStartTime = undefined;

    $(target).on('mousedown touchstart', this._swipeStart);
    $("html").on('mouseup touchend', this._swipeEnd);
  }

  _swipeStart = (event) => {
    this._touchStartTime = Date.now();
    this._touchStartX = event.pageX;
    this._touchStartY = event.pageY;
  }

  _swipeEnd = (event) => {
    if (this._touchStartTime && Date.now() - this._touchStartTime < MAXTIME) {
      const difX = event.pageX - this._touchStartX;
      const difY = event.pageY - this._touchStartY;
      if (difX > TRESHHOLD && this._handlers.includes(SWIPE_RIGHT)) {
        this._callback(SWIPE_RIGHT);
      } else if (difX < -TRESHHOLD && this._handlers.includes(SWIPE_LEFT)) {
        this._callback(SWIPE_LEFT);
      } else if (difY > TRESHHOLD && this._handlers.includes(SWIPE_DOWN)) {
        this._callback(SWIPE_DOWN);
      } else if (difY < -TRESHHOLD && this._handlers.includes(SWIPE_UP)) {
        this._callback(SWIPE_UP);
      }

      this._touchStartTime = undefined;
    }
  }
}