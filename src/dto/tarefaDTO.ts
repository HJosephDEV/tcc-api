import RespostaDTO from "./respostaDTO";

class TarefaDTO{
    constructor(
        public id: String,
        public nome:String,
        public conteudo:String,
        public tipo:number,
        public exp:number,
        public idModulo: String,
        public respostas: RespostaDTO[]
    ){}
}

export default TarefaDTO;