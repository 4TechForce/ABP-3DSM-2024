import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        unique: true,
        maxlength: [30, "O nome pode ter no máximo 30 caracteres"],
        required: [true, "O nome é obrigatório"],
    },

    mail: {
        type: String,
        unique: true,
        maxlength: [30, "O email pode ter no máximo 30 caracteres"],
        required: [true, "O email é obrigatório"],
        validate: {
            validator: function (value: string) {
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return regex.test(value);
            },
            messge: (props: any) => `${props.value} não é um formato de e-mail válido`,
        },
    },

    password: {
        type: String,
        trim: true,
        minlength: [6, "A senha precisa ter no mínimo 6 caracteres"],
        maxlength: [10, "A senha precisa ter no máximo 10 caracteres"],
        select: false,
        required: [true, "A senha é obrigatória"],
    },

    idade: {
        type: Number,
        min: [0, "A idade deve ser maior ou igual a 0"],
        max: [100, "A idade deve ser menor ou igual a 120"],
        required: [true, "Informe sua idade"]
    },

    peso: {
        type: Number,
        min: [0, "O peso deve ser maior que 0"],
        max: 1000,
        required: [true, "Informe seu peso"]
    },

    altura: {
        type: Number,
        min: [0, "A altura deve ser maior que 0"],
        max: [300, "A altura deve ser menor que 300 cm"],
        required: [true, "Informe sua altura"]
    },
});

const User = mongoose.model("User", UserSchema, "user");
export { User };