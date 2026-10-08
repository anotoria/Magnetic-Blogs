# Criar IA de Voz com Agendas — Setup Completo

## Quando usar esta skill
Ative esta skill sempre que o usuário pedir para:
- "criar uma IA de voz"
- "configurar um agente de voz"
- "montar uma IA de atendimento"
- "criar voice AI para meu negócio"
- Enviar o template genérico de Voice AI (com ou sem placeholders preenchidos)
- Qualquer variação de criação de agente de atendimento telefônico por IA

---

## PASSO 1 — Coletar informações essenciais

Antes de criar qualquer coisa, faça as perguntas abaixo usando o componente `question` (artifact). Agrupe em blocos temáticos para não sobrecarregar o usuário. Use `render_artifact` com `component: "question"` para cada bloco.

### Bloco 1 — Empresa e Atendimento
Perguntas obrigatórias:
1. **Nome da empresa**
2. **Segmento / nicho de atuação** (ex: limpeza, saúde, jurídico, estética...)
3. **Dias e horários de funcionamento** (ex: Seg–Sex 08h–18h)
4. **Área de atendimento** — presencial (qual cidade/região?) ou online (todo Brasil)?
5. **Tom de atendimento** — formal, descontraído, empático ou técnico?
6. **Voz preferida** — feminina ou masculina?

### Bloco 2 — Serviços e Preços
Perguntas obrigatórias:
1. **Quais serviços oferece?** Para cada um: nome, preço e descrição do que inclui
2. **Há diferenças ou regras importantes entre os serviços?** (ex: mínimo de horas, materiais inclusos, etc.)
3. **Políticas gerais** — cancelamento, pagamento, restrições, etc.

### Bloco 3 — Agendamento e Automações
Perguntas obrigatórias:
1. **Quais dados coletar do lead para agendar?** (nome completo é padrão; perguntar se precisa de endereço, e-mail, CPF, etc.)
2. **Enviar confirmação após o agendamento?** Sim/Não — e por qual canal (SMS, e-mail, WhatsApp)?
3. **Há automações adicionais?** (notificar equipe, acionar workflow, mensagem pós-atendimento, etc.)
4. **Já possui número de telefone LC Phone** para vincular à IA?

> Se o usuário já enviou o template genérico preenchido, extraia as respostas diretamente e só pergunte o que estiver faltando.

---

## PASSO 2 — Confirmar e exibir o plano

Após coletar todas as informações, exiba um resumo do que será criado usando `render_artifact` com `component: "approval"`:
- Lista de agendas a criar (uma por serviço)
- Nome e configuração do agente de IA de Voz
- Voz e idioma selecionados
- Ações de agendamento vinculadas
- Automações solicitadas

Aguarde aprovação antes de executar qualquer criação.

---

## PASSO 3 — Criar as Agendas

Para cada serviço informado, crie uma agenda usando:
- **Skill:** `crm-calendars` → sub-skill: `calendars--create-calendar`
- **calendarType:** `event`
- **slotDuration:** 360 (6 horas), `slotDurationUnit`: `"mins"`
- **openHours:** Uma entrada por dia da semana (ex: `[{"daysOfTheWeek": [1], "hours": [...]}, ...]`), **NUNCA** em array com múltiplos dias no mesmo objeto — usar uma entrada por dia
- **NÃO incluir** o campo `timezone` no corpo da requisição (causa erro 422)
- Nomeie cada agenda como: `[Nome do Serviço] — [Nome da Empresa]`
- Crie todas as agendas em **paralelo** (uma única chamada com `requests` array no `web_fetch`)

Após criar, salve os IDs de cada agenda para usar nas ações do agente.

---

## PASSO 4 — Buscar vozes disponíveis

Antes de criar o agente, busque as vozes em PT-BR:
- **Skill:** `crm-voice-ai` → sub-skill: `voice-ai--list-voices`
- Filtre por `language=pt-BR`
- Apresente opções compatíveis com a preferência (feminina/masculina) do usuário
- Sugestões padrão por perfil:
  - Atendimento/suporte: **Beatriz - Support Guide** (feminina)
  - Conversacional: **Carla - For Conversational** (feminina)
  - Narração/autoridade: **Hidalgo - Anchorperson** (masculino)
  - Natural: **Yuri - Natural Conversations** (masculino)

---

## PASSO 5 — Criar o Agente de IA de Voz

Use:
- **Skill:** `crm-voice-ai` → sub-skill: `voice-ai--create-agent`
- **language:** `"pt-BR"`
- **voiceId:** ID da voz selecionada no passo anterior
- **maxCallDuration:** 900 (15 minutos — ajuste se o negócio exigir)
- **patienceLevel:** `"high"`
- **sendUserIdleReminders:** `true`
- **reminderAfterIdleTimeSeconds:** 8
- **NÃO incluir** `locationId` no body (somente via query string)

### Estrutura obrigatória do `agentPrompt`
O prompt deve conter, em português PT-BR, as seguintes seções:

