class RankingDTO{
    constructor(
        public id: String,
        public id_usuario: String,
        public nome: String,
        public user_level: number,
        public user_exp: number,
        public url: String,
        public rank: number
    ){}
}

export default RankingDTO;