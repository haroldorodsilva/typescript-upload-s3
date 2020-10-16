import Bugsnag, { NotifiableError } from '@bugsnag/js';

export interface IErrorNotify {
    notify(e: NotifiableError): void;
}

class ErrorNotify implements IErrorNotify {
    private apiKey = process.env.BUGSNAG_API_KEY || '';

    constructor() {
        if (this.apiKey) Bugsnag.start(this.apiKey);
    }

    notify = (e: NotifiableError): void => {
        if (this.apiKey) Bugsnag.notify(e);
    };
}

export default new ErrorNotify();
