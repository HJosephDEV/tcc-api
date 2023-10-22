"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RetornoUserDTO {
    constructor(id, nome, sobrenome, login, email, user_level = 1, user_exp = 0, user_next_level_exp = 100, bloqueado = false, vidas = 3, id_avatar, url_avatar) {
        this.id = id;
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.login = login;
        this.email = email;
        this.user_level = user_level;
        this.user_exp = user_exp;
        this.user_next_level_exp = user_next_level_exp;
        this.bloqueado = bloqueado;
        this.vidas = vidas;
        this.id_avatar = id_avatar;
        this.url_avatar = url_avatar;
    }
}
exports.default = RetornoUserDTO;
