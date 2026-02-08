import type { CountryRow } from "./editor";
import { StartGame } from "./main";
import type { CurrentQuestion } from "./types";


export class Database{
    
    public static LoadFromObject(obj : any[]){
        Database.data = {};
        for(const element_ of obj){
            const element = element_ as CountryRow;
            if(!Object.hasOwn(element, "code") || !Object.hasOwn(element, "name")){
                console.error("Malformed field! Skipping!");
                continue;
            }
            Database.data[element.code] = element.name;
        }
        StartGame();
    }

    private static data : Record<string, string> = {}

    public static get Codes(){
        return Object.keys(this.data);
    }

    public static get Countries(){
        return Object.values(this.data);
    }

    public static get Data(){
        return this.data;
    }
    
    public static GetGuessed(q : CurrentQuestion) : string[]{
        return q.codeGiven ? Database.Countries : Database.Codes;
    }
}