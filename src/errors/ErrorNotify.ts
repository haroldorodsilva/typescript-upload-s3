import Bugsnag, { NotifiableError } from '@bugsnag/js';

export interface IErrorNotify {
    notify(e: NotifiableError): void;
}

class ErrorNotify implements IErrorNotify {
    constructor() {
        Bugsnag.start(process.env.BUGSNAG_API_KEY || '');
    }

    notify = (e: NotifiableError): void => {
        Bugsnag.notify(e);
    };
}

export default new ErrorNotify();
