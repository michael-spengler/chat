import { opine } from "https://deno.land/x/opine@0.20.2/mod.ts";
import { Mapper } from "./mapper.ts"
import { portChatRedirectServer, pathToCert, pathToCertKey, apiKey } from './.env.ts'

export class ChatResponseServer {

    public static serve() {

        const app = opine();

        const authorizationMiddleware = function (req: any, res: any, next: any) {
            if (req.query.apiKey === apiKey){
                next();
            } else {
                res.send('out of scope')
            }
        };


        app.get('/getResponse', async (req: any, res: any) => {
            console.log(`getting response for ${req.query.botName} - ${req.query.input} - ${req.query.languageCode}`)
            res.send('under construction')
        });
        
        app.get('/train', authorizationMiddleware, async (req: any, res: any) => {
            res.send('under construction')
        });

        if (portChatRedirectServer.toString().includes('443')) {
            const httpsOptions = {
                port: portChatRedirectServer,
                certFile: pathToCert,
                keyFile: pathToCertKey,
            }
            app.listen(httpsOptions)
        } else {
            app.listen(portChatRedirectServer)
        }
    }
}

ChatResponseServer.serve()
