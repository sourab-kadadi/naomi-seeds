import { HttpServer, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UtilsService {

    constructor(private httpServer: HttpServer) {}

    async getDataFromUrl(url: string): Promise<Observable<any>> {
        // let file = await this.httpServer.get(url, { responseType: "arraybuffer" });
        let file = await this.httpServer.get(url, { responseType: "arraybuffer" } as any);
        return file;
    }
}
