import Driver, { IHash } from './driver';

const driverCredential = process.env.DRIVE_CREDENTIAL
    ? JSON.parse(process.env.DRIVE_CREDENTIAL)
    : null;
const driverToken = process.env.DRIVE_TOKEN
    ? JSON.parse(process.env.DRIVE_TOKEN)
    : null;

export const driver = new Driver(driverCredential, driverToken);
driver.authorize().then(async auth => {
    if (auth) {
        console.log('✔ Authenticated');
    }
});

export default false;
