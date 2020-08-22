import { opine } from "https://deno.land/x/opine@0.20.2/mod.ts";
import { Mapper } from "./mapper.ts"
import { port, pathToCert, pathToCertKey, apiKey } from './.env.ts'

export class ChatServer {

    public static serve() {

        const app = opine();

        const authorizationMiddleware = function (req: any, res: any, next: any) {
            if (req.query.apiKey === apiKey){
                next();
            } else {
                res.send('out of scope')
            }
        };


        app.get('/', async (req: any, res: any) => {
            const sharedURL = req.protocol + '://' + req.get('host') + req.originalUrl;
            try {
                const originalURL = await Mapper.getOriginalLink(sharedURL)
                const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url='${originalURL}'" /></head><body><p>Redirecting to https: <a href="${originalURL}">${originalURL}</a></p></body></html>`
                res.send(html);
            } catch (error) {
                res.send(`I could not find the original link. ${error.message}`);
            }
        });

        app.get('/newMapping', authorizationMiddleware, async (req: any, res: any) => {
            let newLinkToBeShared = await Mapper.addNewMapping(`https://${req.query.originalurl}`)
            res.send({newLinkToBeShared})
        });

        if (port.toString().includes('443')) {
            const httpsOptions = {
                port,
                certFile: pathToCert,
                keyFile: pathToCertKey,
            }
            app.listen(httpsOptions)
        } else {
            app.listen(port)
        }
    }
}

ChatServer.serve()
