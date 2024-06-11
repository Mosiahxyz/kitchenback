//importações 
import express from 'express'
import { sqlConfig } from "./config.js"
import sql from 'mssql';

//conexão com MySql (banco)
const pool = new sql.ConnectionPool(sqlConfig)
await pool.connect();
const routes = express.Router();

routes.get('/receitas', async (req,res)=>{


    try{
        const { recordset }  = await pool.query`select * from receitas`
        return res.status(200).json(recordset)
    }
    catch{
        return res.status(501).json('erro ao consultar receitas')
    }
})

routes.get('/ingredientes', async (req,res)=>{

    try{
        const { recordset }  = await pool.query`select * from ingredientes`
        return res.status(200).json(recordset)
    }

    catch{
        return res.status(501).json('erro ao consultar ingredientes')
    }

})

routes.post('/match', async (req, res) => {

    const ingredientes = req.body;
    const receitas = []

    try{
        for (let i = 0; i < ingredientes.length; i++) {
            receitas[i]  = await pool.query("SELECT r.id AS Receita_ID, r.nome AS Receita_Nome, r.descricao AS Receita_Descricao, r.imagem_receita AS Receita_Imagem, r.link_receita AS Receita_Link, r.link_video AS Receita_Video, i.id AS Ingrediente_ID, i.nome AS Ingrediente_Nome, i.imagem_ingrediente AS Ingrediente_Imagem FROM Receitas_ingredientes ri JOIN receitas r ON ri.ID_Receita = r.id JOIN ingredientes i ON ri.ID_Ingrediente = i.id WHERE r.id IN (SELECT ID_Receita FROM Receitas_ingredientes WHERE ID_Ingrediente = " + ingredientes[i] + ");")
        }
        return res.status(200).json(receitas)
    }
    catch{
        return res.status(501).json('erro ao consultar receitas')
    }
});

//exportar para o app
export default routes
