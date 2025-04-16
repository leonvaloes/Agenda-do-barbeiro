class unformatDate{
    dateT:String;
    date:Date;

    constructor (){
        this.dateT = "";
    }

    FormatDate(date: Date) {
        const ano = date.getUTCFullYear();
        const mes = String(date.getUTCMonth() + 1).padStart(2, '0');
        const dia = String(date.getUTCDate()).padStart(2, '0');
        const hora = String(date.getUTCHours()).padStart(2, '0');
        const minuto = String(date.getUTCMinutes()).padStart(2, '0');
        const segundo = String(date.getUTCSeconds()).padStart(2, '0');

        this.dateT = `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
        return this.dateT;
    }

    unformatDate(data:any){
        this.date= new Date(data.replace(" ", "T") + "Z");
        return this.date;
    }
}

export default unformatDate;