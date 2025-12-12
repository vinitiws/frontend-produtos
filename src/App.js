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


  // cadastrar produtos 
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

  // alterar produtos 
  const alterar = () => {
    fetch("http://localhost:8081/alterar/" + objProduto.codigo, {
      method: 'put',
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

          // mensagem
          alert("Produto alterado com sucesso!");

          // copia do vetor de produtos
          let vetorTemp = [...produtos];

          // indice do produto a ser removido
          let indice = vetorTemp.findIndex((p) => {
            return p.codigo === objProduto.codigo;
          })

          // alterar produto do vertorTemp
          vetorTemp[indice] = objProduto;

          // atualizar o vetor de produtos
          setProdutos(vetorTemp);

          // limpar o formulário
          limparFormulario();
        }
      })
  }

  // remover produtos
  const remover = () => {
    fetch("http://localhost:8081/remover/" + objProduto.codigo, {
      method: 'delete',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(retorno => retorno.json())
      .then(retorno_convertido => {

        // mensagem
        alert(retorno_convertido.mensagem);
        console.log(retorno_convertido);

        // copia do vetor de produtos
        let vetorTemp = [...produtos];

        // indice do produto a ser removido
        let indice = vetorTemp.findIndex((p) => {
          return p.codigo === objProduto.codigo;
        })

        // remover produto do vertorTemp
        vetorTemp.splice(indice, 1);

        // atualizar o vetor de produtos
        setProdutos(vetorTemp);

        // limpar formulário
        limparFormulario();


      })
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
        remover={remover}
        alterar={alterar}
      />
      <Tabela
        vetor={produtos}
        selecionar={selecionarProduto}
      />
    </div>
  );
}

export default App;
