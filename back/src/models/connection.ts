import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

 //const uri = "mongodb://127.0.0.1:27017/pequenossabores";

const uri = process.env.ACESS_MONGO as string;
//mongodb+srv://<username>:<password>@cluster0.mongodb.net/<nome-do-banco>?retryWrites=true&w=majority

if (!uri) {
    throw new Error("A URI do MongoDB não está definida no arquivo .env");
  }

// const uri = "mongodb+srv://4forcetech:blow3wAELLQVIlvX@4techforce0.ye1eg.mongodb.net/?retryWrites=true&w=majority&appName=4techforce0";

export default function connect() {
   
    mongoose.connection.on("connected", () => console.log("connected"));
    mongoose.connection.on("open", () => console.log("open"));
    mongoose.connection.on("disconnected", () => console.log("disconnected"));
    mongoose.connection.on("reconnected", () => console.log("reconnected"));
    mongoose.connection.on("disconnecting", () => console.log("disconnecting"));
    mongoose.connection.on("close", () => console.log("close"));
   
     mongoose
        .connect(uri, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
        })
        .then(() => console.log("Conectado ao MongoDB"))
        .catch((e) => {
            console.error("Erro ao conectar ao MongoDB:", e.message);
        });
        
        
          
  
    process.on("SIGINT", async () => {
        try {
            console.log("Conexão com o MongoDB fechada");
            await mongoose.connection.close();
            process.exit(0);
        } catch (error) {
            console.error("Erro ao fechar a conexão com o MongoDB:", error);
            process.exit(1);
        }
    });
}

