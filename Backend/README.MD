## RN(REGRAS DE NEGÓCIO)

- [x] Gerar um arquivo CSV contendo código(id) do produto e o novo preço que será carregado(atualizado).
- [x] O preço de venda não pode ser inferior ao custo deles;
- [x] O reajuste não pode ser maior ou menor do que 10% do preço atual do produto;
- [x] Ao reajustar o preço de um pacote de itens, cada item do pacote deve ter seu preço unitário reajustado de acordo com o valor total do pacote.
- [x] Não deve ser possível atualizar itens que não obedecem a regra acima.

## RF(REQUISITOS FUNCIONAIS)
- [] - O sistema deve ter um back end (node.js), contendo as todas as regras definidas e um front-end (React.js) que será utilizado pelo usuário da ferramenta
- [x] - Você deve escrever seu código em Javascript ou TypeScript (preferencialmente)
- [x] - O banco de dados deve ser MySQL (versão 5 ou 8)
- [x] - O sistema deve permitir que o usuário carregue o arquivo de precificação
- [] - O sistema deve ter um botão chamado VALIDAR.
- [] - Ao clicar em VALIDAR, o sistema deve ler todo o arquivo e fazer as seguintes verificações:
	- [] - Todos os campos necessários existem?
	- [] - Os códigos de produtos informados existem?
	- [] - Os códigos de produtos informados existem?
	- [] - O arquivo respeita as regras levantadas na seção CENÁRIO?
- [] - Ao final da validação o sistema deve exibir as seguintes informações dos produtos que foram enviados
	- Código, Nome, Preço atual, Novo preço.
- [] - Caso uma ou mais regras de validação tenham sido quebradas, o sistema também deve exibir ao lado de cada produto qual regra foi quebrada.
- [] - O sistema também deve ter um botão ATUALIZAR. Que só ficará habilitado se todos os produtos dos arquivos estiverem validados e sem regras quebradas
- [] - Ao clica em ATUALIZAR, o sistema deve salvar o novo preço no banco de dados e já deixar a tela pronta para o envio de um novo arquivo.
- [] - O preço de custo dos pacotes também deve ser atualizado como a soma dos custos dos seus componentes. Os preço de custo dos produtos que não são pacotes não deve ser atualizado.