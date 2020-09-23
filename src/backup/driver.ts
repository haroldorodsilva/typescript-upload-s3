/* eslint-disable camelcase */
import { google, drive_v3 } from 'googleapis';
import readline from 'readline';

const SCOPES = ['https://www.googleapis.com/auth/drive'];

export interface IDriveCredential {
    client_id: string;
    project_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_secret: string;
    redirect_uris: string[];
}

export interface IDriveToken {
    access_token: string;
    refresh_token: string;
    scope: string;
    token_type: string;
    expiry_date: number;
}

export interface IHash {
    [details: string]: string;
}

interface IFolderRequest {
    name: string;
    mimeType: string;
    parents?: string[];
}

export interface IDriver {
    authorize(): Promise<boolean>;
    getAccessToken(): Promise<IDriveToken | null>;
    createFile(
        name: string,
        value: string,
        type: string,
        parent: string,
    ): Promise<string>;
    createFolder(folder: string, parent: string): Promise<string>;
    createPath(paths: string[]): Promise<string>;
    findFolder(folder: string, parent: string): Promise<string>;
    findPath(folders: string[]): Promise<string>;
}

class Driver implements IDriver {
    private oAuth2Client;

    private drive: drive_v3.Drive;

    private credential: IDriveCredential;

    private authenticated = false;

    private pathList: IHash = {};

    constructor(credential: IDriveCredential, private token?: IDriveToken) {
        this.credential = credential;
        const { client_secret, client_id, redirect_uris } = this.credential;

        this.oAuth2Client = new google.auth.OAuth2(
            client_id,
            client_secret,
            redirect_uris[0],
        );

        this.drive = google.drive({
            version: 'v3',
            auth: this.oAuth2Client,
        });
    }

    getAccessToken = async (): Promise<IDriveToken | null> => {
        if (!this.oAuth2Client) return null;

        const authUrl = this.oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });

        console.log('Autorize o app acessando essa url:', authUrl);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question('Entre com o código da página aqui: ', code => {
            rl.close();
            this.oAuth2Client.getToken(code, (err, token) => {
                if (err || !token)
                    return console.error('Error retrieving access token', err);

                console.log('======= Token ============');
                console.log(token);
                console.log('==========================');
                return token;
            });
        });

        return null;
    };

    authorize = async (): Promise<boolean> => {
        if (!this.token || !this.token.access_token) {
            await this.getAccessToken().then(res => {
                if (res) this.token = res;
            });
        }

        if (!this.token) return false;

        this.oAuth2Client.setCredentials(this.token);
        this.authenticated = true;
        return true;
    };

    createFile = async (
        name: string,
        value: string,
        type = 'text/plain',
        parent = '',
    ): Promise<string> => {
        if (!this.authenticated) return '';

        const fileMetadata = {
            name,
            parents: [parent],
        };

        const media = {
            mimeType: type,
            body: value,
        };

        const { data, ...rest } = await this.drive.files.create({
            requestBody: fileMetadata,
            media,
        });

        if (data && data.id) {
            // console.log(data.id);
            return data.id;
        }

        console.log(rest);
        return '';
    };

    createFolder = async (folder: string, parent = ''): Promise<string> => {
        if (!this.authenticated) return '';

        const exists = await this.findFolder(folder, parent);
        if (exists) return exists;

        const folderData: IFolderRequest = {
            name: folder,
            mimeType: 'application/vnd.google-apps.folder',
        };

        if (parent) {
            folderData.parents = [parent];
        }

        const { data, ...rest } = await this.drive.files.create({
            requestBody: folderData,
            fields: 'id',
        });

        if (data && data.id) {
            // console.log(`Folder (${folder}) Id:`, data.id);
            return data.id;
        }

        console.log(rest);
        return '';
    };

    createPath = async (paths: string[] = []): Promise<string> => {
        if (!this.authenticated) return '';

        if (!paths) return '';

        let id = '';

        // eslint-disable-next-line no-restricted-syntax
        for (const folder of paths) {
            // eslint-disable-next-line no-await-in-loop
            id = await this.createFolder(folder, id);
        }

        return id;
    };

    findFolder = async (folder: string, parent = ''): Promise<string> => {
        if (!this.authenticated) return '';

        if (!folder) return '';

        const query = `mimeType='application/vnd.google-apps.folder'
            and name='${folder}' and trashed=false
            ${parent ? `and '${parent}' in parents` : ''}`;

        const { data, ...rest } = await this.drive.files.list({
            q: query,
            fields: 'nextPageToken, files(id, name)',
            spaces: 'drive',
        });

        if (data?.files) {
            const file = data.files[0];
            if (file && file.id) {
                return file.id;
            }
        }
        return '';
    };

    findPath = async (folders: string[] = []): Promise<string> => {
        if (!this.authenticated) return '';

        if (!folders) return '';
        let id = this.pathList[folders.join('/')];

        if (id) return id;
        // eslint-disable-next-line no-restricted-syntax
        for (const folder of folders) {
            // eslint-disable-next-line no-await-in-loop
            id = await await this.findFolder(folder, id);
        }

        this.pathList[folders.join('/')] = id;
        return id;
    };
}

export default Driver;
