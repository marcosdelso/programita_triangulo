const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const xlsx = require('xlsx'); // Paquete para trabajar con Excel
require('chromedriver');

// Inicializa una matriz para almacenar los resultados
let testResults = [];

async function testTriangle(lado1, lado2, lado3, expectedResult) {
    let driver = await new Builder().forBrowser('chrome').build();
    
    try {
        // Abre tu archivo HTML local
        await driver.get('https://marcosdelso.github.io/programita_triangulo/');

        // Encuentra los campos de input y rellénalos
        await driver.findElement(By.id('lado1')).clear();
        await driver.findElement(By.id('lado1')).sendKeys(lado1);
        
        await driver.findElement(By.id('lado2')).clear();
        await driver.findElement(By.id('lado2')).sendKeys(lado2);
        
        await driver.findElement(By.id('lado3')).clear();
        await driver.findElement(By.id('lado3')).sendKeys(lado3);
        
        // Haz clic en el botón para ejecutar la función
        await driver.findElement(By.xpath('//button[text()="Ejecutar"]')).click();

        // Espera hasta que el resultado aparezca
        let result = await driver.wait(until.elementLocated(By.id('tipo-triangulo')), 1000).getText();
        
        // Verifica el resultado
        const status = result === expectedResult ? 'Pasado' : 'Fallado';
        console.log(`Test ${status} para (${lado1}, ${lado2}, ${lado3})`);

        // Agrega el resultado a la matriz
        testResults.push({
            Lado1: lado1,
            Lado2: lado2,
            Lado3: lado3,
            Resultado_Obtenido: result,
            Resultado_Esperado: expectedResult,
            Estado: status
        });
        
    } finally {
        await driver.quit();
    }
}

async function runTests() {
    await testTriangle(0, 0, 0, "Datos incorrectos");
    await testTriangle(2, 2, 2, "Equilátero");
    await testTriangle(2, 2, 1, "Isósceles");
    await testTriangle(4, 5, 6, "Escaleno");
    await testTriangle(1, 2, 3, "No es triángulo");
    await testTriangle(20, 1, 2, "No es triángulo");
    await testTriangle("", "", "", "Datos incorrectos");
    await testTriangle("a", "b", "c1", "Datos incorrectos");
    await testTriangle(-1, 2, 2, "Datos incorrectos");

    // Después de ejecutar todas las pruebas, guarda los resultados en un archivo Excel
    exportResultsToExcel();
}

function exportResultsToExcel() {
    // Crea una nueva hoja de trabajo con los resultados
    const worksheet = xlsx.utils.json_to_sheet(testResults);

    // Crea un nuevo libro de trabajo y agrega la hoja
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'ResultadosPruebas');

    // Escribe el archivo Excel
    xlsx.writeFile(workbook, 'ResultadosPruebas.xlsx');
    
    console.log("Resultados exportados a 'ResultadosPruebas.xlsx'");
}

// Ejecuta las pruebas
runTests().catch(err => console.log(err));
