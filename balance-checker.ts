import * as log from "https://deno.land/std/log/mod.ts";
import { Web3, Helper } from "https://deno.land/x/web3/mod.ts";


export class BalanceChecker {
    
    public static async getBalance(address: string): Promise<number> {
        log.info(address)
        const balance = Helper.getEthFromWei(await Web3.getBalance(address))
        log.info(balance)
        return balance
    }
}