
import { Persistence } from "https://deno.land/x/persistence/persistence.ts"
import { baseURLChatRedirectServer } from './.env.ts';
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import * as log from "https://deno.land/std/log/mod.ts";

export class Mapper {

    public static async getOriginalLink(sharedURL: string): Promise<string> {
        const mappings = JSON.parse(await Persistence.readFromLocalFile(`${Deno.cwd()}/mappings.json`))
        log.warning(sharedURL)
        const originalLink = mappings.filter((e: any) => e.sharedURL === sharedURL)[0].originalURL

        return originalLink
    }

    public static async addNewMapping(originalURL: string): Promise<string> {
        const mappings = JSON.parse(await Persistence.readFromLocalFile(`${Deno.cwd()}/mappings.json`))
        log.warning(`checking out ${mappings.length} mapping entries`)
        let newLinkId = v4.generate().substr(0, 4);

        const existingEntry = mappings.filter((e: any) => e.sharedURL === `${baseURLChatRedirectServer}/${newLinkId}`)[0]
        if (existingEntry === undefined) {
            const newEntry = {
                sharedURL: `${baseURLChatRedirectServer}/?group=${newLinkId}`,
                originalURL
            }
            mappings.push(newEntry)

            await Persistence.saveToLocalFile(`${Deno.cwd()}/mappings.json`, JSON.stringify(mappings))

            return newEntry.sharedURL
        }

        throw new Error('You should increase the length of the LinkId')
    }
}