import { Subject } from "rxjs/internal/Subject";

let _isOpen = new Subject();
let _msg = "";
let _onConfirm = null;

const prompt = {
  isOpenSubject: () => {
    return _isOpen;
  },
  getMessage: () => {
    return _msg;
  },
  open: (msg, onConfirm) => {
    _msg = msg;
    _isOpen.next(true);
    _onConfirm = onConfirm;
  },
  close: (confirmed) => {
    if (confirmed) {
      _onConfirm.bind(null);
    }
    _isOpen.next(false);
  },
};

export default prompt;
