class RetornoUserDTO{
    public url_avatar?: String = ""
    public token?: String = ""
    
    constructor(
        public nome:String,
        public sobrenome: String,
        public login: String,
        public email:String,
        public user_level:number = 1,
        public user_exp:number = 0,
        public user_next_level_exp: number = 100,
        public bloqueado:boolean = false,
        public vidas: number = 3,
        public id_avatar: number
    ){}
}

export default RetornoUserDTO;