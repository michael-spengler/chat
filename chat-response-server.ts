import { opine } from "https://deno.land/x/opine@0.20.2/mod.ts";
import { portChatResponseServer, pathToCert, pathToCertKey } from './.env.ts'
import * as log from "https://deno.land/std/log/mod.ts";
import { Request } from 'https://deno.land/x/request@1.1.0/request.ts'
import { trainingData } from "./example-data-chat-response-server/training-data.ts";
import { BalanceChecker } from './balance-checker.ts'

export class ChatResponseServer {

    public static serve() {

        const app = opine();

        const authorizationMiddleware = async function (req: any, res: any, next: any) {
            if (await BalanceChecker.getBalance('0x0c20E28e38fB60dB58FeF931ff94aC459F34458f') > 0){
                next();
            } else {
                res.send('out of scope')
            }
        };

        app.get('/getResponse', authorizationMiddleware, async (req: any, res: any) => {
            console.log(`getting response for ${req.query.clientId} - ${req.query.input} - ${req.query.languageCode}`)
            const url = `https://fancy-chats.com:4443/process/input/${req.query.input}/languageCode/${req.query.languageCode}/clientId/${req.query.clientId}`
            const result = await Request.get(url)
            res.send(result)
        });
        
        app.post('/train', authorizationMiddleware, async (req: any, res: any) => {
            const url = 'https://fancy-chats.com:4443/train'
            const response = await Request.post(url, trainingData)
            res.send(response)
            // res.send('hi')
        });

        if (portChatResponseServer.toString().includes('443')) {
            const httpsOptions = {
                port: portChatResponseServer,
                certFile: pathToCert,
                keyFile: pathToCertKey,
            }
            app.listen(httpsOptions)
        } else {
            app.listen(portChatResponseServer)
            log.info(`http://localhost:${portChatResponseServer}`)
        }
    }
}

ChatResponseServer.serve()
