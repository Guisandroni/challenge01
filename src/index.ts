import * as fs from 'fs';



interface Product {
    id: number;
    title: string;
    supermarket: string;
    price: number;
}

interface CategorizedProduct {
    category: string;
    count: number;
    products: {
        title: string;
        supermarket: string;
    }[];
}

function normalizeItems(str: string): string {
    //normalização do conteudo do json
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 0)
        .sort()
        .join(' ');
}

function ProductTitle(title: string): string {
    // padronização dos items
    title = title
        .replace(/\b(1l|1litro|1000ml)\b/gi, '1L')
        .replace(/\b(500g|500gramas)\b/gi, '500g')
        .replace(/\b(5kg|5quilos)\b/gi, '5kg')
        .replace(/\b(900ml)\b/gi, '900ml')
        .replace(/\b(1kg|1quilo|1000g)\b/gi, '1kg');
    // tipos de produtos
    title = title
        .replace(/\b(zero lactose|sem lactose)\b/gi, 'Zero Lactose')
        .replace(/\b(tipo 1)\b/gi, 'Tipo 1')
        .replace(/\b(fresco|congelado)\b/gi, '')
        .replace(/\b(patinho)\b/gi, 'Patinho');

    return title;
}


function categorizeProducts(products: Product[]): CategorizedProduct[] {
    //armazena as categorias
    const categories = new Map<string, CategorizedProduct>();

    for (const product of products) {
        // padronização dos itens
       
        const normalizedTitle = normalizeItems(product.title);
       //comparação
        const normalizedKey = ProductTitle(normalizedTitle);

        if (!categories.has(normalizedKey)) {
            //criar uma nova categoria
            categories.set(normalizedKey, {
                category: normalizedTitle,
                count: 0,
                products: []
            });
        }

        const category = categories.get(normalizedKey)!;
        category.count++;
        category.products.push({
            title: product.title,
            supermarket: product.supermarket
        });
    }

    return Array.from(categories.values());
}

const results = './results';
if (!fs.existsSync(results)) {
    fs.mkdirSync(results);
}

const jsonData = JSON.parse(fs.readFileSync('./data01.json', 'utf-8'));
const categorizedProducts = categorizeProducts(jsonData);

fs.writeFileSync(
    `${results}/produtos_categorizados.json`,
    JSON.stringify(categorizedProducts, null, 2)
);

console.log('Produtos categorizados com sucesso! Acesse a pasta results');
