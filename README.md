# FlashConcurseiro 🎯

Aplicativo mobile de flashcards para concursos públicos com sistema de repetição espaçada, arquitetura moderna e sincronização em tempo real.

<!-- ![FlashConcurseiro](https://github.com/matheusgit1/FlashConcurseiro/blob/main/screenshots/screenshot_2.jpeg) -->

---

## 📱 Sobre o Projeto

FlashConcurseiro é um aplicativo mobile desenvolvido para otimizar os estudos de concursos públicos por meio de flashcards. O sistema utiliza o algoritmo de **repetição espaçada** para revisões inteligentes, garantindo maior retenção de conteúdo com base na curva do esquecimento de Ebbinghaus.

A aplicação foi construída com **React Native (Expo)**, **TypeScript** e **Firebase**, oferecendo autenticação, sincronização em tempo real e capacidade offline-first.

### 🚀 Demonstração

| Home | Flashcards | Revisão com Swipe | Estatísticas |
|------|------------|-------------------|--------------|
| ![Home](https://github.com/matheusgit1/FlashConcurseiro/blob/main/screenshots/screenshot_2.jpeg) | ![Flashcards](https://github.com/matheusgit1/FlashConcurseiro/blob/main/screenshots/screenshot_7.jpeg) | ![Revisão](https://github.com/matheusgit1/FlashConcurseiro/blob/main/screenshots/screenshot_4.jpeg) | ![Estatísticas](https://github.com/matheusgit1/FlashConcurseiro/blob/main/screenshots/screenshot_1.jpeg) |

---

## ✨ Funcionalidades Principais

- **Sistema de Repetição Espaçada (SRS)** - Algoritmo inteligente que agenda revisões com base no desempenho do usuário
- **Sincronização em Tempo Real** - Dados sincronizados entre dispositivos via Firebase
- **Offline-first** - Funciona mesmo sem conexão com a internet
- **Navegação Híbrida** - Tabs + Stack com Expo Router
- **Autenticação** - Login/Registro com Firebase Auth (Email/Senha + Google)
- **Filtros Dinâmicos** - Filtrar flashcards por concurso, disciplina e dificuldade
- **Swipe de Revisão** - Deslize para direita (acerto) ou esquerda (erro) com feedback visual
- **Estatísticas Detalhadas** - Progresso por disciplina, concurso, dificuldade e status
- **Compartilhamento** - Compartilhe flashcards com amigos

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React Native** + **Expo 51** - Framework para apps nativos
- **TypeScript** - Tipagem estática
- **Expo Router** - Navegação baseada em arquivos
- **React Native Reanimated** - Animações fluidas
- **React Native Gesture Handler** - Gestos de swipe
- **React Native Safe Area Context** - Suporte a dispositivos com notch

### Backend & Infraestrutura
- **Firebase Authentication** - Gerenciamento de usuários
- **Firestore** - Banco de dados NoSQL em tempo real
- **Firebase Security Rules** - Regras de segurança
- **Firebase Admin SDK** - Operações administrativas

### DevOps
- **EAS Build** - Build e distribuição
- **Firebase Hosting** - Hospedagem (se aplicável)
- **Docker** - Ambiente de desenvolvimento

### Testes
- **Jest** - Testes unitários
- **React Native Testing Library** - Testes de componentes
- **Detox** - Testes end-to-end

---

## 📂 Estrutura do Projeto

```
FlashConcurseiro/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   ├── registro.tsx
│   │   └── _layout.tsx
│   ├── (tabs)/
│   │   ├── home/
│   │   │   └── index.tsx
│   │   ├── concursos/
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx
│   │   ├── disciplinas/
│   │   │   └── [id].tsx
│   │   ├── flashcards/
│   │   │   ├── index.tsx
│   │   │   ├── [id].tsx
│   │   │   └── revisao.tsx
│   │   ├── estatisticas/
│   │   │   └── index.tsx
│   │   ├── perfil/
│   │   │   └── index.tsx
│   │   └── _layout.tsx
│   ├── _layout.tsx
│   └── index.tsx
├── src/
│   ├── services/
│   │   └── firebase.ts
│   ├── styles/
│   │   └── theme.ts
│   ├── types/
│   │   ├── concurso.types.ts
│   │   ├── disciplina.types.ts
│   │   └── flashcard.types.ts
│   ├── contexts/
│   │   └── AuthContext.tsx
│   └── mocks/
│       ├── concursos.mock.ts
│       ├── disciplinas.mock.ts
│       └── flashcards.mock.ts
├── assets/
├── scripts/
│   └── populate-flashcards.ts
├── app.json
├── eas.json
├── firestore.rules
├── package.json
├── tsconfig.json
└── README.md
```


---

## 🔧 Como Rodar o Projeto

### Pré-requisitos

- Node.js 18+
- Expo CLI
- Docker (opcional, para ambiente local com Firebase Emulator)
- Android Studio / Xcode (para emuladores)

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/matheusgit1/flashconcurseiro.git
cd flashconcurseiro
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo .env na raiz:

```shell
EXPO_PUBLIC_FIREBASE_API_KEY=seu_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

4. **Popule banco de dados**

```bash
npx ts-node scripts/populate-flashcards.ts
```

5. **Execute o projeto**

```bash
npx expo start
```

---

## 🚀 Build e Deploy

### Android

```bash
# APK para testes
eas build --platform android --profile preview

# AAB para Play Store
eas build --platform android --profile production
```

### iOS

```bash
# Para teste no simulador
eas build --platform ios --profile preview

# Para App Store
eas build --platform ios --profile production
```

---

## 📈 Arquitetura
A arquitetura do FlashConcurseiro segue o padrão de separação de responsabilidades com as seguintes camadas:

┌─────────────────────────────────────────────────────┐
│                 Presentation Layer                  │
│          (React Native + Expo Router)               │
├─────────────────────────────────────────────────────┤
│                   Services Layer                    │
│      (Firebase Auth, Firestore, APIs)              │
├─────────────────────────────────────────────────────┤
│                   Data Layer                        │
│         (Firestore, Local Storage)                  │
├─────────────────────────────────────────────────────┤
│                   State Layer                       │
│              (Context API, Hooks)                   │
└─────────────────────────────────────────────────────┘

---

## 🎯 Fluxo de Navegação

```
Auth Stack → Tabs Stack → Detail Stack

Login/Registro → Home
              → Concursos → Detalhe Concurso
              → Disciplinas → Detalhe Disciplina
              → Flashcards → Detalhe Flashcard → Revisão → Swipe Review
              → Estatísticas
              → Perfil
```

---

## 🎯 Próximas Melhorias

- Notificações push para lembretes de estudo
- Modo dark/light
- Importação/exportação de flashcards via CSV
- Sistema de metas e streak diário
- Ranking entre usuários
- Reconhecimento de voz para flashcards
- Widgets para Android/iOS

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

## 👨‍💻 Autor

**Matheus Pereira**
- [GitHub](https://github.com/matheusgit1)
- [LinkedIn](https://www.linkedin.com/in/matheus-ap/)

---

## 🙏 Agradecimentos

Inspirado nos melhores apps de flashcards como Anki e Quizlet.

Dados do concurso MPES 2026 gentilmente fornecidos pelo autor.

---

**FlashConcurseiro** - Estude de forma inteligente, revise com eficiência. 🚀