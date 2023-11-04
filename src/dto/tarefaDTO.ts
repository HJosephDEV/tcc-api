import RespostaDTO from "./respostaDTO";

class TarefaDTO{
    constructor(
        public id: String,
        public nome: String,
        public conteudo: String,
        public tipo: number,
        public tarefa_exp: number,
        public id_modulo: String,
        public respostas: RespostaDTO[],
        public index_resp: number
    ){}
}

export default TarefaDTO;