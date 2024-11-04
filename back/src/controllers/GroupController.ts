import { Request, Response } from 'express';
import mongoose from 'mongoose';

class GroupController {
  public async group(req: Request, res: Response): Promise<Response> {
    const query = req.query.q as string;
    console.log("Query de busca recebida:", query);

    // Mapeamento dos grupos
    const tipoAlimentoGrupo: { [key: string]: string } = {
      'Hortaliças tuberosas': 'Reguladores',
      'Cereais e leguminosas': 'Reguladores',
      'Hortaliças folhosas, frutosas e outras': 'Reguladores',
      'Frutas': 'Reguladores',
      'Sais e condimentos': 'Reguladores',
      'Bebidas não alcoólicas e infusões':'Reguladores',

      'Carnes e vísceras': 'Construtores',
      'Pescados e frutos do mar': 'Construtores',
      'Carnes industrializadas': 'Construtores',
      'Laticínios': 'Construtores',
      'Aves e ovos': 'Construtores',
      'Bebidas alcoólicas':'Construtores',
      
      'Cocos, castanhas e nozes': 'Energéticos',
      'Farinhas, féculas e massas': 'Energéticos',
      'Açúcares e produtos de confeitaria': 'Energéticos',
      'Enlatados e conservas': 'Energéticos',
      'Panificados': 'Energéticos',
      'Óleos e gorduras': 'Energéticos',
      'Miscelâneas':'Energéticos'
    };

    try {
      const alimentosCollection = mongoose.connection.collection('alimentos');
      const alimentos = await alimentosCollection.find({ DESCRICAO_ALIMENTO: { $regex: query, $options: 'i' } }).toArray();

      console.log("Alimentos encontrados:", alimentos); // Adicione este log para ver os alimentos encontrados

      if (alimentos.length === 0) {
        return res.status(404).json({ message: 'Nenhum alimento encontrado' });
      }

      const tipoAlimentoCollection = mongoose.connection.collection('tipo_alimento');
      const codigosTipo = alimentos.map(a => a.CODIGO_TIPO).filter(Boolean);
      const tiposAlimento = await tipoAlimentoCollection.find({ CODIGO_TIPO: { $in: codigosTipo } }).toArray();

      const mapTipoAlimento = tiposAlimento.reduce((acc, tipo) => {
        acc[tipo.CODIGO_TIPO] = tipo.DESCRICAO;
        return acc;
      }, {} as Record<string, string>);

      const alimentosCompletos = alimentos.map((alimento) => {
        const grupo = mapTipoAlimento[alimento.CODIGO_TIPO] ? tipoAlimentoGrupo[mapTipoAlimento[alimento.CODIGO_TIPO]] || 'Grupo desconhecido' : 'Grupo desconhecido';
        return {
          descricao: alimento.DESCRICAO_ALIMENTO || 'Sem descrição disponível',
          tipo_alimento: mapTipoAlimento[alimento.CODIGO_TIPO] || 'Tipo de alimento desconhecido',
          grupo,
        };
      });

      return res.status(200).json(alimentosCompletos);

    } catch (error) {
      console.error("Erro ao buscar alimentos:", error);
      return res.status(500).json({ message: "Erro ao buscar alimentos" });
    }
  }
}

export default new GroupController();
