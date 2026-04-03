/**
 * data.js - Banco de dados dos tópicos do site English for Brazilians
 *
 * COMO ADICIONAR UM NOVO TÓPICO:
 * 1. Copie o objeto de exemplo abaixo
 * 2. Preencha os campos: id, title, description, icon, e as seções (verbs, newWords, phrases, grammar, realLife)
 * 3. Cole o novo objeto dentro do array TOPICS
 * 4. O site vai reconhecer automaticamente o novo tópico
 *
 * Estrutura de cada item:
 *   { en: "palavra em inglês", pt: "tradução em português" }
 *
 * Para a seção grammar, adicione também o campo 'rule' com a explicação gramatical.
 */

const TOPICS = [
  {
    id: "at-home",
    title: "At Home - Rooms & Furniture",
    description: "Aprenda vocabulário sobre casa, cômodos e móveis em inglês.",
    icon: "🏠",
    // Explicação gramatical principal do tópico
    grammarTitle: "There is / There are",
    grammarExplanation: `
      <p><strong>There is</strong> é usado para indicar a existência de <u>uma coisa</u> (singular).</p>
      <p><strong>There are</strong> é usado para indicar a existência de <u>mais de uma coisa</u> (plural).</p>
      <table class="grammar-table">
        <thead>
          <tr><th>Forma</th><th>Singular</th><th>Plural</th></tr>
        </thead>
        <tbody>
          <tr><td>Afirmativa</td><td>There is (There's)</td><td>There are</td></tr>
          <tr><td>Negativa</td><td>There isn't</td><td>There aren't</td></tr>
          <tr><td>Interrogativa</td><td>Is there...?</td><td>Are there...?</td></tr>
        </tbody>
      </table>
    `,
    verbs: [
      { en: "to move", pt: "mover, mudar" },
      { en: "to put", pt: "colocar, pôr" }
    ],
    newWords: [
      { en: "armchair", pt: "poltrona" },
      { en: "chair", pt: "cadeira" },
      { en: "desk", pt: "escrivaninha" },
      { en: "carpet", pt: "tapete" },
      { en: "tidy", pt: "arrumado(a)" },
      { en: "broken", pt: "quebrado(a)" },
      { en: "messy", pt: "bagunçado(a)" },
      { en: "dirty", pt: "sujo(a)" },
      { en: "to the left", pt: "para a esquerda" },
      { en: "to the right", pt: "para a direita" },
      { en: "next to", pt: "ao lado de" }
    ],
    phrases: [
      { en: "Put away these clothes in the closet, please.", pt: "Guarde essas roupas no guarda-roupa, por favor." },
      { en: "Don't put this chair here. It's broken.", pt: "Não coloque essa cadeira aqui. Está quebrada." },
      { en: "What a mess!", pt: "Que bagunça!" },
      { en: "I always clean up my desk after work.", pt: "Eu sempre limpo minha escrivaninha depois do trabalho." }
    ],
    grammar: [
      { en: "There is a closet in this room, too.", pt: "Tem um armário no quarto também." },
      { en: "There are four bookshelves here.", pt: "Tem quatro estantes aqui." },
      { en: "There isn't a coffee table in this living room.", pt: "Não tem uma mesa de centro nesta sala de estar." },
      { en: "There aren't any carpets in my new house.", pt: "Não tem nenhum tapete na minha casa nova." },
      { en: "There aren't any armchairs in the bedroom.", pt: "Não há poltronas no quarto." },
      { en: "There isn't an ATM near here?", pt: "Não tem nenhum caixa eletrônico perto daqui?" },
      { en: "Is there a swimming pool in this hotel?", pt: "Tem alguma piscina neste hotel?" },
      { en: "Is there an ATM near here?", pt: "Tem algum caixa eletrônico perto daqui?" },
      { en: "How many shopping malls are there in this city?", pt: "Quantos shoppings têm nesta cidade?" }
    ],
    realLife: [
      { en: "Move this coffee table to the left, please.", pt: "Mude esta mesa de centro para a esquerda, por favor." },
      { en: "Don't put the dirty carpets here, please.", pt: "Não coloque os tapetes sujos aqui, por favor." },
      { en: "Let's move this armchair to the right side.", pt: "Vamos mudar esta poltrona para o lado direito." },
      { en: "Put the desk next to the dresser, please.", pt: "Coloque a escrivaninha ao lado da cômoda, por favor." },
      { en: "Your bedroom is so tidy. My house is really messy!", pt: "Seu quarto é tão arrumado. Minha casa é muito bagunçada!" },
      { en: "What a mess! I need to clean up this kitchen.", pt: "Que bagunça! Eu preciso limpar esta cozinha." },
      { en: "Why do you need to move to New York?", pt: "Por que você precisa se mudar para Nova York?" },
      { en: "My husband wants to put a new closet in our bedroom.", pt: "Meu marido quer colocar um guarda-roupa novo no nosso quarto." },
      { en: "The laptop on the desk is broken.", pt: "O notebook em cima da escrivaninha está quebrado." },
      { en: "Is there a vegan restaurant near here?", pt: "Tem algum restaurante vegano aqui perto?" },
      { en: "There are some good bookstores in this mall.", pt: "Tem algumas livrarias boas neste shopping." }
    ]
  }
];
