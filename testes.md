# 📋 Casos de Teste Críticos — Livraria Caamano Foscarini

Este documento apresenta os **10 principais casos de teste** identificados como **pontos críticos** para o funcionamento adequado do site da Livraria Caamano Foscarini. Os testes foram definidos com base na usabilidade, nas funcionalidades centrais e na experiência do usuário.

## ✅ Resumo dos Casos de Teste Críticos

| ID       | Funcionalidade            | Descrição do Teste                                              | Entradas (se aplicável) | Passos                                                         | Resultado Esperado                                            |
|----------|---------------------------|------------------------------------------------------------------|--------------------------|----------------------------------------------------------------|----------------------------------------------------------------|
| **CT-01** | Menu de Navegação         | Verificar se os links principais funcionam corretamente          | N/A                      | Clicar em cada item do menu (Livros, Eventos, Agenda, etc.)    | Links direcionam corretamente às seções ou páginas associadas |
| **CT-02** | Link “Quem Somos”         | Verificar redirecionamento para a página "Quem somos"           | N/A                      | Clicar no link “Quem somos” no menu                            | Abre a página `quemsomos.html`                                |
| **CT-03** | Link “Contato”            | Verificar redirecionamento para a página de contato             | N/A                      | Clicar no link “Contato” no menu                               | Abre a página `contato.html`                                  |
| **CT-04** | Carrinho de Compras       | Verificar se o ícone do carrinho responde a interações          | N/A                      | Clicar no ícone de carrinho no topo direito                    | Modal ou página de carrinho é exibida                         |
| **CT-05** | Ícone de Pesquisa         | Verificar ativação da função de busca                           | N/A                      | Clicar no ícone de lupa                                        | Campo de busca aparece ou redireciona para página de pesquisa |
| **CT-06** | Carrossel de Livros (API) | Verificar se os livros são carregados corretamente via API       | N/A                      | Acessar a página inicial e observar o carrossel                | Livros são exibidos com imagem, título, autor e preço         |
| **CT-07** | Botão “Mais livros”       | Verificar se novos livros são carregados ao clicar               | N/A                      | Clicar no botão “Mais livros” abaixo do carrossel              | Novos livros são adicionados ao carrossel                     |
| **CT-08** | Agenda (iframe externo)   | Verificar carregamento do calendário TeamUp                      | N/A                      | Acessar seção “Agende-se”                                      | Calendário aparece corretamente no iframe                     |
| **CT-09** | Newsletter (formulário)   | Verificar validação do campo de email no rodapé                 | Ex: `teste@email.com`    | Preencher e clicar em “Assinar”                               | Email é validado e processo de envio é iniciado               |
| **CT-10** | Responsividade Mobile     | Verificar layout em dispositivos móveis                         | N/A                      | Abrir o site em resolução de celular                           | Layout continua organizado e funcional                        |

---

## 🛠️ Observações

- Os testes focam nas **principais interações esperadas** pelo usuário.
- Algumas funcionalidades (como carrinho e busca) **ainda não estão totalmente implementadas** no código fornecido, mas estão incluídas para garantir cobertura futura e validar a estrutura do layout.
- Recomenda-se a automação futura dos testes com ferramentas como **Cypress** ou **Playwright**, além de validações com Lighthouse.