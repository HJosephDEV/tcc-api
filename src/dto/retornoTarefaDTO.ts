import RespostaDTO from "./respostaDTO";

class RetornoTarefaDTO{
    constructor(
        public id: String,
        public nome:String,
        public conteudo:String,
        public tipo:number,
        public respostas: RespostaDTO[]
    ){}
}

export default RetornoTarefaDTO;