<h1>RestAPI - MercadoPoupança</h1>
    <div class="product">
        <h2>/product</h2>
        <p>
            Esta rota encarrega-se de entregar e manipular todos os dados em relação aos produtos e sua relação com as lojas. Só funcionam os métodos: <b>POST</b>, <b>PUT</b> e <b>DELETE</b>, se o request possuir um token junto ao pedido e se este pretencer a um <b>admin</b> da App.
        </p>
        <h3>GET</h3>
        <p>
            Aquando de uma função <b>GET</b>, por definição vai devolver todos os produtos, pode-se um query parâmetro "type", cujo pode ter os valores:<b>name ("que procura pelo nome")</b> e <b>barcode ("que procura pelo nº do código de barras")</b>, order ("para ordernar de ordem decrescente ou pesquisar por mercador"). Quando são fornecidos os parâmetros "name" e "barcode", precisamos de passar um objeto JSON (objeto Javascript) no body da request com o valor do nome ou barcode na Key chamada "productRef". Ao utilizar o parametro order tem de ser passado um query order com valor true(para obter de forma descendente) e tambem pode ser passado o query de market com os valores de (Pingo Doce, Mercadona, Lidl, Aldi, Continente), quando não usado o order vai returnar de ordem acendente e quando nao usado o market vai retornar todos, ao nao utilizar ambos vai retornar o padrao.
        </p>
        <h3>POST</h3>
        <p>
            Numa função POST, tem de ser passado um objeto JSON com as seguintes Keys: <b>productRef ("referência do código de barras")</b>, <b>price ("preço do produto")</b>, <b>productName ("nome do produto")</b>, <b>productImage ("imagem do produto")</b>, <b>productSize ("tamanho do produto")</b> e <b>promo ("para o valor da promoção do produto, quando pode ser 0 caso o produto não tenha promoção")</b>.
        </p>
        <h3>PUT</h3>
        <p>
            Na função PUT, precisa de ser passado um query parâmetro "type", que pode ter os valores: <b>all ("para todos os valores do produto")</b> e <b>price ("para alterar o preço e promoções")</b>. Quando é usado o parâmetro all, procedemos da mesma maneira que no método <b>POST</b>, já que é necessário passar todas as Keys do respetivo produto. Ao usar o parâmetro price, só é necessário passar a Key <b>productRef ("referência do código de barras)</b>, price novo, e promoção, que pode também ter valor 0 caso o produto não possua promoção.
        </p>
        <h3>DELETE</h3>
        <p>
            Aquando da função de <b>DELETE</b>, é apenas necessário passar o parâmetro <b>productRef ("referência do código de barras")</b>.
        </p>
        <p>
        _____________________________________________________________________________________________________________________________
        </p>
        <h2>/user</h2>
        <p>
            A rota <b>/user</b> encarrega-se de tratar e manipular todos os dados em relação aos users/clientes da App. Com esta rota só conseguimos usar os métodos <b>PUT</b> e <b>DELETE</b>, e estes só funcionam se for validado um token no request de cada pedido, e se este mesmo token pertencer a um <b>admin</b> da App ou então se for o token pertencente ao respetivo user.
        </p>
        <h3>GET</h3>
        <p>
            Numa função <b>GET</b>, precisamos de passar um query parâmetro "type", que pode ter os valores de <b>login ("para fazer login ao utilizador")</b> ou <b>userInfo ("para enviar os dados do utilizador")</b>. Quando é usado o parâmetro login, deve ser passado o email e a password do user num objeto com as keys email e password. Na função "userInfo", é necessário o token do respetivo utilizador, para aí ser possível entregar as suas informações pessoais, o que garante uma maior segurança na sua privacidade in-App.
        </p>
        <h3>POST</h3>
        <p>
            A função <b>POST</b> é usada quando o utilizador pertende fazer registo na App, ou seja, criar a sua conta register. Tem de ser passado um objeto com os valores da password, email e nome do utilizador, num objeto com as respetivas keys: password, email, name.
        </p>
        <h3>PUT</h3>
        <p>
            Numa função <b>PUT</b>, é necessário passar um query parâmetro "type", que pode ter os valores de <b>password (para alterar a palavra passe do user)</b>, ou <b>address (para mudar ou adicionar uma nova morada ao user)</b>. Para o user alterar a sua password, é necessário validar o seu mesmo token do e a nova password tem de ser passada num objeto cujo o nome da key é <b>"newPassword"</b>. Para mudar o endereço do user, este tem de passar o seu token e no body, em formato de objeto, as keys: address, phoneNumber e nif.
        </p>
        <h3>DELETE</h3>
        <p>
            Em função <b>DELETE</b>, usada para eliminar um user, tem de ser passado o token do user e este será automaticamente eliminado.
        </p>
        <p>
        _____________________________________________________________________________________________________________________________
        </p>
        <h2>/order</h2>
        <p>
            A rota <b>/order</b> encarrega-se de tratar e manipular todos os dados em relação as encomendas da App. Com esta rota só conseguimos usar os métodos <b>PUT</b> e <b>DELETE</b>, e estes mesmos só funcionam se for validado um token no request de cada pedido, se pertencer a um <b>admin</b> da App, ou então se for o token pertencente ao respetivo user.
        </p>
        <h3>GET</h3>
        <p>
            Na função <b>GET</b>, é necessário passar um token respetivo a um user, que vai entregar o pedido que foi feito pelo mesmo, e somente a si mesmo.
        </p>
        <h3>POST</h3>
        <p>
            A função <b>POST</b> é usada quando o utilizador pretende finalizar a sua encomenda, quando possui o token do respetivo user, e no body do request passa um array de objetos cujos objetos são os produtos. O objeto contém as keys: <b>store (nome da loja)</b> e <b>product (código de barras do produto)</b> e <b>amount (quantidade do produto)</b>.
        </p>
        <h3>PUT</h3>
        <p>
            A função <b>PUT</b>, é usada unicamente para alterar os status da encomenda. Nesta função é necessário passar um query parâmetro "type", que tem o valore de <b>changeOrderStatus (para alterar o status da encomenda)</b>. No body passamos um objeto com as seguintes keys: <b>orderStatus (pode ter valores de "processing", "buying", "delivering", "received" ou "completed")</b>, ou order que deve possuir o "id" da encomenda.
        </p>
        <h3>DELETE</h3>
        <p>
            Quando em função de <b>DELETE</b>, são apenas elimindadas as encomendas que já foram dadas como finalizadas.
        </p>
        <p>
        _____________________________________________________________________________________________________________________________
        </p>
        <h2>/catalog</h2>
        <p>
            A rota <b>/catalog</b> encarrega-se de entregar unicamente os catálogos dos supermercados, ou seja só possui a função <b>GET</b>.
        </p>
        <h3>GET</h3>
        <p>
            Nesta função <b>GET</b>, precisamos de passar um query parâmetro "market", que pode ter os valores de <b>all ("entregar os catálogos de todos os mercados")</b>, ou com apenas o nome de um dos mercados disponíveis, <b>("Mercadona", "Pingo Doce", "Continente", "Aldi", ou "Lidl")</b>. Quando estes parâmetros são usados, recebemos informação de todos os produtos da base de dados ou respetiva loja como retorno do nosso pedido.
        </p>
        <p>
        _____________________________________________________________________________________________________________________________
        </p>
        <h2>/ads</h2>
        <p>
            A rota <b>/ads</b> tem como função entregar unicamente informações sobre anúncios in-app, ou seja, só possui a função <b>GET</b>, e não precisa que seja passado nenhum parâmetro para ser executada.
        </p>
        <p>
        _____________________________________________________________________________________________________________________________
        </p>
        <h2>/verified</h2>
        <p>
            A rota <b>/verified</b> tem como objetivo verificar o email do utilizador e só possui função <b>GET</b>, que deve conter um query parametro "id" com o id do user a ser verificado.
        </p>
        <p>
        _____________________________________________________________________________________________________________________________
        </p>
        <h2>/promo</h2>
        <p>
            A rota <b>/promo</b> tem como função verificar promoções em produtos da base de dados. Para isso ser possível, tem de ser passado um query parametro "code" com o código da promoção do respetivo produto.
        </p>
        <p>
        _____________________________________________________________________________________________________________________________
        </p>
        <h2>/</h2>
        <p>
            A rota <b>/</b> tem como função verificar a conexão com a API, e passado o query parâmetro "withUser", pode ser verificado se o token ainda é válido.
        </p>
    <div>
