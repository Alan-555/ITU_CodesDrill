import type { CurrentQuestion } from "./types";


export class Database{
    

    private static readonly data : Record<string, string> = {
        "cs" : "Česko",
        "ch" : "Čína",
        "usa" : "Spojené Státy",
        "uk" : "Spojené Království"
    }

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