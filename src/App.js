import { useEffect, useState } from 'react';
import './App.css';
import Formulario from './Formulario';
import Tabela from './Tabela';

function App() {

  // Objeto produto
  const produto = {
    codigo: null,
    nome: "",
    marca: ""
  }

  // UseState para controlar o estado do botão
  const [btnCadastrar, setBtnCadastrar] = useState(true);
  const [produtos, setProdutos] = useState([]);
  const [objProduto, setObjProduto] = useState(produto);


  // obtendo dados do formulário
  const aoDigitar = (e) => {
    setObjProduto({ ...objProduto, [e.target.name]: e.target.value })

  }

  // useEffect
  useEffect(() => {
    fetch("http://localhost:8081/listar")
      .then(retorno => retorno.json())
      .then(retorno_convertido => setProdutos(retorno_convertido));
  }, []);

  const cadastrar = () => {
    fetch("http://localhost:8081/cadastrar", {
      method: 'post',
      body: JSON.stringify(objProduto),
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(retorno => retorno.json())
      .then(retorno_convertido => {
        if (retorno_convertido.mensagem !== undefined) {
          alert(retorno_convertido.mensagem);
        } else {
          setProdutos([...produtos, retorno_convertido]);
          alert("Produto cadastrado com sucesso!");
          limparFormulario();
        }
      })
  }

  // remover produto
  const removerProduto = (indice) => {
   // tentar criar o metodo remover
  }

  // limpar formulario
  const limparFormulario = () => {
    setObjProduto(produto);
    setBtnCadastrar(true);
  }

  // selecionar produto
  const selecionarProduto = (indice) => {
    setObjProduto(produtos[indice]);
    setBtnCadastrar(false);
  }




  return (
    <div>
      <Formulario
        obj={objProduto}
        botao={btnCadastrar}
        eventoTeclado={aoDigitar}
        cadastrar={cadastrar}
        cancelar={limparFormulario}
        remover={removerProduto}
      />
      <Tabela
        vetor={produtos}
        selecionar={selecionarProduto} />
    </div>
  );
}

export default App;
