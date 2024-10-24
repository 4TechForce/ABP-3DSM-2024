import mongoose from 'mongoose';

export async function calculateClassification(
    peso: number,
    idade: Date,
    genero: string
  ): Promise<"Abaixo do Peso" | "Peso Normal" | "Sobrepeso"> { 
  
      const today = new Date();
      const birthDate = new Date(idade);
      const ageInMonths = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.436875)); // Converte para meses
  
      const growthCollection = ageInMonths < 24 ? 'peso_altura_idade_meses' : 'peso_altura_idade_anos';
  
      let generoNormalizado: string;
      if (genero === "Masculino") {
          generoNormalizado = "M";
      } else if (genero === "Feminino") {
          generoNormalizado = "F";
      } else {
          throw new Error("Gênero inválido. Use 'Masculino' ou 'Feminino'.");
      }
  
      const growthData = await mongoose.connection.collection(growthCollection)
          .findOne({ "Idade(meses)": ageInMonths.toString(), "Sexo": generoNormalizado });
  
      if (!growthData) {
          throw new Error('Curva de crescimento não encontrada para essa idade e sexo');
      }
  
      let classificacao: "Abaixo do Peso" | "Peso Normal" | "Sobrepeso" = "Peso Normal"; // Tipagem explícita da variável
      const pesoMinimo = parseFloat(growthData["Peso_mínimo(kg)"].replace(',', '.'));
      const pesoMaximo = parseFloat(growthData["Peso_máximo(kg)"].replace(',', '.'));
  
      if (peso < pesoMinimo) {
          classificacao = "Abaixo do Peso";
      } else if (peso >= pesoMinimo && peso <= pesoMaximo) {
          classificacao = "Peso Normal";
      } else if (peso > pesoMaximo) {
          classificacao = "Sobrepeso";
      }
  
      return classificacao; 
  }
  