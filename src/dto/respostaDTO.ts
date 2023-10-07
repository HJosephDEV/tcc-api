class RespostaDTO{
    constructor(
        public id: String,
        public descricao:String,
        public resposta_correta:String,
        public idTarefa: number
    ){}
}

export default RespostaDTO;