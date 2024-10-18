import { Request, Response } from 'express';
import mongoose from 'mongoose';

class FoodController {
  public async search(req: Request, res: Response): Promise<Response> {
    const query = req.query.q as string;
    console.log("Query de busca recebida:", query);

    try {
      const alimentosCollection = mongoose.connection.collection('alimentos');
      const alimentos = await alimentosCollection.find({ DESCRICAO_ALIMENTO: { $regex: query, $options: 'i' } }).toArray();

      if (alimentos.length === 0) {
        return res.status(404).json({ message: 'Nenhum alimento encontrado' });
      }

      const preparacaoCollection = mongoose.connection.collection('preparacao');
      const tipoAlimentoCollection = mongoose.connection.collection('tipo_alimento');

      const alimentosCompletos = await Promise.all(
        alimentos.map(async (alimento) => {
          console.log("Código de preparação encontrado para alimento:", alimento.CODIGO_PREPARACAO);

          let preparacao = null;
          if (alimento.CODIGO_PREPARACAO) {
            preparacao = await preparacaoCollection.findOne({ CODIGO_PREPARACAO: String(alimento.CODIGO_PREPARACAO) });
            //console.log("Preparação encontrada para código", alimento.CODIGO_PREPARACAO, ":", preparacao);
          } else {
            console.log("Código de preparação não encontrado para alimento:", alimento.DESCRICAO_ALIMENTO);
          }

          const tipoAlimento = await tipoAlimentoCollection.findOne({ codigo: alimento.CODIGO_TIPO_ALIMENTO });
          //console.log("Tipo de alimento encontrado:", tipoAlimento);

          const proteina = parseFloat(alimento["Proteína(g)"]) || 0;
          const carboidratos = parseFloat(alimento["Carboidrato(g)"]) || 0;
          const calorias = parseFloat(alimento["Energia(kcal)"]) || 0;
          const nutrientes = {
            calcio: parseFloat(alimento["Cálcio(mg)"]) || 0,
            ferro: parseFloat(alimento["Ferro(mg)"]) || 0,
            fosforo: parseFloat(alimento["Fósforo(mg)"]) || 0,
            sodio: parseFloat(alimento["Sódio(mg)"]) || 0,
            potassio: parseFloat(alimento["Potássio(mg)"]) || 0,
          };

          const alimentoDividido = {
            construtores: {
              proteina: proteina,
            },
            energeticos: {
              carboidratos: carboidratos,
              calorias: calorias,
            },
            reguladores: {
              nutrientes: {
                calcio: nutrientes.calcio,
                ferro: nutrientes.ferro,
                fosforo: nutrientes.fosforo,
                sodio: nutrientes.sodio,
                potassio: nutrientes.potassio,
              },
            },
            descricao: alimento.DESCRICAO_ALIMENTO || 'Sem descrição disponível',
            preparacao: preparacao ? preparacao.DESCRICAO : 'Sem preparação associada',
            tipo_alimento: tipoAlimento ? tipoAlimento.DESCRICAO : 'Tipo de alimento desconhecido',
          };

          return alimentoDividido;
        })
      );

      return res.status(200).json(alimentosCompletos);

    } catch (error) {
      console.error("Erro ao buscar alimentos:", error);
      return res.status(500).json({ message: "Erro ao buscar alimentos" });
    }
  }
}

export default new FoodController();