```
## EMPRESA
Nome, segmento, horário de funcionamento, área de atendimento

## REGRAS GERAIS
- Falar sempre em PT-BR
- Ser cordial e profissional
- Nunca inventar informações
- Não oferecer descontos sem autorização
- Confirmar todos os dados antes do agendamento
- Comportamento fora do horário de atendimento

## SERVIÇOS E PREÇOS
Para cada serviço: nome, valor e descrição completa do que inclui

## POLÍTICAS E REGRAS DO NEGÓCIO
Tudo que o usuário informou sobre políticas, materiais, prazos, etc.

## FLUXO DE ATENDIMENTO
Passo 1 — Boas-vindas e identificação da necessidade
Passo 2 — Qualificação (tipo de serviço, área de atendimento)
Passo 3 — Apresentação do serviço e valor
Passo 4 — Proposta de agendamento
Passo 5 — Coleta de dados (todos os campos obrigatórios definidos pelo usuário)
Passo 6 — Confirmação dos dados com o cliente antes de agendar
Passo 7 — Realizar o agendamento usando a ação correspondente ao serviço
Passo 8 — Encerramento com confirmação e agradecimento

## RESPOSTAS PARA SITUAÇÕES ESPECIAIS
- Cliente fora da área de atendimento
- Dúvidas sobre número de profissionais / equipe
- Serviços com valor a combinar (ex: industriais/customizados)
- Cliente sem data definida
```

### `welcomeMessage`
Deve ser uma saudação em PT-BR que:
- Diz o nome da empresa
- Apresenta a IA pelo nome (use o nome da voz selecionada ou um nome genérico como "Assistente virtual")
- Convida o cliente a falar

---

## PASSO 6 — Criar as Ações de Agendamento

Para cada serviço/agenda criada, criar uma ação `APPOINTMENT_BOOKING`:
- **Skill:** `crm-voice-ai` → sub-skill: `voice-ai--create-action`
- **actionType:** `"APPOINTMENT_BOOKING"`
- **calendarActionType:** `"single"`
- **daysOfOfferingDates:** 3
- **slotsPerDay:** 2
- **hoursBetweenSlots:** 1
- **timezoneSelectionMode:** `"AGENT_TIMEZONE"`
- **collectName:** `true`
- **collectAddress:** conforme dados solicitados pelo usuário
- **collectEmail:** conforme dados solicitados pelo usuário
- **collectPhoneNumber:** conforme dados solicitados pelo usuário
- **collectAdditionalNotes:** `true` para serviços com valor a combinar

Crie todas as ações em **paralelo**.

---

## PASSO 7 — Orientações pós-criação (sempre incluir no reply final)

Após criar tudo, informe ao usuário os 3 passos manuais obrigatórios:

1. **Publicar o agente** — Acessar Voice AI → [Nome do Agente] → clicar em Publicar/Ativar
2. **Selecionar o modelo** — No Builder do agente, acessar Configurações e selecionar **Gemini Flash Live Preview**
3. **Vincular número de telefone** — Na aba Deploy → Channels → Phone → Assign phone numbers

Incluir link direto para a página de Voice AI:
`[Acessar Voice AI](/v2/location/{locationId}/ai-agents/voice-ai)`

---

## TEMPLATE GENÉRICO PARA ALUNOS

Quando o usuário pedir o template genérico para distribuir, entregue este texto:

```
Crie uma IA de voz que atenda em português PT-BR, usando o modelo Gemini Flash Live Preview.

A IA será responsável por atender clientes interessados em [DESCREVA O TIPO DE SERVIÇO OU PRODUTO].

━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 DADOS DA EMPRESA
━━━━━━━━━━━━━━━━━━━━━━━━━
Nome da empresa: [NOME DA EMPRESA]
Segmento / Nicho: [EX: Limpeza, Saúde, Educação, Jurídico, etc.]
Horário de atendimento: [EX: Segunda a Sexta, das 08h às 18h]
Região / Área de atendimento: [EX: São Paulo - SP, ou "Atendimento online para todo o Brasil"]

━━━━━━━━━━━━━━━━━━━━━━━━━
💼 SERVIÇOS OFERECIDOS
━━━━━━━━━━━━━━━━━━━━━━━━━
Serviço 1:
- Nome: [EX: Plano Básico]
- Preço: [EX: R$ 150,00]
- Descrição: [O que está incluso neste serviço?]

Serviço 2:
- Nome: [EX: Plano Completo]
- Preço: [EX: R$ 350,00]
- Descrição: [O que está incluso neste serviço?]

[Adicione quantos serviços forem necessários]

━━━━━━━━━━━━━━━━━━━━━━━━━
📋 REGRAS E INFORMAÇÕES IMPORTANTES
━━━━━━━━━━━━━━━━━━━━━━━━━
[Descreva regras, políticas, materiais inclusos, formas de pagamento, etc.]

━━━━━━━━━━━━━━━━━━━━━━━━━
📅 AGENDAMENTO
━━━━━━━━━━━━━━━━━━━━━━━━━
Crie uma agenda separada para cada serviço e vincule à IA de Voz.

Dados a coletar do lead para agendar:
- Nome completo
- [ADICIONE OUTROS CAMPOS: Endereço, E-mail, CPF, etc.]

Após o agendamento, enviar confirmação para o cliente: [SIM / NÃO]
Canal de confirmação: [SMS / E-mail / WhatsApp]

━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 PREFERÊNCIAS DA IA
━━━━━━━━━━━━━━━━━━━━━━━━━
Voz preferida: [feminina / masculina]
Tom de atendimento: [formal / descontraído / técnico / empático]
Automações adicionais: [Descreva ou deixe em branco]
```

---

## Notas técnicas importantes

- **openHours no calendario:** Sempre uma entrada por dia (não agrupar dias no mesmo objeto)
- **timezone:** NÃO incluir no body do POST de calendário (erro 422)
- **locationId no body do PATCH:** NÃO incluir (erro 422) — usar apenas como query string
- **Publicação do agente:** A API não expõe endpoint de publicação — deve ser feita manualmente na UI
- **Modelo Gemini:** Não é configurável via API — selecionar manualmente na UI do Builder
- **Ações paralelas:** Criar todas as ações de APPOINTMENT_BOOKING em paralelo com `requests` array
