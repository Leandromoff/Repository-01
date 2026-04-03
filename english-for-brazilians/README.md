# English for Brazilians 🇧🇷🇺🇸

Site estático de ensino de inglês para brasileiros, com flashcards interativos, modo de estudo, quiz e favoritos.

## Como abrir o site

Basta abrir o arquivo `index.html` em qualquer navegador moderno. Não é necessário servidor ou instalação.

## Estrutura de arquivos

```
english-for-brazilians/
├── index.html          ← Página principal com lista de tópicos
├── topic.html          ← Página de cada tópico (carregada via ?id=...)
├── favorites.html      ← Página de favoritos salvos
├── css/
│   ├── styles.css      ← Estilos principais
│   └── animations.css  ← Animações e transições
├── js/
│   ├── data.js         ← ⭐ AQUI ficam todos os tópicos e conteúdo
│   ├── app.js          ← Lógica principal (renderização, busca, modo estudo)
│   ├── quiz.js         ← Sistema de quiz de múltipla escolha
│   └── favorites.js    ← Sistema de favoritos (localStorage)
└── assets/             ← Imagens e ícones (se necessário)
```

## Como adicionar um novo tópico

Edite o arquivo `js/data.js` e adicione um novo objeto ao array `TOPICS`.

### Estrutura de um tópico

```javascript
{
  id: "meu-topico",              // ID único, sem espaços (usado na URL)
  title: "My Topic - Subtitle",  // Título do tópico
  description: "Descrição do que será aprendido neste tópico.",
  icon: "🎓",                    // Emoji do tópico

  // Título e explicação da regra gramatical
  grammarTitle: "Nome da regra",
  grammarExplanation: `
    <p>Explicação em HTML. Pode usar <strong>negrito</strong>, tabelas, etc.</p>
  `,

  // Cada seção é um array de objetos { en, pt }
  verbs: [
    { en: "to do", pt: "fazer" },
    { en: "to go",  pt: "ir" }
  ],

  newWords: [
    { en: "happy", pt: "feliz" },
    { en: "sad",   pt: "triste" }
  ],

  phrases: [
    { en: "How are you?",  pt: "Como vai você?" },
    { en: "I'm fine.",     pt: "Estou bem." }
  ],

  grammar: [
    { en: "I am happy.",   pt: "Eu estou feliz." },
    { en: "She is sad.",   pt: "Ela está triste." }
  ],

  realLife: [
    { en: "Are you happy with your job?", pt: "Você está feliz com seu trabalho?" }
  ]
}
```

### Exemplo completo

```javascript
// Cole este objeto dentro do array TOPICS em js/data.js

{
  id: "greetings",
  title: "Greetings & Introductions",
  description: "Aprenda a se apresentar e cumprimentar pessoas em inglês.",
  icon: "👋",
  grammarTitle: "Verb To Be (present)",
  grammarExplanation: `
    <p><strong>To be</strong> no presente: I <u>am</u>, You/We/They <u>are</u>, He/She/It <u>is</u>.</p>
  `,
  verbs: [
    { en: "to be",   pt: "ser, estar" },
    { en: "to meet", pt: "conhecer, encontrar" }
  ],
  newWords: [
    { en: "nice",    pt: "legal, simpático(a)" },
    { en: "pleased", pt: "prazeroso(a), satisfeito(a)" }
  ],
  phrases: [
    { en: "Nice to meet you!", pt: "Prazer em conhecê-lo(a)!" },
    { en: "What's your name?", pt: "Qual é o seu nome?" }
  ],
  grammar: [
    { en: "I am a student.",   pt: "Eu sou estudante." },
    { en: "She is a teacher.", pt: "Ela é professora." }
  ],
  realLife: [
    { en: "Hi! I'm Ana. Nice to meet you!", pt: "Oi! Eu sou a Ana. Prazer em conhecê-lo!" }
  ]
}
```

## Funcionalidades

| Funcionalidade | Como usar |
|---|---|
| **Flashcard** | Clique em qualquer card para ver a tradução |
| **Favoritos** | Clique na estrela ⭐ no canto do card |
| **Study Mode** | Botão "Study Mode" — esconde traduções, clique para revelar uma a uma |
| **Quiz** | Botão "Quiz" em cada seção ou "Test Yourself" para todas as seções |
| **Busca** | Digite no campo de busca no topo |
| **Favoritos** | Página "Favorites" no menu — revise e faça quiz dos seus favoritos |

## Tecnologias

- HTML5 semântico
- CSS3 (variáveis, grid, flexbox, animações, flip 3D)
- JavaScript puro (ES6+), sem frameworks
- localStorage para favoritos persistentes
