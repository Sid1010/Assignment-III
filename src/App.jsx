const Products = [];

class Table extends React.Component {
    render() {
        const productRows = this.props.products.map(product => <TableRow key={product.id} product={product}/>);
        return (
            <table className="Table">
                <thead align="left">
                    <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {productRows}
                </tbody>
            </table>
        )
    }
}

class TableRow extends React.Component {
    render() {
        const prd = this.props.product;
        return(
            <tr>
                <td>{prd.Name}</td>
                <td>${prd.Price}</td>
                <td>{prd.Category}</td>
                <td><a href={prd.Image} target="_blank">View</a></td>
            </tr>
        )
    }
}

class ProductAdd extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.productAdd;
        var price = form.prdPrice.value;
        price = price.slice(1);
        const prd = {Name: form.prdName.value, Price: price, Category: form.productCategory.value, Image: form.prdImg.value};
        this.props.createProduct(prd);
        form.prdName.value="";   
        form.prdPrice.value="$";
        form.prdImg.value="";
    }

    render() {
        return (
            <div>
                <form name="productAdd" className="formAdd" onSubmit={this.handleSubmit}>
                    <div>
                        <p>
                            <label>Category<br/>
                            <select id="productCategory" name="Category">
                                <option value="shirts">Shirts</option>
                                <option value="jeans">Jeans</option>
                                <option value="jackets">Jackets</option>
                                <option value="sweaters">Sweaters</option>
                                <option value="accessories">Accessories</option>
                            </select></label>
                        </p>
                        <p>
                            <label>Price Per Unit<br/> 
                            <input type="text" name="prdPrice" defaultValue="$"/></label>
                        </p>
                        <p>
                            <input type="submit" id="btnAdd" value="Add Product"></input>
                        </p>
                    </div>
                    <div>
                        <p>
                            <label>Product Name<br/> 
                            <input type="text" name="prdName"/></label>
                        </p>
                        <p>
                            <label>Image URL<br/> 
                            <input type="text" name="prdImg"/></label>
                        </p>
                    </div>
                </form>
            </div>
        )
    }
}

class ProductList extends React.Component {
    constructor() {
        super();
        this.state = {products:[]}
        this.createProduct = this.createProduct.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }
    
    async loadData() {
        const query = `query{
            productList{
                id Name Price Image Category
            }
        }`;

        const response = await fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        const result = await response.json();
        this.setState({ products: result.data.productList })
    }

    async createProduct(newProduct) {
        const newProducts = this.state.products.slice();
        newProduct.id = this.state.products.length + 1;
        newProducts.push(newProduct);
        this.setState({ products: newProducts });
        const query = `mutation {
            productAdd(product:{
              Name: "${newProduct.Name}",
              Price: ${newProduct.Price},
              Category: ${newProduct.Category},
              Image: "${newProduct.Image}"
            }) {
              id
            }
          }`;
        const response = await fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        this.loadData();
    }

    render() {
        return (
            <div id="mainDiv">
                <h1>My Company Inventory</h1>
                Showing all available products
                <hr/><br/>
                <Table products={this.state.products}/><br/>
                Add a new product to inventory
                <hr/>
                <ProductAdd createProduct={this.createProduct}/>
            </div>
        )
    }   
}
const element = <ProductList />;
ReactDOM.render(element, document.getElementById('sectionA'));