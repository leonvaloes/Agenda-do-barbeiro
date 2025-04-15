class unformatDate{
    date:String;

    constructor (){
        this.date = "";
    }

    async unformatDate(date:any) {
        this.date = date.toLocaleString();
    }
}