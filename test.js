const { Builder, By, until } = require('selenium-webdriver');
const xlsx = require('exceljs');
require('chromedriver');

let testResults = [];

async function testTriangle(lado1, lado2, lado3, expectedResult) {
    let driver = await new Builder().forBrowser('chrome').build();
    
    try {
        await driver.get('https://marcosdelso.github.io/programita_triangulo/');

        await driver.findElement(By.id('lado1')).clear();
        await driver.findElement(By.id('lado1')).sendKeys(lado1);
        
        await driver.findElement(By.id('lado2')).clear();
        await driver.findElement(By.id('lado2')).sendKeys(lado2);
        
        await driver.findElement(By.id('lado3')).clear();
        await driver.findElement(By.id('lado3')).sendKeys(lado3);

        await driver.findElement(By.xpath('//button[text()="Ejecutar"]')).click();

        let result = await driver.wait(until.elementLocated(By.id('tipo-triangulo')), 1000).getText();

        const status = result === expectedResult ? 'Pasado' : 'Fallado';
        console.log(`Test ${status} para (${lado1}, ${lado2}, ${lado3})`);

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

    exportResultsToExcel();
}

async function exportResultsToExcel() {

    const workbook = new xlsx.Workbook();
    const worksheet = workbook.addWorksheet('ResultadosPruebas');

    worksheet.columns = [
        { header: 'Lado1', key: 'Lado1', width: 10 },
        { header: 'Lado2', key: 'Lado2', width: 10 },
        { header: 'Lado3', key: 'Lado3', width: 10 },
        { header: 'Resultado Obtenido', key: 'Resultado_Obtenido', width: 20 },
        { header: 'Resultado Esperado', key: 'Resultado_Esperado', width: 20 },
        { header: 'Estado', key: 'Estado', width: 10 }
    ];

    testResults.forEach(test => {
        const row = worksheet.addRow(test);

        const fillColor = test.Estado === 'Fallado' ? 'DA9694' : 'D8E4BC';

        row.eachCell((cell, colNumber) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: fillColor }
            };
        });
    });

    await workbook.xlsx.writeFile('ResultadosPruebas.xlsx');
    console.log("Resultados exportados a 'ResultadosPruebas.xlsx' con formato de color en toda la fila.");
}

runTests().catch(err => console.log(err));
