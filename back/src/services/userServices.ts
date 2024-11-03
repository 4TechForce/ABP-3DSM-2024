import mongoose from "mongoose";

export async function calculateClassification(
    peso: number,
    idade: Date,
    genero: string
): Promise<{ classificacao: "Abaixo do Peso" | "Peso Normal" | "Sobrepeso"; pesoIdeal: { minimo: number; maximo: number } }> {
    
    const today = new Date();
    const birthDate = new Date(idade);
    const ageInMonths = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.436875));

    const growthCollection = ageInMonths < 24 ? 'peso_altura_idade_meses' : 'peso_altura_idade_anos';
    const ageKey = growthCollection === 'peso_altura_idade_meses' ? 'Idade(meses)' : 'Idade(anos)';
    const ageValue = growthCollection === 'peso_altura_idade_meses' ? ageInMonths.toString() : Math.floor(ageInMonths / 12).toString();

    let generoNormalizado: string;
    if (genero === "Masculino") {
        generoNormalizado = "M";
    } else if (genero === "Feminino") {
        generoNormalizado = "F";
    } else {
        throw new Error("Gênero inválido. Use 'Masculino' ou 'Feminino'.");
    }

    console.log(`Consultando na coleção: ${growthCollection} para ${ageKey}: ${ageValue} e sexo: ${generoNormalizado}`);

    const growthData = await mongoose.connection.collection(growthCollection)
        .findOne({ [ageKey]: ageValue, "Sexo": generoNormalizado });

    if (!growthData) {
        throw new Error('Curva de crescimento não encontrada para essa idade e sexo');
    }

    const pesoMinimo = parseFloat(growthData["Peso_mínimo(kg)"].replace(',', '.'));
    const pesoMaximo = parseFloat(growthData["Peso_máximo(kg)"].replace(',', '.'));
    let classificacao: "Abaixo do Peso" | "Peso Normal" | "Sobrepeso" = "Peso Normal";

    if (peso < pesoMinimo) {
        classificacao = "Abaixo do Peso";
    } else if (peso > pesoMaximo) {
        classificacao = "Sobrepeso";
    }

    return {
        classificacao,
        pesoIdeal: { minimo: pesoMinimo, maximo: pesoMaximo }
    };
}
