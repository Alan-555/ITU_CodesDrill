export class CurrentQuestion{
    private code : string
    private country : string

    public readonly codeGiven : boolean

    public constructor(code : string, country : string, codeGiven : boolean){
        this.code = code;
        this.country = country;
        this.codeGiven = codeGiven;
    }

    public get GivenString(){
        return this.codeGiven ? this.code : this.country;
    }

    public get GuessedString(){
        return !this.codeGiven ? this.code : this.country;
    }
}