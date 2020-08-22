import { opine } from "https://deno.land/x/opine@0.20.2/mod.ts";
import { Mapper } from "./mapper.ts"
import { port, pathToCert, pathToCertKey } from './.env.ts'

export class ChatServer {

    public static serve() {

        const app = opine();

        app.get('/', async (req: any, res: any) => {
            console.log(req.originalUrl)
            const sharedURL = req.protocol + '://' + req.get('host') + req.originalUrl;
            try {
                const originalURL = await Mapper.getOriginalLink(sharedURL)
                const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url='${originalURL}'" /></head><body><p>Redirecting to https: <a href="${originalURL}">${originalURL}</a></p></body></html>`
                res.send(html);
            } catch(error) {
                res.send('I could not find the original link.');
            }
        });

        app.get('/newMapping', async (req: any, res: any) => {
            let newLinkToBeShared = await Mapper.addNewMapping(`https://${req.query.originalurl}`)
            res.send(newLinkToBeShared)
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



