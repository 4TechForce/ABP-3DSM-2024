import { query, Request, Response } from 'express';
import { Historico } from '../models';
import mongoose from 'mongoose';

class HistoricoController {
  public async salvarRefeicao(req: Request, res: Response): Promise<Response> {
    try {
      const { userId, refeicao, alimentos } = req.body;
  
      console.log("Dados recebidos:", { userId, refeicao, alimentos });
  
      const alimentosCollection = mongoose.connection.collection('alimentos');
  
      // Verifica cada alimento antes de adicionar
      const alimentosDetalhados = await Promise.all(alimentos.map(async (alimento: { descricao: string }) => {
        console.log(`Buscando alimento com descrição: ${alimento.descricao}`);
      
        const alimentoDetalhado = await alimentosCollection.findOne({
          DESCRICAO_ALIMENTO: alimento.descricao
        });
      
        if (!alimentoDetalhado) {
          throw new Error(`Alimento com descrição ${alimento.descricao} não encontrado na tabela de alimentos`);
        }
      
        return {
          DESCRICAO_ALIMENTO: alimentoDetalhado.DESCRICAO_ALIMENTO,
          calorias: parseFloat(alimentoDetalhado["Energia(kcal)"]) || 0,
          proteina: parseFloat(alimentoDetalhado["Proteína(g)"]) || 0,
          carboidratos: parseFloat(alimentoDetalhado["Carboidrato(g)"]) || 0,
          gordura: parseFloat(alimentoDetalhado["Lipídios_totais(g)"]) || 0,
        };
      }));
      
  
      console.log("Alimentos detalhados processados:", alimentosDetalhados);
  
      // Criação de uma nova refeição
      const novaRefeicao = new Historico({
        userId,
        refeicao,
        alimentos: alimentosDetalhados,
        data: new Date(),
      });
  
      console.log("Salvando nova refeição no histórico:", novaRefeicao);
  
      await novaRefeicao.save();
  
      console.log("Refeição salva com sucesso");
  
      return res.status(201).json({ message: "Refeição salva com sucesso", refeicao: novaRefeicao });
    } catch (error: any) {
      console.error("Erro ao salvar a refeição:", error);
      if (error.message.includes("não encontrado na tabela de alimentos")) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro ao salvar a refeição" });
    }
  }
  
  // Método para buscar o histórico de refeições do usuário em uma data específica
  public async listarHistorico(req: Request, res: Response) {
    const { userId } = req.query;  // Pegue o userId da query string

    if (!userId) {
      return res.status(400).json({ message: 'userId é necessário' });
    }

    try {
      const refeicoes = await Historico.find({ userId });
      if (refeicoes.length === 0) {
        return res.status(404).json({ message: 'Nenhuma refeição encontrada para este usuário' });
      }
      return res.status(200).json({ historico: refeicoes });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar histórico de refeições' });
    }
  }
}

export default new HistoricoController();








