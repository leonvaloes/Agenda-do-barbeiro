class unformatDate {
    dateT: string;
    date: Date;

    constructor() {
        this.dateT = "";
    }

    FormatDate(date: Date) {
        const ano = date.getFullYear();
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const dia = String(date.getDate()).padStart(2, '0');
        const hora = String(date.getHours()).padStart(2, '0');
        const minuto = String(date.getMinutes()).padStart(2, '0');
        const segundo = String(date.getSeconds()).padStart(2, '0');

        this.dateT = `${ano}-${mes}-${dia} ${hora}:${minuto}`;
        return this.dateT;
    }

    unformatDate(data: any) {
        if (data instanceof Date) {
            return data;
        }

        this.date = new Date(data.replace(" ", "T"));
        return this.date;
    }
}

export default unformatDate;
