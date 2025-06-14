const numerosContainer = document.getElementById("numeros");
const paresSpan = document.getElementById("pares");
const imparesSpan = document.getElementById("impares");
const totalJogosSpan = document.getElementById("total-jogos");
const combinacoesSpan = document.getElementById("combinacoes");
const resultadosSection = document.getElementById("resultados");

const selecionados = new Set();
const MAX_SELECAO = 14;

for (let i = 1; i <= 25; i++) {
  const btn = document.createElement("button");
  btn.textContent = i;
  btn.classList.add("numero");
  btn.addEventListener("click", () => toggleNumero(i, btn));
  numerosContainer.appendChild(btn);
}

function toggleNumero(numero, botao) {
  if (selecionados.has(numero)) {
    selecionados.delete(numero);
    botao.classList.remove("selecionado");
  } else {
    if (selecionados.size >= MAX_SELECAO) {
      alert("Você só pode escolher até 14 números fixos.");
      return;
    }
    selecionados.add(numero);
    botao.classList.add("selecionado");
  }

  atualizarContagemParImpar();
  atualizarCombinacoes();
}

function atualizarContagemParImpar() {
  let pares = 0;
  let impares = 0;

  selecionados.forEach(n => {
    n % 2 === 0 ? pares++ : impares++;
  });

  paresSpan.textContent = pares;
  imparesSpan.textContent = impares;
}

function atualizarCombinacoes() {
  const r = 15 - selecionados.size;
  const restantes = 25 - selecionados.size;

  if (r < 0) {
    combinacoesSpan.textContent = "0";
    return;
  }

  const combinacoes = fatorial(restantes) / (fatorial(r) * fatorial(restantes - r));
  combinacoesSpan.textContent = Math.round(combinacoes);
}

function fatorial(n) {
  if (n <= 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

document.getElementById("limpar-btn").addEventListener("click", () => {
  selecionados.clear();
  document.querySelectorAll(".numero").forEach(btn => btn.classList.remove("selecionado"));
  paresSpan.textContent = 0;
  imparesSpan.textContent = 0;
  combinacoesSpan.textContent = 0;
});

document.getElementById("form-personalizado").addEventListener("submit", function (e) {
  e.preventDefault();

  const quantidadeJogos = parseInt(document.getElementById("quantidade-jogos").value);
  const paresDesejados = parseInt(document.getElementById("pares-desejados").value);
  const imparesDesejados = parseInt(document.getElementById("impares-desejados").value);

  if (quantidadeJogos > 30) {
    alert("Máximo de 30 jogos permitidos.");
    return;
  }

  const jogos = [];

  for (let i = 0; i < quantidadeJogos; i++) {
    const jogo = gerarJogoComRestricoes(paresDesejados, imparesDesejados);
    jogos.push(jogo);
  }

  exibirJogos(jogos);
  totalJogosSpan.textContent = jogos.length;
});

function gerarJogoComRestricoes(paresAlvo, imparesAlvo) {
  const fixos = Array.from(selecionados);
  const faltando = 15 - fixos.length;
  let restantes = [];

  for (let i = 1; i <= 25; i++) {
    if (!selecionados.has(i)) {
      restantes.push(i);
    }
  }

  let tentativa = 0;
  let combinacao;

  while (tentativa < 1000) {
    tentativa++;

    const escolhidos = [...fixos];
    const copia = [...restantes].sort(() => Math.random() - 0.5);

    for (let i = 0; i < faltando; i++) {
      escolhidos.push(copia[i]);
    }

    const pares = escolhidos.filter(n => n % 2 === 0).length;
    const impares = 15 - pares;

    if (pares === paresAlvo && impares === imparesAlvo) {
      combinacao = escolhidos.sort((a, b) => a - b);
      break;
    }
  }

  return combinacao || gerarJogoAleatorio(fixos);
}

function gerarJogoAleatorio(fixos) {
  const jogo = [...fixos];
  const restantes = [];

  for (let i = 1; i <= 25; i++) {
    if (!fixos.includes(i)) {
      restantes.push(i);
    }
  }

  while (jogo.length < 15) {
    const index = Math.floor(Math.random() * restantes.length);
    jogo.push(restantes.splice(index, 1)[0]);
  }

  return jogo.sort((a, b) => a - b);
}

function exibirJogos(jogos) {
  const container = resultadosSection;
  container.innerHTML = "<h2>Jogos Gerados</h2>";

  jogos.forEach((jogo, index) => {
    const div = document.createElement("div");
    div.classList.add("jogo");
    div.textContent = `Jogo ${index + 1}: ${jogo.join(", ")}`;
    container.appendChild(div);
  });
}
