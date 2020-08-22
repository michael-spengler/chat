
import { Persistence } from "https://deno.land/x/persistence/persistence.ts"
import { baseURL } from './.env.ts';
import { v4 } from "https://deno.land/std/uuid/mod.ts";

export class Mapper {

    public static async getOriginalLink(sharedURL: string): Promise<string> {
        const mappings = JSON.parse(await Persistence.readFromLocalFile(`${Deno.cwd()}/mappings.json`))
        const originalLink = mappings.filter((e: any) => e.sharedURL === sharedURL)[0].originalURL

        return originalLink
    }

    public static async addNewMapping(originalURL: string): Promise<string> {
        const mappings = JSON.parse(await Persistence.readFromLocalFile(`${Deno.cwd()}/mappings.json`))

        let newLinkId = v4.generate().substr(0, 4);

        const existingEntry = mappings.filter((e:any) => e.sharedURL === `${baseURL}/${newLinkId}`)[0]
        if (existingEntry === undefined) {
            const newEntry = {
                sharedURL: `${baseURL}/${newLinkId}`,
                originalURL
            }
            mappings.push(newEntry)
    
            await Persistence.saveToLocalFile(`${Deno.cwd()}/mappings.json`, JSON.stringify(mappings))
    
            return newEntry.sharedURL
        }

        throw new Error('You should increase the length of the LinkId')
    }
}